import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationInput } from './dto/create-conversation-input.dto';
import { ConversationType, DeliveryState, Prisma } from '@prisma/client';
import {
  ConversationModel,
  MessageUpdatedKind,
  UserSlim,
} from './entity/conversation-response-model';
import { SendMessageInput } from './dto/send-message-input.dto';
import { ListConversationsArgs } from './dto/list-conversation-args.dto';
import { ListMessagesArgs } from './dto/list-messqage-args.dto';
import { MarkReadInput } from './dto/mark-read-input.dto';
import {
  AddReactionInput,
  RemoveReactionInput,
} from './dto/reaction-input.dto';
import { PUB_SUB } from 'src/realtime/pubsub.provider';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import {
  topicMessageAdded,
  topicMessageUpdated,
  topicTypingStarted,
} from './chat.event';

const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

const conversationResponseSelect = {
  id: true,
  title: true,
  type: true,
  createdAt: true,
  updatedAt: true,
  memberships: { select: { user: { select: userSelect } } },
} satisfies Prisma.ConversationSelect;

type ConversationRow = Prisma.ConversationGetPayload<{
  select: typeof conversationResponseSelect;
}>;

const messageBaseSelect = {
  id: true,
  conversationId: true,
  senderId: true,
  type: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  sender: { select: userSelect },
  reactions: {
    select: {
      emoji: true,
      userId: true,
      createdAt: true,
      user: { select: userSelect },
    },
  },
} satisfies Prisma.MessageSelect;

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}
  private async ensureMembers(conversationId: string, userId: string) {
    const membership = await this.prismaService.membership.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      select: {
        user: {
          select: { username: true },
        },
      },
    });
    const username = membership?.user?.username;
    if (!membership)
      throw new ForbiddenException('Not a member of this conversation');

    return username;
  }

  async createConverstaion(
    currentUserId: string,
    input: CreateConversationInput,
  ) {
    const members = Array.from(
      new Set(input.membersId.filter((id) => id !== currentUserId)),
    );
    if (input.type == ConversationType.DM) {
      if (members.length > 1)
        throw new ForbiddenException('DM requires exactly one other member');
      const otherUserId = members[0];
      const dmKey = [currentUserId, otherUserId].sort().join(':');

      const existing = await this.prismaService.conversation.findFirst({
        where: {
          type: ConversationType.DM,
          dmKey,
          memberships: { some: { userId: currentUserId } },
        },
        select: conversationResponseSelect,
      });
      if (existing) {
        return this.mapConversationResponse(existing);
      }
      const created = await this.prismaService.conversation.create({
        data: {
          type: input.type,
          dmKey,
          memberships: {
            create: [{ userId: currentUserId }, { userId: otherUserId }],
          },
        },
        select: conversationResponseSelect,
      });
      return this.mapConversationResponse(created);
    } else {
      const created = await this.prismaService.conversation.create({
        data: {
          type: input.type,
          title: input.title,
          memberships: {
            create: [
              ...members.map((member) => ({ userId: member })),
              { userId: currentUserId },
            ],
          },
        },
        select: conversationResponseSelect,
      });
      return this.mapConversationResponse(created);
    }
  }

  async listConversations(currentUserId: string, args: ListConversationsArgs) {
    // Simple cursor by id (stable enough for demo). Order newest updated first.

    const take = args.take ?? 20;
    const where: Prisma.ConversationWhereInput = {
      memberships: { some: { userId: currentUserId } },
    };

    const items = await this.prismaService.conversation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: take + 1,
      ...(args.cursor ? { skip: 1, cursor: { id: args.cursor } } : {}),
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        memberships: {
          select: { user: { select: userSelect } },
        },
      },
    });

    const hasNextPage = items.length > take;
    const pageItems = hasNextPage ? items.slice(0, -1) : items;

    const mapped = pageItems.map((c) => ({
      id: c.id,
      title: c.title ?? undefined,
      type: c.type,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      participants: c.memberships.map((m) => m.user),
    }));

    return {
      items: mapped,
      pageInfo: {
        hasNextPage,
        nextCursor: hasNextPage
          ? pageItems[pageItems.length - 1].id
          : undefined,
      },
    };
  }

  private mapConversationResponse(row: ConversationRow): ConversationModel {
    return {
      id: row.id,
      title: row.title ?? undefined,
      type: row.type,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      participants: row.memberships.map((m) => m.user) as unknown as UserSlim[],
    };
  }

  async sendMessage(currentUserId: string, input: SendMessageInput) {
    await this.ensureMembers(input.conversationId, currentUserId);

    const created = await this.prismaService.message.create({
      data: {
        conversationId: input.conversationId,
        senderId: currentUserId,
        type: input.type,
        content: input.content,
        replyToId: input.replyToId,
      },
      select: messageBaseSelect,
    });

    await this.prismaService.conversation.update({
      where: { id: input.conversationId },
      data: { updatedAt: new Date() },
    });

    const members = await this.prismaService.membership.findMany({
      where: { conversationId: input.conversationId },
      select: { userId: true },
    });
    const now = new Date();
    await this.prismaService.messageStatus.createMany({
      data: members.map((m) => ({
        messageId: created.id,
        userId: m.userId,
        state:
          m.userId === currentUserId ? DeliveryState.SENT : DeliveryState.SENT,
        sentAt: now,
      })),
      skipDuplicates: true,
    });

    await this.pubSub.publish(topicMessageAdded(input.conversationId), {
      messageAdded: {
        ...created,
        createdAt: new Date(created.createdAt ?? Date.now()),
        updatedAt: new Date(created.updatedAt ?? Date.now()),
      },
    });

    return created;
  }

  async listMessages(currentUserId: string, args: ListMessagesArgs) {
    await this.ensureMembers(args.conversationId, currentUserId);
    const take = args.take ?? 30;

    const items = await this.prismaService.message.findMany({
      where: { conversationId: args.conversationId },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(args.cursor ? { skip: 1, cursor: { id: args.cursor } } : {}),
      select: messageBaseSelect,
    });

    const hasNextPage = items.length > take;
    const pageItems = hasNextPage ? items.slice(0, -1) : items;

    return {
      items: pageItems,
      pageInfo: {
        hasNextPage,
        nextCursor: hasNextPage
          ? pageItems[pageItems.length - 1].id
          : undefined,
      },
    };
  }

  async markRead(currentUserId: string, input: MarkReadInput) {
    await this.ensureMembers(input.conversationId, currentUserId);
    const lastMsg = await this.prismaService.message.findFirst({
      where: { id: input.messageId, conversationId: input.conversationId },
      select: { id: true, createdAt: true },
    });
    if (!lastMsg) throw new NotFoundException('Message not found');

    // Update membership lastReadAt
    await this.prismaService.membership.update({
      where: {
        conversationId_userId: {
          conversationId: input.conversationId,
          userId: currentUserId,
        },
      },
      data: { lastReadAt: lastMsg.createdAt },
    });

    // Mark all statuses up to this message as READ for the current user
    await this.prismaService.messageStatus.updateMany({
      where: {
        userId: currentUserId,
        message: {
          conversationId: input.conversationId,
          createdAt: { lte: lastMsg.createdAt },
        },
      },
      data: { state: DeliveryState.READ, readAt: new Date() },
    });

    await this.pubSub.publish(topicMessageUpdated(input.conversationId), {
      messageUpdated: {
        conversationId: input.conversationId,
        kind: MessageUpdatedKind.READ,
        messageId: input.messageId,
        userId: currentUserId,
      },
    });

    return true;
  }
  async addReaction(currentUserId: string, input: AddReactionInput) {
    // ensure message exists & user is member
    const msg = await this.prismaService.message.findUnique({
      where: { id: input.messageId },
      select: { id: true, conversationId: true },
    });
    if (!msg) throw new NotFoundException('Message not found');
    await this.ensureMembers(msg.conversationId, currentUserId);

    const created = await this.prismaService.reaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId: input.messageId,
          userId: currentUserId,
          emoji: input.emoji,
        },
      },
      update: {}, // idempotent
      create: {
        messageId: input.messageId,
        userId: currentUserId,
        emoji: input.emoji,
      },
      select: {
        emoji: true,
        userId: true,
        createdAt: true,
        user: { select: userSelect },
      },
    });

    await this.pubSub.publish(topicMessageUpdated(msg.conversationId), {
      messageUpdated: {
        conversationId: msg.conversationId,
        kind: MessageUpdatedKind.REACTION_ADDED,
        messageId: msg.conversationId,
        userId: currentUserId,
        emoji: created.emoji,
      },
    });
    return created;
  }

  async removeReaction(currentUserId: string, input: RemoveReactionInput) {
    const msg = await this.prismaService.message.findUnique({
      where: { id: input.messageId },
      select: { id: true, conversationId: true },
    });
    if (!msg) throw new NotFoundException('Message not found');
    await this.ensureMembers(msg.conversationId, currentUserId);

    await this.prismaService.reaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId: input.messageId,
          userId: currentUserId,
          emoji: input.emoji,
        },
      },
    });
    await this.pubSub.publish(topicMessageUpdated(msg.conversationId), {
      messageUpdated: {
        conversationId: msg.conversationId,
        kind: MessageUpdatedKind.REACTION_ADDED,
        messageId: msg.conversationId,
        userId: currentUserId,
        emoji: input.emoji,
      },
    });
    return true;
  }

  async typingStarted(conversationId: string, userId: string) {
    const username = await this.ensureMembers(conversationId, userId);
    await this.pubSub.publish(topicTypingStarted(conversationId), {
      typingStarted: {
        conversationId,
        userId,
        username,
        at: new Date(),
      },
    });
    return true;
  }
}

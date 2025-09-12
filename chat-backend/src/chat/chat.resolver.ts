import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GQLAuthGuards } from 'src/auth/guards/gql-auth.guard';
import { CreateConversationInput } from './dto/create-conversation-input.dto';
import { ChatService } from './chat.service';
import {
  ConversationModel,
  MessageUpdated,
  TypingPayload,
} from './entity/conversation-response-model';
import { SendMessageInput } from './dto/send-message-input.dto';
import { MessageModel } from './entity/message-response.model';
import { ListConversationsArgs } from './dto/list-conversation-args.dto';
import { ListMessagesArgs } from './dto/list-messqage-args.dto';
import { MarkReadInput } from './dto/mark-read-input.dto';
import {
  AddReactionInput,
  RemoveReactionInput,
} from './dto/reaction-input.dto';
import { ConversationPage, MessagePage } from './entity/page-model';
import { ReactionModel } from './entity/reaction-response-model';
import { PUB_SUB } from 'src/realtime/pubsub.provider';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import {
  topicMessageAdded,
  topicMessageUpdated,
  topicTypingStarted,
} from './chat.event';

@Resolver()
@UseGuards(GQLAuthGuards)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Mutation(() => ConversationModel)
  createConversation(
    @CurrentUser() user: { userId: string },
    @Args('input') input: CreateConversationInput,
  ) {
    return this.chatService.createConverstaion(user.userId, input);
  }

  @Query(() => ConversationPage)
  listConversations(
    @CurrentUser() user: { userId: string },
    @Args('args', { type: () => ListConversationsArgs, nullable: true })
    args?: ListConversationsArgs,
  ) {
    return this.chatService.listConversations(
      user.userId,
      args ?? { take: 20 },
    );
  }

  // Messages
  @Subscription(() => MessageModel, {
    filter: (payload: any, variables: { conversationId: string }) =>
      payload?.messageAdded?.conversationId === variables?.conversationId,
    resolve: (payload) => {
      const m = payload.messageAdded;
      return {
        ...m,
        createdAt:
          m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt),
        updatedAt:
          m.updatedAt instanceof Date ? m.updatedAt : new Date(m.updatedAt),
      };
    },
  })
  messageAdded(
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ) {
    return this.pubSub.asyncIterator(topicMessageAdded(conversationId));
  }

  @Mutation(() => MessageModel)
  sendMessage(
    @CurrentUser() user: { userId: string },
    @Args('input') input: SendMessageInput,
  ) {
    return this.chatService.sendMessage(user.userId, input);
  }

  @Query(() => MessagePage)
  listMessages(
    @CurrentUser() user: { userId: string },
    @Args('args') args: ListMessagesArgs,
  ) {
    return this.chatService.listMessages(user.userId, args);
  }

  @Mutation(() => Boolean)
  markRead(
    @CurrentUser() user: { userId: string },
    @Args('input') input: MarkReadInput,
  ) {
    return this.chatService.markRead(user.userId, input);
  }

  @Mutation(() => ReactionModel)
  addReaction(
    @CurrentUser() user: { userId: string },
    @Args('input') input: AddReactionInput,
  ) {
    return this.chatService.addReaction(user.userId, input);
  }

  @Mutation(() => Boolean)
  removeReaction(
    @CurrentUser() user: { userId: string },
    @Args('input') input: RemoveReactionInput,
  ) {
    return this.chatService.removeReaction(user.userId, input);
  }

  @Subscription(() => MessageUpdated, {
    filter: (payload: any, variables: { conversationId: string }) =>
      !!payload?.messageUpdated && !!variables?.conversationId,
    resolve: (payload) => payload.messageUpdated,
  })
  messageUpdated(
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ) {
    return this.pubSub.asyncIterator(topicMessageUpdated(conversationId));
  }

  @Subscription(() => TypingPayload, {
    filter: (payload: any, variables: { conversationId: string }) =>
      !!payload?.typingStarted && !!variables?.conversationId,
    resolve: (payload) => payload.typingStarted,
  })
  typingStarted(
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ) {
    return this.pubSub.asyncIterator(topicTypingStarted(conversationId));
  }

  @Mutation(() => Boolean)
  async sendTyping(
    @CurrentUser() user: { userId: string },
    @Args('conversationId', { type: () => ID }) conversationId: string,
  ) {
    return this.chatService.typingStarted(conversationId, user.userId);
  }
}

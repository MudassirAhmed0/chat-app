import {
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
  registerEnumType,
} from '@nestjs/graphql';
import { ConversationType } from '@prisma/client';

registerEnumType(ConversationType, {
  name: 'ConversationType',
  description: 'Conversation type (DM or GROUP)',
});

@ObjectType('UserSlim')
export class UserSlim {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;
}

@ObjectType('Conversation')
export class ConversationModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => ConversationType)
  type!: ConversationType;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => [UserSlim])
  participants!: UserSlim[];
}

export enum MessageUpdatedKind {
  READ = 'READ',
  REACTION_ADDED = 'REACTION_ADDED',
  REACTION_REMOVED = 'REACTION_REMOVED',
}

registerEnumType(MessageUpdatedKind, { name: 'MessageUpdatedKind' });

@ObjectType()
export class MessageUpdated {
  @Field(() => ID)
  converstaionId!: string;
  @Field(() => ID)
  messageId!: string;
  @Field(() => MessageUpdatedKind)
  kind!: MessageUpdatedKind;
  @Field(() => String, { nullable: true })
  emoji?: string;
  @Field(() => String, { nullable: true })
  userId?: string;
}

@ObjectType()
export class TypingPayload {
  @Field(() => ID) conversationId!: string;
  @Field(() => ID) userId!: string;
  @Field(() => Date) at!: Date;
}

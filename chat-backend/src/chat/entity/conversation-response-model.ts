// conversation.model.ts
import {
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
  registerEnumType,
} from '@nestjs/graphql';
import { ConversationType } from '@prisma/client';

// If you haven't already done this elsewhere:
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

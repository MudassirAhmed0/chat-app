import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { MessageType as PrismaMessageType } from '@prisma/client';
import { UserModel } from 'src/users/entities/user.model';
import { ReactionModel } from './reaction-response-model';

registerEnumType(PrismaMessageType, { name: 'MessageType' });
@ObjectType()
export class MessageModel {
  @Field(() => ID) id!: string;
  @Field(() => String) conversationId!: string;
  @Field(() => String) senderId!: string;
  @Field(() => PrismaMessageType) type!: PrismaMessageType;
  @Field(() => String) content!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => GraphQLISODateTime) updatedAt!: Date;
  @Field({ nullable: true }) clientRequestId?: string;
  @Field(() => UserModel) sender!: UserModel;
  @Field(() => [ReactionModel]) reactions!: ReactionModel[];
}

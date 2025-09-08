import { Field, ObjectType } from '@nestjs/graphql';
import { ConversationModel } from './conversation-response-model';
import { MessageModel } from './message-response.model';

@ObjectType()
export class PageInfo {
  @Field({ nullable: true }) nextCursor?: string;
  @Field() hasNextPage!: boolean;
}

@ObjectType()
export class ConversationPage {
  @Field(() => [ConversationModel]) items!: ConversationModel[];
  @Field(() => PageInfo) pageInfo!: PageInfo;
}

@ObjectType()
export class MessagePage {
  @Field(() => [MessageModel]) items!: MessageModel[];
  @Field(() => PageInfo) pageInfo!: PageInfo;
}

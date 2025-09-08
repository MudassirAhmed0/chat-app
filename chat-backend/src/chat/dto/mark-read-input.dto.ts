import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class MarkReadInput {
  @Field(() => ID) conversationId!: string;
  @Field(() => ID) messageId!: string; // last read message id
}

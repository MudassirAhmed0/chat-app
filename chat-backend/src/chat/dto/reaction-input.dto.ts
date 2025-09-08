import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class AddReactionInput {
  @Field(() => ID) messageId!: string;
  @Field(() => String) emoji!: string; // keep free-form (👍, ❤️, :custom:)
}

@InputType()
export class RemoveReactionInput {
  @Field(() => ID) messageId!: string;
  @Field(() => String) emoji!: string;
}

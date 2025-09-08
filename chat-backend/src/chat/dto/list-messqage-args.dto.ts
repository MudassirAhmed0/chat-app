import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';

@InputType()
export class ListMessagesArgs {
  @Field(() => ID) conversationId!: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  cursor?: string;
  @Field(() => Int, { defaultValue: 30 })
  @Min(1)
  @Max(100)
  take: number = 30;
}

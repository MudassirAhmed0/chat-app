import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';

@InputType()
export class ListConversationsArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  cursor?: string;

  @Field(() => Int, { defaultValue: 20 })
  @Min(1)
  @Max(100)
  take: number = 20;
}

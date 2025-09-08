import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { ConversationType } from '@prisma/client';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

registerEnumType(ConversationType, {
  name: 'ConversationType',
  description: 'Conversation type ( DM, GROUP)',
});

@InputType()
export class CreateConversationInput {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field(() => ConversationType)
  @IsEnum(ConversationType)
  type: ConversationType;

  @Field(() => [ID])
  @IsArray()
  membersId!: string[];
}

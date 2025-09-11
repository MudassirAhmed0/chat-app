import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { MessageType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

registerEnumType(MessageType, {
  name: 'MessageType',
  description: 'Message types ( TEXT, IMAGE, SYSTEM)',
});

@InputType()
export class SendMessageInput {
  @Field(() => ID) @IsString() conversationId!: string;
  @Field(() => MessageType, { defaultValue: MessageType.TEXT })
  @IsEnum(MessageType)
  type: MessageType = MessageType.TEXT;
  @Field(() => String)
  @IsString()
  content!: string;
  @Field(() => ID, { nullable: true })
  @IsOptional()
  replyToId?: string;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsStrongPassword()
  password!: string;

  @Field()
  @IsNotEmpty()
  username!: string;

  @Field({ nullable: true })
  name?: string;
}

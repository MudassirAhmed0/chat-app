import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { MessageType } from '@prisma/client';
import { UserModel } from 'src/users/entities/user.model';

@ObjectType()
export class ReactionModel {
  @Field(() => String) emoji!: string;
  @Field(() => ID) userId!: string;
  @Field(() => Date) createdAt!: Date;

  @Field(() => UserModel) user!: UserModel;
}

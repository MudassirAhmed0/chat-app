import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Health {
  @Field(() => Boolean)
  ok!: boolean;

  @Field(() => Number)
  uptime!: number;

  @Field(() => String)
  env!: string;
}

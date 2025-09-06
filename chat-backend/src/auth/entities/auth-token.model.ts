import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthTokenModel {
  @Field() accessToken!: string;
  @Field() refreshToken!: string;
}

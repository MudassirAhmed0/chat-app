import { Field, ObjectType } from '@nestjs/graphql';

export type JwtPayload = {
  sub: string;
  email: string;
};

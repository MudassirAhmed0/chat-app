import { Args, Mutation, ObjectType, Field, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlRefreshGuard } from './guards/gql-refresh.guard';
import { UserModel } from '../users/entities/user.model';
import { AuthTokenModel } from './entities/auth-token.model';
import { GQLAuthGuards } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ObjectType()
class AuthPayload {
  @Field(() => UserModel) user!: UserModel;
  @Field(() => AuthTokenModel) tokens!: AuthTokenModel;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: CreateUserInput): Promise<AuthPayload> {
    return this.auth.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.auth.login(input);
  }

  @Mutation(() => AuthTokenModel)
  @UseGuards(GqlRefreshGuard)
  async refreshTokens(@CurrentUser() user: { userId: string; email: string }) {
    return this.auth.refresh(user.userId, user.email);
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLAuthGuards)
  async logout(@CurrentUser() user: { userId: string }) {
    return this.auth.logout(user.userId);
  }
}

import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './entities/user.model';
import { GQLAuthGuards } from 'src/auth/guards/gql-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver(() => UserModel)
@UseGuards(GQLAuthGuards)
export class UsersResolver {
  constructor(
    private readonly users: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  @Query(() => [UserModel])
  async searchUsers(@Args('term') term: string): Promise<UserModel[]> {
    const t = term.trim();
    if (!t) return [];
    const res = await this.prismaService.user.findMany({
      where: {
        OR: [
          { username: { contains: t, mode: 'insensitive' } },
          { email: { contains: t, mode: 'insensitive' } },
          { name: { contains: t, mode: 'insensitive' } },
        ],
      },
      take: 20,
      orderBy: { username: 'asc' },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res as unknown as UserModel[];
  }
}

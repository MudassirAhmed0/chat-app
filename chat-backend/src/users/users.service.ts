import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where,
    });
  }
  async findMany() {}
  async createUser(data: CreateUserInput) {
    const hashed = await argon2.hash(data?.password);
    return this.prismaService.user.create({
      data: {
        email: data.email,
        passwordHash: hashed,
        username: data.username,
        name: data.name,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async verifyPassword(hash: string, password: string) {
    return await argon2.verify(hash, password);
  }
  async verifyRefreshToken(
    hash: string | null | undefined,
    refreshToken: string,
  ) {
    if (!hash) return false;
    return await argon2.verify(hash, refreshToken);
  }
  async setRefreshToken(userId: string, refreshToken: string | null) {
    const refreshTokenHash = refreshToken
      ? await argon2.hash(refreshToken)
      : null;
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
      select: { id: true },
    });
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/login.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(data: CreateUserInput) {
    const user = await this.usersService.createUser(data);
    const tokens = await this.issueTokens(user.id, user.email);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }
  async login(data: LoginInput) {
    const user = await this.usersService.findOne({ email: data?.email });

    const ok = await this.usersService.verifyPassword(
      user.passwordHash,
      data.password,
    );
    if (!ok) throw new UnauthorizedException('Invalid Credentials');

    const tokens = await this.issueTokens(user.id, user.email);
    await this.usersService.setRefreshToken(user.id, tokens.refreshToken);
    return { user, tokens };
  }
  async logout(userId: string) {
    await this.usersService.setRefreshToken(userId, null);
    return true;
  }
  async refresh(userId: string, email: string) {
    const tokens = await this.issueTokens(userId, email);
    await this.usersService.setRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async issueTokens(sub: string, email: string) {
    const payload = { sub, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    });
    return { accessToken, refreshToken };
  }
}

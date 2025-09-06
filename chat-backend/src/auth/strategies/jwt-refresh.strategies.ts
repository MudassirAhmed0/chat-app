import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../entities/jwt-payload.model';

function fromWsConnectionHeader(req: any) {
  if (req?.headers?.authorization) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        fromWsConnectionHeader,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    // For refresh, we must verify the token matches the hashed one in DB
    const refreshToken = ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      fromWsConnectionHeader,
    ])(req);

    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    const user = await this.users.findOne({ id: payload.sub });
    if (!user) throw new UnauthorizedException('User not found');

    const ok = await this.users.verifyRefreshToken(
      user.refreshTokenHash,
      refreshToken,
    );
    if (!ok) throw new UnauthorizedException('Invalid refresh token');

    return { userId: payload.sub, email: payload.email };
  }
}

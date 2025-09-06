import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategies/jwt.strategies';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategies';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}), // dynamic opts in service
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}

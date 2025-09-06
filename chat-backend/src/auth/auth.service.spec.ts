import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  let users: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            findMany: jest.fn(),
            verifyPassword: jest.fn(),
            verifyRefreshToken: jest.fn(),
            setRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
    users = module.get(UsersService) as any;
  });

  it('issues tokens on login', async () => {
    users.findOne.mockResolvedValue({
      id: 'u1',
      email: 'a@a.com',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
      username: 'hello',
      name: 'fuck you',
      refreshTokenHash: '2322323',
      avatarUrl: 'sadfa',
      lastSeenAt: new Date(),
    });
    users.verifyPassword.mockResolvedValue(true);
    users.setRefreshToken.mockResolvedValue();

    const res = await service.login({ email: 'a@a.com', password: 'secret' });
    expect(res.tokens.accessToken).toBeDefined();
    expect(res.tokens.refreshToken).toBeDefined();
    expect(users.setRefreshToken).toHaveBeenCalled();
  });

  it('refreshes tokens', async () => {
    const res = await service['issueTokens']('u1', 'a@a.com');
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });
});

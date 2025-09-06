import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlRefreshGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req, extra } = ctx.getContext();
    if (req) return req;
    const fakeReq = { headers: {} as Record<string, string> };
    const auth =
      extra?.request?.headers?.authorization ?? extra?.headers?.authorization;
    if (auth) fakeReq.headers['authorization'] = auth;
    return fakeReq;
  }
}

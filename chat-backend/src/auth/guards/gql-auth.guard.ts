import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GQLAuthGuards extends AuthGuard('jwt') {
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

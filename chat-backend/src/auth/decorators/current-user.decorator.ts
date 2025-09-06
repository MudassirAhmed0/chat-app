import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const g = GqlExecutionContext.create(ctx);
    const context = g.getContext();
    // for HTTP:
    if (context?.req?.user) return context.req.user;
    // for WS/graphql-ws:
    if (context?.extra?.user) return context.extra.user;
    return null;
  },
);

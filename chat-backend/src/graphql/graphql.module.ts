import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';

type GqlContext = {
  req?: Request; // undefined for WS subscriptions
  res?: Response; // undefined for WS subscriptions
  extra?: Record<string, unknown>; // WS connection info, etc.
};
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // playground: true,
      graphiql: true,
      introspection: true,
      csrfPrevention: false, // Disable CSRF for development
      subscriptions: {
        'graphql-ws': {
          onConnect: async (ctx) => {
            const auth =
              (ctx.connectionParams?.authorization as string) ||
              (ctx.connectionParams?.Authorization as string);
            if (!auth) throw new Error('Missing Authorization header');
            const [, token] = auth.split(' ');
            if (!token) throw new Error('Invalid Authorization format');
            const jwt = new JwtService();
            const payload = await jwt.verifyAsync(token, {
              secret: process.env.JWT_ACCESS_SECRET,
            });

            (ctx.extra as any).headers = { authorization: auth };
            (ctx.extra as any).user = {
              userId: payload.sub,
              email: payload.email,
            };
          },
        },
      },
      context: ({ req, res, extra }: GqlContext) => {
        return { req, res, extra };
      },
    }),
  ],
})
export class GqlModule {}

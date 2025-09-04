import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
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
      playground: true,
      introspection: true,
      csrfPrevention: false, // Disable CSRF for development
      context: ({ req, res, extra }: GqlContext) => {
        return { req, res, extra };
      },
    }),
  ],
})
export class GqlModule {}

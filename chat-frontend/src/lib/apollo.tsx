import { useAuthStore } from '@/store/auth';
import { InMemoryCache } from '@apollo/client';
import { ApolloClient, split } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { ApolloProvider } from '@apollo/client/react';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { ReactNode, useMemo } from 'react';

const httpUri = process.env.NEXT_PUBLIC_API_URL!;
const wsUri = process.env.NEXT_PUBLIC_WS_URL!;

const makeClient = (getToken: () => string | null) => {
  const httpLink = new HttpLink({ uri: httpUri, credentials: 'include' });

  const authLink = setContext((_, { headers }: { headers?: Record<string, string> }) => {
    const token = getToken();
    return {
      headers: {
        ...(headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });
  const wsLink = new GraphQLWsLink(
    createClient({
      url: wsUri,
      connectionParams: () => {
        const token = getToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  );

  const splitLink =
    wsLink != null
      ? split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return def.kind === 'OperationDefinition' && def.operation === 'subscription';
          },
          wsLink,
          authLink.concat(httpLink),
        )
      : authLink.concat(httpLink);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
    devtools: { enabled: true },
  });
};

const ApolloProviderClient = ({ children }: { children: ReactNode }) => {
  const getToken = useAuthStore((s) => s.getAccessToken);
  const client = useMemo(() => makeClient(getToken), [getToken]);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderClient;

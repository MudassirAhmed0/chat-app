import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Your running GraphQL endpoint (the same URL you use in HttpLink)
  schema: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/graphql',
  documents: ['src/**/*.{ts,tsx,graphql,gql}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    'src/gql/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
      },
    },
  },
};

export default config;

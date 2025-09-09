import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AddReactionInput = {
  emoji: Scalars['String']['input'];
  messageId: Scalars['ID']['input'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  tokens: AuthTokenModel;
  user: UserModel;
};

export type AuthTokenModel = {
  __typename?: 'AuthTokenModel';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  participants: Array<UserSlim>;
  title?: Maybe<Scalars['String']['output']>;
  type: ConversationType;
  updatedAt: Scalars['DateTime']['output'];
};

export type ConversationPage = {
  __typename?: 'ConversationPage';
  items: Array<Conversation>;
  pageInfo: PageInfo;
};

/** Conversation type (DM or GROUP) */
export enum ConversationType {
  Dm = 'DM',
  Group = 'GROUP'
}

export type CreateConversationInput = {
  membersId: Array<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type: ConversationType;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Health = {
  __typename?: 'Health';
  env: Scalars['String']['output'];
  ok: Scalars['Boolean']['output'];
  uptime: Scalars['Float']['output'];
};

export type ListConversationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  take?: Scalars['Int']['input'];
};

export type ListMessagesArgs = {
  conversationId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  take?: Scalars['Int']['input'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MarkReadInput = {
  conversationId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};

export type MessageModel = {
  __typename?: 'MessageModel';
  content: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  reactions: Array<ReactionModel>;
  sender: UserModel;
  senderId: Scalars['String']['output'];
  type: MessageType;
  updatedAt: Scalars['DateTime']['output'];
};

export type MessagePage = {
  __typename?: 'MessagePage';
  items: Array<MessageModel>;
  pageInfo: PageInfo;
};

export enum MessageType {
  Image = 'IMAGE',
  System = 'SYSTEM',
  Text = 'TEXT'
}

export type Mutation = {
  __typename?: 'Mutation';
  addReaction: ReactionModel;
  createConversation: Conversation;
  login: AuthPayload;
  logout: Scalars['Boolean']['output'];
  markRead: Scalars['Boolean']['output'];
  refreshTokens: AuthTokenModel;
  register: AuthPayload;
  removeReaction: Scalars['Boolean']['output'];
  sendMessage: MessageModel;
};


export type MutationAddReactionArgs = {
  input: AddReactionInput;
};


export type MutationCreateConversationArgs = {
  input: CreateConversationInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkReadArgs = {
  input: MarkReadInput;
};


export type MutationRegisterArgs = {
  input: CreateUserInput;
};


export type MutationRemoveReactionArgs = {
  input: RemoveReactionInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  health: Health;
  listConversations: ConversationPage;
  listMessages: MessagePage;
  ping: Scalars['String']['output'];
};


export type QueryListConversationsArgs = {
  args?: InputMaybe<ListConversationsArgs>;
};


export type QueryListMessagesArgs = {
  args: ListMessagesArgs;
};

export type ReactionModel = {
  __typename?: 'ReactionModel';
  createdAt: Scalars['DateTime']['output'];
  emoji: Scalars['String']['output'];
  user: UserModel;
  userId: Scalars['ID']['output'];
};

export type RemoveReactionInput = {
  emoji: Scalars['String']['input'];
  messageId: Scalars['ID']['input'];
};

export type SendMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['ID']['input'];
  replyToId?: InputMaybe<Scalars['ID']['input']>;
  type?: MessageType;
};

export type UserModel = {
  __typename?: 'UserModel';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserSlim = {
  __typename?: 'UserSlim';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type ListQueryVariables = Exact<{ [key: string]: never; }>;


export type ListQuery = { __typename?: 'Query', listConversations: { __typename?: 'ConversationPage', items: Array<{ __typename?: 'Conversation', id: string, type: ConversationType, title?: string | null, updatedAt: any, participants: Array<{ __typename?: 'UserSlim', id: string, username: string }> }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean } } };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', health: { __typename?: 'Health', ok: boolean, uptime: number, env: string } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', user: { __typename?: 'UserModel', id: string, email: string, username: string }, tokens: { __typename?: 'AuthTokenModel', accessToken: string, refreshToken: string } } };

export type RegisterMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', user: { __typename?: 'UserModel', id: string, email: string, username: string }, tokens: { __typename?: 'AuthTokenModel', accessToken: string, refreshToken: string } } };


export const ListDocument = gql`
    query List {
  listConversations {
    items {
      id
      type
      title
      updatedAt
      participants {
        id
        username
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
    `;

/**
 * __useListQuery__
 *
 * To run a query within a React component, call `useListQuery` and pass it any options that fit your needs.
 * When your component renders, `useListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListQuery({
 *   variables: {
 *   },
 * });
 */
export function useListQuery(baseOptions?: Apollo.QueryHookOptions<ListQuery, ListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListQuery, ListQueryVariables>(ListDocument, options);
      }
export function useListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListQuery, ListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListQuery, ListQueryVariables>(ListDocument, options);
        }
export function useListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListQuery, ListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListQuery, ListQueryVariables>(ListDocument, options);
        }
export type ListQueryHookResult = ReturnType<typeof useListQuery>;
export type ListLazyQueryHookResult = ReturnType<typeof useListLazyQuery>;
export type ListSuspenseQueryHookResult = ReturnType<typeof useListSuspenseQuery>;
export type ListQueryResult = Apollo.QueryResult<ListQuery, ListQueryVariables>;
export const HealthDocument = gql`
    query Health {
  health {
    ok
    uptime
    env
  }
}
    `;

/**
 * __useHealthQuery__
 *
 * To run a query within a React component, call `useHealthQuery` and pass it any options that fit your needs.
 * When your component renders, `useHealthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHealthQuery({
 *   variables: {
 *   },
 * });
 */
export function useHealthQuery(baseOptions?: Apollo.QueryHookOptions<HealthQuery, HealthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HealthQuery, HealthQueryVariables>(HealthDocument, options);
      }
export function useHealthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HealthQuery, HealthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HealthQuery, HealthQueryVariables>(HealthDocument, options);
        }
export function useHealthSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HealthQuery, HealthQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HealthQuery, HealthQueryVariables>(HealthDocument, options);
        }
export type HealthQueryHookResult = ReturnType<typeof useHealthQuery>;
export type HealthLazyQueryHookResult = ReturnType<typeof useHealthLazyQuery>;
export type HealthSuspenseQueryHookResult = ReturnType<typeof useHealthSuspenseQuery>;
export type HealthQueryResult = Apollo.QueryResult<HealthQuery, HealthQueryVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    user {
      id
      email
      username
    }
    tokens {
      accessToken
      refreshToken
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: CreateUserInput!) {
  register(input: $input) {
    user {
      id
      email
      username
    }
    tokens {
      accessToken
      refreshToken
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
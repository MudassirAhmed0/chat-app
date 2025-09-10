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

/** Conversation type ( DM, GROUP) */
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

export type MessageUpdated = {
  __typename?: 'MessageUpdated';
  conversationId: Scalars['ID']['output'];
  emoji?: Maybe<Scalars['String']['output']>;
  kind: MessageUpdatedKind;
  messageId: Scalars['ID']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export enum MessageUpdatedKind {
  ReactionAdded = 'REACTION_ADDED',
  ReactionRemoved = 'REACTION_REMOVED',
  Read = 'READ'
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
  sendTyping: Scalars['Boolean']['output'];
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


export type MutationSendTypingArgs = {
  conversationId: Scalars['ID']['input'];
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
  searchUsers: Array<UserModel>;
};


export type QueryListConversationsArgs = {
  args?: InputMaybe<ListConversationsArgs>;
};


export type QueryListMessagesArgs = {
  args: ListMessagesArgs;
};


export type QuerySearchUsersArgs = {
  term: Scalars['String']['input'];
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

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: MessageModel;
  messageUpdated: MessageUpdated;
  typingStarted: TypingPayload;
};


export type SubscriptionMessageAddedArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionMessageUpdatedArgs = {
  conversationId: Scalars['ID']['input'];
};


export type SubscriptionTypingStartedArgs = {
  conversationId: Scalars['ID']['input'];
};

export type TypingPayload = {
  __typename?: 'TypingPayload';
  at: Scalars['DateTime']['output'];
  conversationId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
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

export type AddReactionMutationVariables = Exact<{
  input: AddReactionInput;
}>;


export type AddReactionMutation = { __typename?: 'Mutation', addReaction: { __typename?: 'ReactionModel', emoji: string, userId: string, user: { __typename?: 'UserModel', username: string } } };

export type CreateConversationMutationVariables = Exact<{
  input: CreateConversationInput;
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', createConversation: { __typename?: 'Conversation', id: string, type: ConversationType, title?: string | null, updatedAt: any, participants: Array<{ __typename?: 'UserSlim', id: string, username: string }> } };

export type ListConversationsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListConversationsQuery = { __typename?: 'Query', listConversations: { __typename?: 'ConversationPage', items: Array<{ __typename?: 'Conversation', id: string, type: ConversationType, title?: string | null, updatedAt: any, participants: Array<{ __typename?: 'UserSlim', id: string, username: string }> }>, pageInfo: { __typename?: 'PageInfo', nextCursor?: string | null, hasNextPage: boolean } } };

export type ListMessagesQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListMessagesQuery = { __typename?: 'Query', listMessages: { __typename?: 'MessagePage', items: Array<{ __typename?: 'MessageModel', id: string, conversationId: string, content: string, type: MessageType, createdAt: any, sender: { __typename?: 'UserModel', id: string, username: string }, reactions: Array<{ __typename?: 'ReactionModel', emoji: string, userId: string, user: { __typename?: 'UserModel', username: string } }> }>, pageInfo: { __typename?: 'PageInfo', nextCursor?: string | null, hasNextPage: boolean } } };

export type RemoveReactionMutationVariables = Exact<{
  input: RemoveReactionInput;
}>;


export type RemoveReactionMutation = { __typename?: 'Mutation', removeReaction: boolean };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'MessageModel', id: string, conversationId: string, content: string, type: MessageType, createdAt: any, sender: { __typename?: 'UserModel', id: string, username: string }, reactions: Array<{ __typename?: 'ReactionModel', emoji: string, userId: string, user: { __typename?: 'UserModel', username: string } }> } };

export type SendTypingMutationVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type SendTypingMutation = { __typename?: 'Mutation', sendTyping: boolean };

export type OnMessageAddedSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type OnMessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'MessageModel', id: string, conversationId: string, content: string, type: MessageType, createdAt: any, sender: { __typename?: 'UserModel', id: string, username: string }, reactions: Array<{ __typename?: 'ReactionModel', emoji: string, userId: string, user: { __typename?: 'UserModel', username: string } }> } };

export type OnMessageUpdatedSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type OnMessageUpdatedSubscription = { __typename?: 'Subscription', messageUpdated: { __typename?: 'MessageUpdated', conversationId: string, messageId: string, kind: MessageUpdatedKind, emoji?: string | null, userId?: string | null } };

export type OnTypingStartedSubscriptionVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type OnTypingStartedSubscription = { __typename?: 'Subscription', typingStarted: { __typename?: 'TypingPayload', conversationId: string, userId: string, at: any } };

export type MarkReadMutationVariables = Exact<{
  input: MarkReadInput;
}>;


export type MarkReadMutation = { __typename?: 'Mutation', markRead: boolean };

export type SearchUsersQueryVariables = Exact<{
  term: Scalars['String']['input'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: Array<{ __typename?: 'UserModel', id: string, username: string, email: string }> };


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
export const AddReactionDocument = gql`
    mutation AddReaction($input: AddReactionInput!) {
  addReaction(input: $input) {
    emoji
    userId
    user {
      username
    }
  }
}
    `;
export type AddReactionMutationFn = Apollo.MutationFunction<AddReactionMutation, AddReactionMutationVariables>;

/**
 * __useAddReactionMutation__
 *
 * To run a mutation, you first call `useAddReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addReactionMutation, { data, loading, error }] = useAddReactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddReactionMutation(baseOptions?: Apollo.MutationHookOptions<AddReactionMutation, AddReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddReactionMutation, AddReactionMutationVariables>(AddReactionDocument, options);
      }
export type AddReactionMutationHookResult = ReturnType<typeof useAddReactionMutation>;
export type AddReactionMutationResult = Apollo.MutationResult<AddReactionMutation>;
export type AddReactionMutationOptions = Apollo.BaseMutationOptions<AddReactionMutation, AddReactionMutationVariables>;
export const CreateConversationDocument = gql`
    mutation CreateConversation($input: CreateConversationInput!) {
  createConversation(input: $input) {
    id
    type
    title
    updatedAt
    participants {
      id
      username
    }
  }
}
    `;
export type CreateConversationMutationFn = Apollo.MutationFunction<CreateConversationMutation, CreateConversationMutationVariables>;

/**
 * __useCreateConversationMutation__
 *
 * To run a mutation, you first call `useCreateConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createConversationMutation, { data, loading, error }] = useCreateConversationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateConversationMutation(baseOptions?: Apollo.MutationHookOptions<CreateConversationMutation, CreateConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateConversationMutation, CreateConversationMutationVariables>(CreateConversationDocument, options);
      }
export type CreateConversationMutationHookResult = ReturnType<typeof useCreateConversationMutation>;
export type CreateConversationMutationResult = Apollo.MutationResult<CreateConversationMutation>;
export type CreateConversationMutationOptions = Apollo.BaseMutationOptions<CreateConversationMutation, CreateConversationMutationVariables>;
export const ListConversationsDocument = gql`
    query ListConversations($cursor: String) {
  listConversations(args: {take: 30, cursor: $cursor}) {
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
      nextCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useListConversationsQuery__
 *
 * To run a query within a React component, call `useListConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListConversationsQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useListConversationsQuery(baseOptions?: Apollo.QueryHookOptions<ListConversationsQuery, ListConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListConversationsQuery, ListConversationsQueryVariables>(ListConversationsDocument, options);
      }
export function useListConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListConversationsQuery, ListConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListConversationsQuery, ListConversationsQueryVariables>(ListConversationsDocument, options);
        }
export function useListConversationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListConversationsQuery, ListConversationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListConversationsQuery, ListConversationsQueryVariables>(ListConversationsDocument, options);
        }
export type ListConversationsQueryHookResult = ReturnType<typeof useListConversationsQuery>;
export type ListConversationsLazyQueryHookResult = ReturnType<typeof useListConversationsLazyQuery>;
export type ListConversationsSuspenseQueryHookResult = ReturnType<typeof useListConversationsSuspenseQuery>;
export type ListConversationsQueryResult = Apollo.QueryResult<ListConversationsQuery, ListConversationsQueryVariables>;
export const ListMessagesDocument = gql`
    query ListMessages($conversationId: ID!, $cursor: String) {
  listMessages(args: {conversationId: $conversationId, take: 40, cursor: $cursor}) {
    items {
      id
      conversationId
      content
      type
      createdAt
      sender {
        id
        username
      }
      reactions {
        emoji
        userId
        user {
          username
        }
      }
    }
    pageInfo {
      nextCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useListMessagesQuery__
 *
 * To run a query within a React component, call `useListMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMessagesQuery({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useListMessagesQuery(baseOptions: Apollo.QueryHookOptions<ListMessagesQuery, ListMessagesQueryVariables> & ({ variables: ListMessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListMessagesQuery, ListMessagesQueryVariables>(ListMessagesDocument, options);
      }
export function useListMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListMessagesQuery, ListMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListMessagesQuery, ListMessagesQueryVariables>(ListMessagesDocument, options);
        }
export function useListMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListMessagesQuery, ListMessagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListMessagesQuery, ListMessagesQueryVariables>(ListMessagesDocument, options);
        }
export type ListMessagesQueryHookResult = ReturnType<typeof useListMessagesQuery>;
export type ListMessagesLazyQueryHookResult = ReturnType<typeof useListMessagesLazyQuery>;
export type ListMessagesSuspenseQueryHookResult = ReturnType<typeof useListMessagesSuspenseQuery>;
export type ListMessagesQueryResult = Apollo.QueryResult<ListMessagesQuery, ListMessagesQueryVariables>;
export const RemoveReactionDocument = gql`
    mutation RemoveReaction($input: RemoveReactionInput!) {
  removeReaction(input: $input)
}
    `;
export type RemoveReactionMutationFn = Apollo.MutationFunction<RemoveReactionMutation, RemoveReactionMutationVariables>;

/**
 * __useRemoveReactionMutation__
 *
 * To run a mutation, you first call `useRemoveReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeReactionMutation, { data, loading, error }] = useRemoveReactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveReactionMutation(baseOptions?: Apollo.MutationHookOptions<RemoveReactionMutation, RemoveReactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveReactionMutation, RemoveReactionMutationVariables>(RemoveReactionDocument, options);
      }
export type RemoveReactionMutationHookResult = ReturnType<typeof useRemoveReactionMutation>;
export type RemoveReactionMutationResult = Apollo.MutationResult<RemoveReactionMutation>;
export type RemoveReactionMutationOptions = Apollo.BaseMutationOptions<RemoveReactionMutation, RemoveReactionMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    id
    conversationId
    content
    type
    createdAt
    sender {
      id
      username
    }
    reactions {
      emoji
      userId
      user {
        username
      }
    }
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const SendTypingDocument = gql`
    mutation SendTyping($conversationId: ID!) {
  sendTyping(conversationId: $conversationId)
}
    `;
export type SendTypingMutationFn = Apollo.MutationFunction<SendTypingMutation, SendTypingMutationVariables>;

/**
 * __useSendTypingMutation__
 *
 * To run a mutation, you first call `useSendTypingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendTypingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendTypingMutation, { data, loading, error }] = useSendTypingMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useSendTypingMutation(baseOptions?: Apollo.MutationHookOptions<SendTypingMutation, SendTypingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendTypingMutation, SendTypingMutationVariables>(SendTypingDocument, options);
      }
export type SendTypingMutationHookResult = ReturnType<typeof useSendTypingMutation>;
export type SendTypingMutationResult = Apollo.MutationResult<SendTypingMutation>;
export type SendTypingMutationOptions = Apollo.BaseMutationOptions<SendTypingMutation, SendTypingMutationVariables>;
export const OnMessageAddedDocument = gql`
    subscription OnMessageAdded($conversationId: ID!) {
  messageAdded(conversationId: $conversationId) {
    id
    conversationId
    content
    type
    createdAt
    sender {
      id
      username
    }
    reactions {
      emoji
      userId
      user {
        username
      }
    }
  }
}
    `;

/**
 * __useOnMessageAddedSubscription__
 *
 * To run a query within a React component, call `useOnMessageAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnMessageAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnMessageAddedSubscription({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useOnMessageAddedSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnMessageAddedSubscription, OnMessageAddedSubscriptionVariables> & ({ variables: OnMessageAddedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnMessageAddedSubscription, OnMessageAddedSubscriptionVariables>(OnMessageAddedDocument, options);
      }
export type OnMessageAddedSubscriptionHookResult = ReturnType<typeof useOnMessageAddedSubscription>;
export type OnMessageAddedSubscriptionResult = Apollo.SubscriptionResult<OnMessageAddedSubscription>;
export const OnMessageUpdatedDocument = gql`
    subscription OnMessageUpdated($conversationId: ID!) {
  messageUpdated(conversationId: $conversationId) {
    conversationId
    messageId
    kind
    emoji
    userId
  }
}
    `;

/**
 * __useOnMessageUpdatedSubscription__
 *
 * To run a query within a React component, call `useOnMessageUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnMessageUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnMessageUpdatedSubscription({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useOnMessageUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnMessageUpdatedSubscription, OnMessageUpdatedSubscriptionVariables> & ({ variables: OnMessageUpdatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnMessageUpdatedSubscription, OnMessageUpdatedSubscriptionVariables>(OnMessageUpdatedDocument, options);
      }
export type OnMessageUpdatedSubscriptionHookResult = ReturnType<typeof useOnMessageUpdatedSubscription>;
export type OnMessageUpdatedSubscriptionResult = Apollo.SubscriptionResult<OnMessageUpdatedSubscription>;
export const OnTypingStartedDocument = gql`
    subscription OnTypingStarted($conversationId: ID!) {
  typingStarted(conversationId: $conversationId) {
    conversationId
    userId
    at
  }
}
    `;

/**
 * __useOnTypingStartedSubscription__
 *
 * To run a query within a React component, call `useOnTypingStartedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnTypingStartedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnTypingStartedSubscription({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *   },
 * });
 */
export function useOnTypingStartedSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnTypingStartedSubscription, OnTypingStartedSubscriptionVariables> & ({ variables: OnTypingStartedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnTypingStartedSubscription, OnTypingStartedSubscriptionVariables>(OnTypingStartedDocument, options);
      }
export type OnTypingStartedSubscriptionHookResult = ReturnType<typeof useOnTypingStartedSubscription>;
export type OnTypingStartedSubscriptionResult = Apollo.SubscriptionResult<OnTypingStartedSubscription>;
export const MarkReadDocument = gql`
    mutation MarkRead($input: MarkReadInput!) {
  markRead(input: $input)
}
    `;
export type MarkReadMutationFn = Apollo.MutationFunction<MarkReadMutation, MarkReadMutationVariables>;

/**
 * __useMarkReadMutation__
 *
 * To run a mutation, you first call `useMarkReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markReadMutation, { data, loading, error }] = useMarkReadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMarkReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkReadMutation, MarkReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkReadMutation, MarkReadMutationVariables>(MarkReadDocument, options);
      }
export type MarkReadMutationHookResult = ReturnType<typeof useMarkReadMutation>;
export type MarkReadMutationResult = Apollo.MutationResult<MarkReadMutation>;
export type MarkReadMutationOptions = Apollo.BaseMutationOptions<MarkReadMutation, MarkReadMutationVariables>;
export const SearchUsersDocument = gql`
    query SearchUsers($term: String!) {
  searchUsers(term: $term) {
    id
    username
    email
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      term: // value for 'term'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables> & ({ variables: SearchUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export function useSearchUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersSuspenseQueryHookResult = ReturnType<typeof useSearchUsersSuspenseQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
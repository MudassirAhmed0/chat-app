'use client';
import {
  MessageType,
  type ReactionModel,
  type SendMessageMutation,
  useListMessagesQuery,
  useSendMessageMutation,
  type OnMessageAddedSubscription,
  type OnMessageAddedSubscriptionVariables,
  type ListMessagesQuery,
  OnMessageAddedDocument,
  useMarkReadMutation,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useSendTypingMutation,
  // OnMessageUpdatedDocument,   // <- remove until you actually use
  // OnTypingStartedDocument,    // <- remove until you actually use
} from '@/gql/graphql';
import { useAuthStore } from '@/store/auth';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

const useMessages = (conversationId: string) => {
  const myId = useAuthStore((s) => s.user?.id);
  if (!myId) throw new Error('myId is required for optimistic sender');

  // drop `error` from destructure since it's unused
  const { data, loading, subscribeToMore, fetchMore } = useListMessagesQuery({
    variables: { conversationId },
    fetchPolicy: 'cache-and-network',
  });

  const [send] = useSendMessageMutation({
    // remove the unused IGNORE param
    optimisticResponse: (vars) => {
      const clientRequestId = crypto.randomUUID();
      const tempId = 'temp-' + clientRequestId;

      const optimistic: SendMessageMutation = {
        __typename: 'Mutation',
        sendMessage: {
          __typename: 'MessageModel',
          id: tempId,
          clientRequestId,
          conversationId,
          content: vars.input.content,
          type: vars.input.type ?? MessageType.Text,
          createdAt: new Date(),
          sender: { __typename: 'UserModel', id: myId, username: 'you' },
          reactions: [] as ReactionModel[],
        },
      };

      return optimistic;
    },
  });

  // const { useMarkReadMutation, useAddReactionMutation, useRemoveReactionMutation, useSendTypingMutation } = await import('@/gql/graphql'); // if these were already imported, keep them; this is just illustrative
  const [markRead] = useMarkReadMutation();
  const [addReaction] = useAddReactionMutation();
  const [removeReaction] = useRemoveReactionMutation();
  const [sendTyping] = useSendTypingMutation();

  useEffect(() => {
    loadDevMessages();
    loadErrorMessages();

    const unsub1 = subscribeToMore<OnMessageAddedSubscription, OnMessageAddedSubscriptionVariables>(
      {
        document: OnMessageAddedDocument,
        variables: { conversationId },
        updateQuery: (prev, { subscriptionData }) => {
          const msg = subscriptionData.data?.messageAdded;
          if (!msg) return prev;

          const items = prev.listMessages?.items ?? [];

          // de-dup by id or clientRequestId
          if (
            items.some(
              (m) =>
                m.id === msg.id || (m.clientRequestId && m.clientRequestId === msg.clientRequestId),
            )
          ) {
            return prev;
          }

          return {
            ...prev,
            listMessages: {
              ...prev.listMessages,
              items: [msg, ...items],
              pageInfo: prev.listMessages?.pageInfo ?? { hasNextPage: false, nextCursor: null },
            },
          } as ListMessagesQuery;
        },
      },
    );

    return () => {
      unsub1();
    };
  }, [conversationId, subscribeToMore]);

  const items = data?.listMessages?.items ?? [];
  const hasNextPage = data?.listMessages?.pageInfo?.hasNextPage;
  const nextCursor = data?.listMessages?.pageInfo?.nextCursor;

  async function loadMore(): Promise<void> {
    if (!hasNextPage || !nextCursor) return;
    await fetchMore({
      variables: { conversationId, cursor: nextCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.listMessages) return prev;

        const newItems = [...prev.listMessages.items, ...fetchMoreResult.listMessages.items];

        return {
          ...fetchMoreResult,
          listMessages: {
            ...fetchMoreResult.listMessages,
            items: newItems,
          },
        };
      },
    });
  }

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function notifyTyping(): void {
    if (typingTimer.current) return;
    typingTimer.current = setTimeout(() => {
      typingTimer.current = null;
    }, 2000);
    void sendTyping({ variables: { conversationId } }).catch(() => {});
  }

  return {
    items,
    loading,
    sendMessage: (text: string) =>
      send({ variables: { input: { conversationId, content: text } } }),
    markRead: (messageId: string) =>
      markRead({ variables: { input: { conversationId, messageId } } }),
    addReaction: (messageId: string, emoji: string) =>
      addReaction({ variables: { input: { messageId, emoji } } }),
    removeReaction: (messageId: string, emoji: string) =>
      removeReaction({ variables: { input: { messageId, emoji } } }),
    loadMore,
    hasNextPage,
    nextCursor,
    notifyTyping,
    myId,
    dayjs,
  };
};

export default useMessages;

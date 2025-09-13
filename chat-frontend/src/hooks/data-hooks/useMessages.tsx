'use client';
import {
  ListMessagesDocument,
  MessageType,
  type ReactionModel,
  SendMessageMutation,
  useListMessagesQuery,
  useSendMessageMutation,
  type MessageModel,
  type UserModel,
  useMarkReadMutation,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useSendTypingMutation,
  OnMessageAddedDocument,
  OnMessageAddedSubscription,
  OnMessageAddedSubscriptionVariables,
  ListMessagesQuery,
  OnMessageUpdatedDocument,
  OnTypingStartedDocument,
} from '@/gql/graphql';
import { useAuthStore } from '@/store/auth';
import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';

const useMessages = (conversationId: string) => {
  const myId = useAuthStore((s) => s.user?.id);
  if (!myId) throw new Error('myId is required for optimistic sender');
  const { data, loading, error, subscribeToMore, fetchMore } = useListMessagesQuery({
    variables: { conversationId },
    fetchPolicy: 'cache-and-network',
  });
  const [send] = useSendMessageMutation({
    optimisticResponse: (vars, { IGNORE }) => {
      const clientRequestId = crypto.randomUUID();
      const tempId = 'temp-' + clientRequestId;

      // Build the optimistic payload with correct, explicit types
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
          // Avoid never[] by typing the empty array
          reactions: [] as Array<ReactionModel>,
        },
      };

      return optimistic;
    },
  });

  const [markRead] = useMarkReadMutation();
  const [addReaction] = useAddReactionMutation();
  const [removeReaction] = useRemoveReactionMutation();
  const [sendTyping] = useSendTypingMutation();

  useEffect(() => {
    loadDevMessages();
    loadErrorMessages();
    const unsub1 = subscribeToMore<
      OnMessageAddedSubscription, // <-- subscription result
      OnMessageAddedSubscriptionVariables // <-- subscription variables
    >({
      document: OnMessageAddedDocument,
      variables: { conversationId },
      updateQuery: (prev, { subscriptionData }) => {
        const msg = subscriptionData.data?.messageAdded;
        if (!msg) return prev;
        // (Optional chaining if codegen made things nullable)
        const items = prev.listMessages?.items ?? [];
        const tempIdx = items.findIndex(
          (m) => m?.clientRequestId && m?.clientRequestId === msg?.clientRequestId,
        );
        if (items.some((m) => m.id === msg.id)) return prev;

        return {
          ...prev,
          listMessages: {
            ...prev.listMessages,
            items: [msg, ...items], // prepend (we show newest first)
            pageInfo: prev.listMessages?.pageInfo ?? { hasNextPage: false, nextCursor: null },
          },
        } as ListMessagesQuery;
      },
    });

    // const unsub2 = subscribeToMore({
    //   document: OnMessageUpdatedDocument,
    //   variables: { conversationId },
    //   updateQuery: (prev) => prev,
    // });
    // const unsub3 = subscribeToMore({
    //   document: OnTypingStartedDocument,
    //   variables: { conversationId },
    //   updateQuery: (prev) => prev,
    // });
    return () => {
      unsub1();
      // unsub2();
      // unsub3();
    };
  }, [conversationId, subscribeToMore]);

  const items = data?.listMessages?.items ?? [];
  const hasNextPage = data?.listMessages?.pageInfo?.hasNextPage;
  const nextCursor = data?.listMessages?.pageInfo?.nextCursor;

  async function loadMore() {
    if (!hasNextPage || !nextCursor) return;
    await fetchMore({
      variables: { conversationId, cursor: nextCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.listMessages) return prev;

        const newItems = [...prev.listMessages.items, ...fetchMoreResult.listMessages.items];

        const newResults = {
          ...fetchMoreResult,
          listMessages: {
            ...fetchMoreResult.listMessages,
            items: [...newItems],
          },
        };
        return { ...newResults };
      },
    });
  }

  const typingTimer = useRef<any>(null);
  function notifyTyping() {
    if (typingTimer.current) return null;
    typingTimer.current = setTimeout(() => (typingTimer.current = null), 2000);
    sendTyping({ variables: { conversationId } }).catch(() => {});
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

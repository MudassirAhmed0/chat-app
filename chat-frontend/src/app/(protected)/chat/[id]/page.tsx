'use client';
import { Composer } from '@/components/ui/chat/composer';
import { MessageList } from '@/components/ui/chat/message-list';
import { TypingBar } from '@/components/ui/chat/typing-bar';
import { useOnTypingStartedSubscription } from '@/gql/graphql';
import useMessages from '@/hooks/data-hooks/useMessages';
import { useAuthStore } from '@/store/auth';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

// import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id!;
  const { items, sendMessage, loadMore, hasNextPage, notifyTyping, myId } =
    useMessages(conversationId);
  const [typingText, setTypingText] = useState<string | undefined>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user = useAuthStore((s) => s.user);

  useOnTypingStartedSubscription({
    variables: { conversationId },
    onData: ({ data }) => {
      const evt = data.data?.typingStarted;
      if (!evt || evt.userId == user?.id) return;

      // e.g., show a generic label or resolve name from userId
      setTypingText(evt.username + ' is typing…');

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setTypingText(undefined);
      }, 2000);
    },
  });

  return (
    <main className="flex flex-col flex-1 min-h-0">
      {/* Header (placeholder) */}
      <div className="h-14 border-b flex items-center px-4 text-sm">
        Conversation {conversationId}
      </div>

      {/* Messages */}

      <MessageList me={myId} items={items} onLoadMore={loadMore} hasNextPage={hasNextPage} />

      <TypingBar text={typingText} />
      <Composer onSend={sendMessage} onTyping={notifyTyping} />
    </main>
  );
}

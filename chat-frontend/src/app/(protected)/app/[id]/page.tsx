'use client';
import { Composer } from '@/components/ui/chat/composer';
import { MessageList } from '@/components/ui/chat/message-list';
import { TypingBar } from '@/components/ui/chat/typing-bar';
import useMessages from '@/hooks/data-hooks/useMessages';
import { useParams } from 'next/navigation';

import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const conversationId = params.id!;
  const { items, sendMessage, loadMore, hasNextPage, notifyTyping, myId } =
    useMessages(conversationId);
  const [typingText, setTypingText] = useState<string | undefined>();
  console.log(items);
  // (Simple) show "Someone is typing…" for 2s whenever we get a typing event via cache (see hook wiring)
  // In a full version, subscribeToMore handler would set this.
  // For now this is updated by useMessages' SUB_TYPING_STARTED (you can expand it to show specific username).
  const timeout = useRef<any>(null);
  useEffect(() => {
    // you'd update this from subscription payload; placeholder:
    // setTypingText('Someone is typing…');
    return () => clearTimeout(timeout.current);
  }, []);

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

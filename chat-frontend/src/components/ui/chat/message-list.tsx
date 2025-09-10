'use client';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useEffect, useMemo, useRef } from 'react';

type Props = {
  me: string;
  items: any[]; // newest first (descending)
  onLoadMore: () => void;
  hasNextPage?: boolean;
};

export function MessageList({ me, items, onLoadMore, hasNextPage }: Props) {
  // Virtuoso likes oldest->newest for natural scroll; reverse in-memory for render
  const ordered = useMemo(() => [...items].reverse(), [items]);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // scroll to bottom on new message
  useEffect(() => {
    virtuosoRef.current?.scrollToIndex({
      index: ordered.length - 1,
      align: 'end',
      behavior: 'smooth',
    });
  }, [ordered.length]);

  return (
    <div className="flex-1 min-h-0">
      <Virtuoso
        ref={virtuosoRef as any}
        data={ordered}
        initialTopMostItemIndex={ordered.length - 1}
        itemContent={(index, m: any) => <Bubble key={m.id} me={me} message={m} />}
        startReached={() => {
          if (hasNextPage) onLoadMore();
        }}
        className="h-full"
      />
    </div>
  );
}

function Bubble({ me, message }: { me: string; message: any }) {
  const mine = message.sender?.id === me || ('' + message.id).startsWith('temp-');
  return (
    <div className={`px-4 py-1 flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm
        ${mine ? 'bg-[--primary] text-[--primary-foreground]' : 'bg-[color:var(--muted)]'}
      `}
      >
        {!mine && <div className="text-xs opacity-70 mb-0.5">{message.sender?.username}</div>}
        <div>{message.content}</div>
        <div className="text-[10px] opacity-70 mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {/* TODO: show ✓ / ✓✓ when we wire precise read receipts */}
        </div>
      </div>
    </div>
  );
}

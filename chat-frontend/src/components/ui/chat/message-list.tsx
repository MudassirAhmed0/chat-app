'use client';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useMemo, useRef, useState } from 'react';

type Props = {
  me: string;
  items: any[]; // newest first (descending) coming in
  onLoadMore: () => void;
  hasNextPage?: boolean;
};

export function MessageList({ me, items, onLoadMore, hasNextPage }: Props) {
  // Virtuoso prefers oldest -> newest for natural scroll
  const ordered = useMemo(() => [...items].reverse(), [items]);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);

  return (
    <div className="flex-1 min-h-0">
      <Virtuoso
        ref={virtuosoRef as any}
        data={ordered}
        // initial bottom
        initialTopMostItemIndex={ordered.length ? ordered.length - 1 : 0}
        // <-- This keeps you stuck to bottom when new items append
        followOutput={atBottom ? 'smooth' : false}
        atBottomStateChange={setAtBottom}
        computeItemKey={(i, m) => m.id}
        itemContent={(index, m: any) => <Bubble me={me} message={m} />}
        startReached={() => hasNextPage && onLoadMore()}
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
        ${mine ? 'bg-[--primary] text-[--primary-foreground]' : 'bg-[color:var(--muted)]'}`}
      >
        {!mine && <div className="text-xs opacity-70 mb-0.5">{message.sender?.username}</div>}
        <div>{message.content}</div>
        <div className="text-[10px] opacity-70 mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}

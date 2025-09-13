'use client';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  me: string;
  items: any[]; // DESC: newest -> oldest
  onLoadMore: () => Promise<void> | void; // can be sync or async
  hasNextPage?: boolean;
};

const Header = () => <div className="py-2 text-center text-xs opacity-70">Loading…</div>;

export function MessageList({ me, items, onLoadMore, hasNextPage }: Props) {
  // Virtuoso wants ASC; we keep DESC in cache → reverse for UI once.
  const ordered = useMemo(() => [...items].reverse(), [items]);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Keeps viewport stable when we PREPEND older items
  const [firstItemIndex, setFirstItemIndex] = useState(0);

  // “are we currently fetching older stuff from the top?”
  const loadingTopRef = useRef(false);

  // Track length to compute how many got prepended (delta)
  const prevLenRef = useRef(0);

  // Stick to bottom when new messages arrive AND user is at bottom
  const [atBottom, setAtBottom] = useState(true);

  // When list grows while we were loading from top, shift firstItemIndex back by delta
  useEffect(() => {
    const prev = prevLenRef.current;
    const curr = ordered.length;
    if (loadingTopRef.current && curr > prev) {
      const delta = curr - prev; // how many older rows were added at the TOP (after reverse)
      setFirstItemIndex((v) => v - delta); // keep viewport from jumping to first message
      loadingTopRef.current = false; // allow the next top-load once user scrolls up again
    }
    prevLenRef.current = curr;
  }, [ordered.length]);

  return (
    <div className="flex-1 min-h-0">
      {ordered.length > 0 && (
        <Virtuoso
          ref={virtuosoRef as any}
          data={ordered}
          firstItemIndex={firstItemIndex}
          // start at bottom on first mount
          initialTopMostItemIndex={ordered.length ? ordered.length - 1 : 0}
          followOutput={atBottom ? 'smooth' : false}
          atBottomStateChange={setAtBottom}
          computeItemKey={(i, m: any) => String(m.id)}
          components={{ Header: loadingTopRef.current ? Header : undefined }}
          startReached={async () => {
            if (!hasNextPage || loadingTopRef.current) return;
            loadingTopRef.current = true;
            prevLenRef.current = ordered.length; // baseline before fetch
            await onLoadMore(); // can be sync/async
            // after this resolves, the effect above adjusts firstItemIndex by delta
          }}
          itemContent={(index, m: any) => <Bubble me={me} message={m} />}
          className="h-full"
        />
      )}
    </div>
  );
}

function Bubble({ me, message }: { me: string; message: any }) {
  const mine = message.sender?.id === me || String(message.id).startsWith('temp-');
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

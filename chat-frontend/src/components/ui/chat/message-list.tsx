'use client';
import * as React from 'react';
import type { ReactNode } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { useEffect, useMemo, useRef, useState } from 'react';

type UserRef =
  | {
      id: string;
      username?: string | null;
    }
  | null
  | undefined;

export interface ChatMessageLike {
  id: string | number;
  sender?: UserRef;
  content: ReactNode; // allow rich content
  createdAt: string | number | Date; // normalize when rendering
}

interface BubbleProps {
  me: string;
  message: ChatMessageLike;
}

type Props = {
  me: string;
  items: ChatMessageLike[]; // DESC: newest -> oldest
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
        <Virtuoso<ChatMessageLike>
          ref={virtuosoRef}
          data={ordered}
          firstItemIndex={firstItemIndex}
          // start at bottom on first mount
          initialTopMostItemIndex={ordered.length ? ordered.length - 1 : 0}
          followOutput={atBottom ? 'smooth' : false}
          atBottomStateChange={setAtBottom}
          computeItemKey={(_, m) => String(m.id)}
          components={{ Header: loadingTopRef.current ? Header : undefined }}
          startReached={async () => {
            if (!hasNextPage || loadingTopRef.current) return;
            loadingTopRef.current = true;
            prevLenRef.current = ordered.length; // baseline before fetch
            await onLoadMore(); // can be sync/async
            // after this resolves, the effect above adjusts firstItemIndex by delta
          }}
          itemContent={(_, m) => <Bubble me={me} message={m} />}
          className="h-full"
        />
      )}
    </div>
  );
}

function Bubble({ me, message }: BubbleProps) {
  const mine = message.sender?.id === me || String(message.id).startsWith('temp-');

  const created =
    message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt);

  const timeText = Number.isNaN(created.getTime())
    ? ''
    : created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`px-4 py-1 flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm
        ${mine ? 'bg-[--primary] text-[--primary-foreground]' : 'bg-[color:var(--muted)]'}`}
      >
        {!mine && message.sender?.username ? (
          <div className="text-xs opacity-70 mb-0.5">{message.sender.username}</div>
        ) : null}

        <div>{message.content}</div>

        {timeText && <div className="text-[10px] opacity-70 mt-1 text-right">{timeText}</div>}
      </div>
    </div>
  );
}

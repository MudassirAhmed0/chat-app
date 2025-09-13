'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import useConversation from '@/hooks/data-hooks/useConversation';
import { NewChatModal } from './new-chat-modal';
import type { ChangeEvent } from 'react';

type Participant = {
  id: string | number;
  username: string;
};

type Conversation = {
  id: string | number;
  type: string; // or 'direct' | 'group' if you have it
  title?: string | null;
  participants: Participant[];
  updatedAt: string | number | Date;
};

// If your hook is generic, prefer this:
// const { items, loading } = useConversation<Conversation>();
export function Sidebar() {
  const { items, loading } = useConversation();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const conversations = useMemo(() => (items as unknown as Conversation[]) ?? [], [items]);

  const filtered = useMemo(() => {
    if (!q) return conversations;
    const needle = q.toLowerCase();
    return conversations.filter((c) => {
      const title = (c.title ?? 'Direct chat').toLowerCase();
      const inTitle = title.includes(needle);
      const inParticipants = c.participants?.some((p) => p.username.toLowerCase().includes(needle));
      return inTitle || !!inParticipants;
    });
  }, [conversations, q]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  const formatWhen = (v: Conversation['updatedAt']) => {
    const d = v instanceof Date ? v : new Date(v);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
    // tweak locale/options if you want
  };

  return (
    <aside className="w-full md:w-80 shrink-0 border-r h-[100dvh] flex flex-col">
      <div className="p-4 border-b">
        <Input placeholder="Search…" value={q} onChange={onSearchChange} />
        <div className="mt-3">
          <Button className="w-full" onClick={() => setOpen(true)}>
            + New chat
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading && (
          <div className="p-4 space-y-2">
            <div className="h-10 bg-[color:var(--muted)] rounded-lg animate-pulse" />
            <div className="h-10 bg-[color:var(--muted)] rounded-lg animate-pulse" />
          </div>
        )}

        {!loading &&
          filtered.map((c) => (
            <Link
              key={String(c.id)}
              href={`/${c.id}`}
              className="block p-4 hover:bg-[color:var(--muted)]"
            >
              <div className="text-sm opacity-70">{c.type}</div>
              <div className="font-medium">
                {c.title ?? c.participants.map((p) => p.username).join(', ')}
              </div>
              <div className="text-xs opacity-60">{formatWhen(c.updatedAt)}</div>
            </Link>
          ))}

        {!loading && filtered.length === 0 && (
          <div className="p-4 text-sm opacity-60">No conversations</div>
        )}
      </div>

      <NewChatModal open={open} onClose={() => setOpen(false)} />
    </aside>
  );
}

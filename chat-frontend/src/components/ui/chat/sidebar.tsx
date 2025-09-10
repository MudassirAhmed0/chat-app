'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import useConversation from '@/hooks/data-hooks/useConversation';
import { NewChatModal } from './new-chat-modal';

export function Sidebar() {
  const { items, loading } = useConversation();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = q
    ? items.filter(
        (c: any) =>
          (c.title ?? 'Direct chat').toLowerCase().includes(q.toLowerCase()) ||
          c.participants.some((p: any) => p.username.toLowerCase().includes(q.toLowerCase())),
      )
    : items;

  return (
    <aside className="w-full md:w-80 shrink-0 border-r h-[100dvh] flex flex-col">
      <div className="p-4 border-b">
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
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
          filtered.map((c: any) => (
            <Link
              key={c.id}
              href={`/app/${c.id}`}
              className="block p-4 hover:bg-[color:var(--muted)]"
            >
              <div className="text-sm opacity-70">{c.type}</div>
              <div className="font-medium">
                {c.title ?? c.participants.map((p: any) => p.username).join(', ')}
              </div>
              <div className="text-xs opacity-60">{new Date(c.updatedAt).toLocaleString()}</div>
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

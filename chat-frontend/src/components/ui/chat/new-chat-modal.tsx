'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import {
  ConversationType,
  ListConversationsDocument,
  useCreateConversationMutation,
  useSearchUsersLazyQuery,
} from '@/gql/graphql';

export function NewChatModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [type, setType] = useState<ConversationType>(ConversationType.Dm);
  const [search, { data, loading }] = useSearchUsersLazyQuery();
  const [createConversation, { loading: creating }] = useCreateConversationMutation({
    update(cache, { data }) {
      const c = data?.createConversation;
      if (!c) return;
      cache.updateQuery({ query: ListConversationsDocument }, (prev: any) => {
        if (!prev) return prev;
        const exists = prev.listConversations.items.some((x: any) => x.id === c.id);
        return exists
          ? prev
          : {
              ...prev,
              listConversations: {
                ...prev.listConversations,
                items: [c, ...prev.listConversations.items],
              },
            };
      });
    },
  });

  useEffect(() => {
    const id = setTimeout(() => {
      if (term.trim()) search({ variables: { term } });
    }, 250);
    return () => clearTimeout(id);
  }, [term, search]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function createChat() {
    if (type === ConversationType.Dm && selected.length !== 1) return;
    if (type === ConversationType.Group && selected.length < 2) return;

    const res = await createConversation({
      variables: {
        input: {
          type,
          membersId: selected,
        },
      },
    });

    const id = res.data?.createConversation?.id;
    onClose();
    if (id) router.push(`/app/${id}`);
  }

  if (!open) return null;

  const results = data?.searchUsers ?? [];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl bg-background border shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">New chat</div>
          <button className="text-sm opacity-70" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="flex gap-3 mb-3">
          <button
            className={`px-3 py-1 rounded-md border ${type === ConversationType.Dm ? 'bg-[--primary] text-[--primary-foreground]' : ''}`}
            onClick={() => setType(ConversationType.Dm)}
          >
            DM
          </button>
          <button
            className={`px-3 py-1 rounded-md border ${type === ConversationType.Group ? 'bg-[--primary] text-[--primary-foreground]' : ''}`}
            onClick={() => setType(ConversationType.Group)}
          >
            Group
          </button>
        </div>

        <Input
          placeholder="Search by username or email…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        <div className="mt-3 max-h-64 overflow-auto rounded-lg border">
          {loading && <div className="p-3 text-sm opacity-70">Searching…</div>}
          {!loading && results.length === 0 && (
            <div className="p-3 text-sm opacity-60">No results</div>
          )}
          {!loading &&
            results.map((u: any) => (
              <label
                key={u.id}
                className="flex items-center gap-2 p-3 hover:bg-[color:var(--muted)] cursor-pointer"
              >
                <input
                  type={type === ConversationType.Dm ? 'radio' : 'checkbox'}
                  checked={selected.includes(u.id)}
                  onChange={() => toggle(u.id)}
                />
                <div>
                  <div className="text-sm font-medium">{u.username}</div>
                  <div className="text-xs opacity-70">{u.email}</div>
                </div>
              </label>
            ))}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={createChat}
            disabled={
              creating ||
              (type === ConversationType.Dm ? selected.length !== 1 : selected.length < 2)
            }
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}

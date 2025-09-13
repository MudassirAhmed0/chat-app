'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  ConversationType,
  ListConversationsDocument,
  useCreateConversationMutation,
  useSearchUsersLazyQuery,
  type ListConversationsQuery,
} from '@/gql/graphql';

type UserLite = { id: string; username: string; email: string };

export function NewChatModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [type, setType] = useState<ConversationType>(ConversationType.Dm);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [search, { data, loading: searching }] = useSearchUsersLazyQuery({
    fetchPolicy: 'network-only',
  });

  const [createConversation, { loading: creating }] = useCreateConversationMutation({
    update(cache, { data }) {
      const c = data?.createConversation;
      if (!c) return;

      cache.updateQuery<ListConversationsQuery>({ query: ListConversationsDocument }, (prev) => {
        if (!prev?.listConversations?.items) return prev;
        const items = prev.listConversations.items;
        const exists = items.some((x) => x.id === c.id);
        return exists
          ? prev
          : {
              ...prev,
              listConversations: {
                ...prev.listConversations,
                items: [c, ...items],
              },
            };
      });
    },
    // optimisticResponse: { ... }
  });

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const trimmed = term.trim();
    const id = setTimeout(() => {
      if (!trimmed) return;
      search({ variables: { term: trimmed } }).catch(() => {
        /* swallow / toast */
      });
    }, 250);
    return () => {
      clearTimeout(id);
    };
  }, [term, search, open]);

  // Reset modal state on close/open + autofocus
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      setTerm('');
      setSelected([]);
      setType(ConversationType.Dm);
    };
  }, [open]);

  const results: UserLite[] = useMemo(() => data?.searchUsers ?? [], [data]);

  const toggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        if (type === ConversationType.Dm) {
          return prev.includes(id) ? [] : [id];
        }
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [type],
  );

  const onSwitchType = useCallback((t: ConversationType) => {
    setType(t);
    setSelected((prev) => (t === ConversationType.Dm ? prev.slice(0, 1) : prev));
  }, []);

  async function createChat() {
    const isDm = type === ConversationType.Dm;
    if (isDm && selected.length !== 1) return;
    if (!isDm && selected.length < 2) return;

    try {
      const res = await createConversation({
        variables: { input: { type, membersId: selected } },
      });
      const id = res.data?.createConversation?.id;
      onClose();
      if (id) router.push(`/app/${id}`);
    } catch {
      // TODO: toast error
    }
  }

  if (!open) return null;

  const canCreate =
    !creating && (type === ConversationType.Dm ? selected.length === 1 : selected.length >= 2);

  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && canCreate) createChat();
  };

  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (evt) => {
    evt.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onBackdropClick}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Create new chat"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-background border shadow-xl p-4"
        onClick={stopPropagation}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">New chat</div>
          <button className="text-sm opacity-70" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>

        <div className="flex gap-3 mb-3">
          <button
            className={`px-3 py-1 rounded-md border ${
              type === ConversationType.Dm
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : ''
            }`}
            onClick={() => onSwitchType(ConversationType.Dm)}
            aria-pressed={type === ConversationType.Dm}
          >
            DM
          </button>
          <button
            className={`px-3 py-1 rounded-md border ${
              type === ConversationType.Group
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : ''
            }`}
            onClick={() => onSwitchType(ConversationType.Group)}
            aria-pressed={type === ConversationType.Group}
          >
            Group
          </button>
        </div>

        <Input
          ref={searchInputRef}
          placeholder="Search by username or email…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="Search users"
        />

        <div className="mt-3 max-h-64 overflow-auto rounded-lg border">
          {searching && <div className="p-3 text-sm opacity-70">Searching…</div>}
          {!searching && results.length === 0 && (
            <div className="p-3 text-sm opacity-60">No results</div>
          )}
          {!searching &&
            results.map((u) => {
              const checked = selected.includes(u.id);
              return (
                <label
                  key={u.id}
                  className="flex items-center gap-2 p-3 hover:bg-[color:var(--muted)] cursor-pointer"
                >
                  <input
                    name="new-chat-select"
                    type={type === ConversationType.Dm ? 'radio' : 'checkbox'}
                    checked={checked}
                    onChange={() => toggle(u.id)}
                  />
                  <div>
                    <div className="text-sm font-medium">{u.username}</div>
                    <div className="text-xs opacity-70">{u.email}</div>
                  </div>
                </label>
              );
            })}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={createChat} disabled={!canCreate}>
            {creating ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Composer({
  onSend,
  onTyping,
}: {
  onSend: (text: string) => void;
  onTyping: () => void;
}) {
  const [val, setVal] = useState('');
  const [emojiOpen, setEmojiOpen] = useState(false);

  function submit() {
    const text = val.trim();
    if (!text) return;
    onSend(text);
    setVal('');
  }

  return (
    <div className="border-t p-3">
      <div className="flex gap-2 items-end">
        <button
          type="button"
          aria-label="Emoji"
          className="px-2 py-2 rounded-md border hover:bg-[color:var(--muted)]"
          onClick={() => setEmojiOpen((v) => !v)}
        >
          😊
        </button>

        <TextareaAutosize
          minRows={1}
          maxRows={8}
          className="flex-1 resize-none rounded-md border p-2 text-sm leading-5 bg-transparent focus-visible:outline-none"
          placeholder="Type a message…"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <Button onClick={submit}>Send</Button>
      </div>

      {emojiOpen && (
        <div className="mt-2 text-sm opacity-70">
          {/* Placeholder: plug an emoji picker later */}
          Emoji picker goes here…
        </div>
      )}
    </div>
  );
}

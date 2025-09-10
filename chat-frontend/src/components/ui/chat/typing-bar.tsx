'use client';
export function TypingBar({ text }: { text?: string }) {
  if (!text) return null;
  return <div className="px-4 py-1 text-xs opacity-70">{text}</div>;
}

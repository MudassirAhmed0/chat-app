'use client';
import { useListQuery } from '@/gql/graphql';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export default function AppHome() {
  const { data, loading, error } = useListQuery();
  if (loading) return <main className="container py-12">Loading…</main>;
  if (error) return <main className="container py-12 text-red-600">{error.message}</main>;

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Your conversations</h1>
      <ul className="space-y-2">
        {/* @ts-ignore */}
        {data.listConversations.items.map((c: any) => (
          <li key={c.id} className="p-4 rounded-xl border">
            <div className="text-sm opacity-70">{c.type}</div>
            <div className="font-medium">{c.title ?? 'Direct chat'}</div>
            <div className="text-sm">
              Members: {c.participants.map((p: any) => p.username).join(', ')}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

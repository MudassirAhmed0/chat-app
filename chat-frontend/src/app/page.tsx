'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const HEALTH = gql`
  query Health {
    health {
      ok
      uptime
      env
    }
  }
`;

type HealthQuery = {
  health: {
    ok: boolean;
    uptime: number;
    env: string;
  };
};
export default function HomePage() {
  const { data, loading, error } = useQuery<HealthQuery>(HEALTH);
  return (
    <main className="container py-20">
      <h1 className="text-3xl font-bold mb-4">Chat App</h1>
      {loading && <p>Checking backend…</p>}
      {error && <p className="text-red-600">Failed: {error.message}</p>}
      {data && (
        <div className="mt-2 text-sm">
          <div>ok: {String(data.health.ok)}</div>
          <div>uptime: {data.health.uptime}s</div>
          <div>env: {data.health.env}</div>
        </div>
      )}
    </main>
  );
}

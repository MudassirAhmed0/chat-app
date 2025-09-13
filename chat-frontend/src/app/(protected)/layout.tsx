'use client';
import { Sidebar } from '@/components/ui/chat/sidebar';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-[100dvh] flex flex-col">{children}</div>
    </div>
  );
}

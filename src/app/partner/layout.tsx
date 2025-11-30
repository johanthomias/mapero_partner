import type { ReactNode } from 'react';

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-6 py-10 text-text">
      {children}
    </div>
  );
}

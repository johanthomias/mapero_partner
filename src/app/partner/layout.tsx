import type { ReactNode } from 'react';

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white from-[#130D0F] via-[#1B1014] to-[#050304] px-6 py-10 text-white">
      {children}
    </div>
  );
}

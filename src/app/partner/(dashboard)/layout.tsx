"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Store, Sparkles, LineChart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

const navLinks = [
  { href: '/partner/dashboard', label: 'Tableau de bord', icon: LineChart },
  { href: '/partner/offers', label: 'Offres Mapéro', icon: Sparkles },
  { href: '/partner/establishment', label: 'Mon établissement', icon: Store },
];

export default function PartnerDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.push('/partner/login');
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row">
      <aside className="flex min-w-[240px] flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-white/50">Partenaire</span>
          <h2 className="text-lg font-semibold text-white">Mon espace Mapéro</h2>
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:text-white',
                  isActive && 'bg-primary/20 text-white shadow-glow',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="mt-auto flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-xs uppercase tracking-wide text-white/60 transition hover:border-primary hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

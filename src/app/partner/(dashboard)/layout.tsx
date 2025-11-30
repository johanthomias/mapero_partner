"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LineChart, Sparkles, Store, LogOut, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/partner/dashboard', label: 'Tableau de bord', icon: LineChart },
  { href: '/partner/offers', label: 'Offres Mapéro', icon: Sparkles },
  { href: '/partner/establishment', label: 'Mon établissement', icon: Store },
];

export default function PartnerDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore((state) => ({
    logout: state.logout,
    user: state.user,
  }));

  const initials = `${user?.firstName?.[0] ?? 'M'}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push('/partner/login');
  };

  return (
    <div className="mx-auto flex gap-8">
      <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] flex-col items-center rounded-xl bg-card p-4 shadow-card md:flex">
        <div className="flex flex-1 flex-col items-center gap-6">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl text-subtleText transition hover:bg-primary hover:text-white',
                  isActive && 'bg-primary text-text shadow-card'
                )}
                aria-label={label}
                title={label}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-subtleText")} />
              </Link>
            );
          })}

        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex h-12 w-12 items-center justify-center rounded-2xl text-subtleText transition hover:bg-danger/10 hover:text-danger"
          aria-label="Déconnexion"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </aside>

      <div className="flex w-full flex-1 flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-subtleText">Bienvenue dans votre espace</p>
            <h1 className="text-2xl font-semibold text-text">Partenaire Mapéro</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 border border-border text-subtleText hover:text-text"
              onClick={() => router.push('/partner/establishment')}
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-primary text-white shadow-card hover:opacity-90"
              onClick={() => router.push('/partner/offers/new')}
            >
              <Plus className="h-4 w-4" />
              Nouvelle offre
            </Button>
            <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-sm font-semibold">{initials}</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-text">
                  {user ? `${user.firstName} ${user.lastName}` : 'Mon compte'}
                </p>
                <p className="text-subtleText">{user?.email ?? 'Partenaire Mapéro'}</p>
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}

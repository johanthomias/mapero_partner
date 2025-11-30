"use client";

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
  className,
}: DashboardLayoutProps) {
  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text">{title}</h2>
          {subtitle ? <p className="text-sm text-subtleText">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

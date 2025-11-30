"use client";

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type TrendVariant = 'positive' | 'negative' | 'neutral';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    label: string;
    variant?: TrendVariant;
  };
  accent?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  isLoading?: boolean;
}

const variantToColor: Record<TrendVariant, string> = {
  positive: 'text-success',
  negative: 'text-danger',
  neutral: 'text-subtleText',
};

const accentBg: Record<NonNullable<DashboardCardProps['accent']>, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export function DashboardCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  className,
  accent = 'primary',
  isLoading,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card ring-1 ring-border/60',
        className,
      )}
    >
      <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-subtleText">{title}</span>
            {subtitle ? <span className="text-xs text-subtleText">{subtitle}</span> : null}
          </div>
          <span className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', accentBg[accent])}>
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-3xl font-semibold text-text">{isLoading ? '—' : value}</p>
        {trend ? (
          <span className={cn('text-sm font-medium', variantToColor[trend.variant ?? 'neutral'])}>
            {trend.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

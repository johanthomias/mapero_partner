"use client";

import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  helper?: string;
  trend?: number;
}

export function StatsCard({ label, value, icon: Icon, helper, trend }: StatsCardProps) {
  const trendColor = trend && trend >= 0 ? 'text-emerald-400' : 'text-danger';
  const trendLabel = trend ? `${trend > 0 ? '+' : ''}${trend}%` : null;

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-white/10 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-widest text-text/50">{label}</span>
        <span className="text-2xl font-semibold text-text">{value}</span>
        <div className="flex items-center gap-3 text-xs text-text/60">
          {helper ? <span>{helper}</span> : null}
          {trendLabel ? <span className={trendColor}>{trendLabel}</span> : null}
        </div>
      </div>
    </div>
  );
}

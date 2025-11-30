"use client";

import { cn } from '@/lib/utils';

interface ChartPoint {
  label: string;
  value: number;
}

interface DashboardChartProps {
  title: string;
  subtitle?: string;
  data: ChartPoint[];
  className?: string;
}

export function DashboardChart({ title, subtitle, data, className }: DashboardChartProps) {
  const points = data.length ? data : [{ label: '—', value: 0 }];
  const maxValue = points.reduce((acc, point) => Math.max(acc, point.value), 1);

  const chartPath = points
    .map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * 100;
      const y = 100 - (point.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const lastPoint = points[points.length - 1];
  const lastIndex = points.length - 1;
  const lastPosition = (lastIndex / (points.length - 1 || 1)) * 100;

  return (
    <div
      className={cn(
        'rounded-2xl bg-card p-6 shadow-card ring-1 ring-border/60',
        className,
      )}
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtleText">{title}</p>
          {subtitle ? <p className="text-sm text-subtleText">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-subtleText transition hover:text-text"
        >
          Derniers 7 jours
          <span aria-hidden>▾</span>
        </button>
      </div>
      <div className="relative h-64 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full text-primary">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={chartPath}
          />
          <polygon
            fill="url(#chartGradient)"
            points={`0,100 ${chartPath} 100,100`}
            opacity={0.6}
          />
        </svg>
        <div className="absolute inset-0 flex items-end justify-between px-2 text-xs text-subtleText">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
        <div
          className="pointer-events-none absolute flex flex-col items-center text-sm font-semibold text-text"
          style={{
            left: `${lastPosition}%`,
            bottom: `${(lastPoint.value / maxValue) * 100}%`,
            transform: 'translate(-50%, 25%)',
          }}
        >
          <span className="rounded-full bg-primary px-3 py-1 text-xs text-white shadow-card">
            {lastPoint.value}
          </span>
          <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

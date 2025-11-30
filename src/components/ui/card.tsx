import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-[0_20px_60px_-20px_rgba(255,91,46,0.45)]',
        className,
      )}
    />
  );
}

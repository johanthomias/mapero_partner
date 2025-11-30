import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white shadow-glow hover:bg-primary-light',
        secondary:
          'bg-white text-background font-semibold hover:bg-white/90 focus-visible:ring-white/80',
        ghost: 'bg-transparent text-text border border-white/30 hover:border-primary hover:text-primary',
      },
      size: {
        xs: 'px-3 py-2 text-xs font-semibold',
        sm: 'px-4 py-2 text-sm font-medium',
        md: 'px-5 py-3 text-base font-semibold',
        lg: 'px-6 py-4 text-lg font-semibold',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

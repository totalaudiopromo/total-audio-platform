import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'gradient';
}

export function Card({ children, className, padding = 'md', variant = 'default' }: CardProps) {
  return (
    <div
      className={clsx(
        'card-brutal',
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'hover:shadow-brutal-hover hover:-translate-y-0.5': variant === 'elevated',
          'bg-gradient-to-br from-brand-slate/10 to-brand-slate-light/5': variant === 'gradient',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

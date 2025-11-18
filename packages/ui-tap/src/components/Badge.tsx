import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * TAP Badge Component
 *
 * Status indicator badge.
 * - Variant-based colouring
 * - Small and medium sizes
 * - Circular or pill-shaped
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-full',
        {
          'bg-tap-slate-700 text-tap-slate-200': variant === 'default',
          'bg-tap-success text-white': variant === 'success',
          'bg-tap-error text-white': variant === 'error',
          'bg-tap-warning text-white': variant === 'warning',
        },
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  );
}

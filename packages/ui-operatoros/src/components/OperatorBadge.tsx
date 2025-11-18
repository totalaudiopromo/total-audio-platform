import React from 'react';
import { clsx } from 'clsx';

export interface OperatorBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * OperatorBadge Component
 *
 * Status/info badge for OperatorOS.
 * - Variant-based colouring (theme-aware)
 * - Small and medium sizes
 * - Subtle, not overdone
 */
export function OperatorBadge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: OperatorBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-colors duration-[240ms]',
        {
          'bg-[var(--operator-muted)] text-[var(--operator-foreground)]':
            variant === 'default',
          'bg-[var(--operator-accent)]/20 text-[var(--operator-accent)] border border-[var(--operator-accent)]/30':
            variant === 'accent',
          'bg-green-500/20 text-green-400 border border-green-500/30':
            variant === 'success',
          'bg-red-500/20 text-red-400 border border-red-500/30':
            variant === 'error',
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

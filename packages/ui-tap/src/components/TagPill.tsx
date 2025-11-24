import React from 'react';
import { clsx } from 'clsx';

export interface TagPillProps {
  children: React.ReactNode;
  intent?: 'default' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

/**
 * TAP TagPill Component
 *
 * Small pill-shaped tag for status, categories, etc.
 * - Intent-based colouring
 * - Compact sizing
 * - Matte finish
 */
export function TagPill({ children, intent = 'default', className }: TagPillProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-tap-sm text-xs font-medium',
        'border',
        {
          'bg-tap-slate-800 text-tap-slate-300 border-tap-border':
            intent === 'default',
          'bg-tap-success-50/10 text-tap-success border-tap-success/30':
            intent === 'success',
          'bg-tap-error-50/10 text-tap-error border-tap-error/30':
            intent === 'error',
          'bg-tap-warning-50/10 text-tap-warning border-tap-warning/30':
            intent === 'warning',
          'bg-tap-cyan-50/10 text-tap-cyan border-tap-cyan/30':
            intent === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}

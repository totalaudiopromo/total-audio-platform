import React from 'react';
import { clsx } from 'clsx';

export interface OperatorGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 2 | 3 | 4 | 6 | 8;
  className?: string;
}

/**
 * OperatorGrid Component
 *
 * Responsive grid layout for OperatorOS.
 * - Configurable columns and gaps
 * - Responsive by default
 */
export function OperatorGrid({
  children,
  columns = 3,
  gap = 4,
  className,
}: OperatorGridProps) {
  return (
    <div
      className={clsx(
        'grid',
        {
          'grid-cols-1': columns === 1,
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
          'grid-cols-6': columns === 6,
          'grid-cols-12': columns === 12,
        },
        {
          'gap-2': gap === 2,
          'gap-3': gap === 3,
          'gap-4': gap === 4,
          'gap-6': gap === 6,
          'gap-8': gap === 8,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

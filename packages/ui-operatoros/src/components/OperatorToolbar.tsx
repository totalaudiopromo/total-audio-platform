import React from 'react';
import { clsx } from 'clsx';

export interface OperatorToolbarProps {
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom';
}

/**
 * OperatorToolbar Component
 *
 * Toolbar for window/panel actions.
 * - Top or bottom positioning
 * - Flex layout for actions
 * - Theme-aware styling
 */
export function OperatorToolbar({
  children,
  className,
  position = 'top',
}: OperatorToolbarProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 px-3 py-2',
        'bg-[var(--operator-muted)] border-[var(--operator-border)]',
        {
          'border-b': position === 'top',
          'border-t': position === 'bottom',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

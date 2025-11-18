import React from 'react';
import { clsx } from 'clsx';

export interface OperatorPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'flat';
}

/**
 * OperatorPanel Component
 *
 * Generic panel/section container for OperatorOS.
 * - Flexible variants (default, card, flat)
 * - Optional title
 * - Theme-aware styling via CSS variables
 */
export function OperatorPanel({
  title,
  children,
  className,
  variant = 'default',
}: OperatorPanelProps) {
  return (
    <div
      className={clsx(
        'operator-panel',
        {
          'border border-[var(--operator-border)] rounded-lg p-4': variant === 'card',
          'bg-[var(--operator-muted)] rounded-md p-3': variant === 'default',
          'p-0': variant === 'flat',
        },
        className
      )}
    >
      {title && (
        <h4 className="text-sm font-semibold mb-3 text-[var(--operator-foreground)]">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

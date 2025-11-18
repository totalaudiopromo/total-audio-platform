import React from 'react';
import { clsx } from 'clsx';

export interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * TAP PageShell Component
 *
 * Page-level layout container for TAP apps.
 * - Near-black background (not pure black)
 * - Full viewport height
 * - Consistent padding
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={clsx(
        'min-h-screen bg-tap-slate-900 text-tap-slate-100',
        'p-4 md:p-6 lg:p-8',
        className
      )}
    >
      {children}
    </div>
  );
}

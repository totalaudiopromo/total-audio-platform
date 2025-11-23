import React from 'react';
import { clsx } from 'clsx';

export interface ToolbarProps {
  title?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * TAP Toolbar Component
 *
 * Header toolbar with optional title and actions.
 * - Used at top of pages/sections
 * - Flex layout for title + actions
 * - Subtle bottom border
 */
export function Toolbar({ title, actions, children, className }: ToolbarProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-4',
        'px-6 py-4 border-b border-tap-border-subtle',
        'bg-tap-slate-800/50',
        className
      )}
    >
      {title && (
        <h2 className="text-xl font-semibold text-tap-slate-100">{title}</h2>
      )}
      {children}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

import React from 'react';
import { clsx } from 'clsx';

export interface OperatorListItemProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * OperatorListItem Component
 *
 * List item for menus, file browsers, etc.
 * - Hover and selected states
 * - Click handling
 * - Keyboard navigation support (via parent)
 */
export function OperatorListItem({
  children,
  selected = false,
  onClick,
  className,
}: OperatorListItemProps) {
  return (
    <div
      className={clsx(
        'px-3 py-2 cursor-pointer',
        'transition-all duration-[240ms]',
        'text-[var(--operator-foreground)]',
        {
          'bg-[var(--operator-accent)]/20 font-medium': selected,
          'hover:bg-[var(--operator-muted)] hover:translate-x-0.5': !selected,
        },
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
}

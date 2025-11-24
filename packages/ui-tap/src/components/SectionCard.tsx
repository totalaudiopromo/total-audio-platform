import React from 'react';
import { clsx } from 'clsx';

export interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

/**
 * TAP SectionCard Component
 *
 * Card component for grouping related content.
 * - Slate-800 background (matte)
 * - Subtle border
 * - Optional header with title/subtitle
 * - No harsh shadows or gradients
 */
export function SectionCard({
  title,
  subtitle,
  children,
  className,
  headerClassName,
}: SectionCardProps) {
  return (
    <div
      className={clsx(
        'bg-tap-slate-800 border border-tap-border rounded-tap-lg',
        'shadow-tap-sm',
        className
      )}
    >
      {(title || subtitle) && (
        <div
          className={clsx(
            'border-b border-tap-border-subtle px-6 py-4',
            headerClassName
          )}
        >
          {title && (
            <h3 className="text-lg font-semibold text-tap-slate-100">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-tap-slate-400">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

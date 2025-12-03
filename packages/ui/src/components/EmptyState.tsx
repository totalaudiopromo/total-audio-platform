'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '../lib/utils';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  valueReminder?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  className?: string;
}

/**
 * EmptyState Component
 *
 * Displays an empty state with brutalist design system styling.
 * Used across Total Audio apps when lists or collections are empty.
 *
 * Features:
 * - Bold black borders and hard shadows (brutalist aesthetic)
 * - Icon + title + description layout
 * - Optional value reminder text
 * - Primary and secondary action buttons
 * - WCAG 2.2 Level AA compliant (44px touch targets)
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<FileText className="h-8 w-8 text-blue-600" />}
 *   title="No campaigns yet"
 *   description="Create your first campaign to start tracking radio submissions."
 *   valueReminder="Track submissions, follow up automatically, measure results"
 *   primaryAction={{
 *     label: "Create Campaign",
 *     href: "/campaigns/new"
 *   }}
 *   secondaryAction={{
 *     label: "Watch Demo",
 *     href: "/demo"
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  valueReminder,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border-4 border-black p-8',
        'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        className
      )}
    >
      {/* Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        {icon}
      </div>

      {/* Content */}
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-black text-gray-900">{title}</h3>
        <p className="mt-3 text-gray-600 font-bold">{description}</p>

        {/* Value Reminder */}
        {valueReminder && <p className="mt-4 text-sm font-bold text-blue-600">{valueReminder}</p>}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className={cn(
                  'inline-flex items-center justify-center',
                  'px-6 py-3 bg-blue-600 text-white font-black rounded-xl',
                  'border-4 border-black',
                  'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
                  'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
                  'hover:-translate-y-0.5',
                  'transition-all duration-150',
                  'min-h-[44px]',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/50'
                )}
              >
                {primaryAction.label}
              </Link>
            )}

            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className={cn(
                  'inline-flex items-center justify-center',
                  'px-6 py-3 bg-white text-gray-900 font-black rounded-xl',
                  'border-4 border-black',
                  'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
                  'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
                  'hover:-translate-y-0.5',
                  'transition-all duration-150',
                  'min-h-[44px]',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-900/50'
                )}
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

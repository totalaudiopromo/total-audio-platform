import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

/**
 * TAP Skeleton Component
 *
 * Loading placeholder for content.
 * - Matte slate background
 * - Subtle pulse animation
 * - Variants for different content types
 */
export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-tap-slate-700',
        {
          'h-4 rounded-tap-sm': variant === 'text',
          'rounded-full aspect-square': variant === 'circular',
          'rounded-tap-md': variant === 'rectangular',
        },
        className
      )}
    />
  );
}

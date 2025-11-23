import React from 'react';
import { clsx } from 'clsx';

export interface MetricStatProps {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

/**
 * TAP MetricStat Component
 *
 * Display metric with label, value, and optional delta indicator.
 * - Used in dashboards and analytics views
 * - Colour-coded delta (success/error/neutral)
 * - Matte aesthetic
 */
export function MetricStat({ label, value, delta, className }: MetricStatProps) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <span className="text-sm text-tap-slate-400 font-medium">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-tap-slate-100">{value}</span>
        {delta && (
          <span
            className={clsx('text-sm font-medium', {
              'text-tap-success': delta.trend === 'up',
              'text-tap-error': delta.trend === 'down',
              'text-tap-slate-400': delta.trend === 'neutral',
            })}
          >
            {delta.trend === 'up' && '↑ '}
            {delta.trend === 'down' && '↓ '}
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}

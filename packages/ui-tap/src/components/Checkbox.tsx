import React from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/**
 * TAP Checkbox Component
 *
 * Checkbox input with optional label.
 * - Cyan accent when checked
 * - Slate borders
 * - 240ms transitions
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            'w-4 h-4 rounded-tap-sm',
            'border-2 border-tap-border bg-tap-slate-800',
            'text-tap-cyan focus:ring-2 focus:ring-tap-cyan focus:ring-offset-2 focus:ring-offset-tap-slate-900',
            'transition-all duration-tap',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {label && <span className="text-sm text-tap-slate-200">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

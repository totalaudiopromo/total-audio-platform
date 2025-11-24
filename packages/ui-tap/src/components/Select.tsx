import React from 'react';
import { clsx } from 'clsx';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

/**
 * TAP Select Component
 *
 * Select dropdown with optional label and error state.
 * - Matches Input styling
 * - Slate background
 * - Cyan focus ring
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-tap-slate-200">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'w-full px-3 py-2 rounded-tap-md',
            'bg-tap-slate-800 border text-tap-slate-100',
            'transition-all duration-tap',
            'focus:outline-none focus:ring-2 focus:ring-tap-cyan focus:border-transparent',
            error
              ? 'border-tap-error focus:ring-tap-error'
              : 'border-tap-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-tap-error">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-tap-slate-400">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

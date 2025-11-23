import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * TAP Input Component
 *
 * Text input field with optional label and error state.
 * - Slate background
 * - Cyan focus ring
 * - Error state styling
 * - 240ms transitions
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-tap-slate-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-3 py-2 rounded-tap-md',
            'bg-tap-slate-800 border text-tap-slate-100',
            'transition-all duration-tap',
            'placeholder:text-tap-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-tap-cyan focus:border-transparent',
            error
              ? 'border-tap-error focus:ring-tap-error'
              : 'border-tap-border',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-tap-error">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-tap-slate-400">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

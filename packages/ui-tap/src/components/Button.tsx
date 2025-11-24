import React from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * TAP Button Component
 *
 * Design constraints:
 * - Primary: Slate cyan accent for main actions
 * - Secondary: Muted slate for secondary actions
 * - Ghost: Transparent with hover state
 * - 240ms transition timing
 * - No harsh gradients or glows
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-all duration-tap',
        'focus:outline-none focus:ring-2 focus:ring-tap-cyan focus:ring-offset-2 focus:ring-offset-tap-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',

        // Variant styles
        {
          // Primary: Cyan accent
          'bg-tap-cyan text-white hover:bg-tap-cyan-500 active:bg-tap-cyan-600':
            variant === 'primary',

          // Secondary: Muted slate
          'bg-tap-slate-700 text-tap-slate-100 hover:bg-tap-slate-600 active:bg-tap-slate-500':
            variant === 'secondary',

          // Ghost: Transparent with hover
          'bg-transparent text-tap-slate-300 hover:bg-tap-slate-800 hover:text-tap-slate-100':
            variant === 'ghost',
        },

        // Size styles
        {
          'px-3 py-1.5 text-sm rounded-tap-sm': size === 'sm',
          'px-4 py-2 text-base rounded-tap-md': size === 'md',
          'px-6 py-3 text-lg rounded-tap-lg': size === 'lg',
        },

        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  { bg: string; border: string; icon: React.ReactNode; text: string }
> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    text: 'text-green-900',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    icon: <AlertCircle className="h-5 w-5 text-red-600" />,
    text: 'text-red-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
    text: 'text-amber-900',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    icon: <Info className="h-5 w-5 text-blue-600" />,
    text: 'text-blue-900',
  },
};

/**
 * Toast Notification Component
 *
 * Displays a single toast notification with Postcraft aesthetic:
 * - Bold black borders (border-2)
 * - Hard offset shadows (shadow-[4px_4px_0px_0px_rgba(0,0,0,1)])
 * - No gradients, no soft shadows, no glassmorphism
 *
 * @example
 * ```tsx
 * <Toast
 *   id="toast-1"
 *   type="success"
 *   title="Success"
 *   message="Contact enriched successfully!"
 *   duration={5000}
 *   onClose={(id) => console.log('Closed:', id)}
 * />
 * ```
 */
export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const style = toastStyles[type];
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    if (duration === Infinity) return;

    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onClose(id);
      }, 150);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 150);
  };

  return (
    <div
      className={cn(
        'transform transition-all duration-150',
        isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
    >
      <div
        className={cn(
          'flex items-start gap-3 rounded-lg border-2 border-black p-4',
          style.bg,
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
          'max-w-md'
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0 pt-0.5">{style.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className={cn('font-semibold', style.text)}>{title}</p>}
          <p className={cn(title ? 'mt-1 text-sm' : '', style.text)}>{message}</p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 p-1 rounded transition-colors',
            'hover:bg-black/10',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50'
          )}
          aria-label={`Close ${type} notification`}
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

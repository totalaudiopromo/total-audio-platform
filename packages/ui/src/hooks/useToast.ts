'use client';

import * as React from 'react';
import type { ToastType } from '../components/Toast';

export interface UseToastOptions {
  duration?: number;
}

export interface ShowToastOptions extends UseToastOptions {
  title?: string;
}

/**
 * useToast Hook
 *
 * Provides methods to show toast notifications from anywhere in your app.
 * Requires ToastContainer to be rendered in your root layout.
 *
 * @example
 * ```tsx
 * const { success, error, warning, info } = useToast();
 *
 * // Show success toast
 * success({
 *   title: 'Contact enriched',
 *   message: 'Contact details added successfully',
 *   duration: 3000
 * });
 *
 * // Show error toast
 * error('Something went wrong. Please try again.');
 *
 * // Show warning toast
 * warning({
 *   title: 'Warning',
 *   message: 'This action cannot be undone',
 * });
 * ```
 */
export function useToast() {
  const showToast = React.useCallback(
    (type: ToastType, message: string | ShowToastOptions, options?: UseToastOptions) => {
      const isString = typeof message === 'string';
      const payload = {
        type,
        message: isString ? message : message.message,
        title: !isString ? message.title : undefined,
        duration: !isString ? (message.duration ?? options?.duration) : options?.duration,
      };

      // Get toast container reference
      const container = (window as any).__toastContainer;

      if (!container) {
        console.error('ToastContainer not found. Make sure it is rendered in your root layout.');
        return null;
      }

      return container.add(payload);
    },
    []
  );

  const success = React.useCallback(
    (message: string | ShowToastOptions, options?: UseToastOptions) => {
      return showToast('success', message, options);
    },
    [showToast]
  );

  const error = React.useCallback(
    (message: string | ShowToastOptions, options?: UseToastOptions) => {
      return showToast('error', message, options);
    },
    [showToast]
  );

  const warning = React.useCallback(
    (message: string | ShowToastOptions, options?: UseToastOptions) => {
      return showToast('warning', message, options);
    },
    [showToast]
  );

  const info = React.useCallback(
    (message: string | ShowToastOptions, options?: UseToastOptions) => {
      return showToast('info', message, options);
    },
    [showToast]
  );

  return {
    success,
    error,
    warning,
    info,
    show: showToast,
  };
}

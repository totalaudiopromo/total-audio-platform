'use client';

import * as React from 'react';
import { Toast, type ToastProps } from './Toast';

export interface ToastState extends Omit<ToastProps, 'onClose'> {
  id: string;
}

/**
 * ToastContainer Component
 *
 * Manages multiple toast notifications and positions them
 * in the bottom-right corner with proper stacking and animations.
 *
 * @example
 * ```tsx
 * <ToastContainer />
 * ```
 */
export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  // Make container available globally for toast hook
  React.useEffect(() => {
    // Store reference on window for useToast hook to access
    (window as any).__toastContainer = {
      add: (toast: Omit<ToastState, 'id'>) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { ...toast, id }]);
        return id;
      },
      remove: (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
      },
    };

    return () => {
      delete (window as any).__toastContainer;
    };
  }, []);

  const handleClose = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={handleClose} />
        </div>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = (type: string) => {
    const baseStyles = {
      padding: '1rem 1.25rem',
      borderRadius: '12px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      maxWidth: '400px',
      animation: 'slideIn 0.3s ease-out'
    };

    switch (type) {
      case 'success':
        return { ...baseStyles, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' };
      case 'error':
        return { ...baseStyles, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' };
      case 'warning':
        return { ...baseStyles, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' };
      case 'info':
        return { ...baseStyles, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white' };
      default:
        return { ...baseStyles, background: 'rgba(255, 255, 255, 0.9)', color: '#374151' };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div
      style={getToastStyles(toast.type)}
      onClick={() => onRemove(toast.id)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>
          {getIcon(toast.type)}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            {toast.title}
          </div>
          {toast.message && (
            <div style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.4' }}>
              {toast.message}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(toast.id);
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '6px',
            color: 'inherit',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

let toastId = 0;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${++toastId}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Make addToast globally available
  useEffect(() => {
    (window as any).showToast = addToast;
    return () => {
      delete (window as any).showToast;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Utility functions for easy toast usage
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({ type: 'success', title, message, duration });
    }
  },
  error: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({ type: 'error', title, message, duration });
    }
  },
  warning: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({ type: 'warning', title, message, duration });
    }
  },
  info: (title: string, message?: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({ type: 'info', title, message, duration });
    }
  }
};
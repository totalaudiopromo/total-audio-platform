'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Fallback UI to show when error occurs
   */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
  /**
   * Optional callback when error is caught
   */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /**
   * Optional callback when reset is triggered
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Uses Postcraft aesthetic with bold borders and hard shadows.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, info) => console.error(error)}
 *   onReset={() => window.location.reload()}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log error to console
    console.error('[ErrorBoundary] Error caught:', error);
    console.error('[ErrorBoundary] Error info:', info);

    // Call optional error handler
    this.props.onError?.(error, info);

    // In production, you might want to log to an external service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error logging service
      // Sentry.captureException(error, { contexts: { react: info } })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });

    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI with Postcraft aesthetic
      return (
        <div className="mx-auto w-full max-w-2xl p-4">
          <div
            className={cn(
              'rounded-lg border-2 border-black bg-red-50 p-6',
              'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
            )}
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-900">Something went wrong</h2>
                <p className="mt-2 text-sm text-red-800">
                  An unexpected error occurred. Please try refreshing the page or contact support if
                  the problem persists.
                </p>
              </div>
            </div>

            {/* Error details (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 rounded border border-red-300 bg-red-100/50 p-3">
                <p className="text-xs font-mono font-semibold text-red-900">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="mt-2 max-h-48 overflow-auto text-xs text-red-800 font-mono whitespace-pre-wrap break-words">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={this.handleReset}
                className={cn(
                  'inline-flex items-center justify-center rounded-xl',
                  'border-2 border-black bg-white',
                  'px-4 py-2 text-sm font-semibold text-black',
                  'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
                  'transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500'
                )}
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  'inline-flex items-center justify-center rounded-xl',
                  'border-2 border-black bg-white',
                  'px-4 py-2 text-sm font-semibold text-black',
                  'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
                  'transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500'
                )}
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Async Error Boundary Component
 * Catches both synchronous and asynchronous errors
 *
 * @example
 * ```tsx
 * <AsyncErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>Error: {error.message}</p>
 *       <button onClick={reset}>Retry</button>
 *     </div>
 *   )}
 * >
 *   <AsyncComponent />
 * </AsyncErrorBoundary>
 * ```
 */
export function AsyncErrorBoundary({ children, fallback, onError, onReset }: ErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError} onReset={onReset}>
      <React.Suspense fallback={<div className="p-4 text-gray-600">Loading...</div>}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}

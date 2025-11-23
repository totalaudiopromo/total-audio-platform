/**
 * ErrorState - Display error messages with retry option
 */

import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  code,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="text-center max-w-md">
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full bg-[#D96A6A]/10 border border-[#D96A6A]/30 flex items-center justify-center mx-auto">
            <svg
              className="w-6 h-6 text-[#D96A6A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-4">{message}</p>

        {code && (
          <div
            className="inline-block px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-400 mb-4"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {code}
          </div>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-[#3AA9BE] hover:bg-[#3AA9BE]/80 text-white text-sm font-medium rounded transition-colors duration-200"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

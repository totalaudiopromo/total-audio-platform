/**
 * EmptyState - Display when no data is available
 */

import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title = 'No data available',
  message = 'There's nothing to display here yet.',
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="text-center max-w-md">
        {icon ? (
          <div className="mb-4">{icon}</div>
        ) : (
          <div className="mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          </div>
        )}

        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-4">{message}</p>

        {action && (
          <button
            onClick={action.onClick}
            className="px-4 py-2 bg-[#3AA9BE] hover:bg-[#3AA9BE]/80 text-white text-sm font-medium rounded transition-colors duration-200"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

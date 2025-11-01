'use client';

import React from 'react';
import { ErrorContext, getUserFriendlyError } from '@/utils/errorMessages';

interface ErrorMessageProps {
  context: ErrorContext;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({ context, onRetry, onDismiss }: ErrorMessageProps) {
  const error = getUserFriendlyError(context);

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg font-bold">!</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-red-900 mb-2">{error.title}</h3>
          <p className="text-red-800 font-bold mb-4">{error.message}</p>

          <div className="mb-4">
            <h4 className="font-bold text-red-900 mb-2">What you can try:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
              {error.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
            {error.actionText && error.actionUrl && (
              <a
                href={error.actionUrl}
                className="bg-white hover:bg-gray-50 text-red-600 font-bold px-4 py-2 rounded-lg border-2 border-red-600 transition-colors"
              >
                {error.actionText}
              </a>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-red-600 hover:text-red-800 font-bold px-4 py-2 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SuccessMessageProps {
  message: string;
  details?: string;
}

export function SuccessMessage({ message, details }: SuccessMessageProps) {
  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg font-bold">✓</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-green-900 mb-2">Success!</h3>
          <p className="text-green-800 font-bold">{message}</p>
          {details && <p className="text-sm text-green-700 mt-2">{details}</p>}
        </div>
      </div>
    </div>
  );
}

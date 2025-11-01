'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 border-4 border-red-600 mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Critical Error</h1>
          <p className="text-xl text-gray-600 mb-4 max-w-lg mx-auto">
            We encountered a critical error. Please refresh the page or contact support if the issue
            persists.
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 font-mono bg-gray-100 px-4 py-2 rounded-lg inline-block">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white font-black text-lg px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all hover:bg-amber-600"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 font-black text-lg px-8 py-4 border-2 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </a>
        </div>

        {/* Support Contact */}
        <div className="border-2 border-gray-300 rounded-xl p-8 bg-gray-50">
          <h3 className="text-2xl font-black text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            If refreshing doesn't work, please contact our support team with the error ID above.
          </p>
          <a
            href="mailto:support@totalaudiopromo.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white font-bold text-lg px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all hover:bg-amber-600"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}

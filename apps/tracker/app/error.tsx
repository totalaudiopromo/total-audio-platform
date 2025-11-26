'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Error card - neobrutalist style */}
        <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-red-50 to-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          {/* Error icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertTriangle
                className="w-12 h-12 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {/* Error badge */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-red-600 bg-red-100 px-5 py-2 text-sm font-bold uppercase tracking-wider text-red-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <AlertTriangle className="h-4 w-4" />
            Something Went Wrong
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900 sm:text-4xl">
            Oops! We Hit a Snag
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            We encountered an unexpected error. Don't worry, your campaign data
            is safe. Let's get you back on track.
          </p>

          {error.digest && (
            <p className="mt-4 text-xs text-gray-500 font-mono bg-gray-100 px-4 py-2 rounded-lg inline-block border-2 border-gray-200">
              Error ID: {error.digest}
            </p>
          )}

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-4 border-black bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-teal-700"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>
          </div>

          {/* Development error details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 bg-red-100 border-2 border-red-300 rounded-xl p-4 text-left">
              <h3 className="text-sm font-bold text-red-800 mb-2">
                Development Error Details
              </h3>
              <div className="bg-red-900/10 border border-red-300 rounded-lg p-3 overflow-auto">
                <p className="text-xs font-mono text-red-700 break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <pre className="mt-2 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Help text */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a
                href="mailto:info@totalaudiopromo.com"
                className="inline-flex items-center gap-1 font-bold text-teal-600 hover:underline"
              >
                <Mail className="w-4 h-4" />
                info@totalaudiopromo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

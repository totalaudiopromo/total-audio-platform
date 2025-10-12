'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
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
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-lg mx-auto">
            We encountered an unexpected error while processing your request. Don't worry, your data is safe.
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-lg px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 font-black text-lg px-8 py-4 border-2 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="glass-panel p-6 text-left">
            <h3 className="text-lg font-black text-gray-900 mb-3">
              Development Error Details
            </h3>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 overflow-auto">
              <p className="text-sm font-mono text-red-900 break-all">
                {error.message}
              </p>
              {error.stack && (
                <pre className="mt-3 text-xs text-red-800 overflow-x-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Helpful Actions */}
        <div className="glass-panel p-8 mt-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6">
            What can you do?
          </h3>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong className="font-black">1. Refresh the page</strong>
                <br />
                <span className="text-sm">Sometimes a simple refresh fixes the issue</span>
              </p>
              <p className="text-gray-700">
                <strong className="font-black">2. Clear your cache</strong>
                <br />
                <span className="text-sm">Try clearing your browser cache and cookies</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">
                <strong className="font-black">3. Try a different browser</strong>
                <br />
                <span className="text-sm">The issue might be browser-specific</span>
              </p>
              <p className="text-gray-700">
                <strong className="font-black">4. Contact support</strong>
                <br />
                <span className="text-sm">
                  If the problem persists,{' '}
                  <a href="mailto:support@totalaudiopromo.com" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                    email us
                  </a>
                  {error.digest && ` with error ID: ${error.digest}`}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            We've been notified of this error and will look into it.
          </p>
        </div>
      </div>
    </div>
  );
}

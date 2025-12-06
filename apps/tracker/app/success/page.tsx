'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  BarChart3,
  Target,
  Bell,
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id') ?? null;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  [
                    'bg-teal-500',
                    'bg-green-500',
                    'bg-yellow-400',
                    'bg-blue-500',
                  ][i % 4]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-xl w-full">
        {/* Success card */}
        <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-teal-50 to-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          {/* Success icon */}
          <div className="mb-6 flex justify-center">
            <div
              className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce"
              style={{ animationDuration: '2s' }}
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Success badge */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-teal-600 bg-teal-100 px-5 py-2 text-sm font-bold uppercase tracking-wider text-teal-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="h-4 w-4" />
            Payment Successful
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900 sm:text-4xl">
            Welcome to Campaign Tracker Pro!
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Your{' '}
            <span className="font-bold text-teal-600">14-day free trial</span>{' '}
            has started. You now have access to unlimited campaign tracking,
            analytics, and all Pro features.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 grid gap-3 text-left">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">
                Unlimited campaign tracking
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">
                Advanced analytics dashboard
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">
                Follow-up reminders
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-4 border-black bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-teal-700"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Return Home
            </Link>
          </div>

          {/* Help text */}
          <p className="mt-6 text-sm text-gray-600">
            Need help getting started?{' '}
            <a
              href="mailto:info@totalaudiopromo.com"
              className="font-bold text-teal-600 hover:underline"
            >
              info@totalaudiopromo.com
            </a>
          </p>

          {sessionId && sessionId !== 'dev_local' && (
            <p className="mt-3 text-xs text-gray-400 font-mono">
              Session: {sessionId.substring(0, 16)}...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

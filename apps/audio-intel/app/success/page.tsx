'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Check, Sparkles, ArrowRight, Mail, Zap } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti animation after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti burst animation */}
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
                  ['bg-green-500', 'bg-blue-500', 'bg-yellow-400', 'bg-pink-500'][i % 4]
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-xl w-full">
        {/* Success card - neobrutalist style */}
        <div className="glass-panel border-green-500 bg-gradient-to-br from-green-50 to-white p-10 text-center">
          {/* Success mascot */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/assets/loading-states/success-complete.png"
              alt="Success!"
              width={140}
              height={140}
              className="drop-shadow-lg animate-bounce"
              style={{ animationDuration: '2s' }}
              priority
            />
          </div>

          {/* Success badge */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-green-600 bg-green-100 px-5 py-2 text-sm font-bold uppercase tracking-wider text-green-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="h-4 w-4" />
            Payment Successful
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900 sm:text-4xl">
            Welcome to Audio Intel Pro!
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            Your <span className="font-bold text-green-600">14-day free trial</span> has started.
            You now have access to unlimited contact enrichment, priority support, and all Pro
            features.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 grid gap-3 text-left">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Unlimited contact enrichment</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Priority processing</span>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Direct founder support</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <Link
              href="/dashboard"
              className="cta-button w-full flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/" className="subtle-button w-full">
              Return Home
            </Link>
          </div>

          {/* Help text */}
          <p className="mt-6 text-sm text-gray-600">
            Need help getting started?{' '}
            <a
              href="mailto:info@totalaudiopromo.com"
              className="font-bold text-blue-600 hover:underline"
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

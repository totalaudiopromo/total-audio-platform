import Link from 'next/link';
import { Home, Search, Target, BarChart3 } from 'lucide-react';
import { AudioDogMascot } from '@/components/AudioDogMascot';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* 404 card - neobrutalist style */}
        <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-teal-50 to-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          {/* Audio the Dog - confused animation */}
          <div className="mb-6 flex justify-center">
            <AudioDogMascot mood="error" size="lg" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Page Not Found
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or the link might be incorrect.
          </p>

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-4 border-black bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-teal-700"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Return Home
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-black text-gray-900 mb-4">
              Looking for something?
            </h3>

            <div className="grid gap-3 text-left">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Your Campaigns</span>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Pricing Plans</span>
              </Link>
            </div>
          </div>

          {/* Help text */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a
                href="mailto:info@totalaudiopromo.com"
                className="font-bold text-teal-600 hover:underline"
              >
                info@totalaudiopromo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

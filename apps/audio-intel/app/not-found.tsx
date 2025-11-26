import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, Sparkles, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* 404 card - neobrutalist style */}
        <div className="rounded-2xl border-4 border-black bg-gradient-to-br from-blue-50 to-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          {/* Error mascot */}
          <div className="mb-6 flex justify-center">
            <Image
              src="/assets/loading-states/error-state.png"
              alt="Audio Intel mascot looking confused"
              width={140}
              height={140}
              className="drop-shadow-lg"
              priority
            />
          </div>

          {/* 404 badge */}
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-blue-600 bg-blue-100 px-5 py-2 text-sm font-bold uppercase tracking-wider text-blue-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Search className="h-4 w-4" />
            Page Not Found
          </div>

          <h1 className="mt-6 text-3xl font-black text-gray-900 sm:text-4xl">
            Oops! Page Not Found
          </h1>

          <p className="mt-4 text-lg text-gray-700">
            The page you're looking for doesn't exist. It might have been moved, deleted, or the
            link might be incorrect.
          </p>

          {/* CTAs */}
          <div className="mt-8 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-4 border-black bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:bg-blue-700"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Try the Demo
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-black text-gray-900 mb-4">Looking for something?</h3>

            <div className="grid sm:grid-cols-2 gap-3 text-left">
              <Link
                href="/demo"
                className="block text-blue-600 hover:text-blue-700 font-bold transition-colors hover:translate-x-1 duration-200"
              >
                → Try Audio Intel Demo
              </Link>
              <Link
                href="/pricing"
                className="block text-blue-600 hover:text-blue-700 font-bold transition-colors hover:translate-x-1 duration-200"
              >
                → View Pricing Plans
              </Link>
              <Link
                href="/beta"
                className="block text-blue-600 hover:text-blue-700 font-bold transition-colors hover:translate-x-1 duration-200"
              >
                → Join Beta Program
              </Link>
              <Link
                href="/blog"
                className="block text-blue-600 hover:text-blue-700 font-bold transition-colors hover:translate-x-1 duration-200"
              >
                → Music Industry Blog
              </Link>
            </div>
          </div>

          {/* Help text */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a
                href="mailto:info@totalaudiopromo.com"
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
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

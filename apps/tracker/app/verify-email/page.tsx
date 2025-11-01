import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Verify Your Email - Tracker',
  description: 'Verify your email address to access all Tracker features.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="glass-panel px-8 py-12 text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center border-4 border-teal-500">
          <svg
            className="w-10 h-10 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-black">Check Your Email</h1>
        <p className="mb-8 text-lg text-gray-700 leading-relaxed">
          We've sent a verification link to your email address. Click the link
          in the email to verify your account and access all Tracker features.
        </p>

        <div className="mb-8 bg-blue-50 rounded-xl p-6 border-2 border-blue-200 text-left">
          <h3 className="font-bold text-gray-900 mb-3">
            Haven't received the email?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold mt-0.5">→</span>
              <span>Check your spam or junk folder</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold mt-0.5">→</span>
              <span>Make sure you entered the correct email address</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold mt-0.5">→</span>
              <span>Wait a few minutes – emails can sometimes be delayed</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
          >
            Go to Dashboard
          </Link>
          <form
            action="/api/auth/resend-verification"
            method="post"
            className="inline"
          >
            <button
              type="submit"
              className="w-full px-8 py-4 bg-white text-gray-900 rounded-xl font-bold border-2 border-black hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
            >
              Resend Verification Email
            </button>
          </form>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Need help?{' '}
          <a
            href="mailto:support@totalaudiopromo.com"
            className="text-teal-600 font-bold hover:text-teal-700 underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

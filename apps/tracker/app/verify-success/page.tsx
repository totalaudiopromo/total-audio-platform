import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Email Verified - Tracker',
  description: 'Your email has been successfully verified.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifySuccessPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="glass-panel px-8 py-12 text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center border-4 border-green-500">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-black">Email Verified!</h1>
        <p className="mb-8 text-lg text-gray-700 leading-relaxed">
          Your email address has been successfully verified. You now have full access to all Tracker features.
        </p>

        <div className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-3">What's next?</h3>
          <ul className="space-y-3 text-left text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center border-2 border-black">
                <span className="text-white text-xs font-black">1</span>
              </div>
              <span><strong className="font-bold">Create your first campaign</strong> - Start tracking your music promotion efforts</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center border-2 border-black">
                <span className="text-white text-xs font-black">2</span>
              </div>
              <span><strong className="font-bold">Import contacts</strong> - Bring in contacts from Audio Intel or CSV</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center border-2 border-black">
                <span className="text-white text-xs font-black">3</span>
              </div>
              <span><strong className="font-bold">Track responses</strong> - Log results and get AI-powered insights</span>
            </li>
          </ul>
        </div>

        <Link
          href="/dashboard"
          className="inline-block px-12 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function GoogleSheetsConfigurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Integrations
        </Link>

        <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Google Sheets Connected!
              </h1>
              <p className="text-gray-600 font-medium">
                Your campaigns will now sync automatically
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6">
            <h3 className="font-black text-green-900 mb-2">What happens next?</h3>
            <ul className="space-y-2 text-green-800 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your campaigns sync to Google Sheets every 15 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Edit campaigns in either Tracker or Sheets - changes sync both ways</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Share spreadsheets with your team for collaboration</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/integrations')}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-xl border-2 border-black shadow-brutal hover:translate-y-0.5 transition-all"
            >
              Done
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-black px-6 py-3 rounded-xl border-2 border-black shadow-brutal hover:translate-y-0.5 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

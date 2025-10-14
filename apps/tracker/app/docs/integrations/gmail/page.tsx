import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function GmailGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Link
          href="/docs/integrations"
          className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Integration Guides
        </Link>

        <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-8">
          <div className="mb-8">
            <div className="inline-block bg-red-100 border-2 border-red-500 rounded-xl px-4 py-2 mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Gmail Integration</h1>
            <p className="text-xl text-gray-700 font-medium">
              Automatically detect when contacts reply to your pitches and update campaign status.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-700 font-medium mb-6">
              Tracker monitors your Gmail for replies to pitch emails. When a contact responds, the campaign
              status automatically updates to "Replied" and the reply snippet is saved to your campaign notes.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mb-4">Setup Steps</h2>
            <ol className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black">Connect Gmail</strong>
                  <p className="text-gray-700 font-medium">
                    Go to Dashboard → Integrations and click "Connect Gmail". Authorize Tracker to access your Gmail.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black">Send Pitches</strong>
                  <p className="text-gray-700 font-medium">
                    Send pitch emails from your connected Gmail account. Tracker will automatically track them.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black">Automatic Reply Detection</strong>
                  <p className="text-gray-700 font-medium">
                    When contacts reply, Tracker detects it and updates your campaign status automatically.
                  </p>
                </div>
              </li>
            </ol>

            <h2 className="text-2xl font-black text-gray-900 mb-4">What Gets Tracked</h2>
            <ul className="space-y-2 mb-8">
              <li className="flex gap-2"><span className="text-red-600 font-black">•</span><span className="text-gray-700 font-medium">Email subject and recipient</span></li>
              <li className="flex gap-2"><span className="text-red-600 font-black">•</span><span className="text-gray-700 font-medium">Reply detection and timestamp</span></li>
              <li className="flex gap-2"><span className="text-red-600 font-black">•</span><span className="text-gray-700 font-medium">Reply snippet (first 200 characters)</span></li>
              <li className="flex gap-2"><span className="text-red-600 font-black">•</span><span className="text-gray-700 font-medium">Campaign status updates</span></li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mb-4">Use Cases</h2>
            <div className="grid gap-4 mb-8">
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <h3 className="font-black text-gray-900 mb-2">✅ Never Miss a Reply</h3>
                <p className="text-gray-700 font-medium">
                  Automatically track which contacts responded to your pitches without manual checking.
                </p>
              </div>
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <h3 className="font-black text-gray-900 mb-2">📊 Response Rate Tracking</h3>
                <p className="text-gray-700 font-medium">
                  See which campaigns and platforms get the most responses to optimize your strategy.
                </p>
              </div>
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <h3 className="font-black text-gray-900 mb-2">⏰ Follow-Up Reminders</h3>
                <p className="text-gray-700 font-medium">
                  Quickly identify campaigns that haven't received replies and need follow-up.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <h3 className="text-lg font-black text-gray-900 mb-2">Questions?</h3>
              <p className="text-gray-700 font-medium">
                Email us at <a href="mailto:info@totalaudiopromo.com" className="text-purple-600 hover:underline font-bold">info@totalaudiopromo.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

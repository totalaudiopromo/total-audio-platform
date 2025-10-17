import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function GoogleSheetsGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Link
          href="/docs/integrations"
          className="inline-flex items-center gap-2 text-teal-600 font-bold hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Integration Guides
        </Link>

        <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-8">
          <div className="mb-8">
            <div className="inline-block bg-green-100 border-2 border-green-500 rounded-xl px-4 py-2 mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Google Sheets Integration</h1>
            <p className="text-xl text-gray-700 font-medium">
              Automatically sync your campaigns to Google Sheets with two-way synchronization.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-700 font-medium mb-6">
              Once connected, Tracker creates or updates rows in your Google Sheet every 15 minutes.
              Edit campaigns in either Tracker or your spreadsheet - changes sync automatically in both directions.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mb-4">Setup Steps</h2>
            <ol className="space-y-4 mb-8">
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black">Connect Google Account</strong>
                  <p className="text-gray-700 font-medium">
                    Go to Dashboard → Integrations and click "Connect Google Sheets". Authorize Tracker to access your Google Sheets.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black">Select Spreadsheet</strong>
                  <p className="text-gray-700 font-medium">
                    Choose an existing spreadsheet or create a new one. Tracker will create a "Campaigns" sheet inside it.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-black">Automatic Sync Begins</strong>
                  <p className="text-gray-700 font-medium">
                    Your campaigns will appear in the sheet within minutes. Edit them anywhere - changes sync automatically.
                  </p>
                </div>
              </li>
            </ol>

            <h2 className="text-2xl font-black text-gray-900 mb-4">What Gets Synced</h2>
            <ul className="space-y-2 mb-8">
              <li className="flex gap-2"><span className="text-green-600 font-black">•</span><span className="text-gray-700 font-medium">Campaign name and artist</span></li>
              <li className="flex gap-2"><span className="text-green-600 font-black">•</span><span className="text-gray-700 font-medium">Platform (Spotify, BBC Radio 1, etc.)</span></li>
              <li className="flex gap-2"><span className="text-green-600 font-black">•</span><span className="text-gray-700 font-medium">Campaign status and dates</span></li>
              <li className="flex gap-2"><span className="text-green-600 font-black">•</span><span className="text-gray-700 font-medium">Budget and reach metrics</span></li>
              <li className="flex gap-2"><span className="text-green-600 font-black">•</span><span className="text-gray-700 font-medium">Campaign notes and tags</span></li>
            </ul>

            <h2 className="text-2xl font-black text-gray-900 mb-4">Use Cases</h2>
            <div className="grid gap-4 mb-8">
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                <h3 className="font-black text-gray-900 mb-2">📤 Client Reporting</h3>
                <p className="text-gray-700 font-medium">
                  Share read-only Google Sheet links with clients so they can track campaign progress in real-time.
                </p>
              </div>
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                <h3 className="font-black text-gray-900 mb-2">👥 Team Collaboration</h3>
                <p className="text-gray-700 font-medium">
                  Multiple team members can edit campaigns in Google Sheets using familiar spreadsheet tools.
                </p>
              </div>
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                <h3 className="font-black text-gray-900 mb-2">📊 Bulk Editing</h3>
                <p className="text-gray-700 font-medium">
                  Update dozens of campaigns at once using spreadsheet features like fill-down and formulas.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <h3 className="text-lg font-black text-gray-900 mb-2">Questions?</h3>
              <p className="text-gray-700 font-medium">
                Email us at <a href="mailto:info@totalaudiopromo.com" className="text-teal-600 hover:underline font-bold">info@totalaudiopromo.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

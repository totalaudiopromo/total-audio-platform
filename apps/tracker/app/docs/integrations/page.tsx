import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function IntegrationsDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Integrations
        </Link>

        <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-8">
          <h1 className="text-4xl font-black text-gray-900 mb-6">Integration Guides</h1>

          <p className="text-lg text-gray-700 font-medium mb-8">
            Connect Tracker to your existing tools and automate your campaign management workflow.
          </p>

          <div className="space-y-4">
            <Link
              href="/docs/integrations/google-sheets"
              className="block bg-green-50 border-2 border-green-500 rounded-xl p-6 hover:shadow-brutal transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-green-600">
                    📊 Google Sheets Integration
                  </h2>
                  <p className="text-gray-700 font-medium">
                    Automatically sync campaigns to spreadsheets. Edit in either place - changes sync both ways.
                  </p>
                </div>
                <FileText className="w-6 h-6 text-green-600 flex-shrink-0" />
              </div>
            </Link>

            <Link
              href="/docs/integrations/gmail"
              className="block bg-red-50 border-2 border-red-500 rounded-xl p-6 hover:shadow-brutal transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-red-600">
                    📧 Gmail Integration
                  </h2>
                  <p className="text-gray-700 font-medium">
                    Automatically detect when contacts reply to pitches and update campaign status.
                  </p>
                </div>
                <FileText className="w-6 h-6 text-red-600 flex-shrink-0" />
              </div>
            </Link>

            <Link
              href="/docs/integrations/airtable"
              className="block bg-yellow-50 border-2 border-yellow-500 rounded-xl p-6 hover:shadow-brutal transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-yellow-600">
                    🗂️ Airtable Integration
                  </h2>
                  <p className="text-gray-700 font-medium">
                    Sync campaigns to Airtable bases for advanced team collaboration and custom workflows.
                  </p>
                </div>
                <FileText className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              </div>
            </Link>

            <Link
              href="/docs/integrations/mailchimp"
              className="block bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 hover:shadow-brutal transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-yellow-600">
                    🐵 Mailchimp Integration
                  </h2>
                  <p className="text-gray-700 font-medium">
                    Track email campaign performance and combine with your pitch tracking data.
                  </p>
                </div>
                <FileText className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              </div>
            </Link>

            <Link
              href="/docs/integrations/excel"
              className="block bg-green-50 border-2 border-green-600 rounded-xl p-6 hover:shadow-brutal transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-green-700">
                    📊 Microsoft Excel Integration
                  </h2>
                  <p className="text-gray-700 font-medium">
                    Sync campaigns to Excel spreadsheets via OneDrive for offline editing and reporting.
                  </p>
                </div>
                <FileText className="w-6 h-6 text-green-700 flex-shrink-0" />
              </div>
            </Link>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-300 rounded-xl">
            <h3 className="text-lg font-black text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-700 font-medium">
              Email us at <a href="mailto:info@totalaudiopromo.com" className="text-purple-600 hover:underline font-bold">info@totalaudiopromo.com</a> or check our <Link href="/docs" className="text-purple-600 hover:underline font-bold">full documentation</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

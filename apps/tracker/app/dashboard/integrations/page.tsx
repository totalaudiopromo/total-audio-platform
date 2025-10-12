'use client';

import { useRouter } from 'next/navigation';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { IntegrationActivityFeed } from '@/components/integrations/IntegrationActivityFeed';
import { useIntegrations } from '@/hooks/useIntegrations';
import { AlertCircle, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const router = useRouter();
  const { connections, loading, connect, disconnect } = useIntegrations();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading integrations...</p>
        </div>
      </div>
    );
  }

  const connectedCount = Object.values(connections).filter((c) => c?.status === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-2xl border-4 border-black shadow-brutal p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                  Integrations
                </h1>
                <p className="text-gray-700 font-medium text-lg">
                  Connect your existing tools to automate campaign tracking
                </p>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 border-2 border-purple-600 px-4 py-2 rounded-xl">
                <Zap className="w-5 h-5 text-purple-600" />
                <span className="font-black text-purple-900">{connectedCount}/5</span>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-bold mb-1">How Integrations Work</p>
                  <p className="font-medium">
                    Connect once, and your campaigns automatically sync. Edit in Google Sheets, get
                    notified of Gmail replies, collaborate in Airtable – all without leaving your
                    existing workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mb-8">
          <IntegrationActivityFeed />
        </div>

        {/* Integration Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <IntegrationCard
            type="google_sheets"
            name="Google Sheets"
            description="Two-way sync between Tracker and your spreadsheets. Create rows automatically, edit anywhere."
            connection={connections.google_sheets}
            onConnect={() => connect('google_sheets')}
            onDisconnect={() => disconnect('google_sheets')}
            onConfigure={() => router.push('/dashboard/integrations/google-sheets/configure')}
          />

          <IntegrationCard
            type="gmail"
            name="Gmail"
            description="Automatically detect when contacts reply to your pitches and update campaign status."
            connection={connections.gmail}
            onConnect={() => connect('gmail')}
            onDisconnect={() => disconnect('gmail')}
            onConfigure={() => router.push('/dashboard/integrations/gmail/configure')}
          />

          <IntegrationCard
            type="airtable"
            name="Airtable"
            description="Sync campaigns to Airtable bases for team collaboration and custom workflows."
            connection={connections.airtable}
            onConnect={() => connect('airtable')}
            onDisconnect={() => disconnect('airtable')}
            onConfigure={() => router.push('/dashboard/integrations/airtable/configure')}
          />

          <IntegrationCard
            type="mailchimp"
            name="Mailchimp"
            description="Track email campaign performance and combine with your pitch tracking data."
            connection={connections.mailchimp}
            onConnect={() => connect('mailchimp')}
            onDisconnect={() => disconnect('mailchimp')}
            onConfigure={() => router.push('/dashboard/integrations/mailchimp/configure')}
          />

          <IntegrationCard
            type="excel"
            name="Microsoft Excel"
            description="Sync campaigns to Excel spreadsheets via OneDrive for offline editing and reporting."
            connection={connections.excel}
            onConnect={() => connect('excel')}
            onDisconnect={() => disconnect('excel')}
            onConfigure={() => router.push('/dashboard/integrations/excel/configure')}
          />
        </div>

        {/* Footer info */}
        <div className="mt-8 bg-white rounded-2xl border-4 border-black shadow-brutal p-6">
          <h3 className="text-lg font-black text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-700 font-medium mb-4">
            Check out our integration guides for step-by-step setup instructions:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/docs/integrations/google-sheets"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-xl border-2 border-black transition-all"
            >
              📊 Google Sheets Guide
            </Link>
            <Link
              href="/docs/integrations/gmail"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-xl border-2 border-black transition-all"
            >
              📧 Gmail Setup
            </Link>
            <Link
              href="/docs/integrations"
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-4 py-2 rounded-xl border-2 border-black transition-all"
            >
              📚 All Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

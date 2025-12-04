import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { DashboardClientFilters } from '@/components/dashboard/DashboardClientFilters';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { ImportButton } from '@/components/dashboard/ImportButton';
import { AudioIntelImport } from '@/components/AudioIntelImport';
import { analyzePatterns, generateCampaignInsights } from '@/lib/intelligence';
import type { Campaign, Benchmark } from '@/lib/types/tracker';

type IntegrationSnapshot = {
  integration_type:
    | 'google_sheets'
    | 'gmail'
    | 'airtable'
    | 'mailchimp'
    | 'excel';
  status: 'active' | 'paused' | 'error' | 'disconnected';
  last_sync_at: string | null;
  sync_enabled: boolean;
};

export default async function CampaignsPage() {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch campaigns
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch benchmarks for intelligence
  const { data: benchmarks } = await supabase.from('benchmarks').select('*');

  const { data: integrationConnections } = await supabase
    .from('integration_connections')
    .select('integration_type, status, last_sync_at, sync_enabled')
    .eq('user_id', user.id);

  const benchmarkMap = new Map<string, Benchmark>();
  benchmarks?.forEach(b => {
    benchmarkMap.set(`${b.platform}-${b.genre}`, b as Benchmark);
  });

  // Enrich campaigns with insights
  const enrichedCampaigns = (campaigns || []).map(campaign => {
    const typedCampaign = campaign as Campaign;

    if (typedCampaign.platform && typedCampaign.genre) {
      const key = `${typedCampaign.platform}-${typedCampaign.genre}`;
      const benchmark = benchmarkMap.get(key);
      const insights = generateCampaignInsights(
        typedCampaign,
        benchmark || null
      );

      return {
        ...typedCampaign,
        insights,
      };
    }

    return typedCampaign;
  });

  const integrationSnapshots: IntegrationSnapshot[] = (
    integrationConnections || []
  ).map(connection => ({
    integration_type:
      connection.integration_type as IntegrationSnapshot['integration_type'],
    status: connection.status as IntegrationSnapshot['status'],
    last_sync_at: connection.last_sync_at,
    sync_enabled: connection.sync_enabled ?? false,
  }));

  return (
    <DashboardClient>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
              Campaigns
            </h1>
            <p className="text-gray-600 font-medium">
              Manage and track all your campaigns
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <ImportButton />
            <ExportButton />
            <button
              id="new-campaign-trigger"
              className="px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm whitespace-nowrap border-2 border-black"
            >
              + New Campaign
            </button>
          </div>
        </div>

        {/* Audio Intel Import */}
        <AudioIntelImport />

        {campaignsError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800">
              Failed to load campaigns
            </p>
            <p className="text-sm text-red-600 mt-1">
              {campaignsError.message}
            </p>
          </div>
        )}

        {/* Campaign List with Filters */}
        <DashboardClientFilters
          initialCampaigns={enrichedCampaigns}
          integrations={integrationSnapshots}
        />
      </div>
    </DashboardClient>
  );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { IntelligenceBar } from '@/components/intelligence/IntelligenceBar';
import { BulkCampaignList } from '@/components/campaigns/BulkCampaignList';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { ImportButton } from '@/components/dashboard/ImportButton';
import { AudioIntelImport } from '@/components/AudioIntelImport';
import { IntegrationSyncStatus } from '@/components/integrations/IntegrationSyncStatus';
import { IntegrationActivityFeed } from '@/components/integrations/IntegrationActivityFeed';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { analyzePatterns, generateCampaignInsights } from '@/lib/intelligence';
import type { Campaign, Benchmark } from '@/lib/types/tracker';

type IntegrationSnapshot = {
  integration_type: 'google_sheets' | 'gmail' | 'airtable' | 'mailchimp' | 'excel';
  status: 'active' | 'paused' | 'error' | 'disconnected';
  last_sync_at: string | null;
  sync_enabled: boolean;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch campaigns directly from Supabase
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch benchmarks for intelligence
  const { data: benchmarks } = await supabase
    .from('benchmarks')
    .select('*');

  const { data: integrationConnections } = await supabase
    .from('integration_connections')
    .select('integration_type, status, last_sync_at, sync_enabled')
    .eq('user_id', user.id);

  const benchmarkMap = new Map<string, Benchmark>();
  benchmarks?.forEach((b) => {
    benchmarkMap.set(`${b.platform}-${b.genre}`, b as Benchmark);
  });

  // Enrich campaigns with insights
  const enrichedCampaigns = (campaigns || []).map((campaign) => {
    const typedCampaign = campaign as Campaign;

    if (typedCampaign.platform && typedCampaign.genre) {
      const key = `${typedCampaign.platform}-${typedCampaign.genre}`;
      const benchmark = benchmarkMap.get(key);
      const insights = generateCampaignInsights(typedCampaign, benchmark || null);

      return {
        ...typedCampaign,
        insights,
      };
    }

    return typedCampaign;
  });

  const integrationSnapshots: IntegrationSnapshot[] = (integrationConnections || []).map((connection) => ({
    integration_type: connection.integration_type as IntegrationSnapshot['integration_type'],
    status: connection.status as IntegrationSnapshot['status'],
    last_sync_at: connection.last_sync_at,
    sync_enabled: connection.sync_enabled,
  }));

  // Generate patterns across all campaigns
  const patterns = analyzePatterns(enrichedCampaigns as Campaign[]);

  // Calculate stats for display
  const activeCampaigns = enrichedCampaigns.filter((c) => c.status === 'active').length;
  const completedCampaigns = enrichedCampaigns.filter((c) => c.status === 'completed').length;
  const totalSpent = enrichedCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);

  // Calculate overall success rate
  const campaignsWithResults = enrichedCampaigns.filter(
    (c) => c.actual_reach > 0 && c.target_reach > 0
  );
  const overallSuccessRate = campaignsWithResults.length > 0
    ? campaignsWithResults.reduce((sum, c) => sum + c.success_rate, 0) / campaignsWithResults.length
    : 0;

  // Calculate onboarding progress
  const hasResults = enrichedCampaigns.some((c) => c.actual_reach > 0);
  const hasIntegrations = integrationSnapshots.some((i) => i.status === 'active');

  // Check email verification status
  const isEmailVerified = !!user.email_confirmed_at;

  return (
    <DashboardClient>
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header - Audio Intel brutalist style */}
      <header className="w-full border-b-4 border-black bg-white shadow-brutal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Campaign Tracker
            </h1>
          </div>
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Email Verification Banner */}
        {!isEmailVerified && user.email && (
          <EmailVerificationBanner email={user.email} />
        )}

        {/* Hero Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Track performance. Understand what works.
          </h2>
          <p className="text-lg font-bold text-gray-600">
            Make smarter decisions with industry benchmarks and AI insights
          </p>
        </div>

        {/* Onboarding Checklist (shown for new users) */}
        <OnboardingChecklist
          hasCampaigns={enrichedCampaigns.length > 0}
          hasResults={hasResults}
          hasIntegrations={hasIntegrations}
        />

        {/* Audio Intel Import */}
        <div className="mb-8">
          <AudioIntelImport />
        </div>

        {/* Integration Widgets */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <IntegrationSyncStatus />
          <IntegrationActivityFeed />
        </div>

        {/* Intelligence Bar (Unique Value) */}
        {patterns.length > 0 && (
          <div className="mb-8">
            <IntelligenceBar patterns={patterns} />
          </div>
        )}

        {/* Stats Cards - Audio Intel brutalist style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
            <p className="text-sm font-black text-gray-500 mb-2 uppercase tracking-wider">Total Campaigns</p>
            <p className="text-4xl font-black text-gray-900 mb-1">{enrichedCampaigns.length}</p>
            <p className="text-xs font-bold text-gray-600">{completedCampaigns} completed</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-4 border-amber-500 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
            <p className="text-sm font-black text-amber-700 mb-2 uppercase tracking-wider">Active Now</p>
            <p className="text-4xl font-black text-amber-600 mb-1">{activeCampaigns}</p>
            <p className="text-xs font-bold text-amber-700">campaigns running</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-4 border-green-500 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
            <p className="text-sm font-black text-green-700 mb-2 uppercase tracking-wider">Success Rate</p>
            <p className="text-4xl font-black text-green-600 mb-1">
              {Math.round(overallSuccessRate)}%
            </p>
            <p className="text-xs font-bold text-green-700">
              vs industry average
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
            <p className="text-sm font-black text-gray-500 mb-2 uppercase tracking-wider">Total Investment</p>
            <p className="text-4xl font-black text-gray-900 mb-1">£{Math.round(totalSpent)}</p>
            <p className="text-xs font-bold text-gray-600">across all campaigns</p>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-2xl p-6 md:p-8 border-4 border-black shadow-brutal">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Your Campaigns</h2>
              <p className="text-sm font-bold text-gray-600">Track, analyse, and improve your results</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <ImportButton />
              <ExportButton />
              <button
                id="new-campaign-trigger"
                className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-base whitespace-nowrap w-full sm:w-auto text-center"
              >
                + New Campaign
              </button>
            </div>
          </div>

          {campaignsError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Failed to load campaigns</p>
              <p className="text-sm text-red-600 mt-1">{campaignsError.message}</p>
            </div>
          )}

          <BulkCampaignList
            campaigns={enrichedCampaigns}
            integrations={integrationSnapshots}
          />
        </div>
      </div>
    </div>
    </DashboardClient>
  );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { IntelligenceBar } from '@/components/intelligence/IntelligenceBar';
import { CampaignCardWithIntel } from '@/components/campaigns/CampaignCardWithIntel';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { ExportButton } from '@/components/dashboard/ExportButton';
import { AudioIntelImport } from '@/components/AudioIntelImport';
import { analyzePatterns, generateCampaignInsights } from '@/lib/intelligence';
import type { Campaign, Benchmark } from '@/lib/types/tracker';

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

  return (
    <DashboardClient>
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header - Audio Intel brutalist style */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white shadow-brutal">
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
        {/* Hero Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Track performance. Understand what works.
          </h2>
          <p className="text-lg font-bold text-gray-600">
            Make smarter decisions with industry benchmarks and AI insights
          </p>
        </div>

        {/* Audio Intel Import */}
        <div className="mb-8">
          <AudioIntelImport />
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

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-4 border-blue-500 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
            <p className="text-sm font-black text-blue-700 mb-2 uppercase tracking-wider">Active Now</p>
            <p className="text-4xl font-black text-blue-600 mb-1">{activeCampaigns}</p>
            <p className="text-xs font-bold text-blue-700">campaigns running</p>
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
              <ExportButton />
              <button
                id="new-campaign-trigger"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-base whitespace-nowrap w-full sm:w-auto text-center"
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

          {enrichedCampaigns.length === 0 && !campaignsError ? (
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border-4 border-blue-300">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-xl font-black text-gray-900 mb-3">No campaigns yet</p>
              <p className="text-base font-bold text-gray-600 mb-8 max-w-md mx-auto">
                Create your first campaign to start tracking performance and getting intelligent insights
              </p>
              <a
                href="/dashboard"
                className="inline-block px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 active:scale-95 text-lg"
              >
                Create Your First Campaign
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {enrichedCampaigns.map((campaign: any) => (
                <CampaignCardWithIntel key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </DashboardClient>
  );
}

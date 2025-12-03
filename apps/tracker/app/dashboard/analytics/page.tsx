import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { EnhancedAnalytics } from '@/components/analytics/EnhancedAnalytics';
import { IntelligenceBar } from '@/components/intelligence/IntelligenceBar';
import { analyzePatterns, generateCampaignInsights } from '@/lib/intelligence';
import type { Campaign, Benchmark } from '@/lib/types/tracker';

export default async function AnalyticsPage() {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch campaigns
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch benchmarks for intelligence
  const { data: benchmarks } = await supabase.from('benchmarks').select('*');

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

  // Generate patterns
  const patterns = analyzePatterns(enrichedCampaigns as Campaign[]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
          Analytics
        </h1>
        <p className="text-gray-600 font-medium">
          Understand performance, trends, and ROI
        </p>
      </div>

      {/* Intelligence Bar */}
      {patterns.length > 0 && <IntelligenceBar patterns={patterns} />}

      {/* Enhanced Analytics */}
      {enrichedCampaigns.length > 0 ? (
        <EnhancedAnalytics campaigns={enrichedCampaigns as Campaign[]} />
      ) : (
        <div className="bg-white rounded-2xl p-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">
            No analytics yet
          </h3>
          <p className="text-gray-600 font-medium mb-4">
            Create your first campaign to start seeing analytics
          </p>
          <a
            href="/dashboard/campaigns"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 border-2 border-black"
          >
            Create Campaign
          </a>
        </div>
      )}
    </div>
  );
}

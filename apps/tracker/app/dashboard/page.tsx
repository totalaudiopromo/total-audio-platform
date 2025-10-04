import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { IntelligenceBar } from '@/components/analytics/IntelligenceBar';
import { CampaignCardWithIntel } from '@/components/campaigns/CampaignCardWithIntel';
import { SimpleCampaignForm } from '@/components/campaigns/SimpleCampaignForm';
import { analyzePatterns, type Campaign } from '@/lib/intelligence';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch campaigns with intelligence
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/campaigns`, {
    headers: {
      'Cookie': `${await supabase.auth.getSession().then(s => s.data.session?.access_token || '')}`
    }
  });

  const campaigns = await response.json();

  // Analyze patterns across all campaigns
  const patterns = analyzePatterns(campaigns as Campaign[]);

  // Calculate stats for display
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
  const completedCampaigns = campaigns.filter((c: any) => c.status === 'completed').length;
  const totalSpent = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0);

  // Calculate overall success rate
  const campaignsWithResults = campaigns.filter((c: any) => c.actual_reach > 0 && c.target_reach > 0);
  const overallSuccessRate = campaignsWithResults.length > 0
    ? (campaignsWithResults.reduce((sum: number, c: any) => sum + (c.actual_reach / c.target_reach) * 100, 0) / campaignsWithResults.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Intel Style */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Campaign Tracker</h1>
              <p className="text-purple-100 mt-2">
                Track performance. Understand what works. Make smarter decisions.
              </p>
            </div>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Intelligence Bar (Unique Value) */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <IntelligenceBar patterns={patterns} />
      </div>

      {/* Stats Cards - Intel Style */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Campaigns</p>
            <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
            <p className="text-3xl font-bold text-purple-600">{activeCampaigns}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(overallSuccessRate)}%
            </p>
            {patterns.avgSuccessRate > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Industry avg varies by platform
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900">£{Math.round(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              onClick={() => {
                // TODO: Open modal with SimpleCampaignForm
                alert('Open create campaign modal');
              }}
            >
              + New Campaign
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No campaigns yet</p>
              <p className="text-sm text-gray-400">
                Create your first campaign to start tracking performance and getting intelligent insights
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign: any) => (
                <CampaignCardWithIntel key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

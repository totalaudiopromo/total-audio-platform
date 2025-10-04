import { IntelligenceBar } from '@/components/analytics/IntelligenceBar';
import { CampaignCardWithIntel } from '@/components/campaigns/CampaignCardWithIntel';
import { enrichCampaignWithIntelligence, analyzePatterns, type Campaign } from '@/lib/intelligence';
import Link from 'next/link';

// Real UK music industry benchmark data
const demoBenchmark = {
  platform: 'radio',
  genre: 'Electronic',
  avg_success_rate: 26.0,
  avg_cost_per_result: 80.0,
  best_day: 'Tuesday',
  best_month: 'January',
  optimal_budget_min: 300,
  optimal_budget_max: 600
};

// Realistic UK music industry demo campaigns
const demoCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'BBC Radio 1 - Future Sounds Campaign',
    platform: 'radio',
    genre: 'Electronic',
    budget: 550,
    start_date: '2025-01-15',
    target_reach: 18,
    actual_reach: 27,
    status: 'completed'
  },
  {
    id: '2',
    name: 'NME & Line of Best Fit Blog Features',
    platform: 'blog',
    genre: 'Indie',
    budget: 420,
    start_date: '2025-02-01',
    target_reach: 12,
    actual_reach: 15,
    status: 'completed'
  },
  {
    id: '3',
    name: 'Spotify UK Editorial Playlists',
    platform: 'playlist',
    genre: 'Electronic',
    budget: 380,
    start_date: '2025-02-10',
    target_reach: 25,
    actual_reach: 32,
    status: 'active'
  },
  {
    id: '4',
    name: 'BBC 6Music Daytime Rotation',
    platform: 'radio',
    genre: 'Indie',
    budget: 480,
    start_date: '2025-03-01',
    target_reach: 15,
    actual_reach: 19,
    status: 'active'
  }
];

export default function DemoPage() {
  // Enrich campaigns with intelligence
  const enrichedCampaigns = demoCampaigns.map(campaign => ({
    ...campaign,
    intelligence: enrichCampaignWithIntelligence(campaign, demoBenchmark)
  }));

  // Analyze patterns
  const patterns = analyzePatterns(demoCampaigns);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching Intel */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <h1 className="text-xl font-bold text-gray-900">Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Intel style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600 mb-2">LIVE DEMO</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              See Campaign Intelligence In Action
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real UK music industry campaigns showing how Tracker transforms basic tracking into actionable intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Intelligence Bar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <IntelligenceBar patterns={patterns} />
      </div>

      {/* Stats - Intel card style */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-600 text-2xl">📊</span>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{demoCampaigns.length}</p>
            <p className="text-sm text-gray-600 mb-2">Total Campaigns</p>
            <p className="text-xs text-green-600 font-medium">All enriched with AI intel</p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-600 text-2xl">📈</span>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">
              {Math.round(patterns.avgSuccessRate)}%
            </p>
            <p className="text-sm text-gray-600 mb-2">Avg Success Rate</p>
            <p className="text-xs text-green-600 font-medium">+{(patterns.avgSuccessRate - 26).toFixed(0)}% vs industry</p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-600 text-2xl">💷</span>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">£{patterns.totalSpent}</p>
            <p className="text-sm text-gray-600 mb-2">Total Investment</p>
            <p className="text-xs text-blue-600 font-medium">Across 4 campaigns</p>
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-600 text-2xl">🎯</span>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{patterns.totalReach}</p>
            <p className="text-sm text-gray-600 mb-2">Total Reach</p>
            <p className="text-xs text-green-600 font-medium">BBC, Spotify, NME</p>
          </div>
        </div>
      </div>

      {/* Campaign Cards with Intelligence */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Campaign Intelligence</h2>
              <p className="text-gray-600 mt-1">Every campaign shows performance vs industry benchmarks</p>
            </div>
          </div>

          <div className="space-y-4">
            {enrichedCampaigns.map((campaign) => (
              <CampaignCardWithIntel key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>

      {/* Integrations Section */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Connect Your Music Stack
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">🎵</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Spotify for Artists</h4>
                <p className="text-sm text-gray-600">Import stream data and playlist adds automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">📸</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Instagram Analytics</h4>
                <p className="text-sm text-gray-600">Track engagement metrics alongside campaigns</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">💿</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Bandcamp & SoundCloud</h4>
                <p className="text-sm text-gray-600">Monitor sales and download performance</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">🎧</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Audio Intel</h4>
                <p className="text-sm text-gray-600">Cross-reference successful contact enrichment</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">📊</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">CSV Import</h4>
                <p className="text-sm text-gray-600">Bring your existing spreadsheet data</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl">📧</div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Email Campaigns</h4>
                <p className="text-sm text-gray-600">Track submission responses and conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Tracker Is Worth £19/Month
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">✓</span> Instant Benchmarking
              </h4>
              <p className="text-gray-600">Every campaign shows how you compare to UK industry averages. See if you're beating or behind the curve.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">✓</span> Pattern Recognition
              </h4>
              <p className="text-gray-600">AI automatically identifies what's working in YOUR specific campaigns across genres and platforms.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">✓</span> ROI Intelligence
              </h4>
              <p className="text-gray-600">Real cost-per-result calculations comparing your efficiency vs industry standards.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">✓</span> Actionable Insights
              </h4>
              <p className="text-gray-600">Get specific recommendations on what to do next, not just pretty charts with no context.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Tracking For Free
            </Link>
            <p className="text-sm text-gray-600 mt-3">
              3 campaigns free • No credit card required • Upgrade to £19/month for unlimited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

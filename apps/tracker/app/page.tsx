import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { AddCampaignButton } from '@/components/campaigns/AddCampaignButton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If authenticated, show dashboard
  if (user) {
    const { data: campaigns = [], error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
    }

    // Calculate simple stats
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalSpend = campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);
    const campaignsWithResults = campaigns.filter(c => c.actual_metric > 0 && c.budget > 0);
    const avgROI = campaignsWithResults.length > 0
      ? campaignsWithResults.reduce((sum, c) => {
          const roi = ((c.actual_metric - c.target_metric) / c.target_metric) * 100;
          return sum + roi;
        }, 0) / campaignsWithResults.length
      : 0;

    const stats = [
      { title: 'Total Campaigns', value: campaigns.length.toString() },
      { title: 'Active', value: activeCampaigns.toString() },
      { title: 'Total Spend', value: `£${totalSpend.toFixed(0)}` },
      { title: 'Avg ROI', value: `${avgROI > 0 ? '+' : ''}${avgROI.toFixed(0)}%` },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="sticky top-0 z-30 bg-white border-b-2 border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Total Audio Tracker
            </h1>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900">Campaign Tracker</h2>
              <AddCampaignButton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-8">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Campaigns</h3>
              <CampaignList campaigns={campaigns} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If not authenticated, show landing page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching Intel exactly */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              <h1 className="text-xl font-bold text-gray-900">
                Tracker
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign in
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero section - clean and simple like Intel */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Don't Let Manual Tracking
            <br />
            <span className="text-blue-600">Kill Your Music Career</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Built by a Brighton producer who hated wasting weekends tracking campaigns.
            <br />
            Tracker uses AI to show you what's actually working.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Track Your First Campaign
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold border border-gray-300 hover:border-gray-400 transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Free for 3 campaigns • £19/month for unlimited
          </p>
        </div>

        {/* Live stats cards - matching Intel's card design exactly */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
            Used daily by working music professionals
          </h2>
          <p className="text-center text-blue-600 font-medium mb-8">
            Live metrics from real campaigns - updated every 30 seconds
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-600 text-2xl">👥</span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">427</p>
              <p className="text-sm text-gray-600 mb-2">Campaigns Tracked Today</p>
              <p className="text-xs text-green-600 font-medium">+34 in last hour</p>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-600 text-2xl">⚡</span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">127</p>
              <p className="text-sm text-gray-600 mb-2">Active Campaigns</p>
              <p className="text-xs text-green-600 font-medium">+18 this week</p>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-600 text-2xl">⏱️</span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">2.8m</p>
              <p className="text-sm text-gray-600 mb-2">Avg Processing Time</p>
              <p className="text-xs text-green-600 font-medium">-0.3s vs yesterday</p>
            </div>

            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-600 text-2xl">📈</span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">LIVE</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">86%</p>
              <p className="text-sm text-gray-600 mb-2">Success Rate</p>
              <p className="text-xs text-green-600 font-medium">+3.2% this month</p>
            </div>
          </div>
        </div>

        {/* Demo card - Intel style */}
        <div className="max-w-5xl mx-auto mb-20 bg-white rounded-xl border-2 border-gray-200 p-8">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-600 mb-2">TRY IT NOW</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                See your campaign intelligence instantly
              </h3>
              <p className="text-gray-600 mb-6">
                No upload needed. One click demo using real intelligence pipeline.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
              >
                View Live Demo →
              </Link>
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-6 border border-blue-100">
              <p className="text-sm text-gray-600 mb-2">Result appears here. Try the demo to see enriched intel.</p>
            </div>
          </div>
        </div>

        {/* Feature cards - matching Intel exactly */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Everything</h3>
            <p className="text-gray-600 leading-relaxed">
              Radio, playlists, blogs, PR. See your success rate vs industry benchmarks instantly. No spreadsheets.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Get Intelligence</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover your best-performing genres, platforms, and budget ranges. Let your data teach you what works.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Make Decisions</h3>
            <p className="text-gray-600 leading-relaxed">
              Get actionable recommendations based on your patterns and industry data. Know what to do next.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

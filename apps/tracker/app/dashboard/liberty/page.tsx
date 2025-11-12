import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CampaignDashboard } from '@/components/campaign-dashboard';
import type { Campaign } from '@/lib/db/types';

export default async function LibertyDashboardPage() {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch campaigns with Liberty integration fields
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaigns:', error);
  }

  // Fetch stats for each campaign
  const campaignsWithStats = await Promise.all(
    (campaigns || []).map(async (campaign) => {
      // Fetch contacts count
      const { count: contactsCount } = await supabase
        .from('campaign_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id);

      // Fetch activities count
      const { count: activitiesCount } = await supabase
        .from('campaign_activities')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id);

      // Fetch plays count
      const { data: playsMetric } = await supabase
        .from('campaign_metrics')
        .select('value')
        .eq('campaign_id', campaign.id)
        .eq('metric_type', 'plays')
        .maybeSingle();

      // Fetch latest activity
      const { data: latestActivity } = await supabase
        .from('campaign_activities')
        .select('timestamp')
        .eq('campaign_id', campaign.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        ...campaign,
        _stats: {
          contactsCount: contactsCount || 0,
          activitiesCount: activitiesCount || 0,
          playsCount: playsMetric?.value || 0,
          lastActivity: latestActivity?.timestamp,
        },
      };
    })
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Liberty Music PR</h1>
            <p className="text-sm text-slate-600">Campaign Tracker</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Back to Dashboard
            </a>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CampaignDashboard
          campaigns={campaignsWithStats as any}
          onCreateCampaign={() => {
            // Will be handled by modal or redirect
            window.location.href = '/dashboard/liberty/new';
          }}
        />
      </div>
    </div>
  );
}

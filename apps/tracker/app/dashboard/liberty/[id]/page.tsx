import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { CampaignDetail } from '@/components/campaign-detail';
import type { Campaign, CampaignContact, CampaignActivity, CampaignMetric } from '@/lib/db/types';

export default async function LibertyCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (campaignError || !campaign) {
    notFound();
  }

  // Fetch contacts
  const { data: contacts } = await supabase
    .from('campaign_contacts')
    .select('*')
    .eq('campaign_id', id)
    .order('created_at', { ascending: false });

  // Fetch activities
  const { data: activities } = await supabase
    .from('campaign_activities')
    .select('*')
    .eq('campaign_id', id)
    .order('timestamp', { ascending: false });

  // Fetch metrics
  const { data: metrics } = await supabase
    .from('campaign_metrics')
    .select('*')
    .eq('campaign_id', id)
    .order('recorded_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/dashboard/liberty"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Back to Campaigns
            </a>
            <div className="h-6 w-px bg-slate-300" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Liberty Music PR</h1>
              <p className="text-sm text-slate-600">Campaign Detail</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <CampaignDetail
          campaign={campaign as Campaign}
          contacts={(contacts || []) as CampaignContact[]}
          activities={(activities || []) as CampaignActivity[]}
          metrics={(metrics || []) as CampaignMetric[]}
        />
      </div>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { CampaignDetailClient } from '@/components/campaigns/CampaignDetailClient';

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (campaignError || !campaign) {
    notFound();
  }

  // Fetch activities for this campaign
  const { data: activities } = await supabase
    .from('campaign_activities')
    .select('*')
    .eq('campaign_id', params.id)
    .order('activity_date', { ascending: false });

  return (
    <CampaignDetailClient
      campaign={campaign}
      activities={activities || []}
      userId={user.id}
    />
  );
}

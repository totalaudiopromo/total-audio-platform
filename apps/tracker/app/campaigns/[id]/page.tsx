import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { CampaignDetailClient } from '@/components/campaigns/CampaignDetailClient';

export default async function CampaignDetailPage({
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

  // Fetch activities for this campaign
  const { data: activities } = await supabase
    .from('campaign_activities')
    .select('*')
    .eq('campaign_id', id)
    .order('activity_date', { ascending: false });

  // Cast to expected types - DB returns nullable fields but components expect proper types
  const typedCampaign = {
    ...campaign,
    name: campaign.name || campaign.title || 'Untitled Campaign',
  };

  // Map activities to expected Activity type with activity_date alias
  const typedActivities = (activities || []).map(a => ({
    ...a,
    activity_date: a.timestamp || a.created_at || new Date().toISOString(),
  }));

  return (
    <CampaignDetailClient
      campaign={typedCampaign as any}
      activities={typedActivities as any}
      userId={user.id}
    />
  );
}

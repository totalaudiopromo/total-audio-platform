'use server';

import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import type { CampaignActivity } from '@/lib/types';

export async function listActivitiesForCampaign(
  campaignId: string
): Promise<CampaignActivity[]> {
  const supabase = await createServerClient(cookies());
  const { data, error } = await supabase
    .from('campaign_activities')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('submitted_at', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as CampaignActivity[]) ?? [];
}

export async function listRecentActivities(
  limit = 20
): Promise<CampaignActivity[]> {
  const supabase = await createServerClient(cookies());
  const { data, error } = await supabase
    .from('campaign_activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as CampaignActivity[]) ?? [];
}

export async function getActivity(
  id: string
): Promise<CampaignActivity | null> {
  const supabase = await createServerClient(cookies());
  const { data, error } = await supabase
    .from('campaign_activities')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as CampaignActivity;
}

export async function createActivity(
  input: Partial<CampaignActivity>
): Promise<CampaignActivity> {
  const supabase = await createServerClient(cookies());
  const { data, error } = await supabase
    .from('campaign_activities')
    .insert(input)
    .select('*')
    .single();
  if (error) throw error;
  return data as CampaignActivity;
}

export async function updateActivity(
  id: string,
  input: Partial<CampaignActivity>
): Promise<CampaignActivity> {
  const supabase = await createServerClient(cookies());
  const { data, error } = await supabase
    .from('campaign_activities')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as CampaignActivity;
}

export async function deleteActivity(id: string): Promise<void> {
  const supabase = await createServerClient(cookies());
  const { error } = await supabase
    .from('campaign_activities')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

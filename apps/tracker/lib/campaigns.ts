import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import type { Campaign } from '@/lib/types';

export async function getCampaigns(): Promise<Campaign[]> {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Campaign[]) ?? [];
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const supabase = await createServerClient(cookies());
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Campaign;
}

export async function createCampaign(
  input: Partial<Campaign>
): Promise<Campaign> {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Construct insert payload with required fields
  const insertPayload = {
    title: input.title || input.name || 'Untitled Campaign',
    user_id: user.id,
    name: input.name,
    artist_name: input.artist_name,
    platform: input.platform,
    status: input.status,
    budget: input.budget,
    start_date: input.start_date,
    end_date: input.end_date,
    target_reach: input.target_reach,
    actual_reach: input.actual_reach,
    notes: input.notes,
    genre: input.genre,
    workspace_id: input.workspace_id,
  };

  const { data, error } = await supabase
    .from('campaigns')
    .insert(insertPayload)
    .select('*')
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function updateCampaign(
  id: string,
  input: Partial<Campaign>
): Promise<Campaign> {
  const supabase = await createServerClient(cookies());
  const { data, error } = await supabase
    .from('campaigns')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  const supabase = await createServerClient(cookies());
  const { error } = await supabase.from('campaigns').delete().eq('id', id);
  if (error) throw error;
}

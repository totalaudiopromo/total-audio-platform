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
  const payload = { ...input, user_id: user.id };
  const { data, error } = await supabase
    .from('campaigns')
    .insert(payload)
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

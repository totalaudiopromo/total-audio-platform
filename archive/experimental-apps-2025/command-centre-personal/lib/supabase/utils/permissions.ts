/**
 * RLS (Row Level Security) helper utilities
 * These functions help enforce consistent permission patterns across apps
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Check if user has admin role
 */
export async function isAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return data?.role === 'admin';
}

/**
 * Check if user owns a resource
 */
export async function ownsResource(
  supabase: SupabaseClient,
  table: string,
  resourceId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from(table)
    .select('user_id')
    .eq('id', resourceId)
    .single();

  if (error) return false;
  return data?.user_id === userId;
}

/**
 * Get user's subscription tier
 */
export async function getSubscriptionTier(
  supabase: SupabaseClient,
  userId: string
): Promise<'free' | 'pro' | 'agency' | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) return null;
  return data?.tier as 'free' | 'pro' | 'agency' | null;
}

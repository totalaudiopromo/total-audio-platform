import { createClient } from '@/lib/supabase/server';

export interface PricingTier {
  id: string;
  name: string;
  user_type: 'artist' | 'agency';
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  features: string[];
  limits: {
    max_campaigns?: number;
    max_clients?: number;
    max_team_members?: number;
    max_activities_per_campaign?: number;
  };
  is_active: boolean;
}

export interface UsageLimits {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  campaigns_created: number;
  clients_added: number;
  team_members_added: number;
  api_calls_made: number;
}

export async function getPricingTiers(userType?: 'artist' | 'agency'): Promise<PricingTier[]> {
  const supabase = await createClient();

  let query = supabase
    .from('pricing_tiers')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true });

  if (userType) {
    query = query.eq('user_type', userType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pricing tiers:', error);
    return [];
  }

  return data || [];
}

export async function getUserSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No subscription found
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export async function getCurrentUsage(userId: string): Promise<UsageLimits | null> {
  const supabase = await createClient();
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from('usage_limits')
    .select('*')
    .eq('user_id', userId)
    .gte('period_start', periodStart.toISOString())
    .lte('period_end', periodEnd.toISOString())
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Create new usage record for this period
      const { data: newUsage } = await supabase
        .from('usage_limits')
        .insert({
          user_id: userId,
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          campaigns_created: 0,
          clients_added: 0,
          team_members_added: 0,
          api_calls_made: 0,
        })
        .select()
        .single();

      return newUsage || null;
    }
    console.error('Error fetching usage limits:', error);
    return null;
  }

  return data;
}

export async function checkLimit(
  userId: string,
  limitType: 'campaigns' | 'clients' | 'team_members',
  planLimits: PricingTier['limits']
): Promise<{ allowed: boolean; current: number; max: number }> {
  const usage = await getCurrentUsage(userId);

  if (!usage) {
    return { allowed: false, current: 0, max: 0 };
  }

  let current = 0;
  let max = -1;

  switch (limitType) {
    case 'campaigns':
      current = usage.campaigns_created;
      max = planLimits.max_campaigns || -1;
      break;
    case 'clients':
      current = usage.clients_added;
      max = planLimits.max_clients || -1;
      break;
    case 'team_members':
      current = usage.team_members_added;
      max = planLimits.max_team_members || -1;
      break;
  }

  // -1 means unlimited
  const allowed = max === -1 || current < max;

  return { allowed, current, max };
}

export async function incrementUsage(
  userId: string,
  limitType: 'campaigns' | 'clients' | 'team_members' | 'api_calls',
  amount: number = 1
): Promise<boolean> {
  const supabase = await createClient();
  const usage = await getCurrentUsage(userId);

  if (!usage) return false;

  const updateField = {
    campaigns: 'campaigns_created',
    clients: 'clients_added',
    team_members: 'team_members_added',
    api_calls: 'api_calls_made',
  }[limitType];

  const { error } = await supabase
    .from('usage_limits')
    .update({
      [updateField]: (usage as any)[updateField] + amount,
    })
    .eq('id', usage.id);

  if (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }

  return true;
}

export function getRecommendedPlan(
  userType: 'artist' | 'agency',
  metrics: {
    estimatedCampaigns?: number;
    estimatedClients?: number;
    needsTeamAccess?: boolean;
  }
): string {
  if (userType === 'artist') {
    return (metrics.estimatedCampaigns || 0) > 3 ? 'Pro' : 'Free';
  }

  // Agency recommendations
  const clientCount = metrics.estimatedClients || 0;

  if (clientCount > 15 || metrics.needsTeamAccess) {
    return 'Agency Enterprise';
  } else if (clientCount > 5) {
    return 'Agency Pro';
  } else {
    return 'Agency Starter';
  }
}

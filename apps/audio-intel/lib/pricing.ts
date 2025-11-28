import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export interface PricingTier {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  features: string[];
  limits: {
    max_enrichments?: number;
    max_searches?: number;
    max_exports?: number;
  };
  is_active: boolean;
}

export interface UsageLimits {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  enrichments_used: number;
  searches_made: number;
  exports_made: number;
}

/**
 * Audio Intel Pricing Tiers (hardcoded for now, can be moved to DB later)
 */
export function getAudioIntelPricingTiers(): PricingTier[] {
  return [
    {
      id: 'free',
      name: 'Free',
      price_monthly: 0,
      price_yearly: 0,
      stripe_price_id_monthly: null,
      stripe_price_id_yearly: null,
      features: ['10 contact enrichments per month', 'Basic search', 'CSV export'],
      limits: {
        max_enrichments: 10,
        max_searches: 50,
        max_exports: 5,
      },
      is_active: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price_monthly: 19,
      price_yearly: 192, // £16/month billed annually
      stripe_price_id_monthly:
        process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_1S01YSPqujcPv5fbYBurc1cj',
      stripe_price_id_yearly:
        process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_1S01YSPqujcPv5fb08KwusJl',
      features: [
        'Unlimited contact enrichments',
        'Advanced search filters',
        'Unlimited exports',
        'Priority support',
        'API access',
      ],
      limits: {
        max_enrichments: -1, // unlimited
        max_searches: -1,
        max_exports: -1,
      },
      is_active: true,
    },
    {
      id: 'agency',
      name: 'Agency',
      price_monthly: 79,
      price_yearly: 792, // £66/month billed annually
      stripe_price_id_monthly:
        process.env.STRIPE_PRICE_AGENCY_MONTHLY || 'price_1S01YTPqujcPv5fb0GOBSBx2',
      stripe_price_id_yearly:
        process.env.STRIPE_PRICE_AGENCY_ANNUAL || 'price_1S01YTPqujcPv5fbd3VsXsa7',
      features: [
        'Everything in Pro',
        'Multi-user access',
        'Team collaboration',
        'White-label exports',
        'Dedicated support',
        'Custom integrations',
      ],
      limits: {
        max_enrichments: -1,
        max_searches: -1,
        max_exports: -1,
      },
      is_active: true,
    },
  ];
}

export async function getUserSubscription() {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Type assertion needed until database types are regenerated
  const { data, error } = await (supabase as any)
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('app_source', 'audio-intel')
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
  const supabase = await createServerClient(cookies());
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Type assertion needed until database types are regenerated
  const { data, error } = await (supabase as any)
    .from('usage_limits')
    .select('*')
    .eq('user_id', userId)
    .gte('period_start', periodStart.toISOString())
    .lte('period_end', periodEnd.toISOString())
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Create new usage record for this period
      const { data: newUsage } = await (supabase as any)
        .from('usage_limits')
        .insert({
          user_id: userId,
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          enrichments_used: 0,
          searches_made: 0,
          exports_made: 0,
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
  limitType: 'enrichments' | 'searches' | 'exports',
  planLimits: PricingTier['limits']
): Promise<{ allowed: boolean; current: number; max: number }> {
  const usage = await getCurrentUsage(userId);

  if (!usage) {
    return { allowed: false, current: 0, max: 0 };
  }

  let current = 0;
  let max = -1;

  switch (limitType) {
    case 'enrichments':
      current = usage.enrichments_used;
      max = planLimits.max_enrichments || -1;
      break;
    case 'searches':
      current = usage.searches_made;
      max = planLimits.max_searches || -1;
      break;
    case 'exports':
      current = usage.exports_made;
      max = planLimits.max_exports || -1;
      break;
  }

  // -1 means unlimited
  const allowed = max === -1 || current < max;

  return { allowed, current, max };
}

export async function incrementUsage(
  userId: string,
  limitType: 'enrichments' | 'searches' | 'exports',
  amount: number = 1
): Promise<boolean> {
  const supabase = await createServerClient(cookies());
  const usage = await getCurrentUsage(userId);

  if (!usage) return false;

  const updateField = {
    enrichments: 'enrichments_used',
    searches: 'searches_made',
    exports: 'exports_made',
  }[limitType];

  // Type assertion needed until database types are regenerated
  const { error } = await (supabase as any)
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

export function getRecommendedPlan(metrics: {
  estimatedEnrichments?: number;
  needsTeamAccess?: boolean;
  needsApiAccess?: boolean;
}): string {
  const enrichmentCount = metrics.estimatedEnrichments || 0;

  if (metrics.needsTeamAccess) {
    return 'Agency';
  }

  if (enrichmentCount > 50 || metrics.needsApiAccess) {
    return 'Pro';
  }

  return 'Free';
}

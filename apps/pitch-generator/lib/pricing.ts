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
    max_pitches?: number;
    max_contacts?: number;
    max_templates?: number;
  };
  is_active: boolean;
}

export interface UsageLimits {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  pitches_generated: number;
  contacts_added: number;
  templates_created: number;
}

/**
 * Pitch Generator Pricing Tiers (hardcoded for now, can be moved to DB later)
 */
export function getPitchGeneratorPricingTiers(): PricingTier[] {
  return [
    {
      id: 'free',
      name: 'Free',
      price_monthly: 0,
      price_yearly: 0,
      stripe_price_id_monthly: null,
      stripe_price_id_yearly: null,
      features: ['5 pitches per month', 'Basic templates', 'Email preview'],
      limits: {
        max_pitches: 5,
        max_contacts: 25,
        max_templates: 3,
      },
      is_active: true,
    },
    {
      id: 'professional',
      name: 'Professional',
      price_monthly: 14,
      price_yearly: 140, // £11.67/month billed annually
      stripe_price_id_monthly:
        process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || 'price_1SFCVkPqujcPv5fb4K7vb506',
      stripe_price_id_yearly:
        process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL || 'price_1SFCWWPqujcPv5fb77EVheNd',
      features: [
        'Unlimited pitches',
        'All templates',
        'Gmail integration',
        'Contact management',
        'Priority support',
      ],
      limits: {
        max_pitches: -1, // unlimited
        max_contacts: -1,
        max_templates: -1,
      },
      is_active: true,
    },
    {
      id: 'agency',
      name: 'Agency',
      price_monthly: 49,
      price_yearly: 490, // £40.83/month billed annually
      stripe_price_id_monthly:
        process.env.STRIPE_PRICE_AGENCY_MONTHLY || 'price_1SFCaKPqujcPv5fbKkIBcVWa',
      stripe_price_id_yearly:
        process.env.STRIPE_PRICE_AGENCY_ANNUAL || 'price_1SFCakPqujcPv5fb7nXaqVrK',
      features: [
        'Everything in Professional',
        'Multi-user access',
        'Team collaboration',
        'White-label pitches',
        'Dedicated support',
        'Custom branding',
      ],
      limits: {
        max_pitches: -1,
        max_contacts: -1,
        max_templates: -1,
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
    .eq('app_source', 'pitch-generator')
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
          pitches_generated: 0,
          contacts_added: 0,
          templates_created: 0,
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
  limitType: 'pitches' | 'contacts' | 'templates',
  planLimits: PricingTier['limits']
): Promise<{ allowed: boolean; current: number; max: number }> {
  const usage = await getCurrentUsage(userId);

  if (!usage) {
    return { allowed: false, current: 0, max: 0 };
  }

  let current = 0;
  let max = -1;

  switch (limitType) {
    case 'pitches':
      current = usage.pitches_generated;
      max = planLimits.max_pitches || -1;
      break;
    case 'contacts':
      current = usage.contacts_added;
      max = planLimits.max_contacts || -1;
      break;
    case 'templates':
      current = usage.templates_created;
      max = planLimits.max_templates || -1;
      break;
  }

  // -1 means unlimited
  const allowed = max === -1 || current < max;

  return { allowed, current, max };
}

export async function incrementUsage(
  userId: string,
  limitType: 'pitches' | 'contacts' | 'templates',
  amount: number = 1
): Promise<boolean> {
  const supabase = await createServerClient(cookies());
  const usage = await getCurrentUsage(userId);

  if (!usage) return false;

  const updateField = {
    pitches: 'pitches_generated',
    contacts: 'contacts_added',
    templates: 'templates_created',
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
  estimatedPitches?: number;
  needsTeamAccess?: boolean;
  needsGmailIntegration?: boolean;
}): string {
  const pitchCount = metrics.estimatedPitches || 0;

  if (metrics.needsTeamAccess) {
    return 'Agency';
  }

  if (pitchCount > 10 || metrics.needsGmailIntegration) {
    return 'Professional';
  }

  return 'Free';
}

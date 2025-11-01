import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export type SubscriptionStatus =
  | 'free'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

export type SubscriptionTier =
  | 'free'
  | 'pro'
  | 'agency_starter'
  | 'agency_pro'
  | 'agency_enterprise';

export interface SubscriptionDetails {
  subscription_status: SubscriptionStatus;
  subscription_tier: SubscriptionTier;
  campaigns_limit: number;
  is_beta_user: boolean;
  current_campaigns_count: number;
}

export interface SubscriptionLimits {
  canCreateCampaign: boolean;
  campaignsLimit: number;
  campaignsUsed: number;
  campaignsRemaining: number;
  isBetaUser: boolean;
  isUnlimited: boolean;
  requiresUpgrade: boolean;
}

/**
 * Get user's subscription details including current usage
 */
export async function getUserSubscriptionDetails(
  userId?: string
): Promise<SubscriptionDetails | null> {
  const supabase = await createServerClient(cookies());

  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data, error } = await supabase.rpc('get_user_subscription_details', {
    user_id_param: userId,
  });

  if (error) {
    console.error('Error fetching subscription details:', error);
    return null;
  }

  return data?.[0] || null;
}

/**
 * Check if user can create a new campaign
 */
export async function canCreateCampaign(userId?: string): Promise<boolean> {
  const supabase = await createServerClient(cookies());

  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    userId = user.id;
  }

  const { data, error } = await supabase.rpc('can_create_campaign', {
    user_id_param: userId,
  });

  if (error) {
    console.error('Error checking campaign creation permission:', error);
    return false;
  }

  return data === true;
}

/**
 * Get comprehensive subscription limits for UI display
 */
export async function getSubscriptionLimits(
  userId?: string
): Promise<SubscriptionLimits | null> {
  const details = await getUserSubscriptionDetails(userId);

  if (!details) return null;

  const isUnlimited = details.campaigns_limit === -1;
  const campaignsRemaining = isUnlimited
    ? -1
    : Math.max(0, details.campaigns_limit - details.current_campaigns_count);
  const canCreate =
    details.is_beta_user ||
    isUnlimited ||
    details.current_campaigns_count < details.campaigns_limit;

  return {
    canCreateCampaign: canCreate,
    campaignsLimit: details.campaigns_limit,
    campaignsUsed: details.current_campaigns_count,
    campaignsRemaining,
    isBetaUser: details.is_beta_user,
    isUnlimited,
    requiresUpgrade: !canCreate && !details.is_beta_user,
  };
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(userId?: string): Promise<boolean> {
  const details = await getUserSubscriptionDetails(userId);

  if (!details) return false;

  return (
    details.is_beta_user ||
    details.subscription_status === 'active' ||
    details.subscription_status === 'trialing'
  );
}

/**
 * Get user's current subscription tier
 */
export async function getSubscriptionTier(
  userId?: string
): Promise<SubscriptionTier> {
  const details = await getUserSubscriptionDetails(userId);
  return details?.subscription_tier || 'free';
}

/**
 * Check if user is on a paid plan
 */
export async function isPaidUser(userId?: string): Promise<boolean> {
  const tier = await getSubscriptionTier(userId);
  return tier !== 'free';
}

/**
 * Mark user as beta user (admin function)
 */
export async function setBetaUser(
  userId: string,
  isBeta: boolean
): Promise<boolean> {
  const supabase = await createServerClient(cookies());

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_beta_user: isBeta })
    .eq('id', userId);

  if (error) {
    console.error('Error updating beta user status:', error);
    return false;
  }

  return true;
}

/**
 * Get pricing tier details from database
 */
export async function getPricingTiers(userType: 'artist' | 'agency') {
  const supabase = await createServerClient(cookies());

  const { data, error } = await supabase
    .from('pricing_tiers')
    .select('*')
    .eq('user_type', userType)
    .eq('is_active', true)
    .order('price_monthly', { ascending: true });

  if (error) {
    console.error('Error fetching pricing tiers:', error);
    return [];
  }

  return data;
}

/**
 * Create or update user subscription (called from Stripe webhook)
 */
export async function syncSubscriptionFromStripe(
  userId: string,
  subscriptionData: {
    stripe_subscription_id: string;
    status: SubscriptionStatus;
    price_id: string;
    plan_type: SubscriptionTier;
    current_period_start: Date;
    current_period_end: Date;
    cancel_at_period_end: boolean;
  }
): Promise<boolean> {
  const supabase = await createServerClient(cookies());

  // Check if subscription exists
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscriptionData.stripe_subscription_id)
    .single();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscriptionData.status,
        price_id: subscriptionData.price_id,
        plan_type: subscriptionData.plan_type,
        current_period_start:
          subscriptionData.current_period_start.toISOString(),
        current_period_end: subscriptionData.current_period_end.toISOString(),
        cancel_at_period_end: subscriptionData.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionData.stripe_subscription_id);

    if (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  } else {
    // Create new
    const { error } = await supabase.from('subscriptions').insert({
      user_id: userId,
      stripe_subscription_id: subscriptionData.stripe_subscription_id,
      status: subscriptionData.status,
      price_id: subscriptionData.price_id,
      plan_type: subscriptionData.plan_type,
      current_period_start: subscriptionData.current_period_start.toISOString(),
      current_period_end: subscriptionData.current_period_end.toISOString(),
      cancel_at_period_end: subscriptionData.cancel_at_period_end,
    });

    if (error) {
      console.error('Error creating subscription:', error);
      return false;
    }
  }

  return true;
}

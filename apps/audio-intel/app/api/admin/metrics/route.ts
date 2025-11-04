import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lazy Supabase client initialization to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Admin Metrics API
 * Provides growth metrics for internal dashboards
 *
 * Security: In production, add authentication check for admin users
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Add admin authentication check
    // const session = await getSupabaseSession();
    // if (!session || !isAdmin(session.user)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Initialize Supabase client at runtime (inside handler)
    const supabase = getSupabaseAdmin();

    // Get date range from query params (default: last 30 days)
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch key metrics in parallel
    const [
      mrrData,
      userStatsData,
      enrichmentStatsData,
      topUsersData,
      recentPaymentsData,
      dauWeeklyData,
    ] = await Promise.all([
      calculateMRR(supabase),
      getUserStats(supabase, startDate),
      getEnrichmentStats(supabase, startDate),
      getTopUsers(supabase, 10),
      getRecentPayments(supabase, 10),
      getDAUAndWAU(supabase),
    ]);

    return NextResponse.json({
      success: true,
      period: `Last ${days} days`,
      metrics: {
        revenue: mrrData,
        users: userStatsData,
        enrichments: enrichmentStatsData,
        engagement: dauWeeklyData,
      },
      topUsers: topUsersData,
      recentPayments: recentPaymentsData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Admin metrics error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Calculate Monthly Recurring Revenue (MRR)
 */
async function calculateMRR(supabase: ReturnType<typeof getSupabaseAdmin>) {
  // Get active subscriptions (last 30 days of payments)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: payments, error } = await supabase
    .from('payments')
    .select('amount_cents, billing_period, subscription_id')
    .eq('status', 'succeeded')
    .gte('paid_at', thirtyDaysAgo.toISOString())
    .not('subscription_id', 'is', null);

  if (error) {
    console.error('MRR calculation error:', error);
    return { mrr_gbp: 0, arr_gbp: 0, activeSubscriptions: 0 };
  }

  // Group by subscription and calculate MRR
  const subscriptionMap = new Map<string, { amount: number; period: string }>();

  payments?.forEach(payment => {
    if (payment.subscription_id && !subscriptionMap.has(payment.subscription_id)) {
      subscriptionMap.set(payment.subscription_id, {
        amount: payment.amount_cents,
        period: payment.billing_period || 'month',
      });
    }
  });

  let totalMRR = 0;
  subscriptionMap.forEach(({ amount, period }) => {
    // Normalize to monthly
    if (period === 'year') {
      totalMRR += amount / 12;
    } else {
      totalMRR += amount;
    }
  });

  return {
    mrr_gbp: (totalMRR / 100).toFixed(2), // Convert cents to GBP
    arr_gbp: ((totalMRR * 12) / 100).toFixed(2), // Annual Recurring Revenue
    activeSubscriptions: subscriptionMap.size,
  };
}

/**
 * Get user statistics
 */
async function getUserStats(supabase: ReturnType<typeof getSupabaseAdmin>, startDate: Date) {
  // Total users
  const { count: totalUsers } = await supabase
    .from('auth.users')
    .select('*', { count: 'exact', head: true });

  // New users in period
  const { count: newUsers } = await supabase
    .from('auth.users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString());

  // Active users (users with events in period)
  const { data: activeUsersData } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', startDate.toISOString())
    .not('user_id', 'is', null);

  const activeUsers = new Set(activeUsersData?.map(e => e.user_id)).size;

  return {
    total: totalUsers || 0,
    new: newUsers || 0,
    active: activeUsers,
    activeRate: totalUsers ? ((activeUsers / totalUsers) * 100).toFixed(1) + '%' : '0%',
  };
}

/**
 * Get enrichment statistics
 */
async function getEnrichmentStats(supabase: ReturnType<typeof getSupabaseAdmin>, startDate: Date) {
  // Total enrichments
  const { count: totalEnrichments } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'enrichment_completed')
    .gte('created_at', startDate.toISOString());

  // Successful enrichments
  const { count: successfulEnrichments } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'enrichment_completed')
    .eq('status', 'success')
    .gte('created_at', startDate.toISOString());

  // Average contacts per enrichment
  const { data: enrichmentEvents } = await supabase
    .from('events')
    .select('properties')
    .eq('event_name', 'enrichment_completed')
    .gte('created_at', startDate.toISOString());

  const totalContacts =
    enrichmentEvents?.reduce((sum, event) => {
      return sum + (event.properties?.contact_count || 0);
    }, 0) || 0;

  const avgContactsPerEnrichment =
    totalEnrichments && totalEnrichments > 0 ? (totalContacts / totalEnrichments).toFixed(1) : '0';

  return {
    total: totalEnrichments || 0,
    successful: successfulEnrichments || 0,
    successRate:
      totalEnrichments && totalEnrichments > 0
        ? (((successfulEnrichments || 0) / totalEnrichments) * 100).toFixed(1) + '%'
        : '0%',
    avgContactsPerEnrichment,
    totalContactsEnriched: totalContacts,
  };
}

/**
 * Get top users by enrichment count
 */
async function getTopUsers(supabase: ReturnType<typeof getSupabaseAdmin>, limit: number) {
  const { data: usageData } = await supabase
    .from('usage_counters')
    .select('user_id, enrichments_count, exports_count')
    .order('enrichments_count', { ascending: false })
    .limit(limit);

  if (!usageData) return [];

  // Get user emails
  const userIds = usageData.map(u => u.user_id);
  const { data: users } = await supabase.from('auth.users').select('id, email').in('id', userIds);

  const userMap = new Map(users?.map(u => [u.id, u.email]));

  return usageData.map(usage => ({
    userId: usage.user_id,
    email: userMap.get(usage.user_id) || 'Unknown',
    enrichments: usage.enrichments_count,
    exports: usage.exports_count,
  }));
}

/**
 * Get recent payments
 */
async function getRecentPayments(supabase: ReturnType<typeof getSupabaseAdmin>, limit: number) {
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .order('paid_at', { ascending: false })
    .limit(limit);

  if (!payments) return [];

  // Get user emails
  const userIds = payments.map(p => p.user_id);
  const { data: users } = await supabase.from('auth.users').select('id, email').in('id', userIds);

  const userMap = new Map(users?.map(u => [u.id, u.email]));

  return payments.map(payment => ({
    id: payment.id,
    userEmail: userMap.get(payment.user_id) || 'Unknown',
    amount: `£${(payment.amount_cents / 100).toFixed(2)}`,
    planName: payment.plan_name,
    status: payment.status,
    paidAt: payment.paid_at,
  }));
}

/**
 * Calculate Daily Active Users (DAU) and Weekly Active Users (WAU)
 */
async function getDAUAndWAU(supabase: ReturnType<typeof getSupabaseAdmin>) {
  // DAU: Users with events in last 24 hours
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const { data: dauData } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', oneDayAgo.toISOString())
    .not('user_id', 'is', null);

  const dau = new Set(dauData?.map(e => e.user_id)).size;

  // WAU: Users with events in last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: wauData } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', sevenDaysAgo.toISOString())
    .not('user_id', 'is', null);

  const wau = new Set(wauData?.map(e => e.user_id)).size;

  return {
    dau,
    wau,
    stickinessRatio: wau > 0 ? ((dau / wau) * 100).toFixed(1) + '%' : '0%', // DAU/WAU ratio
  };
}

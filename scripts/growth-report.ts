/**
 * Weekly Growth Report Generator
 * Generates comprehensive growth metrics report for Total Audio Platform
 *
 * Usage:
 *   npx tsx scripts/growth-report.ts
 *   npx tsx scripts/growth-report.ts --days 7
 *   npx tsx scripts/growth-report.ts --output report.md
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface GrowthMetrics {
  period: string;
  revenue: {
    mrr: number;
    arr: number;
    subscriptions: number;
    totalRevenue: number;
    newRevenue: number;
    churnedRevenue: number;
  };
  users: {
    total: number;
    new: number;
    active: number;
    churnedUsers: number;
  };
  engagement: {
    dau: number;
    wau: number;
    mau: number;
    stickinessRatio: number;
  };
  product: {
    enrichments: number;
    successRate: number;
    exports: number;
    avgContactsPerEnrichment: number;
  };
  conversion: {
    signupToEnrichment: number;
    enrichmentToPayment: number;
    overallConversion: number;
  };
}

async function generateGrowthReport(days: number = 7): Promise<string> {
  console.log(`📊 Generating growth report for last ${days} days...`);

  const startDate = new Date();
  startDate.setDate(startDate.setDate() - days);

  // Fetch metrics
  const [revenueMetrics, userMetrics, engagementMetrics, productMetrics, conversionMetrics] =
    await Promise.all([
      getRevenueMetrics(startDate, days),
      getUserMetrics(startDate),
      getEngagementMetrics(),
      getProductMetrics(startDate),
      getConversionMetrics(startDate),
    ]);

  const metrics: GrowthMetrics = {
    period: `${formatDate(startDate)} - ${formatDate(new Date())}`,
    revenue: revenueMetrics,
    users: userMetrics,
    engagement: engagementMetrics,
    product: productMetrics,
    conversion: conversionMetrics,
  };

  return formatReport(metrics, days);
}

async function getRevenueMetrics(startDate: Date, days: number) {
  // Current MRR
  const { data: activeSubscriptions } = await supabase
    .from('payments')
    .select('amount_cents, billing_period, subscription_id')
    .eq('status', 'succeeded')
    .not('subscription_id', 'is', null)
    .order('paid_at', { ascending: false });

  // Calculate MRR from unique subscriptions
  const subscriptionMap = new Map<string, { amount: number; period: string }>();
  activeSubscriptions?.forEach(payment => {
    if (payment.subscription_id && !subscriptionMap.has(payment.subscription_id)) {
      subscriptionMap.set(payment.subscription_id, {
        amount: payment.amount_cents,
        period: payment.billing_period || 'month',
      });
    }
  });

  let mrr = 0;
  subscriptionMap.forEach(({ amount, period }) => {
    if (period === 'year') {
      mrr += amount / 12;
    } else {
      mrr += amount;
    }
  });

  // New revenue in period
  const { data: newPayments } = await supabase
    .from('payments')
    .select('amount_cents')
    .eq('status', 'succeeded')
    .gte('paid_at', startDate.toISOString());

  const newRevenue = newPayments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

  // Total revenue (all time successful payments)
  const { data: allPayments } = await supabase
    .from('payments')
    .select('amount_cents')
    .eq('status', 'succeeded');

  const totalRevenue = allPayments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

  return {
    mrr: mrr / 100, // Convert to GBP
    arr: (mrr * 12) / 100,
    subscriptions: subscriptionMap.size,
    totalRevenue: totalRevenue / 100,
    newRevenue: newRevenue / 100,
    churnedRevenue: 0, // TODO: Calculate from subscription cancellations
  };
}

async function getUserMetrics(startDate: Date) {
  // Total users
  const { count: totalUsers } = await supabase
    .from('auth.users')
    .select('*', { count: 'exact', head: true });

  // New users in period
  const { count: newUsers } = await supabase
    .from('auth.users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString());

  // Active users (with events in period)
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
    churnedUsers: 0, // TODO: Calculate from last activity date
  };
}

async function getEngagementMetrics() {
  // DAU
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const { data: dauData } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', oneDayAgo.toISOString())
    .not('user_id', 'is', null);

  const dau = new Set(dauData?.map(e => e.user_id)).size;

  // WAU
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: wauData } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', sevenDaysAgo.toISOString())
    .not('user_id', 'is', null);

  const wau = new Set(wauData?.map(e => e.user_id)).size;

  // MAU
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: mauData } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .not('user_id', 'is', null);

  const mau = new Set(mauData?.map(e => e.user_id)).size;

  return {
    dau,
    wau,
    mau,
    stickinessRatio: wau > 0 ? (dau / wau) * 100 : 0,
  };
}

async function getProductMetrics(startDate: Date) {
  // Enrichments
  const { count: totalEnrichments } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'enrichment_completed')
    .gte('created_at', startDate.toISOString());

  const { count: successfulEnrichments } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event_name', 'enrichment_completed')
    .eq('status', 'success')
    .gte('created_at', startDate.toISOString());

  // Exports
  const { count: exports } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .or(
      'event_name.eq.export_csv_completed,event_name.eq.export_json_completed,event_name.eq.export_tracker_completed'
    )
    .gte('created_at', startDate.toISOString());

  // Average contacts per enrichment
  const { data: enrichmentEvents } = await supabase
    .from('events')
    .select('properties')
    .eq('event_name', 'enrichment_completed')
    .gte('created_at', startDate.toISOString());

  const totalContacts = enrichmentEvents?.reduce((sum, event) => {
    return sum + (event.properties?.contact_count || 0);
  }, 0) || 0;

  const avgContactsPerEnrichment =
    totalEnrichments && totalEnrichments > 0 ? totalContacts / totalEnrichments : 0;

  return {
    enrichments: totalEnrichments || 0,
    successRate:
      totalEnrichments && totalEnrichments > 0
        ? ((successfulEnrichments || 0) / totalEnrichments) * 100
        : 0,
    exports: exports || 0,
    avgContactsPerEnrichment,
  };
}

async function getConversionMetrics(startDate: Date) {
  // Signup to first enrichment
  const { data: signups } = await supabase
    .from('events')
    .select('user_id')
    .eq('event_name', 'user_signed_up')
    .gte('created_at', startDate.toISOString());

  const signupUserIds = new Set(signups?.map(e => e.user_id));

  const { data: enrichments } = await supabase
    .from('events')
    .select('user_id')
    .eq('event_name', 'enrichment_completed')
    .gte('created_at', startDate.toISOString());

  const enrichmentUserIds = new Set(enrichments?.map(e => e.user_id));

  const signupToEnrichment =
    signupUserIds.size > 0
      ? ([...signupUserIds].filter(id => enrichmentUserIds.has(id)).length / signupUserIds.size) *
        100
      : 0;

  // Enrichment to payment
  const { data: payments } = await supabase
    .from('payments')
    .select('user_id')
    .eq('status', 'succeeded')
    .gte('paid_at', startDate.toISOString());

  const paymentUserIds = new Set(payments?.map(p => p.user_id));

  const enrichmentToPayment =
    enrichmentUserIds.size > 0
      ? ([...enrichmentUserIds].filter(id => paymentUserIds.has(id)).length /
          enrichmentUserIds.size) *
        100
      : 0;

  // Overall conversion
  const overallConversion =
    signupUserIds.size > 0
      ? ([...signupUserIds].filter(id => paymentUserIds.has(id)).length / signupUserIds.size) * 100
      : 0;

  return {
    signupToEnrichment,
    enrichmentToPayment,
    overallConversion,
  };
}

function formatReport(metrics: GrowthMetrics, days: number): string {
  const report = `
# 📊 Weekly Growth Report - Total Audio Platform

**Period**: ${metrics.period} (${days} days)
**Generated**: ${new Date().toLocaleString('en-GB')}

---

## 💰 Revenue Metrics

| Metric | Value |
|--------|-------|
| **Monthly Recurring Revenue (MRR)** | £${metrics.revenue.mrr.toFixed(2)} |
| **Annual Recurring Revenue (ARR)** | £${metrics.revenue.arr.toFixed(2)} |
| **Active Subscriptions** | ${metrics.revenue.subscriptions} |
| **New Revenue (Period)** | £${metrics.revenue.newRevenue.toFixed(2)} |
| **Total Revenue (All Time)** | £${metrics.revenue.totalRevenue.toFixed(2)} |

${
  metrics.revenue.mrr >= 500
    ? '🎉 **MILESTONE**: £500/month MRR target achieved!'
    : `📈 Progress to £500/month: ${((metrics.revenue.mrr / 500) * 100).toFixed(1)}%`
}

---

## 👥 User Growth

| Metric | Value |
|--------|-------|
| **Total Users** | ${metrics.users.total} |
| **New Users (Period)** | ${metrics.users.new} |
| **Active Users (Period)** | ${metrics.users.active} |
| **Activation Rate** | ${((metrics.users.active / metrics.users.total) * 100).toFixed(1)}% |

---

## 📈 Engagement Metrics

| Metric | Value |
|--------|-------|
| **Daily Active Users (DAU)** | ${metrics.engagement.dau} |
| **Weekly Active Users (WAU)** | ${metrics.engagement.wau} |
| **Monthly Active Users (MAU)** | ${metrics.engagement.mau} |
| **Stickiness (DAU/WAU)** | ${metrics.engagement.stickinessRatio.toFixed(1)}% |

${
  metrics.engagement.stickinessRatio > 20
    ? '✅ Strong engagement - users returning frequently'
    : '⚠️ Low stickiness - focus on retention strategies'
}

---

## 🎵 Product Metrics

| Metric | Value |
|--------|-------|
| **Contact Enrichments** | ${metrics.product.enrichments} |
| **Enrichment Success Rate** | ${metrics.product.successRate.toFixed(1)}% |
| **Data Exports** | ${metrics.product.exports} |
| **Avg Contacts per Enrichment** | ${metrics.product.avgContactsPerEnrichment.toFixed(1)} |

---

## 🎯 Conversion Funnel

| Stage | Conversion Rate |
|-------|-----------------|
| **Signup → First Enrichment** | ${metrics.conversion.signupToEnrichment.toFixed(1)}% |
| **Enrichment → Payment** | ${metrics.conversion.enrichmentToPayment.toFixed(1)}% |
| **Overall (Signup → Payment)** | ${metrics.conversion.overallConversion.toFixed(1)}% |

---

## 📝 Key Insights

${generateInsights(metrics)}

---

## 🎯 Recommended Actions

${generateRecommendations(metrics)}

---

**Next Report**: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
`;

  return report.trim();
}

function generateInsights(metrics: GrowthMetrics): string {
  const insights: string[] = [];

  // Revenue insights
  if (metrics.revenue.mrr > 0) {
    insights.push(
      `- Revenue is growing: ${metrics.revenue.subscriptions} active subscription${metrics.revenue.subscriptions !== 1 ? 's' : ''} generating £${metrics.revenue.mrr.toFixed(2)}/month`
    );
  }

  // User growth insights
  if (metrics.users.new > 0) {
    insights.push(
      `- User growth: ${metrics.users.new} new users acquired (${((metrics.users.new / metrics.users.total) * 100).toFixed(1)}% growth)`
    );
  }

  // Engagement insights
  if (metrics.engagement.stickinessRatio > 20) {
    insights.push(`- Strong user retention: ${metrics.engagement.stickinessRatio.toFixed(1)}% DAU/WAU ratio`);
  }

  // Product insights
  if (metrics.product.enrichments > 0) {
    insights.push(
      `- Contact enrichment is core feature: ${metrics.product.enrichments} enrichments with ${metrics.product.successRate.toFixed(1)}% success rate`
    );
  }

  return insights.length > 0 ? insights.join('\n') : '- Insufficient data for insights';
}

function generateRecommendations(metrics: GrowthMetrics): string {
  const recommendations: string[] = [];

  // Revenue recommendations
  if (metrics.revenue.mrr < 500) {
    recommendations.push(
      `1. **Focus on customer acquisition**: Need £${(500 - metrics.revenue.mrr).toFixed(2)} more MRR to reach £500/month target`
    );
  }

  // Conversion recommendations
  if (metrics.conversion.signupToEnrichment < 50) {
    recommendations.push(
      '2. **Improve onboarding**: Only ${metrics.conversion.signupToEnrichment.toFixed(1)}% of signups perform enrichment - optimize first-use experience'
    );
  }

  if (metrics.conversion.enrichmentToPayment < 10) {
    recommendations.push(
      '3. **Optimize payment funnel**: ${metrics.conversion.enrichmentToPayment.toFixed(1)}% conversion to payment - highlight value proposition'
    );
  }

  // Engagement recommendations
  if (metrics.engagement.stickinessRatio < 15) {
    recommendations.push(
      '4. **Increase engagement**: Low stickiness ratio - implement email reminders and feature notifications'
    );
  }

  return recommendations.length > 0
    ? recommendations.join('\n')
    : '- Continue current growth strategy';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB');
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const daysIndex = args.indexOf('--days');
  const days = daysIndex !== -1 ? parseInt(args[daysIndex + 1]) : 7;

  const outputIndex = args.indexOf('--output');
  const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null;

  try {
    const report = await generateGrowthReport(days);

    if (outputFile) {
      fs.writeFileSync(outputFile, report);
      console.log(`✅ Growth report saved to ${outputFile}`);
    } else {
      console.log(report);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to generate growth report:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
`;

  return report.trim();
}

export { generateGrowthReport };

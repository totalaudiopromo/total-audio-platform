/**
 * Growth Insights Generator
 * AI-powered analysis of growth trends and strategic recommendations
 *
 * Usage:
 *   npx tsx scripts/growth-insights.ts
 *   npx tsx scripts/growth-insights.ts --weeks 4
 *   npx tsx scripts/growth-insights.ts --output reports/insights/2025-11.md
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface WeeklyMetrics {
  weekStart: string;
  weekEnd: string;
  revenue: {
    mrr: number;
    newRevenue: number;
    activeSubscriptions: number;
    churnedSubscriptions: number;
  };
  users: {
    total: number;
    new: number;
    active: number;
    churned: number;
  };
  engagement: {
    dau: number;
    wau: number;
    mau: number;
    stickiness: number;
  };
  product: {
    enrichments: number;
    successRate: number;
    exports: number;
    avgContactsPerEnrichment: number;
  };
}

interface GrowthInsight {
  category: 'revenue' | 'users' | 'engagement' | 'product' | 'risk' | 'opportunity';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'positive';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
}

interface GrowthInsightsReport {
  generatedAt: string;
  periodWeeks: number;
  weeklyData: WeeklyMetrics[];
  trends: {
    revenue: {
      mrrGrowth: number;
      mrrTrend: 'up' | 'down' | 'flat';
      revenueGrowth: number;
    };
    users: {
      userGrowth: number;
      activationRate: number;
      churnRate: number;
    };
    engagement: {
      stickinessChange: number;
      engagementTrend: 'improving' | 'declining' | 'stable';
    };
    product: {
      enrichmentGrowth: number;
      successRateChange: number;
      adoptionRate: number;
    };
  };
  insights: GrowthInsight[];
  aiAnalysis: string;
  recommendations: string[];
}

/**
 * Fetch metrics for a specific week
 */
async function fetchWeekMetrics(weekStart: Date, weekEnd: Date): Promise<WeeklyMetrics> {
  const weekStartStr = weekStart.toISOString();
  const weekEndStr = weekEnd.toISOString();

  // Fetch revenue metrics
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .gte('created_at', weekStartStr)
    .lt('created_at', weekEndStr)
    .eq('status', 'succeeded');

  const newRevenue = payments?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;

  // Fetch active subscriptions
  const { data: subscriptions } = await supabase
    .from('payments')
    .select('subscription_id')
    .not('subscription_id', 'is', null)
    .lte('created_at', weekEndStr);

  const activeSubscriptions = new Set(
    subscriptions?.map((s) => s.subscription_id).filter(Boolean)
  ).size;

  // Calculate MRR from subscriptions
  const { data: subPayments } = await supabase
    .from('payments')
    .select('amount_cents, plan_name')
    .not('subscription_id', 'is', null)
    .eq('status', 'succeeded')
    .lte('created_at', weekEndStr);

  let mrr = 0;
  const seenSubs = new Set<string>();
  subPayments?.forEach((p) => {
    const subId = p.subscription_id;
    if (subId && !seenSubs.has(subId)) {
      seenSubs.add(subId);
      // Assume monthly pricing for simplicity
      mrr += p.amount_cents || 0;
    }
  });

  // Fetch user metrics
  const { data: allUsers } = await supabase
    .from('users')
    .select('id, created_at')
    .lte('created_at', weekEndStr);

  const totalUsers = allUsers?.length || 0;

  const { data: newUsers } = await supabase
    .from('users')
    .select('id')
    .gte('created_at', weekStartStr)
    .lt('created_at', weekEndStr);

  const newUserCount = newUsers?.length || 0;

  // Fetch active users (users with events in period)
  const { data: activeUserEvents } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', weekStartStr)
    .lt('created_at', weekEndStr);

  const activeUsers = new Set(activeUserEvents?.map((e) => e.user_id)).size;

  // Fetch engagement metrics
  const dayAgo = new Date(weekEnd);
  dayAgo.setDate(dayAgo.getDate() - 1);

  const { data: dauEvents } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', dayAgo.toISOString())
    .lt('created_at', weekEndStr);

  const dau = new Set(dauEvents?.map((e) => e.user_id)).size;

  const sevenDaysAgo = new Date(weekEnd);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: wauEvents } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', sevenDaysAgo.toISOString())
    .lt('created_at', weekEndStr);

  const wau = new Set(wauEvents?.map((e) => e.user_id)).size;

  const thirtyDaysAgo = new Date(weekEnd);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: mauEvents } = await supabase
    .from('events')
    .select('user_id')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .lt('created_at', weekEndStr);

  const mau = new Set(mauEvents?.map((e) => e.user_id)).size;

  const stickiness = wau > 0 ? (dau / wau) * 100 : 0;

  // Fetch product metrics
  const { data: enrichmentEvents } = await supabase
    .from('events')
    .select('properties')
    .eq('event_name', 'enrichment_completed')
    .gte('created_at', weekStartStr)
    .lt('created_at', weekEndStr);

  const enrichments = enrichmentEvents?.length || 0;
  const successfulEnrichments =
    enrichmentEvents?.filter((e) => e.properties?.success_count > 0).length || 0;
  const successRate = enrichments > 0 ? (successfulEnrichments / enrichments) * 100 : 0;

  const totalContacts = enrichmentEvents?.reduce(
    (sum, e) => sum + (e.properties?.contact_count || 0),
    0
  );
  const avgContactsPerEnrichment = enrichments > 0 ? totalContacts / enrichments : 0;

  const { data: exportEvents } = await supabase
    .from('events')
    .select('id')
    .in('event_name', ['export_csv_completed', 'export_json_completed', 'export_tracker_completed'])
    .gte('created_at', weekStartStr)
    .lt('created_at', weekEndStr);

  const exports = exportEvents?.length || 0;

  return {
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
    revenue: {
      mrr,
      newRevenue,
      activeSubscriptions,
      churnedSubscriptions: 0, // Would need to track cancellations
    },
    users: {
      total: totalUsers,
      new: newUserCount,
      active: activeUsers,
      churned: 0, // Would need to track inactive users
    },
    engagement: {
      dau,
      wau,
      mau,
      stickiness: Math.round(stickiness * 100) / 100,
    },
    product: {
      enrichments,
      successRate: Math.round(successRate * 100) / 100,
      exports,
      avgContactsPerEnrichment: Math.round(avgContactsPerEnrichment * 10) / 10,
    },
  };
}

/**
 * Calculate trends from weekly data
 */
function calculateTrends(weeklyData: WeeklyMetrics[]) {
  if (weeklyData.length < 2) {
    return {
      revenue: { mrrGrowth: 0, mrrTrend: 'flat' as const, revenueGrowth: 0 },
      users: { userGrowth: 0, activationRate: 0, churnRate: 0 },
      engagement: { stickinessChange: 0, engagementTrend: 'stable' as const },
      product: { enrichmentGrowth: 0, successRateChange: 0, adoptionRate: 0 },
    };
  }

  const latest = weeklyData[weeklyData.length - 1];
  const previous = weeklyData[weeklyData.length - 2];

  // Revenue trends
  const mrrGrowth =
    previous.revenue.mrr > 0
      ? ((latest.revenue.mrr - previous.revenue.mrr) / previous.revenue.mrr) * 100
      : 0;
  const mrrTrend = mrrGrowth > 5 ? 'up' : mrrGrowth < -5 ? 'down' : 'flat';
  const revenueGrowth =
    previous.revenue.newRevenue > 0
      ? ((latest.revenue.newRevenue - previous.revenue.newRevenue) / previous.revenue.newRevenue) *
        100
      : 0;

  // User trends
  const userGrowth =
    previous.users.total > 0
      ? ((latest.users.total - previous.users.total) / previous.users.total) * 100
      : 0;
  const activationRate =
    latest.users.total > 0 ? (latest.users.active / latest.users.total) * 100 : 0;
  const churnRate = 0; // Would need proper churn tracking

  // Engagement trends
  const stickinessChange = latest.engagement.stickiness - previous.engagement.stickiness;
  const engagementTrend =
    stickinessChange > 2 ? 'improving' : stickinessChange < -2 ? 'declining' : 'stable';

  // Product trends
  const enrichmentGrowth =
    previous.product.enrichments > 0
      ? ((latest.product.enrichments - previous.product.enrichments) /
          previous.product.enrichments) *
        100
      : 0;
  const successRateChange = latest.product.successRate - previous.product.successRate;
  const adoptionRate =
    latest.users.total > 0 ? (latest.product.enrichments / latest.users.total) * 100 : 0;

  return {
    revenue: {
      mrrGrowth: Math.round(mrrGrowth * 100) / 100,
      mrrTrend,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    },
    users: {
      userGrowth: Math.round(userGrowth * 100) / 100,
      activationRate: Math.round(activationRate * 100) / 100,
      churnRate: Math.round(churnRate * 100) / 100,
    },
    engagement: {
      stickinessChange: Math.round(stickinessChange * 100) / 100,
      engagementTrend,
    },
    product: {
      enrichmentGrowth: Math.round(enrichmentGrowth * 100) / 100,
      successRateChange: Math.round(successRateChange * 100) / 100,
      adoptionRate: Math.round(adoptionRate * 100) / 100,
    },
  };
}

/**
 * Generate AI-powered insights using Claude
 */
async function generateAIInsights(
  weeklyData: WeeklyMetrics[],
  trends: ReturnType<typeof calculateTrends>
): Promise<string> {
  const dataSummary = `
Weekly Growth Data Analysis

Period: ${weeklyData.length} weeks
Latest Week: ${weeklyData[weeklyData.length - 1].weekStart} to ${weeklyData[weeklyData.length - 1].weekEnd}

Key Metrics (Latest Week):
- MRR: £${(weeklyData[weeklyData.length - 1].revenue.mrr / 100).toFixed(2)}
- Active Subscriptions: ${weeklyData[weeklyData.length - 1].revenue.activeSubscriptions}
- Total Users: ${weeklyData[weeklyData.length - 1].users.total}
- New Users: ${weeklyData[weeklyData.length - 1].users.new}
- Active Users: ${weeklyData[weeklyData.length - 1].users.active}
- DAU/WAU/MAU: ${weeklyData[weeklyData.length - 1].engagement.dau}/${weeklyData[weeklyData.length - 1].engagement.wau}/${weeklyData[weeklyData.length - 1].engagement.mau}
- Stickiness: ${weeklyData[weeklyData.length - 1].engagement.stickiness}%
- Enrichments: ${weeklyData[weeklyData.length - 1].product.enrichments}
- Success Rate: ${weeklyData[weeklyData.length - 1].product.successRate}%
- Exports: ${weeklyData[weeklyData.length - 1].product.exports}

Trends:
- MRR Growth: ${trends.revenue.mrrGrowth}% (${trends.revenue.mrrTrend})
- Revenue Growth: ${trends.revenue.revenueGrowth}%
- User Growth: ${trends.users.userGrowth}%
- Activation Rate: ${trends.users.activationRate}%
- Stickiness Change: ${trends.engagement.stickinessChange}% (${trends.engagement.engagementTrend})
- Enrichment Growth: ${trends.product.enrichmentGrowth}%
- Success Rate Change: ${trends.product.successRateChange}%
- Adoption Rate: ${trends.product.adoptionRate}%

Context:
- Product: Audio Intel - contact enrichment SaaS for music industry
- Target: £500/month MRR by November 2025
- Current Phase: Customer acquisition (foundation complete)
- Key Segments: Radio promoters (85% conversion), solo artists (60%), PR agencies (70%)
  `;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are a growth advisor analyzing Audio Intel's weekly metrics.

${dataSum}

Analyze the data and provide:

1. **Key Insights** (3-5 bullet points)
   - What's working well?
   - What needs attention?
   - Any concerning trends?

2. **Strategic Recommendations** (3-5 specific actions)
   - Prioritized by impact
   - Actionable and measurable
   - Focused on reaching £500/month MRR goal

3. **Growth Opportunities**
   - Untapped potential in the data
   - Quick wins to pursue
   - Areas to double down on

Keep analysis concise, data-driven, and actionable. Focus on revenue growth and customer acquisition.`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

/**
 * Generate rule-based insights
 */
function generateRuleBasedInsights(
  weeklyData: WeeklyMetrics[],
  trends: ReturnType<typeof calculateTrends>
): GrowthInsight[] {
  const insights: GrowthInsight[] = [];
  const latest = weeklyData[weeklyData.length - 1];

  // Revenue insights
  if (trends.revenue.mrrGrowth > 20) {
    insights.push({
      category: 'revenue',
      severity: 'positive',
      title: 'Strong MRR Growth',
      description: `MRR grew by ${trends.revenue.mrrGrowth}% this week`,
      impact: 'On track to reach £500/month goal',
      recommendation: 'Continue current customer acquisition strategies',
    });
  } else if (latest.revenue.mrr < 50000) {
    insights.push({
      category: 'revenue',
      severity: 'high',
      title: 'MRR Below Target',
      description: `Current MRR £${(latest.revenue.mrr / 100).toFixed(2)} vs £500 goal`,
      impact: 'Need to accelerate customer acquisition',
      recommendation: 'Focus on radio promoter outreach (85% conversion segment)',
    });
  }

  // User insights
  if (trends.users.activationRate < 50) {
    insights.push({
      category: 'users',
      severity: 'medium',
      title: 'Low User Activation',
      description: `Only ${trends.users.activationRate}% of users are active`,
      impact: 'Missing revenue potential from inactive users',
      recommendation: 'Improve onboarding flow and value demonstration',
    });
  }

  // Engagement insights
  if (trends.engagement.engagementTrend === 'declining') {
    insights.push({
      category: 'engagement',
      severity: 'high',
      title: 'Declining Engagement',
      description: `Stickiness decreased by ${Math.abs(trends.engagement.stickinessChange)}%`,
      impact: 'Risk of increased churn',
      recommendation: 'Investigate user feedback and improve product experience',
    });
  }

  // Product insights
  if (latest.product.successRate < 80) {
    insights.push({
      category: 'product',
      severity: 'medium',
      title: 'Enrichment Success Rate Below Target',
      description: `Current success rate ${latest.product.successRate}% vs 95%+ target`,
      impact: 'User satisfaction and retention at risk',
      recommendation: 'Review failed enrichments and improve data quality',
    });
  }

  // Opportunity insights
  if (latest.product.enrichments > 100 && latest.revenue.activeSubscriptions === 0) {
    insights.push({
      category: 'opportunity',
      severity: 'critical',
      title: 'High Usage Without Revenue',
      description: `${latest.product.enrichments} enrichments but no active subscriptions`,
      impact: 'Missing revenue from engaged users',
      recommendation: 'Implement conversion campaigns and payment reminders',
    });
  }

  return insights;
}

/**
 * Generate growth insights report
 */
async function generateGrowthInsights(weeks: number = 4): Promise<GrowthInsightsReport> {
  console.log('📊 Generating Growth Insights...\n');
  console.log(`📅 Analysis Period: Last ${weeks} weeks\n`);

  // Fetch weekly metrics
  const weeklyData: WeeklyMetrics[] = [];
  const now = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 7);

    console.log(`📡 Fetching metrics for week ${weeks - i}/${weeks}...`);
    const metrics = await fetchWeekMetrics(weekStart, weekEnd);
    weeklyData.push(metrics);
  }

  console.log('\n🔍 Calculating trends...');
  const trends = calculateTrends(weeklyData);

  console.log('🤖 Generating AI insights...');
  const aiAnalysis = await generateAIInsights(weeklyData, trends);

  console.log('📝 Generating rule-based insights...');
  const insights = generateRuleBasedInsights(weeklyData, trends);

  console.log('\n✅ Growth Insights Complete!\n');

  return {
    generatedAt: new Date().toISOString(),
    periodWeeks: weeks,
    weeklyData,
    trends,
    insights,
    aiAnalysis,
    recommendations: [], // Generated from AI analysis
  };
}

/**
 * Format report as markdown
 */
function formatReport(report: GrowthInsightsReport): string {
  const { weeklyData, trends, insights, aiAnalysis } = report;
  const latest = weeklyData[weeklyData.length - 1];

  return `
# 📈 Growth Insights Report

**Generated**: ${new Date(report.generatedAt).toLocaleString('en-GB')}
**Period**: ${report.periodWeeks} weeks
**Analysis**: ${weeklyData[0].weekStart} to ${latest.weekEnd}

---

## Executive Summary

### Current Status

| Metric | Value | Trend |
|--------|-------|-------|
| **MRR** | £${(latest.revenue.mrr / 100).toFixed(2)} | ${trends.revenue.mrrTrend === 'up' ? '📈' : trends.revenue.mrrTrend === 'down' ? '📉' : '➡️'} ${trends.revenue.mrrGrowth}% |
| **Active Subs** | ${latest.revenue.activeSubscriptions} | - |
| **Total Users** | ${latest.users.total} | ${trends.users.userGrowth > 0 ? '📈' : '📉'} ${trends.users.userGrowth}% |
| **Active Users** | ${latest.users.active} | Activation: ${trends.users.activationRate}% |
| **Stickiness** | ${latest.engagement.stickiness}% | ${trends.engagement.stickinessChange > 0 ? '📈' : '📉'} ${trends.engagement.stickinessChange}% |
| **Enrichments** | ${latest.product.enrichments} | ${trends.product.enrichmentGrowth > 0 ? '📈' : '📉'} ${trends.product.enrichmentGrowth}% |
| **Success Rate** | ${latest.product.successRate}% | ${trends.product.successRateChange > 0 ? '📈' : '📉'} ${trends.product.successRateChange}% |

---

## 🎯 Key Insights

${insights
  .map((insight) => {
    const icon =
      insight.severity === 'positive'
        ? '✅'
        : insight.severity === 'critical'
          ? '🚨'
          : insight.severity === 'high'
            ? '⚠️'
            : 'ℹ️';
    return `### ${icon} ${insight.title}

**${insight.description}**

- **Impact**: ${insight.impact}
- **Recommendation**: ${insight.recommendation}
`;
  })
  .join('\n')}

---

## 🤖 AI Analysis

${aiAnalysis}

---

## 📊 Weekly Trends

${weeklyData
  .reverse()
  .map(
    (week, index) => `### Week ${weeklyData.length - index} (${week.weekStart} to ${week.weekEnd})

- MRR: £${(week.revenue.mrr / 100).toFixed(2)} | New Revenue: £${(week.revenue.newRevenue / 100).toFixed(2)}
- Users: ${week.users.total} total, ${week.users.new} new, ${week.users.active} active
- Engagement: DAU ${week.engagement.dau} | WAU ${week.engagement.wau} | Stickiness ${week.engagement.stickiness}%
- Product: ${week.product.enrichments} enrichments (${week.product.successRate}% success) | ${week.product.exports} exports
`
  )
  .join('\n')}

---

## 🎯 Action Items

Based on the analysis above, prioritize:

1. **Revenue Growth**: ${trends.revenue.mrrGrowth > 0 ? 'Continue current strategy' : 'Accelerate customer acquisition'}
2. **User Activation**: ${trends.users.activationRate > 50 ? 'Maintain onboarding quality' : 'Improve onboarding flow'}
3. **Engagement**: ${trends.engagement.engagementTrend === 'improving' ? 'Sustain momentum' : 'Address engagement decline'}
4. **Product Quality**: ${latest.product.successRate > 90 ? 'Excellent' : 'Improve enrichment accuracy'}

---

**Next Report**: ${new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString('en-GB')}
  `.trim();
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);

  const weeksIndex = args.indexOf('--weeks');
  const weeks = weeksIndex !== -1 ? parseInt(args[weeksIndex + 1], 10) : 4;

  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  try {
    const report = await generateGrowthInsights(weeks);
    const markdown = formatReport(report);

    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, markdown);
      console.log(`\n📄 Report saved to: ${outputPath}\n`);
    } else {
      console.log(markdown);
    }

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Growth insights generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { generateGrowthInsights };

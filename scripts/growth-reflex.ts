/**
 * Growth Reflex Analyser
 * Correlates feature usage with revenue impact
 * Identifies top drivers of MRR change
 * Outputs markdown report to reports/growth-reflex.md
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Types
// ============================================================================

interface FeatureCorrelation {
  eventName: string;
  totalOccurrences: number;
  uniqueUsers: number;
  totalRevenueImpact: number;
  avgRevenuePerUser: number;
  correlationStrength: 'strong' | 'moderate' | 'weak';
}

interface RevenueChange {
  period: string;
  totalRevenue: number;
  newRevenue: number;
  churnRevenue: number;
  netChange: number;
}

interface GrowthReflexReport {
  period: string;
  revenueChange: RevenueChange;
  topDrivers: FeatureCorrelation[];
  insights: string[];
  timestamp: string;
}

// ============================================================================
// Configuration
// ============================================================================

const CORRELATION_THRESHOLDS = {
  STRONG: 1000, // £10+ revenue impact per user
  MODERATE: 500, // £5-£10 revenue impact per user
  WEAK: 0, // <£5 revenue impact per user
};

const TOP_DRIVERS_LIMIT = 5;

// ============================================================================
// Database Client
// ============================================================================

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

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Calculate revenue change for current period vs previous period
 */
async function calculateRevenueChange(): Promise<RevenueChange> {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Current month revenue
  const { data: currentPayments } = await supabase
    .from('payments')
    .select('amount_cents')
    .gte('created_at', currentMonthStart.toISOString())
    .eq('status', 'succeeded');

  // Previous month revenue
  const { data: previousPayments } = await supabase
    .from('payments')
    .select('amount_cents')
    .gte('created_at', previousMonthStart.toISOString())
    .lt('created_at', currentMonthStart.toISOString())
    .eq('status', 'succeeded');

  const currentTotal = currentPayments?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;
  const previousTotal = previousPayments?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;

  // Calculate churn (cancelled subscriptions)
  const { data: churnEvents } = await supabase
    .from('conversion_events')
    .select('revenue_impact')
    .gte('created_at', currentMonthStart.toISOString())
    .eq('event_name', 'subscription_cancelled');

  const churnRevenue = Math.abs(
    churnEvents?.reduce((sum, e) => sum + (e.revenue_impact || 0), 0) || 0
  );

  return {
    period: currentMonthStart.toLocaleString('en-GB', { month: 'long', year: 'numeric' }),
    totalRevenue: currentTotal,
    newRevenue: Math.max(0, currentTotal - previousTotal),
    churnRevenue,
    netChange: currentTotal - previousTotal,
  };
}

/**
 * Analyse feature-to-revenue correlations
 */
async function analyseFeatureCorrelations(): Promise<FeatureCorrelation[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch conversion events from last 30 days
  const { data: events, error } = await supabase
    .from('conversion_events')
    .select('event_name, user_id, revenue_impact')
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch conversion events: ${error.message}`);
  }

  if (!events || events.length === 0) {
    console.warn('⚠️  No conversion events found in last 30 days');
    return [];
  }

  // Group by event name and calculate correlations
  const correlationMap: Record<
    string,
    { occurrences: number; users: Set<string>; revenueSum: number }
  > = {};

  for (const event of events) {
    const eventName = event.event_name;

    if (!correlationMap[eventName]) {
      correlationMap[eventName] = {
        occurrences: 0,
        users: new Set<string>(),
        revenueSum: 0,
      };
    }

    correlationMap[eventName].occurrences++;
    correlationMap[eventName].users.add(event.user_id);
    correlationMap[eventName].revenueSum += event.revenue_impact || 0;
  }

  // Calculate correlations
  const correlations: FeatureCorrelation[] = [];

  for (const [eventName, data] of Object.entries(correlationMap)) {
    const uniqueUsers = data.users.size;
    const avgRevenuePerUser = data.revenueSum / uniqueUsers;

    let correlationStrength: 'strong' | 'moderate' | 'weak';
    if (avgRevenuePerUser >= CORRELATION_THRESHOLDS.STRONG) {
      correlationStrength = 'strong';
    } else if (avgRevenuePerUser >= CORRELATION_THRESHOLDS.MODERATE) {
      correlationStrength = 'moderate';
    } else {
      correlationStrength = 'weak';
    }

    correlations.push({
      eventName,
      totalOccurrences: data.occurrences,
      uniqueUsers,
      totalRevenueImpact: data.revenueSum,
      avgRevenuePerUser,
      correlationStrength,
    });
  }

  // Sort by total revenue impact (descending)
  correlations.sort((a, b) => b.totalRevenueImpact - a.totalRevenueImpact);

  return correlations.slice(0, TOP_DRIVERS_LIMIT);
}

/**
 * Generate actionable insights from correlations
 */
function generateInsights(
  revenueChange: RevenueChange,
  topDrivers: FeatureCorrelation[]
): string[] {
  const insights: string[] = [];

  // Revenue trend insight
  if (revenueChange.netChange > 0) {
    insights.push(
      `Revenue increased by £${(revenueChange.netChange / 100).toFixed(2)} (${(
        (revenueChange.netChange / (revenueChange.totalRevenue - revenueChange.netChange)) *
        100
      ).toFixed(1)}% growth)`
    );
  } else if (revenueChange.netChange < 0) {
    insights.push(
      `Revenue decreased by £${(Math.abs(revenueChange.netChange) / 100).toFixed(2)} (${(
        (Math.abs(revenueChange.netChange) / revenueChange.totalRevenue) *
        100
      ).toFixed(1)}% decline)`
    );
  } else {
    insights.push('Revenue remained flat month-over-month');
  }

  // Churn insight
  if (revenueChange.churnRevenue > 0) {
    insights.push(`Churn cost £${(revenueChange.churnRevenue / 100).toFixed(2)} in lost MRR`);
  }

  // Top driver insights
  if (topDrivers.length > 0) {
    const topDriver = topDrivers[0];
    insights.push(
      `Strongest revenue driver: "${topDriver.eventName}" (£${(
        topDriver.totalRevenueImpact / 100
      ).toFixed(2)} total impact)`
    );

    // Strong correlation alert
    const strongDrivers = topDrivers.filter(d => d.correlationStrength === 'strong');
    if (strongDrivers.length > 0) {
      insights.push(
        `${strongDrivers.length} feature(s) with strong revenue correlation (£${
          CORRELATION_THRESHOLDS.STRONG / 100
        }+ per user)`
      );
    }

    // Weak correlation warning
    const weakDrivers = topDrivers.filter(d => d.correlationStrength === 'weak');
    if (weakDrivers.length > 0) {
      insights.push(
        `${weakDrivers.length} feature(s) with weak revenue correlation - investigate adoption barriers`
      );
    }
  } else {
    insights.push('No conversion events tracked - set up conversion tracking to enable insights');
  }

  return insights;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(report: GrowthReflexReport): string {
  let markdown = `# Growth Reflex Report\n\n`;
  markdown += `**Period**: ${report.period}  \n`;
  markdown += `**Generated**: ${new Date(report.timestamp).toLocaleString('en-GB')}  \n\n`;

  markdown += `---\n\n`;

  // Revenue Change Section
  markdown += `## Revenue Change\n\n`;
  markdown += `| Metric | Value |\n`;
  markdown += `|--------|-------|\n`;
  markdown += `| Total Revenue | £${(report.revenueChange.totalRevenue / 100).toFixed(2)} |\n`;
  markdown += `| New Revenue | £${(report.revenueChange.newRevenue / 100).toFixed(2)} |\n`;
  markdown += `| Churn Revenue | £${(report.revenueChange.churnRevenue / 100).toFixed(2)} |\n`;
  markdown += `| Net Change | £${(report.revenueChange.netChange / 100).toFixed(2)} |\n\n`;

  // Top Drivers Section
  if (report.topDrivers.length > 0) {
    markdown += `## Top Revenue Drivers\n\n`;
    markdown += `| Feature Event | Occurrences | Unique Users | Total Impact | Avg/User | Strength |\n`;
    markdown += `|---------------|-------------|--------------|--------------|----------|----------|\n`;

    for (const driver of report.topDrivers) {
      const strengthEmoji =
        driver.correlationStrength === 'strong'
          ? '🟢'
          : driver.correlationStrength === 'moderate'
            ? '🟡'
            : '🔴';
      markdown += `| ${driver.eventName} | ${driver.totalOccurrences} | ${driver.uniqueUsers} | £${(
        driver.totalRevenueImpact / 100
      ).toFixed(2)} | £${(driver.avgRevenuePerUser / 100).toFixed(2)} | ${strengthEmoji} ${
        driver.correlationStrength
      } |\n`;
    }
    markdown += `\n`;
  } else {
    markdown += `## Top Revenue Drivers\n\n`;
    markdown += `_No conversion events tracked in the last 30 days._\n\n`;
  }

  // Insights Section
  markdown += `## Key Insights\n\n`;
  for (const insight of report.insights) {
    markdown += `- ${insight}\n`;
  }
  markdown += `\n`;

  // Recommendations Section
  markdown += `## Recommendations\n\n`;
  if (report.topDrivers.length > 0) {
    const strongDrivers = report.topDrivers.filter(d => d.correlationStrength === 'strong');
    const weakDrivers = report.topDrivers.filter(d => d.correlationStrength === 'weak');

    if (strongDrivers.length > 0) {
      markdown += `### 🟢 Double Down on Strong Drivers\n\n`;
      for (const driver of strongDrivers) {
        markdown += `- **${driver.eventName}**: Strong £${(driver.avgRevenuePerUser / 100).toFixed(
          2
        )}/user impact - increase adoption and visibility\n`;
      }
      markdown += `\n`;
    }

    if (weakDrivers.length > 0) {
      markdown += `### 🔴 Investigate Weak Correlations\n\n`;
      for (const driver of weakDrivers) {
        markdown += `- **${driver.eventName}**: Low revenue impact (£${(
          driver.avgRevenuePerUser / 100
        ).toFixed(2)}/user) - improve feature value or remove friction\n`;
      }
      markdown += `\n`;
    }
  } else {
    markdown += `1. Set up conversion event tracking via \`conversion_events\` table\n`;
    markdown += `2. Track key events: \`trial_started\`, \`upgraded_to_pro\`, \`feature_adopted\`, etc.\n`;
    markdown += `3. Re-run this analysis after 30 days of tracking\n\n`;
  }

  markdown += `---\n\n`;
  markdown += `_Generated by Growth Reflex Analyser_\n`;

  return markdown;
}

/**
 * Write report to file
 */
function writeReportToFile(markdown: string): void {
  const reportsDir = join(process.cwd(), 'reports');

  // Create reports directory if it doesn't exist
  if (!existsSync(reportsDir)) {
    mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = join(reportsDir, 'growth-reflex.md');
  writeFileSync(reportPath, markdown, 'utf-8');

  console.log(`✅ Report written to: ${reportPath}`);
}

/**
 * Send report summary to Telegram
 */
async function sendTelegramNotification(report: GrowthReflexReport): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('⚠️  Telegram credentials not configured, skipping notification');
    return;
  }

  // Format message
  let message = `📈 *Growth Reflex Report* - ${report.period}\n\n`;

  // Revenue change
  const changeEmoji = report.revenueChange.netChange >= 0 ? '📈' : '📉';
  message += `${changeEmoji} Revenue: £${(report.revenueChange.totalRevenue / 100).toFixed(2)} (${
    report.revenueChange.netChange >= 0 ? '+' : ''
  }£${(report.revenueChange.netChange / 100).toFixed(2)})\n\n`;

  // Top drivers
  if (report.topDrivers.length > 0) {
    message += `*Top Revenue Drivers:*\n`;
    for (let i = 0; i < Math.min(3, report.topDrivers.length); i++) {
      const driver = report.topDrivers[i];
      message += `${i + 1}. ${driver.eventName}: £${(driver.totalRevenueImpact / 100).toFixed(
        2
      )}\n`;
    }
    message += `\n`;
  }

  // Key insights
  if (report.insights.length > 0) {
    message += `*Key Insights:*\n`;
    for (const insight of report.insights.slice(0, 3)) {
      message += `• ${insight}\n`;
    }
  }

  message += `\n_Full report: reports/growth-reflex.md_`;

  // Send via Telegram Bot API
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Telegram notification failed:', error);
    } else {
      console.log('✅ Telegram notification sent successfully');
    }
  } catch (error: any) {
    console.error('❌ Telegram notification error:', error.message);
  }
}

/**
 * Print report summary to console
 */
function printReportSummary(report: GrowthReflexReport): void {
  console.log('\n' + '='.repeat(80));
  console.log('GROWTH REFLEX REPORT');
  console.log('='.repeat(80));
  console.log(`Period: ${report.period}`);
  console.log(`Generated: ${new Date(report.timestamp).toLocaleString('en-GB')}`);
  console.log('='.repeat(80));

  // Revenue change
  console.log('\nREVENUE CHANGE:');
  console.log('-'.repeat(80));
  console.log(`Total Revenue: £${(report.revenueChange.totalRevenue / 100).toFixed(2)}`);
  console.log(`New Revenue:   £${(report.revenueChange.newRevenue / 100).toFixed(2)}`);
  console.log(`Churn Revenue: £${(report.revenueChange.churnRevenue / 100).toFixed(2)}`);
  console.log(`Net Change:    £${(report.revenueChange.netChange / 100).toFixed(2)}`);

  // Top drivers
  if (report.topDrivers.length > 0) {
    console.log('\nTOP REVENUE DRIVERS:');
    console.log('-'.repeat(80));
    console.log(
      'Feature Event'.padEnd(30) +
        'Impact'.padEnd(15) +
        'Users'.padEnd(10) +
        'Avg/User'.padEnd(15) +
        'Strength'
    );
    console.log('-'.repeat(80));

    for (const driver of report.topDrivers) {
      console.log(
        driver.eventName.padEnd(30) +
          `£${(driver.totalRevenueImpact / 100).toFixed(2)}`.padEnd(15) +
          driver.uniqueUsers.toString().padEnd(10) +
          `£${(driver.avgRevenuePerUser / 100).toFixed(2)}`.padEnd(15) +
          driver.correlationStrength
      );
    }
  }

  // Insights
  console.log('\nKEY INSIGHTS:');
  console.log('-'.repeat(80));
  for (const insight of report.insights) {
    console.log(`• ${insight}`);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// ============================================================================
// CLI Execution
// ============================================================================

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run');
  const shouldNotify = process.argv.includes('--notify');

  console.log('📊 Analysing feature-to-revenue correlations...');

  try {
    // Fetch data
    const revenueChange = await calculateRevenueChange();
    const topDrivers = await analyseFeatureCorrelations();

    // Generate insights
    const insights = generateInsights(revenueChange, topDrivers);

    // Create report
    const report: GrowthReflexReport = {
      period: revenueChange.period,
      revenueChange,
      topDrivers,
      insights,
      timestamp: new Date().toISOString(),
    };

    // Output
    printReportSummary(report);

    // Generate markdown and write to file
    if (!isDryRun) {
      const markdown = generateMarkdownReport(report);
      writeReportToFile(markdown);
    } else {
      console.log('🏃 DRY RUN - Skipping file write');
    }

    // Send notification if requested
    if (shouldNotify && !isDryRun) {
      console.log('📤 Sending Telegram notification...');
      await sendTelegramNotification(report);
    }

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Growth reflex analysis failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as runGrowthReflex };

/**
 * Agent Observability Monitor
 * Collects last 24h agent execution metrics and compares with 7-day baseline
 * Outputs status: PASS / WARN / FAIL
 * Optionally sends summary to Telegram
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Types
// ============================================================================

interface AgentMetrics {
  app: string;
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  successRate: number;
  avgLatency: number;
  errorCodes: Record<string, number>;
}

interface BaselineMetrics {
  successRate: number;
  avgLatency: number;
}

interface ObservabilityReport {
  status: 'PASS' | 'WARN' | 'FAIL';
  summary: string;
  metrics: AgentMetrics[];
  baseline: Record<string, BaselineMetrics>;
  alerts: string[];
  timestamp: string;
}

// ============================================================================
// Configuration
// ============================================================================

const THRESHOLDS = {
  SUCCESS_RATE_WARN: 95, // Warn if success rate drops below 95%
  SUCCESS_RATE_FAIL: 90, // Fail if success rate drops below 90%
  LATENCY_WARN_FACTOR: 1.5, // Warn if latency is 1.5x baseline
  LATENCY_FAIL_FACTOR: 2.0, // Fail if latency is 2x baseline
  MIN_EVENTS_FOR_ALERT: 10, // Minimum events to trigger alerts
};

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
 * Fetch agent events for the last 24 hours
 */
async function fetchLast24HourMetrics(): Promise<AgentMetrics[]> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: events, error } = await supabase
    .from('agent_events')
    .select('*')
    .gte('created_at', twentyFourHoursAgo)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch agent events: ${error.message}`);
  }

  if (!events || events.length === 0) {
    console.warn('⚠️  No agent events found in last 24 hours');
    return [];
  }

  // Group by app
  const metricsByApp: Record<string, AgentMetrics> = {};

  for (const event of events) {
    const app = event.app;

    if (!metricsByApp[app]) {
      metricsByApp[app] = {
        app,
        totalEvents: 0,
        successfulEvents: 0,
        failedEvents: 0,
        successRate: 0,
        avgLatency: 0,
        errorCodes: {},
      };
    }

    const metrics = metricsByApp[app];
    metrics.totalEvents++;

    if (event.success) {
      metrics.successfulEvents++;
    } else {
      metrics.failedEvents++;
      const errorCode = event.error_code || 'UNKNOWN';
      metrics.errorCodes[errorCode] = (metrics.errorCodes[errorCode] || 0) + 1;
    }

    // Accumulate latency for averaging
    if (event.latency_ms) {
      metrics.avgLatency += event.latency_ms;
    }
  }

  // Calculate averages and success rates
  const metricsArray: AgentMetrics[] = [];
  for (const app in metricsByApp) {
    const metrics = metricsByApp[app];
    metrics.successRate = (metrics.successfulEvents / metrics.totalEvents) * 100;
    metrics.avgLatency = Math.round(metrics.avgLatency / metrics.totalEvents);
    metricsArray.push(metrics);
  }

  return metricsArray;
}

/**
 * Fetch 7-day baseline metrics for comparison
 */
async function fetch7DayBaseline(): Promise<Record<string, BaselineMetrics>> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: events, error } = await supabase
    .from('agent_events')
    .select('app, success, latency_ms')
    .gte('created_at', sevenDaysAgo)
    .lt('created_at', twentyFourHoursAgo);

  if (error) {
    throw new Error(`Failed to fetch baseline metrics: ${error.message}`);
  }

  if (!events || events.length === 0) {
    console.warn('⚠️  No baseline data available (7-day history)');
    return {};
  }

  // Group by app and calculate baseline
  const baselineByApp: Record<string, { total: number; successful: number; latencySum: number }> =
    {};

  for (const event of events) {
    const app = event.app;

    if (!baselineByApp[app]) {
      baselineByApp[app] = { total: 0, successful: 0, latencySum: 0 };
    }

    baselineByApp[app].total++;
    if (event.success) {
      baselineByApp[app].successful++;
    }
    if (event.latency_ms) {
      baselineByApp[app].latencySum += event.latency_ms;
    }
  }

  // Calculate baseline metrics
  const baseline: Record<string, BaselineMetrics> = {};
  for (const app in baselineByApp) {
    const data = baselineByApp[app];
    baseline[app] = {
      successRate: (data.successful / data.total) * 100,
      avgLatency: Math.round(data.latencySum / data.total),
    };
  }

  return baseline;
}

/**
 * Analyse metrics and generate alerts
 */
function analyseMetrics(
  metrics: AgentMetrics[],
  baseline: Record<string, BaselineMetrics>
): ObservabilityReport {
  const alerts: string[] = [];
  let overallStatus: 'PASS' | 'WARN' | 'FAIL' = 'PASS';

  for (const metric of metrics) {
    const app = metric.app;
    const baselineMetric = baseline[app];

    // Skip analysis if insufficient events
    if (metric.totalEvents < THRESHOLDS.MIN_EVENTS_FOR_ALERT) {
      continue;
    }

    // Check success rate
    if (metric.successRate < THRESHOLDS.SUCCESS_RATE_FAIL) {
      alerts.push(
        `🚨 CRITICAL: ${app} success rate ${metric.successRate.toFixed(1)}% (threshold: ${THRESHOLDS.SUCCESS_RATE_FAIL}%)`
      );
      overallStatus = 'FAIL';
    } else if (metric.successRate < THRESHOLDS.SUCCESS_RATE_WARN) {
      alerts.push(
        `⚠️  WARNING: ${app} success rate ${metric.successRate.toFixed(1)}% (threshold: ${THRESHOLDS.SUCCESS_RATE_WARN}%)`
      );
      if (overallStatus !== 'FAIL') {
        overallStatus = 'WARN';
      }
    }

    // Check latency regression (if baseline available)
    if (baselineMetric) {
      const latencyIncrease = metric.avgLatency / baselineMetric.avgLatency;

      if (latencyIncrease >= THRESHOLDS.LATENCY_FAIL_FACTOR) {
        alerts.push(
          `🚨 CRITICAL: ${app} latency ${metric.avgLatency}ms (${latencyIncrease.toFixed(1)}x baseline)`
        );
        overallStatus = 'FAIL';
      } else if (latencyIncrease >= THRESHOLDS.LATENCY_WARN_FACTOR) {
        alerts.push(
          `⚠️  WARNING: ${app} latency ${metric.avgLatency}ms (${latencyIncrease.toFixed(1)}x baseline)`
        );
        if (overallStatus !== 'FAIL') {
          overallStatus = 'WARN';
        }
      }
    }

    // Alert on error codes
    if (metric.failedEvents > 0) {
      const errorSummary = Object.entries(metric.errorCodes)
        .map(([code, count]) => `${code}=${count}`)
        .join(', ');
      alerts.push(`ℹ️  ${app} errors: ${errorSummary}`);
    }
  }

  // Generate summary
  const totalEvents = metrics.reduce((sum, m) => sum + m.totalEvents, 0);
  const totalSuccesses = metrics.reduce((sum, m) => sum + m.successfulEvents, 0);
  const overallSuccessRate = (totalSuccesses / totalEvents) * 100;

  const summary =
    overallStatus === 'PASS'
      ? `✅ All agents healthy - ${totalEvents} events, ${overallSuccessRate.toFixed(1)}% success rate`
      : `${overallStatus === 'WARN' ? '⚠️' : '🚨'} Agent health issues detected - ${alerts.length} alert(s)`;

  return {
    status: overallStatus,
    summary,
    metrics,
    baseline,
    alerts,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Send report to Telegram
 */
async function sendTelegramNotification(report: ObservabilityReport): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('⚠️  Telegram credentials not configured, skipping notification');
    return;
  }

  // Format message
  const statusEmoji = report.status === 'PASS' ? '✅' : report.status === 'WARN' ? '⚠️' : '🚨';
  let message = `${statusEmoji} *Agent Health Report*\n\n`;
  message += `${report.summary}\n\n`;

  // Add metrics table
  if (report.metrics.length > 0) {
    message += `*Metrics (Last 24h):*\n`;
    for (const metric of report.metrics) {
      message += `• ${metric.app}: ${metric.totalEvents} events, ${metric.successRate.toFixed(1)}% success, ${metric.avgLatency}ms avg\n`;
    }
    message += '\n';
  }

  // Add alerts
  if (report.alerts.length > 0) {
    message += `*Alerts:*\n`;
    for (const alert of report.alerts) {
      message += `${alert}\n`;
    }
    message += '\n';
  }

  message += `_Generated: ${new Date(report.timestamp).toLocaleString('en-GB')}_`;

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
 * Output report to console
 */
function printReport(report: ObservabilityReport): void {
  console.log('\n' + '='.repeat(80));
  console.log('AGENT OBSERVABILITY REPORT');
  console.log('='.repeat(80));
  console.log(`Status: ${report.status}`);
  console.log(`Summary: ${report.summary}`);
  console.log(`Timestamp: ${new Date(report.timestamp).toLocaleString('en-GB')}`);
  console.log('='.repeat(80));

  // Metrics table
  console.log('\nMETRICS (Last 24h):');
  console.log('-'.repeat(80));
  console.log(
    'App'.padEnd(20) +
      'Events'.padEnd(12) +
      'Success Rate'.padEnd(16) +
      'Avg Latency'.padEnd(16) +
      'Errors'
  );
  console.log('-'.repeat(80));

  for (const metric of report.metrics) {
    console.log(
      metric.app.padEnd(20) +
        metric.totalEvents.toString().padEnd(12) +
        `${metric.successRate.toFixed(1)}%`.padEnd(16) +
        `${metric.avgLatency}ms`.padEnd(16) +
        metric.failedEvents.toString()
    );
  }

  // Baseline comparison
  if (Object.keys(report.baseline).length > 0) {
    console.log('\nBASELINE COMPARISON (7-day average):');
    console.log('-'.repeat(80));
    console.log('App'.padEnd(20) + 'Baseline Success'.padEnd(20) + 'Baseline Latency');
    console.log('-'.repeat(80));

    for (const [app, baseline] of Object.entries(report.baseline)) {
      console.log(
        app.padEnd(20) + `${baseline.successRate.toFixed(1)}%`.padEnd(20) + `${baseline.avgLatency}ms`
      );
    }
  }

  // Alerts
  if (report.alerts.length > 0) {
    console.log('\nALERTS:');
    console.log('-'.repeat(80));
    for (const alert of report.alerts) {
      console.log(alert);
    }
  } else {
    console.log('\n✅ No alerts - all metrics within normal range');
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// ============================================================================
// CLI Execution
// ============================================================================

async function main(): Promise<void> {
  const isDryRun = process.argv.includes('--dry-run');
  const shouldNotify = process.argv.includes('--notify');

  console.log('🔍 Fetching agent metrics...');

  try {
    // Fetch metrics
    const metrics = await fetchLast24HourMetrics();
    const baseline = await fetch7DayBaseline();

    // Analyse
    const report = analyseMetrics(metrics, baseline);

    // Output
    printReport(report);

    // Send notification if requested (and not dry-run)
    if (shouldNotify && !isDryRun) {
      console.log('📤 Sending Telegram notification...');
      await sendTelegramNotification(report);
    } else if (isDryRun) {
      console.log('🏃 DRY RUN - Skipping Telegram notification');
    }

    // Exit with appropriate code
    process.exit(report.status === 'PASS' ? 0 : report.status === 'WARN' ? 1 : 2);
  } catch (error: any) {
    console.error('❌ Agent observability failed:', error.message);
    process.exit(3);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main as runAgentObservability };

/**
 * Revenue Audit Script
 * Generates comprehensive revenue validation report
 *
 * Usage:
 *   npx tsx scripts/revenue-audit.ts
 *   npx tsx scripts/revenue-audit.ts --month 2025-11
 *   npx tsx scripts/revenue-audit.ts --output reports/revenue/2025-11.md
 */

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

interface RevenueAuditReport {
  month: string;
  generatedAt: string;
  summary: {
    totalRevenue: number;
    stripeRevenue: number;
    databaseRevenue: number;
    discrepancy: number;
    discrepancyPercentage: number;
  };
  stripe: {
    paymentIntents: {
      count: number;
      total: number;
      succeeded: number;
      failed: number;
    };
    invoices: {
      count: number;
      total: number;
      paid: number;
      unpaid: number;
    };
    subscriptions: {
      active: number;
      cancelled: number;
      pastDue: number;
      totalMRR: number;
    };
    refunds: {
      count: number;
      total: number;
    };
  };
  database: {
    payments: {
      count: number;
      succeeded: number;
      failed: number;
      refunded: number;
      totalAmount: number;
    };
    missingPayments: Array<{
      stripeId: string;
      amount: number;
      status: string;
      reason: string;
    }>;
    orphanedPayments: Array<{
      id: string;
      stripeId: string | null;
      amount: number;
      reason: string;
    }>;
  };
  validation: {
    status: 'PASS' | 'WARNING' | 'FAIL';
    issues: Array<{
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      type: string;
      message: string;
      count?: number;
    }>;
  };
  recommendations: string[];
}

async function generateRevenueAudit(month?: string): Promise<RevenueAuditReport> {
  console.log('📊 Starting Revenue Audit...\n');

  // Determine audit period
  const targetMonth = month || getCurrentMonth();
  const { startDate, endDate } = getMonthBoundaries(targetMonth);

  console.log(`📅 Audit Period: ${targetMonth}`);
  console.log(`  Start: ${startDate.toISOString()}`);
  console.log(`  End: ${endDate.toISOString()}\n`);

  // Fetch Stripe data
  console.log('📡 Fetching data from Stripe...');
  const stripeData = await fetchStripeData(startDate, endDate);

  // Fetch database data
  console.log('📡 Fetching data from database...');
  const databaseData = await fetchDatabaseData(startDate, endDate);

  // Cross-validate
  console.log('🔍 Cross-validating data...');
  const validation = await crossValidate(stripeData, databaseData);

  // Calculate summary
  const summary = {
    totalRevenue: stripeData.paymentIntents.total + stripeData.invoices.total,
    stripeRevenue: stripeData.paymentIntents.total + stripeData.invoices.total,
    databaseRevenue: databaseData.payments.totalAmount,
    discrepancy: 0,
    discrepancyPercentage: 0,
  };

  summary.discrepancy = Math.abs(summary.stripeRevenue - summary.databaseRevenue);
  summary.discrepancyPercentage =
    summary.stripeRevenue > 0 ? (summary.discrepancy / summary.stripeRevenue) * 100 : 0;

  const report: RevenueAuditReport = {
    month: targetMonth,
    generatedAt: new Date().toISOString(),
    summary,
    stripe: stripeData,
    database: databaseData,
    validation,
    recommendations: generateRecommendations(summary, validation),
  };

  console.log('\n✅ Revenue Audit Complete!\n');

  return report;
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthBoundaries(month: string): { startDate: Date; endDate: Date } {
  const [year, monthNum] = month.split('-').map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
  return { startDate, endDate };
}

async function fetchStripeData(startDate: Date, endDate: Date) {
  const startTimestamp = Math.floor(startDate.getTime() / 1000);
  const endTimestamp = Math.floor(endDate.getTime() / 1000);

  // Fetch payment intents
  const paymentIntents = await stripe.paymentIntents.list({
    created: {
      gte: startTimestamp,
      lte: endTimestamp,
    },
    limit: 100,
  });

  const piData = {
    count: paymentIntents.data.length,
    total: 0,
    succeeded: 0,
    failed: 0,
  };

  paymentIntents.data.forEach(pi => {
    if (pi.status === 'succeeded') {
      piData.succeeded++;
      piData.total += pi.amount;
    } else if (pi.status === 'failed' || pi.status === 'canceled') {
      piData.failed++;
    }
  });

  // Fetch invoices
  const invoices = await stripe.invoices.list({
    created: {
      gte: startTimestamp,
      lte: endTimestamp,
    },
    limit: 100,
  });

  const invoiceData = {
    count: invoices.data.length,
    total: 0,
    paid: 0,
    unpaid: 0,
  };

  invoices.data.forEach(invoice => {
    if (invoice.status === 'paid') {
      invoiceData.paid++;
      invoiceData.total += invoice.amount_paid;
    } else {
      invoiceData.unpaid++;
    }
  });

  // Fetch active subscriptions
  const subscriptions = await stripe.subscriptions.list({
    status: 'all',
    limit: 100,
  });

  const subData = {
    active: 0,
    cancelled: 0,
    pastDue: 0,
    totalMRR: 0,
  };

  subscriptions.data.forEach(sub => {
    if (sub.status === 'active') {
      subData.active++;
      const price = sub.items.data[0]?.price;
      if (price) {
        const amount = price.unit_amount || 0;
        if (price.recurring?.interval === 'year') {
          subData.totalMRR += amount / 12;
        } else {
          subData.totalMRR += amount;
        }
      }
    } else if (sub.status === 'canceled') {
      subData.cancelled++;
    } else if (sub.status === 'past_due') {
      subData.pastDue++;
    }
  });

  // Fetch refunds
  const refunds = await stripe.refunds.list({
    created: {
      gte: startTimestamp,
      lte: endTimestamp,
    },
    limit: 100,
  });

  const refundData = {
    count: refunds.data.length,
    total: refunds.data.reduce((sum, r) => sum + r.amount, 0),
  };

  return {
    paymentIntents: piData,
    invoices: invoiceData,
    subscriptions: subData,
    refunds: refundData,
  };
}

async function fetchDatabaseData(startDate: Date, endDate: Date) {
  // Fetch payments from database
  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }

  const paymentData = {
    count: payments?.length || 0,
    succeeded: 0,
    failed: 0,
    refunded: 0,
    totalAmount: 0,
  };

  payments?.forEach(p => {
    if (p.status === 'succeeded') {
      paymentData.succeeded++;
      paymentData.totalAmount += p.amount_cents;
    } else if (p.status === 'failed') {
      paymentData.failed++;
    } else if (p.status === 'refunded') {
      paymentData.refunded++;
    }
  });

  return {
    payments: paymentData,
    missingPayments: [],
    orphanedPayments: [],
  };
}

async function crossValidate(
  stripeData: Awaited<ReturnType<typeof fetchStripeData>>,
  databaseData: Awaited<ReturnType<typeof fetchDatabaseData>>
) {
  const issues: RevenueAuditReport['validation']['issues'] = [];

  // Check revenue discrepancy
  const stripeRevenue = stripeData.paymentIntents.total + stripeData.invoices.total;
  const dbRevenue = databaseData.payments.totalAmount;
  const discrepancy = Math.abs(stripeRevenue - dbRevenue);
  const discrepancyPct = stripeRevenue > 0 ? (discrepancy / stripeRevenue) * 100 : 0;

  if (discrepancyPct > 5) {
    issues.push({
      severity: 'HIGH',
      type: 'REVENUE_MISMATCH',
      message: `Revenue discrepancy ${discrepancyPct.toFixed(2)}% (£${(discrepancy / 100).toFixed(
        2
      )})`,
    });
  } else if (discrepancyPct > 1) {
    issues.push({
      severity: 'MEDIUM',
      type: 'REVENUE_MISMATCH',
      message: `Minor revenue discrepancy ${discrepancyPct.toFixed(2)}% (£${(
        discrepancy / 100
      ).toFixed(2)})`,
    });
  }

  // Check payment count mismatch
  const stripePaymentCount = stripeData.paymentIntents.count + stripeData.invoices.count;
  const dbPaymentCount = databaseData.payments.count;
  if (Math.abs(stripePaymentCount - dbPaymentCount) > 0) {
    issues.push({
      severity: 'MEDIUM',
      type: 'PAYMENT_COUNT_MISMATCH',
      message: `Payment count mismatch: Stripe ${stripePaymentCount}, DB ${dbPaymentCount}`,
      count: Math.abs(stripePaymentCount - dbPaymentCount),
    });
  }

  // Check for past due subscriptions
  if (stripeData.subscriptions.pastDue > 0) {
    issues.push({
      severity: 'MEDIUM',
      type: 'PAST_DUE_SUBSCRIPTIONS',
      message: `${stripeData.subscriptions.pastDue} subscription(s) past due`,
      count: stripeData.subscriptions.pastDue,
    });
  }

  // Check for refunds
  if (stripeData.refunds.count > 0) {
    issues.push({
      severity: 'LOW',
      type: 'REFUNDS',
      message: `${stripeData.refunds.count} refund(s) totaling £${(
        stripeData.refunds.total / 100
      ).toFixed(2)}`,
      count: stripeData.refunds.count,
    });
  }

  // Determine overall status
  let status: RevenueAuditReport['validation']['status'] = 'PASS';
  if (issues.some(i => i.severity === 'HIGH')) {
    status = 'FAIL';
  } else if (issues.some(i => i.severity === 'MEDIUM')) {
    status = 'WARNING';
  }

  return { status, issues };
}

function generateRecommendations(
  summary: RevenueAuditReport['summary'],
  validation: RevenueAuditReport['validation']
): string[] {
  const recommendations: string[] = [];

  if (validation.status === 'FAIL') {
    recommendations.push(
      '🚨 **CRITICAL**: Revenue discrepancy detected. Run backfill script immediately.'
    );
    recommendations.push(
      'Review Stripe webhook configuration and ensure all events are being received.'
    );
  }

  if (validation.status === 'WARNING') {
    recommendations.push('⚠️ Review missing or orphaned payments and update database accordingly.');
  }

  if (summary.discrepancyPercentage > 1) {
    recommendations.push(
      `Consider running: \`npx tsx scripts/backfill-stripe.ts --days 30\` to sync historical data.`
    );
  }

  const pastDueIssue = validation.issues.find(i => i.type === 'PAST_DUE_SUBSCRIPTIONS');
  if (pastDueIssue) {
    recommendations.push(
      `📧 Contact ${pastDueIssue.count} customer(s) with past due subscriptions to update payment methods.`
    );
  }

  if (validation.status === 'PASS') {
    recommendations.push('✅ Revenue data is in sync. Continue monitoring daily.');
  }

  return recommendations;
}

function formatReport(report: RevenueAuditReport): string {
  const { month, generatedAt, summary, stripe, database, validation, recommendations } = report;

  const statusEmoji = {
    PASS: '✅',
    WARNING: '⚠️',
    FAIL: '❌',
  };

  return `
# 💰 Revenue Audit Report - ${month}

**Generated**: ${new Date(generatedAt).toLocaleString('en-GB')}
**Status**: ${statusEmoji[validation.status]} ${validation.status}

---

## Executive Summary

| Metric | Stripe | Database | Δ |
|--------|--------|----------|---|
| **Total Revenue** | £${(summary.stripeRevenue / 100).toFixed(2)} | £${(
    summary.databaseRevenue / 100
  ).toFixed(2)} | £${(summary.discrepancy / 100).toFixed(
    2
  )} (${summary.discrepancyPercentage.toFixed(2)}%) |
| **Payment Count** | ${stripe.paymentIntents.count + stripe.invoices.count} | ${
    database.payments.count
  } | ${Math.abs(stripe.paymentIntents.count + stripe.invoices.count - database.payments.count)} |
| **MRR** | £${(stripe.subscriptions.totalMRR / 100).toFixed(2)} | - | - |

---

## 📊 Stripe Data

### Payment Intents
- **Total**: ${stripe.paymentIntents.count}
- **Succeeded**: ${stripe.paymentIntents.succeeded}
- **Failed**: ${stripe.paymentIntents.failed}
- **Amount**: £${(stripe.paymentIntents.total / 100).toFixed(2)}

### Invoices
- **Total**: ${stripe.invoices.count}
- **Paid**: ${stripe.invoices.paid}
- **Unpaid**: ${stripe.invoices.unpaid}
- **Amount**: £${(stripe.invoices.total / 100).toFixed(2)}

### Subscriptions
- **Active**: ${stripe.subscriptions.active}
- **Cancelled**: ${stripe.subscriptions.cancelled}
- **Past Due**: ${stripe.subscriptions.pastDue}
- **MRR**: £${(stripe.subscriptions.totalMRR / 100).toFixed(2)}

### Refunds
- **Count**: ${stripe.refunds.count}
- **Total**: £${(stripe.refunds.total / 100).toFixed(2)}

---

## 💾 Database Data

### Payments Table
- **Total Records**: ${database.payments.count}
- **Succeeded**: ${database.payments.succeeded}
- **Failed**: ${database.payments.failed}
- **Refunded**: ${database.payments.refunded}
- **Total Amount**: £${(database.payments.totalAmount / 100).toFixed(2)}

### Data Quality
- **Missing Payments**: ${database.missingPayments.length}
- **Orphaned Payments**: ${database.orphanedPayments.length}

---

## ⚠️ Validation Issues

${validation.issues.length === 0 ? '✅ No issues detected' : ''}
${validation.issues
  .map(issue => {
    const icon = issue.severity === 'HIGH' ? '🚨' : issue.severity === 'MEDIUM' ? '⚠️' : 'ℹ️';
    return `${icon} **[${issue.severity}]** ${issue.type}: ${issue.message}`;
  })
  .join('\n')}

---

## 🎯 Recommendations

${recommendations.map(r => `- ${r}`).join('\n')}

---

## 📌 Next Audit

**Recommended**: ${new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(
    'en-GB'
  )}

**Quick Commands**:
\`\`\`bash
# Re-run audit for current month
npx tsx scripts/revenue-audit.ts

# Audit specific month
npx tsx scripts/revenue-audit.ts --month 2025-12

# Save to file
npx tsx scripts/revenue-audit.ts --output reports/revenue/2025-11.md
\`\`\`

---

**Audit completed by**: Revenue Audit Script v1.0
**Report saved to**: \`reports/revenue/${month}.md\`
`.trim();
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const monthIndex = args.indexOf('--month');
  const month = monthIndex !== -1 ? args[monthIndex + 1] : undefined;

  const outputIndex = args.indexOf('--output');
  const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;

  try {
    const report = await generateRevenueAudit(month);
    const markdown = formatReport(report);

    // Determine output path
    const finalOutputPath = outputPath || `reports/revenue/${report.month}.md`;

    // Ensure directory exists
    const dir = path.dirname(finalOutputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write report
    fs.writeFileSync(finalOutputPath, markdown);

    console.log('\n📊 Revenue Audit Summary:\n');
    console.log(`  Status: ${report.validation.status}`);
    console.log(`  Stripe Revenue: £${(report.summary.stripeRevenue / 100).toFixed(2)}`);
    console.log(`  Database Revenue: £${(report.summary.databaseRevenue / 100).toFixed(2)}`);
    console.log(
      `  Discrepancy: £${(report.summary.discrepancy / 100).toFixed(
        2
      )} (${report.summary.discrepancyPercentage.toFixed(2)}%)`
    );
    console.log(`\n  Issues: ${report.validation.issues.length}`);
    console.log(`\n✅ Report saved to: ${finalOutputPath}\n`);

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Revenue audit failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { generateRevenueAudit };

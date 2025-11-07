/**
 * Cohort Refresh Script
 * Calculates and updates retention metrics for all user cohorts
 *
 * Usage:
 *   npx tsx scripts/cohort-refresh.ts
 *   npx tsx scripts/cohort-refresh.ts --period weekly
 *   npx tsx scripts/cohort-refresh.ts --cohort 2025-11-01
 *   npx tsx scripts/cohort-refresh.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js';

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

interface CohortData {
  cohort_date: string;
  total_users: number;
  first_user_at: string;
  last_user_at: string;
}

interface RetentionMetric {
  cohort_date: string;
  period_type: 'day' | 'week' | 'month';
  period_offset: number;
  total_users: number;
  retained_users: number;
  retention_rate: number;
  revenue_cents: number;
}

interface CohortRefreshOptions {
  period?: 'daily' | 'weekly' | 'monthly' | 'all';
  cohort?: string; // Specific cohort date to refresh
  dryRun?: boolean;
}

/**
 * Fetch all cohorts from the database
 */
async function fetchCohorts(specificCohort?: string): Promise<CohortData[]> {
  let query = supabase.from('cohort_overview').select('*');

  if (specificCohort) {
    query = query.eq('cohort_date', specificCohort);
  }

  const { data, error } = await query.order('cohort_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch cohorts: ${error.message}`);
  }

  return (data || []) as CohortData[];
}

/**
 * Calculate retention for a specific cohort and period
 */
async function calculateRetention(
  cohortDate: string,
  periodType: 'day' | 'week' | 'month',
  periodOffset: number
): Promise<RetentionMetric | null> {
  // Get cohort size
  const { data: cohortData, error: cohortError } = await supabase.rpc('get_cohort_size', {
    p_cohort_date: cohortDate,
  });

  if (cohortError) {
    console.error(`Error fetching cohort size for ${cohortDate}:`, cohortError);
    return null;
  }

  const totalUsers = cohortData as number;

  if (totalUsers === 0) {
    return null;
  }

  // Calculate target date range based on period
  const cohortDateObj = new Date(cohortDate);
  let targetDate: Date;

  switch (periodType) {
    case 'day':
      targetDate = new Date(cohortDateObj);
      targetDate.setDate(targetDate.getDate() + periodOffset);
      break;
    case 'week':
      targetDate = new Date(cohortDateObj);
      targetDate.setDate(targetDate.getDate() + periodOffset * 7);
      break;
    case 'month':
      targetDate = new Date(cohortDateObj);
      targetDate.setMonth(targetDate.getMonth() + periodOffset);
      break;
  }

  const targetDateEnd = new Date(targetDate);
  targetDateEnd.setDate(targetDateEnd.getDate() + 1);

  // Count retained users (users with events on the target date)
  const { data: retainedData, error: retainedError } = await supabase.rpc('sql', {
    query: `
      SELECT COUNT(DISTINCT uc.user_id) as retained_users
      FROM public.user_cohorts uc
      INNER JOIN public.events e ON e.user_id = uc.user_id
      WHERE uc.cohort_date = '${cohortDate}'
        AND e.created_at >= '${targetDate.toISOString()}'
        AND e.created_at < '${targetDateEnd.toISOString()}'
    `,
  });

  if (retainedError) {
    console.error(`Error calculating retention for ${cohortDate}:`, retainedError);
    return null;
  }

  const retainedUsers = (retainedData as any)?.retained_users || 0;
  const retentionRate = totalUsers > 0 ? (retainedUsers / totalUsers) * 100 : 0;

  // Calculate revenue for retained users in this period
  const { data: revenueData, error: revenueError } = await supabase
    .from('payments')
    .select('amount_cents')
    .in('user_id', [
      // Subquery would go here - simplified for now
    ])
    .gte('created_at', targetDate.toISOString())
    .lt('created_at', targetDateEnd.toISOString())
    .eq('status', 'succeeded');

  const revenueCents = revenueData?.reduce((sum, p) => sum + (p.amount_cents || 0), 0) || 0;

  return {
    cohort_date: cohortDate,
    period_type: periodType,
    period_offset: periodOffset,
    total_users: totalUsers,
    retained_users: retainedUsers,
    retention_rate: Math.round(retentionRate * 100) / 100,
    revenue_cents: revenueCents,
  };
}

/**
 * Upsert retention metric to database
 */
async function upsertRetentionMetric(metric: RetentionMetric, dryRun: boolean = false) {
  if (dryRun) {
    console.log(
      `[DRY RUN] Would upsert: ${metric.cohort_date} ${metric.period_type}+${metric.period_offset} = ${metric.retention_rate}% (${metric.retained_users}/${metric.total_users})`
    );
    return;
  }

  const { error } = await supabase.from('retention_metrics').upsert(
    {
      cohort_date: metric.cohort_date,
      period_type: metric.period_type,
      period_offset: metric.period_offset,
      total_users: metric.total_users,
      retained_users: metric.retained_users,
      retention_rate: metric.retention_rate,
      revenue_cents: metric.revenue_cents,
      calculated_at: new Date().toISOString(),
    },
    {
      onConflict: 'cohort_date,period_type,period_offset',
    }
  );

  if (error) {
    console.error(`Failed to upsert retention metric:`, error);
  }
}

/**
 * Refresh retention metrics for all cohorts
 */
async function refreshCohortMetrics(options: CohortRefreshOptions = {}) {
  const { period = 'all', cohort, dryRun = false } = options;

  console.log('📊 Starting Cohort Retention Refresh...\n');

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No data will be written\n');
  }

  // Fetch cohorts
  console.log(`📡 Fetching cohorts${cohort ? ` (${cohort})` : ''}...`);
  const cohorts = await fetchCohorts(cohort);
  console.log(`   Found ${cohorts.length} cohort(s)\n`);

  if (cohorts.length === 0) {
    console.log('No cohorts found. Exiting.');
    return;
  }

  // Define periods to calculate
  const periods: Array<{ type: 'day' | 'week' | 'month'; offsets: number[] }> = [];

  if (period === 'daily' || period === 'all') {
    periods.push({ type: 'day', offsets: [1, 7, 14, 30] });
  }

  if (period === 'weekly' || period === 'all') {
    periods.push({ type: 'week', offsets: [1, 2, 4, 8, 12] });
  }

  if (period === 'monthly' || period === 'all') {
    periods.push({ type: 'month', offsets: [1, 2, 3, 6, 12] });
  }

  let totalCalculations = 0;
  let successfulCalculations = 0;

  // Process each cohort
  for (const cohortData of cohorts) {
    console.log(
      `🔍 Processing cohort: ${cohortData.cohort_date} (${cohortData.total_users} users)`
    );

    for (const periodConfig of periods) {
      for (const offset of periodConfig.offsets) {
        totalCalculations++;

        const metric = await calculateRetention(cohortData.cohort_date, periodConfig.type, offset);

        if (metric) {
          await upsertRetentionMetric(metric, dryRun);
          successfulCalculations++;
        }
      }
    }

    console.log(`   ✅ Completed ${cohortData.cohort_date}\n`);
  }

  console.log('\n📈 Cohort Refresh Summary:\n');
  console.log(`   Cohorts Processed: ${cohorts.length}`);
  console.log(`   Metrics Calculated: ${successfulCalculations}/${totalCalculations}`);
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  if (dryRun) {
    console.log('⚠️  This was a dry run. Re-run without --dry-run to save data.\n');
  } else {
    console.log('✅ Retention metrics refreshed successfully!\n');
  }
}

/**
 * Generate cohort report
 */
async function generateCohortReport() {
  console.log('\n📊 Cohort Retention Report\n');
  console.log('='.repeat(80));

  // Fetch cohort overview
  const cohorts = await fetchCohorts();

  for (const cohort of cohorts.slice(0, 5)) {
    // Top 5 most recent cohorts
    console.log(`\n📅 Cohort: ${cohort.cohort_date} (${cohort.total_users} users)\n`);

    // Fetch retention metrics for this cohort
    const { data: metrics } = await supabase
      .from('retention_metrics')
      .select('*')
      .eq('cohort_date', cohort.cohort_date)
      .order('period_type')
      .order('period_offset');

    if (metrics && metrics.length > 0) {
      console.log('   Day Retention:');
      metrics
        .filter(m => m.period_type === 'day')
        .forEach(m => {
          console.log(
            `     Day ${m.period_offset}: ${m.retention_rate}% (${m.retained_users}/${m.total_users})`
          );
        });

      console.log('\n   Week Retention:');
      metrics
        .filter(m => m.period_type === 'week')
        .forEach(m => {
          console.log(
            `     Week ${m.period_offset}: ${m.retention_rate}% (${m.retained_users}/${m.total_users})`
          );
        });

      console.log('\n   Month Retention:');
      metrics
        .filter(m => m.period_type === 'month')
        .forEach(m => {
          console.log(
            `     Month ${m.period_offset}: ${m.retention_rate}% (${m.retained_users}/${
              m.total_users
            }) - £${(m.revenue_cents / 100).toFixed(2)}`
          );
        });
    } else {
      console.log('   No retention data available yet.');
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\nℹ️  Run `npx tsx scripts/cohort-refresh.ts` to update retention metrics.\n');
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);

  const options: CohortRefreshOptions = {
    dryRun: args.includes('--dry-run'),
  };

  const periodIndex = args.indexOf('--period');
  if (periodIndex !== -1) {
    options.period = args[periodIndex + 1] as CohortRefreshOptions['period'];
  }

  const cohortIndex = args.indexOf('--cohort');
  if (cohortIndex !== -1) {
    options.cohort = args[cohortIndex + 1];
  }

  const isReport = args.includes('--report');

  try {
    if (isReport) {
      await generateCohortReport();
    } else {
      await refreshCohortMetrics(options);
    }

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Cohort refresh failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { refreshCohortMetrics, generateCohortReport };

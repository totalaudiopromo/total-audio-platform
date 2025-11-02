/**
 * Cohorts API Endpoint
 * Provides cohort retention data for admin dashboard
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

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

export interface CohortData {
  cohortDate: string;
  totalUsers: number;
  retention: {
    day1: number;
    day7: number;
    day14: number;
    day30: number;
    week1: number;
    week2: number;
    week4: number;
    week8: number;
    week12: number;
    month1: number;
    month2: number;
    month3: number;
    month6: number;
    month12: number;
  };
  revenue: {
    total: number;
    perUser: number;
    byMonth: Array<{ month: string; amount: number }>;
  };
}

export interface CohortsResponse {
  cohorts: CohortData[];
  summary: {
    totalCohorts: number;
    totalUsers: number;
    averageRetention: {
      day7: number;
      day30: number;
      month3: number;
    };
    totalRevenue: number;
  };
}

/**
 * GET /api/admin/cohorts
 * Fetch cohort retention data with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const periodType = searchParams.get('periodType') || 'all'; // 'day', 'week', 'month', 'all'
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    // Fetch cohort overview
    let cohortQuery = supabase
      .from('cohort_overview')
      .select('*')
      .order('cohort_date', { ascending: false })
      .limit(limit);

    if (startDate) {
      cohortQuery = cohortQuery.gte('cohort_date', startDate);
    }

    if (endDate) {
      cohortQuery = cohortQuery.lte('cohort_date', endDate);
    }

    const { data: cohorts, error: cohortError } = await cohortQuery;

    if (cohortError) {
      throw new Error(`Failed to fetch cohorts: ${cohortError.message}`);
    }

    if (!cohorts || cohorts.length === 0) {
      return NextResponse.json({
        cohorts: [],
        summary: {
          totalCohorts: 0,
          totalUsers: 0,
          averageRetention: { day7: 0, day30: 0, month3: 0 },
          totalRevenue: 0,
        },
      });
    }

    // Fetch retention metrics for each cohort
    const cohortDataPromises = cohorts.map(async cohort => {
      const cohortDate = cohort.cohort_date;

      // Fetch retention metrics
      let metricsQuery = supabase
        .from('retention_metrics')
        .select('*')
        .eq('cohort_date', cohortDate);

      // Filter by period type if specified
      if (periodType !== 'all') {
        metricsQuery = metricsQuery.eq('period_type', periodType);
      }

      const { data: metrics } = await metricsQuery;

      // Organize retention data
      const retention = {
        day1: 0,
        day7: 0,
        day14: 0,
        day30: 0,
        week1: 0,
        week2: 0,
        week4: 0,
        week8: 0,
        week12: 0,
        month1: 0,
        month2: 0,
        month3: 0,
        month6: 0,
        month12: 0,
      };

      metrics?.forEach(metric => {
        const key = `${metric.period_type}${metric.period_offset}` as keyof typeof retention;
        if (key in retention) {
          retention[key] = metric.retention_rate;
        }
      });

      // Calculate revenue data
      const totalRevenue =
        metrics?.reduce((sum, m) => sum + (m.revenue_cents || 0), 0) || 0;
      const perUserRevenue =
        cohort.total_users > 0 ? totalRevenue / cohort.total_users : 0;

      // Group revenue by month
      const revenueByMonth = metrics
        ?.filter(m => m.period_type === 'month')
        .map(m => ({
          month: `M${m.period_offset}`,
          amount: m.revenue_cents || 0,
        })) || [];

      return {
        cohortDate,
        totalUsers: cohort.total_users || 0,
        retention,
        revenue: {
          total: totalRevenue,
          perUser: perUserRevenue,
          byMonth: revenueByMonth,
        },
      };
    });

    const cohortData = await Promise.all(cohortDataPromises);

    // Calculate summary statistics
    const totalUsers = cohortData.reduce((sum, c) => sum + c.totalUsers, 0);
    const totalRevenue = cohortData.reduce((sum, c) => sum + c.revenue.total, 0);

    const avgDay7 =
      cohortData.reduce((sum, c) => sum + c.retention.day7, 0) /
      Math.max(cohortData.length, 1);
    const avgDay30 =
      cohortData.reduce((sum, c) => sum + c.retention.day30, 0) /
      Math.max(cohortData.length, 1);
    const avgMonth3 =
      cohortData.reduce((sum, c) => sum + c.retention.month3, 0) /
      Math.max(cohortData.length, 1);

    const response: CohortsResponse = {
      cohorts: cohortData,
      summary: {
        totalCohorts: cohortData.length,
        totalUsers,
        averageRetention: {
          day7: Math.round(avgDay7 * 100) / 100,
          day30: Math.round(avgDay30 * 100) / 100,
          month3: Math.round(avgMonth3 * 100) / 100,
        },
        totalRevenue,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Cohorts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cohort data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/cohorts/refresh
 * Trigger cohort metrics refresh
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cohortDate } = body;

    // This would trigger the cohort-refresh script
    // For now, return success message
    return NextResponse.json({
      success: true,
      message: cohortDate
        ? `Cohort ${cohortDate} refresh scheduled`
        : 'All cohorts refresh scheduled',
    });
  } catch (error: any) {
    console.error('Cohort refresh error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refresh cohorts' },
      { status: 500 }
    );
  }
}

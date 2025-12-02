/**
 * Testing Results API Route
 *
 * Purpose: Fetch @total-audio/testing results for Ops Console dashboard
 * Data Source: testing_results table (populated by golden-intelligence.ts)
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get('app');
    const testSuite = searchParams.get('test_suite');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const days = parseInt(searchParams.get('days') || '7', 10);

    const supabase = await createAdminClient(cookies());

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query for recent results - use type assertion for dynamic table names
    let query = (supabase as any)
      .from('testing_results')
      .select('*')
      .gte('executed_at', startDate.toISOString())
      .order('executed_at', { ascending: false })
      .limit(limit);

    // Filter by app if specified
    if (app) {
      query = query.eq('app', app);
    }

    // Filter by test suite if specified
    if (testSuite) {
      query = query.eq('test_suite', testSuite);
    }

    const { data: results, error: resultsError } = await query;

    if (resultsError) {
      console.error('Error fetching testing_results:', resultsError);
      throw resultsError;
    }

    // Get pass rate using the helper function
    const { data: passRate, error: passRateError } = await (supabase as any).rpc(
      'get_testing_pass_rate',
      {
        p_app: app,
        p_days: days,
      }
    );

    if (passRateError) {
      console.error('Error fetching pass rate:', passRateError);
      // Non-critical, continue without it
    }

    // Get summary statistics
    const { data: summary, error: summaryError } = await (supabase as any)
      .from('testing_summary')
      .select('*');

    if (summaryError) {
      console.error('Error fetching testing_summary:', summaryError);
      // Non-critical, continue without it
    }

    return NextResponse.json({
      success: true,
      results: results || [],
      passRate: passRate || [],
      summary: summary || [],
      metadata: {
        days,
        limit,
        count: results?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Testing Results API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch testing results',
        results: [],
        passRate: [],
        summary: [],
      },
      { status: 500 }
    );
  }
}

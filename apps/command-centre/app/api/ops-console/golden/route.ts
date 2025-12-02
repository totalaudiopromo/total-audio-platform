/**
 * Golden Verify API Route
 *
 * Purpose: Fetch Golden Verify deployment health checks for Ops Console dashboard
 * Data Source: golden_history table (populated by golden-intelligence.ts)
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get('app');
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const environment = searchParams.get('environment') || 'production';

    const supabase = await createAdminClient(cookies());

    // Build query - use type assertion for dynamic table names
    let query = (supabase as any)
      .from('golden_history')
      .select('*')
      .eq('environment', environment)
      .order('deployed_at', { ascending: false })
      .limit(limit);

    // Filter by app if specified
    if (app) {
      query = query.eq('app', app);
    }

    const { data: history, error: historyError } = await query;

    if (historyError) {
      console.error('Error fetching golden_history:', historyError);
      throw historyError;
    }

    // Get latest status per app using the helper function
    const { data: latestStatus, error: statusError } = await (supabase as any).rpc(
      'get_latest_golden_status'
    );

    if (statusError) {
      console.error('Error fetching latest status:', statusError);
      // Non-critical, continue without it
    }

    // Get summary statistics
    const { data: summary, error: summaryError } = await (supabase as any)
      .from('golden_summary')
      .select('*');

    if (summaryError) {
      console.error('Error fetching golden_summary:', summaryError);
      // Non-critical, continue without it
    }

    return NextResponse.json({
      success: true,
      history: history || [],
      latestStatus: latestStatus || [],
      summary: summary || [],
      metadata: {
        environment,
        limit,
        count: history?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Golden Verify API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch Golden Verify data',
        history: [],
        latestStatus: [],
        summary: [],
      },
      { status: 500 }
    );
  }
}

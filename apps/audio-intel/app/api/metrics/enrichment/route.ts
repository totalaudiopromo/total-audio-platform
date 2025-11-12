import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Enrichment Metrics API
 * Provides aggregated metrics from enrichment_logs table for Command Centre dashboard integration
 *
 * Query Parameters:
 * - since: ISO timestamp (default: 24 hours ago)
 * - userId: Filter by specific user ID (optional)
 */

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

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const since = searchParams.get('since');
    const userId = searchParams.get('userId');
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default: last 24h

    // Build query
    let query = supabase
      .from('enrichment_logs')
      .select('*')
      .gte('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: false });

    // Add user filter if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('[Metrics API] Error fetching enrichment logs:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch enrichment logs',
        },
        { status: 500 }
      );
    }

    if (!logs || logs.length === 0) {
      return NextResponse.json({
        success: true,
        timeframe: {
          since: sinceDate.toISOString(),
          until: new Date().toISOString(),
        },
        summary: {
          totalBatches: 0,
          totalContacts: 0,
          totalEnriched: 0,
          totalFailed: 0,
          totalCost: 0,
          avgSuccessRate: 0,
          totalTokensUsed: 0,
        },
        recentBatches: [],
      });
    }

    // Aggregate metrics
    const totalBatches = logs.length;
    const totalContacts = logs.reduce((sum, log) => sum + (log.contacts_count || 0), 0);
    const totalCost = logs.reduce((sum, log) => sum + (log.api_cost_cents || 0), 0);
    const totalTokensUsed = logs.reduce((sum, log) => sum + (log.api_tokens_used || 0), 0);

    // Calculate success metrics (assuming success when status === 'success')
    const successfulBatches = logs.filter(log => log.status === 'success');
    const totalEnriched = successfulBatches.reduce(
      (sum, log) => sum + (log.contacts_count || 0),
      0
    );
    const totalFailed = totalContacts - totalEnriched;

    const avgSuccessRate = totalBatches > 0 ? (successfulBatches.length / totalBatches) * 100 : 0;

    // Recent batches (last 10)
    const recentBatches = logs.slice(0, 10).map(log => ({
      id: log.id,
      timestamp: log.created_at,
      userId: log.user_id,
      contactsCount: log.contacts_count,
      status: log.status,
      errorMessage: log.error_message,
      apiTokensUsed: log.api_tokens_used,
      apiCostCents: log.api_cost_cents,
      costGbp: log.api_cost_cents ? (log.api_cost_cents / 100).toFixed(4) : null,
    }));

    // Group by user (if not filtering by userId)
    let userBreakdown;
    if (!userId) {
      const userMap = new Map<
        string,
        { batches: number; contacts: number; cost: number; tokens: number }
      >();

      logs.forEach(log => {
        const current = userMap.get(log.user_id) || {
          batches: 0,
          contacts: 0,
          cost: 0,
          tokens: 0,
        };
        userMap.set(log.user_id, {
          batches: current.batches + 1,
          contacts: current.contacts + (log.contacts_count || 0),
          cost: current.cost + (log.api_cost_cents || 0),
          tokens: current.tokens + (log.api_tokens_used || 0),
        });
      });

      userBreakdown = Array.from(userMap.entries()).map(([userId, stats]) => ({
        userId,
        batches: stats.batches,
        contacts: stats.contacts,
        cost: (stats.cost / 100).toFixed(4),
        tokens: stats.tokens,
      }));
    }

    return NextResponse.json({
      success: true,
      timeframe: {
        since: sinceDate.toISOString(),
        until: new Date().toISOString(),
        filteredByUser: userId || null,
      },
      summary: {
        totalBatches,
        totalContacts,
        totalEnriched,
        totalFailed,
        totalCost: (totalCost / 100).toFixed(4), // Convert cents to GBP
        avgSuccessRate: parseFloat(avgSuccessRate.toFixed(2)),
        totalTokensUsed,
      },
      userBreakdown,
      recentBatches,
    });
  } catch (error: any) {
    console.error('[Metrics API] Error fetching enrichment metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch metrics',
      },
      { status: 500 }
    );
  }
}

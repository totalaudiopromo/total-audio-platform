/**
 * Phase 9D-2: Feedback Metrics API
 * User sentiment analysis from Phase 9B feedback_events table
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = await createAdminClient(cookies());

    // Query feedback_events table with aggregation
    const { data: feedback, error } = await (supabase.rpc as any)('get_feedback_summary');

    if (error) {
      console.error('Error fetching feedback summary:', error);

      // Fallback query if RPC doesn't exist yet
      const { data: fallbackData, error: fallbackError } = await ((supabase as any)
        .from('feedback_events')
        .select('id, user_id, app, agent_id, rating, comment, created_at')
        .order('created_at', { ascending: false })
        .limit(500));

      if (fallbackError) {
        throw fallbackError;
      }

      // Aggregate fallback data client-side
      const { summaries, recent } = aggregateFeedbackMetrics(fallbackData || []);
      return NextResponse.json({
        success: true,
        summaries,
        recent,
        source: 'fallback',
      });
    }

    return NextResponse.json({
      success: true,
      summaries: feedback || [],
      recent: [], // RPC would need to return this separately
      source: 'rpc',
    });
  } catch (error: any) {
    console.error('Feedback metrics API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch feedback metrics',
      },
      { status: 500 }
    );
  }
}

/**
 * Aggregate feedback metrics from raw events
 */
function aggregateFeedbackMetrics(events: any[]) {
  const grouped: Record<string, any> = {};

  events.forEach(event => {
    const app = event.app;

    if (!grouped[app]) {
      grouped[app] = {
        app,
        total_feedback: 0,
        total_rating: 0,
        positive_feedback: 0,
        negative_feedback: 0,
      };
    }

    grouped[app].total_feedback++;
    grouped[app].total_rating += event.rating || 0;

    if (event.rating >= 4) {
      grouped[app].positive_feedback++;
    } else if (event.rating <= 2) {
      grouped[app].negative_feedback++;
    }
  });

  const summaries = Object.values(grouped).map(summary => ({
    app: summary.app,
    total_feedback: summary.total_feedback,
    avg_rating: Number((summary.total_rating / summary.total_feedback).toFixed(1)),
    positive_feedback: summary.positive_feedback,
    negative_feedback: summary.negative_feedback,
    trend: 'stable' as const, // Would need time-series data for real trends
  }));

  // Get 10 most recent feedback items
  const recent = events.slice(0, 10).map(event => ({
    id: event.id,
    user_id: event.user_id,
    app: event.app,
    agent_id: event.agent_id,
    rating: event.rating,
    comment: event.comment,
    created_at: event.created_at,
  }));

  return { summaries, recent };
}

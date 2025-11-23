/**
 * CoachOS Progress API
 * GET /api/coach/progress - Get user progress metrics
 * POST /api/coach/progress - Store new progress metric
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import {
  getAllMetrics,
  getMetricHistory,
  storeMetric,
  highlightGrowthAreas,
  getProgressSummary,
} from '@total-audio/coach-os';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');
    const growthAreas = searchParams.get('growth_areas') === 'true';
    const summary = searchParams.get('summary') === 'true';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Get growth areas
    if (growthAreas) {
      const areas = await highlightGrowthAreas(user.id);
      return NextResponse.json({ growth_areas: areas });
    }

    // Get summary
    if (summary && startDate && endDate) {
      const summaryData = await getProgressSummary(user.id, startDate, endDate);
      return NextResponse.json({ summary: summaryData });
    }

    // Get specific metric history
    if (metric) {
      const history = await getMetricHistory(user.id, metric);
      return NextResponse.json({ history });
    }

    // Get all metrics
    const limit = parseInt(searchParams.get('limit') || '100');
    const metrics = await getAllMetrics(user.id, limit);
    return NextResponse.json({ metrics });
  } catch (error: any) {
    console.error('Failed to get progress:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { metric, value, metadata, goalId, sessionId } = body;

    if (!metric || value === undefined) {
      return NextResponse.json(
        { error: 'metric and value are required' },
        { status: 400 }
      );
    }

    const progress = await storeMetric({
      userId: user.id,
      metric,
      value,
      metadata,
      goalId,
      sessionId,
    });

    return NextResponse.json({ progress });
  } catch (error: any) {
    console.error('Failed to store progress:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to store progress' },
      { status: 500 }
    );
  }
}

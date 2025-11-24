/**
 * CoachOS Insights API
 * GET /api/coach/insights - Get user's insights
 * POST /api/coach/insights - Generate new insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import {
  getUserInsights,
  getInsightsByType,
  generateAllInsights,
  generateInsightsByType,
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
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    let insights;
    if (type) {
      insights = await getInsightsByType(user.id, type as any, limit);
    } else {
      insights = await getUserInsights(user.id, limit);
    }

    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error('Failed to get insights:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get insights' },
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
    const { type } = body;

    let insights;
    if (type) {
      insights = await generateInsightsByType(user.id, type);
    } else {
      insights = await generateAllInsights(user.id);
    }

    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error('Failed to generate insights:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

/**
 * CoachOS Goals API
 * GET /api/coach/goals - Get all user goals
 * POST /api/coach/goals - Create a new goal
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { getUserGoals, createGoal } from '@total-audio/coach-os';

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

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Get goals
    let goals = await getUserGoals(user.id);

    // Filter by status if provided
    if (status && ['active', 'paused', 'completed'].includes(status)) {
      goals = goals.filter((g) => g.status === status);
    }

    // Filter by category if provided
    if (category) {
      goals = goals.filter((g) => g.category === category);
    }

    return NextResponse.json({ goals });
  } catch (error: any) {
    console.error('Failed to get goals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get goals' },
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
    const { title, description, category, priority, target_date, metadata } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: 'title and category are required' },
        { status: 400 }
      );
    }

    const goal = await createGoal({
      userId: user.id,
      title,
      description,
      category,
      priority,
      target_date,
      metadata,
    });

    return NextResponse.json({ goal });
  } catch (error: any) {
    console.error('Failed to create goal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create goal' },
      { status: 500 }
    );
  }
}

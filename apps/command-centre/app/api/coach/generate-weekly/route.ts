/**
 * CoachOS Weekly Plan Generation API
 * POST /api/coach/generate-weekly - Generate weekly coaching plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { generateWeeklyPlan } from '@total-audio/coach-os';

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
    const { weekStart, forceRegenerate } = body;

    // Generate weekly plan
    const session = await generateWeeklyPlan({
      userId: user.id,
      weekStart,
      forceRegenerate,
    });

    return NextResponse.json({ session });
  } catch (error: any) {
    console.error('Failed to generate weekly plan:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate weekly plan' },
      { status: 500 }
    );
  }
}

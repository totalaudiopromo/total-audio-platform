/**
 * CoachOS Goal API (Single Goal)
 * PATCH /api/coach/goals/[id] - Update a goal
 * DELETE /api/coach/goals/[id] - Delete a goal
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { updateGoal, deleteGoal, completeGoal } from '@total-audio/coach-os';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const goalId = params.id;

    // Special case: completing a goal
    if (body.complete === true) {
      const goal = await completeGoal(goalId);
      return NextResponse.json({ goal });
    }

    // Update goal
    const goal = await updateGoal({
      goalId,
      ...body,
    });

    return NextResponse.json({ goal });
  } catch (error: any) {
    console.error('Failed to update goal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await deleteGoal(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete goal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete goal' },
      { status: 500 }
    );
  }
}

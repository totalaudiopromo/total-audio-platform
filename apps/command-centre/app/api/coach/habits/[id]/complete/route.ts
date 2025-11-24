/**
 * API Route: /api/coach/habits/[id]/complete
 * POST - Mark a habit as completed
 */

import { NextRequest, NextResponse } from 'next/server';
import { completeHabit } from '@total-audio/coach-os/habits';

/**
 * POST /api/coach/habits/[id]/complete
 * Mark a habit as completed and update streak
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const habitId = params.id;

    const habit = await completeHabit(habitId);

    return NextResponse.json({
      habit,
      message: `Habit completed! Streak: ${habit.streak} 🔥`,
    });
  } catch (error) {
    console.error('Failed to complete habit:', error);
    return NextResponse.json(
      { error: 'Failed to complete habit' },
      { status: 500 }
    );
  }
}

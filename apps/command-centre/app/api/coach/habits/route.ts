/**
 * API Route: /api/coach/habits
 * GET - List all habits for the user
 * POST - Create a new habit
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createHabit,
  getHabitsForUser,
  type HabitFrequency,
  type HabitCategory,
} from '@total-audio/coach-os/habits';

const createHabitSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  frequency: z.enum(['daily', '3x_week', 'weekly', 'monthly']),
  category: z.enum(['creative', 'outreach', 'wellness', 'admin', 'learning']),
});

/**
 * GET /api/coach/habits
 * List all habits for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // TODO: Get userId and workspaceId from authenticated session
    // For now, using mock values
    const userId = req.headers.get('x-user-id') || 'mock-user-id';
    const workspaceId = req.headers.get('x-workspace-id') || 'mock-workspace-id';

    const habits = await getHabitsForUser(userId, workspaceId);

    return NextResponse.json({ habits });
  } catch (error) {
    console.error('Failed to get habits:', error);
    return NextResponse.json(
      { error: 'Failed to get habits' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/coach/habits
 * Create a new habit
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createHabitSchema.parse(body);

    // TODO: Get userId and workspaceId from authenticated session
    const userId = req.headers.get('x-user-id') || 'mock-user-id';
    const workspaceId = req.headers.get('x-workspace-id') || 'mock-workspace-id';

    const habit = await createHabit({
      userId,
      workspaceId,
      name: validated.name,
      frequency: validated.frequency as HabitFrequency,
      category: validated.category as HabitCategory,
    });

    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create habit:', error);
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}

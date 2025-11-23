/**
 * API Route: /api/coach/routines
 * GET - List all routines for the user
 * POST - Create a new routine
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createRoutine,
  listRoutines,
  getPresetRoutines,
  type RoutineCategory,
  type RoutineStep,
} from '@total-audio/coach-os/routines';

const routineStepSchema = z.object({
  title: z.string().min(1, 'Step title is required'),
  description: z.string().optional(),
  duration_minutes: z.number().optional(),
});

const createRoutineSchema = z.object({
  name: z.string().min(1, 'Routine name is required'),
  description: z.string().optional(),
  steps: z.array(routineStepSchema).min(1, 'At least one step is required'),
  category: z.enum(['creative', 'outreach', 'wellness', 'admin', 'learning']).optional(),
});

/**
 * GET /api/coach/routines
 * List all routines for the authenticated user
 * Query params:
 *   - category: Filter by category (optional)
 *   - presets: Return preset routines if true
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as RoutineCategory | null;
    const showPresets = searchParams.get('presets') === 'true';

    // If requesting presets, return those
    if (showPresets) {
      const presets = getPresetRoutines();
      return NextResponse.json({ routines: presets, isPreset: true });
    }

    // TODO: Get userId and workspaceId from authenticated session
    const userId = req.headers.get('x-user-id') || 'mock-user-id';
    const workspaceId = req.headers.get('x-workspace-id') || 'mock-workspace-id';

    const routines = await listRoutines(userId, workspaceId, category || undefined);

    return NextResponse.json({ routines });
  } catch (error) {
    console.error('Failed to get routines:', error);
    return NextResponse.json(
      { error: 'Failed to get routines' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/coach/routines
 * Create a new routine
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createRoutineSchema.parse(body);

    // TODO: Get userId and workspaceId from authenticated session
    const userId = req.headers.get('x-user-id') || 'mock-user-id';
    const workspaceId = req.headers.get('x-workspace-id') || 'mock-workspace-id';

    const routine = await createRoutine({
      userId,
      workspaceId,
      name: validated.name,
      description: validated.description,
      steps: validated.steps as RoutineStep[],
      category: validated.category as RoutineCategory | undefined,
    });

    return NextResponse.json({ routine }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create routine:', error);
    return NextResponse.json(
      { error: 'Failed to create routine' },
      { status: 500 }
    );
  }
}

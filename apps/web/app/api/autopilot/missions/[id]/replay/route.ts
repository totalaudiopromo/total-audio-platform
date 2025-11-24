/**
 * Replay API
 * POST /api/autopilot/missions/[id]/replay
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createReplayEngine } from '@total-audio/pr-autopilot/replay/replayEngine';
import { z } from 'zod';

const ReplayRequestSchema = z.object({
  originalRunId: z.string().uuid(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const missionId = params.id;

    // Validate mission access
    const { data: mission } = await supabase
      .from('autopilot_missions')
      .select('id, user_id')
      .eq('id', missionId)
      .single();

    if (!mission || mission.user_id !== user.id) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Parse and validate request
    const body = await request.json();
    const validatedData = ReplayRequestSchema.parse(body);

    // Create replay
    const engine = createReplayEngine(supabase);
    const replay = await engine.createReplay({
      userId: user.id,
      missionId,
      originalRunId: validatedData.originalRunId,
    });

    // Execute replay
    const result = await engine.executeReplay(replay.id);

    return NextResponse.json({
      success: true,
      replay: {
        id: replay.id,
        runId: result.runId,
        matchPercentage: result.matchPercentage,
        deviations: result.deviations,
      },
    });
  } catch (error) {
    console.error('Replay execution error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET replays list
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const missionId = params.id;

    const engine = createReplayEngine(supabase);
    const replays = await engine.listReplays(missionId);

    return NextResponse.json({ replays });
  } catch (error) {
    console.error('Replay list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

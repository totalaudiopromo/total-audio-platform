/**
 * Snapshot API
 * POST /api/autopilot/missions/[id]/snapshot
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createSnapshotEngine } from '@total-audio/pr-autopilot/snapshots/snapshotEngine';
import { z } from 'zod';

const SnapshotRequestSchema = z.object({
  runId: z.string().uuid().optional(),
  label: z.string().optional(),
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = SnapshotRequestSchema.parse(body);

    // Create snapshot
    const engine = createSnapshotEngine(supabase);
    const snapshot = await engine.autoSnapshot(
      missionId,
      validatedData.runId,
      validatedData.label
    );

    return NextResponse.json({
      success: true,
      snapshot: {
        id: snapshot.id,
        createdAt: snapshot.created_at,
        label: validatedData.label,
      },
    });
  } catch (error) {
    console.error('Snapshot creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET snapshots list
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

    // Create snapshot engine
    const engine = createSnapshotEngine(supabase);
    const snapshots = await engine.listSnapshots(missionId);

    return NextResponse.json({ snapshots });
  } catch (error) {
    console.error('Snapshot list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

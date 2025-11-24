/**
 * API Route: /api/autopilot/missions/[id]/run
 *
 * POST - Start a run for the mission
 */

import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@total-audio/core-db/server';
// import { RunEngine } from '@total-audio/pr-autopilot/core';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: missionId } = await params;

    // TODO: Get auth user
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Start run
    // const engine = new RunEngine(supabase);
    // const run = await engine.startRun(missionId, 'manual', user.id);

    // Placeholder response
    return NextResponse.json({
      run: {
        id: 'run-123',
        mission_id: missionId,
        status: 'running',
        started_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error starting run:', error);
    return NextResponse.json(
      { error: 'Failed to start run' },
      { status: 500 }
    );
  }
}

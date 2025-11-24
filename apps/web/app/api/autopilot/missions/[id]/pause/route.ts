/**
 * API Route: /api/autopilot/missions/[id]/pause
 *
 * POST - Pause a mission
 */

import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@total-audio/core-db/server';
// import { CoordinatorAgent } from '@total-audio/pr-autopilot/agents';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: missionId } = await params;
    const body = await request.json();

    // TODO: Pause mission
    // const supabase = createClient();
    // const coordinator = new CoordinatorAgent(supabase);
    // await coordinator.pauseMission(missionId, body.reason);

    return NextResponse.json({
      success: true,
      mission_id: missionId,
      status: 'paused',
    });
  } catch (error) {
    console.error('Error pausing mission:', error);
    return NextResponse.json(
      { error: 'Failed to pause mission' },
      { status: 500 }
    );
  }
}

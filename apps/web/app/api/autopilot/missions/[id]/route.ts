/**
 * API Route: /api/autopilot/missions/[id]
 *
 * GET - Get mission detail
 * PATCH - Update mission
 * DELETE - Delete mission
 */

import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@total-audio/core-db/server';
// import { MissionStore } from '@total-audio/pr-autopilot/core';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Get auth user and fetch mission
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // const store = new MissionStore(supabase);
    // const mission = await store.getMission(id);

    // Placeholder response
    return NextResponse.json({
      mission: {
        id,
        title: 'Album Launch Campaign',
        status: 'active',
        mode: 'suggest',
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching mission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mission' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: Update mission
    // const supabase = createClient();
    // const store = new MissionStore(supabase);
    // const mission = await store.updateMissionStatus(id, body.status);

    return NextResponse.json({
      mission: {
        id,
        ...body,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating mission:', error);
    return NextResponse.json(
      { error: 'Failed to update mission' },
      { status: 500 }
    );
  }
}

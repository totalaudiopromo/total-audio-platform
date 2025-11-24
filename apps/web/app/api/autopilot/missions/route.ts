/**
 * API Route: /api/autopilot/missions
 *
 * GET - List missions for current user
 * POST - Create new mission
 */

import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@total-audio/core-db/server';
// import { MissionStore } from '@total-audio/pr-autopilot/core';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get auth user
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Fetch missions
    // const store = new MissionStore(supabase);
    // const missions = await store.listMissionsForUser(user.id);

    // Placeholder response
    return NextResponse.json({
      missions: [
        {
          id: 'mission-1',
          title: 'Album Launch Campaign',
          status: 'active',
          mode: 'suggest',
          created_at: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Error listing missions:', error);
    return NextResponse.json(
      { error: 'Failed to list missions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Get auth user
    // const supabase = createClient();
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();

    // TODO: Validate input
    // const { title, description, mode, config } = body;

    // TODO: Create mission
    // const store = new MissionStore(supabase);
    // const mission = await store.createMission({
    //   userId: user.id,
    //   title,
    //   description,
    //   mode,
    //   config,
    // });

    // Placeholder response
    return NextResponse.json({
      mission: {
        id: 'new-mission-id',
        ...body,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating mission:', error);
    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    );
  }
}

/**
 * API Route: /api/anr/rosters
 *
 * Roster management endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRoster, listRostersForWorkspace, type RosterInput } from '@total-audio/anr-radar';

/**
 * GET /api/anr/rosters
 * List rosters for workspace
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    const rosters = await listRostersForWorkspace(workspaceId);

    return NextResponse.json({ rosters });
  } catch (error) {
    console.error('Failed to list rosters:', error);
    return NextResponse.json(
      { error: 'Failed to list rosters' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/anr/rosters
 * Create new roster
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { workspace_id, name, description, owner_user_id } = body;

    if (!workspace_id || !name) {
      return NextResponse.json(
        { error: 'workspace_id and name are required' },
        { status: 400 }
      );
    }

    const input: RosterInput = {
      workspace_id,
      name,
      description,
      owner_user_id,
    };

    const roster = await createRoster(input);

    if (!roster) {
      return NextResponse.json(
        { error: 'Failed to create roster' },
        { status: 500 }
      );
    }

    return NextResponse.json({ roster }, { status: 201 });
  } catch (error) {
    console.error('Failed to create roster:', error);
    return NextResponse.json(
      { error: 'Failed to create roster' },
      { status: 500 }
    );
  }
}

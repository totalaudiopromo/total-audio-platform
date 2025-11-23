/**
 * Mesh Teams API
 * GET /api/mesh/teams - Get active teams
 * POST /api/mesh/teams - Form a new team
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { getActiveTeams, formTeam } from '@total-audio/agent-mesh-os';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
    }

    const teams = await getActiveTeams(workspaceId);
    return NextResponse.json({ teams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { agent_names, purpose, workspace_id, name } = body;

    if (!agent_names || !purpose || !workspace_id) {
      return NextResponse.json(
        { error: 'agent_names, purpose, and workspace_id required' },
        { status: 400 }
      );
    }

    const team = await formTeam(agent_names, purpose, workspace_id, name);
    return NextResponse.json({ team });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

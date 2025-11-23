/**
 * Mesh Reasoning API
 * GET /api/mesh/reasoning - Get reasoning history
 * POST /api/mesh/reasoning - Trigger reasoning cycle
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { getReasoningHistory, runReasoningCycle } from '@total-audio/agent-mesh-os';
import { buildMeshContext } from '@total-audio/agent-mesh-os';

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

    const history = await getReasoningHistory(workspaceId);
    return NextResponse.json({ history });
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
    const { workspace_id, cycle_type } = body;

    if (!workspace_id) {
      return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
    }

    // Build context and run reasoning
    const context = await buildMeshContext(workspace_id);
    const result = await runReasoningCycle(context, cycle_type || 'routine');

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

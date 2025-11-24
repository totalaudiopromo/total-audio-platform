/**
 * Mesh Memory API
 * GET /api/mesh/memory - Get shared memory
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { getAllShared } from '@total-audio/agent-mesh-os';

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

    const memory = await getAllShared(workspaceId);
    return NextResponse.json({ memory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Mesh Messages API
 * GET /api/mesh/messages - Get recent messages
 * POST /api/mesh/messages - Send a message
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@total-audio/core-db/server';
import { getAllMessages, publishMessage } from '@total-audio/agent-mesh-os';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get workspace ID from query or default workspace
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id required' }, { status: 400 });
    }

    const messages = await getAllMessages(workspaceId);
    return NextResponse.json({ messages });
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
    const { from, to, message_type, payload, workspace_id } = body;

    if (!from || !message_type || !workspace_id) {
      return NextResponse.json(
        { error: 'from, message_type, and workspace_id required' },
        { status: 400 }
      );
    }

    const message = await publishMessage(from, to || null, message_type, payload, workspace_id);
    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

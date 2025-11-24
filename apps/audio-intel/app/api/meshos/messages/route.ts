/**
 * MeshOS Messages API
 * GET /api/meshos/messages - Retrieve messages
 * POST /api/meshos/messages - Send new message
 */

import { NextResponse } from 'next/server';
import { MeshMessageStore, MessageRouter } from '@total-audio/meshos';
import { createClient } from '@/lib/supabase/server';
import type { MessageSource, MessageTarget, MessageType } from '@total-audio/meshos';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.id)
      .single();

    if (!profile?.workspace_id) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const source = searchParams.get('source') as MessageSource | null;
    const target = searchParams.get('target') as MessageTarget | null;
    const status = searchParams.get('status') || undefined;

    // Initialize store
    const messageStore = new MeshMessageStore(supabase);

    // Get messages
    const messages = await messageStore.getMessages({
      workspace_id: profile.workspace_id,
      source: source || undefined,
      target: target || undefined,
      status,
      limit,
    });

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MeshOS Messages GET API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve messages',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.id)
      .single();

    if (!profile?.workspace_id) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { source, target, type, payload } = body;

    // Validate required fields
    if (!source || !target || !type || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields: source, target, type, payload' },
        { status: 400 }
      );
    }

    // Initialize router
    const messageRouter = new MessageRouter(profile.workspace_id);
    const messageStore = new MeshMessageStore(supabase);
    messageRouter.setMessageStore(messageStore);

    // Send message
    const messageId = await messageRouter.sendMessage({
      source: source as MessageSource,
      target: target as MessageTarget,
      type: type as MessageType,
      payload,
    });

    return NextResponse.json({
      success: true,
      message_id: messageId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('MeshOS Messages POST API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send message',
      },
      { status: 500 }
    );
  }
}

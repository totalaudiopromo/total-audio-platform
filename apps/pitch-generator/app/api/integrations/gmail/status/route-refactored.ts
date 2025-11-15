/**
 * Gmail Connection Status Endpoint (REFACTORED)
 * GET /api/integrations/gmail/status
 *
 * Uses GmailSyncService to check workspace-scoped Gmail connection status
 */

import { NextRequest, NextResponse } from 'next/server';
import { GmailSyncService } from '@total-audio/core-db';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const workspaceId = membership.workspace_id;

    // Initialize Gmail service
    const gmailService = new GmailSyncService(workspaceId);

    // Get connection status
    const status = await gmailService.getConnectionStatus();

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error checking Gmail status:', error);
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Gmail Check Replies Endpoint
 * POST /api/integrations/gmail/check-replies
 *
 * Syncs FROM Gmail to check for email replies
 * Uses GmailSyncService.syncFromExternal()
 */

import { NextRequest, NextResponse } from 'next/server';
import { GmailSyncService } from '@total-audio/core-db';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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

    // Check if Gmail is configured
    const isConfigured = await gmailService.isConfigured();
    if (!isConfigured) {
      return NextResponse.json(
        { error: 'Gmail not connected. Please connect your Gmail account first.' },
        { status: 400 }
      );
    }

    // Sync from Gmail to check for replies
    const result = await gmailService.syncFromExternal();

    return NextResponse.json({
      success: result.success,
      repliesFound: result.recordsSynced,
      totalChecked: result.recordsProcessed,
      errors: result.errors,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error('Error checking Gmail replies:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Gmail Send Email Endpoint (REFACTORED)
 * POST /api/integrations/gmail/send
 *
 * Uses GmailSyncService for workspace-scoped email sending
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

    // Parse request body
    const body = await request.json();
    const { to, subject, emailBody, pitchId, contactId } = body;

    if (!to || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, emailBody' },
        { status: 400 }
      );
    }

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

    // Send email via GmailSyncService
    const result = await gmailService.sendPitch({
      to,
      subject,
      body: emailBody,
      pitchId,
      contactId,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        threadId: result.threadId,
      });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Gmail send error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

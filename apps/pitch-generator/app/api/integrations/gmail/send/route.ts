/**
 * Gmail Send Email Endpoint
 * POST /api/integrations/gmail/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseSession } from '@/lib/supabase/auth-helpers';
import { GmailService } from '@/lib/integrations/gmail-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getSupabaseSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).email || 'demo-user';
    const body = await request.json();
    
    const { to, subject, emailBody, pitchId } = body;

    if (!to || !subject || !emailBody) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, emailBody' },
        { status: 400 }
      );
    }

    const gmailService = new GmailService();
    const result = await gmailService.sendEmail({
      to,
      subject,
      body: emailBody,
      pitchId,
      userId
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        threadId: result.threadId
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Gmail send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


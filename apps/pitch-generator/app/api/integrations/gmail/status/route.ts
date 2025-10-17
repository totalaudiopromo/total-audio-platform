/**
 * Gmail Connection Status Endpoint
 * GET /api/integrations/gmail/status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseSession } from '@/lib/supabase/auth-helpers';
import { GmailService } from '@/lib/integrations/gmail-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getSupabaseSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).email || 'demo-user';
    const gmailService = new GmailService();
    const status = await gmailService.getConnectionStatus(userId);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Gmail status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


/**
 * Gmail Connection Status Endpoint
 * GET /api/integrations/gmail/status
 */

import { NextRequest, NextResponse } from 'next/server';
import { GmailService } from '@/lib/integrations/gmail-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.email || user.id;
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


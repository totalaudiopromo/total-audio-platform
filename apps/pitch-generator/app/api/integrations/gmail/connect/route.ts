/**
 * Gmail OAuth Initiation Endpoint
 * GET /api/integrations/gmail/connect
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseSession } from '@/lib/supabase/auth-helpers';
import { OAuthHandler } from '@/lib/integrations/oauth-handler';

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
    const oauthHandler = new OAuthHandler();
    const authUrl = await oauthHandler.initiateOAuth('gmail', userId);

    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Gmail OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}


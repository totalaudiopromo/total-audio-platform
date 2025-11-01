/**
 * Gmail OAuth Initiation Endpoint
 * GET /api/integrations/gmail/connect
 */

import { NextRequest, NextResponse } from 'next/server';
import { OAuthHandler } from '@/lib/integrations/oauth-handler';

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


/**
 * Airtable OAuth Initiation Endpoint
 * GET /api/integrations/airtable/connect
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OAuthHandler } from '@/lib/integrations/oauth-handler';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const oauthHandler = new OAuthHandler();
    const authUrl = await oauthHandler.initiateOAuth('airtable', user.id);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Airtable OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}

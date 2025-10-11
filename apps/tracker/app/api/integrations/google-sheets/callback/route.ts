/**
 * Google Sheets OAuth Callback Endpoint
 * GET /api/integrations/google-sheets/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { OAuthHandler } from '@/lib/integrations/oauth-handler';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=${error}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=missing_params`
      );
    }

    const oauthHandler = new OAuthHandler();

    // Exchange code for tokens (returns tokens + userId from state)
    const { tokens, userId } = await oauthHandler.handleCallback('google_sheets', code, state);

    // Save connection
    await oauthHandler.saveConnection(userId, 'google_sheets', tokens);

    // Redirect back to integrations page with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?success=google_sheets_connected`
    );
  } catch (error) {
    console.error('Error handling Google Sheets OAuth callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=oauth_failed`
    );
  }
}

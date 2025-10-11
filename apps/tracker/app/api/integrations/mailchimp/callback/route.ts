/**
 * Mailchimp OAuth Callback Endpoint
 * GET /api/integrations/mailchimp/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { OAuthHandler } from '@/lib/integrations/oauth-handler';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

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
    const { tokens, userId } = await oauthHandler.handleCallback('mailchimp', code, state);
    await oauthHandler.saveConnection(userId, 'mailchimp', tokens);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?success=mailchimp_connected`
    );
  } catch (error) {
    console.error('Error handling Mailchimp OAuth callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=oauth_failed`
    );
  }
}

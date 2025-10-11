/**
 * Microsoft Excel OAuth Callback Endpoint
 * GET /api/integrations/excel/callback
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
    const { tokens, userId } = await oauthHandler.handleCallback('excel', code, state);
    await oauthHandler.saveConnection(userId, 'excel', tokens);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?success=excel_connected`
    );
  } catch (error) {
    console.error('Error handling Excel OAuth callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=oauth_failed`
    );
  }
}

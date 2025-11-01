/**
 * Gmail OAuth Callback Endpoint
 * GET /api/integrations/gmail/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { OAuthHandler } from '@/lib/integrations/oauth-handler';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const userId = user.email || user.id;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/dashboard/integrations?error=oauth_error', request.url));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/dashboard/integrations?error=missing_params', request.url));
    }

    const oauthHandler = new OAuthHandler();
    const result = await oauthHandler.handleCallback('gmail', code, state, userId);

    if (result.success) {
      return NextResponse.redirect(new URL('/dashboard/integrations?success=gmail_connected', request.url));
    } else {
      return NextResponse.redirect(new URL(`/dashboard/integrations?error=${encodeURIComponent(result.error || 'connection_failed')}`, request.url));
    }
  } catch (error) {
    console.error('Gmail OAuth callback error:', error);
    return NextResponse.redirect(new URL('/dashboard/integrations?error=callback_error', request.url));
  }
}


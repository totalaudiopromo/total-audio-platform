/**
 * Gmail OAuth Callback Endpoint (REFACTORED)
 * GET /api/integrations/gmail/callback
 *
 * Handles OAuth callback and exchanges code for tokens
 * Stores tokens in workspace-scoped integrations table
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=oauth_error', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=missing_params', request.url)
      );
    }

    // Get user's workspace
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=no_workspace', request.url)
      );
    }

    const workspaceId = membership.workspace_id;

    // Verify state token
    const { data: tempConfig } = await supabase
      .from('integrations')
      .select('credentials')
      .eq('workspace_id', workspaceId)
      .eq('integration_name', 'gmail')
      .eq('status', 'disconnected')
      .single();

    if (!tempConfig || !tempConfig.credentials) {
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=invalid_state', request.url)
      );
    }

    const storedData = tempConfig.credentials as { state: string; codeVerifier: string };
    if (storedData.state !== state) {
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=state_mismatch', request.url)
      );
    }

    // Exchange code for tokens
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/integrations/gmail/callback`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: storedData.codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=token_exchange_failed', request.url)
      );
    }

    const tokens = await tokenResponse.json();

    // Calculate token expiry (with 5 min buffer)
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000 - 5 * 60 * 1000)
      : null;

    // Store connection in workspace-scoped integrations table
    const { error: storeError } = await supabase.from('integrations').upsert(
      {
        workspace_id: workspaceId,
        integration_name: 'gmail',
        oauth_provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt?.toISOString(),
        credentials: {
          client_id: clientId,
          client_secret: clientSecret,
        },
        settings: {
          send_from_email: '',
          signature: '',
          track_responses: true,
          auto_follow_up: false,
        },
        status: 'active',
        last_sync_at: new Date().toISOString(),
      },
      {
        onConflict: 'workspace_id,integration_name',
      }
    );

    if (storeError) {
      console.error('Failed to store connection:', storeError);
      return NextResponse.redirect(
        new URL('/dashboard/integrations?error=connection_failed', request.url)
      );
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/dashboard/integrations?success=gmail_connected', request.url)
    );
  } catch (error) {
    console.error('Gmail OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/integrations?error=callback_error', request.url)
    );
  }
}

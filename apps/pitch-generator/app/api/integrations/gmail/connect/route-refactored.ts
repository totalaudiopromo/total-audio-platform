/**
 * Gmail OAuth Initiation Endpoint (REFACTORED)
 * GET /api/integrations/gmail/connect
 *
 * Initiates workspace-scoped Gmail OAuth flow
 * Stores state in integrations table with workspace_id
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

// Helper function to generate PKCE code challenge
function generatePKCE() {
  const codeVerifier = nanoid(64);
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  return { codeVerifier, codeChallenge };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(cookies());
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's workspace
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const workspaceId = membership.workspace_id;

    // Generate PKCE challenge
    const { codeVerifier, codeChallenge } = generatePKCE();

    // Generate state token for CSRF protection
    const state = nanoid(32);

    // Store state and code verifier temporarily in integrations table
    const { error: storeError } = await supabase.from('integrations').upsert(
      {
        workspace_id: workspaceId,
        integration_name: 'gmail',
        oauth_provider: 'google',
        credentials: { state, codeVerifier },
        status: 'disconnected',
      },
      {
        onConflict: 'workspace_id,integration_name',
      }
    );

    if (storeError) {
      console.error('Failed to store OAuth state:', storeError);
      return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
    }

    // Build authorization URL
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/integrations/gmail/callback`;

    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
    ];

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Gmail OAuth:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}

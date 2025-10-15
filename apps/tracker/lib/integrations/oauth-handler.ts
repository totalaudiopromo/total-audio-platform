/**
 * Reusable OAuth Handler for All Integrations
 * Supports Google Sheets, Gmail, Airtable, Mailchimp
 */

import { createClient as createServerClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

export type IntegrationType = 'google_sheets' | 'gmail' | 'airtable' | 'mailchimp' | 'excel';

// Helper function to generate PKCE code challenge
function generatePKCE() {
  const codeVerifier = nanoid(64);
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return { codeVerifier, codeChallenge };
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  authUrl: string;
  tokenUrl: string;
}

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type: string;
}

// OAuth configurations for each provider
const OAUTH_CONFIGS: Record<IntegrationType, Partial<OAuthConfig>> = {
  google_sheets: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file'
    ],
  },
  gmail: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.metadata'
    ],
  },
  airtable: {
    authUrl: 'https://airtable.com/oauth2/v1/authorize',
    tokenUrl: 'https://airtable.com/oauth2/v1/token',
    scopes: ['data.records:read', 'data.records:write', 'schema.bases:read'],
  },
  mailchimp: {
    authUrl: 'https://login.mailchimp.com/oauth2/authorize',
    tokenUrl: 'https://login.mailchimp.com/oauth2/token',
    scopes: [],
  },
  excel: {
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopes: [
      'Files.ReadWrite',
      'offline_access'
    ],
  },
};

export class OAuthHandler {
  // Note: Supabase client must be created per-request in server context

  /**
   * Generate OAuth authorization URL
   */
  async initiateOAuth(
    integrationType: IntegrationType,
    userId: string
  ): Promise<string> {
    const config = this.getConfig(integrationType);
    const state = nanoid(32);

    // Generate PKCE for Airtable and Mailchimp
    const usesPKCE = ['airtable', 'mailchimp'].includes(integrationType);
    const pkce = usesPKCE ? generatePKCE() : null;

    // Store state in database for CSRF protection (server-side)
    const supabase = await createServerClient();

    // Store state temporarily (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error } = await supabase.from('oauth_states').insert({
      state,
      user_id: userId,
      integration_type: integrationType,
      expires_at: expiresAt,
      code_verifier: pkce?.codeVerifier || null
    });

    if (error) {
      console.error('Error storing OAuth state:', error);
      throw new Error('Failed to initiate OAuth');
    }

    const params: Record<string, string> = {
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      state,
    };

    // Add scopes if provider uses them
    if (config.scopes.length > 0) {
      params.scope = config.scopes.join(' ');
    }

    // Add PKCE parameters for Airtable and Mailchimp
    if (pkce) {
      params.code_challenge = pkce.codeChallenge;
      params.code_challenge_method = 'S256';
    } else {
      // Google OAuth parameters
      params.access_type = 'offline';
      params.prompt = 'consent';
    }

    return `${config.authUrl}?${new URLSearchParams(params).toString()}`;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleCallback(
    integrationType: IntegrationType,
    code: string,
    state: string
  ): Promise<{tokens: OAuthTokens, userId: string}> {
    // Verify state for CSRF protection (from database)
    const supabase = await createServerClient();

    const { data: storedState, error: stateError } = await supabase
      .from('oauth_states')
      .select('user_id, expires_at, code_verifier')
      .eq('state', state)
      .eq('integration_type', integrationType)
      .single();

    if (stateError || !storedState) {
      throw new Error('Invalid state parameter - possible CSRF attack');
    }

    // Check if state has expired
    if (new Date(storedState.expires_at) < new Date()) {
      throw new Error('OAuth state has expired - please try again');
    }

    const config = this.getConfig(integrationType);

    // Prepare token exchange parameters
    const tokenParams: Record<string, string> = {
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    };

    // Add code_verifier for PKCE-enabled providers (Airtable, Mailchimp)
    if (storedState.code_verifier) {
      tokenParams.code_verifier = storedState.code_verifier;
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Airtable uses Basic Auth, others use client_secret in body
    if (integrationType === 'airtable') {
      // Airtable requires Basic Authentication with base64(client_id:client_secret)
      const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
    } else {
      // Other providers send client_id and client_secret in body
      tokenParams.client_id = config.clientId;
      if (config.clientSecret) {
        tokenParams.client_secret = config.clientSecret;
      }
    }

    // Exchange authorization code for tokens
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers,
      body: new URLSearchParams(tokenParams),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OAuth token exchange failed: ${error}`);
    }

    const tokens: OAuthTokens = await response.json();

    // Calculate expiry timestamp
    if (tokens.expires_in) {
      tokens.expires_at = Date.now() + tokens.expires_in * 1000;
    }

    // Clean up state from database
    await supabase.from('oauth_states').delete().eq('state', state);

    return { tokens, userId: storedState.user_id };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(
    integrationType: IntegrationType,
    refreshToken: string
  ): Promise<OAuthTokens> {
    const config = this.getConfig(integrationType);

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const tokens: OAuthTokens = await response.json();

    if (tokens.expires_in) {
      tokens.expires_at = Date.now() + tokens.expires_in * 1000;
    }

    return tokens;
  }

  /**
   * Save connection to database
   */
  async saveConnection(
    userId: string,
    integrationType: IntegrationType,
    tokens: OAuthTokens,
    settings: Record<string, any> = {}
  ): Promise<string> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('integration_connections')
      .upsert({
        user_id: userId,
        integration_type: integrationType,
        credentials: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expires_at,
          token_type: tokens.token_type,
        },
        settings,
        status: 'active',
        error_message: null,
        error_count: 0,
      }, {
        onConflict: 'user_id,integration_type'
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to save connection: ${error.message}`);
    }

    return data.id;
  }

  /**
   * Get connection for user
   */
  async getConnection(userId: string, integrationType: IntegrationType) {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('integration_type', integrationType)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  /**
   * Disconnect integration
   */
  async disconnect(userId: string, integrationType: IntegrationType): Promise<void> {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from('integration_connections')
      .update({
        status: 'disconnected',
        sync_enabled: false,
      })
      .eq('user_id', userId)
      .eq('integration_type', integrationType);

    if (error) {
      throw new Error(`Failed to disconnect: ${error.message}`);
    }
  }

  /**
   * Get valid access token (refreshes if expired)
   */
  async getValidAccessToken(
    connectionId: string
  ): Promise<string> {
    const supabase = await createServerClient();
    const { data: connection } = await supabase
      .from('integration_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (!connection) {
      throw new Error('Connection not found');
    }

    const credentials = connection.credentials as OAuthTokens;

    // Check if token is expired (with 5 minute buffer)
    if (credentials.expires_at && credentials.expires_at < Date.now() + 300000) {
      // Token expired or about to expire - refresh it
      const newTokens = await this.refreshToken(
        connection.integration_type,
        credentials.refresh_token!
      );

      // Update stored credentials
      await supabase
        .from('integration_connections')
        .update({
          credentials: {
            ...credentials,
            access_token: newTokens.access_token,
            expires_at: newTokens.expires_at,
          },
        })
        .eq('id', connectionId);

      return newTokens.access_token;
    }

    return credentials.access_token;
  }

  private getConfig(integrationType: IntegrationType): OAuthConfig {
    const baseConfig = OAUTH_CONFIGS[integrationType];

    // Get credentials from environment variables
    const envPrefix = integrationType.toUpperCase().replace('_', '_');

    // Convert underscore to hyphen for URL (google_sheets → google-sheets)
    const urlPath = integrationType.replace(/_/g, '-');

    // Mailchimp requires 127.0.0.1 instead of localhost
    let redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/${urlPath}/callback`;
    if (integrationType === 'mailchimp' && process.env.MAILCHIMP_REDIRECT_URI) {
      redirectUri = process.env.MAILCHIMP_REDIRECT_URI;
    }

    return {
      ...baseConfig,
      clientId: process.env[`NEXT_PUBLIC_${envPrefix}_CLIENT_ID`] || '',
      clientSecret: process.env[`${envPrefix}_CLIENT_SECRET`] || '',
      redirectUri,
    } as OAuthConfig;
  }
}

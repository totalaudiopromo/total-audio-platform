/**
 * Reusable OAuth Handler for Pitch Generator Integrations
 * Supports Gmail, Google Sheets, Mailchimp, Airtable
 * Ported from tracker app
 */

import { createClient as createServerClient } from '@total-audio/core-db/server';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

export type IntegrationType = 'gmail' | 'google_sheets' | 'mailchimp' | 'airtable';

// Helper function to generate PKCE code challenge
function generatePKCE() {
  const codeVerifier = nanoid(64);
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

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
  gmail: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
    ],
  },
  google_sheets: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  },
  mailchimp: {
    authUrl: 'https://login.mailchimp.com/oauth2/authorize',
    tokenUrl: 'https://login.mailchimp.com/oauth2/token',
    scopes: ['campaigns', 'lists', 'audiences'],
  },
  airtable: {
    authUrl: 'https://airtable.com/oauth2/v1/authorize',
    tokenUrl: 'https://airtable.com/oauth2/v1/token',
    scopes: ['data.records:read', 'data.records:write', 'schema.bases:read'],
  },
};

export class OAuthHandler {
  private supabase = createServerClient();

  /**
   * Initiate OAuth flow for an integration
   */
  async initiateOAuth(integrationType: IntegrationType, userId: string): Promise<string> {
    const config = this.getOAuthConfig(integrationType);
    const { codeVerifier, codeChallenge } = generatePKCE();

    // Generate state token for CSRF protection
    const state = nanoid(32);

    // Store state and code verifier in session storage
    const { error: storeError } = await this.supabase.from('integration_connections').upsert(
      {
        user_id: userId,
        integration_type: integrationType,
        connection_name: `${integrationType}_oauth_temp`,
        access_token: JSON.stringify({ state, codeVerifier }),
        status: 'disconnected',
        created_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,integration_type',
      }
    );

    if (storeError) {
      throw new Error(`Failed to store OAuth state: ${storeError.message}`);
    }

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${config.authUrl}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleCallback(
    integrationType: IntegrationType,
    code: string,
    state: string,
    userId: string
  ): Promise<{ success: boolean; connectionId?: string; error?: string }> {
    try {
      // Verify state token
      const { data: tempConnection } = await this.supabase
        .from('integration_connections')
        .select('access_token')
        .eq('user_id', userId)
        .eq('integration_type', integrationType)
        .eq('status', 'disconnected')
        .single();

      if (!tempConnection) {
        throw new Error('Invalid OAuth state');
      }

      const storedData = JSON.parse(tempConnection.access_token);
      if (storedData.state !== state) {
        throw new Error('State token mismatch');
      }

      const config = this.getOAuthConfig(integrationType);

      // Exchange code for tokens
      const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: config.redirectUri,
          code_verifier: storedData.codeVerifier,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Token exchange failed: ${error}`);
      }

      const tokens: OAuthTokens = await tokenResponse.json();

      // Calculate token expiry
      const expiresAt = tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000 - 5 * 60 * 1000) // 5 min buffer
        : null;

      // Store connection
      const { data: connection, error: storeError } = await this.supabase
        .from('integration_connections')
        .upsert(
          {
            user_id: userId,
            integration_type: integrationType,
            connection_name: `${integrationType}_connection`,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: expiresAt?.toISOString(),
            scope: config.scopes,
            status: 'active',
            last_sync_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,integration_type',
          }
        )
        .select()
        .single();

      if (storeError) {
        throw new Error(`Failed to store connection: ${storeError.message}`);
      }

      // Clean up temp connection
      await this.supabase
        .from('integration_connections')
        .delete()
        .eq('user_id', userId)
        .eq('integration_type', integrationType)
        .eq('status', 'disconnected');

      return { success: true, connectionId: connection.id };
    } catch (error) {
      console.error('OAuth callback error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  async getValidAccessToken(connectionId: string): Promise<string> {
    const { data: connection, error } = await this.supabase
      .from('integration_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (error || !connection) {
      throw new Error('Connection not found');
    }

    // Check if token is expired or expires soon (5 min buffer)
    const now = new Date();
    const expiresAt = connection.token_expires_at ? new Date(connection.token_expires_at) : null;

    if (!expiresAt || now >= expiresAt) {
      // Token is expired, need to refresh
      if (!connection.refresh_token) {
        throw new Error('Token expired and no refresh token available');
      }

      const refreshedTokens = await this.refreshAccessToken(
        connection.integration_type,
        connection.refresh_token
      );

      // Update connection with new tokens
      const newExpiresAt = refreshedTokens.expires_in
        ? new Date(Date.now() + refreshedTokens.expires_in * 1000 - 5 * 60 * 1000)
        : null;

      await this.supabase
        .from('integration_connections')
        .update({
          access_token: refreshedTokens.access_token,
          refresh_token: refreshedTokens.refresh_token || connection.refresh_token,
          token_expires_at: newExpiresAt?.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', connectionId);

      return refreshedTokens.access_token;
    }

    return connection.access_token;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(
    integrationType: IntegrationType,
    refreshToken: string
  ): Promise<OAuthTokens> {
    const config = this.getOAuthConfig(integrationType);

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token refresh failed: ${error}`);
    }

    return await response.json();
  }

  /**
   * Get OAuth configuration for integration type
   */
  private getOAuthConfig(integrationType: IntegrationType): OAuthConfig {
    const baseConfig = OAUTH_CONFIGS[integrationType];
    if (!baseConfig) {
      throw new Error(`Unsupported integration type: ${integrationType}`);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      clientId: this.getClientId(integrationType),
      clientSecret: this.getClientSecret(integrationType),
      redirectUri: `${baseUrl}/api/integrations/${integrationType}/callback`,
      scopes: baseConfig.scopes || [],
      authUrl: baseConfig.authUrl!,
      tokenUrl: baseConfig.tokenUrl!,
    };
  }

  /**
   * Get client ID for integration type
   */
  private getClientId(integrationType: IntegrationType): string {
    switch (integrationType) {
      case 'gmail':
      case 'google_sheets':
        return process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      case 'mailchimp':
        return process.env.MAILCHIMP_CLIENT_ID || '';
      case 'airtable':
        return process.env.AIRTABLE_CLIENT_ID || '';
      default:
        throw new Error(`Unknown client ID for ${integrationType}`);
    }
  }

  /**
   * Get client secret for integration type
   */
  private getClientSecret(integrationType: IntegrationType): string {
    switch (integrationType) {
      case 'gmail':
      case 'google_sheets':
        return process.env.GOOGLE_CLIENT_SECRET || '';
      case 'mailchimp':
        return process.env.MAILCHIMP_CLIENT_SECRET || '';
      case 'airtable':
        return process.env.AIRTABLE_CLIENT_SECRET || '';
      default:
        throw new Error(`Unknown client secret for ${integrationType}`);
    }
  }

  /**
   * Disconnect an integration
   */
  async disconnectIntegration(connectionId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('integration_connections')
      .update({ status: 'disconnected' })
      .eq('id', connectionId)
      .eq('user_id', userId);

    return !error;
  }

  /**
   * Get user's active connections
   */
  async getUserConnections(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('integration_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user connections:', error);
      return [];
    }

    return data || [];
  }
}

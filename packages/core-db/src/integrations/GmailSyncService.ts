/**
 * GmailSyncService
 *
 * Gmail integration using BaseIntegrationSync pattern
 * Handles workspace-scoped Gmail OAuth, email sending, and reply tracking
 *
 * Usage:
 * ```typescript
 * const gmail = new GmailSyncService(workspaceId, supabase);
 * await gmail.initialize();
 * await gmail.sendPitch({ to, subject, body, pitchId });
 * const result = await gmail.syncFromExternal();
 * ```
 */

import { google } from 'googleapis';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { BaseIntegrationSync, type SyncResult, type IntegrationName } from './BaseIntegrationSync';

export interface SendPitchParams {
  to: string;
  subject: string;
  body: string;
  pitchId?: string;
  contactId?: string;
}

export interface SendPitchResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  error?: string;
}

export class GmailSyncService extends BaseIntegrationSync {
  private gmail: any = null;

  constructor(workspace_id: string, supabase: SupabaseClient<Database>) {
    super(workspace_id, supabase);
  }

  getIntegrationName(): IntegrationName {
    return 'gmail';
  }

  // ========================================
  // Credential Validation
  // ========================================

  async validateCredentials(): Promise<boolean> {
    try {
      await this.initializeGmailClient();
      if (!this.gmail) {
        return false;
      }

      // Test API access by getting user profile
      const response = await this.gmail.users.getProfile({
        userId: 'me',
      });

      return !!response.data.emailAddress;
    } catch (error) {
      console.error('Gmail credential validation failed:', error);
      return false;
    }
  }

  // ========================================
  // Sync Methods
  // ========================================

  /**
   * Sync pitches TO Gmail (send emails)
   */
  async syncToExternal(pitches: any[]): Promise<SyncResult> {
    const startTime = new Date();

    try {
      this.ensureInitialized();
      await this.initializeGmailClient();

      if (!this.gmail) {
        return this.createFailedResult(
          'to_external',
          new Error('Failed to initialize Gmail client'),
          startTime
        );
      }

      let recordsSynced = 0;
      let recordsCreated = 0;
      const errors: string[] = [];

      for (const pitch of pitches) {
        try {
          // Extract contact email from pitch
          const contactEmail = pitch.contact?.email || pitch.to_email;
          if (!contactEmail) {
            errors.push(`Pitch ${pitch.id} has no contact email`);
            continue;
          }

          const sendResult = await this.sendPitch({
            to: contactEmail,
            subject: pitch.subject || 'New Pitch',
            body: pitch.content || pitch.body,
            pitchId: pitch.id,
            contactId: pitch.contact_id,
          });

          if (sendResult.success) {
            recordsSynced++;
            recordsCreated++;
          } else {
            errors.push(`Failed to send pitch ${pitch.id}: ${sendResult.error}`);
          }
        } catch (error) {
          errors.push(
            `Error sending pitch ${pitch.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      const completedAt = new Date();
      const result: SyncResult = {
        success: recordsSynced > 0,
        direction: 'to_external',
        records_synced: recordsSynced,
        records_created: recordsCreated,
        records_updated: 0,
        records_failed: errors.length,
        errors,
        duration_ms: completedAt.getTime() - startTime.getTime(),
        started_at: startTime,
        completed_at: completedAt,
      };

      // Log the sync operation
      await this.logSyncActivity(result);

      return result;
    } catch (error) {
      return this.createFailedResult(
        'to_external',
        error instanceof Error ? error : new Error('Unknown error'),
        startTime
      );
    }
  }

  /**
   * Sync FROM Gmail (check for replies)
   */
  async syncFromExternal(): Promise<SyncResult> {
    const startTime = new Date();

    try {
      this.ensureInitialized();
      await this.initializeGmailClient();

      if (!this.gmail) {
        return this.createFailedResult(
          'from_external',
          new Error('Failed to initialize Gmail client'),
          startTime
        );
      }

      // Get tracked emails that haven't received replies yet
      const { data: trackedEmails, error: fetchError } = await this.supabase
        .from('pitch_email_tracking')
        .select('*')
        .eq('workspace_id', this.workspace_id)
        .is('replied_at', null)
        .eq('bounced', false);

      if (fetchError) {
        return this.createFailedResult('from_external', fetchError, startTime);
      }

      if (!trackedEmails || trackedEmails.length === 0) {
        const completedAt = new Date();
        return {
          success: true,
          direction: 'from_external',
          records_synced: 0,
          records_created: 0,
          records_updated: 0,
          records_failed: 0,
          errors: [],
          duration_ms: completedAt.getTime() - startTime.getTime(),
          started_at: startTime,
          completed_at: completedAt,
          metadata: { message: 'No tracked emails to check' },
        };
      }

      let recordsUpdated = 0;
      const errors: string[] = [];

      // Check each tracked email for replies
      for (const trackedEmail of trackedEmails) {
        try {
          const hasReply = await this.checkThreadForReply(
            trackedEmail.gmail_thread_id!,
            trackedEmail.to_email!
          );

          if (hasReply) {
            // Update tracked email
            await this.supabase
              .from('pitch_email_tracking')
              .update({
                replied_at: new Date().toISOString(),
              })
              .eq('id', trackedEmail.id);

            // Update pitch status if we have a pitch ID
            if (trackedEmail.pitch_id) {
              await this.supabase
                .from('pitches')
                .update({
                  status: 'replied',
                  replied_at: new Date().toISOString(),
                })
                .eq('id', trackedEmail.pitch_id);
            }

            recordsUpdated++;
          }
        } catch (error) {
          errors.push(
            `Error checking thread ${trackedEmail.gmail_thread_id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      const completedAt = new Date();
      const result: SyncResult = {
        success: true,
        direction: 'from_external',
        records_synced: recordsUpdated,
        records_created: 0,
        records_updated: recordsUpdated,
        records_failed: errors.length,
        errors,
        duration_ms: completedAt.getTime() - startTime.getTime(),
        started_at: startTime,
        completed_at: completedAt,
        metadata: { repliesFound: recordsUpdated },
      };

      await this.logSyncActivity(result);
      return result;
    } catch (error) {
      return this.createFailedResult(
        'from_external',
        error instanceof Error ? error : new Error('Unknown error'),
        startTime
      );
    }
  }

  // ========================================
  // OAuth Token Refresh (Google-specific)
  // ========================================

  async refreshOAuthToken(): Promise<string> {
    this.ensureInitialized();

    if (!this.config?.refresh_token) {
      throw new Error('No refresh token available. Re-authentication required.');
    }

    try {
      // Log the refresh attempt
      await this.logActivity({
        action: 'oauth_refresh_attempt',
        success: false,
        records_affected: 0,
        metadata: {
          integration_name: this.getIntegrationName(),
        },
      });

      const clientId = this.config.credentials?.client_id || process.env.GOOGLE_CLIENT_ID || '';
      const clientSecret =
        this.config.credentials?.client_secret || process.env.GOOGLE_CLIENT_SECRET || '';

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: this.config.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Token refresh failed: ${error}`);
      }

      const tokens = await response.json();

      // Update stored tokens
      await this.updateOAuthTokens(tokens);

      return tokens.access_token;
    } catch (error) {
      console.error('Error refreshing Gmail OAuth token:', error);
      throw error;
    }
  }

  // ========================================
  // Individual Pitch Sending
  // ========================================

  /**
   * Send a single pitch email via Gmail
   */
  async sendPitch(params: SendPitchParams): Promise<SendPitchResult> {
    try {
      this.ensureInitialized();
      await this.initializeGmailClient();

      if (!this.gmail) {
        return {
          success: false,
          error: 'Gmail client not initialized',
        };
      }

      // Get workspace settings for signature
      const signature = this.config?.settings?.signature || '';

      // Create email message
      const emailMessage = this.createEmailMessage(params, signature);

      // Send email
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: emailMessage,
        },
      });

      const messageId = response.data.id;
      const threadId = response.data.threadId;

      if (!messageId) {
        return {
          success: false,
          error: 'Failed to get message ID from Gmail',
        };
      }

      // Track the email
      if (params.pitchId) {
        await this.trackEmail({
          pitchId: params.pitchId,
          contactId: params.contactId,
          messageId,
          threadId,
          to: params.to,
          subject: params.subject,
        });

        // Update pitch status to sent
        await this.supabase
          .from('pitches')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', params.pitchId)
          .eq('workspace_id', this.workspace_id);
      }

      return {
        success: true,
        messageId,
        threadId,
      };
    } catch (error) {
      console.error('Gmail send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ========================================
  // Email Tracking
  // ========================================

  /**
   * Track an email for reply detection
   */
  private async trackEmail({
    pitchId,
    contactId,
    messageId,
    threadId,
    to,
    subject,
  }: {
    pitchId: string;
    contactId?: string;
    messageId: string;
    threadId?: string;
    to: string;
    subject: string;
  }): Promise<void> {
    try {
      await this.supabase.from('pitch_email_tracking').insert({
        workspace_id: this.workspace_id,
        pitch_id: pitchId,
        contact_id: contactId || null,
        gmail_message_id: messageId,
        gmail_thread_id: threadId || messageId,
        to_email: to,
        subject,
        sent_at: new Date().toISOString(),
        bounced: false,
      });
    } catch (error) {
      console.error('Error tracking email:', error);
    }
  }

  /**
   * Check if a thread has replies
   */
  private async checkThreadForReply(threadId: string, originalTo: string): Promise<boolean> {
    try {
      if (!this.gmail) {
        return false;
      }

      const threadResponse = await this.gmail.users.threads.get({
        userId: 'me',
        id: threadId,
      });

      const thread = threadResponse.data;
      if (!thread.messages || thread.messages.length <= 1) {
        return false; // No replies yet
      }

      // Get latest message
      const latestMessage = thread.messages[thread.messages.length - 1];
      const messageResponse = await this.gmail.users.messages.get({
        userId: 'me',
        id: latestMessage.id!,
        format: 'metadata',
        metadataHeaders: ['From'],
      });

      const message = messageResponse.data;
      const fromHeader = message.payload?.headers?.find((h: any) => h.name === 'From');

      // Check if this is a reply (from the original recipient)
      if (fromHeader && fromHeader.value?.includes(originalTo)) {
        return true;
      }

      return false;
    } catch (error) {
      console.error(`Error checking thread ${threadId}:`, error);
      return false;
    }
  }

  // ========================================
  // Gmail Client Initialization
  // ========================================

  /**
   * Initialize Gmail API client with OAuth credentials
   */
  private async initializeGmailClient(): Promise<void> {
    if (this.gmail) {
      return; // Already initialized
    }

    try {
      if (!this.config) {
        throw new Error('Gmail integration not configured');
      }

      // Ensure token is valid (will refresh if needed)
      await this.ensureValidToken();

      const accessToken = this.config.credentials?.access_token || this.config.access_token;
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Create OAuth2 client
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      // Initialize Gmail API
      this.gmail = google.gmail({ version: 'v1', auth });
    } catch (error) {
      console.error('Error initializing Gmail client:', error);
      this.gmail = null;
      throw error;
    }
  }

  // ========================================
  // Email Formatting
  // ========================================

  /**
   * Create Gmail-compatible email message
   */
  private createEmailMessage(params: SendPitchParams, signature: string): string {
    const { to, subject, body } = params;

    // Format body as HTML
    const htmlBody = this.formatEmailBody(body, signature);

    // Create MIME message
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      htmlBody,
    ];

    const message = emailLines.join('\n');

    // Encode as base64url
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return encodedMessage;
  }

  /**
   * Format email body as HTML with workspace branding
   */
  private formatEmailBody(body: string, signature: string): string {
    // Convert plain text to HTML with proper formatting
    const htmlBody = body
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');

    const htmlSignature = signature
      ? `<br><br><p style="font-size: 14px; color: #666;">${signature.replace(/\n/g, '<br>')}</p>`
      : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${htmlBody}
          ${htmlSignature}
          <p style="font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
            Sent via <a href="https://pitch.totalaudiopromo.com" style="color: #f59e0b; text-decoration: none;">Pitch Generator</a> by Total Audio Promo
          </p>
        </body>
      </html>
    `;
  }

  // ========================================
  // Connection Status
  // ========================================

  /**
   * Get Gmail connection status
   */
  async getConnectionStatus(): Promise<{
    connected: boolean;
    email?: string;
    error?: string;
  }> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const valid = await this.validateCredentials();
      if (!valid) {
        return { connected: false, error: 'Invalid credentials' };
      }

      // Get user email
      await this.initializeGmailClient();
      const profile = await this.gmail.users.getProfile({
        userId: 'me',
      });

      return {
        connected: true,
        email: profile.data.emailAddress,
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

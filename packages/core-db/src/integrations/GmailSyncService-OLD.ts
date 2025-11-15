/**
 * GmailSyncService - Gmail integration using BaseIntegrationSync pattern
 *
 * Features:
 * - Workspace-scoped Gmail OAuth
 * - Send pitches via Gmail API
 * - Track email threads and detect replies
 * - Automatic token refresh
 * - Sync logging and error handling
 *
 * Usage:
 *   const gmail = new GmailSyncService(workspaceId);
 *   await gmail.sendPitch(pitch, contact);
 *   await gmail.syncFromExternal(); // Check for replies
 */

import { google } from 'googleapis';
import { BaseIntegrationSync, type SyncResult } from './BaseIntegrationSync';

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

  getIntegrationName(): string {
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
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsSynced: 0,
      errors: [],
    };

    try {
      await this.initializeGmailClient();
      if (!this.gmail) {
        result.errors.push('Failed to initialize Gmail client');
        return result;
      }

      for (const pitch of pitches) {
        result.recordsProcessed++;

        try {
          // Extract contact email from pitch
          const contactEmail = pitch.contact?.email || pitch.to_email;
          if (!contactEmail) {
            result.errors.push(`Pitch ${pitch.id} has no contact email`);
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
            result.recordsSynced++;
          } else {
            result.errors.push(`Failed to send pitch ${pitch.id}: ${sendResult.error}`);
          }
        } catch (error) {
          result.errors.push(
            `Error sending pitch ${pitch.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      result.success = result.recordsSynced > 0;

      // Log the sync operation
      await this.logSync('send_pitches', result.success ? 'success' : 'error', result);

      return result;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      await this.logSync('send_pitches', 'error', result);
      return result;
    }
  }

  /**
   * Sync FROM Gmail (check for replies)
   */
  async syncFromExternal(): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsSynced: 0,
      errors: [],
    };

    try {
      await this.initializeGmailClient();
      if (!this.gmail) {
        result.errors.push('Failed to initialize Gmail client');
        return result;
      }

      // Get tracked emails that haven't received replies yet
      const { data: trackedEmails, error: fetchError } = await this.fromWorkspace(
        'pitch_email_tracking'
      )
        .select('*')
        .eq('replied_at', null)
        .is('bounced', false);

      if (fetchError || !trackedEmails || trackedEmails.length === 0) {
        result.success = true;
        result.metadata = { message: 'No tracked emails to check' };
        await this.logSync('check_replies', 'success', result);
        return result;
      }

      // Check each tracked email for replies
      for (const trackedEmail of trackedEmails) {
        result.recordsProcessed++;

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

            result.recordsSynced++;
          }
        } catch (error) {
          result.errors.push(
            `Error checking thread ${trackedEmail.gmail_thread_id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      result.success = true;
      result.metadata = { repliesFound: result.recordsSynced };

      await this.logSync('check_replies', 'success', result);
      return result;
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      await this.logSync('check_replies', 'error', result);
      return result;
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
      await this.initializeGmailClient();
      if (!this.gmail) {
        return {
          success: false,
          error: 'Gmail client not initialized',
        };
      }

      // Get workspace settings for signature
      const signature = this.config?.settings?.signature || '';
      const fromEmail = this.config?.settings?.send_from_email || '';

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
          .eq('workspace_id', this.workspaceId);
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
        workspace_id: this.workspaceId,
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
      // Load config if not already loaded
      if (!this.config) {
        await this.loadConfig();
      }

      if (!this.config) {
        throw new Error('Gmail integration not configured');
      }

      // Get valid access token (will refresh if needed)
      const accessToken = await this.getValidAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get valid access token');
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
      const configured = await this.isConfigured();
      if (!configured) {
        return { connected: false, error: 'Gmail not configured' };
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

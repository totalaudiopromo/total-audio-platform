/**
 * Gmail Integration Service for Pitch Generator
 * Handles sending emails and tracking replies
 */

import { google } from 'googleapis';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { OAuthHandler } from './oauth-handler';

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  pitchId?: string;
  userId: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  error?: string;
}

export interface ReplyTrackingResult {
  success: boolean;
  repliesFound: number;
  errors: string[];
}

export class GmailService {
  private oauth = new OAuthHandler();
  private readonly integrationType = 'gmail';

  private async getSupabaseClient() {
    return await createServerClient();
  }

  /**
   * Send email via Gmail API
   */
  async sendEmail({
    to,
    subject,
    body,
    pitchId,
    userId
  }: SendEmailParams): Promise<SendEmailResult> {
    try {
      const supabase = await this.getSupabaseClient();

      // Get user's Gmail connection
      const { data: connection, error: connError } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_type', this.integrationType)
        .eq('status', 'active')
        .single();

      if (connError || !connection) {
        return {
          success: false,
          error: 'Gmail not connected. Please connect your Gmail account first.'
        };
      }

      // Get valid access token
      const accessToken = await this.oauth.getValidAccessToken(connection.id);

      // Initialize Gmail API
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const gmail = google.gmail({ version: 'v1', auth });

      // Create email message
      const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        this.formatEmailBody(body)
      ];

      const message = emailLines.join('\n');
      const encodedMessage = Buffer.from(message).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      const messageId = response.data.id;
      const threadId = response.data.threadId;

      if (!messageId) {
        return {
          success: false,
          error: 'Failed to get message ID from Gmail'
        };
      }

      // Track the email if we have a pitch ID
      if (pitchId) {
        await this.trackEmail({
          userId,
          pitchId,
          messageId,
          threadId,
          to,
          subject,
          connectionId: connection.id
        });

        // Update pitch status to sent
        await supabase
          .from('pitches')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', pitchId)
          .eq('user_id', userId);
      }

      return {
        success: true,
        messageId,
        threadId
      };
    } catch (error) {
      console.error('Gmail send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Track an email for reply detection
   */
  private async trackEmail({
    userId,
    pitchId,
    messageId,
    threadId,
    to,
    subject,
    connectionId
  }: {
    userId: string;
    pitchId: string;
    messageId: string;
    threadId?: string;
    to: string;
    subject: string;
    connectionId: string;
  }): Promise<void> {
    const supabase = await this.getSupabaseClient();

    await supabase
      .from('gmail_tracked_emails')
      .insert({
        user_id: userId,
        connection_id: connectionId,
        pitch_id: pitchId,
        gmail_thread_id: threadId || messageId,
        gmail_message_id: messageId,
        to_email: to,
        subject,
        sent_at: new Date().toISOString()
      });
  }

  /**
   * Check for replies to tracked emails
   */
  async checkForReplies(connectionId: string): Promise<ReplyTrackingResult> {
    const errors: string[] = [];
    let repliesFound = 0;

    try {
      const supabase = await this.getSupabaseClient();

      // Get connection and access token
      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      const { data: connection, error: connError } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (connError || !connection) {
        errors.push('Connection not found');
        return { success: false, repliesFound: 0, errors };
      }

      // Get tracked emails that haven't received replies yet
      const { data: trackedEmails } = await supabase
        .from('gmail_tracked_emails')
        .select('*')
        .eq('connection_id', connectionId)
        .eq('has_reply', false);

      if (!trackedEmails || trackedEmails.length === 0) {
        return { success: true, repliesFound: 0, errors };
      }

      // Initialize Gmail API
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const gmail = google.gmail({ version: 'v1', auth });

      // Check each tracked email for replies
      for (const trackedEmail of trackedEmails) {
        try {
          const threadResponse = await gmail.users.threads.get({
            userId: 'me',
            id: trackedEmail.gmail_thread_id,
          });

          const thread = threadResponse.data;
          if (!thread.messages || thread.messages.length <= 1) {
            continue; // No replies yet
          }

          // Find the latest message (should be a reply)
          const latestMessage = thread.messages[thread.messages.length - 1];
          const messageResponse = await gmail.users.messages.get({
            userId: 'me',
            id: latestMessage.id!,
            format: 'metadata',
            metadataHeaders: ['From', 'Date']
          });

          const message = messageResponse.data;
          const fromHeader = message.payload?.headers?.find(h => h.name === 'From');
          const dateHeader = message.payload?.headers?.find(h => h.name === 'Date');

          // Check if this is a reply (not from the original sender)
          if (fromHeader && !fromHeader.value?.includes(trackedEmail.to_email)) {
            // Get message snippet for reply content
            const fullMessageResponse = await gmail.users.messages.get({
              userId: 'me',
              id: latestMessage.id!,
              format: 'full'
            });

            const snippet = fullMessageResponse.data.snippet || '';

            // Update tracked email with reply
            await supabase
              .from('gmail_tracked_emails')
              .update({
                has_reply: true,
                reply_detected_at: new Date().toISOString(),
                reply_snippet: snippet
              })
              .eq('id', trackedEmail.id);

            // Update pitch status to replied if we have the pitch
            if (trackedEmail.pitch_id) {
              await supabase
                .from('pitches')
                .update({ 
                  status: 'replied',
                  replied_at: new Date().toISOString()
                })
                .eq('id', trackedEmail.pitch_id);
            }

            repliesFound++;
          }
        } catch (error) {
          console.error(`Error checking thread ${trackedEmail.gmail_thread_id}:`, error);
          errors.push(`Failed to check thread ${trackedEmail.gmail_thread_id}`);
        }
      }

      // Update connection's last sync time
      await supabase
        .from('integration_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connectionId);

      return { success: true, repliesFound, errors };
    } catch (error) {
      console.error('Gmail reply tracking error:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');
      return { success: false, repliesFound, errors };
    }
  }

  /**
   * Format email body for Gmail
   */
  private formatEmailBody(body: string): string {
    // Convert plain text to HTML with proper formatting
    const htmlBody = body
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          ${htmlBody}
          <br><br>
          <p style="font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
            Sent via <a href="https://pitch.totalaudiopromo.com" style="color: #f59e0b; text-decoration: none;">Pitch Generator</a> by Total Audio Promo
          </p>
        </body>
      </html>
    `;
  }

  /**
   * Get user's Gmail connection status
   */
  async getConnectionStatus(userId: string): Promise<{
    connected: boolean;
    connection?: any;
    error?: string;
  }> {
    try {
      const supabase = await this.getSupabaseClient();

      const { data: connection, error } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('integration_type', this.integrationType)
        .eq('status', 'active')
        .single();

      if (error || !connection) {
        return { connected: false };
      }

      return { connected: true, connection };
    } catch (error) {
      return { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}


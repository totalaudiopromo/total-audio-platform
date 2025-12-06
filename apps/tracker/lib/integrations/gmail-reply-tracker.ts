/**
 * Gmail Reply Tracking Service
 * Automatically detects when contacts reply to pitches
 */

import { google } from 'googleapis';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { OAuthHandler } from './oauth-handler';

export class GmailReplyTracker {
  private oauth = new OAuthHandler();
  private readonly integrationType = 'gmail';

  private async getSupabaseClient() {
    return await createServerClient(cookies());
  }

  /**
   * Check for replies to tracked emails
   */
  async checkForReplies(connectionId: string): Promise<{
    success: boolean;
    repliesFound: number;
    errors: string[];
  }> {
    const errors: string[] = [];

    let connection: any = null;

    try {
      const supabase = await this.getSupabaseClient();

      // Get connection and access token
      const accessToken = await this.oauth.getValidAccessToken(connectionId);

      const { data: fetchedConnection, error: connError } = await supabase
        .from('integration_connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (connError || !fetchedConnection) {
        throw new Error('Connection not found');
      }
      connection = fetchedConnection;

      // Get tracked emails that haven't received replies yet
      const { data: trackedEmails } = await supabase
        .from('gmail_tracked_emails')
        .select('*')
        .eq('connection_id', connectionId)
        .eq('has_reply', false)
        .order('sent_at', { ascending: false })
        .limit(100); // Check last 100 unreplied emails

      if (!trackedEmails || trackedEmails.length === 0) {
        return {
          success: true,
          repliesFound: 0,
          errors: [],
        };
      }

      // Initialize Gmail API
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: 'v1', auth });

      let repliesFound = 0;

      // Check each tracked email for replies
      for (const tracked of trackedEmails) {
        try {
          // Get the thread
          const thread = await gmail.users.threads.get({
            userId: 'me',
            id: tracked.gmail_thread_id,
          });

          const messages = thread.data.messages || [];

          // Check if there are more messages than when we sent (indicates reply)
          if (messages.length > 1) {
            // Find the reply message (not sent by user)
            const replyMessage = messages.find(
              msg => msg.id !== tracked.gmail_message_id
            );

            if (replyMessage) {
              // Extract reply details
              const snippet = replyMessage.snippet || '';
              const replyDate = replyMessage.internalDate
                ? new Date(parseInt(replyMessage.internalDate))
                : new Date();

              // Update tracked email
              await supabase
                .from('gmail_tracked_emails')
                .update({
                  has_reply: true,
                  reply_received_at: replyDate.toISOString(),
                  reply_message_id: replyMessage.id,
                  reply_snippet: snippet,
                })
                .eq('id', tracked.id);

              // Update campaign status if campaign_id exists
              // Note: concat_notes RPC doesn't exist, so we fetch existing notes first
              if (tracked.campaign_id) {
                const { data: existingCampaign } = await supabase
                  .from('campaigns')
                  .select('notes')
                  .eq('id', tracked.campaign_id)
                  .single();

                const existingNotes = existingCampaign?.notes || '';
                const newNote = `\n\n✉️ Reply received: ${snippet.substring(0, 200)}`;

                await supabase
                  .from('campaigns')
                  .update({
                    status: 'active', // 'replied' is not a valid status
                    notes: existingNotes + newNote,
                  })
                  .eq('id', tracked.campaign_id);

                console.log(
                  `Reply detected for campaign ${tracked.campaign_id}`
                );
              }

              repliesFound++;

              await this.logActivity({
                connectionId,
                userId: connection.user_id,
                activityType: 'reply_detected',
                status: 'success',
                message: `Reply from ${tracked.contact_email}`,
                metadata: {
                  campaign_id: tracked.campaign_id,
                  contact_email: tracked.contact_email,
                  reply_received_at: replyDate.toISOString(),
                  snippet: snippet.substring(0, 200),
                },
              });
            }
          }

          // Update last checked time
          await supabase
            .from('gmail_tracked_emails')
            .update({ last_checked_at: new Date().toISOString() })
            .eq('id', tracked.id);
        } catch (error: any) {
          errors.push(
            `Failed to check thread ${tracked.gmail_thread_id}: ${error.message}`
          );
        }
      }

      // Log sync
      await supabase.from('integration_sync_logs').insert({
        connection_id: connectionId,
        direction: 'from_external',
        records_updated: repliesFound,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        completed_at: new Date().toISOString(),
      });

      // Update last sync time
      await supabase
        .from('integration_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connectionId);

      await this.logActivity({
        connectionId,
        userId: connection.user_id,
        activityType: 'reply_scan',
        status: errors.length > 0 ? 'warning' : 'success',
        message:
          repliesFound > 0
            ? `Detected ${repliesFound} new repl${
                repliesFound === 1 ? 'y' : 'ies'
              }`
            : 'Checked Gmail for replies',
        metadata: {
          replies_found: repliesFound,
          errors: errors.length > 0 ? errors : undefined,
        },
      });

      return {
        success: true,
        repliesFound,
        errors,
      };
    } catch (error: any) {
      errors.push(error.message);
      console.error('Error checking Gmail replies:', error);

      const supabaseError = await this.getSupabaseClient();

      // Update connection status
      await supabaseError
        .from('integration_connections')
        .update({
          status: 'error',
          error_message: error.message,
          error_count: 1,
        })
        .eq('id', connectionId);

      if (connection?.user_id) {
        await this.logActivity({
          connectionId,
          userId: connection.user_id,
          activityType: 'reply_scan',
          status: 'error',
          message: 'Failed to check Gmail for replies',
          metadata: {
            error: error.message,
          },
        });
      }

      return {
        success: false,
        repliesFound: 0,
        errors,
      };
    }
  }

  /**
   * Track a sent email for reply detection
   */
  async trackEmail(
    connectionId: string,
    campaignId: string,
    emailDetails: {
      messageId: string;
      threadId: string;
      contactEmail: string;
      subject: string;
    }
  ): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient();
      await supabase.from('gmail_tracked_emails').insert({
        connection_id: connectionId,
        campaign_id: campaignId,
        gmail_message_id: emailDetails.messageId,
        gmail_thread_id: emailDetails.threadId,
        contact_email: emailDetails.contactEmail,
        subject: emailDetails.subject,
        sent_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error tracking email:', error);
      throw error;
    }
  }

  private async logActivity({
    connectionId,
    userId,
    activityType,
    status,
    message,
    metadata,
  }: {
    connectionId: string;
    userId: string;
    activityType: 'reply_detected' | 'reply_scan';
    status: 'success' | 'error' | 'warning';
    message: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      const supabase = await this.getSupabaseClient();
      const sanitizedMetadata = metadata ? { ...metadata } : {};

      if (
        'errors' in sanitizedMetadata &&
        sanitizedMetadata.errors === undefined
      ) {
        delete sanitizedMetadata.errors;
      }

      await supabase.from('integration_activity_log').insert({
        connection_id: connectionId,
        user_id: userId,
        integration_type: this.integrationType,
        activity_type: activityType,
        status,
        message,
        metadata: sanitizedMetadata,
      });
    } catch (logError) {
      const logMessage =
        logError instanceof Error ? logError.message : String(logError);
      console.error('Failed to log Gmail integration activity:', logMessage);
    }
  }
}

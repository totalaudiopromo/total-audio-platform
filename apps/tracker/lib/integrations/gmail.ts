/**
 * Gmail Integration for Campaign Tracker
 * Links campaigns to Gmail threads and auto-logs email activity
 */

import { google } from 'googleapis';
import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import type {
  Campaign,
  CampaignContact,
  CampaignActivity,
  GmailIntegrationMeta,
} from '../db/types';

export class GmailIntegration {
  /**
   * Link a campaign to Gmail by creating a label and filtering threads
   */
  static async linkCampaignToGmail(
    campaignId: string,
    artistName: string,
    accessToken: string
  ): Promise<{ success: boolean; labelName: string; error?: string }> {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const gmail = google.gmail({ version: 'v1', auth });

      // Create label for this campaign (format: "Campaign: Artist Name")
      const labelName = `Campaign: ${artistName}`;

      // Check if label already exists
      const { data: labels } = await gmail.users.labels.list({ userId: 'me' });
      let labelId: string | undefined;

      const existingLabel = labels.labels?.find(
        (l) => l.name?.toLowerCase() === labelName.toLowerCase()
      );

      if (existingLabel) {
        labelId = existingLabel.id!;
      } else {
        // Create new label
        const { data: newLabel } = await gmail.users.labels.create({
          userId: 'me',
          requestBody: {
            name: labelName,
            messageListVisibility: 'show',
            labelListVisibility: 'labelShow',
          },
        });
        labelId = newLabel.id!;
      }

      // Update campaign with Gmail label
      const supabase = await createServerClient(cookies());
      await supabase
        .from('campaigns')
        .update({ gmail_label: labelName })
        .eq('id', campaignId);

      // Log activity
      await this.logActivity(campaignId, {
        activity_type: 'milestone',
        description: `Gmail label "${labelName}" linked to campaign`,
        integration_source: 'gmail',
        integration_id: labelId,
      });

      return { success: true, labelName };
    } catch (error: any) {
      console.error('Error linking Gmail to campaign:', error);
      return {
        success: false,
        labelName: '',
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Get Gmail threads for a campaign (by label)
   */
  static async getGmailThreadsForCampaign(
    campaignId: string,
    accessToken: string,
    limit: number = 50
  ): Promise<{
    success: boolean;
    threads: Array<{
      id: string;
      snippet: string;
      subject: string;
      from: string;
      date: string;
    }>;
    error?: string;
  }> {
    try {
      const supabase = await createServerClient(cookies());

      // Get campaign's Gmail label
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('gmail_label')
        .eq('id', campaignId)
        .single();

      if (!campaign || !campaign.gmail_label) {
        return {
          success: false,
          threads: [],
          error: 'Campaign not linked to Gmail',
        };
      }

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const gmail = google.gmail({ version: 'v1', auth });

      // Search for threads with this label
      const { data: threadsResponse } = await gmail.users.threads.list({
        userId: 'me',
        q: `label:"${campaign.gmail_label}"`,
        maxResults: limit,
      });

      if (!threadsResponse.threads || threadsResponse.threads.length === 0) {
        return { success: true, threads: [] };
      }

      // Fetch full thread details
      const threads = await Promise.all(
        threadsResponse.threads.map(async (thread) => {
          const { data: fullThread } = await gmail.users.threads.get({
            userId: 'me',
            id: thread.id!,
          });

          const firstMessage = fullThread.messages?.[0];
          const headers = firstMessage?.payload?.headers || [];

          const subject =
            headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
          const from =
            headers.find((h) => h.name === 'From')?.value || 'Unknown';
          const date =
            headers.find((h) => h.name === 'Date')?.value ||
            new Date().toISOString();

          return {
            id: thread.id!,
            snippet: fullThread.snippet || '',
            subject,
            from,
            date,
          };
        })
      );

      return { success: true, threads };
    } catch (error: any) {
      console.error('Error fetching Gmail threads:', error);
      return {
        success: false,
        threads: [],
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Track email activity automatically (sent/received)
   */
  static async trackGmailActivity(
    campaignId: string,
    contactId: string,
    messageId: string,
    threadId: string,
    accessToken: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const gmail = google.gmail({ version: 'v1', auth });

      // Get message details
      const { data: message } = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
      });

      const headers = message.payload?.headers || [];
      const from = headers.find((h) => h.name === 'From')?.value || '';
      const to = headers.find((h) => h.name === 'To')?.value || '';
      const subject = headers.find((h) => h.name === 'Subject')?.value || '';

      // Determine if sent or received (simple check: if "me" in From, it's sent)
      const isSent = from.includes('me') || from.includes('@libertymusicpr.com');
      const activityType = isSent ? 'gmail_sent' : 'gmail_received';

      const supabase = await createServerClient(cookies());

      // Update contact with Gmail thread reference
      await supabase
        .from('campaign_contacts')
        .update({
          gmail_thread_id: threadId,
          gmail_message_ids: supabase.rpc('array_append', {
            arr: [], // placeholder, will use proper array append in production
            element: messageId,
          }),
          last_contacted: isSent ? new Date().toISOString() : undefined,
        })
        .eq('id', contactId);

      // Log activity
      await this.logActivity(campaignId, {
        activity_type: activityType,
        description: isSent
          ? `Email sent: "${subject}"`
          : `Email received: "${subject}"`,
        integration_source: 'gmail',
        integration_id: messageId,
        metadata: {
          threadId,
          messageId,
          from,
          to,
          subject,
          snippet: message.snippet,
        } as GmailIntegrationMeta,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error tracking Gmail activity:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Create Gmail draft for a contact using template
   */
  static async createDraftForContact(
    contactId: string,
    template: {
      subject: string;
      body: string;
      to: string;
    },
    accessToken: string
  ): Promise<{ success: boolean; draftId?: string; error?: string }> {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const gmail = google.gmail({ version: 'v1', auth });

      // Create raw email
      const email = [
        `To: ${template.to}`,
        `Subject: ${template.subject}`,
        '',
        template.body,
      ].join('\n');

      const encodedEmail = Buffer.from(email).toString('base64url');

      // Create draft
      const { data: draft } = await gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw: encodedEmail,
          },
        },
      });

      return { success: true, draftId: draft.id };
    } catch (error: any) {
      console.error('Error creating Gmail draft:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Scan for new replies to campaign emails
   */
  static async scanForReplies(
    campaignId: string,
    accessToken: string
  ): Promise<{
    success: boolean;
    newReplies: number;
    error?: string;
  }> {
    try {
      const supabase = await createServerClient(cookies());

      // Get all contacts with Gmail threads
      const { data: contacts } = await supabase
        .from('campaign_contacts')
        .select('*')
        .eq('campaign_id', campaignId)
        .not('gmail_thread_id', 'is', null);

      if (!contacts || contacts.length === 0) {
        return { success: true, newReplies: 0 };
      }

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const gmail = google.gmail({ version: 'v1', auth });

      let newReplies = 0;

      for (const contact of contacts) {
        try {
          // Get thread details
          const { data: thread } = await gmail.users.threads.get({
            userId: 'me',
            id: contact.gmail_thread_id!,
          });

          const messages = thread.messages || [];

          // Check if there are new messages we haven't tracked
          const trackedMessageIds = contact.gmail_message_ids || [];
          const newMessages = messages.filter(
            (msg) => !trackedMessageIds.includes(msg.id!)
          );

          if (newMessages.length > 0) {
            // Found new replies!
            for (const newMsg of newMessages) {
              await this.trackGmailActivity(
                campaignId,
                contact.id,
                newMsg.id!,
                contact.gmail_thread_id!,
                accessToken
              );
              newReplies++;
            }

            // Update contact status
            await supabase
              .from('campaign_contacts')
              .update({ status: 'responded' })
              .eq('id', contact.id);
          }
        } catch (error) {
          console.error(
            `Error checking thread ${contact.gmail_thread_id}:`,
            error
          );
        }
      }

      return { success: true, newReplies };
    } catch (error: any) {
      console.error('Error scanning for replies:', error);
      return {
        success: false,
        newReplies: 0,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Helper: Log campaign activity
   */
  private static async logActivity(
    campaignId: string,
    activity: {
      activity_type: CampaignActivity['activity_type'];
      description: string;
      integration_source?: CampaignActivity['integration_source'];
      integration_id?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      const supabase = await createServerClient(cookies());
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('No user authenticated for activity logging');
        return;
      }

      await supabase.from('campaign_activities').insert({
        campaign_id: campaignId,
        user_id: user.id,
        activity_type: activity.activity_type,
        description: activity.description,
        integration_source: activity.integration_source || 'manual',
        integration_id: activity.integration_id,
        metadata: activity.metadata,
      });
    } catch (error) {
      console.error('Error logging campaign activity:', error);
    }
  }
}

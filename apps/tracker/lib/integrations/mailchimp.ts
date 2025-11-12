/**
 * Mailchimp Integration for Campaign Tracker
 * Links campaigns to Mailchimp campaigns and tracks email performance
 */

import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import type {
  CampaignActivity,
  CampaignMetric,
  MailchimpIntegrationMeta,
} from '../db/types';

interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string; // e.g., "us19" from API key
}

export class MailchimpIntegration {
  /**
   * Link a campaign to Mailchimp campaign
   */
  static async linkCampaignToMailchimp(
    campaignId: string,
    mailchimpCampaignId: string,
    config: MailchimpConfig
  ): Promise<{ success: boolean; campaignInfo?: any; error?: string }> {
    try {
      // Fetch campaign details from Mailchimp
      const campaignInfo = await this.fetchMailchimpCampaign(
        mailchimpCampaignId,
        config
      );

      if (!campaignInfo) {
        return {
          success: false,
          error: 'Mailchimp campaign not found',
        };
      }

      // Update campaign with Mailchimp ID
      const supabase = await createServerClient(cookies());
      await supabase
        .from('campaigns')
        .update({ mailchimp_campaign_id: mailchimpCampaignId })
        .eq('id', campaignId);

      // Log activity
      await this.logActivity(campaignId, {
        activity_type: 'milestone',
        description: `Mailchimp campaign "${campaignInfo.settings.title}" linked`,
        integration_source: 'mailchimp',
        integration_id: mailchimpCampaignId,
        metadata: {
          campaignId: mailchimpCampaignId,
          listId: campaignInfo.recipients.list_id,
        },
      });

      return { success: true, campaignInfo };
    } catch (error: any) {
      console.error('Error linking Mailchimp campaign:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Fetch Mailchimp campaign details
   */
  private static async fetchMailchimpCampaign(
    campaignId: string,
    config: MailchimpConfig
  ): Promise<any> {
    const url = `https://${config.serverPrefix}.api.mailchimp.com/3.0/campaigns/${campaignId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Mailchimp API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Sync Mailchimp campaign stats to tracker
   */
  static async syncMailchimpStats(
    campaignId: string,
    mailchimpCampaignId: string,
    config: MailchimpConfig
  ): Promise<{
    success: boolean;
    stats?: {
      emailsSent: number;
      opens: number;
      clicks: number;
      openRate: number;
      clickRate: number;
    };
    error?: string;
  }> {
    try {
      // Fetch campaign report from Mailchimp
      const url = `https://${config.serverPrefix}.api.mailchimp.com/3.0/reports/${mailchimpCampaignId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Mailchimp API error: ${response.statusText}`);
      }

      const report = await response.json();

      const stats = {
        emailsSent: report.emails_sent || 0,
        opens: report.opens?.unique_opens || 0,
        clicks: report.clicks?.unique_clicks || 0,
        openRate: report.opens?.open_rate || 0,
        clickRate: report.clicks?.click_rate || 0,
      };

      // Store metrics in database
      const supabase = await createServerClient(cookies());

      await supabase.from('campaign_metrics').insert([
        {
          campaign_id: campaignId,
          metric_type: 'emails_sent',
          value: stats.emailsSent,
          source: 'mailchimp_api',
        },
        {
          campaign_id: campaignId,
          metric_type: 'email_opens',
          value: stats.opens,
          source: 'mailchimp_api',
        },
        {
          campaign_id: campaignId,
          metric_type: 'email_clicks',
          value: stats.clicks,
          source: 'mailchimp_api',
        },
      ]);

      // Log activity
      await this.logActivity(campaignId, {
        activity_type: 'milestone',
        description: `Mailchimp stats synced: ${stats.emailsSent} sent, ${stats.opens} opens (${(stats.openRate * 100).toFixed(1)}%), ${stats.clicks} clicks`,
        integration_source: 'mailchimp',
        integration_id: mailchimpCampaignId,
        metadata: stats as MailchimpIntegrationMeta,
      });

      return { success: true, stats };
    } catch (error: any) {
      console.error('Error syncing Mailchimp stats:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Track individual subscriber activity
   */
  static async trackSubscriberActivity(
    campaignId: string,
    contactId: string,
    subscriberId: string,
    mailchimpCampaignId: string,
    config: MailchimpConfig
  ): Promise<{ success: boolean; activity?: any; error?: string }> {
    try {
      // Fetch subscriber activity from Mailchimp
      const url = `https://${config.serverPrefix}.api.mailchimp.com/3.0/reports/${mailchimpCampaignId}/email-activity/${subscriberId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Mailchimp API error: ${response.statusText}`);
      }

      const activity = await response.json();

      // Update contact with Mailchimp subscriber ID
      const supabase = await createServerClient(cookies());
      await supabase
        .from('campaign_contacts')
        .update({ mailchimp_subscriber_id: subscriberId })
        .eq('id', contactId);

      // Log opens and clicks
      if (activity.activity && activity.activity.length > 0) {
        for (const act of activity.activity) {
          if (act.action === 'open') {
            await this.logActivity(campaignId, {
              activity_type: 'mailchimp_sent',
              description: `Email opened by ${activity.email_address}`,
              integration_source: 'mailchimp',
              integration_id: mailchimpCampaignId,
              metadata: {
                subscriberId,
                action: 'open',
                timestamp: act.timestamp,
              },
            });
          } else if (act.action === 'click') {
            await this.logActivity(campaignId, {
              activity_type: 'got_response',
              description: `Email link clicked by ${activity.email_address}`,
              integration_source: 'mailchimp',
              integration_id: mailchimpCampaignId,
              metadata: {
                subscriberId,
                action: 'click',
                url: act.url,
                timestamp: act.timestamp,
              },
            });
          }
        }
      }

      return { success: true, activity };
    } catch (error: any) {
      console.error('Error tracking Mailchimp subscriber activity:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Add contact to Mailchimp list
   */
  static async addContactToList(
    listId: string,
    contact: {
      email: string;
      firstName?: string;
      lastName?: string;
      tags?: string[];
    },
    config: MailchimpConfig
  ): Promise<{ success: boolean; subscriberId?: string; error?: string }> {
    try {
      const url = `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;

      const payload = {
        email_address: contact.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: contact.firstName || '',
          LNAME: contact.lastName || '',
        },
        tags: contact.tags || [],
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add contact to Mailchimp');
      }

      const result = await response.json();

      return {
        success: true,
        subscriberId: result.id,
      };
    } catch (error: any) {
      console.error('Error adding contact to Mailchimp list:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
      };
    }
  }

  /**
   * Create Mailchimp campaign from tracker campaign
   */
  static async createMailchimpCampaign(
    campaignId: string,
    options: {
      listId: string;
      subject: string;
      previewText: string;
      fromName: string;
      replyTo: string;
      htmlContent: string;
    },
    config: MailchimpConfig
  ): Promise<{ success: boolean; mailchimpCampaignId?: string; error?: string }> {
    try {
      const supabase = await createServerClient(cookies());

      // Get campaign details
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        return { success: false, error: 'Campaign not found' };
      }

      // Create Mailchimp campaign
      const url = `https://${config.serverPrefix}.api.mailchimp.com/3.0/campaigns`;

      const payload = {
        type: 'regular',
        recipients: {
          list_id: options.listId,
        },
        settings: {
          subject_line: options.subject,
          preview_text: options.previewText,
          title: campaign.title || 'Campaign',
          from_name: options.fromName,
          reply_to: options.replyTo,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create Mailchimp campaign');
      }

      const result = await response.json();
      const mailchimpCampaignId = result.id;

      // Set campaign content
      const contentUrl = `https://${config.serverPrefix}.api.mailchimp.com/3.0/campaigns/${mailchimpCampaignId}/content`;

      const contentResponse = await fetch(contentUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: options.htmlContent }),
      });

      if (!contentResponse.ok) {
        throw new Error('Failed to set campaign content');
      }

      // Link campaign to tracker
      await this.linkCampaignToMailchimp(
        campaignId,
        mailchimpCampaignId,
        config
      );

      return { success: true, mailchimpCampaignId };
    } catch (error: any) {
      console.error('Error creating Mailchimp campaign:', error);
      return {
        success: false,
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

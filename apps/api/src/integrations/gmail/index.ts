import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

interface GmailConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken: string;
  expiryDate?: number;
}

export class GmailService {
  private gmail: any;
  private config: GmailConfig;

  constructor(config: GmailConfig) {
    this.config = config;
    
    const oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      'http://localhost:3001/api/integrations/gmail/callback'
    );

    const credentials: any = {
      access_token: config.accessToken,
      refresh_token: config.refreshToken,
    };

    if (config.expiryDate) {
      credentials.expiry_date = config.expiryDate;
    }

    oauth2Client.setCredentials(credentials);

    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  async trackReplies(campaignId: string): Promise<void> {
    try {
      const emailCampaigns = await prisma.emailCampaign.findMany({
        where: { campaignId },
        select: { id: true, subject: true, sentAt: true },
      });

      for (const campaign of emailCampaigns) {
        if (!campaign.sentAt) continue;

        const query = `subject:"Re: ${campaign.subject}" after:${this.formatDate(campaign.sentAt)}`;
        
        const response = await this.gmail.users.messages.list({
          userId: 'me',
          q: query,
          maxResults: 100,
        });

        if (response.data.messages) {
          for (const message of response.data.messages) {
            await this.processReply(message.id, campaignId);
          }
        }
      }

      logger.info(`Tracked replies for campaign: ${campaignId}`);
    } catch (error) {
      logger.error('Gmail reply tracking error:', error);
      throw error;
    }
  }

  async getRecentReplies(subject: string, sentAfter: Date): Promise<any[]> {
    try {
      const query = `subject:"Re: ${subject}" after:${this.formatDate(sentAfter)}`;
      
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 50,
      });

      const replies = [];
      
      if (response.data.messages) {
        for (const message of response.data.messages) {
          const messageDetails = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          const headers = messageDetails.data.payload.headers;
          const fromHeader = headers.find((h: any) => h.name === 'From');
          const subjectHeader = headers.find((h: any) => h.name === 'Subject');
          const dateHeader = headers.find((h: any) => h.name === 'Date');

          if (fromHeader && subjectHeader && dateHeader) {
            replies.push({
              messageId: message.id,
              from: fromHeader.value,
              subject: subjectHeader.value,
              date: new Date(dateHeader.value),
              email: this.extractEmail(fromHeader.value),
            });
          }
        }
      }

      return replies;
    } catch (error) {
      logger.error('Gmail get recent replies error:', error);
      return [];
    }
  }

  private async processReply(messageId: string, campaignId: string): Promise<void> {
    try {
      const message = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
      });

      const headers = message.data.payload.headers;
      const fromHeader = headers.find((h: any) => h.name === 'From');
      const subjectHeader = headers.find((h: any) => h.name === 'Subject');
      const dateHeader = headers.find((h: any) => h.name === 'Date');

      if (fromHeader && subjectHeader) {
        const email = this.extractEmail(fromHeader.value);
        
        const contact = await prisma.contact.findUnique({
          where: { email },
        });

        if (contact) {
          await prisma.interaction.create({
            data: {
              campaignId,
              contactId: contact.id,
              type: 'EMAIL_REPLIED',
              details: {
                subject: subjectHeader.value,
                messageId: messageId,
                timestamp: new Date(dateHeader?.value || new Date()),
              },
              timestamp: new Date(dateHeader?.value || new Date()),
            },
          });

          await this.updateReplyAnalytics(campaignId);
        }
      }
    } catch (error) {
      logger.error('Gmail reply processing error:', error);
    }
  }

  private async updateReplyAnalytics(campaignId: string): Promise<void> {
    try {
      const replyCount = await prisma.interaction.count({
        where: {
          campaignId,
          type: 'EMAIL_REPLIED',
        },
      });

      const emailCampaigns = await prisma.emailCampaign.findMany({
        where: { campaignId },
        include: { analytics: true },
      });

      for (const campaign of emailCampaigns) {
        if (campaign.analytics) {
          const replyRate = campaign.recipientCount > 0 
            ? (replyCount / campaign.recipientCount) * 100 
            : 0;

          await prisma.emailCampaignAnalytics.update({
            where: { emailCampaignId: campaign.id },
            data: {
              replies: replyCount,
              replyRate,
              updatedAt: new Date(),
            },
          });
        }
      }
    } catch (error) {
      logger.error('Gmail analytics update error:', error);
    }
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      const message = this.createMessage(to, subject, content);
      
      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message,
        },
      });

      logger.info(`Sent email via Gmail to: ${to}`);
    } catch (error) {
      logger.error('Gmail send error:', error);
      throw error;
    }
  }

  async sendBulkEmail(recipients: string[], subject: string, content: string): Promise<{
    success: string[];
    failed: string[];
  }> {
    const results = {
      success: [] as string[],
      failed: [] as string[],
    };

    for (const recipient of recipients) {
      try {
        await this.sendEmail(recipient, subject, content);
        results.success.push(recipient);
      } catch (error) {
        logger.error(`Failed to send email to ${recipient}:`, error);
        results.failed.push(recipient);
      }
    }

    return results;
  }

  async getEmailThread(threadId: string): Promise<any> {
    try {
      const response = await this.gmail.users.threads.get({
        userId: 'me',
        id: threadId,
      });

      return response.data;
    } catch (error) {
      logger.error('Gmail get thread error:', error);
      throw error;
    }
  }

  async searchEmails(query: string, maxResults: number = 50): Promise<any[]> {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults,
      });

      const emails = [];
      
      if (response.data.messages) {
        for (const message of response.data.messages) {
          const messageDetails = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          const headers = messageDetails.data.payload.headers;
          const fromHeader = headers.find((h: any) => h.name === 'From');
          const subjectHeader = headers.find((h: any) => h.name === 'Subject');
          const dateHeader = headers.find((h: any) => h.name === 'Date');

          emails.push({
            id: message.id,
            from: (fromHeader?.value as string) || '',
            subject: (subjectHeader?.value as string) || '',
            date: dateHeader ? new Date(dateHeader.value) : new Date(),
            snippet: (messageDetails.data.snippet as string) || '',
          });
        }
      }

      return emails;
    } catch (error) {
      logger.error('Gmail search emails error:', error);
      return [];
    }
  }

  private createMessage(to: string, subject: string, content: string): string {
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      content
    ].join('\r\n');

    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  private extractEmail(fromHeader: string): string {
    const emailMatch = fromHeader ? fromHeader.match(/<(.+?)>/) : null;
    return emailMatch && emailMatch[1] ? emailMatch[1] : (fromHeader || '');
  }

  private formatDate(date: Date): string {
    const result = (date && typeof date.toISOString === 'function') ? date.toISOString().split('T')[0] : '';
    return result || '';
  }

  async watchEmailChanges(campaignId: string): Promise<void> {
    try {
      await this.gmail.users.watch({
        userId: 'me',
        requestBody: {
          topicName: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/topics/gmail-replies`,
          labelIds: ['INBOX'],
        },
      });

      logger.info(`Started watching Gmail changes for campaign: ${campaignId}`);
    } catch (error) {
      logger.error('Gmail watch error:', error);
    }
  }

  async stopWatching(): Promise<void> {
    try {
      await this.gmail.users.stop({
        userId: 'me',
      });

      logger.info('Stopped watching Gmail changes');
    } catch (error) {
      logger.error('Gmail stop watching error:', error);
    }
  }

  static async getIntegrationForUser(userId: string): Promise<GmailService | null> {
    try {
      const integration = await prisma.integration.findUnique({
        where: {
          userId_type: {
            userId,
            type: 'GMAIL',
          },
        },
      });

      if (!integration || integration.status !== 'CONNECTED') {
        return null;
      }

      const config = integration.config as unknown as GmailConfig;
      return new GmailService(config);
    } catch (error) {
      logger.error('Failed to get Gmail integration:', error);
      return null;
    }
  }
}
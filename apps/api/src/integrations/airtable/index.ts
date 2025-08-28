import Airtable from 'airtable';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

interface AirtableConfig {
  apiKey: string;
  baseId: string;
  contactsTableId: string;
  campaignsTableId: string;
  interactionsTableId: string;
  emailsTableId: string;
}

export class AirtableService {
  private base: Airtable.Base;
  private config: AirtableConfig;

  constructor(config: AirtableConfig) {
    this.config = config;
    Airtable.configure({
      apiKey: config.apiKey,
    });
    this.base = Airtable.base(config.baseId);
  }

  async syncContacts(userId: string): Promise<void> {
    try {
      const contacts = await this.base(this.config.contactsTableId)
        .select({
          maxRecords: 1000,
          view: 'Grid view',
        })
        .all();

      for (const record of contacts) {
        const fields = record.fields;
        
        await prisma.contact.upsert({
          where: { email: (fields.Email as string) || '' },
          update: {
            name: (fields.Name as string) || '',
            company: (fields.Company as string) || '',
            role: (fields.Role as string) || '',
            genre: (fields.Genre as string) || '',
            location: (fields.Location as string) || '',
            tags: fields.Tags ? (fields.Tags as string).split(',').map(t => t.trim()) : [],
            updatedAt: new Date(),
          },
          create: {
            email: (fields.Email as string) || '',
            name: (fields.Name as string) || '',
            company: (fields.Company as string) || '',
            role: (fields.Role as string) || '',
            genre: (fields.Genre as string) || '',
            location: (fields.Location as string) || '',
            tags: fields.Tags ? (fields.Tags as string).split(',').map(t => t.trim()) : [],
            status: 'ACTIVE',
          },
        });
      }

      await prisma.integration.update({
        where: {
          userId_type: {
            userId,
            type: 'AIRTABLE',
          },
        },
        data: {
          lastSyncAt: new Date(),
          status: 'CONNECTED',
        },
      });

      logger.info(`Synced ${contacts.length} contacts from Airtable for user ${userId}`);
    } catch (error) {
      logger.error('Airtable sync error:', error);
      
      await prisma.integration.update({
        where: {
          userId_type: {
            userId,
            type: 'AIRTABLE',
          },
        },
        data: {
          status: 'ERROR',
        },
      });
      
      throw error;
    }
  }

  async createCampaignRecord(campaignData: any): Promise<void> {
    try {
      await this.base(this.config.campaignsTableId).create([
        {
          fields: {
            Name: campaignData.name,
            Artist: campaignData.artist,
            Status: campaignData.status,
            'Start Date': campaignData.startDate,
            'End Date': campaignData.endDate,
            Type: campaignData.type,
            Budget: campaignData.budget,
          },
        },
      ]);

      logger.info(`Created campaign record in Airtable: ${campaignData.name}`);
    } catch (error) {
      logger.error('Airtable campaign creation error:', error);
      throw error;
    }
  }

  async logInteraction(interactionData: any): Promise<void> {
    try {
      await this.base(this.config.interactionsTableId).create([
        {
          fields: {
            Campaign: interactionData.campaign,
            Contact: interactionData.contact,
            Type: interactionData.type,
            Timestamp: interactionData.timestamp,
            Details: JSON.stringify(interactionData.details),
          },
        },
      ]);

      logger.info(`Logged interaction in Airtable: ${interactionData.type}`);
    } catch (error) {
      logger.error('Airtable interaction logging error:', error);
      throw error;
    }
  }

  async updateEmailAnalytics(emailData: any): Promise<void> {
    try {
      await this.base(this.config.emailsTableId).create([
        {
          fields: {
            Campaign: emailData.campaign,
            Subject: emailData.subject,
            'Recipient Count': emailData.recipientCount,
            'Open Rate': emailData.openRate,
            'Click Rate': emailData.clickRate,
            'Reply Rate': emailData.replyRate,
            'Sent Date': emailData.sentDate,
            Status: emailData.status,
          },
        },
      ]);

      logger.info(`Updated email analytics in Airtable: ${emailData.subject}`);
    } catch (error) {
      logger.error('Airtable email analytics error:', error);
      throw error;
    }
  }

  static async getIntegrationForUser(userId: string): Promise<AirtableService | null> {
    try {
      const integration = await prisma.integration.findUnique({
        where: {
          userId_type: {
            userId,
            type: 'AIRTABLE',
          },
        },
      });

      if (!integration || integration.status !== 'CONNECTED') {
        return null;
      }

      const config = integration.config as unknown as AirtableConfig;
      return new AirtableService(config);
    } catch (error) {
      logger.error('Failed to get Airtable integration:', error);
      return null;
    }
  }
}
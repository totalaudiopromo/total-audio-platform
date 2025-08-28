import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

interface ClaudeConfig {
  apiKey: string;
  model: string;
}

export class ClaudeService {
  private anthropic: Anthropic;
  private config: ClaudeConfig;

  constructor(config: ClaudeConfig) {
    this.config = config;
    this.anthropic = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const message = await this.anthropic.messages.create({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0]?.text || 'No response generated';
    } catch (error) {
      logger.error('Claude response generation error:', error);
      throw error;
    }
  }

  async generateCampaignReport(campaignId: string, reportType: 'WEEKLY' | 'MONTHLY' | 'CAMPAIGN_SUMMARY'): Promise<{
    content: string;
    insights: string[];
    recommendations: string[];
  }> {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          artist: true,
          emailCampaigns: {
            include: {
              analytics: true,
            },
          },
          interactions: {
            include: {
              contact: true,
            },
          },
        },
      });

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const campaignData = this.prepareCampaignData(campaign);
      const prompt = this.buildReportPrompt(campaignData, reportType);

      const message = await this.anthropic.messages.create({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = message.content[0]?.text || '';
      const parsedResponse = this.parseReportResponse(response);

      await prisma.report.create({
        data: {
          campaignId,
          generatedBy: 'system',
          type: reportType,
          content: parsedResponse.content,
          insights: parsedResponse.insights,
          recommendations: parsedResponse.recommendations,
        },
      });

      logger.info(`Generated ${reportType} report for campaign: ${campaignId}`);
      return parsedResponse;
    } catch (error) {
      logger.error('Claude report generation error:', error);
      throw error;
    }
  }

  private prepareCampaignData(campaign: any): any {
    const totalEmails = campaign.emailCampaigns.reduce((sum: number, ec: any) => sum + ec.recipientCount, 0);
    const totalOpens = campaign.emailCampaigns.reduce((sum: number, ec: any) => sum + (ec.analytics?.opens || 0), 0);
    const totalClicks = campaign.emailCampaigns.reduce((sum: number, ec: any) => sum + (ec.analytics?.clicks || 0), 0);
    const totalReplies = campaign.emailCampaigns.reduce((sum: number, ec: any) => sum + (ec.analytics?.replies || 0), 0);

    const openRate = totalEmails > 0 ? (totalOpens / totalEmails) * 100 : 0;
    const clickRate = totalEmails > 0 ? (totalClicks / totalEmails) * 100 : 0;
    const replyRate = totalEmails > 0 ? (totalReplies / totalEmails) * 100 : 0;

    return {
      name: campaign.name,
      artist: campaign.artist.name,
      status: campaign.status,
      type: campaign.type,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      totalEmails,
      totalOpens,
      totalClicks,
      totalReplies,
      openRate,
      clickRate,
      replyRate,
      emailCampaigns: campaign.emailCampaigns.map((ec: any) => ({
        subject: ec.subject,
        recipientCount: ec.recipientCount,
        sentAt: ec.sentAt,
        analytics: ec.analytics,
      })),
      interactions: campaign.interactions.map((i: any) => ({
        type: i.type,
        timestamp: i.timestamp,
        contact: i.contact.name,
      })),
    };
  }

  private buildReportPrompt(campaignData: any, reportType: string): string {
    const timeframe = reportType === 'WEEKLY' ? 'week' : reportType === 'MONTHLY' ? 'month' : 'entire campaign';
    
    return `
You are a music promotion analytics expert. Generate a comprehensive ${reportType.toLowerCase().replace('_', ' ')} report for the following campaign data:

Campaign: ${campaignData.name}
Artist: ${campaignData.artist}
Type: ${campaignData.type}
Status: ${campaignData.status}
Duration: ${campaignData.startDate} to ${campaignData.endDate || 'ongoing'}

Performance Metrics:
- Total Emails Sent: ${campaignData.totalEmails}
- Total Opens: ${campaignData.totalOpens}
- Total Clicks: ${campaignData.totalClicks}
- Total Replies: ${campaignData.totalReplies}
- Open Rate: ${campaignData.openRate.toFixed(2)}%
- Click Rate: ${campaignData.clickRate.toFixed(2)}%
- Reply Rate: ${campaignData.replyRate.toFixed(2)}%

Email Campaigns:
${campaignData.emailCampaigns.map((ec: any) => `
- Subject: ${ec.subject}
- Recipients: ${ec.recipientCount}
- Sent: ${ec.sentAt}
- Opens: ${ec.analytics?.opens || 0}
- Clicks: ${ec.analytics?.clicks || 0}
- Replies: ${ec.analytics?.replies || 0}
`).join('')}

Recent Interactions:
${campaignData.interactions.slice(0, 10).map((i: any) => `
- ${i.type} from ${i.contact} at ${i.timestamp}
`).join('')}

Please provide:
1. A detailed narrative report analyzing the campaign performance for this ${timeframe}
2. Key insights about what's working well and what needs improvement
3. Specific actionable recommendations for optimization

Format your response as JSON with the following structure:
{
  "content": "Your detailed narrative report here",
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}

Focus on music industry best practices and provide context about typical performance benchmarks for music promotion campaigns.
`;
  }

  private parseReportResponse(response: string): {
    content: string;
    insights: string[];
    recommendations: string[];
  } {
    try {
      const parsed = JSON.parse(response);
      return {
        content: parsed.content || '',
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      logger.error('Failed to parse Claude response:', error);
      return {
        content: response,
        insights: [],
        recommendations: [],
      };
    }
  }

  async generateEmailContent(campaignData: {
    artistName: string;
    genre: string;
    releaseTitle: string;
    releaseType: string;
    releaseDate: string;
    spotifyUrl?: string;
    targetAudience: string;
  }): Promise<string> {
    try {
      const prompt = `
You are an expert music PR copywriter. Create a compelling email pitch for the following release:

Artist: ${campaignData.artistName}
Genre: ${campaignData.genre}
Release: ${campaignData.releaseTitle}
Type: ${campaignData.releaseType}
Release Date: ${campaignData.releaseDate}
Spotify URL: ${campaignData.spotifyUrl || 'Not provided'}
Target Audience: ${campaignData.targetAudience}

Write a professional, engaging email that:
1. Has a compelling subject line
2. Introduces the artist and release effectively
3. Highlights unique selling points
4. Includes a clear call-to-action
5. Maintains a professional but personable tone
6. Is tailored for ${campaignData.targetAudience}

Format as HTML email content with proper styling.
`;

      const message = await this.anthropic.messages.create({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return message.content[0]?.text || '';
    } catch (error) {
      logger.error('Claude email generation error:', error);
      throw error;
    }
  }

  async analyzeContactEngagement(contactId: string): Promise<{
    engagementScore: number;
    insights: string[];
    recommendations: string[];
  }> {
    try {
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        include: {
          interactions: {
            orderBy: { timestamp: 'desc' },
            take: 50,
          },
        },
      });

      if (!contact) {
        throw new Error('Contact not found');
      }

      const interactionData = this.prepareContactData(contact);
      const prompt = this.buildEngagementPrompt(interactionData);

      const message = await this.anthropic.messages.create({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = message.content[0]?.text || '';
      const analysis = this.parseEngagementResponse(response);

      logger.info(`Analyzed engagement for contact: ${contactId}`);
      return analysis;
    } catch (error) {
      logger.error('Claude engagement analysis error:', error);
      throw error;
    }
  }

  private prepareContactData(contact: any): any {
    const interactions = contact.interactions;
    const totalInteractions = interactions.length;
    const replies = interactions.filter((i: any) => i.type === 'EMAIL_REPLIED').length;
    const opens = interactions.filter((i: any) => i.type === 'EMAIL_OPENED').length;
    const clicks = interactions.filter((i: any) => i.type === 'EMAIL_CLICKED').length;

    return {
      name: contact.name,
      email: contact.email,
      company: contact.company,
      role: contact.role,
      genre: contact.genre,
      totalInteractions,
      replies,
      opens,
      clicks,
      lastContactedAt: contact.lastContactedAt,
      responseRate: contact.responseRate,
      recentInteractions: interactions.slice(0, 10).map((i: any) => ({
        type: i.type,
        timestamp: i.timestamp,
      })),
    };
  }

  private buildEngagementPrompt(contactData: any): string {
    return `
Analyze the engagement level of this music industry contact:

Contact: ${contactData.name}
Email: ${contactData.email}
Company: ${contactData.company || 'Not specified'}
Role: ${contactData.role || 'Not specified'}
Genre Focus: ${contactData.genre || 'Not specified'}

Interaction History:
- Total Interactions: ${contactData.totalInteractions}
- Email Opens: ${contactData.opens}
- Email Clicks: ${contactData.clicks}
- Email Replies: ${contactData.replies}
- Last Contacted: ${contactData.lastContactedAt || 'Never'}
- Response Rate: ${contactData.responseRate || 0}%

Recent Activity:
${contactData.recentInteractions.map((i: any) => `- ${i.type} at ${i.timestamp}`).join('\n')}

Please provide:
1. An engagement score from 1-100 (100 being most engaged)
2. Key insights about their engagement patterns
3. Specific recommendations for improving engagement

Format as JSON:
{
  "engagementScore": 85,
  "insights": ["Insight 1", "Insight 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
`;
  }

  private parseEngagementResponse(response: string): {
    engagementScore: number;
    insights: string[];
    recommendations: string[];
  } {
    try {
      const parsed = JSON.parse(response);
      return {
        engagementScore: parsed.engagementScore || 0,
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      logger.error('Failed to parse engagement response:', error);
      return {
        engagementScore: 0,
        insights: [],
        recommendations: [],
      };
    }
  }

  static async getIntegrationForUser(userId: string): Promise<ClaudeService | null> {
    try {
      const config = {
        apiKey: process.env.ANTHROPIC_API_KEY!,
        model: 'claude-3-sonnet-20240229',
      };

      return new ClaudeService(config);
    } catch (error) {
      logger.error('Failed to get Claude integration:', error);
      return null;
    }
  }
}
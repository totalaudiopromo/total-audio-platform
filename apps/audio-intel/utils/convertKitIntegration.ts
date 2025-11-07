// Temporarily disabled import for build fix
// import { WeeklyIntelligence } from './weeklyMusicAgent';

// Temporary interface definition for build fix
export interface WeeklyIntelligence {
  weekNumber: number;
  issueNumber: number;
  articles: any[];
  sources: string[];
  totalArticles: number;
  weeklyInsight?: string;
  topStories: any[];
  quickTip?: string;
  toolPromotion?: string;
  communityQuestion?: string;
}

export interface ConvertKitCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  updatedAt: string;
}

export interface ConvertKitSubscriber {
  id: string;
  email: string;
  firstName: string;
  tags: string[];
  createdAt: string;
}

export class ConvertKitAgent {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl = 'https://api.convertkit.com/v3';

  constructor() {
    this.apiKey = process.env.CONVERTKIT_API_KEY || '';
    this.apiSecret = process.env.CONVERTKIT_API_SECRET || '';

    if (!this.apiKey || !this.apiSecret) {
      throw new Error('ConvertKit API credentials not configured');
    }
  }

  // Create a newsletter draft in ConvertKit
  async createNewsletterDraft(intelligence: WeeklyIntelligence): Promise<ConvertKitCampaign> {
    try {
      console.log(`📧 Creating ConvertKit draft for week ${intelligence.weekNumber}...`);

      const campaignName = `The Unsigned Advantage - Week ${intelligence.weekNumber}`;
      const subject = this.generateSubject(intelligence);
      const content = this.generateConvertKitContent(intelligence);

      // Create broadcast in ConvertKit
      const response = await fetch(`${this.baseUrl}/broadcasts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_secret: this.apiSecret,
          name: campaignName,
          subject: subject,
          content: content,
          status: 'draft', // Create as draft, not sent
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ConvertKit API error: ${response.status} - ${error}`);
      }

      const data = await response.json();

      console.log(`✅ ConvertKit draft created: ${data.broadcast.id}`);

      return {
        id: data.broadcast.id.toString(),
        name: campaignName,
        subject: subject,
        content: content,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating ConvertKit draft:', error);
      throw error;
    }
  }

  // Get subscribers with newsletter tag
  async getNewsletterSubscribers(): Promise<ConvertKitSubscriber[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/subscribers?api_secret=${this.apiSecret}&tag_id=10182443`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`ConvertKit API error: ${response.status}`);
      }

      const data = await response.json();

      return data.subscribers.map((sub: any) => ({
        id: sub.id.toString(),
        email: sub.email_address,
        firstName: sub.first_name || '',
        tags: sub.tags || [],
        createdAt: sub.created_at,
      }));
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }

  // Send the draft to subscribers
  async sendNewsletterDraft(
    campaignId: string
  ): Promise<{ success: boolean; sent: number; error?: string }> {
    try {
      console.log(`📤 Sending ConvertKit campaign ${campaignId}...`);

      const response = await fetch(`${this.baseUrl}/broadcasts/${campaignId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_secret: this.apiSecret,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ConvertKit API error: ${response.status} - ${error}`);
      }

      const data = await response.json();

      console.log(`✅ Newsletter sent successfully`);

      return {
        success: true,
        sent: data.broadcast.recipients_count || 0,
      };
    } catch (error) {
      console.error('Error sending newsletter:', error);
      return {
        success: false,
        sent: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Generate compelling subject line
  private generateSubject(intelligence: WeeklyIntelligence): string {
    const subjects = [
      `🎵 Week ${intelligence.weekNumber}: Underground Music Intelligence`,
      `The Unsigned Advantage #${intelligence.weekNumber}: What's Really Happening`,
      `Week ${intelligence.weekNumber}: Underground Trends + Your Tool Update`,
      `🎧 The Unsigned Advantage #${intelligence.weekNumber}: Real Music Industry Intel`,
      `Week ${intelligence.weekNumber}: Underground Music News + Practical Tips`,
    ];

    return subjects[intelligence.weekNumber % subjects.length];
  }

  // Generate ConvertKit-compatible HTML content
  private generateConvertKitContent(intelligence: WeeklyIntelligence): string {
    const currentDate = new Date().toLocaleDateString('en-GB');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Unsigned Advantage - Week ${intelligence.weekNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #1f2937; margin-bottom: 10px; }
    .header p { color: #6b7280; font-size: 14px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 10px; }
    .section-content { color: #4b5563; }
    .news-item { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .news-title { font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 8px; }
    .news-excerpt { font-size: 14px; color: #6b7280; margin-bottom: 12px; }
    .news-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
    .news-source { color: #9ca3af; font-weight: 500; }
    .news-link { color: #3b82f6; text-decoration: none; font-weight: 500; }
    .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎵 The Unsigned Advantage</h1>
    <p>Week ${intelligence.weekNumber} • ${currentDate}</p>
  </div>

  <div class="section">
    <div class="section-title">This Week's Underground Intelligence</div>
    <div class="section-content">
      <p>${intelligence.weeklyInsight}</p>
    </div>
  </div>

  ${
    intelligence.topStories.length > 0
      ? `
  <div class="section">
    <div class="section-title">What's Happening in Music This Week</div>
    <div class="section-content">
      <p>Here's what caught my attention from the underground music scene this week:</p>
      ${intelligence.topStories
        .slice(0, 3)
        .map(
          article => `
        <div class="news-item">
          <div class="news-title">${article.title}</div>
          <div class="news-excerpt">${article.excerpt}</div>
          <div class="news-meta">
            <span class="news-source">${article.source}</span>
            ${
              article.url
                ? `<a href="${article.url}" target="_blank" class="news-link">Read more →</a>`
                : ''
            }
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  </div>
  `
      : ''
  }

  <div class="section">
    <div class="section-title">Quick Tip</div>
    <div class="section-content">
      <p>${intelligence.quickTip}</p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">What I'm Working On</div>
    <div class="section-content">
      <p>${intelligence.toolPromotion}</p>
      <p><em>Building tools that actually work for independent artists - not just talking about it.</em></p>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Community Question</div>
    <div class="section-content">
      <p><strong>${intelligence.communityQuestion}</strong></p>
      <p>Hit reply and let me know your thoughts - I read every response!</p>
    </div>
  </div>

  <div style="text-align: center;">
    <a href="https://intel.totalaudiopromo.com" target="_blank" class="cta-button">Try Audio Intel Free →</a>
  </div>

  <div class="footer">
    <p>Generated by Weekly Music Intelligence Agent • ${
      intelligence.totalArticles
    } articles analyzed from ${intelligence.sources.length} sources</p>
    <p><a href="{{unsubscribe_url}}">Unsubscribe</a> | <a href="https://totalaudiopromo.com">Total Audio Promo</a></p>
  </div>
</body>
</html>`;
  }

  // Get campaign statistics
  async getCampaignStats(campaignId: string): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/broadcasts/${campaignId}?api_secret=${this.apiSecret}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`ConvertKit API error: ${response.status}`);
      }

      const data = await response.json();
      const broadcast = data.broadcast;

      return {
        sent: broadcast.recipients_count || 0,
        delivered: broadcast.delivered_count || 0,
        opened: broadcast.open_count || 0,
        clicked: broadcast.click_count || 0,
        unsubscribed: broadcast.unsubscribe_count || 0,
      };
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      return {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
      };
    }
  }
}

export const convertKitAgent = new ConvertKitAgent();

import Mailchimp from 'mailchimp-api-v3';

interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  listId: string;
}

export class MailchimpService {
  private mailchimp: Mailchimp;
  private config: MailchimpConfig;

  constructor(config: MailchimpConfig) {
    this.config = config;
    this.mailchimp = new Mailchimp(config.apiKey);
  }

  async getCampaignAnalytics(campaignId: string): Promise<any> {
    try {
      const reports = await this.mailchimp.get(`/reports/${campaignId}`);
      return {
        opens: reports.opens.opens_total,
        clicks: reports.clicks.clicks_total,
        bounces: reports.bounces.hard_bounces + reports.bounces.soft_bounces,
        unsubscribes: reports.unsubscribed.unsubscribe_count,
        openRate: reports.opens.open_rate,
        clickRate: reports.clicks.click_rate,
      };
    } catch (error) {
      throw error;
    }
  }
}
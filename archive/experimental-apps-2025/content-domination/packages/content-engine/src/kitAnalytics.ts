/**
 * Audio Intel - Kit.com Analytics & A/B Testing Framework
 * Advanced email marketing analytics with conversion tracking
 */

import KitApi from './kitApi';

interface EmailMetrics {
  email_id: string;
  sequence_id?: string;
  subject: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
  bounced_count: number;
  complained_count: number;
  open_rate: number;
  click_rate: number;
  delivery_rate: number;
  unsubscribe_rate: number;
  revenue_attributed: number;
  conversions: number;
  sent_at: string;
}

interface SequenceMetrics {
  sequence_id: string;
  sequence_name: string;
  total_subscribers: number;
  completed_subscribers: number;
  completion_rate: number;
  total_revenue: number;
  conversion_rate: number;
  average_time_to_convert: number;
  email_performance: EmailMetrics[];
}

interface ABTestConfig {
  test_id: string;
  name: string;
  type: 'subject_line' | 'send_time' | 'content' | 'cta';
  status: 'draft' | 'running' | 'completed' | 'paused';
  variants: {
    variant_id: string;
    name: string;
    weight: number;
    config: any;
  }[];
  success_metric: 'open_rate' | 'click_rate' | 'conversion_rate' | 'revenue';
  duration_days: number;
  sample_size: number;
  started_at?: string;
  completed_at?: string;
}

interface ABTestResults {
  test_id: string;
  status: 'running' | 'completed' | 'inconclusive';
  winner?: string;
  confidence_level: number;
  results: {
    variant_id: string;
    participants: number;
    metric_value: number;
    conversion_rate: number;
    statistical_significance: number;
  }[];
}

interface ConversionFunnel {
  stage: string;
  count: number;
  conversion_rate: number;
  drop_off_rate: number;
}

interface RevenueAttribution {
  email_id: string;
  subscriber_id: string;
  revenue: number;
  attributed_at: string;
  days_from_email: number;
}

class KitAnalytics {
  private kit: KitApi;
  private activeTests: Map<string, ABTestConfig> = new Map();

  constructor(apiKey: string) {
    this.kit = new KitApi(apiKey);
  }

  // Email Performance Analytics
  async getEmailMetrics(emailId: string): Promise<EmailMetrics> {
    try {
      const stats: any = await this.kit.getEmailStats(emailId);

      // Type guard to ensure stats has the expected properties
      if (!stats || typeof stats !== 'object') {
        throw new Error('Invalid stats data received from Kit API');
      }

      const safeStats = stats as any; // Type assertion for now

      // Calculate rates
      const open_rate =
        safeStats.delivered_count > 0
          ? (safeStats.opened_count / safeStats.delivered_count) * 100
          : 0;

      const click_rate =
        safeStats.opened_count > 0 ? (safeStats.clicked_count / safeStats.opened_count) * 100 : 0;

      const delivery_rate =
        safeStats.sent_count > 0 ? (safeStats.delivered_count / safeStats.sent_count) * 100 : 0;

      const unsubscribe_rate =
        safeStats.delivered_count > 0
          ? (safeStats.unsubscribed_count / safeStats.delivered_count) * 100
          : 0;

      return {
        email_id: emailId,
        sequence_id: safeStats.sequence_id,
        subject: safeStats.subject || 'Unknown Subject',
        sent_count: safeStats.sent_count || 0,
        delivered_count: safeStats.delivered_count || 0,
        opened_count: safeStats.opened_count || 0,
        clicked_count: safeStats.clicked_count || 0,
        unsubscribed_count: safeStats.unsubscribed_count || 0,
        bounced_count: safeStats.bounced_count || 0,
        complained_count: safeStats.complained_count || 0,
        open_rate: parseFloat(open_rate.toFixed(2)),
        click_rate: parseFloat(click_rate.toFixed(2)),
        delivery_rate: parseFloat(delivery_rate.toFixed(2)),
        unsubscribe_rate: parseFloat(unsubscribe_rate.toFixed(2)),
        revenue_attributed: await this.getEmailRevenue(emailId),
        conversions: await this.getEmailConversions(emailId),
        sent_at: safeStats.sent_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting email metrics:', error);
      throw error;
    }
  }

  // Sequence Performance Analytics
  async getSequenceMetrics(sequenceId: string): Promise<SequenceMetrics> {
    try {
      const sequenceStats: any = await this.kit.getSequenceStats(sequenceId);
      const emails: any = await this.kit.getSequenceEmails(sequenceId);

      // Type guard to ensure sequenceStats has the expected properties
      if (!sequenceStats || typeof sequenceStats !== 'object') {
        throw new Error('Invalid sequence stats data received from Kit API');
      }

      const safeSequenceStats = sequenceStats as any; // Type assertion for now

      const emailPerformance = await Promise.all(
        (emails.emails as Array<{ id?: string }>).map((email: { id?: string }) =>
          this.getEmailMetrics(email.id as string)
        )
      );

      const total_revenue = emailPerformance.reduce(
        (sum, email) => sum + email.revenue_attributed,
        0
      );

      const total_conversions = emailPerformance.reduce((sum, email) => sum + email.conversions, 0);

      const conversion_rate =
        safeSequenceStats.total_subscribers > 0
          ? (total_conversions / safeSequenceStats.total_subscribers) * 100
          : 0;

      return {
        sequence_id: sequenceId,
        sequence_name: safeSequenceStats.name || 'Unknown Sequence',
        total_subscribers: safeSequenceStats.total_subscribers || 0,
        completed_subscribers: safeSequenceStats.completed_subscribers || 0,
        completion_rate:
          safeSequenceStats.total_subscribers > 0
            ? (safeSequenceStats.completed_subscribers / safeSequenceStats.total_subscribers) * 100
            : 0,
        total_revenue,
        conversion_rate: parseFloat(conversion_rate.toFixed(2)),
        average_time_to_convert: await this.getAverageTimeToConvert(sequenceId),
        email_performance: emailPerformance,
      };
    } catch (error) {
      console.error('Error getting sequence metrics:', error);
      throw error;
    }
  }

  // A/B Testing Framework
  async createABTest(config: Omit<ABTestConfig, 'test_id' | 'status'>): Promise<string> {
    try {
      const test_id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const fullConfig: ABTestConfig = {
        ...config,
        test_id,
        status: 'draft',
      };

      this.activeTests.set(test_id, fullConfig);

      // Store test configuration (in production, save to database)
      await this.saveTestConfig(fullConfig);

      console.log(`Created A/B test: ${config.name} (${test_id})`);
      return test_id;
    } catch (error) {
      console.error('Error creating A/B test:', error);
      throw error;
    }
  }

  async startABTest(testId: string): Promise<boolean> {
    try {
      const test = this.activeTests.get(testId);
      if (!test) {
        throw new Error(`Test ${testId} not found`);
      }

      // Validate test configuration
      if (test.variants.length < 2) {
        throw new Error('A/B test requires at least 2 variants');
      }

      const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
      if (totalWeight !== 100) {
        throw new Error('Variant weights must sum to 100');
      }

      // Start the test
      test.status = 'running';
      test.started_at = new Date().toISOString();

      this.activeTests.set(testId, test);
      await this.saveTestConfig(test);

      // In production, you would:
      // 1. Create separate sequences/emails for each variant
      // 2. Set up subscriber allocation logic
      // 3. Start tracking metrics for each variant

      console.log(`Started A/B test: ${test.name}`);
      return true;
    } catch (error) {
      console.error('Error starting A/B test:', error);
      throw error;
    }
  }

  async getABTestResults(testId: string): Promise<ABTestResults> {
    try {
      const test = this.activeTests.get(testId);
      if (!test) {
        throw new Error(`Test ${testId} not found`);
      }

      // Mock results for demonstration (in production, calculate from real data)
      const results: ABTestResults['results'] = test.variants.map(variant => ({
        variant_id: variant.variant_id,
        participants: Math.floor(Math.random() * 1000) + 100,
        metric_value: Math.random() * 30 + 15, // 15-45% metric value
        conversion_rate: Math.random() * 20 + 5, // 5-25% conversion rate
        statistical_significance: Math.random() * 100, // 0-100% significance
      }));

      // Determine winner (highest metric value with >95% confidence)
      const winner = results.reduce((prev, current) =>
        current.statistical_significance > 95 && current.metric_value > prev.metric_value
          ? current
          : prev
      );

      const status =
        test.status === 'completed'
          ? 'completed'
          : test.status === 'running' && winner.statistical_significance > 95
            ? 'completed'
            : 'running';

      return {
        test_id: testId,
        status,
        winner: status === 'completed' ? winner.variant_id : undefined,
        confidence_level: Math.max(...results.map(r => r.statistical_significance)),
        results,
      };
    } catch (error) {
      console.error('Error getting A/B test results:', error);
      throw error;
    }
  }

  // Conversion Funnel Analysis
  async getConversionFunnel(sequenceId?: string): Promise<ConversionFunnel[]> {
    try {
      // Define funnel stages for Audio Intel
      const stages = [
        'Email Subscriber',
        'Email Opened',
        'Email Clicked',
        'Website Visited',
        'Trial Started',
        'Trial Engaged',
        'Converted to Paid',
      ];

      // Mock funnel data (in production, calculate from real metrics)
      let currentCount = 1000; // Starting with 1000 subscribers
      const funnel: ConversionFunnel[] = [];

      for (let i = 0; i < stages.length; i++) {
        const dropOffRate = Math.random() * 0.4 + 0.1; // 10-50% drop-off
        const nextCount = Math.floor(currentCount * (1 - dropOffRate));

        const conversionRate = i === 0 ? 100 : (currentCount / 1000) * 100;
        const actualDropOff = i === 0 ? 0 : ((currentCount - nextCount) / currentCount) * 100;

        funnel.push({
          stage: stages[i],
          count: currentCount,
          conversion_rate: parseFloat(conversionRate.toFixed(2)),
          drop_off_rate: parseFloat(actualDropOff.toFixed(2)),
        });

        currentCount = nextCount;
      }

      return funnel;
    } catch (error) {
      console.error('Error getting conversion funnel:', error);
      throw error;
    }
  }

  // Revenue Attribution
  async getRevenueAttribution(
    startDate: string,
    endDate: string,
    emailId?: string
  ): Promise<RevenueAttribution[]> {
    try {
      // Mock revenue attribution data
      const attributions: RevenueAttribution[] = [];

      for (let i = 0; i < 50; i++) {
        attributions.push({
          email_id: emailId || `email_${Math.floor(Math.random() * 100)}`,
          subscriber_id: `subscriber_${Math.floor(Math.random() * 1000)}`,
          revenue: Math.floor(Math.random() * 500) + 150, // £150-£650
          attributed_at: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          days_from_email: Math.floor(Math.random() * 14) + 1, // 1-14 days
        });
      }

      return attributions.filter(attr => {
        const attrDate = new Date(attr.attributed_at);
        return attrDate >= new Date(startDate) && attrDate <= new Date(endDate);
      });
    } catch (error) {
      console.error('Error getting revenue attribution:', error);
      throw error;
    }
  }

  // Cohort Analysis
  async getCohortAnalysis(cohortType: 'weekly' | 'monthly' = 'monthly'): Promise<{
    cohorts: {
      cohort_date: string;
      subscribers: number;
      retention_rates: number[]; // Week/month 0, 1, 2, 3...
    }[];
  }> {
    try {
      const cohorts = [];
      const periodsBack = cohortType === 'weekly' ? 12 : 6; // 12 weeks or 6 months

      for (let i = periodsBack; i >= 0; i--) {
        const cohortDate = new Date();
        if (cohortType === 'weekly') {
          cohortDate.setDate(cohortDate.getDate() - i * 7);
        } else {
          cohortDate.setMonth(cohortDate.getMonth() - i);
        }

        const subscribers = Math.floor(Math.random() * 200) + 50; // 50-250 subscribers
        const retentionRates = [];

        let retentionRate = 100;
        for (let period = 0; period <= Math.min(i, 11); period++) {
          if (period === 0) {
            retentionRates.push(100);
          } else {
            retentionRate *= 0.85 + Math.random() * 0.1; // 85-95% retention each period
            retentionRates.push(parseFloat(retentionRate.toFixed(2)));
          }
        }

        cohorts.push({
          cohort_date: cohortDate.toISOString().split('T')[0],
          subscribers,
          retention_rates: retentionRates,
        });
      }

      return { cohorts };
    } catch (error) {
      console.error('Error getting cohort analysis:', error);
      throw error;
    }
  }

  // UTM Tracking and Attribution
  async trackUTMConversion(
    email: string,
    utmSource: string,
    utmMedium: string,
    utmCampaign: string,
    utmContent?: string,
    conversionValue?: number
  ): Promise<void> {
    try {
      const conversionData = {
        email,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        conversion_value: conversionValue || 0,
        timestamp: new Date().toISOString(),
      };

      // In production, save to analytics database
      console.log('UTM Conversion tracked:', conversionData);

      // Update subscriber with attribution data
      try {
        const subscriber = await this.kit.getSubscriberByEmail(email);
        await this.kit.updateSubscriberField(subscriber.id!, 'last_utm_campaign', utmCampaign);
        await this.kit.updateSubscriberField(
          subscriber.id!,
          'total_attributed_revenue',
          (subscriber.fields?.total_attributed_revenue || 0) + (conversionValue || 0)
        );
      } catch (error) {
        console.error('Failed to update subscriber attribution:', error);
      }
    } catch (error) {
      console.error('Error tracking UTM conversion:', error);
      throw error;
    }
  }

  // Helper methods
  private async getEmailRevenue(emailId: string): Promise<number> {
    // Mock revenue calculation (in production, integrate with payment system)
    return Math.floor(Math.random() * 1000) + 100;
  }

  private async getEmailConversions(emailId: string): Promise<number> {
    // Mock conversion count
    return Math.floor(Math.random() * 20) + 1;
  }

  private async getAverageTimeToConvert(sequenceId: string): Promise<number> {
    // Mock average time to convert in days
    return Math.floor(Math.random() * 10) + 3; // 3-13 days
  }

  private async saveTestConfig(config: ABTestConfig): Promise<void> {
    // In production, save to database
    console.log(`Saved test config: ${config.test_id}`);
  }

  // Generate comprehensive analytics report
  async generateAnalyticsReport(
    startDate: string,
    endDate: string
  ): Promise<{
    summary: {
      total_emails_sent: number;
      average_open_rate: number;
      average_click_rate: number;
      total_revenue: number;
      conversion_rate: number;
    };
    top_performing_emails: EmailMetrics[];
    sequence_performance: SequenceMetrics[];
    funnel_analysis: ConversionFunnel[];
    revenue_attribution: RevenueAttribution[];
  }> {
    try {
      // Get all sequences
      const sequences = await this.kit.getSequences();

      // Get metrics for each sequence
      const sequencePerformance = await Promise.all(
        sequences.sequences.slice(0, 5).map(seq => this.getSequenceMetrics(seq.id!))
      );

      // Calculate summary metrics
      const allEmails = sequencePerformance.flatMap(seq => seq.email_performance);
      const totalEmailsSent = allEmails.reduce((sum, email) => sum + email.sent_count, 0);
      const averageOpenRate =
        allEmails.length > 0
          ? allEmails.reduce((sum, email) => sum + email.open_rate, 0) / allEmails.length
          : 0;
      const averageClickRate =
        allEmails.length > 0
          ? allEmails.reduce((sum, email) => sum + email.click_rate, 0) / allEmails.length
          : 0;
      const totalRevenue = allEmails.reduce((sum, email) => sum + email.revenue_attributed, 0);
      const totalConversions = allEmails.reduce((sum, email) => sum + email.conversions, 0);
      const conversionRate = totalEmailsSent > 0 ? (totalConversions / totalEmailsSent) * 100 : 0;

      // Get top performing emails
      const topPerformingEmails = allEmails
        .sort((a, b) => b.click_rate - a.click_rate)
        .slice(0, 10);

      return {
        summary: {
          total_emails_sent: totalEmailsSent,
          average_open_rate: parseFloat(averageOpenRate.toFixed(2)),
          average_click_rate: parseFloat(averageClickRate.toFixed(2)),
          total_revenue: totalRevenue,
          conversion_rate: parseFloat(conversionRate.toFixed(2)),
        },
        top_performing_emails: topPerformingEmails,
        sequence_performance: sequencePerformance,
        funnel_analysis: await this.getConversionFunnel(),
        revenue_attribution: await this.getRevenueAttribution(startDate, endDate),
      };
    } catch (error) {
      console.error('Error generating analytics report:', error);
      throw error;
    }
  }
}

export default KitAnalytics;
export type {
  EmailMetrics,
  SequenceMetrics,
  ABTestConfig,
  ABTestResults,
  ConversionFunnel,
  RevenueAttribution,
};

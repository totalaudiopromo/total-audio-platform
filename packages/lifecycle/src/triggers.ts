/**
 * Lifecycle Email Triggers
 * Automated email campaigns based on user lifecycle stage transitions
 * Integrates with ConvertKit for email delivery
 */

import { LifecycleStage, LifecycleTransition } from './stages';
import { EngagementScore, predictChurnRisk, getEngagementTrend } from './scoring';

export interface EmailTrigger {
  id: string;
  name: string;
  fromStage?: LifecycleStage; // Optional - trigger on entering any stage
  toStage: LifecycleStage;
  delayDays: number; // Days after transition to send
  convertKitFormId?: string; // ConvertKit form/sequence to tag
  convertKitTagId?: string; // ConvertKit tag to apply
  enabled: boolean;
}

export interface EmailCampaign {
  triggerId: string;
  userId: string;
  userEmail: string;
  userName: string;
  scheduledAt: Date;
  sentAt?: Date;
  status: 'scheduled' | 'sent' | 'failed' | 'skipped';
  metadata: {
    stage: LifecycleStage;
    engagementScore: number;
    churnRisk?: 'high' | 'medium' | 'low';
  };
}

/**
 * Lifecycle email triggers configuration
 * Maps stage transitions to ConvertKit campaigns
 */
export const EMAIL_TRIGGERS: EmailTrigger[] = [
  // Trial stage triggers
  {
    id: 'trial_welcome',
    name: 'Welcome Email',
    toStage: LifecycleStage.TRIAL,
    delayDays: 0, // Send immediately
    convertKitFormId: process.env.CONVERTKIT_TRIAL_WELCOME_FORM,
    convertKitTagId: process.env.CONVERTKIT_TRIAL_TAG,
    enabled: true,
  },
  {
    id: 'trial_day3_tips',
    name: 'Day 3 - Getting Started Tips',
    toStage: LifecycleStage.TRIAL,
    delayDays: 3,
    convertKitFormId: process.env.CONVERTKIT_TRIAL_TIPS_FORM,
    enabled: true,
  },
  {
    id: 'trial_day7_convert',
    name: 'Day 7 - Upgrade to Pro',
    toStage: LifecycleStage.TRIAL,
    delayDays: 7,
    convertKitFormId: process.env.CONVERTKIT_TRIAL_CONVERT_FORM,
    enabled: true,
  },

  // Active stage triggers
  {
    id: 'active_welcome',
    name: 'Welcome to Pro',
    fromStage: LifecycleStage.TRIAL,
    toStage: LifecycleStage.ACTIVE,
    delayDays: 0,
    convertKitFormId: process.env.CONVERTKIT_ACTIVE_WELCOME_FORM,
    convertKitTagId: process.env.CONVERTKIT_ACTIVE_TAG,
    enabled: true,
  },
  {
    id: 'active_power_tips',
    name: 'Power User Tips',
    toStage: LifecycleStage.ACTIVE,
    delayDays: 14, // 2 weeks after becoming active
    convertKitFormId: process.env.CONVERTKIT_POWER_TIPS_FORM,
    enabled: true,
  },

  // At-risk stage triggers
  {
    id: 'at_risk_engagement',
    name: 'We Miss You - Re-engagement',
    fromStage: LifecycleStage.ACTIVE,
    toStage: LifecycleStage.AT_RISK,
    delayDays: 1,
    convertKitFormId: process.env.CONVERTKIT_AT_RISK_FORM,
    convertKitTagId: process.env.CONVERTKIT_AT_RISK_TAG,
    enabled: true,
  },
  {
    id: 'at_risk_help_offer',
    name: 'Can We Help? - Support Offer',
    toStage: LifecycleStage.AT_RISK,
    delayDays: 5,
    convertKitFormId: process.env.CONVERTKIT_HELP_OFFER_FORM,
    enabled: true,
  },
  {
    id: 'at_risk_win_back',
    name: 'Special Offer - Win Back',
    toStage: LifecycleStage.AT_RISK,
    delayDays: 10,
    convertKitFormId: process.env.CONVERTKIT_WIN_BACK_FORM,
    enabled: true,
  },

  // Churned stage triggers
  {
    id: 'churned_survey',
    name: 'Exit Survey - Feedback Request',
    toStage: LifecycleStage.CHURNED,
    delayDays: 2,
    convertKitFormId: process.env.CONVERTKIT_CHURNED_SURVEY_FORM,
    convertKitTagId: process.env.CONVERTKIT_CHURNED_TAG,
    enabled: true,
  },
  {
    id: 'churned_quarterly_check',
    name: 'Quarterly Check-in',
    toStage: LifecycleStage.CHURNED,
    delayDays: 90,
    convertKitFormId: process.env.CONVERTKIT_CHURNED_CHECKIN_FORM,
    enabled: true,
  },

  // Reactivated stage triggers
  {
    id: 'reactivated_welcome_back',
    name: 'Welcome Back!',
    fromStage: LifecycleStage.CHURNED,
    toStage: LifecycleStage.REACTIVATED,
    delayDays: 0,
    convertKitFormId: process.env.CONVERTKIT_REACTIVATED_FORM,
    convertKitTagId: process.env.CONVERTKIT_REACTIVATED_TAG,
    enabled: true,
  },
];

/**
 * Determine which email triggers should fire for a transition
 */
export function getTriggersForTransition(transition: LifecycleTransition): EmailTrigger[] {
  return EMAIL_TRIGGERS.filter(trigger => {
    if (!trigger.enabled) return false;

    // Check if trigger matches this transition
    const matchesTo = trigger.toStage === transition.to;
    const matchesFrom = !trigger.fromStage || trigger.fromStage === transition.from;

    return matchesTo && matchesFrom;
  });
}

/**
 * Schedule email campaigns for a lifecycle transition
 */
export function scheduleEmailCampaigns(
  transition: LifecycleTransition,
  user: {
    id: string;
    email: string;
    name: string;
  },
  engagementScore: EngagementScore
): EmailCampaign[] {
  const triggers = getTriggersForTransition(transition);
  const campaigns: EmailCampaign[] = [];

  for (const trigger of triggers) {
    const scheduledAt = new Date(transition.timestamp);
    scheduledAt.setDate(scheduledAt.getDate() + trigger.delayDays);

    campaigns.push({
      triggerId: trigger.id,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      scheduledAt,
      status: 'scheduled',
      metadata: {
        stage: transition.to,
        engagementScore: engagementScore.score,
        churnRisk: predictChurnRisk(
          engagementScore.score,
          'stable', // Would need historical data for actual trend
          0 // Would need actual days since last activity
        ),
      },
    });
  }

  return campaigns;
}

/**
 * ConvertKit API integration
 */
export class ConvertKitClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://api.convertkit.com/v3';

  constructor(apiKey?: string, apiSecret?: string) {
    this.apiKey = apiKey || process.env.CONVERTKIT_API_KEY || '';
    this.apiSecret = apiSecret || process.env.CONVERTKIT_API_SECRET || '';

    if (!this.apiKey || !this.apiSecret) {
      console.warn('ConvertKit API credentials not configured');
    }
  }

  /**
   * Add subscriber to ConvertKit form
   */
  async addSubscriberToForm(
    formId: string,
    subscriber: {
      email: string;
      firstName?: string;
      fields?: Record<string, string>;
    }
  ): Promise<{ success: boolean; subscriberId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          email: subscriber.email,
          first_name: subscriber.firstName,
          fields: subscriber.fields,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      const data = await response.json();
      return { success: true, subscriberId: data.subscription.subscriber.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Add tag to subscriber
   */
  async addTagToSubscriber(
    subscriberId: string,
    tagId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/tags/${tagId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          email: subscriberId, // Can use email or subscriber ID
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Remove tag from subscriber
   */
  async removeTagFromSubscriber(
    subscriberId: string,
    tagId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/tags/${tagId}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: this.apiSecret,
          email: subscriberId,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Execute email campaign by triggering ConvertKit
 */
export async function executeCampaign(
  campaign: EmailCampaign,
  trigger: EmailTrigger,
  convertKit: ConvertKitClient
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Add subscriber to ConvertKit form (triggers automation)
    if (trigger.convertKitFormId) {
      const formResult = await convertKit.addSubscriberToForm(trigger.convertKitFormId, {
        email: campaign.userEmail,
        firstName: campaign.userName,
        fields: {
          lifecycle_stage: campaign.metadata.stage,
          engagement_score: campaign.metadata.engagementScore.toString(),
          churn_risk: campaign.metadata.churnRisk || 'low',
        },
      });

      if (!formResult.success) {
        return { success: false, error: formResult.error };
      }

      // Apply tag if configured
      if (trigger.convertKitTagId && formResult.subscriberId) {
        const tagResult = await convertKit.addTagToSubscriber(
          formResult.subscriberId,
          trigger.convertKitTagId
        );

        if (!tagResult.success) {
          console.warn(`Failed to apply tag ${trigger.convertKitTagId}:`, tagResult.error);
        }
      }

      return { success: true };
    }

    return { success: false, error: 'No ConvertKit form configured for trigger' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Process scheduled campaigns that are due to be sent
 */
export async function processPendingCampaigns(
  campaigns: EmailCampaign[],
  convertKit: ConvertKitClient
): Promise<{
  sent: number;
  failed: number;
  errors: Array<{ campaignId: string; error: string }>;
}> {
  const now = new Date();
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as Array<{ campaignId: string; error: string }>,
  };

  for (const campaign of campaigns) {
    // Skip campaigns not yet due or already processed
    if (campaign.scheduledAt > now || campaign.status !== 'scheduled') {
      continue;
    }

    // Find the trigger configuration
    const trigger = EMAIL_TRIGGERS.find(t => t.id === campaign.triggerId);
    if (!trigger) {
      results.failed++;
      results.errors.push({
        campaignId: campaign.triggerId,
        error: 'Trigger configuration not found',
      });
      continue;
    }

    // Execute campaign
    const result = await executeCampaign(campaign, trigger, convertKit);

    if (result.success) {
      campaign.status = 'sent';
      campaign.sentAt = new Date();
      results.sent++;
    } else {
      campaign.status = 'failed';
      results.failed++;
      results.errors.push({
        campaignId: campaign.triggerId,
        error: result.error || 'Unknown error',
      });
    }
  }

  return results;
}

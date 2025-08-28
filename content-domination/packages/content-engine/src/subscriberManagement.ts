/**
 * Audio Intel - Advanced Subscriber Management System
 * Handles segmentation, tagging, and lifecycle management
 */

import KitApi, { KitSubscriber } from './kitApi';

interface SegmentCriteria {
  tags?: string[];
  custom_fields?: Record<string, any>;
  engagement_score?: {
    min?: number;
    max?: number;
  };
  signup_date?: {
    after?: string;
    before?: string;
  };
  last_activity?: {
    after?: string;
    before?: string;
  };
}

interface BehaviorPattern {
  name: string;
  conditions: SegmentCriteria;
  actions: {
    add_tags?: string[];
    remove_tags?: string[];
    trigger_sequence?: string;
    update_fields?: Record<string, any>;
  };
}

interface EngagementScore {
  email_opens: number;
  email_clicks: number;
  website_visits: number;
  feature_usage: number;
  trial_activity: number;
  total_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

class AudioIntelSubscriberManager {
  private kit: KitApi;
  
  // Predefined segments for Audio Intel
  private readonly SEGMENTS = {
    TRIAL_USERS: {
      name: 'Active Trial Users',
      criteria: { tags: ['trial_user'] }
    },
    POWER_USERS: {
      name: 'Power Users (100+ enrichments)',
      criteria: { 
        tags: ['power_user'],
        custom_fields: { enrichments_used: { $gte: 100 } }
      }
    },
    HIGH_ENGAGEMENT: {
      name: 'High Engagement Subscribers',
      criteria: { 
        tags: ['high_engager'],
        engagement_score: { min: 80 }
      }
    },
    MUSIC_PR_AGENCIES: {
      name: 'Music PR Agencies',
      criteria: { tags: ['music_pr_agency'] }
    },
    UK_MARKET: {
      name: 'UK Market Subscribers',
      criteria: { tags: ['uk_market'] }
    },
    CHURNED_USERS: {
      name: 'Churned Users for Winback',
      criteria: { tags: ['churned_user'] }
    }
  };

  // Behavior patterns for automatic tagging
  private readonly BEHAVIOR_PATTERNS: BehaviorPattern[] = [
    {
      name: 'High Engagement Pattern',
      conditions: {
        engagement_score: { min: 80 }
      },
      actions: {
        add_tags: ['high_engager', 'vip_subscriber'],
        remove_tags: ['low_engager']
      }
    },
    {
      name: 'Low Engagement Pattern',
      conditions: {
        engagement_score: { max: 20 },
        last_activity: { before: '30 days ago' }
      },
      actions: {
        add_tags: ['low_engager', 're_engagement_needed'],
        remove_tags: ['high_engager']
      }
    },
    {
      name: 'Power User Pattern',
      conditions: {
        custom_fields: { enrichments_used: { $gte: 100 } }
      },
      actions: {
        add_tags: ['power_user', 'high_value'],
        trigger_sequence: 'power_user_upsell'
      }
    },
    {
      name: 'Trial to Paid Conversion',
      conditions: {
        tags: ['paid_user_enterprise'],
        custom_fields: { trial_end_date: { $exists: true } }
      },
      actions: {
        remove_tags: ['trial_user', 'trial_sequence'],
        add_tags: ['converted_user', 'onboarding_sequence']
      }
    }
  ];

  constructor(apiKey: string) {
    this.kit = new KitApi(apiKey);
  }

  // Get subscribers with advanced filtering
  async getSegmentedSubscribers(criteria: SegmentCriteria): Promise<KitSubscriber[]> {
    try {
      let subscribers: KitSubscriber[] = [];
      let page = 1;
      let hasMore = true;

      // Get all subscribers (paginated)
      while (hasMore) {
        const response = await this.kit.getSubscribers({
          page,
          limit: 100,
          state: 'active'
        });

        if (response.subscribers.length === 0) {
          hasMore = false;
        } else {
          subscribers = subscribers.concat(response.subscribers);
          page++;
        }
      }

      // Filter subscribers based on criteria
      return subscribers.filter(subscriber => this.matchesCriteria(subscriber, criteria));

    } catch (error) {
      console.error('Error getting segmented subscribers:', error);
      throw error;
    }
  }

  // Check if subscriber matches criteria
  private matchesCriteria(subscriber: KitSubscriber, criteria: SegmentCriteria): boolean {
    // Check tags
    if (criteria.tags) {
      const subscriberTags = subscriber.tags || [];
      const hasRequiredTags = criteria.tags.every(tag => subscriberTags.includes(tag));
      if (!hasRequiredTags) return false;
    }

    // Check custom fields
    if (criteria.custom_fields) {
      for (const [field, condition] of Object.entries(criteria.custom_fields)) {
        const fieldValue = subscriber.fields?.[field];
        if (!this.matchesFieldCondition(fieldValue, condition)) {
          return false;
        }
      }
    }

    // Check date conditions
    if (criteria.signup_date) {
      const createdAt = new Date(subscriber.created_at || '');
      if (criteria.signup_date.after && createdAt < new Date(criteria.signup_date.after)) {
        return false;
      }
      if (criteria.signup_date.before && createdAt > new Date(criteria.signup_date.before)) {
        return false;
      }
    }

    return true;
  }

  private matchesFieldCondition(fieldValue: any, condition: any): boolean {
    if (typeof condition === 'object') {
      if (condition.$gte && fieldValue < condition.$gte) return false;
      if (condition.$lte && fieldValue > condition.$lte) return false;
      if (condition.$exists && (fieldValue === undefined) !== !condition.$exists) return false;
    } else {
      return fieldValue === condition;
    }
    return true;
  }

  // Calculate engagement score for a subscriber
  async calculateEngagementScore(subscriberId: string): Promise<EngagementScore> {
    try {
      // In a real implementation, you'd fetch email stats from Kit.com
      // For now, we'll use mock data structure
      
      const mockEngagement = {
        email_opens: Math.floor(Math.random() * 20), // 0-20 opens
        email_clicks: Math.floor(Math.random() * 10), // 0-10 clicks
        website_visits: Math.floor(Math.random() * 15), // 0-15 visits
        feature_usage: Math.floor(Math.random() * 25), // 0-25 feature uses
        trial_activity: Math.floor(Math.random() * 10) // 0-10 trial activities
      };

      // Calculate weighted score
      const score = 
        (mockEngagement.email_opens * 2) +
        (mockEngagement.email_clicks * 5) +
        (mockEngagement.website_visits * 3) +
        (mockEngagement.feature_usage * 4) +
        (mockEngagement.trial_activity * 6);

      // Assign grade based on score
      let grade: 'A' | 'B' | 'C' | 'D' | 'F';
      if (score >= 200) grade = 'A';
      else if (score >= 150) grade = 'B';
      else if (score >= 100) grade = 'C';
      else if (score >= 50) grade = 'D';
      else grade = 'F';

      return {
        ...mockEngagement,
        total_score: score,
        grade
      };

    } catch (error) {
      console.error('Error calculating engagement score:', error);
      throw error;
    }
  }

  // Auto-tag subscribers based on behavior patterns
  async processSubscriberBehaviors(subscriberIds?: string[]): Promise<void> {
    try {
      let subscribers: KitSubscriber[];

      if (subscriberIds) {
        // Process specific subscribers
        subscribers = await Promise.all(
          subscriberIds.map(async id => {
            try {
              return await this.kit.getSubscribers({ limit: 1 });
            } catch {
              return null;
            }
          })
        ).then(results =>
          (results.filter(Boolean) as Array<{ subscribers: KitSubscriber[] }>)
            .flat()
            .map(r => r.subscribers)
            .flat()
        );
      } else {
        // Process all active subscribers
        const response = await this.kit.getSubscribers({ state: 'active', limit: 1000 });
        subscribers = response.subscribers;
      }

      for (const subscriber of subscribers) {
        if (!subscriber.id) continue;

        // Calculate engagement score
        const engagement = await this.calculateEngagementScore(subscriber.id);

        // Check each behavior pattern
        for (const pattern of this.BEHAVIOR_PATTERNS) {
          const matchesCriteria = this.matchesCriteria(
            { ...subscriber, fields: { ...subscriber.fields, engagementScore: engagement.total_score } }, 
            pattern.conditions
          );

          if (matchesCriteria) {
            await this.executeBehaviorActions(subscriber.id, pattern.actions);
            console.log(`Applied pattern "${pattern.name}" to ${subscriber.email_address}`);
          }
        }

        // Update engagement score in custom fields
        await this.kit.updateSubscriberField(subscriber.id, 'engagement_score', engagement.total_score);
        await this.kit.updateSubscriberField(subscriber.id, 'engagement_grade', engagement.grade);
      }

    } catch (error) {
      console.error('Error processing subscriber behaviors:', error);
      throw error;
    }
  }

  private async executeBehaviorActions(subscriberId: string, actions: BehaviorPattern['actions']) {
    try {
      if (actions.add_tags) {
        await this.kit.addTagsToSubscriber(subscriberId, actions.add_tags);
      }

      if (actions.remove_tags) {
        await this.kit.removeTagsFromSubscriber(subscriberId, actions.remove_tags);
      }

      if (actions.trigger_sequence) {
        const sequences = await this.kit.getSequences();
        const sequence = sequences.sequences.find(s => s.name.includes(actions.trigger_sequence!));
        if (sequence?.id) {
          await this.kit.subscribeToSequence(sequence.id, subscriberId);
        }
      }

      if (actions.update_fields) {
        for (const [field, value] of Object.entries(actions.update_fields)) {
          await this.kit.updateSubscriberField(subscriberId, field, value);
        }
      }

    } catch (error) {
      console.error('Error executing behavior actions:', error);
    }
  }

  // Lifecycle management - handle trial expiration
  async processTrialExpirations(): Promise<void> {
    try {
      // Get all trial users
      const trialUsers = await this.getSegmentedSubscribers({
        tags: ['trial_user']
      });

      const today = new Date();

      for (const user of trialUsers) {
        if (!user.id || !user.fields?.trial_end_date) continue;

        const trialEndDate = new Date(user.fields.trial_end_date);
        const daysUntilExpiry = Math.ceil(
          (trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry <= 0) {
          // Trial expired
          await this.handleTrialExpiration(user.id);
          console.log(`Trial expired for: ${user.email_address}`);
        } else if (daysUntilExpiry === 1) {
          // Final reminder
          await this.kit.addTagsToSubscriber(user.id, ['trial_expiring_today']);
          console.log(`Final trial reminder for: ${user.email_address}`);
        } else if (daysUntilExpiry === 3) {
          // 3-day reminder
          await this.kit.addTagsToSubscriber(user.id, ['trial_expiring_soon']);
          console.log(`3-day trial reminder for: ${user.email_address}`);
        }
      }

    } catch (error) {
      console.error('Error processing trial expirations:', error);
      throw error;
    }
  }

  private async handleTrialExpiration(subscriberId: string) {
    try {
      // Check if they converted to paid
      const subscriber = await this.kit.getSubscribers({ limit: 1 });
      const user = subscriber.subscribers.find(s => s.id === subscriberId);
      
      if (user?.tags?.some(tag => tag.startsWith('paid_user'))) {
        // Converted to paid - remove trial tags
        await this.kit.removeTagsFromSubscriber(subscriberId, [
          'trial_user', 
          'trial_sequence',
          'trial_expiring_soon',
          'trial_expiring_today'
        ]);
        
        await this.kit.addTagsToSubscriber(subscriberId, [
          'converted_user',
          'onboarding_sequence'
        ]);
        
      } else {
        // Didn't convert - move to winback
        await this.kit.removeTagsFromSubscriber(subscriberId, [
          'trial_user', 
          'trial_sequence'
        ]);
        
        await this.kit.addTagsToSubscriber(subscriberId, [
          'churned_user',
          'winback_sequence'
        ]);
      }

    } catch (error) {
      console.error('Error handling trial expiration:', error);
    }
  }

  // Clean up inactive subscribers (GDPR compliance)
  async cleanupInactiveSubscribers(daysInactive: number = 730): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

      const inactiveSubscribers = await this.getSegmentedSubscribers({
        tags: ['low_engager'],
        last_activity: { before: cutoffDate.toISOString() }
      });

      let cleanedCount = 0;

      for (const subscriber of inactiveSubscribers) {
        if (!subscriber.id) continue;

        // First, send reactivation email
        await this.kit.addTagsToSubscriber(subscriber.id, ['reactivation_attempt']);
        
        // Wait 30 days, then check if they engaged
        // In production, this would be handled by a scheduled job
        
        // For now, we'll just tag for manual review
        await this.kit.addTagsToSubscriber(subscriber.id, ['cleanup_candidate']);
        cleanedCount++;
      }

      console.log(`Processed ${cleanedCount} inactive subscribers for cleanup`);
      return cleanedCount;

    } catch (error) {
      console.error('Error cleaning up inactive subscribers:', error);
      throw error;
    }
  }

  // Generate subscriber insights report
  async generateInsightsReport(): Promise<{
    total_subscribers: number;
    segments: Record<string, number>;
    engagement_distribution: Record<string, number>;
    conversion_metrics: {
      trial_to_paid_rate: number;
      average_trial_length: number;
      churn_rate: number;
    };
  }> {
    try {
      const allSubscribers = await this.kit.getSubscribers({ limit: 5000 });
      const total = allSubscribers.subscribers.length;

      // Count segments
      const segments: Record<string, number> = {};
      for (const [key, segment] of Object.entries(this.SEGMENTS)) {
        const segmentSubscribers = await this.getSegmentedSubscribers(segment.criteria);
        segments[segment.name] = segmentSubscribers.length;
      }

      // Engagement distribution
      const engagement_distribution: Record<string, number> = {
        'A (High)': 0,
        'B (Good)': 0,
        'C (Average)': 0,
        'D (Low)': 0,
        'F (Very Low)': 0
      };

      for (const subscriber of allSubscribers.subscribers) {
        if (!subscriber.id) continue;
        const engagement = await this.calculateEngagementScore(subscriber.id);
        engagement_distribution[`${engagement.grade} (${this.getGradeLabel(engagement.grade)})`]++;
      }

      // Mock conversion metrics (in production, calculate from actual data)
      const conversion_metrics = {
        trial_to_paid_rate: 0.15, // 15%
        average_trial_length: 12.5, // days
        churn_rate: 0.08 // 8%
      };

      return {
        total_subscribers: total,
        segments,
        engagement_distribution,
        conversion_metrics
      };

    } catch (error) {
      console.error('Error generating insights report:', error);
      throw error;
    }
  }

  private getGradeLabel(grade: string): string {
    const labels = {
      'A': 'High',
      'B': 'Good', 
      'C': 'Average',
      'D': 'Low',
      'F': 'Very Low'
    };
    return labels[grade as keyof typeof labels] || 'Unknown';
  }

  // Mass update subscribers with specific criteria
  async massUpdateSubscribers(
    criteria: SegmentCriteria,
    updates: {
      add_tags?: string[];
      remove_tags?: string[];
      update_fields?: Record<string, any>;
    }
  ): Promise<number> {
    try {
      const subscribers = await this.getSegmentedSubscribers(criteria);
      let updatedCount = 0;

      for (const subscriber of subscribers) {
        if (!subscriber.id) continue;

        if (updates.add_tags) {
          await this.kit.addTagsToSubscriber(subscriber.id, updates.add_tags);
        }

        if (updates.remove_tags) {
          await this.kit.removeTagsFromSubscriber(subscriber.id, updates.remove_tags);
        }

        if (updates.update_fields) {
          for (const [field, value] of Object.entries(updates.update_fields)) {
            await this.kit.updateSubscriberField(subscriber.id, field, value);
          }
        }

        updatedCount++;
      }

      console.log(`Mass updated ${updatedCount} subscribers`);
      return updatedCount;

    } catch (error) {
      console.error('Error in mass update:', error);
      throw error;
    }
  }
}

export default AudioIntelSubscriberManager;
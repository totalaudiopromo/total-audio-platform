/**
 * Unified ConvertKit Service
 * Consolidates all ConvertKit operations into a single, reusable service
 * Reduces code duplication by 300+ lines across multiple files
 */

import { getEnv } from '@/lib/env';

interface ConvertKitConfig {
  apiKey: string | null;
  apiSecret?: string | null;
}

interface SubscriptionData {
  email: string;
  firstName?: string;
  formId?: string;
  tags?: string[];
  fields?: Record<string, any>;
}

interface CustomEventData {
  event: string;
  email: string;
  properties?: Record<string, any>;
}

export class ConvertKitService {
  private config: ConvertKitConfig;

  // Form and tag mapping for consistency
  static readonly FORMS = {
    ENTERPRISE_TRIAL: '8440957',
    PRICING: '8405293',
    NEWSLETTER: '8405293',
    BETA: '8440957'
  } as const;

  static readonly TAGS = {
    BETA_USER: '9942888',
    FREE_TRIAL: '9961566',
    LIFETIME_DISCOUNT: '9890548',
    BETA_PAGE_SIGNUP: '10182442',
    NEWSLETTER: '10182443',
    TRIAL_USER: 'trial_user',
    WEBSITE_SIGNUP: 'website_signup',
    PRICING_INTEREST: 'pricing_interest',
    DEMO_REQUEST: 'demo_request'
  } as const;

  constructor() {
    this.config = {
      apiKey: getEnv('CONVERTKIT_API_KEY', { requiredInProd: false }),
      apiSecret: getEnv('CONVERTKIT_API_SECRET', { requiredInProd: false })
    };
  }

  /**
   * Subscribe user to ConvertKit form with automatic tagging
   */
  async subscribe(data: SubscriptionData): Promise<{ success: boolean; subscriberId?: string; error?: string }> {
    try {
      if (!this.config.apiKey) {
        throw new Error('ConvertKit API key not configured');
      }

      const formId = data.formId || ConvertKitService.FORMS.ENTERPRISE_TRIAL;

      const payload = {
        api_key: this.config.apiKey,
        email: data.email,
        first_name: data.firstName || '',
        fields: {
          signup_timestamp: new Date().toISOString(),
          ...data.fields
        }
      };

      console.log(`🔄 Subscribing ${data.email} to ConvertKit form ${formId}`);

      const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ ConvertKit subscription failed:`, errorText);
        throw new Error(`Subscription failed: ${response.status}`);
      }

      const result = await response.json();
      const subscriberId = result.subscription?.subscriber?.id;

      console.log(`✅ Successfully subscribed ${data.email} to ConvertKit`);

      // Add tags if provided
      if (data.tags?.length && subscriberId) {
        await this.addTags(data.email, data.tags);
      }

      return {
        success: true,
        subscriberId
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('ConvertKit subscription error:', error);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Add tags to a subscriber
   */
  async addTags(email: string, tags: string[]): Promise<void> {
    if (!this.config.apiSecret) {
      console.warn('ConvertKit API secret not configured - skipping tags');
      return;
    }

    for (const tag of tags) {
      try {
        const tagId = this.getTagId(tag);
        if (!tagId) {
          console.warn(`❌ Unknown tag: ${tag} - skipping`);
          continue;
        }

        const response = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_secret: this.config.apiSecret,
            email
          })
        });

        if (response.ok) {
          console.log(`✅ Tagged ${email} with: ${tag}`);
        } else {
          console.warn(`❌ Failed to tag ${email} with: ${tag}`);
        }
      } catch (error) {
        console.warn(`❌ Error tagging ${email} with ${tag}:`, error);
      }
    }
  }

  /**
   * Track custom events (logged for analytics)
   */
  async trackEvent(data: CustomEventData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📊 ConvertKit event tracked:', {
        event: data.event,
        email: data.email,
        properties: data.properties,
        timestamp: new Date().toISOString()
      });

      // In future: integrate with analytics platforms here
      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('ConvertKit event tracking error:', error);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get form ID based on type
   */
  getFormId(type: 'hero' | 'pricing' | 'demo' | 'newsletter' | 'beta'): string {
    switch (type) {
      case 'hero':
      case 'beta':
        return ConvertKitService.FORMS.ENTERPRISE_TRIAL;
      case 'pricing':
      case 'newsletter':
        return ConvertKitService.FORMS.PRICING;
      default:
        return ConvertKitService.FORMS.ENTERPRISE_TRIAL;
    }
  }

  /**
   * Get tag ID from tag name
   */
  private getTagId(tagName: string): string | null {
    const tagKey = tagName.toUpperCase().replace(/[^A-Z0-9]/g, '_') as keyof typeof ConvertKitService.TAGS;
    return ConvertKitService.TAGS[tagKey] || null;
  }

  /**
   * Get tags for form type
   */
  getTagsForFormType(formType: string): string[] {
    switch (formType) {
      case 'hero':
        return ['TRIAL_USER', 'WEBSITE_SIGNUP'];
      case 'pricing':
        return ['PRICING_INTEREST'];
      case 'demo':
        return ['DEMO_REQUEST'];
      case 'beta':
        return ['BETA_USER', 'BETA_PAGE_SIGNUP'];
      case 'newsletter':
        return ['NEWSLETTER'];
      default:
        return ['WEBSITE_SIGNUP'];
    }
  }
}

// Export singleton instance
export const convertKit = new ConvertKitService();

// Helper functions for backward compatibility
export async function subscribeToConvertKit(
  email: string,
  firstName?: string,
  formId?: string,
  tags?: string[]
) {
  return convertKit.subscribe({ email, firstName, formId, tags });
}

export async function trackConvertKitEvent(
  event: string,
  email: string,
  properties?: Record<string, any>
) {
  return convertKit.trackEvent({ event, email, properties });
}
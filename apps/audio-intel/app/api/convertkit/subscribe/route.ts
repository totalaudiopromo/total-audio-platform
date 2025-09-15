/**
 * ConvertKit Subscription Handler
 * Creates and manages subscribers via ConvertKit API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

const CONVERTKIT_API_KEY = getEnv('CONVERTKIT_API_KEY', { requiredInProd: false });
const CONVERTKIT_API_SECRET = getEnv('CONVERTKIT_API_SECRET', { requiredInProd: false });

interface SubscribeRequest {
  subscriber: {
    email_address: string;
    first_name?: string;
    state?: 'active' | 'unsubscribed' | 'cancelled' | 'unconfirmed' | 'bounced' | 'complained';
    tags: string[];
    fields: Record<string, any>;
  };
  form_type: 'hero' | 'pricing' | 'demo' | 'content';
}

export async function POST(request: NextRequest) {
  try {
    const { subscriber, form_type }: SubscribeRequest = await request.json();
    
    console.log(`Processing ConvertKit subscription for: ${subscriber.email_address} via ${form_type} form`);
    
    // Validate required fields
    if (!subscriber.email_address) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Determine which form to use based on form type
    let formId: string;
    switch (form_type) {
      case 'hero':
        formId = process.env.CONVERTKIT_ENTERPRISE_TRIAL_FORM_ID || '8440957';
        break;
      case 'pricing':
        formId = process.env.CONVERTKIT_PRICING_FORM_ID || '8405293';
        break;
      default:
        formId = process.env.CONVERTKIT_ENTERPRISE_TRIAL_FORM_ID || '8440957';
    }

    // Prepare subscriber data for ConvertKit
    const convertkitData = {
      email: subscriber.email_address,
      first_name: subscriber.first_name || '',
      fields: {
        company_name: subscriber.fields?.company_name || '',
        industry_role: subscriber.fields?.industry_role || 'independent_artist',
        lead_source: form_type,
        signup_date: new Date().toISOString(),
        trial_start_date: form_type === 'hero' ? new Date().toISOString() : undefined,
        trial_end_date: form_type === 'hero' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : undefined
      }
    };

    // Subscribe to ConvertKit form
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        ...convertkitData
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ConvertKit API error:', errorText);
      throw new Error(`ConvertKit subscription failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Successfully subscribed to ConvertKit: ${subscriber.email_address}`);

    // Add tags based on form type
    await addConvertKitTags(subscriber.email_address, form_type, result.subscription.id);

    // Subscribe to the main sequence for trial users
    if (form_type === 'hero') {
      await subscribeToSequence(subscriber.email_address);
    }

    // Log successful subscription
    await logSubscriptionEvent(subscriber.email_address, form_type, result.subscription.id);

    return NextResponse.json({
      success: true,
      subscription_id: result.subscription.id,
      message: 'Successfully subscribed to ConvertKit'
    });

  } catch (error) {
    console.error('ConvertKit subscription processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Subscription failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function addConvertKitTags(email: string, formType: string, subscriptionId: string) {
  try {
    const tags = getTagsForFormType(formType);
    
    for (const tag of tags) {
      await fetch(`https://api.convertkit.com/v3/subscriptions/${subscriptionId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          tag_id: tag
        })
      });
    }

    console.log(`Added tags to ConvertKit subscriber: ${email}`);
  } catch (error) {
    console.error('Failed to add ConvertKit tags:', error);
  }
}

async function subscribeToSequence(email: string) {
  try {
    const sequenceId = '2453581'; // Your main sequence ID
    
    const response = await fetch(`https://api.convertkit.com/v3/courses/${sequenceId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email
      })
    });

    if (response.ok) {
      console.log(`Successfully subscribed ${email} to sequence ${sequenceId}`);
    } else {
      console.error(`Failed to subscribe ${email} to sequence: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to subscribe to sequence:', error);
  }
}

function getTagsForFormType(formType: string): string[] {
  switch (formType) {
    case 'hero':
      return ['trial_user', 'website_signup', 'homepage_signup'];
    case 'pricing':
      return ['pricing_interest', 'comparison_shopping'];
    case 'demo':
      return ['demo_request', 'high_intent'];
    case 'content':
      return ['content_download', 'education_focused'];
    default:
      return ['website_signup'];
  }
}

async function logSubscriptionEvent(
  email: string, 
  formType: string, 
  subscriptionId: string
) {
  try {
    console.log('ConvertKit subscription event logged:', {
      email,
      form_type: formType,
      subscription_id: subscriptionId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log subscription event:', error);
  }
}

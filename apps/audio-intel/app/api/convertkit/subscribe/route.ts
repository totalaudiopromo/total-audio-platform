/**
 * Enhanced ConvertKit Subscription Handler
 * Reduced from 194 lines to 45 lines using unified service
 */

import { NextRequest, NextResponse } from 'next/server';
import { convertKit } from '@/lib/convertkit';

interface SubscribeRequest {
  subscriber: {
    email_address: string;
    first_name?: string;
    tags: string[];
    fields: Record<string, any>;
  };
  form_type: 'hero' | 'pricing' | 'demo' | 'newsletter' | 'beta';
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { subscriber, form_type }: SubscribeRequest = await request.json();

    if (!subscriber.email_address) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const formId = convertKit.getFormId(form_type);
    const tags = convertKit.getTagsForFormType(form_type);

    const result = await convertKit.subscribe({
      email: subscriber.email_address,
      firstName: subscriber.first_name,
      formId,
      tags,
      fields: {
        ...subscriber.fields,
        lead_source: form_type,
        signup_date: new Date().toISOString(),
        trial_start_date: form_type === 'hero' ? new Date().toISOString() : undefined,
        trial_end_date:
          form_type === 'hero'
            ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
      },
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json(
      {
        success: true,
        subscription_id: result.subscriberId,
        message: 'Successfully subscribed to ConvertKit',
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return NextResponse.json(
      {
        error: 'Subscription failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

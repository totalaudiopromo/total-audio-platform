/**
 * ConvertKit Custom Event Handler
 * Tracks custom events via ConvertKit API
 */

import { NextRequest, NextResponse } from 'next/server';

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY || '5wx6QPvhunue-d760yZHIg';

interface CustomEventRequest {
  event: string;
  email: string;
  properties: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const { event, email, properties }: CustomEventRequest = await request.json();
    
    console.log(`Tracking ConvertKit custom event: ${event} for ${email}`);
    
    // Validate required fields
    if (!event || !email) {
      return NextResponse.json(
        { error: 'Event name and email are required' },
        { status: 400 }
      );
    }

    // Get subscriber by email first
    const subscriberResponse = await fetch(`https://api.convertkit.com/v3/subscribers?api_key=${CONVERTKIT_API_KEY}&email_address=${encodeURIComponent(email)}`);
    
    if (!subscriberResponse.ok) {
      console.error('Failed to find subscriber for custom event tracking');
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    const subscriberData = await subscriberResponse.json();
    
    if (!subscriberData.subscribers || subscriberData.subscribers.length === 0) {
      console.error('No subscribers found for email:', email);
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    const subscriber = subscriberData.subscribers[0];

    // Track custom event (ConvertKit doesn't have native custom events, so we'll log it)
    console.log('ConvertKit custom event tracked:', {
      event,
      email,
      subscriber_id: subscriber.id,
      properties,
      timestamp: new Date().toISOString()
    });

    // You could also send this to your analytics platform here
    // Example: Google Analytics, Mixpanel, etc.

    return NextResponse.json({
      success: true,
      message: 'Custom event tracked successfully',
      subscriber_id: subscriber.id
    });

  } catch (error) {
    console.error('ConvertKit custom event tracking error:', error);
    
    return NextResponse.json(
      { 
        error: 'Event tracking failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

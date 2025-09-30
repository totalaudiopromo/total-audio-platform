/**
 * Simplified ConvertKit Custom Event Handler
 * Reduced from 83 lines to 25 lines using unified service
 */

import { NextRequest, NextResponse } from 'next/server';
import { convertKit } from '@/lib/convertkit';

interface CustomEventRequest {
  event: string;
  email: string;
  properties: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const { event, email, properties }: CustomEventRequest = await request.json();

    if (!event || !email) {
      return NextResponse.json({ error: 'Event name and email are required' }, { status: 400 });
    }

    const result = await convertKit.trackEvent({ event, email, properties });

    return NextResponse.json({
      success: true,
      message: 'Custom event tracked successfully'
    });

  } catch (error) {
    console.error('ConvertKit event tracking error:', error);
    return NextResponse.json({
      error: 'Event tracking failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

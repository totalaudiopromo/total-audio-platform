/**
 * Simplified ConvertKit API Route
 * Reduced from 115 lines to 35 lines using unified service
 */

import { NextRequest, NextResponse } from 'next/server';
import { convertKit } from '@/lib/convertkit';

export async function POST(req: NextRequest) {
  try {
    const { email, first_name, form_id, tags = [], fields = {} } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await convertKit.subscribe({
      email,
      firstName: first_name,
      formId: form_id,
      tags,
      fields
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to beta access - welcome email sent!',
      subscriber_id: result.subscriberId
    });

  } catch (error) {
    console.error('ConvertKit API error:', error);
    return NextResponse.json({
      error: 'Failed to process subscription'
    }, { status: 500 });
  }
}

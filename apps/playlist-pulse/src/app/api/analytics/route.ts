import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // Log the analytics event
    console.log('Analytics Event:', {
      event,
      data,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    });

    // Here you would typically send this to your analytics service
    // For now, we'll just log it and return success
    
    return NextResponse.json({ 
      success: true, 
      message: 'Analytics event recorded',
      event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics event' },
      { status: 500 }
    );
  }
} 
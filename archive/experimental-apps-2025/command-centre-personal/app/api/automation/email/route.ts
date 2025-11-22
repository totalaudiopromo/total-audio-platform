/**
 * Phase 9D-2B: Email Automation API
 * ConvertKit broadcast creation and template management
 */

import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
}

interface BroadcastRequest {
  subject: string;
  content: string;
  sendAt?: string; // ISO timestamp for scheduled sending
}

/**
 * GET: Fetch email templates or broadcast status
 */
export async function GET(request: Request) {
  try {
    if (!env.FEATURE_AUTOMATION) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation features not enabled',
        },
        { status: 403 }
      );
    }

    if (!env.CONVERTKIT_API_KEY || !env.CONVERTKIT_API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'ConvertKit credentials not configured',
        },
        { status: 400 }
      );
    }

    // Fetch recent broadcasts from ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts?api_secret=${env.CONVERTKIT_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ConvertKit API error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch broadcasts from ConvertKit',
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      broadcasts: data.broadcasts || [],
    });
  } catch (error: any) {
    console.error('Email automation GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch email data',
      },
      { status: 500 }
    );
  }
}

/**
 * POST: Create ConvertKit broadcast (draft or scheduled)
 */
export async function POST(request: Request) {
  try {
    if (!env.FEATURE_AUTOMATION) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation features not enabled',
        },
        { status: 403 }
      );
    }

    if (!env.CONVERTKIT_API_KEY || !env.CONVERTKIT_API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'ConvertKit credentials not configured',
        },
        { status: 400 }
      );
    }

    const body: BroadcastRequest = await request.json();

    if (!body.subject || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subject and content are required',
        },
        { status: 400 }
      );
    }

    // Create broadcast in ConvertKit
    const broadcastPayload: any = {
      subject: body.subject,
      content: body.content,
      public: false, // Draft by default
    };

    if (body.sendAt) {
      broadcastPayload.published_at = body.sendAt;
      broadcastPayload.public = true;
    }

    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts?api_secret=${env.CONVERTKIT_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(broadcastPayload),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ConvertKit broadcast creation failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create broadcast in ConvertKit',
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      broadcast: {
        id: data.broadcast?.id,
        subject: data.broadcast?.subject,
        status: body.sendAt ? 'scheduled' : 'draft',
        sendAt: body.sendAt || null,
      },
    });
  } catch (error: any) {
    console.error('Email automation POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create broadcast',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update existing broadcast
 */
export async function PUT(request: Request) {
  try {
    if (!env.FEATURE_AUTOMATION) {
      return NextResponse.json(
        {
          success: false,
          error: 'Automation features not enabled',
        },
        { status: 403 }
      );
    }

    if (!env.CONVERTKIT_API_KEY || !env.CONVERTKIT_API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'ConvertKit credentials not configured',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { broadcastId, subject, content } = body;

    if (!broadcastId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Broadcast ID is required',
        },
        { status: 400 }
      );
    }

    // Update broadcast in ConvertKit
    const response = await fetch(
      `https://api.convertkit.com/v3/broadcasts/${broadcastId}?api_secret=${env.CONVERTKIT_API_SECRET}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          content,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ConvertKit broadcast update failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update broadcast in ConvertKit',
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      broadcast: data.broadcast,
    });
  } catch (error: any) {
    console.error('Email automation PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update broadcast',
      },
      { status: 500 }
    );
  }
}

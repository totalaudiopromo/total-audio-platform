/**
 * API Route: /api/automations/events
 * Emit automation events to trigger flows
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  emitAutomationEvent,
  type TriggerContext,
} from '@total-audio/automations-engine';

/**
 * POST /api/automations/events
 * Emit an automation event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, source, payload, metadata } = body;

    if (!type || !source) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'type and source are required',
        },
        { status: 400 }
      );
    }

    const event: TriggerContext = {
      type,
      source,
      payload: payload || {},
      metadata: metadata || {},
      timestamp: new Date(),
    };

    await emitAutomationEvent(event);

    return NextResponse.json({
      success: true,
      message: 'Event emitted successfully',
      event: {
        type: event.type,
        source: event.source,
        timestamp: event.timestamp,
      },
    });
  } catch (error) {
    console.error('Failed to emit event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to emit event',
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

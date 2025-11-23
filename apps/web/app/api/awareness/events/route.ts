/**
 * POST /api/awareness/events
 * Ingest events into the awareness system
 */

import { NextRequest, NextResponse } from 'next/server';
import { ingest, ingestBatch, getRecentEvents } from '@total-audio/core-awareness';
import type { AwarenessEvent } from '@total-audio/core-awareness';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both single event and batch ingestion
    if (Array.isArray(body.events)) {
      // Batch ingestion
      const events = body.events as Omit<AwarenessEvent, 'id' | 'createdAt'>[];
      await ingestBatch(events);

      return NextResponse.json({
        success: true,
        message: `Ingested ${events.length} events`,
        count: events.length,
      });
    } else {
      // Single event ingestion
      const event = body as Omit<AwarenessEvent, 'id' | 'createdAt'>;
      await ingest(event);

      return NextResponse.json({
        success: true,
        message: 'Event ingested successfully',
      });
    }
  } catch (error) {
    console.error('Error ingesting events:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to ingest events',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const userId = searchParams.get('userId');
    const timeRange = searchParams.get('timeRange') || '24h';

    const events = await getRecentEvents(workspaceId, userId, timeRange);

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch events',
      },
      { status: 500 }
    );
  }
}

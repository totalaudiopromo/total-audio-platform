/**
 * API Route: /api/anr/deals/[dealId]/events
 *
 * Deal event logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { logDealActivity, type DealEventType } from '@total-audio/anr-radar';

/**
 * POST /api/anr/deals/[dealId]/events
 * Log a deal event
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const body = await request.json();

    const { event_type, payload } = body;

    if (!event_type || !payload) {
      return NextResponse.json(
        { error: 'event_type and payload are required' },
        { status: 400 }
      );
    }

    const success = await logDealActivity(
      dealId,
      event_type as DealEventType,
      payload
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to log deal event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to log deal event:', error);
    return NextResponse.json(
      { error: 'Failed to log deal event' },
      { status: 500 }
    );
  }
}

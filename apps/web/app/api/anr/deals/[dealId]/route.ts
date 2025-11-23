/**
 * API Route: /api/anr/deals/[dealId]
 *
 * Deal detail and update endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getDealById,
  updateDealStage,
  updateDeal,
  getDealEvents,
  type DealStage,
} from '@total-audio/anr-radar';

/**
 * GET /api/anr/deals/[dealId]
 * Get deal details with events
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;

    const deal = await getDealById(dealId);

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Get deal events
    const events = await getDealEvents(dealId);

    return NextResponse.json({
      deal,
      events,
    });
  } catch (error) {
    console.error('Failed to get deal:', error);
    return NextResponse.json(
      { error: 'Failed to get deal' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/anr/deals/[dealId]
 * Update deal
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const body = await request.json();

    const { stage, priority, notes, roster_id } = body;

    // If stage is being updated, use updateDealStage (includes logging)
    if (stage) {
      const updatedDeal = await updateDealStage(dealId, stage as DealStage);

      if (!updatedDeal) {
        return NextResponse.json(
          { error: 'Failed to update deal stage' },
          { status: 500 }
        );
      }

      return NextResponse.json({ deal: updatedDeal });
    }

    // Otherwise, use generic update
    const updates: any = {};

    if (priority) updates.priority = priority;
    if (notes !== undefined) updates.notes = notes;
    if (roster_id !== undefined) updates.roster_id = roster_id;

    const updatedDeal = await updateDeal(dealId, updates);

    if (!updatedDeal) {
      return NextResponse.json(
        { error: 'Failed to update deal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ deal: updatedDeal });
  } catch (error) {
    console.error('Failed to update deal:', error);
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

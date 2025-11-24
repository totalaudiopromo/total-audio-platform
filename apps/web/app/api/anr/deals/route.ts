/**
 * API Route: /api/anr/deals
 *
 * Deal flow management endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  listDealsForWorkspace,
  createNewDeal,
  type DealStage,
  type DealPriority,
} from '@total-audio/anr-radar';

/**
 * GET /api/anr/deals
 * List deals for workspace with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    const stage = searchParams.get('stage') as DealStage | null;
    const ownerUserId = searchParams.get('owner_user_id');
    const priority = searchParams.get('priority') as DealPriority | null;

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    const filters: any = {};

    if (stage) filters.stage = stage;
    if (ownerUserId) filters.owner_user_id = ownerUserId;
    if (priority) filters.priority = priority;

    const deals = await listDealsForWorkspace(workspaceId, filters);

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Failed to list deals:', error);
    return NextResponse.json(
      { error: 'Failed to list deals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/anr/deals
 * Create new deal
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      workspace_id,
      artist_slug,
      roster_id,
      owner_user_id,
      initial_stage,
      priority,
      notes,
    } = body;

    if (!workspace_id || !artist_slug) {
      return NextResponse.json(
        { error: 'workspace_id and artist_slug are required' },
        { status: 400 }
      );
    }

    const deal = await createNewDeal(workspace_id, artist_slug, {
      rosterId: roster_id,
      ownerUserId: owner_user_id,
      initialStage: initial_stage,
      priority,
      notes,
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Failed to create deal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error('Failed to create deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

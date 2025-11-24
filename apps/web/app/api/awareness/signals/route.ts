/**
 * GET /api/awareness/signals
 * POST /api/awareness/signals/[id]/action
 * Get signals by target system and mark them actioned
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getSignalsByTarget,
  getPendingSignals,
  markSignalActioned,
} from '@total-audio/core-awareness';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const userId = searchParams.get('userId');
    const targetSystem = searchParams.get('targetSystem');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let signals;

    if (targetSystem) {
      signals = await getSignalsByTarget(targetSystem, workspaceId, userId, limit);
    } else {
      signals = await getPendingSignals(workspaceId, userId, limit);
    }

    return NextResponse.json({
      success: true,
      data: signals,
      count: signals.length,
    });
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch signals',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signalId } = body;

    if (!signalId) {
      return NextResponse.json(
        { success: false, error: 'signalId is required' },
        { status: 400 }
      );
    }

    const updated = await markSignalActioned(signalId);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error actioning signal:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to action signal',
      },
      { status: 500 }
    );
  }
}

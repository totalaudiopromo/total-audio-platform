/**
 * POST /api/awareness/run-cycle
 * Manually trigger the complete awareness cycle
 */

import { NextRequest, NextResponse } from 'next/server';
import { runAwarenessCycle } from '@total-audio/core-awareness';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, workspaceId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    console.log('Running awareness cycle', { userId, workspaceId });

    const result = await runAwarenessCycle(userId, workspaceId);

    return NextResponse.json({
      success: true,
      data: {
        snapshotId: result.snapshot.id,
        recommendationCount: result.recommendations.length,
        alertCount: result.alerts.length,
        signalCount: result.signals.length,
        snapshot: result.snapshot,
        recommendations: result.recommendations,
        alerts: result.alerts,
        signals: result.signals,
      },
    });
  } catch (error) {
    console.error('Error running awareness cycle:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run awareness cycle',
      },
      { status: 500 }
    );
  }
}

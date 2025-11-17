/**
 * GET /api/awareness/snapshots
 * Get recent awareness snapshots
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecentSnapshots, getLatestSnapshot } from '@total-audio/core-awareness';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workspaceId = searchParams.get('workspaceId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const latest = searchParams.get('latest') === 'true';

    // Get either latest snapshot or recent snapshots
    if (latest) {
      const snapshot = await getLatestSnapshot(workspaceId, userId);

      if (!snapshot) {
        return NextResponse.json(
          { success: false, error: 'No snapshot found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: snapshot,
      });
    }

    const snapshots = await getRecentSnapshots(workspaceId, userId, limit);

    return NextResponse.json({
      success: true,
      data: snapshots,
      count: snapshots.length,
    });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch snapshots',
      },
      { status: 500 }
    );
  }
}

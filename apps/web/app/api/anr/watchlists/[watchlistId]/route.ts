/**
 * API Route: /api/anr/watchlists/[watchlistId]
 *
 * Watchlist details
 */

import { NextRequest, NextResponse } from 'next/server';
import { listWatchlistMembers } from '@total-audio/anr-radar';

/**
 * GET /api/anr/watchlists/[watchlistId]
 * Get watchlist with members
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { watchlistId: string } }
) {
  try {
    const { watchlistId } = params;

    const members = await listWatchlistMembers(watchlistId);

    return NextResponse.json({
      watchlist_id: watchlistId,
      members,
    });
  } catch (error) {
    console.error('Failed to get watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to get watchlist' },
      { status: 500 }
    );
  }
}

/**
 * API Route: /api/anr/watchlists
 *
 * Watchlist management endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { createWatchlist, listWatchlistsForUser } from '@total-audio/anr-radar';

/**
 * GET /api/anr/watchlists
 * List watchlists for user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const watchlists = await listWatchlistsForUser(userId);

    return NextResponse.json({ watchlists });
  } catch (error) {
    console.error('Failed to list watchlists:', error);
    return NextResponse.json(
      { error: 'Failed to list watchlists' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/anr/watchlists
 * Create new watchlist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { workspace_id, user_id, name, description } = body;

    if (!workspace_id || !user_id || !name) {
      return NextResponse.json(
        { error: 'workspace_id, user_id, and name are required' },
        { status: 400 }
      );
    }

    const watchlist = await createWatchlist(workspace_id, user_id, name, description);

    if (!watchlist) {
      return NextResponse.json(
        { error: 'Failed to create watchlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ watchlist }, { status: 201 });
  } catch (error) {
    console.error('Failed to create watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to create watchlist' },
      { status: 500 }
    );
  }
}

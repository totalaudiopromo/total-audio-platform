/**
 * API Route: /api/anr/watchlists/[watchlistId]/members
 *
 * Watchlist member management
 */

import { NextRequest, NextResponse } from 'next/server';
import { addToWatchlist, removeFromWatchlist } from '@total-audio/anr-radar';

/**
 * POST /api/anr/watchlists/[watchlistId]/members
 * Add artist to watchlist
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { watchlistId: string } }
) {
  try {
    const { watchlistId } = params;
    const body = await request.json();

    const { artist_slug, reason } = body;

    if (!artist_slug) {
      return NextResponse.json(
        { error: 'artist_slug is required' },
        { status: 400 }
      );
    }

    const member = await addToWatchlist(watchlistId, artist_slug, reason);

    if (!member) {
      return NextResponse.json(
        { error: 'Failed to add to watchlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Failed to add to watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/anr/watchlists/[watchlistId]/members
 * Remove artist from watchlist
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { watchlistId: string } }
) {
  try {
    const { watchlistId } = params;
    const { searchParams } = new URL(request.url);
    const artistSlug = searchParams.get('artist_slug');

    if (!artistSlug) {
      return NextResponse.json(
        { error: 'artist_slug is required' },
        { status: 400 }
      );
    }

    const success = await removeFromWatchlist(watchlistId, artistSlug);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove from watchlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove from watchlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from watchlist' },
      { status: 500 }
    );
  }
}

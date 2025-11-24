/**
 * API Route: /api/anr/showcases/[showcaseId]/members
 *
 * Showcase member management
 */

import { NextRequest, NextResponse } from 'next/server';
import { addArtistToShowcase } from '@total-audio/anr-radar';

/**
 * POST /api/anr/showcases/[showcaseId]/members
 * Add artist to showcase
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { showcaseId: string } }
) {
  try {
    const { showcaseId } = params;
    const body = await request.json();

    const { artist_slug, position, notes } = body;

    if (!artist_slug) {
      return NextResponse.json(
        { error: 'artist_slug is required' },
        { status: 400 }
      );
    }

    const member = await addArtistToShowcase(showcaseId, artist_slug, position, notes);

    if (!member) {
      return NextResponse.json(
        { error: 'Failed to add artist to showcase' },
        { status: 500 }
      );
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Failed to add artist to showcase:', error);
    return NextResponse.json(
      { error: 'Failed to add artist to showcase' },
      { status: 500 }
    );
  }
}

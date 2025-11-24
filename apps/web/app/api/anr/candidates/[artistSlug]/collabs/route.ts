/**
 * API Route: /api/anr/candidates/[artistSlug]/collabs
 *
 * Collaboration recommendations for a candidate
 */

import { NextRequest, NextResponse } from 'next/server';
import { suggestExternalCollabsForArtist } from '@total-audio/anr-radar';

/**
 * GET /api/anr/candidates/[artistSlug]/collabs
 * Get collaboration recommendations for artist (external)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { artistSlug: string } }
) {
  try {
    const { artistSlug } = params;
    const { searchParams } = new URL(request.url);
    const minCompatibility = parseFloat(searchParams.get('min_compatibility') || '0.6');
    const limit = parseInt(searchParams.get('limit') || '10');

    const recommendations = await suggestExternalCollabsForArtist(
      artistSlug,
      minCompatibility,
      limit
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Failed to get collaboration recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get collaboration recommendations' },
      { status: 500 }
    );
  }
}

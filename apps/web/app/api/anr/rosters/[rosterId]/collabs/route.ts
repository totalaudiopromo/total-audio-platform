/**
 * API Route: /api/anr/rosters/[rosterId]/collabs
 *
 * Collaboration recommendations within roster
 */

import { NextRequest, NextResponse } from 'next/server';
import { suggestCollabsWithinRoster } from '@total-audio/anr-radar';

/**
 * GET /api/anr/rosters/[rosterId]/collabs
 * Get collaboration recommendations within roster
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { rosterId: string } }
) {
  try {
    const { rosterId } = params;
    const { searchParams } = new URL(request.url);
    const minCompatibility = parseFloat(searchParams.get('min_compatibility') || '0.5');

    const recommendations = await suggestCollabsWithinRoster(rosterId, minCompatibility);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Failed to get collaboration recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get collaboration recommendations' },
      { status: 500 }
    );
  }
}

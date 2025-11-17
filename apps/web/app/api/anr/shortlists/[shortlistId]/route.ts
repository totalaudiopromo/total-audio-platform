/**
 * GET /api/anr/shortlists/[shortlistId]
 *
 * Get shortlist details with members
 */

import { NextRequest, NextResponse } from 'next/server';
import { getShortlist } from '@total-audio/anr-radar';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortlistId: string } }
) {
  try {
    const { shortlistId } = params;

    const { shortlist, members } = await getShortlist(shortlistId);

    if (!shortlist) {
      return NextResponse.json(
        { error: 'Shortlist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      shortlist,
      members,
    });
  } catch (error) {
    console.error('Failed to get shortlist:', error);
    return NextResponse.json(
      { error: 'Failed to get shortlist' },
      { status: 500 }
    );
  }
}

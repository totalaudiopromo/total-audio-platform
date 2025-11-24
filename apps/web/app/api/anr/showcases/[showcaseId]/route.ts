/**
 * API Route: /api/anr/showcases/[showcaseId]
 *
 * Showcase details with full artist data
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildShowcaseSummary } from '@total-audio/anr-radar';

/**
 * GET /api/anr/showcases/[showcaseId]
 * Get showcase with full artist summaries
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { showcaseId: string } }
) {
  try {
    const { showcaseId } = params;

    const summary = await buildShowcaseSummary(showcaseId);

    if (!summary) {
      return NextResponse.json(
        { error: 'Showcase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ showcase: summary });
  } catch (error) {
    console.error('Failed to get showcase:', error);
    return NextResponse.json(
      { error: 'Failed to get showcase' },
      { status: 500 }
    );
  }
}

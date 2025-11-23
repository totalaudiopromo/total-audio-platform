/**
 * RCF Timeline API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildTimeline } from '@total-audio/rcf/timelines';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const timeline = await buildTimeline(params.slug, []);

    return NextResponse.json({ success: true, data: timeline });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

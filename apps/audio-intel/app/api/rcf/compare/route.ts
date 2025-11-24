/**
 * RCF Compare API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { compareArtists } from '@total-audio/rcf/comparison';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artists } = body;

    const comparison = await compareArtists(artists || [], []);

    return NextResponse.json({ success: true, data: comparison });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

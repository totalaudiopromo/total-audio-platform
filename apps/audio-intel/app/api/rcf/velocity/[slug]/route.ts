/**
 * RCF Velocity API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateVelocity } from '@total-audio/rcf/velocity';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const velocity = await calculateVelocity([], 'artist', params.slug, 24);

    return NextResponse.json({ success: true, data: velocity });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

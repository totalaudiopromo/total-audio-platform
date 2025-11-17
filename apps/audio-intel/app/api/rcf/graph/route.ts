/**
 * RCF Media Graph API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildMediaGraph } from '@total-audio/rcf/mediaGraph';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const graph = await buildMediaGraph([]);

    return NextResponse.json({ success: true, data: graph });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

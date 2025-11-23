/**
 * RCF Digest API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDigests } from '@total-audio/rcf/digests';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') as 'daily' | 'weekly' | undefined;
    const digests = await getDigests('default', period);

    return NextResponse.json({ success: true, data: digests });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

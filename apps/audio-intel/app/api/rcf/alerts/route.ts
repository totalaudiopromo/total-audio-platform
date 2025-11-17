/**
 * RCF Alerts API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAlerts } from '@total-audio/rcf/alerts';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const alerts = await getAlerts(undefined, userId, false, 50);

    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get alerts' }, { status: 500 });
  }
}

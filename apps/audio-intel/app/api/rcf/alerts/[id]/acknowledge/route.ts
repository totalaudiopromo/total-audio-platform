/**
 * Acknowledge Alert
 */

import { NextRequest, NextResponse } from 'next/server';
import { acknowledgeAlert } from '@total-audio/rcf/alerts';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const success = await acknowledgeAlert(params.id, userId);

    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

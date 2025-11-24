/**
 * RCF Rules API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRules, saveRule } from '@total-audio/rcf/rules';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const workspaceId = 'default';
    const rules = await getRules(workspaceId);

    return NextResponse.json({ success: true, data: rules });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rule = await saveRule(body);

    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

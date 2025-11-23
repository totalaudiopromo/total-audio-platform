/**
 * RCF Trends API Route
 * GET /api/rcf/trends?window=6h|24h|7d
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTrendsByWindow } from '@total-audio/rcf/trends';
import type { TrendWindow, EntityType } from '@total-audio/rcf/trends';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const window = (searchParams.get('window') || '24h') as TrendWindow;
    const entityType = searchParams.get('type') as EntityType | undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    const trends = await getTrendsByWindow(window, entityType, limit);

    return NextResponse.json({
      success: true,
      data: trends,
      meta: { window, entity_type: entityType, limit },
    });
  } catch (error) {
    console.error('[RCF Trends API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get trends' },
      { status: 500 }
    );
  }
}

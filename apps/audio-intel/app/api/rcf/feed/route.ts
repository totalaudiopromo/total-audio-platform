/**
 * RCF Feed API Route
 *
 * GET /api/rcf/feed
 *
 * Returns paginated RCF events with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildUserFeed } from '@total-audio/rcf';
import type { RCFFeedFilter } from '@total-audio/rcf/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get authenticated user from session
    // For now, use mock user ID
    const userId = request.headers.get('x-user-id') || 'demo-user';

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;

    // Build filter from query params
    const filter: RCFFeedFilter = {
      event_types: searchParams.get('types')?.split(',') as any,
      artist_slugs: searchParams.get('artists')?.split(','),
      scene_slugs: searchParams.get('scenes')?.split(','),
      entity_slugs: searchParams.get('entities')?.split(','),
      min_weight: searchParams.get('min_weight')
        ? parseFloat(searchParams.get('min_weight')!)
        : undefined,
      max_weight: searchParams.get('max_weight')
        ? parseFloat(searchParams.get('max_weight')!)
        : undefined,
      since: searchParams.get('since') || undefined,
      before: searchParams.get('before') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    };

    // Build feed
    const feed = await buildUserFeed(userId, filter);

    return NextResponse.json({
      success: true,
      data: feed,
      meta: {
        count: feed.length,
        limit: filter.limit,
        offset: filter.offset,
      },
    });
  } catch (error) {
    console.error('[RCF Feed API] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to build feed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scenes
 * List all scenes with optional filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ScenesStore } from '@total-audio/scenes-engine';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const scenesStore = new ScenesStore({ supabase });

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region') || undefined;
    const country = searchParams.get('country') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const microgenre = searchParams.get('microgenre') || undefined;

    // Get scenes with filters
    const scenes = await scenesStore.listScenes({
      region,
      country,
      tag,
      microgenre,
    });

    return NextResponse.json({
      success: true,
      data: scenes,
      count: scenes.length,
    });
  } catch (error) {
    console.error('Error fetching scenes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scenes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

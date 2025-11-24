/**
 * GET /api/talent/artists/[slug]
 * Artist radar profile - comprehensive talent intelligence
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { RadarAggregator } from '@total-audio/talent-radar';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Initialize aggregator
    const aggregator = new RadarAggregator(supabase);

    // Build artist profile
    const profile = await aggregator.buildArtistProfile(slug);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Artist not found in radar',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch artist profile',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

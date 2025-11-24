/**
 * GET /api/talent/pulse
 * Global music pulse summary - rising artists, breakout candidates, scene movers
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { RadarAggregator } from '@total-audio/talent-radar';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Initialize aggregator
    const aggregator = new RadarAggregator(supabase);

    // Build global pulse snapshot
    const pulse = await aggregator.buildGlobalPulse();

    return NextResponse.json({
      success: true,
      data: pulse,
    });
  } catch (error) {
    console.error('Error fetching global pulse:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch global pulse',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

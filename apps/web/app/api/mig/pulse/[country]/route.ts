/**
 * MIG API Route: Get Country Scene Pulse
 * GET /api/mig/pulse/[country]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getScenePulseForCountry } from '@total-audio/music-industry-graph';

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params;

    if (!country) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Country parameter is required', code: 'MISSING_COUNTRY' },
        },
        { status: 400 }
      );
    }

    const pulse = await getScenePulseForCountry(country);

    if (!pulse) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'No data found for country', code: 'NO_DATA' },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pulse,
    });
  } catch (error) {
    console.error('Error in /api/mig/pulse/[country]:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

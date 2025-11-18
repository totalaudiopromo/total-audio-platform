import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { predictTrajectory } from '@total-audio/trajectory-lens';

export async function GET(
  request: NextRequest,
  { params }: { params: { artistSlug: string } }
) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const artistSlug = params.artistSlug;
    const searchParams = request.nextUrl.searchParams;
    const forecastDays = parseInt(searchParams.get('forecastDays') || '90', 10);

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Predict trajectory
    const forecast = await predictTrajectory({
      artistSlug,
      forecastDays,
      context: fusionContext,
    });

    return NextResponse.json(forecast);
  } catch (error) {
    console.error('Trajectory API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

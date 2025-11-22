import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { getModeRecommendation, getModeInsights, type DashboardMode } from '@total-audio/dashboard-modes';

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode') as DashboardMode | null;

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Get mode recommendation if not specified
    const recommendedMode = mode || getModeRecommendation(fusionContext);

    // Get insights for mode
    const insights = getModeInsights(recommendedMode, fusionContext);

    return NextResponse.json({
      recommendedMode,
      insights,
    });
  } catch (error) {
    console.error('Modes API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { buildCoverageFusion } from '@total-audio/coverage-fusion';

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

    // Parse date range
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // Default: 90 days ago

    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : new Date(); // Default: now

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Build coverage fusion
    const coverageFusion = await buildCoverageFusion({
      artistSlug,
      timeRange: { start: startDate, end: endDate },
      context: fusionContext,
    });

    return NextResponse.json(coverageFusion);
  } catch (error) {
    console.error('Coverage Fusion API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

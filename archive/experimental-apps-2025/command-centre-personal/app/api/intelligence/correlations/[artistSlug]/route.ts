import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { analyzeCorrelations } from '@total-audio/correlation-engine';

export async function GET(request: NextRequest, { params }: { params: { artistSlug: string } }) {
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
    const windowDays = parseInt(searchParams.get('windowDays') || '90', 10);

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Analyze correlations
    const result = await analyzeCorrelations({
      artistSlug,
      windowDays,
      context: fusionContext,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Correlations API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

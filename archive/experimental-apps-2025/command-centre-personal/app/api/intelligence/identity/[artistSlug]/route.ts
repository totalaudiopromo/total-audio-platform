import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { buildIdentityProfile } from '@total-audio/identity-kernel';

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

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Build identity profile
    const profile = await buildIdentityProfile({
      artistSlug,
      context: fusionContext,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Identity API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { buildSignalThread, type ThreadType } from '@total-audio/signal-threads';

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
    const threadType = (searchParams.get('threadType') || 'narrative') as ThreadType;

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Build signal thread
    const signalThread = await buildSignalThread({
      artistSlug,
      threadType,
      context: fusionContext,
    });

    return NextResponse.json(signalThread);
  } catch (error) {
    console.error('Signal Threads API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

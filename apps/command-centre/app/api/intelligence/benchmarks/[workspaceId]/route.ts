import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildFusionContext } from '@total-audio/fusion-layer';
import { generateBenchmark } from '@total-audio/workspace-benchmarking';

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
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

    const workspaceId = params.workspaceId;

    // Verify user has access to workspace
    const { data: workspaceMember } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (!workspaceMember) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Build fusion context
    const fusionContext = await buildFusionContext(supabase, user.id);

    // Generate benchmark
    const benchmark = await generateBenchmark({
      workspaceId,
      context: fusionContext,
    });

    return NextResponse.json(benchmark);
  } catch (error) {
    console.error('Benchmarks API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

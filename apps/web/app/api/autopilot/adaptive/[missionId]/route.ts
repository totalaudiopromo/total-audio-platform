/**
 * Adaptive Loop API
 * POST /api/autopilot/adaptive/[missionId]
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { runAdaptiveLoop } from '@total-audio/pr-autopilot/adaptive/adaptiveEngine';

export async function POST(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { agentRole } = body;

    const result = await runAdaptiveLoop(supabase, params.missionId, agentRole);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Adaptive loop error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

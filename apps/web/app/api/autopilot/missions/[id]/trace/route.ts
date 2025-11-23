/**
 * Trace API
 * GET /api/autopilot/missions/[id]/trace
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { loadTrace, getTraceSummary } from '@total-audio/pr-autopilot/tracing/trace';
import { formatTraceTimeline } from '@total-audio/pr-autopilot/tracing/traceFormatter';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const missionId = params.id;

    // Validate mission access
    const { data: mission } = await supabase
      .from('autopilot_missions')
      .select('id, user_id')
      .eq('id', missionId)
      .single();

    if (!mission || mission.user_id !== user.id) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('runId') || undefined;
    const format = searchParams.get('format') || 'timeline'; // 'timeline' or 'summary'

    // Load trace events
    const events = await loadTrace(supabase, missionId, runId);

    if (format === 'summary') {
      const summary = getTraceSummary(events);
      return NextResponse.json({ summary });
    }

    // Format timeline
    const timeline = formatTraceTimeline(events);

    return NextResponse.json({ events: timeline, count: timeline.length });
  } catch (error) {
    console.error('Trace retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

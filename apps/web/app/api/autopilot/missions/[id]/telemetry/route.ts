/**
 * Telemetry API
 * GET /api/autopilot/missions/[id]/telemetry
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createTelemetryEngine } from '@total-audio/pr-autopilot/telemetry/telemetryEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const missionId = params.id;
    const telemetry = createTelemetryEngine(supabase);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const metricType = searchParams.get('metric_type');
    const agentRole = searchParams.get('agent_role');

    // Fetch metrics with filters
    const metrics = await telemetry.getMetrics(missionId, {
      metric_type: metricType as any,
      agent_role: agentRole as any,
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Telemetry fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

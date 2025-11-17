/**
 * Mission Dashboard API
 * GET /api/autopilot/missions/[id]/dashboard
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

    // Get telemetry summary
    const telemetrySummary = await telemetry.getMissionSummary(missionId);

    // Get mission details
    const { data: mission } = await supabase
      .from('autopilot_missions')
      .select('mode, config')
      .eq('id', missionId)
      .single();

    // Get agent performance
    const { data: tasks } = await supabase
      .from('autopilot_tasks')
      .select('agent_role, status, metadata')
      .eq('mission_id', missionId);

    const agentStats = tasks?.reduce((acc: any, task) => {
      const role = task.agent_role;
      if (!acc[role]) {
        acc[role] = {
          role,
          tasksCompleted: 0,
          totalConfidence: 0,
          count: 0,
          status: 'idle',
        };
      }

      if (task.status === 'completed') acc[role].tasksCompleted++;
      if (task.status === 'in_progress') acc[role].status = 'active';

      const metadata = task.metadata as any;
      if (metadata?.confidence?.score) {
        acc[role].totalConfidence += metadata.confidence.score;
        acc[role].count++;
      }

      return acc;
    }, {});

    const agents = Object.values(agentStats || {}).map((agent: any) => ({
      role: agent.role,
      tasksCompleted: agent.tasksCompleted,
      avgConfidence: agent.count > 0 ? agent.totalConfidence / agent.count : 0,
      status: agent.status,
    }));

    // Build dashboard response
    const dashboard = {
      telemetry: {
        avgLatency: telemetrySummary.avg_latency_ms || 0,
        avgConfidence: telemetrySummary.avg_confidence || 0,
        successRate: telemetrySummary.success_rate || 0,
        totalEvents: telemetrySummary.total_events || 0,
      },
      momentum: {
        micro: { velocity: 12.5, trend: 'accelerating' },
        mid: { progress: 0.65, trend: 'on-track' },
        macro: { completion: 0.42, trend: 'sustainable' },
      },
      agents,
      confidence: {
        currentScore: telemetrySummary.avg_confidence || 0,
        breakdown: {
          dataCompleteness: 0.85,
          riskAssessment: 0.78,
          policyCompliance: 0.92,
          capabilityMatch: 0.88,
          contextQuality: 0.75,
        },
        alerts: [],
      },
      negotiation: {
        activeConflicts: 0,
        resolvedToday: 3,
        consensusRate: 0.85,
      },
      autonomy: {
        mode: mission?.mode || 'suggest',
        riskTolerance: (mission?.config as any)?.riskTolerance || 0.5,
        autoApprovalRate: telemetrySummary.approval_rate || 0,
      },
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

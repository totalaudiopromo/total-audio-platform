/**
 * Phase 9D-2: Agent Metrics API
 * Real-time agent performance data from Phase 9B agent_events table
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = await createAdminClient(cookies());

    // Query agent_events table with aggregation
    const { data: agents, error } = await (supabase.rpc as any)('get_agent_metrics');

    if (error) {
      console.error('Error fetching agent metrics:', error);

      // Fallback query if RPC doesn't exist yet
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('agent_events')
        .select('agent_id, app, success, latency_ms, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (fallbackError) {
        throw fallbackError;
      }

      // Aggregate fallback data client-side
      const aggregated = aggregateAgentMetrics(fallbackData || []);
      return NextResponse.json({
        success: true,
        agents: aggregated,
        source: 'fallback',
      });
    }

    return NextResponse.json({
      success: true,
      agents: agents || [],
      source: 'rpc',
    });
  } catch (error: any) {
    console.error('Agent metrics API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch agent metrics',
      },
      { status: 500 }
    );
  }
}

/**
 * Aggregate agent metrics from raw events
 */
function aggregateAgentMetrics(events: any[]) {
  const grouped: Record<string, any> = {};

  events.forEach(event => {
    const key = `${event.agent_id}-${event.app}`;

    if (!grouped[key]) {
      grouped[key] = {
        agent_id: event.agent_id,
        app: event.app,
        total_events: 0,
        successful_events: 0,
        failed_events: 0,
        total_latency: 0,
        last_run: event.created_at,
      };
    }

    grouped[key].total_events++;
    if (event.success) {
      grouped[key].successful_events++;
    } else {
      grouped[key].failed_events++;
    }
    grouped[key].total_latency += event.latency_ms || 0;
  });

  return Object.values(grouped).map(agent => ({
    agent_id: agent.agent_id,
    app: agent.app,
    total_events: agent.total_events,
    successful_events: agent.successful_events,
    failed_events: agent.failed_events,
    avg_latency_ms: Math.round(agent.total_latency / agent.total_events),
    success_rate: ((agent.successful_events / agent.total_events) * 100).toFixed(1),
    last_run: agent.last_run,
  }));
}

/**
 * Phase 9D-2: System Health Check API
 * Comprehensive health status for all Ops Console systems
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { isTelegramConfigured } from '@/lib/telegram';
import { integrations } from '@/lib/env';

export async function GET() {
  try {
    const supabase = await createAdminClient(cookies());

    // Check database connectivity
    const { error: dbError } = await supabase.from('agent_events').select('id').limit(1);
    const databaseHealthy = !dbError;

    // Check agent health (agents with events in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentAgents, error: agentsError } = await supabase
      .from('agent_events')
      .select('agent_id, success')
      .gte('created_at', oneDayAgo);

    let agentStats = { total: 0, active: 0, failed: 0 };
    if (!agentsError && recentAgents) {
      const uniqueAgents = new Set(recentAgents.map(a => a.agent_id));
      agentStats.total = uniqueAgents.size;
      agentStats.active = uniqueAgents.size;
      agentStats.failed = recentAgents.filter(a => !a.success).length;
    }

    // Check social integrations
    const socialStatus = {
      twitter: integrations.twitter,
      linkedin: integrations.linkedin,
      bluesky: integrations.bluesky,
      threads: integrations.threads,
    };

    // Check Telegram
    const telegramHealthy = isTelegramConfigured();

    // Overall system status
    const status =
      databaseHealthy && agentStats.failed === 0 && telegramHealthy
        ? 'healthy'
        : agentStats.failed > 0
          ? 'degraded'
          : 'down';

    // Recent activity (last 10 agent events)
    const { data: recentActivity } = await supabase
      .from('agent_events')
      .select('agent_id, app, success, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      health: {
        status,
        agents: agentStats,
        social: socialStatus,
        database: databaseHealthy,
        telegram: telegramHealthy,
      },
      recentActivity: recentActivity || [],
    });
  } catch (error: any) {
    console.error('Health check API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check system health',
        health: {
          status: 'down',
          agents: { total: 0, active: 0, failed: 0 },
          social: { twitter: false, linkedin: false, bluesky: false, threads: false },
          database: false,
          telegram: false,
        },
        recentActivity: [],
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LEADS, getMockLeadStats } from '@/lib/leads/mock-data';
import type { LeadStats } from '@/lib/leads/types';

// In-memory store (shared with main route)
let leadsStore = [...MOCK_LEADS];

/**
 * GET /api/leads/stats
 * Get lead statistics for dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Calculate stats from current store
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newLeads = leadsStore.filter(l => l.status === 'new').length;
    const pipelineLeads = leadsStore.filter(l => l.status === 'pipeline').length;
    const dismissedLeads = leadsStore.filter(l => l.status === 'dismissed').length;
    const contactedLeads = leadsStore.filter(l => l.status === 'contacted').length;

    const totalScore = leadsStore.reduce((sum, l) => sum + l.score, 0);
    const averageScore = leadsStore.length > 0 ? Math.round(totalScore / leadsStore.length) : 0;

    const highScoreLeads = leadsStore.filter(l => l.score >= 80).length;

    const leadsBySource: Record<string, number> = {};
    leadsStore.forEach(l => {
      leadsBySource[l.sourceType] = (leadsBySource[l.sourceType] || 0) + 1;
    });

    const leadsThisWeek = leadsStore.filter(l => new Date(l.createdAt) >= oneWeekAgo).length;

    const stats: LeadStats = {
      totalLeads: leadsStore.length,
      newLeads,
      pipelineLeads,
      dismissedLeads,
      contactedLeads,
      averageScore,
      highScoreLeads,
      leadsBySource,
      leadsThisWeek,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Leads API] Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch lead stats' }, { status: 500 });
  }
}

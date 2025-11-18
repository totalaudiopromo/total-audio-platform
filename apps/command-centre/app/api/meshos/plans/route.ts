/**
 * GET /api/meshos/plans?window=7d|30d|90d
 * Returns strategic plans for specified time window
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDailySummary, type PlanSummary } from '@total-audio/meshos';

type TimeWindow = '7d' | '30d' | '90d';

interface PlansResponse {
  success: boolean;
  window: TimeWindow;
  plans?: PlanSummary[];
  milestones?: Array<{
    id: string;
    title: string;
    targetDate: string;
    status: 'pending' | 'in_progress' | 'completed';
    confidence: number;
  }>;
  priorities?: {
    high: PlanSummary[];
    medium: PlanSummary[];
    low: PlanSummary[];
  };
  opportunities?: Array<{
    id: string;
    window: string;
    description: string;
    systems: string[];
  }>;
  risks?: Array<{
    id: string;
    window: string;
    description: string;
    severity: string;
  }>;
  strategicPosition?: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const window = (searchParams.get('window') || '7d') as TimeWindow;

    if (!['7d', '30d', '90d'].includes(window)) {
      return NextResponse.json(
        {
          success: false,
          window,
          error: 'Invalid window parameter. Must be 7d, 30d, or 90d',
        } as PlansResponse,
        { status: 400 }
      );
    }

    console.log(`[MeshOS API] Fetching plans for window: ${window}`);

    // Get summary which includes plans
    const summary = await generateDailySummary(new Date());

    // Extract plans based on window
    const plans = window === '7d'
      ? summary.plans.last7d
      : window === '30d'
      ? summary.plans.last30d
      : summary.plans.last90d;

    // Group by priority
    const priorities = {
      high: plans.filter((p) => p.priority === 'high'),
      medium: plans.filter((p) => p.priority === 'medium'),
      low: plans.filter((p) => p.priority === 'low'),
    };

    // Generate mock milestones based on plans
    const milestones = plans
      .filter((p) => p.status === 'active' || p.status === 'pending')
      .slice(0, 5)
      .map((p, idx) => {
        const daysAhead = window === '7d' ? 7 : window === '30d' ? 30 : 90;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + Math.floor((idx + 1) * (daysAhead / 5)));

        return {
          id: `milestone-${p.id}`,
          title: p.title,
          targetDate: targetDate.toISOString(),
          status: p.status === 'active' ? ('in_progress' as const) : ('pending' as const),
          confidence: p.priority === 'high' ? 0.85 : p.priority === 'medium' ? 0.65 : 0.45,
        };
      });

    // Extract opportunities from summary
    const opportunities = summary.opportunities.slice(0, 3).map((opp) => ({
      id: opp.id,
      window: `Next ${window}`,
      description: opp.description,
      systems: opp.systems,
    }));

    // Extract risks from conflicts
    const risks = summary.conflicts.slice(0, 3).map((conflict) => ({
      id: conflict.id,
      window: `Next ${window}`,
      description: conflict.description,
      severity: conflict.severity,
    }));

    // Generate strategic position summary
    const strategicPosition = `MeshOS coordination status for ${window}: ${plans.length} active plans, ${summary.metrics.totalOpportunities} opportunities, ${summary.metrics.totalConflicts} conflicts detected.`;

    return NextResponse.json(
      {
        success: true,
        window,
        plans,
        milestones,
        priorities,
        opportunities,
        risks,
        strategicPosition,
      } as PlansResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[MeshOS API] Error fetching plans:', error);

    return NextResponse.json(
      {
        success: false,
        window: '7d',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as PlansResponse,
      { status: 500 }
    );
  }
}

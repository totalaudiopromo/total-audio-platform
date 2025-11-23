/**
 * GET /api/meshos/negotiations
 * Returns negotiation sessions between MeshOS agents
 */

import { NextRequest, NextResponse } from 'next/server';

interface NegotiationSession {
  id: string;
  timestamp: string;
  participants: Array<{
    agent: string;
    system: string;
    stance: string;
  }>;
  topic: string;
  outcome: 'resolved' | 'disagreement' | 'partial_consensus' | 'ongoing';
  severity: 'low' | 'medium' | 'high';
  transcript: Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>;
  resolution?: string;
}

interface NegotiationsResponse {
  success: boolean;
  negotiations?: NegotiationSession[];
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('[MeshOS API] Fetching negotiations...');

    // Mock negotiation data (in production, query mesh_negotiations table)
    const negotiations: NegotiationSession[] = [
      {
        id: 'neg-001',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        participants: [
          { agent: 'Autopilot Coordinator', system: 'Autopilot', stance: 'pro-automation' },
          { agent: 'CoachOS Advisor', system: 'CoachOS', stance: 'caution-burnout' },
        ],
        topic: 'Outreach Volume vs. Energy Levels',
        outcome: 'partial_consensus',
        severity: 'high',
        transcript: [
          {
            agent: 'Autopilot Coordinator',
            message: 'Current outreach capacity allows for 50 emails per day based on campaign requirements.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            agent: 'CoachOS Advisor',
            message: 'Energy scores indicate burnout risk. Current schedule unsustainable. Recommend reducing to 25-30 per day.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString(),
          },
          {
            agent: 'Autopilot Coordinator',
            message: 'Agreed. Proposing adaptive scheduling: 40 emails during high-energy periods, 20 during low-energy periods.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120000).toISOString(),
          },
          {
            agent: 'CoachOS Advisor',
            message: 'Acceptable compromise. Will monitor energy patterns and adjust thresholds dynamically.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 180000).toISOString(),
          },
        ],
        resolution: 'Implemented adaptive scheduling based on real-time energy monitoring. Autopilot will respect CoachOS energy thresholds.',
      },
      {
        id: 'neg-002',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        participants: [
          { agent: 'MAL Strategic Planner', system: 'MAL', stance: 'growth-focused' },
          { agent: 'Identity Guardian', system: 'Identity', stance: 'authenticity-first' },
        ],
        topic: 'Scaling Strategy vs. Brand Authenticity',
        outcome: 'disagreement',
        severity: 'high',
        transcript: [
          {
            agent: 'MAL Strategic Planner',
            message: 'Lifecycle analysis indicates transition to growth phase. Recommend scaling operations by 3x over next quarter.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            agent: 'Identity Guardian',
            message: 'Brand authenticity metrics show 15% decline this month. Scaling at proposed rate would compromise core identity.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 60000).toISOString(),
          },
          {
            agent: 'MAL Strategic Planner',
            message: 'Market opportunity window is limited. Delayed scaling risks missing critical momentum.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 120000).toISOString(),
          },
          {
            agent: 'Identity Guardian',
            message: 'Momentum without authenticity leads to hollow growth. Recommend 1.5x scaling with brand reinforcement phase first.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 180000).toISOString(),
          },
        ],
        resolution: undefined, // Unresolved - requires human decision
      },
      {
        id: 'neg-003',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        participants: [
          { agent: 'CIS Resource Manager', system: 'CIS', stance: 'efficient-allocation' },
          { agent: 'Scenes Navigator', system: 'Scenes', stance: 'engagement-quality' },
        ],
        topic: 'Scene Investment vs. Actual Participation',
        outcome: 'resolved',
        severity: 'medium',
        transcript: [
          {
            agent: 'CIS Resource Manager',
            message: '40% of time allocated to indie folk scene but only 2 interactions detected this month.',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          },
          {
            agent: 'Scenes Navigator',
            message: 'Quality over quantity. Those 2 interactions were with key scene leaders and resulted in collaboration opportunities.',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000 + 60000).toISOString(),
          },
          {
            agent: 'CIS Resource Manager',
            message: 'Understood. Recommend adjusting metrics to measure impact per interaction rather than raw volume.',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000 + 120000).toISOString(),
          },
        ],
        resolution: 'Updated CIS metrics to prioritize interaction quality and impact over volume. Scene investment justified.',
      },
      {
        id: 'neg-004',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        participants: [
          { agent: 'RCF Relationship Analyst', system: 'RCF', stance: 'relationship-health' },
          { agent: 'MIG Outreach Coordinator', system: 'MIG', stance: 'opportunity-focused' },
        ],
        topic: 'Relationship Fatigue Signals',
        outcome: 'resolved',
        severity: 'low',
        transcript: [
          {
            agent: 'RCF Relationship Analyst',
            message: 'Contact A showing fatigue signals: reduced response time, shorter replies, last marked as "needs space".',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          },
          {
            agent: 'MIG Outreach Coordinator',
            message: 'New collaboration opportunity identified. Should we reach out?',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000 + 60000).toISOString(),
          },
          {
            agent: 'RCF Relationship Analyst',
            message: 'Recommend 2-week cooling period before re-engagement. Premature outreach risks relationship damage.',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000 + 120000).toISOString(),
          },
          {
            agent: 'MIG Outreach Coordinator',
            message: 'Agreed. Will defer outreach and identify alternative contacts for this opportunity.',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000 + 180000).toISOString(),
          },
        ],
        resolution: 'Implemented 2-week cooling-off period for Contact A. MIG redirected opportunity to alternative contacts.',
      },
    ];

    return NextResponse.json(
      {
        success: true,
        negotiations,
      } as NegotiationsResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('[MeshOS API] Error fetching negotiations:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as NegotiationsResponse,
      { status: 500 }
    );
  }
}

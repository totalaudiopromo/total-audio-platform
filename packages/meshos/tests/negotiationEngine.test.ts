/**
 * NegotiationEngine Tests
 * Tests for multi-agent negotiation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NegotiationEngine } from '../src/engines/negotiationEngine';

describe('NegotiationEngine', () => {
  let negotiationEngine: NegotiationEngine;
  const workspaceId = 'test-workspace-123';

  beforeEach(() => {
    negotiationEngine = new NegotiationEngine(workspaceId);
  });

  it('should negotiate with consensus strategy', async () => {
    const params = {
      participants: ['autopilot', 'mal', 'coach'],
      context: {
        issue: 'Conflicting priorities for contact outreach',
        decision_needed: 'Which contacts to prioritize',
      },
      strategy: 'consensus' as const,
    };

    const result = await negotiationEngine.negotiate(params);

    expect(result).toMatchObject({
      workspace_id: workspaceId,
      participants: params.participants,
      strategy: 'consensus',
      status: 'completed',
    });

    expect(result.result).toBeDefined();
    expect(result.confidence_score).toBeGreaterThanOrEqual(0);
    expect(result.confidence_score).toBeLessThanOrEqual(1);
  });

  it('should negotiate with weighted strategy', async () => {
    const params = {
      participants: ['autopilot', 'mal'],
      context: {
        issue: 'Resource allocation',
        weights: { autopilot: 0.7, mal: 0.3 },
      },
      strategy: 'weighted' as const,
    };

    const result = await negotiationEngine.negotiate(params);

    expect(result.strategy).toBe('weighted');
    expect(result.participants_agreement).toBeDefined();
  });

  it('should negotiate with risk-adjusted strategy', async () => {
    const params = {
      participants: ['autopilot', 'coachOS'],
      context: {
        issue: 'High-risk campaign decision',
        risk_tolerance: 0.3,
      },
      strategy: 'risk-adjusted' as const,
    };

    const result = await negotiationEngine.negotiate(params);

    expect(result.strategy).toBe('risk-adjusted');
    expect(result.result).toBeDefined();
  });

  it('should negotiate with opportunity strategy', async () => {
    const params = {
      participants: ['talentRadar', 'scenes'],
      context: {
        issue: 'Opportunity prioritization',
        opportunities: [
          { name: 'Festival booking', value: 0.8 },
          { name: 'Radio interview', value: 0.6 },
        ],
      },
      strategy: 'opportunity' as const,
    };

    const result = await negotiationEngine.negotiate(params);

    expect(result.strategy).toBe('opportunity');
    expect(result.confidence_score).toBeGreaterThan(0);
  });

  it('should include participants agreement scores', async () => {
    const params = {
      participants: ['autopilot', 'mal', 'coach'],
      context: { issue: 'Test negotiation' },
      strategy: 'consensus' as const,
    };

    const result = await negotiationEngine.negotiate(params);

    expect(result.participants_agreement).toBeDefined();

    params.participants.forEach((participant) => {
      expect(result.participants_agreement[participant]).toBeGreaterThanOrEqual(0);
      expect(result.participants_agreement[participant]).toBeLessThanOrEqual(1);
    });
  });
});

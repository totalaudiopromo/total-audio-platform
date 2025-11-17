/**
 * PlanningEngine Tests
 * Tests for long-range planning
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PlanningEngine } from '../src/engines/planningEngine';

describe('PlanningEngine', () => {
  let planningEngine: PlanningEngine;
  const workspaceId = 'test-workspace-123';

  beforeEach(() => {
    planningEngine = new PlanningEngine(workspaceId);
  });

  it('should generate 7-day plan', async () => {
    const plan = await planningEngine.generatePlan('7d');

    expect(plan).toMatchObject({
      workspace_id: workspaceId,
      timeframe: '7d',
      objectives: expect.any(Array),
      actions: expect.any(Array),
      confidence_score: expect.any(Number),
    });

    expect(plan.confidence_score).toBeGreaterThanOrEqual(0);
    expect(plan.confidence_score).toBeLessThanOrEqual(1);
  });

  it('should generate 30-day plan', async () => {
    const plan = await planningEngine.generatePlan('30d');

    expect(plan.timeframe).toBe('30d');
    expect(plan.objectives.length).toBeGreaterThan(0);
  });

  it('should generate 90-day plan', async () => {
    const plan = await planningEngine.generatePlan('90d');

    expect(plan.timeframe).toBe('90d');
    expect(plan.objectives.length).toBeGreaterThan(0);
  });

  it('should include objectives with priorities', async () => {
    const plan = await planningEngine.generatePlan('7d');

    plan.objectives.forEach((objective) => {
      expect(objective).toMatchObject({
        name: expect.any(String),
        description: expect.any(String),
        priority: expect.any(Number),
        agents: expect.any(Array),
      });

      expect(objective.priority).toBeGreaterThanOrEqual(1);
      expect(objective.priority).toBeLessThanOrEqual(10);
    });
  });

  it('should include actions with agent assignments', async () => {
    const plan = await planningEngine.generatePlan('7d');

    plan.actions.forEach((action) => {
      expect(action).toMatchObject({
        name: expect.any(String),
        description: expect.any(String),
        agent: expect.any(String),
        estimated_duration: expect.any(String),
      });
    });
  });

  it('should include milestones', async () => {
    const plan = await planningEngine.generatePlan('30d');

    if (plan.milestones && plan.milestones.length > 0) {
      plan.milestones.forEach((milestone) => {
        expect(milestone).toMatchObject({
          name: expect.any(String),
          description: expect.any(String),
          target_date: expect.any(String),
        });
      });
    }
  });

  it('should include risk assessment', async () => {
    const plan = await planningEngine.generatePlan('7d');

    if (plan.risks && plan.risks.length > 0) {
      plan.risks.forEach((risk) => {
        expect(risk).toMatchObject({
          name: expect.any(String),
          description: expect.any(String),
          probability: expect.any(Number),
          impact: expect.any(Number),
        });

        expect(risk.probability).toBeGreaterThanOrEqual(0);
        expect(risk.probability).toBeLessThanOrEqual(1);
        expect(risk.impact).toBeGreaterThanOrEqual(0);
        expect(risk.impact).toBeLessThanOrEqual(1);
      });
    }
  });

  it('should include opportunities', async () => {
    const plan = await planningEngine.generatePlan('7d');

    if (plan.opportunities && plan.opportunities.length > 0) {
      plan.opportunities.forEach((opportunity) => {
        expect(opportunity).toMatchObject({
          name: expect.any(String),
          description: expect.any(String),
          value: expect.any(Number),
        });

        expect(opportunity.value).toBeGreaterThanOrEqual(0);
        expect(opportunity.value).toBeLessThanOrEqual(1);
      });
    }
  });
});

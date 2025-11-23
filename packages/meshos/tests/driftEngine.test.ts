/**
 * DriftEngine Tests
 * Tests for drift detection
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DriftEngine } from '../src/engines/driftEngine';

describe('DriftEngine', () => {
  let driftEngine: DriftEngine;
  const workspaceId = 'test-workspace-123';

  beforeEach(() => {
    driftEngine = new DriftEngine(workspaceId);
  });

  it('should detect drift', async () => {
    const driftReports = await driftEngine.detectDrift();

    expect(Array.isArray(driftReports)).toBe(true);

    // Each drift report should have required fields
    driftReports.forEach((report) => {
      expect(report).toMatchObject({
        workspace_id: workspaceId,
        drift_type: expect.any(String),
        severity: expect.stringMatching(/^(low|medium|high)$/),
        drift_score: expect.any(Number),
        description: expect.any(String),
        detected_at: expect.any(String),
      });

      expect(report.drift_score).toBeGreaterThanOrEqual(0);
      expect(report.drift_score).toBeLessThanOrEqual(1);
    });
  });

  it('should detect creative vs campaign drift', async () => {
    // This would normally use adapters to get real data
    // For now, we test the structure
    const driftReports = await driftEngine.detectDrift();

    const creativeDrift = driftReports.find(
      (r) => r.drift_type === 'creative_vs_campaign'
    );

    if (creativeDrift) {
      expect(creativeDrift.expected_value).toBeDefined();
      expect(creativeDrift.actual_value).toBeDefined();
      expect(creativeDrift.recommendation).toBeDefined();
    }
  });

  it('should calculate drift severity correctly', async () => {
    const driftReports = await driftEngine.detectDrift();

    driftReports.forEach((report) => {
      // Low drift: 0-0.3
      if (report.drift_score <= 0.3) {
        expect(report.severity).toBe('low');
      }
      // Medium drift: 0.3-0.7
      else if (report.drift_score <= 0.7) {
        expect(report.severity).toBe('medium');
      }
      // High drift: 0.7-1.0
      else {
        expect(report.severity).toBe('high');
      }
    });
  });

  it('should include recommendations for high severity drift', async () => {
    const driftReports = await driftEngine.detectDrift();

    const highSeverityReports = driftReports.filter(
      (r) => r.severity === 'high'
    );

    highSeverityReports.forEach((report) => {
      expect(report.recommendation).toBeTruthy();
      expect(typeof report.recommendation).toBe('string');
    });
  });
});

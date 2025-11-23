/**
 * End-to-End Tests for Core Awareness Layer
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import {
  runAwarenessCycle,
  ingest,
  runWatchers,
  createPeriodicSnapshot,
  reason,
  predict,
  recommend,
  calculateAllScores,
  generateRiskAlerts,
  generateOpportunityAlerts,
  generateMismatchAlerts,
  type AwarenessEvent,
} from '../src/index';

describe('Core Awareness Layer - End to End', () => {
  const testUserId = 'test-user-123';
  const testWorkspaceId = 'test-workspace-456';

  describe('Event Ingestion', () => {
    it('should ingest a single event', async () => {
      const event: Omit<AwarenessEvent, 'id' | 'createdAt'> = {
        workspaceId: testWorkspaceId,
        userId: testUserId,
        eventType: 'campaign_sent',
        sourceSystem: 'email_engine',
        payload: {
          campaignId: 'campaign-1',
          sent: 100,
        },
        metadata: {},
      };

      await expect(ingest(event)).resolves.not.toThrow();
    });
  });

  describe('Watchers', () => {
    it('should run all watchers without errors', async () => {
      const results = await runWatchers(testUserId, testWorkspaceId);

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);

      // Each watcher should return findings and events
      for (const result of results) {
        expect(result).toHaveProperty('watcherType');
        expect(result).toHaveProperty('findings');
        expect(result).toHaveProperty('eventsGenerated');
      }
    });
  });

  describe('Reasoning Engine', () => {
    it('should detect correlations, mismatches, opportunities, and risks', async () => {
      const mockInput = {
        fusionContext: {
          fusionId: 'fusion-1',
          contextualSignals: [],
          orchestrationHints: [],
        },
        cmgFingerprints: [
          {
            fingerprintId: 'fp-1',
            quality_score: 0.85,
            consistency_score: 0.75,
            evolution_rate: 0.6,
            creative_motifs: ['indie', 'electronic', 'experimental'],
          },
        ],
        migClusters: [
          {
            clusterId: 'cluster-1',
            scene: 'UK-Indie-Electronic',
            microgenre: 'indie electronic',
            momentum: 0.8,
          },
        ],
        identityProfile: {
          profileId: 'profile-1',
          narrative: {
            themes: ['indie', 'electronic'],
            archetype: 'The Innovator',
          },
          cohesionScore: 0.82,
        },
        autopilotStates: [
          {
            missionId: 'mission-1',
            isActive: true,
            currentPhase: 'outreach',
          },
        ],
        malStates: [
          {
            flowId: 'flow-1',
            isActive: true,
            currentStep: 2,
          },
        ],
        campaignMetrics: [
          {
            campaignId: 'campaign-1',
            sent: 100,
            openRate: 0.35,
            replyRate: 0.12,
            coverage: 5,
            replied: 12,
          },
        ],
        creativeAssets: [
          {
            assetId: 'asset-1',
            type: 'track',
            quality: 0.9,
          },
        ],
        recentEvents: [],
      };

      const result = await reason(mockInput);

      expect(result).toHaveProperty('correlations');
      expect(result).toHaveProperty('mismatches');
      expect(result).toHaveProperty('opportunities');
      expect(result).toHaveProperty('risks');
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('confidence');

      expect(result.correlations).toBeInstanceOf(Array);
      expect(result.insights).toBeInstanceOf(Array);
    });
  });

  describe('Prediction Engine', () => {
    it('should generate short-term and medium-term trajectories', async () => {
      const mockInput = {
        campaignMetrics: [
          {
            campaignId: 'campaign-1',
            sent: 100,
            openRate: 0.35,
            replyRate: 0.12,
            coverage: 5,
            replied: 12,
          },
        ],
        migClusters: [
          {
            clusterId: 'cluster-1',
            scene: 'UK-Indie-Electronic',
            microgenre: 'indie electronic',
            momentum: 0.8,
          },
        ],
        cmgFingerprints: [
          {
            fingerprintId: 'fp-1',
            quality_score: 0.85,
            consistency_score: 0.75,
            evolution_rate: 0.6,
            creative_motifs: ['indie', 'electronic'],
          },
        ],
        autopilotStates: [],
        malStates: [],
      };

      const result = await predict(mockInput);

      expect(result).toHaveProperty('shortTermTrajectory');
      expect(result).toHaveProperty('mediumTermTrajectory');
      expect(result).toHaveProperty('scores');

      expect(result.shortTermTrajectory).toHaveProperty('direction');
      expect(result.shortTermTrajectory).toHaveProperty('projectedMetrics');
      expect(result.shortTermTrajectory).toHaveProperty('confidence');
      expect(result.shortTermTrajectory).toHaveProperty('inflectionPoints');
    });
  });

  describe('Metrics Calculation', () => {
    it('should calculate all scores', () => {
      const mockData = {
        cmgFingerprints: [
          {
            fingerprintId: 'fp-1',
            quality_score: 0.85,
            consistency_score: 0.75,
            evolution_rate: 0.6,
            creative_motifs: ['indie', 'electronic'],
          },
        ],
        migClusters: [
          {
            clusterId: 'cluster-1',
            scene: 'UK-Indie-Electronic',
            microgenre: 'indie electronic',
            momentum: 0.8,
          },
        ],
        identityProfile: {
          profileId: 'profile-1',
          narrative: {
            themes: ['indie', 'electronic'],
            archetype: 'The Innovator',
          },
          cohesionScore: 0.82,
        },
        autopilotStates: [],
        malStates: [],
        campaignMetrics: [
          {
            campaignId: 'campaign-1',
            sent: 100,
            openRate: 0.35,
            replyRate: 0.12,
            coverage: 5,
            replied: 12,
          },
        ],
      };

      const scores = calculateAllScores(mockData);

      expect(scores).toHaveProperty('momentum');
      expect(scores).toHaveProperty('identity_cohesion');
      expect(scores).toHaveProperty('scene_alignment');
      expect(scores).toHaveProperty('creative_quality');
      expect(scores).toHaveProperty('press_effectiveness');
      expect(scores).toHaveProperty('burnout_risk');
      expect(scores).toHaveProperty('fatigue_risk');
      expect(scores).toHaveProperty('lift_potential');
      expect(scores).toHaveProperty('freshness');

      // All scores should be between 0 and 1
      Object.values(scores).forEach((score) => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Alert Generation', () => {
    it('should generate alerts from risks', () => {
      const mockRisks = [
        {
          id: 'risk-1',
          type: 'campaign_stall',
          description: 'Campaign performance declining',
          severity: 'medium' as const,
          probability: 0.75,
          mitigationActions: ['Review targeting', 'Refresh creative'],
          data: {},
        },
      ];

      const alerts = generateRiskAlerts(mockRisks);

      expect(alerts).toBeInstanceOf(Array);
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]).toHaveProperty('type', 'risk');
      expect(alerts[0]).toHaveProperty('severity');
      expect(alerts[0]).toHaveProperty('title');
      expect(alerts[0]).toHaveProperty('suggestedActions');
    });

    it('should generate alerts from opportunities', () => {
      const mockOpportunities = [
        {
          id: 'opp-1',
          type: 'scene_spike',
          description: 'High momentum in UK Indie scene',
          confidence: 0.85,
          potentialImpact: 'high' as const,
          window: {
            opensAt: new Date(),
            duration: '2-4 weeks',
          },
          suggestedActions: ['Prioritize UK Indie outreach', 'Create scene-specific assets'],
          data: {},
        },
      ];

      const alerts = generateOpportunityAlerts(mockOpportunities);

      expect(alerts).toBeInstanceOf(Array);
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0]).toHaveProperty('type', 'opportunity');
      expect(alerts[0]).toHaveProperty('expiresAt');
    });
  });

  describe('Complete Awareness Cycle', () => {
    it('should run full awareness cycle without errors', async () => {
      // Note: This test requires a working database connection
      // In a real environment, this would exercise the complete pipeline

      try {
        const result = await runAwarenessCycle(testUserId, testWorkspaceId);

        expect(result).toHaveProperty('snapshot');
        expect(result).toHaveProperty('recommendations');
        expect(result).toHaveProperty('alerts');
        expect(result).toHaveProperty('signals');

        expect(result.snapshot).toHaveProperty('id');
        expect(result.recommendations).toBeInstanceOf(Array);
        expect(result.alerts).toBeInstanceOf(Array);
        expect(result.signals).toBeInstanceOf(Array);
      } catch (error) {
        // If database is not available, test should gracefully note this
        if (error instanceof Error && error.message.includes('database')) {
          console.log('Skipping full cycle test - database not available');
        } else {
          throw error;
        }
      }
    }, 30000); // 30 second timeout for full cycle
  });

  describe('Periodic Snapshot', () => {
    it('should create a periodic snapshot', async () => {
      try {
        await createPeriodicSnapshot(testUserId, testWorkspaceId);
        // If no error, test passes
        expect(true).toBe(true);
      } catch (error) {
        // Database connection errors are acceptable in test environment
        if (error instanceof Error && error.message.includes('database')) {
          console.log('Skipping snapshot test - database not available');
        } else {
          throw error;
        }
      }
    });
  });
});

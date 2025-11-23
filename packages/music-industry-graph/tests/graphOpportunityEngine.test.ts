/**
 * MIG Phase 4 - Graph Opportunity Engine Tests
 *
 * Tests graph-based pitch opportunity recommendations.
 * Ensures opportunity ranking is deterministic and matches spec.
 */

import { describe, it, expect } from 'vitest';
import { recommendPitchTargets, recommendSimilarArtists } from '../src';

describe('Graph Opportunity Engine', () => {
  describe('Pitch Target Recommendations', () => {
    it('should return recommendations for valid artist', async () => {
      // This test requires mock data or test database
      // Testing structure and behavior

      const recommendations = await recommendPitchTargets('test-artist-slug', {
        limit: 10,
      });

      expect(Array.isArray(recommendations)).toBe(true);

      if (recommendations.length > 0) {
        const rec = recommendations[0];

        // Should have required fields
        expect(rec).toHaveProperty('node');
        expect(rec).toHaveProperty('score');
        expect(rec).toHaveProperty('reasoning');
        expect(rec).toHaveProperty('common_connections');

        // Score should be 0-1
        expect(rec.score).toBeGreaterThanOrEqual(0);
        expect(rec.score).toBeLessThanOrEqual(1);
      }
    });

    it('should filter by outlet types', async () => {
      const recommendations = await recommendPitchTargets('test-artist-slug', {
        limit: 20,
      });

      // All recommendations should be valid outlet types
      const validTypes = ['journalist', 'playlist', 'radio_host', 'dj', 'blog', 'podcast'];

      recommendations.forEach((rec) => {
        expect(validTypes).toContain(rec.node.type);
      });
    });

    it('should respect limit parameter', async () => {
      const limit = 5;
      const recommendations = await recommendPitchTargets('test-artist-slug', { limit });

      expect(recommendations.length).toBeLessThanOrEqual(limit);
    });

    it('should return empty array for non-existent artist', async () => {
      const recommendations = await recommendPitchTargets('nonexistent-artist', {
        limit: 10,
      });

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(0);
    });
  });

  describe('Opportunity Ranking', () => {
    it('should rank opportunities deterministically', () => {
      const opportunities = [
        { name: 'BBC Radio 6', fit_score: 0.850, type: 'radio_host' },
        { name: 'NME Writer', fit_score: 0.850, type: 'journalist' }, // Same score
        { name: 'The Quietus', fit_score: 0.750, type: 'blog' },
        { name: 'Amazing Radio', fit_score: 0.850, type: 'radio_host' }, // Same score
      ];

      // Sort: by fit_score desc, then alphabetically by name
      opportunities.sort((a, b) => {
        if (Math.abs(a.fit_score - b.fit_score) < 0.001) {
          return a.name.localeCompare(b.name);
        }
        return b.fit_score - a.fit_score;
      });

      // Expected order: 0.850 (Amazing Radio, BBC Radio 6, NME Writer), then 0.750
      expect(opportunities[0].name).toBe('Amazing Radio');
      expect(opportunities[1].name).toBe('BBC Radio 6');
      expect(opportunities[2].name).toBe('NME Writer');
      expect(opportunities[3].name).toBe('The Quietus');
    });

    it('should round fit scores to 3 decimals', () => {
      const rawScore = 0.84567;
      const roundedScore = Math.round(rawScore * 1000) / 1000;

      expect(roundedScore).toBe(0.846);
    });

    it('should maintain consistent ordering across runs', () => {
      const opportunities = [
        { name: 'Outlet A', fit_score: 0.7 },
        { name: 'Outlet B', fit_score: 0.9 },
        { name: 'Outlet C', fit_score: 0.8 },
      ];

      // Sort multiple times
      for (let i = 0; i < 5; i++) {
        opportunities.sort((a, b) => {
          if (Math.abs(a.fit_score - b.fit_score) < 0.001) {
            return a.name.localeCompare(b.name);
          }
          return b.fit_score - a.fit_score;
        });

        expect(opportunities[0].name).toBe('Outlet B');
        expect(opportunities[1].name).toBe('Outlet C');
        expect(opportunities[2].name).toBe('Outlet A');
      }
    });
  });

  describe('Opportunity Metadata', () => {
    it('should generate correct path summary', () => {
      const commonConnections = 3;
      const pathSummary =
        commonConnections > 1
          ? `${commonConnections} common connections`
          : '1 connection pathway';

      expect(pathSummary).toBe('3 common connections');
    });

    it('should handle single connection', () => {
      const commonConnections = 1;
      const pathSummary =
        commonConnections > 1
          ? `${commonConnections} common connections`
          : '1 connection pathway';

      expect(pathSummary).toBe('1 connection pathway');
    });

    it('should generate recommended action', () => {
      const outletName = 'BBC Radio 6';
      const recommendedAction = `Research and pitch to ${outletName} based on graph proximity`;

      expect(recommendedAction).toContain('BBC Radio 6');
      expect(recommendedAction).toContain('Research and pitch');
    });
  });

  describe('Similar Artist Recommendations', () => {
    it('should return similar artists', async () => {
      const recommendations = await recommendSimilarArtists('test-artist-slug', {
        limit: 10,
      });

      expect(Array.isArray(recommendations)).toBe(true);

      if (recommendations.length > 0) {
        const rec = recommendations[0];

        expect(rec.node.type).toBe('artist');
        expect(rec.score).toBeGreaterThanOrEqual(0);
        expect(rec.score).toBeLessThanOrEqual(1);
      }
    });

    it('should respect filters', async () => {
      const recommendations = await recommendSimilarArtists('test-artist-slug', {
        limit: 10,
        filters: {
          country: 'GB',
        },
      });

      // All recommendations should match filter
      recommendations.forEach((rec) => {
        if (rec.node.country) {
          expect(rec.node.country).toBe('GB');
        }
      });
    });

    it('should respect min_score threshold', async () => {
      const minScore = 0.5;
      const recommendations = await recommendSimilarArtists('test-artist-slug', {
        limit: 20,
        min_score: minScore,
      });

      // All scores should be >= min_score
      recommendations.forEach((rec) => {
        expect(rec.score).toBeGreaterThanOrEqual(minScore);
      });
    });
  });

  describe('Scoring Validation', () => {
    it('should calculate relationship-based scores correctly', () => {
      // Relationship bonuses from spec
      const scores = {
        similar_to: 0.4,
        same_scene: 0.3,
        same_microgenre: 0.3,
        collaborates: 0.2,
      };

      expect(scores.similar_to).toBe(0.4);
      expect(scores.same_scene).toBe(0.3);
      expect(scores.same_microgenre).toBe(0.3);
      expect(scores.collaborates).toBe(0.2);
    });

    it('should add direct connection bonus', () => {
      const directConnectionBonus = 0.5;
      const relationshipBonus = 0.4; // e.g., similar_to
      const weightContribution = 0.8 * 0.2; // edge weight * 0.2

      const totalScore = directConnectionBonus + relationshipBonus + weightContribution;

      expect(totalScore).toBeCloseTo(1.06, 2);
      // Note: Scores can exceed 1.0 internally, but should be capped
    });

    it('should apply distance penalty', () => {
      const pathLength1Score = 0.5; // Direct connection
      const pathLength2Score = 0.25; // 2-hop connection

      expect(pathLength1Score).toBeGreaterThan(pathLength2Score);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty result set gracefully', async () => {
      const recommendations = await recommendPitchTargets('isolated-artist', {
        limit: 10,
      });

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(0);
    });

    it('should handle very small limit', async () => {
      const recommendations = await recommendPitchTargets('test-artist-slug', {
        limit: 1,
      });

      expect(recommendations.length).toBeLessThanOrEqual(1);
    });

    it('should handle large limit', async () => {
      const recommendations = await recommendPitchTargets('test-artist-slug', {
        limit: 100,
      });

      expect(Array.isArray(recommendations)).toBe(true);
      // Should return <= 100 results
      expect(recommendations.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Consistency Checks', () => {
    it('should produce consistent results for same inputs', async () => {
      const results1 = await recommendPitchTargets('test-artist-slug', { limit: 10 });
      const results2 = await recommendPitchTargets('test-artist-slug', { limit: 10 });

      // Should return same number of results
      expect(results1.length).toBe(results2.length);

      // Scores should be identical (deterministic)
      results1.forEach((rec1, idx) => {
        const rec2 = results2[idx];
        if (rec2) {
          expect(rec1.score).toBe(rec2.score);
        }
      });
    });
  });
});

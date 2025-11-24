/**
 * Event Weights Tests
 */

import { calculateEventWeight, applyWeights } from '../src/eventWeights';
import type { RCFNormalizedEvent } from '../src/types';

describe('eventWeights', () => {
  describe('calculateEventWeight', () => {
    it('should calculate weight for playlist add based on followers', () => {
      const event: RCFNormalizedEvent = {
        event_type: 'playlist_add',
        artist_slug: 'test-artist',
        entity_slug: 'test-playlist',
        scene_slug: null,
        metadata: {
          playlistName: 'Major Playlist',
          playlistId: 'pl-1',
          followerCount: 2000000, // > 1M = tier1
        },
        weight: 1.0,
      };

      const weight = calculateEventWeight(event);

      // Base weight: 0.6
      // tier1 multiplier: 1.5
      // Expected: 0.6 * 1.5 = 0.9
      expect(weight).toBeCloseTo(0.9, 1);
    });

    it('should calculate weight for press feature based on tier', () => {
      const event: RCFNormalizedEvent = {
        event_type: 'press_feature',
        artist_slug: 'test-artist',
        entity_slug: 'nme',
        scene_slug: null,
        metadata: {
          publication: 'NME',
          publicationTier: 'tier1',
          articleTitle: 'Test Article',
        },
        weight: 1.0,
      };

      const weight = calculateEventWeight(event);

      // Base weight: 0.7
      // tier1 multiplier: 1.5
      // Expected: 0.7 * 1.5 = 1.05, but capped at max 1.0
      expect(weight).toBe(1.0);
    });

    it('should apply weight caps', () => {
      const event: RCFNormalizedEvent = {
        event_type: 'blog_post',
        artist_slug: 'test-artist',
        entity_slug: 'test-blog',
        scene_slug: null,
        metadata: {
          blogName: 'Test Blog',
        },
        weight: 1.0,
      };

      const weight = calculateEventWeight(event);

      // Base weight: 0.5
      // Max cap: 0.8
      expect(weight).toBeLessThanOrEqual(0.8);
    });

    it('should handle creative breakthrough scores', () => {
      const event: RCFNormalizedEvent = {
        event_type: 'creative_breakthrough',
        artist_slug: 'test-artist',
        entity_slug: null,
        scene_slug: null,
        metadata: {
          breakthroughType: 'motif',
          description: 'Novel chord progression',
          cmgScore: 0.9, // High score
        },
        weight: 1.0,
      };

      const weight = calculateEventWeight(event);

      // Base weight: 0.8
      // high_score multiplier: 1.4 (score > 0.8)
      // Expected: 0.8 * 1.4 = 1.12, but capped at max 1.0
      expect(weight).toBe(1.0);
    });

    it('should handle scene pulse changes with delta', () => {
      const event: RCFNormalizedEvent = {
        event_type: 'scene_pulse_change',
        artist_slug: null,
        entity_slug: null,
        scene_slug: 'uk-garage',
        metadata: {
          sceneName: 'UK Garage',
          oldPulse: 50,
          newPulse: 65,
          delta: 15, // Large delta (> 10)
        },
        weight: 1.0,
      };

      const weight = calculateEventWeight(event);

      // Base weight: 0.5
      // large_delta multiplier: 1.4
      // Expected: 0.5 * 1.4 = 0.7
      expect(weight).toBeCloseTo(0.7, 1);
    });

    it('should return default weight for unknown event type', () => {
      const event: RCFNormalizedEvent = {
        event_type: 'unknown_type' as any,
        artist_slug: null,
        entity_slug: null,
        scene_slug: null,
        metadata: {},
        weight: 1.0,
      };

      const weight = calculateEventWeight(event);

      expect(weight).toBe(0.5); // Default fallback
    });
  });

  describe('applyWeights', () => {
    it('should apply weights to multiple events', () => {
      const events: RCFNormalizedEvent[] = [
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-1',
          entity_slug: 'playlist-1',
          scene_slug: null,
          metadata: { playlistName: 'Test', followerCount: 500000 },
          weight: 1.0,
        },
        {
          event_type: 'press_feature',
          artist_slug: 'artist-2',
          entity_slug: 'publication-1',
          scene_slug: null,
          metadata: { publication: 'Test', publicationTier: 'tier2' },
          weight: 1.0,
        },
      ];

      const weighted = applyWeights(events);

      expect(weighted).toHaveLength(2);
      expect(weighted[0].weight).toBeGreaterThan(0);
      expect(weighted[1].weight).toBeGreaterThan(0);
      expect(weighted[0].weight).not.toBe(1.0); // Should have changed
      expect(weighted[1].weight).not.toBe(1.0); // Should have changed
    });
  });
});

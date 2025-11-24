/**
 * Event Normalizer Tests
 */

import { normalizeEvent, normalizeEvents, mergeDuplicates } from '../src/eventNormalizer';
import type { RCFIngestedEvent, RCFNormalizedEvent } from '../src/types';

describe('eventNormalizer', () => {
  describe('normalizeEvent', () => {
    it('should normalize a valid playlist add event', () => {
      const ingestedEvent: RCFIngestedEvent = {
        event_type: 'playlist_add',
        artist_slug: 'test-artist',
        entity_slug: 'test-playlist',
        scene_slug: 'uk-garage',
        metadata: {
          playlistName: 'Fresh Finds',
          playlistId: 'playlist-123',
          curator: 'Test Curator',
          followerCount: 50000,
        },
        weight: 0.7,
      };

      const normalized = normalizeEvent(ingestedEvent);

      expect(normalized).not.toBeNull();
      expect(normalized?.event_type).toBe('playlist_add');
      expect(normalized?.artist_slug).toBe('test-artist');
      expect(normalized?.weight).toBe(0.7);
      expect(normalized?.metadata).toHaveProperty('playlistName', 'Fresh Finds');
    });

    it('should return null for invalid event type', () => {
      const ingestedEvent: RCFIngestedEvent = {
        event_type: 'invalid_type' as any,
        metadata: {},
      };

      const normalized = normalizeEvent(ingestedEvent);

      expect(normalized).toBeNull();
    });

    it('should return null for missing metadata', () => {
      const ingestedEvent: RCFIngestedEvent = {
        event_type: 'playlist_add',
        metadata: null as any,
      };

      const normalized = normalizeEvent(ingestedEvent);

      expect(normalized).toBeNull();
    });

    it('should apply default weight if not provided', () => {
      const ingestedEvent: RCFIngestedEvent = {
        event_type: 'press_feature',
        metadata: {
          publication: 'NME',
        },
      };

      const normalized = normalizeEvent(ingestedEvent);

      expect(normalized?.weight).toBe(1.0);
    });
  });

  describe('normalizeEvents', () => {
    it('should normalize multiple events', () => {
      const events: RCFIngestedEvent[] = [
        {
          event_type: 'playlist_add',
          metadata: { playlistName: 'Test 1' },
        },
        {
          event_type: 'press_feature',
          metadata: { publication: 'Test 2' },
        },
      ];

      const normalized = normalizeEvents(events);

      expect(normalized).toHaveLength(2);
      expect(normalized[0].event_type).toBe('playlist_add');
      expect(normalized[1].event_type).toBe('press_feature');
    });

    it('should filter out invalid events', () => {
      const events: RCFIngestedEvent[] = [
        {
          event_type: 'playlist_add',
          metadata: { playlistName: 'Valid' },
        },
        {
          event_type: 'invalid' as any,
          metadata: { test: 'Invalid' },
        },
        {
          event_type: 'press_feature',
          metadata: null as any, // Invalid: no metadata
        },
      ];

      const normalized = normalizeEvents(events);

      expect(normalized).toHaveLength(1);
      expect(normalized[0].event_type).toBe('playlist_add');
    });
  });

  describe('mergeDuplicates', () => {
    it('should remove duplicate events', () => {
      const events: RCFNormalizedEvent[] = [
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-1',
          entity_slug: 'playlist-1',
          scene_slug: null,
          metadata: { playlistName: 'Test 1' },
          weight: 0.5,
        },
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-1',
          entity_slug: 'playlist-1',
          scene_slug: null,
          metadata: { playlistName: 'Test 1 (Duplicate)' },
          weight: 0.7, // Higher weight - should be kept
        },
      ];

      const unique = mergeDuplicates(events);

      expect(unique).toHaveLength(1);
      expect(unique[0].weight).toBe(0.7); // Higher weight version kept
    });

    it('should keep events with different signatures', () => {
      const events: RCFNormalizedEvent[] = [
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-1',
          entity_slug: 'playlist-1',
          scene_slug: null,
          metadata: {},
          weight: 0.5,
        },
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-2', // Different artist
          entity_slug: 'playlist-1',
          scene_slug: null,
          metadata: {},
          weight: 0.5,
        },
      ];

      const unique = mergeDuplicates(events);

      expect(unique).toHaveLength(2);
    });
  });
});

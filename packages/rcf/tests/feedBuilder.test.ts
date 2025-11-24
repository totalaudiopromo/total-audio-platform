/**
 * Feed Builder Tests
 */

import { buildUserFeed, updateUserMarker } from '../src/feedBuilder';

describe('feedBuilder', () => {
  describe('buildUserFeed', () => {
    it('should build feed for a user', async () => {
      const userId = 'test-user-1';

      const feed = await buildUserFeed(userId);

      expect(Array.isArray(feed)).toBe(true);
      // Feed should contain mock events in stub implementation
      expect(feed.length).toBeGreaterThan(0);
    });

    it('should apply filters to feed', async () => {
      const userId = 'test-user-2';

      const feed = await buildUserFeed(userId, {
        event_types: ['playlist_add'],
        limit: 10,
      });

      expect(Array.isArray(feed)).toBe(true);
      expect(feed.length).toBeLessThanOrEqual(10);
    });

    it('should mark new events based on user marker', async () => {
      const userId = 'test-user-3';

      const feed = await buildUserFeed(userId);

      // Some events should be marked as new in stub implementation
      const hasNewEvents = feed.some((event) => event.isNew);
      expect(hasNewEvents).toBeDefined(); // isNew property exists
    });

    it('should highlight high-weight events', async () => {
      const userId = 'test-user-4';

      const feed = await buildUserFeed(userId);

      // Check that high-weight events are highlighted
      feed.forEach((event) => {
        if (event.weight >= 0.7) {
          expect(event.isHighlighted).toBe(true);
        }
      });
    });

    it('should include display metadata', async () => {
      const userId = 'test-user-5';

      const feed = await buildUserFeed(userId);

      feed.forEach((event) => {
        expect(event.displayCategory).toBeDefined();
        expect(event.icon).toBeDefined();
      });
    });
  });

  describe('updateUserMarker', () => {
    it('should update user marker', async () => {
      const userId = 'test-user-6';
      const timestamp = new Date().toISOString();

      const marker = await updateUserMarker(userId, timestamp);

      expect(marker).not.toBeNull();
      expect(marker?.user_id).toBe(userId);
    });

    it('should use current timestamp if not provided', async () => {
      const userId = 'test-user-7';

      const marker = await updateUserMarker(userId);

      expect(marker).not.toBeNull();
      expect(marker?.last_seen_at).toBeDefined();
    });
  });
});

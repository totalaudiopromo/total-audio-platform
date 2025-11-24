/**
 * Subscription Engine Tests
 */

import {
  createDefaultSubscription,
  getUserSubscription,
  updateUserSubscription,
  addEventTypes,
  removeEventTypes,
  subscribeToArtist,
  unsubscribeFromArtist,
  DEFAULT_SUBSCRIPTION_TYPES,
} from '../src/subscriptionEngine';

describe('subscriptionEngine', () => {
  describe('createDefaultSubscription', () => {
    it('should create subscription with default event types', async () => {
      const userId = 'test-user-1';

      const subscription = await createDefaultSubscription(userId);

      expect(subscription).not.toBeNull();
      expect(subscription?.user_id).toBe(userId);
      expect(subscription?.subscribed_types).toEqual(DEFAULT_SUBSCRIPTION_TYPES);
      expect(subscription?.subscribed_artists).toEqual([]);
      expect(subscription?.subscribed_scenes).toEqual([]);
    });

    it('should include workspace ID if provided', async () => {
      const userId = 'test-user-2';
      const workspaceId = 'workspace-123';

      const subscription = await createDefaultSubscription(userId, workspaceId);

      expect(subscription?.workspace_id).toBe(workspaceId);
    });
  });

  describe('getUserSubscription', () => {
    it('should get user subscription', async () => {
      const userId = 'test-user-3';

      const subscription = await getUserSubscription(userId);

      expect(subscription).not.toBeNull();
      expect(subscription?.user_id).toBe(userId);
    });

    it('should create default subscription if not found', async () => {
      const userId = 'test-user-new';

      const subscription = await getUserSubscription(userId);

      // In stub implementation, always creates default
      expect(subscription).not.toBeNull();
      expect(subscription?.subscribed_types).toEqual(DEFAULT_SUBSCRIPTION_TYPES);
    });
  });

  describe('updateUserSubscription', () => {
    it('should update subscribed types', async () => {
      const userId = 'test-user-4';

      const subscription = await updateUserSubscription(userId, {
        subscribed_types: ['playlist_add', 'press_feature'],
      });

      expect(subscription).not.toBeNull();
      expect(subscription?.subscribed_types).toContain('playlist_add');
      expect(subscription?.subscribed_types).toContain('press_feature');
    });

    it('should deduplicate event types', async () => {
      const userId = 'test-user-5';

      const subscription = await updateUserSubscription(userId, {
        subscribed_types: [
          'playlist_add',
          'playlist_add', // Duplicate
          'press_feature',
        ],
      });

      // Should remove duplicates
      expect(subscription?.subscribed_types).toHaveLength(2);
    });

    it('should update subscribed artists', async () => {
      const userId = 'test-user-6';

      const subscription = await updateUserSubscription(userId, {
        subscribed_artists: ['artist-1', 'artist-2'],
      });

      expect(subscription?.subscribed_artists).toContain('artist-1');
      expect(subscription?.subscribed_artists).toContain('artist-2');
    });
  });

  describe('addEventTypes', () => {
    it('should add event types to existing subscription', async () => {
      const userId = 'test-user-7';

      const subscription = await addEventTypes(userId, ['blog_post', 'tweet']);

      expect(subscription).not.toBeNull();
      expect(subscription?.subscribed_types).toContain('blog_post');
      expect(subscription?.subscribed_types).toContain('tweet');
    });

    it('should not duplicate existing types', async () => {
      const userId = 'test-user-8';

      // Add types that are already in defaults
      const subscription = await addEventTypes(userId, ['playlist_add']);

      // Should not have duplicates
      const playlistCount = subscription?.subscribed_types.filter(
        (t) => t === 'playlist_add'
      ).length;
      expect(playlistCount).toBe(1);
    });
  });

  describe('removeEventTypes', () => {
    it('should remove event types from subscription', async () => {
      const userId = 'test-user-9';

      const subscription = await removeEventTypes(userId, ['playlist_add']);

      expect(subscription).not.toBeNull();
      expect(subscription?.subscribed_types).not.toContain('playlist_add');
    });
  });

  describe('subscribeToArtist', () => {
    it('should add artist to subscription', async () => {
      const userId = 'test-user-10';
      const artistSlug = 'test-artist-1';

      const subscription = await subscribeToArtist(userId, artistSlug);

      expect(subscription).not.toBeNull();
      expect(subscription?.subscribed_artists).toContain(artistSlug);
    });

    it('should not duplicate artists', async () => {
      const userId = 'test-user-11';
      const artistSlug = 'test-artist-2';

      await subscribeToArtist(userId, artistSlug);
      const subscription = await subscribeToArtist(userId, artistSlug);

      const count = subscription?.subscribed_artists.filter(
        (a) => a === artistSlug
      ).length;
      expect(count).toBe(1);
    });
  });

  describe('unsubscribeFromArtist', () => {
    it('should remove artist from subscription', async () => {
      const userId = 'test-user-12';
      const artistSlug = 'test-artist-3';

      await subscribeToArtist(userId, artistSlug);
      const subscription = await unsubscribeFromArtist(userId, artistSlug);

      expect(subscription?.subscribed_artists).not.toContain(artistSlug);
    });
  });
});

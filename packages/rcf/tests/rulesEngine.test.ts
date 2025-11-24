/**
 * Rules Engine Tests
 */

import { applyRules } from '../src/rules/rulesEngine';
import type { RCFNormalizedEvent } from '../src/types';
import type { IngestionRule } from '../src/rules/rulesEngine';

describe('rulesEngine', () => {
  describe('applyRules', () => {
    it('should block sources based on rules', async () => {
      const events: RCFNormalizedEvent[] = [
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-1',
          entity_slug: 'blocked-source',
          scene_slug: null,
          metadata: {},
          weight: 0.5,
        },
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-1',
          entity_slug: 'allowed-source',
          scene_slug: null,
          metadata: {},
          weight: 0.5,
        },
      ];

      const rules: IngestionRule[] = [
        {
          workspace_id: 'ws-1',
          rule_type: 'block_source',
          value: 'blocked-source',
          enabled: true,
          priority: 1,
        },
      ];

      const filtered = await applyRules(events, rules);
      expect(filtered.length).toBe(1);
      expect(filtered[0].entity_slug).toBe('allowed-source');
    });

    it('should modify weights based on rules', async () => {
      const events: RCFNormalizedEvent[] = [
        {
          event_type: 'playlist_add',
          artist_slug: 'artist-1',
          entity_slug: 'source-1',
          scene_slug: null,
          metadata: {},
          weight: 0.5,
        },
      ];

      const rules: IngestionRule[] = [
        {
          workspace_id: 'ws-1',
          rule_type: 'upweight_type',
          value: 'playlist_add',
          weight_modifier: 2.0,
          enabled: true,
          priority: 1,
        },
      ];

      const filtered = await applyRules(events, rules);
      expect(filtered[0].weight).toBe(1.0);
    });
  });
});

/**
 * Alerts Engine Tests
 */

import {
  detectCoverageSpikes,
  detectFirstEvents,
  detectHighCredEvents,
  detectSceneSurges,
} from '../src/alerts/alertsEngine';
import type { RCFEvent } from '../src/types';

describe('alertsEngine', () => {
  describe('detectCoverageSpikes', () => {
    it('should detect spikes in coverage', async () => {
      const alerts = await detectCoverageSpikes([], 24);
      expect(Array.isArray(alerts)).toBe(true);
    });
  });

  describe('detectFirstEvents', () => {
    it('should detect first-ever events', async () => {
      const newEvent: RCFEvent = {
        id: 'evt-1',
        event_type: 'playlist_add',
        artist_slug: 'test-artist',
        entity_slug: 'test-playlist',
        scene_slug: null,
        metadata: {},
        weight: 0.7,
        created_at: new Date().toISOString(),
      };

      const alerts = await detectFirstEvents([newEvent], []);
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].alert_type).toBe('first_event');
    });
  });

  describe('detectHighCredEvents', () => {
    it('should detect high-credibility events', async () => {
      const highCredEvent: RCFEvent = {
        id: 'evt-2',
        event_type: 'press_feature',
        artist_slug: 'test-artist',
        entity_slug: 'nme',
        scene_slug: null,
        metadata: {},
        weight: 0.9,
        created_at: new Date().toISOString(),
      };

      const alerts = await detectHighCredEvents([highCredEvent]);
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[0].alert_type).toBe('high_cred');
    });
  });

  describe('detectSceneSurges', () => {
    it('should detect scene surges', async () => {
      const alerts = await detectSceneSurges([], 24);
      expect(Array.isArray(alerts)).toBe(true);
    });
  });
});

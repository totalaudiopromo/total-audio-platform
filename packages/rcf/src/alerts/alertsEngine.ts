/**
 * Alerts Engine
 *
 * Generates alerts for:
 * - Coverage spikes
 * - Unusual patterns
 * - High-credibility events
 * - First-ever events
 * - Scene surges
 */

import type { RCFEvent } from '../types';
import { getLogger } from '../utils/logger';
import { hoursAgo, minutesAgo } from '../utils/time';

const logger = getLogger('[AlertsEngine]');

export type AlertType = 'spike' | 'threshold' | 'anomaly' | 'first_event' | 'high_cred' | 'scene_surge';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface RCFAlert {
  id?: string;
  workspace_id?: string | null;
  user_id?: string | null;
  artist_slug?: string | null;
  scene_slug?: string | null;
  entity_slug?: string | null;
  alert_type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  acknowledged?: boolean;
  created_at?: string;
}

export interface AlertRule {
  type: AlertType;
  threshold?: number;
  window_hours?: number;
  severity?: AlertSeverity;
}

/**
 * Detect coverage spikes
 */
export async function detectCoverageSpikes(
  events: RCFEvent[],
  lookbackHours: number = 24
): Promise<RCFAlert[]> {
  logger.debug(`Detecting coverage spikes in last ${lookbackHours} hours...`);

  const alerts: RCFAlert[] = [];
  const windowStart = hoursAgo(lookbackHours);

  // Filter events in window
  const recentEvents = events.filter((e) => new Date(e.created_at) >= new Date(windowStart));

  // Group by artist
  const artistEvents = groupByArtist(recentEvents);

  for (const [artistSlug, artistEventList] of artistEvents.entries()) {
    // Check if count exceeds threshold
    const count = artistEventList.length;
    const threshold = 5; // Default threshold

    if (count >= threshold) {
      // Calculate average events per hour in previous period
      const previousEvents = getPreviousPeriodEvents(events, artistSlug, lookbackHours);
      const previousAvg = previousEvents.length;

      // If current is 2x or more than previous, it's a spike
      if (count >= previousAvg * 2 && previousAvg > 0) {
        const percentIncrease = ((count - previousAvg) / previousAvg) * 100;

        alerts.push({
          artist_slug: artistSlug,
          alert_type: 'spike',
          severity: count >= threshold * 2 ? 'critical' : 'warning',
          title: `Coverage Spike for ${artistSlug}`,
          message: `${count} events in ${lookbackHours}h (${percentIncrease.toFixed(0)}% increase)`,
          payload: {
            event_count: count,
            previous_count: previousAvg,
            percent_increase: percentIncrease,
            events: artistEventList.map((e) => e.id),
          },
        });
      }
    }
  }

  logger.info(`Detected ${alerts.length} coverage spikes`);
  return alerts;
}

/**
 * Detect first-ever events for an artist
 */
export async function detectFirstEvents(
  events: RCFEvent[],
  historicalEvents: RCFEvent[]
): Promise<RCFAlert[]> {
  logger.debug('Detecting first-ever events...');

  const alerts: RCFAlert[] = [];

  for (const event of events) {
    if (!event.artist_slug) continue;

    // Check if this is first event of this type for this artist
    const previousSimilar = historicalEvents.find(
      (e) =>
        e.artist_slug === event.artist_slug &&
        e.event_type === event.event_type &&
        e.id !== event.id
    );

    if (!previousSimilar) {
      // This is a first!
      alerts.push({
        artist_slug: event.artist_slug,
        entity_slug: event.entity_slug,
        alert_type: 'first_event',
        severity: 'info',
        title: `First ${event.event_type.replace('_', ' ')} for ${event.artist_slug}`,
        message: `${event.artist_slug} got their first ${event.event_type.replace('_', ' ')}`,
        payload: {
          event_id: event.id,
          event_type: event.event_type,
          metadata: event.metadata,
        },
      });
    }
  }

  logger.info(`Detected ${alerts.length} first-ever events`);
  return alerts;
}

/**
 * Detect high-credibility events
 */
export async function detectHighCredEvents(events: RCFEvent[]): Promise<RCFAlert[]> {
  logger.debug('Detecting high-credibility events...');

  const alerts: RCFAlert[] = [];

  // High cred threshold
  const credThreshold = 0.8;

  for (const event of events) {
    if (event.weight >= credThreshold) {
      alerts.push({
        artist_slug: event.artist_slug,
        entity_slug: event.entity_slug,
        scene_slug: event.scene_slug,
        alert_type: 'high_cred',
        severity: event.weight >= 0.9 ? 'critical' : 'warning',
        title: `High-Impact ${event.event_type.replace('_', ' ')}`,
        message: `${event.artist_slug || 'Artist'} featured in high-credibility source (weight: ${event.weight.toFixed(2)})`,
        payload: {
          event_id: event.id,
          event_type: event.event_type,
          weight: event.weight,
          metadata: event.metadata,
        },
      });
    }
  }

  logger.info(`Detected ${alerts.length} high-credibility events`);
  return alerts;
}

/**
 * Detect scene surges
 */
export async function detectSceneSurges(
  events: RCFEvent[],
  lookbackHours: number = 24
): Promise<RCFAlert[]> {
  logger.debug('Detecting scene surges...');

  const alerts: RCFAlert[] = [];
  const windowStart = hoursAgo(lookbackHours);

  // Filter events in window
  const recentEvents = events.filter((e) => new Date(e.created_at) >= new Date(windowStart));

  // Group by scene
  const sceneEvents = groupByScene(recentEvents);

  for (const [sceneSlug, sceneEventList] of sceneEvents.entries()) {
    const count = sceneEventList.length;
    const threshold = 10; // Scenes need more events to trigger

    if (count >= threshold) {
      // Calculate previous period
      const previousEvents = getPreviousPeriodSceneEvents(events, sceneSlug, lookbackHours);
      const previousAvg = previousEvents.length;

      if (count >= previousAvg * 1.5 && previousAvg > 0) {
        const percentIncrease = ((count - previousAvg) / previousAvg) * 100;

        alerts.push({
          scene_slug: sceneSlug,
          alert_type: 'scene_surge',
          severity: count >= threshold * 2 ? 'warning' : 'info',
          title: `Scene Surge: ${sceneSlug}`,
          message: `${count} events in ${lookbackHours}h (${percentIncrease.toFixed(0)}% increase)`,
          payload: {
            event_count: count,
            previous_count: previousAvg,
            percent_increase: percentIncrease,
            unique_artists: new Set(sceneEventList.map((e) => e.artist_slug).filter(Boolean))
              .size,
          },
        });
      }
    }
  }

  logger.info(`Detected ${alerts.length} scene surges`);
  return alerts;
}

/**
 * Detect anomalies using statistical methods
 */
export async function detectAnomalies(
  events: RCFEvent[],
  historicalEvents: RCFEvent[]
): Promise<RCFAlert[]> {
  logger.debug('Detecting anomalies...');

  const alerts: RCFAlert[] = [];

  // Group by artist and calculate event frequency
  const artistEvents = groupByArtist(events);

  for (const [artistSlug, artistEventList] of artistEvents.entries()) {
    // Get historical average for this artist
    const historicalForArtist = historicalEvents.filter((e) => e.artist_slug === artistSlug);

    if (historicalForArtist.length < 10) {
      // Not enough historical data
      continue;
    }

    // Calculate mean and standard deviation of daily event counts
    const dailyCounts = calculateDailyCounts(historicalForArtist);
    const mean = calculateMean(dailyCounts);
    const stdDev = calculateStdDev(dailyCounts, mean);

    // Current count
    const currentCount = artistEventList.length;

    // If current count is > 2 standard deviations above mean, it's an anomaly
    if (currentCount > mean + stdDev * 2) {
      alerts.push({
        artist_slug: artistSlug,
        alert_type: 'anomaly',
        severity: 'warning',
        title: `Anomaly Detected: ${artistSlug}`,
        message: `Unusual activity detected (${currentCount} events, expected ~${mean.toFixed(0)})`,
        payload: {
          current_count: currentCount,
          expected_mean: mean,
          std_dev: stdDev,
          z_score: (currentCount - mean) / stdDev,
        },
      });
    }
  }

  logger.info(`Detected ${alerts.length} anomalies`);
  return alerts;
}

/**
 * Run all alert detection engines
 */
export async function detectAllAlerts(
  recentEvents: RCFEvent[],
  historicalEvents: RCFEvent[]
): Promise<RCFAlert[]> {
  logger.info('Running all alert detection engines...');

  const [spikes, firsts, highCred, surges, anomalies] = await Promise.all([
    detectCoverageSpikes(recentEvents),
    detectFirstEvents(recentEvents, historicalEvents),
    detectHighCredEvents(recentEvents),
    detectSceneSurges(recentEvents),
    detectAnomalies(recentEvents, historicalEvents),
  ]);

  const allAlerts = [...spikes, ...firsts, ...highCred, ...surges, ...anomalies];

  logger.info(`Generated ${allAlerts.length} total alerts`);

  return allAlerts;
}

// Helper functions

function groupByArtist(events: RCFEvent[]): Map<string, RCFEvent[]> {
  const groups = new Map<string, RCFEvent[]>();
  for (const event of events) {
    if (event.artist_slug) {
      if (!groups.has(event.artist_slug)) {
        groups.set(event.artist_slug, []);
      }
      groups.get(event.artist_slug)!.push(event);
    }
  }
  return groups;
}

function groupByScene(events: RCFEvent[]): Map<string, RCFEvent[]> {
  const groups = new Map<string, RCFEvent[]>();
  for (const event of events) {
    if (event.scene_slug) {
      if (!groups.has(event.scene_slug)) {
        groups.set(event.scene_slug, []);
      }
      groups.get(event.scene_slug)!.push(event);
    }
  }
  return groups;
}

function getPreviousPeriodEvents(
  allEvents: RCFEvent[],
  artistSlug: string,
  hours: number
): RCFEvent[] {
  const windowStart = hoursAgo(hours * 2);
  const windowEnd = hoursAgo(hours);

  return allEvents.filter(
    (e) =>
      e.artist_slug === artistSlug &&
      new Date(e.created_at) >= new Date(windowStart) &&
      new Date(e.created_at) <= new Date(windowEnd)
  );
}

function getPreviousPeriodSceneEvents(
  allEvents: RCFEvent[],
  sceneSlug: string,
  hours: number
): RCFEvent[] {
  const windowStart = hoursAgo(hours * 2);
  const windowEnd = hoursAgo(hours);

  return allEvents.filter(
    (e) =>
      e.scene_slug === sceneSlug &&
      new Date(e.created_at) >= new Date(windowStart) &&
      new Date(e.created_at) <= new Date(windowEnd)
  );
}

function calculateDailyCounts(events: RCFEvent[]): number[] {
  // Group events by day and count
  const dayGroups = new Map<string, number>();

  for (const event of events) {
    const day = new Date(event.created_at).toISOString().split('T')[0];
    dayGroups.set(day, (dayGroups.get(day) || 0) + 1);
  }

  return Array.from(dayGroups.values());
}

function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
}

export default {
  detectCoverageSpikes,
  detectFirstEvents,
  detectHighCredEvents,
  detectSceneSurges,
  detectAnomalies,
  detectAllAlerts,
};

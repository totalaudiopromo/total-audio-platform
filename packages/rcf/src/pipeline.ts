/**
 * RCF Pipeline
 *
 * Orchestrates the complete RCF ingestion pipeline:
 * 1. Run all ingestors
 * 2. Normalize events
 * 3. Apply weights
 * 4. Publish to database
 * 5. Broadcast to realtime
 */

import type { IngestorResult, PipelineResult, RCFIngestedEvent } from './types';
import { getLogger } from './utils/logger';
import { measureTime } from './utils/time';

// Import ingestors
import { ingestPlaylistAdds, ingestPlaylistPositionChanges } from './eventIngestors/playlistIngestor';
import { ingestPressFeatures } from './eventIngestors/pressIngestor';
import { ingestRadioSpins } from './eventIngestors/radioIngestor';
import { ingestBlogPosts } from './eventIngestors/blogIngestor';
import { ingestMIGConnections, ingestTrendingNodes } from './eventIngestors/migIngestor';
import { ingestScenePulseChanges, ingestSceneTrendSpikes } from './eventIngestors/scenesIngestor';
import { ingestCreativeBreakthroughs } from './eventIngestors/cmgIngestor';
import {
  ingestAutopilotEvents,
  ingestTrackerEvents,
  ingestCoverageSpikes,
} from './eventIngestors/campaignIngestor';
import { ingestCommunityActivity } from './eventIngestors/communityIngestor';
import { ingestAllExternalSources } from './eventIngestors/externalSourcesIngestor';

// Import processors
import { normalizeEvents, mergeDuplicates } from './eventNormalizer';
import { applyWeights } from './eventWeights';
import { publishEvents } from './eventPublisher';

const logger = getLogger('[Pipeline]');

/**
 * Run complete RCF pipeline
 */
export async function runPipeline(): Promise<PipelineResult> {
  logger.info('🚀 Starting RCF pipeline...');

  const { result, duration_ms } = await measureTime(async () => {
    // Step 1: Run all ingestors
    const ingestorResults = await runAllIngestors();

    // Step 2: Collect all events
    const ingestedEvents = collectIngestedEvents(ingestorResults);
    logger.info(`📥 Ingested ${ingestedEvents.length} total events`);

    if (ingestedEvents.length === 0) {
      return {
        total_ingested: 0,
        total_normalized: 0,
        total_inserted: 0,
        total_published: 0,
        ingestor_results: ingestorResults,
        errors: [],
        duration_ms: 0,
      };
    }

    // Step 3: Normalize events
    let normalizedEvents = normalizeEvents(ingestedEvents);
    logger.info(`✅ Normalized ${normalizedEvents.length} events`);

    // Step 4: Merge duplicates
    normalizedEvents = mergeDuplicates(normalizedEvents);
    logger.info(`🔄 Deduplicated to ${normalizedEvents.length} unique events`);

    // Step 5: Apply weights
    normalizedEvents = applyWeights(normalizedEvents);
    logger.info(`⚖️  Applied weights to ${normalizedEvents.length} events`);

    // Step 6: Publish events
    const publishedEvents = await publishEvents(normalizedEvents);
    logger.info(`📤 Published ${publishedEvents.length} events`);

    // Collect errors
    const errors = ingestorResults
      .filter((r) => !r.success && r.error)
      .map((r) => r.error!);

    return {
      total_ingested: ingestedEvents.length,
      total_normalized: normalizedEvents.length,
      total_inserted: publishedEvents.length,
      total_published: publishedEvents.length,
      ingestor_results: ingestorResults,
      errors,
      duration_ms: 0, // Will be set below
    };
  });

  result.duration_ms = duration_ms;

  logger.info(
    `✨ Pipeline complete: ${result.total_published}/${result.total_ingested} events published in ${duration_ms}ms`
  );

  if (result.errors.length > 0) {
    logger.warn(`⚠️  Pipeline had ${result.errors.length} errors`);
  }

  return result;
}

/**
 * Run all ingestors in parallel
 */
async function runAllIngestors(): Promise<IngestorResult[]> {
  logger.debug('Running all ingestors...');

  const ingestors = [
    { name: 'playlistAdds', fn: ingestPlaylistAdds },
    { name: 'playlistPositionChanges', fn: ingestPlaylistPositionChanges },
    { name: 'pressFeatures', fn: ingestPressFeatures },
    { name: 'radioSpins', fn: ingestRadioSpins },
    { name: 'blogPosts', fn: ingestBlogPosts },
    { name: 'migConnections', fn: ingestMIGConnections },
    { name: 'trendingNodes', fn: ingestTrendingNodes },
    { name: 'scenePulseChanges', fn: ingestScenePulseChanges },
    { name: 'sceneTrendSpikes', fn: ingestSceneTrendSpikes },
    { name: 'creativeBreakthroughs', fn: ingestCreativeBreakthroughs },
    { name: 'autopilotEvents', fn: ingestAutopilotEvents },
    { name: 'trackerEvents', fn: ingestTrackerEvents },
    { name: 'coverageSpikes', fn: ingestCoverageSpikes },
    { name: 'communityActivity', fn: ingestCommunityActivity },
    { name: 'externalSources', fn: ingestAllExternalSources },
  ];

  // Run all ingestors in parallel
  const results = await Promise.allSettled(
    ingestors.map(async ({ name, fn }) => {
      const { result: events, duration_ms } = await measureTime(() => fn());
      return {
        ingestor: name,
        events,
        success: true,
        duration_ms,
      };
    })
  );

  // Convert results
  const ingestorResults: IngestorResult[] = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        ingestor: ingestors[index].name,
        events: [],
        success: false,
        error: result.reason?.message || 'Unknown error',
      };
    }
  });

  return ingestorResults;
}

/**
 * Collect all ingested events from ingestor results
 */
function collectIngestedEvents(results: IngestorResult[]): RCFIngestedEvent[] {
  const events: RCFIngestedEvent[] = [];

  for (const result of results) {
    if (result.success && result.events.length > 0) {
      events.push(...result.events);
    }
  }

  return events;
}

/**
 * Run pipeline manually (for testing or cron jobs)
 */
export async function runPipelineManual(): Promise<PipelineResult> {
  logger.info('📋 Manual pipeline run triggered');
  return await runPipeline();
}

/**
 * Run pipeline on a schedule (example: every minute)
 *
 * TODO: Integrate with actual scheduler (cron, Vercel Cron, etc.)
 */
export function schedulePipeline(intervalMinutes: number = 1): NodeJS.Timer {
  logger.info(`⏰ Scheduling pipeline to run every ${intervalMinutes} minute(s)`);

  const intervalMs = intervalMinutes * 60 * 1000;

  return setInterval(async () => {
    try {
      await runPipeline();
    } catch (error) {
      logger.error('Scheduled pipeline run failed', error);
    }
  }, intervalMs);
}

/**
 * Run specific ingestors (for testing or selective ingestion)
 */
export async function runSelectiveIngestors(
  ingestorNames: string[]
): Promise<IngestorResult[]> {
  logger.info(`Running selective ingestors: ${ingestorNames.join(', ')}`);

  const allIngestors: Record<string, () => Promise<RCFIngestedEvent[]>> = {
    playlistAdds: ingestPlaylistAdds,
    playlistPositionChanges: ingestPlaylistPositionChanges,
    pressFeatures: ingestPressFeatures,
    radioSpins: ingestRadioSpins,
    blogPosts: ingestBlogPosts,
    migConnections: ingestMIGConnections,
    trendingNodes: ingestTrendingNodes,
    scenePulseChanges: ingestScenePulseChanges,
    sceneTrendSpikes: ingestSceneTrendSpikes,
    creativeBreakthroughs: ingestCreativeBreakthroughs,
    autopilotEvents: ingestAutopilotEvents,
    trackerEvents: ingestTrackerEvents,
    coverageSpikes: ingestCoverageSpikes,
    communityActivity: ingestCommunityActivity,
    externalSources: ingestAllExternalSources,
  };

  const results: IngestorResult[] = [];

  for (const name of ingestorNames) {
    const ingestor = allIngestors[name];
    if (!ingestor) {
      logger.warn(`Unknown ingestor: ${name}`);
      results.push({
        ingestor: name,
        events: [],
        success: false,
        error: `Unknown ingestor: ${name}`,
      });
      continue;
    }

    try {
      const { result: events, duration_ms } = await measureTime(() => ingestor());
      results.push({
        ingestor: name,
        events,
        success: true,
        duration_ms,
      });
    } catch (error) {
      results.push({
        ingestor: name,
        events: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

export default {
  runPipeline,
  runPipelineManual,
  schedulePipeline,
  runSelectiveIngestors,
};

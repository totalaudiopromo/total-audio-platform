/**
 * Radio Ingestor
 *
 * Detects and ingests radio play events:
 * - Radio spins
 * - Show features
 * - Presenter mentions
 */

import type { RCFIngestedEvent } from '../types';
import { getLogger } from '../utils/logger';
import { minutesAgo } from '../utils/time';

const logger = getLogger('[RadioIngestor]');

/**
 * Ingest radio spin events
 */
export async function ingestRadioSpins(): Promise<RCFIngestedEvent[]> {
  logger.debug('Ingesting radio spins...');

  try {
    // TODO: Query Tracker + MIG for radio plays
    // Could also integrate with RadioMonitor API or similar

    // Stub for now
    return [];
  } catch (error) {
    logger.error('Failed to ingest radio spins', error);
    return [];
  }
}

export default {
  ingestRadioSpins,
};

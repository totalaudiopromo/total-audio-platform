/**
 * Digest Engine
 * Generates daily/weekly summaries
 */

import type { RCFEvent } from '../types';
import type { TrendSnapshot } from '../trends';
import { getLogger } from '../utils/logger';

const logger = getLogger('[DigestEngine]');

export interface RCFDigest {
  id?: string;
  workspace_id: string;
  period: 'daily' | 'weekly';
  start_date: string;
  end_date: string;
  summary: Record<string, unknown>;
  top_events: RCFEvent[];
  top_artists: Array<{ slug: string; score: number }>;
  top_scenes: Array<{ slug: string; score: number }>;
  top_sources: Array<{ slug: string; count: number }>;
  biggest_movers: TrendSnapshot[];
  stats: Record<string, unknown>;
}

export async function generateDigest(
  workspaceId: string,
  period: 'daily' | 'weekly',
  events: RCFEvent[]
): Promise<RCFDigest> {
  logger.debug(`Generating ${period} digest for workspace ${workspaceId}`);

  const topEvents = events.sort((a, b) => b.weight - a.weight).slice(0, 10);

  const digest: RCFDigest = {
    workspace_id: workspaceId,
    period,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    summary: { total_events: events.length },
    top_events: topEvents,
    top_artists: [],
    top_scenes: [],
    top_sources: [],
    biggest_movers: [],
    stats: {},
  };

  return digest;
}

export default { generateDigest };

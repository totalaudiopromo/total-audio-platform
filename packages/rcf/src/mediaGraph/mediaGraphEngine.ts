/**
 * Media Graph Engine
 * Builds relationships between publications, playlists, stations, blogs, tastemakers
 */

import type { RCFEvent } from '../types';
import { getLogger } from '../utils/logger';

const logger = getLogger('[MediaGraphEngine]');

export interface MediaGraphNode {
  id?: string;
  node_type: 'publication' | 'playlist' | 'station' | 'blog' | 'influencer';
  node_slug: string;
  name: string;
  category?: string;
  credibility_score: number;
  influence_score: number;
  metadata: Record<string, unknown>;
}

export interface MediaGraphEdge {
  id?: string;
  source_node_id: string;
  target_node_id: string;
  edge_type: 'shared_artist' | 'shared_scene' | 'co_occurrence' | 'similar_category';
  weight: number;
  co_occurrence_count: number;
  metadata: Record<string, unknown>;
}

export async function buildMediaGraph(events: RCFEvent[]): Promise<{
  nodes: MediaGraphNode[];
  edges: MediaGraphEdge[];
}> {
  logger.debug('Building media graph from events...');

  const nodes: MediaGraphNode[] = [];
  const edges: MediaGraphEdge[] = [];

  // Extract unique media entities from events
  const entityMap = new Map<string, Set<string>>();

  for (const event of events) {
    if (event.entity_slug && event.artist_slug) {
      if (!entityMap.has(event.entity_slug)) {
        entityMap.set(event.entity_slug, new Set());
      }
      entityMap.get(event.entity_slug)!.add(event.artist_slug);
    }
  }

  // Create nodes
  for (const [entitySlug, artists] of entityMap.entries()) {
    nodes.push({
      node_type: 'publication', // Infer from event type
      node_slug: entitySlug,
      name: entitySlug,
      credibility_score: 0.5,
      influence_score: 0.5,
      metadata: { artist_count: artists.size },
    });
  }

  logger.info(`Built graph with ${nodes.length} nodes and ${edges.length} edges`);

  return { nodes, edges };
}

export default { buildMediaGraph };

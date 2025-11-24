/**
 * MIG Adapter - Read-only interface to Music Industry Graph
 * Provides artist connectivity and network signals
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('MIGAdapter');

export interface MIGSignals {
  connectivity: number; // 0-1: How well connected in the graph
  centralityScore: number; // 0-1: Network centrality
  tastemaker ConnectionCount: number; // Number of tastemaker connections
  scenePresence: string[]; // Scenes the artist is connected to
}

export class MIGAdapter {
  constructor(private supabase: SupabaseClient) {}

  async getArtistMIGSignals(artistSlug: string): Promise<MIGSignals> {
    try {
      logger.debug(`Fetching MIG signals for artist: ${artistSlug}`);

      // TODO: Query actual MIG tables
      // This is a placeholder that would query migraph_nodes and migraph_edges

      // Example: Get node
      const { data: node } = await this.supabase
        .from('migraph_nodes')
        .select('*')
        .eq('slug', artistSlug)
        .single();

      if (!node) {
        return {
          connectivity: 0,
          centralityScore: 0,
          tastemakerConnectionCount: 0,
          scenePresence: [],
        };
      }

      // Example: Count edges
      const { count: edgeCount } = await this.supabase
        .from('migraph_edges')
        .select('*', { count: 'exact', head: true })
        .or(`source_id.eq.${node.id},target_id.eq.${node.id}`);

      // Normalize connectivity (0-1 based on edge count)
      const connectivity = Math.min(1, (edgeCount || 0) / 50);

      // Placeholder for other metrics
      return {
        connectivity,
        centralityScore: connectivity * 0.8, // Simplified
        tastemakerConnectionCount: Math.floor((edgeCount || 0) * 0.2),
        scenePresence: node.metadata?.scenes || [],
      };
    } catch (error) {
      logger.error(`Failed to fetch MIG signals for ${artistSlug}:`, error);
      return {
        connectivity: 0,
        centralityScore: 0,
        tastemakerConnectionCount: 0,
        scenePresence: [],
      };
    }
  }
}

/**
 * MIG (Music Industry Graph) Adapter
 * Read-only adapter for accessing MIG data
 *
 * IMPORTANT: This adapter MUST NOT modify MIG tables or core logic
 * It only reads data from MIG to inform scene analysis
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { MIGNodeReference, EntityType } from './types.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('MIGAdapter');

export interface MIGAdapterConfig {
  supabase: SupabaseClient;
}

/**
 * MIG Adapter - Read-only interface to Music Industry Graph
 */
export class MIGAdapter {
  private supabase: SupabaseClient;

  constructor(config: MIGAdapterConfig) {
    this.supabase = config.supabase;
  }

  /**
   * Get nodes related to a scene
   * Searches for MIG nodes tagged with scene identifiers
   */
  async getSceneRelatedNodes(sceneSlug: string): Promise<MIGNodeReference[]> {
    try {
      logger.debug(`Fetching MIG nodes for scene: ${sceneSlug}`);

      // TODO: Actual MIG query implementation
      // This is a placeholder that would query migraph_nodes table
      // looking for nodes with scene-related tags or metadata

      const { data, error } = await this.supabase
        .from('migraph_nodes')
        .select('*')
        .or(`metadata->scene.eq.${sceneSlug},tags.cs.{${sceneSlug}}`)
        .limit(100);

      if (error) {
        logger.warn(`Error fetching MIG nodes for scene ${sceneSlug}:`, error);
        return [];
      }

      const nodes: MIGNodeReference[] = (data || []).map((node: any) => ({
        id: node.id,
        slug: node.slug || node.id,
        type: node.node_type || 'unknown',
        name: node.name || node.slug,
        metadata: node.metadata || {},
      }));

      logger.info(`Found ${nodes.length} MIG nodes for scene ${sceneSlug}`);
      return nodes;
    } catch (error) {
      logger.error(`Failed to fetch scene related nodes for ${sceneSlug}:`, error);
      return [];
    }
  }

  /**
   * Get nodes related to a microgenre
   */
  async getMicrogenreRelatedNodes(microgenreSlug: string): Promise<MIGNodeReference[]> {
    try {
      logger.debug(`Fetching MIG nodes for microgenre: ${microgenreSlug}`);

      // TODO: Actual MIG query implementation
      const { data, error } = await this.supabase
        .from('migraph_nodes')
        .select('*')
        .or(`metadata->microgenre.eq.${microgenreSlug},tags.cs.{${microgenreSlug}}`)
        .limit(100);

      if (error) {
        logger.warn(`Error fetching MIG nodes for microgenre ${microgenreSlug}:`, error);
        return [];
      }

      const nodes: MIGNodeReference[] = (data || []).map((node: any) => ({
        id: node.id,
        slug: node.slug || node.id,
        type: node.node_type || 'unknown',
        name: node.name || node.slug,
        metadata: node.metadata || {},
      }));

      logger.info(`Found ${nodes.length} MIG nodes for microgenre ${microgenreSlug}`);
      return nodes;
    } catch (error) {
      logger.error(`Failed to fetch microgenre related nodes for ${microgenreSlug}:`, error);
      return [];
    }
  }

  /**
   * Get tastemakers for a scene
   * Returns influential DJs, radio shows, playlists, etc.
   */
  async getSceneTastemakers(sceneSlug: string): Promise<MIGNodeReference[]> {
    try {
      logger.debug(`Fetching tastemakers for scene: ${sceneSlug}`);

      // TODO: Actual MIG query implementation
      // This would query for nodes with high influence scores in the scene
      const { data, error } = await this.supabase
        .from('migraph_nodes')
        .select('*')
        .or(`metadata->scene.eq.${sceneSlug}`)
        .in('node_type', ['dj', 'radio_show', 'playlist', 'curator'])
        .order('metadata->influence_score', { ascending: false })
        .limit(50);

      if (error) {
        logger.warn(`Error fetching tastemakers for scene ${sceneSlug}:`, error);
        return [];
      }

      const tastemakers: MIGNodeReference[] = (data || []).map((node: any) => ({
        id: node.id,
        slug: node.slug || node.id,
        type: node.node_type || 'unknown',
        name: node.name || node.slug,
        metadata: node.metadata || {},
      }));

      logger.info(`Found ${tastemakers.length} tastemakers for scene ${sceneSlug}`);
      return tastemakers;
    } catch (error) {
      logger.error(`Failed to fetch tastemakers for ${sceneSlug}:`, error);
      return [];
    }
  }

  /**
   * Infer scene relationships from MIG graph structure
   * Analyzes shared nodes and edges to identify scene connections
   */
  async inferSceneRelationshipsFromMIG(sceneSlugA: string, sceneSlugB: string): Promise<{
    sharedNodes: number;
    sharedArtists: number;
    sharedTastemakers: number;
    connectionStrength: number; // 0-1
  }> {
    try {
      logger.debug(`Inferring relationship between ${sceneSlugA} and ${sceneSlugB}`);

      // Get nodes for both scenes
      const [nodesA, nodesB] = await Promise.all([
        this.getSceneRelatedNodes(sceneSlugA),
        this.getSceneRelatedNodes(sceneSlugB),
      ]);

      // Calculate shared nodes
      const slugSetA = new Set(nodesA.map(n => n.slug));
      const slugSetB = new Set(nodesB.map(n => n.slug));
      const sharedSlugs = [...slugSetA].filter(slug => slugSetB.has(slug));

      const sharedNodes = sharedSlugs.length;
      const sharedArtists = nodesA
        .filter(n => sharedSlugs.includes(n.slug) && n.type === 'artist')
        .length;
      const sharedTastemakers = nodesA
        .filter(n => sharedSlugs.includes(n.slug) && ['dj', 'radio_show', 'playlist'].includes(n.type))
        .length;

      // Calculate connection strength (Jaccard similarity)
      const union = new Set([...slugSetA, ...slugSetB]);
      const connectionStrength = union.size > 0 ? sharedNodes / union.size : 0;

      logger.info(`Scene relationship ${sceneSlugA} <-> ${sceneSlugB}: ${sharedNodes} shared nodes, strength ${connectionStrength.toFixed(2)}`);

      return {
        sharedNodes,
        sharedArtists,
        sharedTastemakers,
        connectionStrength,
      };
    } catch (error) {
      logger.error(`Failed to infer scene relationship:`, error);
      return {
        sharedNodes: 0,
        sharedArtists: 0,
        sharedTastemakers: 0,
        connectionStrength: 0,
      };
    }
  }

  /**
   * Get entity by slug from MIG
   */
  async getEntityBySlug(slug: string): Promise<MIGNodeReference | null> {
    try {
      const { data, error } = await this.supabase
        .from('migraph_nodes')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        slug: data.slug || data.id,
        type: data.node_type || 'unknown',
        name: data.name || data.slug,
        metadata: data.metadata || {},
      };
    } catch (error) {
      logger.error(`Failed to fetch entity ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get neighbors of an entity in the MIG graph
   * Useful for understanding entity connections
   */
  async getEntityNeighbors(entitySlug: string, types?: string[]): Promise<MIGNodeReference[]> {
    try {
      logger.debug(`Fetching neighbors for entity: ${entitySlug}`);

      // First get the entity
      const entity = await this.getEntityBySlug(entitySlug);
      if (!entity) {
        return [];
      }

      // TODO: Query MIG edges to find connected nodes
      // This is a placeholder for the actual graph traversal query
      const { data, error } = await this.supabase
        .from('migraph_edges')
        .select('target_id, source_id')
        .or(`source_id.eq.${entity.id},target_id.eq.${entity.id}`)
        .limit(100);

      if (error || !data) {
        return [];
      }

      // Get unique neighbor IDs
      const neighborIds = new Set<string>();
      data.forEach((edge: any) => {
        if (edge.source_id === entity.id) {
          neighborIds.add(edge.target_id);
        } else {
          neighborIds.add(edge.source_id);
        }
      });

      // Fetch neighbor nodes
      let query = this.supabase
        .from('migraph_nodes')
        .select('*')
        .in('id', Array.from(neighborIds));

      if (types && types.length > 0) {
        query = query.in('node_type', types);
      }

      const { data: neighbors, error: neighborsError } = await query;

      if (neighborsError || !neighbors) {
        return [];
      }

      return neighbors.map((node: any) => ({
        id: node.id,
        slug: node.slug || node.id,
        type: node.node_type || 'unknown',
        name: node.name || node.slug,
        metadata: node.metadata || {},
      }));
    } catch (error) {
      logger.error(`Failed to fetch neighbors for ${entitySlug}:`, error);
      return [];
    }
  }

  /**
   * Map MIG node type to EntityType
   */
  mapMIGTypeToEntityType(migType: string): EntityType {
    const typeMap: Record<string, EntityType> = {
      'artist': 'artist',
      'dj': 'dj',
      'playlist': 'playlist',
      'radio_show': 'radio_show',
      'label': 'label',
      'event': 'event',
      'venue': 'venue',
      'promoter': 'promoter',
    };

    return typeMap[migType.toLowerCase()] || 'artist';
  }
}

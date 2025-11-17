/**
 * Music Industry Graph (MIG) - Supabase Client
 *
 * This module provides a Supabase client wrapper for MIG operations.
 * All CRUD operations for nodes and edges go through this client.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  MIGNode,
  MIGNodeInput,
  MIGEdge,
  MIGEdgeInput,
  MIGNodeType,
  MIGRelationshipType,
  NeighborQueryOptions,
  NeighborResult,
} from './types';
import { logger } from './utils/logger';

// ============================================================================
// CLIENT INITIALIZATION
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.warn('Missing Supabase environment variables. MIG client disabled.');
}

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// ============================================================================
// NODE OPERATIONS
// ============================================================================

/**
 * Get a node by its slug
 */
export async function getNodeBySlug(slug: string): Promise<MIGNode | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('migraph_nodes')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      logger.error(`Failed to get node by slug: ${slug}`, error);
      return null;
    }

    return data as MIGNode;
  } catch (err) {
    logger.error('Exception in getNodeBySlug', err);
    return null;
  }
}

/**
 * Get a node by its ID
 */
export async function getNodeById(id: string): Promise<MIGNode | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('migraph_nodes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error(`Failed to get node by ID: ${id}`, error);
      return null;
    }

    return data as MIGNode;
  } catch (err) {
    logger.error('Exception in getNodeById', err);
    return null;
  }
}

/**
 * Search nodes by type and query string
 */
export async function searchNodesByType(
  type: MIGNodeType,
  query: string,
  limit: number = 50
): Promise<MIGNode[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('migraph_nodes')
      .select('*')
      .eq('type', type)
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) {
      logger.error(`Failed to search nodes: type=${type}, query=${query}`, error);
      return [];
    }

    return (data as MIGNode[]) || [];
  } catch (err) {
    logger.error('Exception in searchNodesByType', err);
    return [];
  }
}

/**
 * List all nodes of a specific type
 */
export async function listNodesByType(
  type: MIGNodeType,
  limit: number = 100,
  offset: number = 0
): Promise<MIGNode[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('migraph_nodes')
      .select('*')
      .eq('type', type)
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error(`Failed to list nodes by type: ${type}`, error);
      return [];
    }

    return (data as MIGNode[]) || [];
  } catch (err) {
    logger.error('Exception in listNodesByType', err);
    return [];
  }
}

/**
 * Add a new node to the graph
 */
export async function addNode(node: MIGNodeInput): Promise<MIGNode | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('migraph_nodes')
      .insert({
        type: node.type,
        name: node.name,
        slug: node.slug,
        country: node.country,
        metadata: node.metadata || {},
        external_ids: node.external_ids || {},
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to add node', { node, error });
      return null;
    }

    logger.info(`Added node: ${node.name} (${node.type})`);
    return data as MIGNode;
  } catch (err) {
    logger.error('Exception in addNode', err);
    return null;
  }
}

/**
 * Bulk insert nodes
 */
export async function bulkInsertNodes(nodes: MIGNodeInput[]): Promise<MIGNode[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  if (nodes.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('migraph_nodes')
      .insert(
        nodes.map((node) => ({
          type: node.type,
          name: node.name,
          slug: node.slug,
          country: node.country,
          metadata: node.metadata || {},
          external_ids: node.external_ids || {},
        }))
      )
      .select();

    if (error) {
      logger.error('Failed to bulk insert nodes', error);
      return [];
    }

    logger.info(`Bulk inserted ${nodes.length} nodes`);
    return (data as MIGNode[]) || [];
  } catch (err) {
    logger.error('Exception in bulkInsertNodes', err);
    return [];
  }
}

/**
 * Update a node
 */
export async function updateNode(
  id: string,
  updates: Partial<MIGNodeInput>
): Promise<MIGNode | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('migraph_nodes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error(`Failed to update node: ${id}`, error);
      return null;
    }

    logger.info(`Updated node: ${id}`);
    return data as MIGNode;
  } catch (err) {
    logger.error('Exception in updateNode', err);
    return null;
  }
}

/**
 * Delete a node (and all associated edges via CASCADE)
 */
export async function deleteNode(id: string): Promise<boolean> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return false;
  }

  try {
    const { error } = await supabase.from('migraph_nodes').delete().eq('id', id);

    if (error) {
      logger.error(`Failed to delete node: ${id}`, error);
      return false;
    }

    logger.info(`Deleted node: ${id}`);
    return true;
  } catch (err) {
    logger.error('Exception in deleteNode', err);
    return false;
  }
}

// ============================================================================
// EDGE OPERATIONS
// ============================================================================

/**
 * Get all outgoing edges from a node
 */
export async function getOutgoingEdges(nodeId: string): Promise<MIGEdge[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('migraph_edges')
      .select('*')
      .eq('source', nodeId)
      .order('weight', { ascending: false });

    if (error) {
      logger.error(`Failed to get outgoing edges for node: ${nodeId}`, error);
      return [];
    }

    return (data as MIGEdge[]) || [];
  } catch (err) {
    logger.error('Exception in getOutgoingEdges', err);
    return [];
  }
}

/**
 * Get all incoming edges to a node
 */
export async function getIncomingEdges(nodeId: string): Promise<MIGEdge[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('migraph_edges')
      .select('*')
      .eq('target', nodeId)
      .order('weight', { ascending: false });

    if (error) {
      logger.error(`Failed to get incoming edges for node: ${nodeId}`, error);
      return [];
    }

    return (data as MIGEdge[]) || [];
  } catch (err) {
    logger.error('Exception in getIncomingEdges', err);
    return [];
  }
}

/**
 * Get all edges (both incoming and outgoing) for a node
 */
export async function getAllEdges(nodeId: string): Promise<MIGEdge[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('migraph_edges')
      .select('*')
      .or(`source.eq.${nodeId},target.eq.${nodeId}`)
      .order('weight', { ascending: false });

    if (error) {
      logger.error(`Failed to get all edges for node: ${nodeId}`, error);
      return [];
    }

    return (data as MIGEdge[]) || [];
  } catch (err) {
    logger.error('Exception in getAllEdges', err);
    return [];
  }
}

/**
 * Get neighbors of a node using the SQL function
 */
export async function getNeighbors(
  nodeId: string,
  options?: NeighborQueryOptions
): Promise<NeighborResult[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    const { data, error } = await supabase.rpc('get_node_neighbors', {
      node_id: nodeId,
      relationship_filter: options?.relationship_filter || null,
      depth_limit: options?.depth_limit || 1,
    });

    if (error) {
      logger.error(`Failed to get neighbors for node: ${nodeId}`, error);
      return [];
    }

    let results = (data as NeighborResult[]) || [];

    // Apply additional filters
    if (options?.min_weight) {
      results = results.filter((r) => r.weight >= options.min_weight!);
    }

    if (options?.node_type_filter && options.node_type_filter.length > 0) {
      results = results.filter((r) => options.node_type_filter!.includes(r.neighbor_type));
    }

    return results;
  } catch (err) {
    logger.error('Exception in getNeighbors', err);
    return [];
  }
}

/**
 * Add a new edge to the graph
 */
export async function addEdge(edge: MIGEdgeInput): Promise<MIGEdge | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('migraph_edges')
      .insert({
        source: edge.source,
        target: edge.target,
        rel: edge.rel,
        weight: edge.weight,
        metadata: edge.metadata || {},
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to add edge', { edge, error });
      return null;
    }

    logger.info(`Added edge: ${edge.source} -> ${edge.target} (${edge.rel})`);
    return data as MIGEdge;
  } catch (err) {
    logger.error('Exception in addEdge', err);
    return null;
  }
}

/**
 * Bulk insert edges
 */
export async function bulkInsertEdges(edges: MIGEdgeInput[]): Promise<MIGEdge[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  if (edges.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('migraph_edges')
      .insert(
        edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          rel: edge.rel,
          weight: edge.weight,
          metadata: edge.metadata || {},
        }))
      )
      .select();

    if (error) {
      logger.error('Failed to bulk insert edges', error);
      return [];
    }

    logger.info(`Bulk inserted ${edges.length} edges`);
    return (data as MIGEdge[]) || [];
  } catch (err) {
    logger.error('Exception in bulkInsertEdges', err);
    return [];
  }
}

/**
 * Update an edge
 */
export async function updateEdge(
  id: string,
  updates: Partial<MIGEdgeInput>
): Promise<MIGEdge | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('migraph_edges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error(`Failed to update edge: ${id}`, error);
      return null;
    }

    logger.info(`Updated edge: ${id}`);
    return data as MIGEdge;
  } catch (err) {
    logger.error('Exception in updateEdge', err);
    return null;
  }
}

/**
 * Delete an edge
 */
export async function deleteEdge(id: string): Promise<boolean> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return false;
  }

  try {
    const { error } = await supabase.from('migraph_edges').delete().eq('id', id);

    if (error) {
      logger.error(`Failed to delete edge: ${id}`, error);
      return false;
    }

    logger.info(`Deleted edge: ${id}`);
    return true;
  } catch (err) {
    logger.error('Exception in deleteEdge', err);
    return false;
  }
}

// ============================================================================
// METADATA OPERATIONS
// ============================================================================

/**
 * Get a metadata value by key
 */
export async function getMetadata(key: string): Promise<any | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('migraph_metadata')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      logger.error(`Failed to get metadata: ${key}`, error);
      return null;
    }

    return data?.value || null;
  } catch (err) {
    logger.error('Exception in getMetadata', err);
    return null;
  }
}

/**
 * Set a metadata value
 */
export async function setMetadata(key: string, value: any): Promise<boolean> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return false;
  }

  try {
    const { error } = await supabase
      .from('migraph_metadata')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) {
      logger.error(`Failed to set metadata: ${key}`, error);
      return false;
    }

    logger.info(`Set metadata: ${key}`);
    return true;
  } catch (err) {
    logger.error('Exception in setMetadata', err);
    return false;
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if the MIG database is accessible
 */
export async function checkHealth(): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from('migraph_nodes').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

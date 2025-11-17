/**
 * Music Industry Graph (MIG) - Graph Store
 *
 * Higher-level functions for graph operations, building on top of the client.
 */

import {
  getNodeById,
  getNodeBySlug,
  getNeighbors,
  getAllEdges,
  listNodesByType,
  supabase,
} from './client';
import type {
  MIGNode,
  MIGEdge,
  MIGNodeType,
  NeighborResult,
  GraphQueryOptions,
  GraphQueryResult,
  InfluenceScore,
} from './types';
import { logger } from './utils/logger';

// ============================================================================
// NEIGHBORHOOD OPERATIONS
// ============================================================================

/**
 * Get the full neighborhood of a node up to a certain depth
 */
export async function getGraphNeighborhood(
  nodeId: string,
  depth: number = 1
): Promise<GraphQueryResult> {
  const startTime = Date.now();
  const visitedNodes = new Set<string>();
  const nodes: MIGNode[] = [];
  const edges: MIGEdge[] = [];

  // Get the root node
  const rootNode = await getNodeById(nodeId);
  if (!rootNode) {
    return {
      nodes: [],
      edges: [],
      total_results: 0,
      query_time_ms: Date.now() - startTime,
    };
  }

  nodes.push(rootNode);
  visitedNodes.add(nodeId);

  // BFS traversal
  let currentDepth = 0;
  let currentLevel = [nodeId];

  while (currentDepth < depth && currentLevel.length > 0) {
    const nextLevel: string[] = [];

    for (const currentNodeId of currentLevel) {
      const neighbors = await getNeighbors(currentNodeId, { depth_limit: 1 });

      for (const neighbor of neighbors) {
        if (!visitedNodes.has(neighbor.neighbor_id)) {
          visitedNodes.add(neighbor.neighbor_id);
          nextLevel.push(neighbor.neighbor_id);

          const neighborNode = await getNodeById(neighbor.neighbor_id);
          if (neighborNode) {
            nodes.push(neighborNode);
          }
        }
      }

      // Get edges for this node
      const nodeEdges = await getAllEdges(currentNodeId);
      edges.push(...nodeEdges);
    }

    currentLevel = nextLevel;
    currentDepth++;
  }

  return {
    nodes,
    edges,
    total_results: nodes.length,
    query_time_ms: Date.now() - startTime,
  };
}

/**
 * Get the graph for a specific scene
 */
export async function getGraphForScene(sceneSlug: string): Promise<GraphQueryResult> {
  const startTime = Date.now();

  // Get the scene node
  const sceneNode = await getNodeBySlug(sceneSlug);
  if (!sceneNode || sceneNode.type !== 'scene') {
    return {
      nodes: [],
      edges: [],
      total_results: 0,
      query_time_ms: Date.now() - startTime,
    };
  }

  // Get all nodes connected to this scene
  const neighbors = await getNeighbors(sceneNode.id, {
    relationship_filter: ['part_of', 'same_scene', 'scene_crossover'],
    depth_limit: 2,
  });

  const nodes: MIGNode[] = [sceneNode];
  const edges: MIGEdge[] = [];
  const nodeIds = new Set<string>([sceneNode.id]);

  for (const neighbor of neighbors) {
    const node = await getNodeById(neighbor.neighbor_id);
    if (node && !nodeIds.has(node.id)) {
      nodes.push(node);
      nodeIds.add(node.id);
    }
  }

  // Get all edges between these nodes
  for (const node of nodes) {
    const nodeEdges = await getAllEdges(node.id);
    for (const edge of nodeEdges) {
      if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
        edges.push(edge);
      }
    }
  }

  return {
    nodes,
    edges,
    total_results: nodes.length,
    query_time_ms: Date.now() - startTime,
  };
}

/**
 * Get the graph for a specific microgenre
 */
export async function getGraphForMicrogenre(microSlug: string): Promise<GraphQueryResult> {
  const startTime = Date.now();

  // Get the microgenre node
  const microNode = await getNodeBySlug(microSlug);
  if (!microNode || microNode.type !== 'microgenre') {
    return {
      nodes: [],
      edges: [],
      total_results: 0,
      query_time_ms: Date.now() - startTime,
    };
  }

  // Get all nodes connected to this microgenre
  const neighbors = await getNeighbors(microNode.id, {
    relationship_filter: ['same_microgenre', 'part_of'],
    depth_limit: 2,
  });

  const nodes: MIGNode[] = [microNode];
  const edges: MIGEdge[] = [];
  const nodeIds = new Set<string>([microNode.id]);

  for (const neighbor of neighbors) {
    const node = await getNodeById(neighbor.neighbor_id);
    if (node && !nodeIds.has(node.id)) {
      nodes.push(node);
      nodeIds.add(node.id);
    }
  }

  // Get all edges between these nodes
  for (const node of nodes) {
    const nodeEdges = await getAllEdges(node.id);
    for (const edge of nodeEdges) {
      if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
        edges.push(edge);
      }
    }
  }

  return {
    nodes,
    edges,
    total_results: nodes.length,
    query_time_ms: Date.now() - startTime,
  };
}

// ============================================================================
// CLUSTER & WEIGHT OPERATIONS
// ============================================================================

/**
 * Compute cluster weights for a set of nodes
 * Returns a map of node IDs to their cluster importance scores
 */
export async function computeClusterWeights(
  nodeIds: string[]
): Promise<Map<string, number>> {
  const weights = new Map<string, number>();

  for (const nodeId of nodeIds) {
    const neighbors = await getNeighbors(nodeId, { depth_limit: 1 });

    // Simple centrality measure: sum of edge weights
    const totalWeight = neighbors.reduce((sum, n) => sum + n.weight, 0);
    weights.set(nodeId, totalWeight);
  }

  return weights;
}

/**
 * Compute influence score for a node using the SQL function
 */
export async function computeInfluenceScore(nodeId: string): Promise<InfluenceScore | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    // Get the total influence score from the SQL function
    const { data: scoreData, error: scoreError } = await supabase.rpc(
      'compute_influence_score',
      {
        node_id: nodeId,
      }
    );

    if (scoreError) {
      logger.error(`Failed to compute influence score for node: ${nodeId}`, scoreError);
      return null;
    }

    const total_score = scoreData || 0;

    // Get outgoing edges for breakdown
    const { data: outgoingData, error: outgoingError } = await supabase
      .from('migraph_edges')
      .select('rel, weight')
      .eq('source', nodeId);

    if (outgoingError) {
      logger.error('Failed to get outgoing edges', outgoingError);
      return {
        node_id: nodeId,
        total_score,
        outgoing_influence: total_score,
        incoming_influence: 0,
        breakdown: {
          influences: 0,
          supports: 0,
          collaborations: 0,
          other: 0,
        },
      };
    }

    // Get incoming edges
    const { data: incomingData, error: incomingError } = await supabase
      .from('migraph_edges')
      .select('rel, weight')
      .eq('target', nodeId);

    if (incomingError) {
      logger.error('Failed to get incoming edges', incomingError);
    }

    // Calculate breakdown
    const breakdown = {
      influences: 0,
      supports: 0,
      collaborations: 0,
      other: 0,
    };

    let outgoing_influence = 0;
    let incoming_influence = 0;

    for (const edge of outgoingData || []) {
      const weight = edge.weight || 1.0;
      outgoing_influence += weight;

      if (edge.rel === 'influences' || edge.rel === 'influenced_by') {
        breakdown.influences += weight;
      } else if (edge.rel === 'supports') {
        breakdown.supports += weight;
      } else if (edge.rel === 'collaborates' || edge.rel === 'features') {
        breakdown.collaborations += weight;
      } else {
        breakdown.other += weight;
      }
    }

    for (const edge of incomingData || []) {
      incoming_influence += edge.weight || 1.0;
    }

    return {
      node_id: nodeId,
      total_score,
      outgoing_influence,
      incoming_influence,
      breakdown,
    };
  } catch (err) {
    logger.error('Exception in computeInfluenceScore', err);
    return null;
  }
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get graph statistics
 */
export async function getGraphStatistics() {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    // Get total nodes
    const { count: totalNodes } = await supabase
      .from('migraph_nodes')
      .select('*', { count: 'exact', head: true });

    // Get total edges
    const { count: totalEdges } = await supabase
      .from('migraph_edges')
      .select('*', { count: 'exact', head: true });

    // Get nodes by type
    const { data: nodesByType } = await supabase
      .from('migraph_nodes')
      .select('type')
      .order('type');

    const typeCounts: Record<string, number> = {};
    for (const node of nodesByType || []) {
      typeCounts[node.type] = (typeCounts[node.type] || 0) + 1;
    }

    // Get edges by type
    const { data: edgesByType } = await supabase
      .from('migraph_edges')
      .select('rel')
      .order('rel');

    const relCounts: Record<string, number> = {};
    for (const edge of edgesByType || []) {
      relCounts[edge.rel] = (relCounts[edge.rel] || 0) + 1;
    }

    // Get unique countries
    const { data: countries } = await supabase
      .from('migraph_nodes')
      .select('country')
      .not('country', 'is', null);

    const uniqueCountries = [...new Set(countries?.map((c) => c.country) || [])];

    return {
      total_nodes: totalNodes || 0,
      total_edges: totalEdges || 0,
      nodes_by_type: typeCounts,
      edges_by_type: relCounts,
      countries: uniqueCountries,
      scenes: typeCounts['scene'] || 0,
      microgenres: typeCounts['microgenre'] || 0,
      last_updated: new Date().toISOString(),
    };
  } catch (err) {
    logger.error('Exception in getGraphStatistics', err);
    return null;
  }
}

/**
 * Get nodes by country
 */
export async function getNodesByCountry(
  country: string,
  nodeType?: MIGNodeType
): Promise<MIGNode[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    let query = supabase.from('migraph_nodes').select('*').eq('country', country);

    if (nodeType) {
      query = query.eq('type', nodeType);
    }

    const { data, error } = await query;

    if (error) {
      logger.error(`Failed to get nodes by country: ${country}`, error);
      return [];
    }

    return (data as MIGNode[]) || [];
  } catch (err) {
    logger.error('Exception in getNodesByCountry', err);
    return [];
  }
}

/**
 * Music Industry Graph (MIG) - Pathfinding & Graph Algorithms
 *
 * Implements pathfinding algorithms for discovering connections
 * and influence paths in the music industry graph.
 */

import { getNodeById, getNeighbors, getAllEdges, bulkFetchNodes } from './client';
import type {
  MIGNode,
  MIGEdge,
  GraphPath,
  PathfindingOptions,
  PathfindingResult,
  MIGRelationshipType,
  MIGNodeType,
} from './types';
import { logger } from './utils/logger';
import {
  createTimeoutGuard,
  checkOperationLimits,
  DEFAULT_QUERY_LIMITS,
  createPerformanceTracker,
} from './performanceHints';

// ============================================================================
// WEIGHTED BFS
// ============================================================================

/**
 * Find the shortest path between two nodes using weighted BFS
 * Now with timeout guards and operation limits
 */
export async function findShortestPath(
  sourceId: string,
  targetId: string,
  options?: PathfindingOptions
): Promise<PathfindingResult | null> {
  const maxDepth = options?.max_depth || DEFAULT_QUERY_LIMITS.maxDepth;
  const avoidNodeTypes = options?.avoid_node_types || [];
  const timeoutMs = options?.timeout_ms || DEFAULT_QUERY_LIMITS.timeoutMs;

  // Performance tracking
  const tracker = createPerformanceTracker('findShortestPath');
  const timeoutGuard = createTimeoutGuard(timeoutMs);

  // BFS with path tracking
  interface QueueItem {
    nodeId: string;
    path: string[];
    edges: MIGEdge[];
    depth: number;
  }

  const queue: QueueItem[] = [
    {
      nodeId: sourceId,
      path: [sourceId],
      edges: [],
      depth: 0,
    },
  ];

  const visited = new Set<string>();
  visited.add(sourceId);
  let edgesProcessed = 0;

  while (queue.length > 0) {
    // Check timeout
    if (timeoutGuard.check()) {
      logger.warn(`Pathfinding timeout after ${timeoutGuard.elapsed()}ms`);
      tracker.finish();
      return null;
    }

    // Check operation limits
    const limitCheck = checkOperationLimits(
      queue[0]?.depth || 0,
      visited.size,
      edgesProcessed,
      DEFAULT_QUERY_LIMITS
    );

    if (!limitCheck.continue) {
      logger.warn(`Pathfinding limit exceeded: ${limitCheck.reason}`);
      tracker.finish();
      return null;
    }

    const current = queue.shift()!;

    // Check if we've reached the target
    if (current.nodeId === targetId) {
      // Use bulk fetch for better performance
      const nodeIds = current.path;
      const nodeMap = await bulkFetchNodes(nodeIds);
      const nodes: MIGNode[] = [];

      for (const nodeId of current.path) {
        const node = nodeMap.get(nodeId);
        if (node) {
          nodes.push(node);
          tracker.trackNode();
        }
      }

      // Calculate total weight
      const totalWeight = current.edges.reduce((sum, edge) => sum + edge.weight, 0);

      // Calculate relationship breakdown
      const relationshipBreakdown: Record<MIGRelationshipType, number> = {} as any;
      for (const edge of current.edges) {
        relationshipBreakdown[edge.rel] = (relationshipBreakdown[edge.rel] || 0) + 1;
      }

      tracker.finish();

      return {
        path: {
          nodes,
          edges: current.edges,
          total_weight: totalWeight,
          path_length: current.path.length - 1,
        },
        degrees_of_separation: current.path.length - 1,
        total_weight: totalWeight,
        relationship_breakdown: relationshipBreakdown,
      };
    }

    // Don't explore beyond max depth
    if (current.depth >= maxDepth) {
      continue;
    }

    // Get neighbors
    const neighbors = await getNeighbors(current.nodeId, {
      depth_limit: 1,
    });

    for (const neighbor of neighbors) {
      if (visited.has(neighbor.neighbor_id)) {
        continue;
      }

      // Skip if node type should be avoided
      if (avoidNodeTypes.includes(neighbor.neighbor_type)) {
        continue;
      }

      visited.add(neighbor.neighbor_id);

      // Find the edge
      const edges = await getAllEdges(current.nodeId);
      edgesProcessed += edges.length;
      tracker.trackEdge();

      const edge = edges.find(
        (e) =>
          (e.source === current.nodeId && e.target === neighbor.neighbor_id) ||
          (e.target === current.nodeId && e.source === neighbor.neighbor_id)
      );

      if (edge) {
        queue.push({
          nodeId: neighbor.neighbor_id,
          path: [...current.path, neighbor.neighbor_id],
          edges: [...current.edges, edge],
          depth: current.depth + 1,
        });
      }
    }
  }

  tracker.finish();

  // No path found
  return null;
}

// ============================================================================
// DIJKSTRA'S ALGORITHM
// ============================================================================

/**
 * Find the path with maximum influence weight between two nodes
 * Uses Dijkstra's algorithm with inverted weights (maximize instead of minimize)
 */
export async function findInfluencePath(
  sourceId: string,
  targetId: string,
  options?: PathfindingOptions
): Promise<PathfindingResult | null> {
  const maxDepth = options?.max_depth || 6;
  const relationshipWeights = options?.relationship_weights || {};

  interface PriorityQueueItem {
    nodeId: string;
    path: string[];
    edges: MIGEdge[];
    totalWeight: number;
    depth: number;
  }

  // Priority queue (we'll use a simple array and sort)
  const queue: PriorityQueueItem[] = [
    {
      nodeId: sourceId,
      path: [sourceId],
      edges: [],
      totalWeight: 0,
      depth: 0,
    },
  ];

  const visited = new Set<string>();
  const bestWeight = new Map<string, number>();
  bestWeight.set(sourceId, 0);

  while (queue.length > 0) {
    // Sort by total weight (descending - we want maximum weight)
    queue.sort((a, b) => b.totalWeight - a.totalWeight);
    const current = queue.shift()!;

    // Check if we've reached the target
    if (current.nodeId === targetId) {
      const nodes: MIGNode[] = [];
      for (const nodeId of current.path) {
        const node = await getNodeById(nodeId);
        if (node) {
          nodes.push(node);
        }
      }

      const relationshipBreakdown: Record<MIGRelationshipType, number> = {} as any;
      for (const edge of current.edges) {
        relationshipBreakdown[edge.rel] = (relationshipBreakdown[edge.rel] || 0) + 1;
      }

      return {
        path: {
          nodes,
          edges: current.edges,
          total_weight: current.totalWeight,
          path_length: current.path.length - 1,
        },
        degrees_of_separation: current.path.length - 1,
        total_weight: current.totalWeight,
        relationship_breakdown: relationshipBreakdown,
      };
    }

    if (visited.has(current.nodeId)) {
      continue;
    }

    visited.add(current.nodeId);

    if (current.depth >= maxDepth) {
      continue;
    }

    const neighbors = await getNeighbors(current.nodeId, { depth_limit: 1 });

    for (const neighbor of neighbors) {
      if (visited.has(neighbor.neighbor_id)) {
        continue;
      }

      const edges = await getAllEdges(current.nodeId);
      const edge = edges.find(
        (e) =>
          (e.source === current.nodeId && e.target === neighbor.neighbor_id) ||
          (e.target === current.nodeId && e.source === neighbor.neighbor_id)
      );

      if (!edge) {
        continue;
      }

      // Apply relationship weight multiplier if specified
      const weightMultiplier = relationshipWeights[edge.rel] || 1.0;
      const edgeWeight = edge.weight * weightMultiplier;
      const newWeight = current.totalWeight + edgeWeight;

      // Only explore if this is a better path
      const currentBest = bestWeight.get(neighbor.neighbor_id) || -Infinity;
      if (newWeight > currentBest) {
        bestWeight.set(neighbor.neighbor_id, newWeight);

        queue.push({
          nodeId: neighbor.neighbor_id,
          path: [...current.path, neighbor.neighbor_id],
          edges: [...current.edges, edge],
          totalWeight: newWeight,
          depth: current.depth + 1,
        });
      }
    }
  }

  return null;
}

// ============================================================================
// SCENE CROSSOVER PATHFINDING
// ============================================================================

/**
 * Find paths that cross between different scenes
 * Useful for discovering scene-crossover artists and tastemakers
 */
export async function findSceneCrossoverPaths(
  scene1Slug: string,
  scene2Slug: string
): Promise<GraphPath[]> {
  // Implementation would:
  // 1. Get all nodes in scene1
  // 2. Get all nodes in scene2
  // 3. Find all paths between nodes in scene1 and scene2
  // 4. Return paths that represent crossover opportunities

  logger.info(`Finding crossover paths between ${scene1Slug} and ${scene2Slug}`);

  // This is a stub - full implementation would require more complex querying
  return [];
}

// ============================================================================
// DEGREES OF SEPARATION
// ============================================================================

/**
 * Calculate degrees of separation between two nodes
 * Returns just the number, not the full path
 */
export async function getDegreesOfSeparation(
  sourceId: string,
  targetId: string,
  maxDepth: number = 6
): Promise<number | null> {
  if (sourceId === targetId) {
    return 0;
  }

  const queue: Array<{ nodeId: string; depth: number }> = [
    { nodeId: sourceId, depth: 0 },
  ];
  const visited = new Set<string>();
  visited.add(sourceId);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.nodeId === targetId) {
      return current.depth;
    }

    if (current.depth >= maxDepth) {
      continue;
    }

    const neighbors = await getNeighbors(current.nodeId, { depth_limit: 1 });

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.neighbor_id)) {
        visited.add(neighbor.neighbor_id);
        queue.push({
          nodeId: neighbor.neighbor_id,
          depth: current.depth + 1,
        });
      }
    }
  }

  return null;
}

// ============================================================================
// ALL PATHS (LIMITED DEPTH)
// ============================================================================

/**
 * Find all paths between two nodes up to a maximum depth
 * WARNING: This can be expensive for highly connected graphs
 */
export async function findAllPaths(
  sourceId: string,
  targetId: string,
  maxDepth: number = 3,
  maxPaths: number = 10
): Promise<GraphPath[]> {
  const paths: GraphPath[] = [];

  interface StackItem {
    nodeId: string;
    path: string[];
    edges: MIGEdge[];
    visited: Set<string>;
  }

  const stack: StackItem[] = [
    {
      nodeId: sourceId,
      path: [sourceId],
      edges: [],
      visited: new Set([sourceId]),
    },
  ];

  while (stack.length > 0 && paths.length < maxPaths) {
    const current = stack.pop()!;

    if (current.nodeId === targetId) {
      const nodes: MIGNode[] = [];
      for (const nodeId of current.path) {
        const node = await getNodeById(nodeId);
        if (node) {
          nodes.push(node);
        }
      }

      const totalWeight = current.edges.reduce((sum, edge) => sum + edge.weight, 0);

      paths.push({
        nodes,
        edges: current.edges,
        total_weight: totalWeight,
        path_length: current.path.length - 1,
      });

      continue;
    }

    if (current.path.length > maxDepth) {
      continue;
    }

    const neighbors = await getNeighbors(current.nodeId, { depth_limit: 1 });

    for (const neighbor of neighbors) {
      if (current.visited.has(neighbor.neighbor_id)) {
        continue;
      }

      const edges = await getAllEdges(current.nodeId);
      const edge = edges.find(
        (e) =>
          (e.source === current.nodeId && e.target === neighbor.neighbor_id) ||
          (e.target === current.nodeId && e.source === neighbor.neighbor_id)
      );

      if (edge) {
        const newVisited = new Set(current.visited);
        newVisited.add(neighbor.neighbor_id);

        stack.push({
          nodeId: neighbor.neighbor_id,
          path: [...current.path, neighbor.neighbor_id],
          edges: [...current.edges, edge],
          visited: newVisited,
        });
      }
    }
  }

  return paths;
}

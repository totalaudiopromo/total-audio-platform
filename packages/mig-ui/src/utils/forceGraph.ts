/**
 * MIG Force-Directed Graph Utilities
 * Client-side graph physics simulation (UI-only, no backend)
 */

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
} from 'd3-force';
import type { GraphNode, GraphEdge, GraphData, PerformanceMode } from '../types';

/**
 * Create and configure force simulation based on performance mode
 */
export function createForceSimulation(
  data: GraphData,
  width: number,
  height: number,
  mode: PerformanceMode = 'normal'
): Simulation<GraphNode, GraphEdge> {
  const { nodes, edges } = data;

  // Performance mode settings
  const settings = getPerformanceSettings(mode);

  // Create simulation
  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink<GraphNode, GraphEdge>(edges)
        .id((d) => d.id)
        .distance(settings.linkDistance)
        .strength(settings.linkStrength)
    )
    .force('charge', forceManyBody().strength(settings.chargeStrength))
    .force('center', forceCenter(width / 2, height / 2))
    .force('collide', forceCollide(settings.collideRadius))
    .alphaDecay(settings.alphaDecay)
    .velocityDecay(settings.velocityDecay);

  return simulation;
}

/**
 * Get performance settings based on mode
 */
function getPerformanceSettings(mode: PerformanceMode) {
  switch (mode) {
    case 'ultra':
      return {
        linkDistance: 100,
        linkStrength: 0.5,
        chargeStrength: -200,
        collideRadius: 30,
        alphaDecay: 0.1, // Fast convergence
        velocityDecay: 0.6, // High friction
      };
    case 'high-performance':
      return {
        linkDistance: 80,
        linkStrength: 0.7,
        chargeStrength: -300,
        collideRadius: 35,
        alphaDecay: 0.05,
        velocityDecay: 0.5,
      };
    case 'normal':
    default:
      return {
        linkDistance: 100,
        linkStrength: 1,
        chargeStrength: -400,
        collideRadius: 40,
        alphaDecay: 0.02,
        velocityDecay: 0.4,
      };
  }
}

/**
 * Calculate node size based on degree (connections)
 */
export function calculateNodeSize(node: GraphNode, mode: PerformanceMode): number {
  if (mode === 'high-performance' || mode === 'ultra') {
    return 8; // Fixed size for performance
  }

  const degree = node.degree || 1;
  const baseSize = 8;
  const maxSize = 24;

  // Logarithmic scaling for better visual distribution
  return Math.min(baseSize + Math.log(degree + 1) * 3, maxSize);
}

/**
 * Client-side BFS pathfinding (UI-only, no backend call)
 */
export function findClientPath(
  sourceId: string,
  targetId: string,
  data: GraphData
): { nodes: GraphNode[]; edges: GraphEdge[]; distance: number } | null {
  const { nodes, edges } = data;

  // Build adjacency list from edges
  const adjacency = new Map<string, Array<{ nodeId: string; edge: GraphEdge }>>();
  for (const edge of edges) {
    const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
    const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;

    if (!adjacency.has(sourceId)) adjacency.set(sourceId, []);
    if (!adjacency.has(targetId)) adjacency.set(targetId, []);

    adjacency.get(sourceId)!.push({ nodeId: targetId, edge });
    adjacency.get(targetId)!.push({ nodeId: sourceId, edge });
  }

  // BFS
  const queue: Array<{ nodeId: string; path: string[]; pathEdges: GraphEdge[] }> = [
    { nodeId: sourceId, path: [sourceId], pathEdges: [] },
  ];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.nodeId === targetId) {
      // Found path - reconstruct with full node objects
      const pathNodes = current.path
        .map((id) => nodes.find((n) => n.id === id))
        .filter((n): n is GraphNode => n !== undefined);

      return {
        nodes: pathNodes,
        edges: current.pathEdges,
        distance: current.path.length - 1,
      };
    }

    const neighbors = adjacency.get(current.nodeId) || [];
    for (const { nodeId, edge } of neighbors) {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        queue.push({
          nodeId,
          path: [...current.path, nodeId],
          pathEdges: [...current.pathEdges, edge],
        });
      }
    }
  }

  return null; // No path found
}

/**
 * Calculate graph bounds for zoom/pan limits
 */
export function calculateGraphBounds(nodes: GraphNode[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };
  }

  const positions = nodes.filter((n) => n.x !== undefined && n.y !== undefined);

  if (positions.length === 0) {
    return { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };
  }

  const xs = positions.map((n) => n.x!);
  const ys = positions.map((n) => n.y!);

  return {
    minX: Math.min(...xs) - 200,
    maxX: Math.max(...xs) + 200,
    minY: Math.min(...ys) - 200,
    maxY: Math.max(...ys) + 200,
  };
}

/**
 * Check if node is within viewport (for culling)
 */
export function isNodeInViewport(
  node: GraphNode,
  transform: { x: number; y: number; k: number },
  width: number,
  height: number
): boolean {
  if (!node.x || !node.y) return false;

  const screenX = node.x * transform.k + transform.x;
  const screenY = node.y * transform.k + transform.y;

  const margin = 100; // Extra margin for smooth rendering

  return (
    screenX >= -margin &&
    screenX <= width + margin &&
    screenY >= -margin &&
    screenY <= height + margin
  );
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format relationship type for display
 */
export function formatRelationship(rel: string): string {
  return rel
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

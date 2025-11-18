/**
 * MIG Graph Hook
 * Manages graph data fetching and state (UI-only, reads from existing APIs)
 */

import { useState, useEffect, useCallback } from 'react';
import type { GraphData, GraphNode, GraphEdge, PerformanceMode } from '../types';

export interface UseMIGGraphOptions {
  initialSearch?: string;
  initialType?: string;
  limit?: number;
  performanceMode?: PerformanceMode;
}

export interface UseMIGGraphReturn {
  data: GraphData;
  loading: boolean;
  error: string | null;
  searchNodes: (query: string, type?: string) => Promise<void>;
  loadNode: (slug: string) => Promise<void>;
  centerOnNode: (nodeId: string) => void;
  performanceMode: PerformanceMode;
  setPerformanceMode: (mode: PerformanceMode) => void;
}

/**
 * Hook to manage MIG graph data
 * Fetches from existing /api/mig/* routes only
 */
export function useMIGGraph(options: UseMIGGraphOptions = {}): UseMIGGraphReturn {
  const [data, setData] = useState<GraphData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>(
    options.performanceMode || 'normal'
  );

  /**
   * Search nodes via existing /api/mig/search
   */
  const searchNodes = useCallback(async (query: string, type?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query,
        limit: (options.limit || 50).toString(),
      });

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`/api/mig/search?${params.toString()}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Search failed');
      }

      // Convert API nodes to graph nodes
      const nodes: GraphNode[] = result.data.results.map((node: any, index: number) => ({
        id: node.id,
        slug: node.slug,
        name: node.name,
        type: node.type,
        metadata: node.metadata,
        country: node.country,
        degree: 0, // Will be calculated from edges
      }));

      // For each node, fetch neighbors to build edges
      const edgeMap = new Map<string, GraphEdge>();
      const nodeIds = new Set(nodes.map((n) => n.id));

      // Fetch neighbors for first 20 nodes to build initial graph
      const nodesToExpand = nodes.slice(0, 20);

      await Promise.all(
        nodesToExpand.map(async (node) => {
          try {
            const neighborResponse = await fetch(
              `/api/mig/node/${node.slug}?include_neighbors=true&neighbor_depth=1`
            );
            const neighborResult = await neighborResponse.json();

            if (neighborResult.success && neighborResult.data.neighbors) {
              neighborResult.data.neighbors.forEach((neighbor: any) => {
                // Add neighbor node if not already in graph
                if (!nodeIds.has(neighbor.neighbor_id)) {
                  nodes.push({
                    id: neighbor.neighbor_id,
                    slug: neighbor.neighbor_id, // Use ID as slug fallback
                    name: neighbor.neighbor_name,
                    type: neighbor.neighbor_type,
                    degree: 0,
                  });
                  nodeIds.add(neighbor.neighbor_id);
                }

                // Add edge
                const edgeId = `${node.id}-${neighbor.neighbor_id}`;
                if (!edgeMap.has(edgeId)) {
                  edgeMap.set(edgeId, {
                    id: edgeId,
                    source: node.id,
                    target: neighbor.neighbor_id,
                    relationship: neighbor.relationship,
                    weight: neighbor.weight || 1,
                  });
                }
              });
            }
          } catch (err) {
            console.warn(`Failed to fetch neighbors for ${node.slug}`, err);
          }
        })
      );

      const edges = Array.from(edgeMap.values());

      // Calculate degrees
      const degrees = new Map<string, number>();
      edges.forEach((edge) => {
        const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
        const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
        degrees.set(sourceId, (degrees.get(sourceId) || 0) + 1);
        degrees.set(targetId, (degrees.get(targetId) || 0) + 1);
      });

      nodes.forEach((node) => {
        node.degree = degrees.get(node.id) || 0;
      });

      setData({ nodes, edges });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [options.limit]);

  /**
   * Load a specific node and its neighborhood
   */
  const loadNode = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/mig/node/${slug}?include_neighbors=true&neighbor_depth=2`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Node not found');
      }

      const centerNode: GraphNode = {
        id: result.data.node.id,
        slug: result.data.node.slug,
        name: result.data.node.name,
        type: result.data.node.type,
        metadata: result.data.node.metadata,
        country: result.data.node.country,
        degree: 0,
      };

      const nodes: GraphNode[] = [centerNode];
      const edges: GraphEdge[] = [];
      const nodeIds = new Set([centerNode.id]);

      // Add neighbors
      if (result.data.neighbors) {
        result.data.neighbors.forEach((neighbor: any) => {
          if (!nodeIds.has(neighbor.neighbor_id)) {
            nodes.push({
              id: neighbor.neighbor_id,
              slug: neighbor.neighbor_id,
              name: neighbor.neighbor_name,
              type: neighbor.neighbor_type,
              degree: 0,
            });
            nodeIds.add(neighbor.neighbor_id);
          }

          edges.push({
            id: `${centerNode.id}-${neighbor.neighbor_id}`,
            source: centerNode.id,
            target: neighbor.neighbor_id,
            relationship: neighbor.relationship,
            weight: neighbor.weight || 1,
          });
        });
      }

      // Calculate degrees
      const degrees = new Map<string, number>();
      edges.forEach((edge) => {
        const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
        const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
        degrees.set(sourceId, (degrees.get(sourceId) || 0) + 1);
        degrees.set(targetId, (degrees.get(targetId) || 0) + 1);
      });

      nodes.forEach((node) => {
        node.degree = degrees.get(node.id) || 0;
      });

      setData({ nodes, edges });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Center graph on a specific node (UI-only)
   */
  const centerOnNode = useCallback((nodeId: string) => {
    // This will be handled by the GraphCanvas component
    // Just emit an event or use a ref
    window.dispatchEvent(
      new CustomEvent('mig:center-node', {
        detail: { nodeId },
      })
    );
  }, []);

  // Initial load if search provided
  useEffect(() => {
    if (options.initialSearch) {
      searchNodes(options.initialSearch, options.initialType);
    }
  }, []); // Only run once on mount

  return {
    data,
    loading,
    error,
    searchNodes,
    loadNode,
    centerOnNode,
    performanceMode,
    setPerformanceMode,
  };
}

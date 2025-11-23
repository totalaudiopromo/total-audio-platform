/**
 * Node Inspector Hook
 * Manages node inspector drawer state (UI-only, reads from existing APIs)
 */

import { useState, useCallback } from 'react';
import type { GraphNode, NodeInspectorState } from '../types';

export interface UseNodeInspectorReturn extends NodeInspectorState {
  openNode: (node: GraphNode) => Promise<void>;
  close: () => void;
  fetchNodeDetails: (node: GraphNode) => Promise<void>;
}

/**
 * Hook to manage node inspector drawer
 * Fetches data from existing /api/mig/* routes only
 */
export function useNodeInspector(): UseNodeInspectorReturn {
  const [state, setState] = useState<NodeInspectorState>({
    isOpen: false,
    selectedNode: null,
    loading: false,
    data: {},
  });

  /**
   * Open inspector and fetch node details
   */
  const openNode = useCallback(async (node: GraphNode) => {
    setState({
      isOpen: true,
      selectedNode: node,
      loading: true,
      data: {},
    });

    await fetchNodeDetails(node);
  }, []);

  /**
   * Fetch all node details from existing APIs
   */
  const fetchNodeDetails = useCallback(async (node: GraphNode) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const data: NodeInspectorState['data'] = {};

      // Always fetch neighbors
      try {
        const neighborResponse = await fetch(
          `/api/mig/node/${node.slug}?include_neighbors=true&neighbor_depth=1`
        );
        const neighborResult = await neighborResponse.json();

        if (neighborResult.success) {
          data.neighbors = neighborResult.data.neighbors || [];
        }
      } catch (err) {
        console.warn('Failed to fetch neighbors', err);
      }

      // If node is an artist, fetch additional data
      if (node.type === 'artist') {
        // Scene alignment
        try {
          const sceneResponse = await fetch(`/api/mig-integration/scene-alignment/${node.slug}`);
          const sceneResult = await sceneResponse.json();

          if (sceneResult.success) {
            data.sceneAlignment = sceneResult.data || [];
          }
        } catch (err) {
          console.warn('Failed to fetch scene alignment', err);
        }

        // Graph opportunities
        try {
          const oppsResponse = await fetch(
            `/api/mig-integration/graph-opportunities/${node.slug}`
          );
          const oppsResult = await oppsResponse.json();

          if (oppsResult.success) {
            data.opportunities = oppsResult.data || [];
          }
        } catch (err) {
          console.warn('Failed to fetch opportunities', err);
        }

        // Correlations
        try {
          const corrResponse = await fetch(`/api/mig-integration/correlations/${node.slug}`);
          const corrResult = await corrResponse.json();

          if (corrResult.success) {
            data.correlations = corrResult.data || [];
          }
        } catch (err) {
          console.warn('Failed to fetch correlations', err);
        }
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        data,
      }));
    } catch (err) {
      console.error('Error fetching node details', err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Close inspector
   */
  const close = useCallback(() => {
    setState({
      isOpen: false,
      selectedNode: null,
      loading: false,
      data: {},
    });
  }, []);

  return {
    ...state,
    openNode,
    close,
    fetchNodeDetails,
  };
}

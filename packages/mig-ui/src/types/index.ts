/**
 * MIG UI Types - Phase 5
 * UI-only types for graph visualization (no backend overlap)
 */

// MIG Node Types (from existing API)
export type MIGNodeType =
  | 'artist'
  | 'journalist'
  | 'radio_host'
  | 'playlist'
  | 'blog'
  | 'publication'
  | 'scene'
  | 'microgenre'
  | 'label'
  | 'dj'
  | 'event'
  | 'venue'
  | 'festival'
  | 'radio_show'
  | 'podcast';

// UI-specific graph node (augmented with visualization props)
export interface GraphNode {
  id: string;
  slug: string;
  name: string;
  type: MIGNodeType;
  // Visualization properties (client-only)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  degree?: number;
  // API data
  metadata?: Record<string, any>;
  country?: string | null;
}

// UI-specific graph edge (from existing API data)
export interface GraphEdge {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  relationship: string;
  weight: number;
}

// Graph layout for visualization
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Performance mode (UI toggle only)
export type PerformanceMode = 'normal' | 'high-performance' | 'ultra';

// Node Inspector state (UI only)
export interface NodeInspectorState {
  isOpen: boolean;
  selectedNode: GraphNode | null;
  loading: boolean;
  data: {
    neighbors?: any[];
    sceneAlignment?: any[];
    opportunities?: any[];
    correlations?: any[];
  };
}

// Path state (client-side pathfinding UI)
export interface PathState {
  active: boolean;
  sourceNode: GraphNode | null;
  targetNode: GraphNode | null;
  path: GraphNode[];
  edges: GraphEdge[];
  distance: number;
}

// Quick action types
export type QuickActionType =
  | 'find-similar'
  | 'show-path'
  | 'highlight-scene'
  | 'pitch-opportunities'
  | 'jump-to-pulse';

export interface QuickAction {
  id: string;
  type: QuickActionType;
  label: string;
  icon: string;
  shortcut?: string;
  handler: () => void;
}

// Dev panel metrics (UI only)
export interface DevMetrics {
  cacheHits: number;
  cacheMisses: number;
  lastApiTimes: Record<string, number>;
  fps: number;
  nodeCount: number;
  edgeCount: number;
}

// Node colors by type (Flow State design)
export const NODE_COLORS: Record<MIGNodeType, string> = {
  artist: '#3AA9BE', // Slate cyan (primary)
  journalist: '#8B5CF6', // Purple
  radio_host: '#F59E0B', // Amber
  playlist: '#10B981', // Emerald
  blog: '#EC4899', // Pink
  publication: '#6366F1', // Indigo
  scene: '#F97316', // Orange
  microgenre: '#14B8A6', // Teal
  label: '#EF4444', // Red
  dj: '#84CC16', // Lime
  event: '#A855F7', // Purple
  venue: '#06B6D4', // Cyan
  festival: '#F43F5E', // Rose
  radio_show: '#FBBF24', // Yellow
  podcast: '#A78BFA', // Violet
};

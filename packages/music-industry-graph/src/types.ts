/**
 * Music Industry Graph (MIG) - Core Type Definitions
 *
 * This module defines all TypeScript types for the MIG system.
 * MIG is a graph-based data intelligence layer that models the entire
 * UK/EU/global music ecosystem.
 */

// ============================================================================
// NODE TYPES
// ============================================================================

/**
 * All possible entity types in the music industry graph
 */
export type MIGNodeType =
  | 'artist'
  | 'journalist'
  | 'radio_host'
  | 'playlist'
  | 'blog'
  | 'dj'
  | 'label'
  | 'scene'
  | 'microgenre'
  | 'event'
  | 'venue'
  | 'festival'
  | 'radio_show'
  | 'podcast';

/**
 * Base metadata structure for nodes
 */
export interface MIGNodeMetadata {
  description?: string;
  genres?: string[];
  subgenres?: string[];
  location?: {
    city?: string;
    region?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  stats?: {
    followers?: number;
    monthly_listeners?: number;
    reach?: number;
  };
  tags?: string[];
  [key: string]: any; // Allow flexible metadata
}

/**
 * External platform IDs for cross-referencing
 */
export interface MIGExternalIds {
  spotify_id?: string;
  apple_music_id?: string;
  discogs_id?: string;
  musicbrainz_id?: string;
  bandcamp_url?: string;
  soundcloud_id?: string;
  youtube_channel_id?: string;
  [key: string]: string | undefined;
}

/**
 * Core node entity in the music industry graph
 */
export interface MIGNode {
  id: string;
  type: MIGNodeType;
  name: string;
  slug: string;
  country: string | null;
  metadata: MIGNodeMetadata;
  external_ids: MIGExternalIds;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating new nodes
 */
export type MIGNodeInput = Omit<MIGNode, 'id' | 'created_at' | 'updated_at'>;

// ============================================================================
// EDGE/RELATIONSHIP TYPES
// ============================================================================

/**
 * All possible relationship types between nodes
 */
export type MIGRelationshipType =
  | 'influences'
  | 'supports'
  | 'covers'
  | 'follows'
  | 'writes_for'
  | 'programmes'
  | 'collaborates'
  | 'same_scene'
  | 'same_microgenre'
  | 'similar_audience'
  | 'scene_crossover'
  | 'trend_link'
  | 'plays_at'
  | 'books'
  | 'manages'
  | 'releases_on'
  | 'curates'
  | 'interviews'
  | 'reviews'
  | 'similar_to'
  | 'influenced_by'
  | 'remixes'
  | 'features'
  | 'part_of';

/**
 * Metadata for relationships/edges
 */
export interface MIGEdgeMetadata {
  confidence?: number; // 0-1 confidence score
  source_system?: string; // Where this relationship was discovered
  verified?: boolean;
  timestamp?: string; // When this relationship was observed
  context?: string; // Additional context about the relationship
  [key: string]: any;
}

/**
 * Core edge/relationship in the music industry graph
 */
export interface MIGEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  rel: MIGRelationshipType;
  weight: number;
  metadata: MIGEdgeMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * Input type for creating new edges
 */
export type MIGEdgeInput = Omit<MIGEdge, 'id' | 'created_at' | 'updated_at'>;

// ============================================================================
// GRAPH QUERY TYPES
// ============================================================================

/**
 * Options for neighbor queries
 */
export interface NeighborQueryOptions {
  relationship_filter?: MIGRelationshipType[];
  depth_limit?: number;
  min_weight?: number;
  node_type_filter?: MIGNodeType[];
}

/**
 * Result of a neighbor query
 */
export interface NeighborResult {
  neighbor_id: string;
  neighbor_name: string;
  neighbor_type: MIGNodeType;
  relationship: MIGRelationshipType;
  weight: number;
  path_length: number;
}

/**
 * Graph traversal result
 */
export interface GraphPath {
  nodes: MIGNode[];
  edges: MIGEdge[];
  total_weight: number;
  path_length: number;
}

/**
 * Options for graph queries
 */
export interface GraphQueryOptions {
  max_depth?: number;
  max_results?: number;
  min_weight?: number;
  node_types?: MIGNodeType[];
  relationship_types?: MIGRelationshipType[];
  country_filter?: string;
}

/**
 * Result of a graph query
 */
export interface GraphQueryResult {
  nodes: MIGNode[];
  edges: MIGEdge[];
  total_results: number;
  query_time_ms: number;
}

/**
 * Natural language query structure
 */
export interface NLQuery {
  raw_query: string;
  parsed: {
    intent: 'find' | 'recommend' | 'path' | 'influence' | 'scene';
    node_types?: MIGNodeType[];
    filters?: {
      location?: string;
      genre?: string;
      scene?: string;
      microgenre?: string;
    };
    relationships?: MIGRelationshipType[];
    target_node?: string;
  };
}

// ============================================================================
// RECOMMENDATION TYPES
// ============================================================================

/**
 * Recommendation result
 */
export interface GraphRecommendation {
  node: MIGNode;
  score: number;
  reasoning: string;
  related_nodes: MIGNode[];
  common_connections: number;
}

/**
 * Recommendation options
 */
export interface RecommendationOptions {
  limit?: number;
  min_score?: number;
  include_reasoning?: boolean;
  diversify?: boolean;
  filters?: {
    node_types?: MIGNodeType[];
    country?: string;
    min_followers?: number;
  };
}

// ============================================================================
// SCENE & MICROGENRE TYPES
// ============================================================================

/**
 * Scene metadata
 */
export interface SceneMetadata {
  description?: string;
  key_artists?: string[];
  key_venues?: string[];
  key_events?: string[];
  microgenres?: string[];
  growth_rate?: number; // Percentage growth per month
  trending?: boolean;
  geographic_center?: {
    city: string;
    country: string;
  };
}

/**
 * Scene pulse metrics
 */
export interface ScenePulse {
  scene_slug: string;
  scene_name: string;
  total_nodes: number;
  total_edges: number;
  growth_rate_30d: number; // Percentage change in edges over 30 days
  new_nodes_30d: number;
  interaction_intensity: number; // Average edge weight
  trending_microgenres: string[];
  top_artists: Array<{
    name: string;
    slug: string;
    influence_score: number;
  }>;
  cross_scene_links: Array<{
    scene_slug: string;
    scene_name: string;
    connection_strength: number;
  }>;
}

/**
 * Country-level scene pulse
 */
export interface CountryScenePulse {
  country: string;
  scenes: ScenePulse[];
  total_activity: number;
  trending_scenes: string[];
  emerging_microgenres: string[];
}

/**
 * Microgenre cluster
 */
export interface MicrogenreCluster {
  microgenre_slug: string;
  microgenre_name: string;
  total_artists: number;
  total_tracks?: number;
  representative_artists: string[];
  related_scenes: string[];
  adjacent_microgenres: Array<{
    slug: string;
    name: string;
    similarity_score: number;
  }>;
  geographic_distribution: Array<{
    country: string;
    artist_count: number;
  }>;
}

// ============================================================================
// INFLUENCE & PATHFINDING TYPES
// ============================================================================

/**
 * Influence score breakdown
 */
export interface InfluenceScore {
  node_id: string;
  total_score: number;
  outgoing_influence: number;
  incoming_influence: number;
  breakdown: {
    influences: number;
    supports: number;
    collaborations: number;
    other: number;
  };
}

/**
 * Pathfinding options
 */
export interface PathfindingOptions {
  max_depth?: number;
  relationship_weights?: Partial<Record<MIGRelationshipType, number>>;
  avoid_node_types?: MIGNodeType[];
}

/**
 * Pathfinding result
 */
export interface PathfindingResult {
  path: GraphPath;
  degrees_of_separation: number;
  total_weight: number;
  relationship_breakdown: Record<MIGRelationshipType, number>;
}

// ============================================================================
// GRAPH METADATA TYPES
// ============================================================================

/**
 * Graph-wide metadata
 */
export interface MIGMetadata {
  key: string;
  value: any;
  updated_at: string;
}

/**
 * Graph statistics
 */
export interface GraphStatistics {
  total_nodes: number;
  total_edges: number;
  nodes_by_type: Record<MIGNodeType, number>;
  edges_by_type: Record<MIGRelationshipType, number>;
  countries: string[];
  scenes: number;
  microgenres: number;
  last_updated: string;
}

// ============================================================================
// EMBEDDING & CLUSTERING TYPES
// ============================================================================

/**
 * Node embedding (for similarity/clustering)
 */
export interface NodeEmbedding {
  node_id: string;
  vector: number[];
  dimensions: number;
  model: string;
  created_at: string;
}

/**
 * Cluster result
 */
export interface ClusterResult {
  cluster_id: string;
  nodes: MIGNode[];
  centroid?: number[];
  coherence_score: number;
  label?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface MIGAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  meta?: {
    query_time_ms: number;
    total_results: number;
  };
}

// ============================================================================
// FUSION LAYER INTEGRATION TYPES
// ============================================================================

/**
 * Fusion Layer artist data (read-only)
 */
export interface FusionArtistData {
  artist_id: string;
  name: string;
  genres: string[];
  scenes?: string[];
  emotional_arc?: any; // CMG data
  campaign_history?: any[];
}

/**
 * Fusion Layer scene data (read-only)
 */
export interface FusionSceneData {
  scene_id: string;
  name: string;
  description?: string;
  location?: string;
  active: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Paginated results
 */
export interface PaginatedResults<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

/**
 * Search filters
 */
export interface SearchFilters {
  query?: string;
  node_types?: MIGNodeType[];
  country?: string;
  genres?: string[];
  tags?: string[];
}

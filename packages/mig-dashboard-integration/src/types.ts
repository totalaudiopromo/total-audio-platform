/**
 * MIG Dashboard Integration - Type Definitions
 * Phase 3: Fuses MIG with all Total Audio intelligence systems
 */

export interface MIGInfluenceScore {
  entity_slug: string;
  entity_type: string;
  influence_score: number;
  authority_score: number;
  relevance_score: number;
  metadata: Record<string, any>;
}

export interface MIGSceneAlignment {
  artist_slug: string;
  scene_slug: string;
  alignment: number; // 0-1
  source: Record<string, any>;
  reasoning?: string;
}

export interface MIGContactFit {
  contact_id: string;
  artist_slug: string;
  fit_score: number; // 0-1
  reasons: string[];
  mig_paths: GraphPath[];
  graph_distance?: number;
  shared_scenes: string[];
  shared_microgenres: string[];
  mutual_connections: number;
}

export interface GraphPath {
  nodes: string[];
  edges: Array<{
    from: string;
    to: string;
    relationship: string;
    weight: number;
  }>;
  total_weight: number;
  length: number;
}

export interface MIGCoverageEvent {
  artist_slug: string;
  mig_node_slug: string;
  mig_node_type: string;
  coverage_type: string;
  mig_impact_score: number;
  connected_nodes: string[];
  influence_delta: number;
  timestamp: string;
}

export interface MIGGraphOpportunity {
  type: 'journalist' | 'playlist' | 'radio_host' | 'dj' | 'blog';
  name: string;
  slug: string;
  fit_score: number;
  reasoning: string;
  path_summary: string;
  recommended_action: string;
}

export interface MIGCorrelation {
  artist_slug: string;
  correlation_type: string;
  mig_metric: string;
  campaign_metric: string;
  correlation_coefficient: number;
  confidence: number;
  sample_size: number;
}

export interface MIGDashboardInsight {
  type: 'rising_scene' | 'key_journalist' | 'graph_opportunity' | 'microgenre_adjacent' | 'pitch_target' | 'ecosystem_role';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  entities: Array<{
    slug: string;
    type: string;
    name: string;
  }>;
  action?: string;
  metadata?: Record<string, any>;
}

export interface MIGPitchIntelBoost {
  contact_slug: string;
  suggested_angles: string[];
  graph_relationships: Array<{
    type: string;
    description: string;
    relevance: number;
  }>;
  scene_context: string;
  microgenre_context: string;
  similar_coverage: Array<{
    artist: string;
    context: string;
  }>;
}

export interface MIGAutopilotCapability {
  capability_id: string;
  name: string;
  description: string;
  mig_powered: boolean;
  requires_graph_data: string[];
}

export interface MIGWritersRoomSignal {
  angle_type: 'influence' | 'adjacency' | 'scene_positioning' | 'narrative_arc';
  headline: string;
  talking_points: string[];
  graph_evidence: GraphPath[];
  press_worthiness_score: number;
}

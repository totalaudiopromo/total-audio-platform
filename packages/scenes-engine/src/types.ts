/**
 * Core Types for Scenes Engine
 */

// ============================================================================
// DATABASE ENTITIES
// ============================================================================

/**
 * Scene - High-level cultural cluster
 */
export interface Scene {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  region: string | null;
  country: string | null;
  microgenres: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Microgenre - Granular style classification
 */
export interface Microgenre {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_scene_slug: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Scene Membership - Links entities to scenes/microgenres
 */
export interface SceneMembership {
  id: string;
  entity_type: EntityType;
  entity_id: string | null;
  entity_slug: string;
  scene_slug: string;
  microgenre_slug: string | null;
  confidence: number;
  source: MembershipSource;
  created_at: string;
}

/**
 * Scene Trend - Time-series metric
 */
export interface SceneTrend {
  id: string;
  scene_slug: string;
  microgenre_slug: string | null;
  time_bucket: string; // ISO date string (YYYY-MM-DD)
  metric: TrendMetric;
  value: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Scene Relationship - Scene-to-scene connections
 */
export interface SceneRelationship {
  id: string;
  source_scene_slug: string;
  target_scene_slug: string;
  relation_type: RelationType;
  weight: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Scene Recommendations Cache
 */
export interface SceneRecommendationsCache {
  id: string;
  user_id: string;
  artist_slug: string | null;
  recommendations: SceneRecommendation;
  created_at: string;
  expires_at: string;
}

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Entity types that can be members of scenes
 */
export type EntityType =
  | 'artist'
  | 'dj'
  | 'playlist'
  | 'radio_show'
  | 'label'
  | 'event'
  | 'venue'
  | 'promoter';

/**
 * Sources for scene membership inference
 */
export type MembershipSource =
  | 'mig'
  | 'cmg'
  | 'manual'
  | 'ai_inference'
  | 'fusion'
  | 'user_input'
  | 'editorial';

/**
 * Trend metrics tracked over time
 */
export type TrendMetric =
  | 'campaign_volume'
  | 'coverage'
  | 'playlist_adds'
  | 'radio_plays'
  | 'community_mentions'
  | 'new_members'
  | 'social_engagement'
  | 'streaming_volume';

/**
 * Scene relationship types
 */
export type RelationType =
  | 'influences'
  | 'shares_audience'
  | 'crossover'
  | 'adjacent'
  | 'emerging_from'
  | 'merged_into'
  | 'spawned';

/**
 * Growth classification
 */
export type GrowthClassification =
  | 'Emerging'
  | 'Hot'
  | 'Stable'
  | 'Cooling'
  | 'Niche'
  | 'Dormant';

// ============================================================================
// ANALYTICAL TYPES
// ============================================================================

/**
 * Scene Pulse - Real-time scene health snapshot
 */
export interface ScenePulseSnapshot {
  sceneSlug: string;
  sceneName: string;
  region: string | null;
  hotnessScore: number; // 0-100
  growthRate: number; // -1 to +infinity (percentage)
  growthClassification: GrowthClassification;
  crossoverPotential: number; // 0-100
  microgenreHighlights: MicrogenreHighlight[];
  momentum: {
    shortTerm: number; // Last 7-30 days
    longTerm: number; // Last 90-365 days
    trend: 'rising' | 'stable' | 'falling';
  };
  metrics: {
    totalMembers: number;
    activeCampaigns: number;
    recentCoverage: number;
    communityEngagement: number;
  };
  timestamp: string;
}

/**
 * Microgenre highlight within a scene
 */
export interface MicrogenreHighlight {
  slug: string;
  name: string;
  score: number;
  trendDirection: 'up' | 'down' | 'stable';
}

/**
 * Scene Recommendation Result
 */
export interface SceneRecommendation {
  scenes: SceneRecommendationItem[];
  microgenres: MicrogenreRecommendationItem[];
  notes: string[];
  generatedAt: string;
}

/**
 * Individual scene recommendation
 */
export interface SceneRecommendationItem {
  slug: string;
  name: string;
  score: number; // 0-1
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  category: 'core' | 'adjacent' | 'opportunity' | 'experimental';
}

/**
 * Individual microgenre recommendation
 */
export interface MicrogenreRecommendationItem {
  slug: string;
  name: string;
  score: number; // 0-1
  reason: string;
  parentScenes: string[];
}

// ============================================================================
// QUERY AND FILTER TYPES
// ============================================================================

/**
 * Scene query filters
 */
export interface SceneFilters {
  region?: string;
  country?: string;
  tag?: string;
  microgenre?: string;
  minHotness?: number;
  maxHotness?: number;
  growthClassification?: GrowthClassification;
}

/**
 * Trend query options
 */
export interface TrendQueryOptions {
  sceneSlug: string;
  microgenreSlug?: string;
  metric: TrendMetric;
  startDate: Date;
  endDate: Date;
  bucket?: 'day' | 'week' | 'month';
}

/**
 * Membership query options
 */
export interface MembershipQueryOptions {
  sceneSlug?: string;
  microgenreSlug?: string;
  entityType?: EntityType;
  entitySlug?: string;
  minConfidence?: number;
  source?: MembershipSource;
  limit?: number;
}

// ============================================================================
// ENGINE INPUT/OUTPUT TYPES
// ============================================================================

/**
 * Input for creating/updating a scene
 */
export interface CreateSceneInput {
  slug: string;
  name: string;
  description?: string;
  region?: string;
  country?: string;
  microgenres?: string[];
  tags?: string[];
}

/**
 * Input for creating/updating a microgenre
 */
export interface CreateMicrogenreInput {
  slug: string;
  name: string;
  description?: string;
  parent_scene_slug?: string;
  tags?: string[];
}

/**
 * Input for creating a scene membership
 */
export interface CreateMembershipInput {
  entity_type: EntityType;
  entity_id?: string;
  entity_slug: string;
  scene_slug: string;
  microgenre_slug?: string;
  confidence: number;
  source: MembershipSource;
}

/**
 * Input for recording a trend data point
 */
export interface CreateTrendInput {
  scene_slug: string;
  microgenre_slug?: string;
  time_bucket: string; // ISO date string
  metric: TrendMetric;
  value: number;
  metadata?: Record<string, unknown>;
}

/**
 * Input for creating a scene relationship
 */
export interface CreateRelationshipInput {
  source_scene_slug: string;
  target_scene_slug: string;
  relation_type: RelationType;
  weight: number;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// AGGREGATION AND ANALYSIS TYPES
// ============================================================================

/**
 * Aggregated scene statistics
 */
export interface SceneStats {
  sceneSlug: string;
  totalMembers: number;
  membersByType: Record<EntityType, number>;
  microgenreDistribution: Record<string, number>;
  avgConfidence: number;
  topSources: Array<{ source: MembershipSource; count: number }>;
}

/**
 * Trend analysis result
 */
export interface TrendAnalysis {
  sceneSlug: string;
  metric: TrendMetric;
  period: {
    start: string;
    end: string;
  };
  values: Array<{
    date: string;
    value: number;
  }>;
  summary: {
    mean: number;
    median: number;
    min: number;
    max: number;
    total: number;
    growth: number; // percentage
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

/**
 * Scene cluster - group of related scenes
 */
export interface SceneCluster {
  scenes: string[];
  centerScene: string;
  avgInterconnectedness: number;
  dominantRegion: string | null;
  sharedMicrogenres: string[];
}

/**
 * Entity's scene affinity profile
 */
export interface EntitySceneProfile {
  entitySlug: string;
  entityType: EntityType;
  primaryScene: {
    slug: string;
    name: string;
    confidence: number;
  } | null;
  secondaryScenes: Array<{
    slug: string;
    name: string;
    confidence: number;
  }>;
  microgenres: Array<{
    slug: string;
    name: string;
    confidence: number;
  }>;
  lastUpdated: string;
}

// ============================================================================
// ADAPTER TYPES
// ============================================================================

/**
 * MIG node reference (read-only from MIG)
 */
export interface MIGNodeReference {
  id: string;
  slug: string;
  type: string;
  name: string;
  metadata: Record<string, unknown>;
}

/**
 * Fusion Layer metrics (read-only)
 */
export interface FusionMetrics {
  sceneSlug: string;
  period: {
    start: string;
    end: string;
  };
  campaignVolume: number;
  coverageCount: number;
  playlistAdds: number;
  avgSuccessRate: number;
}

/**
 * CMG arc reference (read-only from CMG)
 */
export interface CMGArcReference {
  artistId: string;
  arcType: string;
  emotionalTone: string;
  themes: string[];
  suggestedMicrogenres: string[];
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class ScenesEngineError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ScenesEngineError';
  }
}

export class ValidationError extends ScenesEngineError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ScenesEngineError {
  constructor(resource: string, identifier: string) {
    super(`${resource} not found: ${identifier}`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

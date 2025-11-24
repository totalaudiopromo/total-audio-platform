/**
 * A&R Radar - Core Types and Interfaces
 *
 * Types for the A&R / Talent Discovery Radar system.
 * Scouting and breakout probability scoring for PR agencies, labels, managers, and artists.
 */

// ========================================
// Event Types
// ========================================

export type ANREventType =
  | 'campaign_win'
  | 'playlist_add'
  | 'radio_play'
  | 'press_feature'
  | 'community_spike'
  | 'scene_crossover'
  | 'creative_breakthrough';

export type ANREventSource = 'tracker' | 'mig' | 'scenes' | 'cmg' | 'manual';

// ========================================
// Candidate Types
// ========================================

export interface ANRCandidate {
  id: string;
  artist_slug: string;
  display_name: string;
  primary_scene_slug?: string;
  microgenres?: string[];
  country?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ANRCandidateInput {
  artist_slug: string;
  display_name: string;
  primary_scene_slug?: string;
  microgenres?: string[];
  country?: string;
  metadata?: Record<string, any>;
}

// ========================================
// Score Types
// ========================================

export interface ScoreDimensions {
  breakout: number;           // 0.0-1.0
  momentum: number;           // 0.0-1.0
  scene_alignment: number;    // 0.0-1.0
  creative_uniqueness: number; // 0.0-1.0
  campaign_efficiency: number; // 0.0-1.0
  engagement_quality: number;  // 0.0-1.0
  risk: number;               // 0.0-1.0 (higher = more risky)
}

export interface ANRScoreSnapshot {
  id: string;
  candidate_id: string;
  snapshot_date: string; // ISO date
  breakout_score: number;
  momentum_score: number;
  scene_alignment_score: number;
  creative_uniqueness_score: number;
  campaign_efficiency_score: number;
  engagement_quality_score: number;
  risk_score: number;
  composite_score: number;
  metadata?: {
    model_version: string;
    weights: Record<string, number>;
    explanation?: string;
    components?: Record<string, any>;
    [key: string]: any;
  };
  created_at: string;
}

export interface ANRScoreInput {
  candidate_id: string;
  snapshot_date: string;
  breakout_score: number;
  momentum_score: number;
  scene_alignment_score: number;
  creative_uniqueness_score: number;
  campaign_efficiency_score: number;
  engagement_quality_score: number;
  risk_score: number;
  composite_score: number;
  metadata?: Record<string, any>;
}

export type ANRScoreModelVersion = string; // e.g., 'v1.0', 'v1.1'

// ========================================
// Event Types
// ========================================

export interface ANREvent {
  id: string;
  candidate_id: string;
  event_type: ANREventType;
  event_date: string; // ISO date
  weight: number;
  source: ANREventSource;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ANREventInput {
  candidate_id: string;
  event_type: ANREventType;
  event_date: string;
  weight?: number;
  source: ANREventSource;
  metadata?: Record<string, any>;
}

// ========================================
// Shortlist Types
// ========================================

export interface ANRShortlist {
  id: string;
  user_id: string;
  workspace_id?: string;
  name: string;
  description?: string;
  criteria: ShortlistCriteria;
  created_at: string;
  updated_at: string;
}

export interface ShortlistCriteria {
  scenes?: string[];
  countries?: string[];
  microgenres?: string[];
  min_composite_score?: number;
  min_breakout_score?: number;
  min_momentum_score?: number;
  momentum_direction?: MomentumDirection;
  growth_timeframe_days?: number;
  limit?: number;
  [key: string]: any;
}

export interface ANRShortlistInput {
  user_id: string;
  workspace_id?: string;
  name: string;
  description?: string;
  criteria: ShortlistCriteria;
}

export interface ANRShortlistMember {
  id: string;
  shortlist_id: string;
  candidate_id: string;
  score?: number;
  position?: number;
  notes?: string;
  created_at: string;
}

export interface ANRShortlistMemberInput {
  shortlist_id: string;
  candidate_id: string;
  score?: number;
  position?: number;
  notes?: string;
}

// ========================================
// Insight Types
// ========================================

export type ANRInsightType =
  | 'scene_opportunity'
  | 'artist_to_watch'
  | 'roster_gap'
  | 'campaign_potential';

export interface ANRInsight {
  id: string;
  user_id: string;
  insight_type: ANRInsightType;
  content: InsightContent;
  created_at: string;
}

export interface InsightContent {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  recommendations?: string[];
  data?: Record<string, any>;
  artists?: string[]; // candidate IDs or slugs
  scenes?: string[];
  [key: string]: any;
}

export interface ANRInsightInput {
  user_id: string;
  insight_type: ANRInsightType;
  content: InsightContent;
}

// ========================================
// Context Types (for Scoring Engine)
// ========================================

export interface ANRContext {
  fusionContext?: FusionContext;
  cmgSummary?: CMGSummary;
  migNeighbors?: MIGNeighborhood;
  sceneContext?: SceneContext;
  campaignHistory?: CampaignHistory;
  communitySignals?: CommunitySignals;
  timeframe?: {
    start_date: string;
    end_date: string;
    days: number;
  };
}

export interface FusionContext {
  artist_slug: string;
  campaigns?: any[];
  engagement_metrics?: {
    total_sends?: number;
    total_opens?: number;
    total_clicks?: number;
    total_replies?: number;
    open_rate?: number;
    reply_rate?: number;
  };
  contacts_coverage?: {
    total_contacts?: number;
    contact_types?: string[];
    regions?: string[];
  };
}

export interface CMGSummary {
  artist_slug: string;
  creative_fingerprint?: Record<string, any>;
  uniqueness_signals?: {
    genre_distance?: number;
    scene_distance?: number;
    innovation_score?: number;
  };
  consistency_score?: number;
}

export interface MIGNeighborhood {
  artist_slug: string;
  playlists?: Array<{ id: string; name: string; followers?: number }>;
  blogs?: Array<{ id: string; name: string; authority?: number }>;
  scenes?: string[];
  related_artists?: string[];
  connectivity_score?: number;
}

export interface SceneContext {
  artist_slug: string;
  primary_scene?: string;
  scenes?: Array<{
    slug: string;
    name: string;
    pulse?: number;
    trend?: 'rising' | 'stable' | 'declining';
  }>;
  scene_fit_score?: number;
  opportunity_score?: number;
}

export interface CampaignHistory {
  artist_slug: string;
  campaigns?: Array<{
    id: string;
    name: string;
    date: string;
    outcome?: 'success' | 'moderate' | 'low';
    coverage_count?: number;
  }>;
  total_campaigns?: number;
  success_rate?: number;
  avg_coverage?: number;
}

export interface CommunitySignals {
  artist_slug: string;
  fan_engagement?: number;
  social_mentions?: number;
  community_growth_rate?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// ========================================
// Momentum Types
// ========================================

export type MomentumDirection = 'strongly_up' | 'moderately_up' | 'flat' | 'down';

export interface MomentumAnalysis {
  candidate_id: string;
  direction: MomentumDirection;
  amplitude: number;
  recent_scores: ANRScoreSnapshot[];
  velocity?: number; // rate of change
  acceleration?: number; // change in velocity
}

export interface BreakoutProbability {
  candidate_id: string;
  probability: number; // 0.0-1.0
  confidence: number;  // 0.0-1.0
  factors: {
    breakout_score: number;
    momentum_score: number;
    scene_alignment_score: number;
  };
  explanation?: string;
}

// ========================================
// Query/Filter Types
// ========================================

export interface CandidateFilters {
  scenes?: string[];
  countries?: string[];
  microgenres?: string[];
  min_composite_score?: number;
  min_breakout_score?: number;
  min_momentum_score?: number;
  momentum_direction?: MomentumDirection;
  limit?: number;
  offset?: number;
}

export interface ScoreFilters {
  candidate_ids?: string[];
  start_date?: string;
  end_date?: string;
  min_composite_score?: number;
}

// ========================================
// Adapter Response Types (for Context Adapters)
// ========================================

export interface AdapterResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ========================================
// Scoring Configuration
// ========================================

export interface ScoringWeights {
  breakout: number;
  momentum: number;
  creative_uniqueness: number;
  scene_alignment: number;
  engagement_quality: number;
  campaign_efficiency: number;
}

export interface ScoringConfig {
  model_version: string;
  weights: ScoringWeights;
  risk_penalty: number; // multiplier for risk adjustment
}

// Default scoring configuration (v1.0)
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  model_version: 'v1.0',
  weights: {
    breakout: 0.30,
    momentum: 0.20,
    creative_uniqueness: 0.15,
    scene_alignment: 0.15,
    engagement_quality: 0.10,
    campaign_efficiency: 0.10,
  },
  risk_penalty: 0.30, // composite score reduced by (1 - risk_penalty * risk_score)
};

// ========================================
// Utility Types
// ========================================

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

// ========================================
// Export All Types
// ========================================

export type {
  ANRCandidate,
  ANRCandidateInput,
  ANRScoreSnapshot,
  ANRScoreInput,
  ANREvent,
  ANREventInput,
  ANRShortlist,
  ANRShortlistInput,
  ANRShortlistMember,
  ANRShortlistMemberInput,
  ANRInsight,
  ANRInsightInput,
  ANRContext,
  MomentumAnalysis,
  BreakoutProbability,
  CandidateFilters,
  ScoreFilters,
  ScoringConfig,
  ScoringWeights,
};

// ============================================================================
// TOTAL AUDIO TRACKER - TypeScript Types (PRD Schema)
// Comprehensive type definitions for intelligent campaign tracking
// ============================================================================

// Platform types for campaigns
export type PlatformType =
  | 'BBC Radio'
  | 'Commercial Radio'
  | 'Playlists'
  | 'Blogs'
  | 'Social'
  | 'PR';

// Genre types for benchmarking
export type GenreType =
  | 'Electronic'
  | 'Indie'
  | 'Jazz'
  | 'Pop'
  | 'Rock'
  | 'Hip-Hop'
  | 'R&B'
  | 'Country'
  | 'Folk'
  | 'Classical'
  | 'Other';

// Campaign status
export type CampaignStatus = 'planning' | 'active' | 'completed' | 'archived';

// Activity types for tracking
export type ActivityType =
  | 'email_open'
  | 'email_reply'
  | 'track_download'
  | 'playlist_add'
  | 'radio_play'
  | 'social_share'
  | 'stream_milestone'
  | 'contact_engaged'
  | 'pitch_sent'
  | 'response_received'
  | 'campaign_started'
  | 'campaign_completed';

// Activity importance level
export type ActivityImportance = 'low' | 'medium' | 'high';

// Insight types
export type InsightType =
  | 'pattern'
  | 'recommendation'
  | 'warning'
  | 'success'
  | 'genre_performance'
  | 'platform_effectiveness'
  | 'budget_optimization'
  | 'timing_pattern';

// ============================================================================
// CORE CAMPAIGN INTERFACE
// ============================================================================
export interface Campaign {
  // Identity
  id: string;
  user_id: string;

  // Basic Details
  name: string;
  artist_name?: string;
  platform?: PlatformType;
  genre?: GenreType;
  budget: number;
  start_date?: string | Date;
  end_date?: string | Date;
  status: CampaignStatus;

  // Targeting
  target_reach: number;
  target_type?: string; // "Radio Stations" | "Playlists" | "Blog Features"

  // Results Tracking
  actual_reach: number;
  streams?: number;
  saves?: number;
  social_engagement?: number;

  // Intelligence (Auto-calculated)
  success_rate: number;
  cost_per_result: number;
  performance_score: number;
  percentile_rank: number;

  // Metadata
  notes?: string;
  created_at: string | Date;
  updated_at: string | Date;
}

// ============================================================================
// BENCHMARK DATA
// ============================================================================
export interface Benchmark {
  id: string;
  platform: PlatformType;
  genre: GenreType;
  avg_success_rate: number;
  avg_cost_per_result: number;
  avg_response_time?: number; // in days
  best_day?: string;
  best_month?: string;
  optimal_budget_min?: number;
  optimal_budget_max?: number;
  sample_size: number;
  last_updated: string | Date;
}

// ============================================================================
// CAMPAIGN ACTIVITY
// ============================================================================
export interface CampaignActivity {
  id: string;
  campaign_id: string;
  timestamp: string | Date;
  activity_type: ActivityType;
  description: string;
  contact_name?: string;
  contact_org?: string;
  platform?: string;
  metric?: string;
  value?: number;
  importance: ActivityImportance;
  metadata?: Record<string, any>;
  created_at: string | Date;
}

// ============================================================================
// CAMPAIGN INSIGHTS
// ============================================================================
export interface CampaignInsight {
  id: string;
  user_id: string;
  insight_type: InsightType;
  message: string;
  confidence: number; // 0-100
  metadata?: Record<string, any>;
  generated_at: string | Date;
  expires_at?: string | Date;
}

// ============================================================================
// PATTERN RECOGNITION
// ============================================================================
export interface Pattern {
  type: InsightType;
  message: string;
  confidence: number;
  metadata?: {
    genre?: string;
    platform?: string;
    multiplier?: number;
    successRate?: number;
    budgetRange?: {
      min: number;
      max: number;
    };
    bestDay?: string;
    bestMonth?: string;
  };
}

// ============================================================================
// CAMPAIGN FORM DATA
// ============================================================================
export interface CampaignFormData {
  // Basic info
  name: string;
  artist_name?: string;
  platform?: PlatformType;
  genre?: GenreType;
  budget: number;

  // Targeting
  target_type?: string;
  target_reach: number;

  // Optional
  start_date?: Date | string;
  end_date?: Date | string;
  notes?: string;
}

// ============================================================================
// DASHBOARD METRICS
// ============================================================================
export interface DashboardMetrics {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  total_spend: number;
  avg_roi: number;
  success_rate: number;
  performance_vs_average: string;
  top_performing_genre?: string;
  top_performing_platform?: string;
}

// ============================================================================
// INTELLIGENCE ANALYSIS
// ============================================================================
export interface IntelligenceAnalysis {
  patterns: Pattern[];
  recommendations: string[];
  warnings: string[];
  overall_performance: number;
  best_genre?: string;
  best_platform?: string;
  optimal_budget?: {
    min: number;
    max: number;
  };
}

// ============================================================================
// CAMPAIGN PREDICTION
// ============================================================================
export interface CampaignPrediction {
  expected_success_rate: {
    min: number;
    max: number;
  };
  typical_cost_per_result: {
    min: number;
    max: number;
  };
  avg_response_time: number;
  recommendations: string[];
  confidence: number;
}

// ============================================================================
// CAMPAIGN TEMPLATES
// ============================================================================
export interface CampaignTemplate {
  name: string;
  platform: PlatformType;
  target_type: string;
  suggested_budget: number;
  suggested_reach: number;
  description: string;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================
export interface CampaignExport {
  campaign: Campaign;
  activities: CampaignActivity[];
  insights: string[];
  benchmark: Benchmark | null;
  performance_summary: {
    vs_average: string;
    percentile: string;
    cost_efficiency: string;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface CampaignsListResponse {
  campaigns: Campaign[];
  total: number;
  patterns: Pattern[];
  metrics: DashboardMetrics;
}

export interface CampaignDetailResponse {
  campaign: Campaign;
  activities: CampaignActivity[];
  insights: string[];
  benchmark: Benchmark | null;
  prediction?: CampaignPrediction;
}

// ============================================================================
// FILTER & SORT OPTIONS
// ============================================================================
export interface CampaignFilters {
  status?: CampaignStatus[];
  platform?: PlatformType[];
  genre?: GenreType[];
  date_range?: {
    start: Date;
    end: Date;
  };
  min_budget?: number;
  max_budget?: number;
  min_performance?: number;
}

export type CampaignSortField =
  | 'created_at'
  | 'start_date'
  | 'budget'
  | 'success_rate'
  | 'performance_score'
  | 'cost_per_result';

export type SortDirection = 'asc' | 'desc';

export interface CampaignSort {
  field: CampaignSortField;
  direction: SortDirection;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Create campaign payload (excludes auto-calculated fields)
export type CreateCampaignPayload = Omit<
  Campaign,
  | 'id'
  | 'user_id'
  | 'success_rate'
  | 'cost_per_result'
  | 'performance_score'
  | 'percentile_rank'
  | 'created_at'
  | 'updated_at'
>;

// Update campaign payload (partial, excludes system fields)
export type UpdateCampaignPayload = Partial<
  Omit<
    Campaign,
    | 'id'
    | 'user_id'
    | 'success_rate'
    | 'cost_per_result'
    | 'performance_score'
    | 'percentile_rank'
    | 'created_at'
    | 'updated_at'
  >
>;

// Campaign with related data
export interface CampaignWithRelations extends Campaign {
  activities?: CampaignActivity[];
  insights?: CampaignInsight[];
  benchmark?: Benchmark;
}

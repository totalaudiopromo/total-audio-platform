/**
 * CoachOS Core Types
 * Type definitions for the coaching environment
 */

// ============================================================================
// ENUMS & LITERALS
// ============================================================================

export type CoachRole = 'artist' | 'pr_agency' | 'manager';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type GoalCategory =
  | 'career'
  | 'release'
  | 'branding'
  | 'marketing'
  | 'skills'
  | 'growth'
  | 'creative';

export type GoalStatus = 'active' | 'paused' | 'completed';

export type InsightType =
  | 'career'
  | 'creative'
  | 'industry'
  | 'branding'
  | 'growth'
  | 'scene'
  | 'relationship'
  | 'release'
  | 'promotional';

export type TaskCategory =
  | 'creative_growth'
  | 'promotional_understanding'
  | 'relationship_building'
  | 'career_skill'
  | 'wellbeing';

// ============================================================================
// DATABASE MODELS
// ============================================================================

export interface CoachProfile {
  id: string;
  user_id: string;
  role: CoachRole;
  experience_level: ExperienceLevel;
  genre?: string;
  goals: any[];
  preferences: CoachPreferences;
  created_at: string;
  updated_at: string;
}

export interface CoachPreferences {
  pacing?: 'relaxed' | 'moderate' | 'intensive';
  focus_areas?: string[];
  communication_style?: 'direct' | 'supportive' | 'challenging';
  session_day?: string; // e.g., 'monday'
  time_commitment_hours?: number;
}

export interface CoachGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: number;
  target_date?: string;
  progress: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CoachSession {
  id: string;
  user_id: string;
  week_start: string;
  plan: WeeklyPlan;
  insights: CoachInsight[];
  tasks: CoachTask[];
  reflections?: SessionReflections;
  completed: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SessionReflections {
  wins?: string[];
  challenges?: string[];
  learnings?: string[];
  next_week_focus?: string;
}

export interface CoachInsightRecord {
  id: string;
  user_id: string;
  insight_type: InsightType;
  content: any;
  session_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface CoachProgressRecord {
  id: string;
  user_id: string;
  metric: string;
  value: number;
  metadata: Record<string, any>;
  goal_id?: string;
  session_id?: string;
  created_at: string;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface CoachContext {
  userId: string;
  coachProfile: CoachProfile;
  fusionContext?: FusionContext;
  cmgContext?: CMGContext;
  migContext?: MIGContext;
  successProfiles?: SuccessProfile[];
  releasePlanner?: ReleasePlannerSummary;
  recentCampaigns?: CampaignOutcome[];
  communityActivity?: CommunityActivitySummary;
}

// Fusion Layer context (simplified - adapt to actual Fusion Layer structure)
export interface FusionContext {
  artistProfile?: {
    name: string;
    genre: string[];
    scene: string[];
    bio?: string;
  };
  campaignMetrics?: {
    totalCampaigns: number;
    successRate: number;
    recentActivity: any[];
  };
  genreClassifications?: string[];
  sceneClassifications?: string[];
}

// Creative Memory Graph context (simplified - adapt to actual CMG structure)
export interface CMGContext {
  emotionalArcs?: {
    dominant_emotions: string[];
    patterns: any[];
  };
  structuralFingerprints?: {
    common_structures: string[];
    unique_elements: string[];
  };
  creativePatterns?: any[];
}

// Music Intelligence Graph context (simplified - adapt to actual MIG structure)
export interface MIGContext {
  sceneContext?: {
    primary_scene: string;
    related_scenes: string[];
    scene_health: 'emerging' | 'growing' | 'mature' | 'declining';
  };
  relatedArtists?: {
    name: string;
    similarity: number;
  }[];
  microgenreTrends?: {
    genre: string;
    trend: 'rising' | 'stable' | 'declining';
  }[];
}

export interface SuccessProfile {
  id: string;
  genre: string;
  typical_timeline: string;
  key_milestones: string[];
  common_challenges: string[];
  recommended_strategies: string[];
}

export interface ReleasePlannerSummary {
  upcoming_releases: {
    title: string;
    date: string;
    type: 'single' | 'ep' | 'album';
  }[];
  preparation_status: 'early' | 'on_track' | 'urgent';
}

export interface CampaignOutcome {
  campaign_id: string;
  outcome: 'success' | 'partial' | 'learning';
  key_learnings: string[];
}

export interface CommunityActivitySummary {
  engagement_level: 'low' | 'moderate' | 'high';
  recent_highlights: string[];
}

// ============================================================================
// WEEKLY PLAN TYPES
// ============================================================================

export interface WeeklyPlan {
  week_start: string;
  focus_theme: string;
  tasks: CoachTask[];
  metricsToTrack: string[];
  recommendations: string[];
  estimated_hours: number;
}

export interface CoachTask {
  id?: string;
  title: string;
  description: string;
  category: TaskCategory;
  effort: 'low' | 'medium' | 'high'; // Time/energy required
  priority: number;
  due?: string;
  resources?: TaskResource[];
  completed?: boolean;
  goal_id?: string; // Link to a specific goal
}

export interface TaskResource {
  title: string;
  url?: string;
  type: 'article' | 'video' | 'tool' | 'template' | 'contact';
  description?: string;
}

// ============================================================================
// INSIGHT TYPES
// ============================================================================

export interface CoachInsight {
  type: InsightType;
  summary: string;
  detail: string;
  actionable_steps?: string[];
  priority?: 'low' | 'medium' | 'high';
  related_goals?: string[]; // Goal IDs
}

// ============================================================================
// AI ENGINE TYPES
// ============================================================================

export interface AIGenerationOptions {
  context: CoachContext;
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

export interface WeeklyRecommendationsInput {
  context: CoachContext;
  existingGoals: CoachGoal[];
  lastWeekProgress?: CoachSession;
  upcomingReleases?: any[];
}

export interface CareerInsightsInput {
  context: CoachContext;
  goals: CoachGoal[];
  progressHistory: CoachProgressRecord[];
}

// ============================================================================
// GOAL ENGINE TYPES
// ============================================================================

export interface CreateGoalInput {
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  priority?: number;
  target_date?: string;
  metadata?: Record<string, any>;
}

export interface UpdateGoalInput {
  goalId: string;
  title?: string;
  description?: string;
  category?: GoalCategory;
  status?: GoalStatus;
  priority?: number;
  target_date?: string;
  progress?: number;
  metadata?: Record<string, any>;
}

export interface AutoGenerateGoalsInput {
  userId: string;
  context: CoachContext;
  existingGoals: CoachGoal[];
}

// ============================================================================
// PROGRESS ENGINE TYPES
// ============================================================================

export interface StoreMetricInput {
  userId: string;
  metric: string;
  value: number;
  metadata?: Record<string, any>;
  goalId?: string;
  sessionId?: string;
}

export interface MetricHistory {
  metric: string;
  data: {
    value: number;
    timestamp: string;
  }[];
  trend?: 'improving' | 'stable' | 'declining';
}

export interface GrowthArea {
  area: string;
  improvement: number;
  confidence: 'low' | 'medium' | 'high';
}

// ============================================================================
// PRESET TYPES
// ============================================================================

export interface CoachingPreset {
  role: CoachRole;
  experience_level: ExperienceLevel;
  weekly_task_templates: TaskTemplate[];
  learning_pathways: LearningPathway[];
  pacing_suggestions: PacingSuggestion[];
  default_focus_areas: string[];
}

export interface TaskTemplate {
  title: string;
  description: string;
  category: TaskCategory;
  effort: 'low' | 'medium' | 'high';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  resources?: TaskResource[];
}

export interface LearningPathway {
  name: string;
  description: string;
  milestones: {
    title: string;
    description: string;
    estimated_weeks: number;
  }[];
}

export interface PacingSuggestion {
  pacing: 'relaxed' | 'moderate' | 'intensive';
  weekly_hours: number;
  task_count: number;
  focus_distribution: {
    creative_growth: number;
    promotional_understanding: number;
    relationship_building: number;
    career_skill: number;
    wellbeing: number;
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class CoachOSError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CoachOSError';
  }
}

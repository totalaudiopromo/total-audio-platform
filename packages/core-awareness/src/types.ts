/**
 * Core Awareness Layer - Type Definitions
 * Meta-intelligence system that observes, reasons, predicts, and recommends
 */

// ============================================================================
// DATABASE ENTITIES
// ============================================================================

export interface AwarenessSnapshot {
  id: string;
  workspaceId?: string | null;
  userId?: string | null;
  data: SnapshotData;
  createdAt: Date;
}

export interface AwarenessEvent {
  id: string;
  workspaceId?: string | null;
  userId?: string | null;
  eventType: string;
  sourceSystem: SourceSystem;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface AwarenessSignal {
  id: string;
  workspaceId?: string | null;
  userId?: string | null;
  targetSystem: TargetSystem;
  signalType: string;
  payload: Record<string, any>;
  confidence: number;
  status: SignalStatus;
  createdAt: Date;
  actionedAt?: Date | null;
}

export interface AwarenessRecommendation {
  id: string;
  workspaceId?: string | null;
  userId?: string | null;
  targetSystem: TargetSystem;
  recommendationType: string;
  title: string;
  description?: string;
  data: Record<string, any>;
  confidence: number;
  priority: Priority;
  status: RecommendationStatus;
  createdAt: Date;
  resolvedAt?: Date | null;
}

// ============================================================================
// ENUMS
// ============================================================================

export type SourceSystem =
  | 'email_engine'
  | 'tracker'
  | 'autopilot'
  | 'mal'
  | 'cis'
  | 'fusion_layer'
  | 'cmg'
  | 'mig'
  | 'identity_kernel'
  | 'scenes_engine'
  | 'rcf'
  | 'asset_drop'
  | 'release_planner'
  | 'dashboard';

export type TargetSystem =
  | 'identity_kernel'
  | 'autopilot'
  | 'mal'
  | 'dashboard'
  | 'cis'
  | 'cmg'
  | 'scenes_engine'
  | 'mig';

export type SignalStatus = 'pending' | 'acknowledged' | 'actioned' | 'dismissed';
export type RecommendationStatus = 'pending' | 'accepted' | 'rejected' | 'implemented';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// SNAPSHOT DATA STRUCTURE
// ============================================================================

export interface SnapshotData {
  timestamp: Date;

  // System health
  systemHealth: {
    autopilot: SystemHealthMetrics;
    mal: SystemHealthMetrics;
    campaigns: SystemHealthMetrics;
    creative: SystemHealthMetrics;
  };

  // Current state
  currentState: {
    activeCampaigns: number;
    activeAutopilotMissions: number;
    activeMALFlows: number;
    recentCoverage: number;
    recentReplies: number;
    creativeFreshness: number; // 0-1 score
    sceneMomentum: number; // 0-1 score
  };

  // Correlations
  correlations: Correlation[];

  // Mismatches
  mismatches: Mismatch[];

  // Opportunities
  opportunities: Opportunity[];

  // Risks
  risks: Risk[];

  // Trajectories
  trajectories: {
    shortTerm: Trajectory; // 7 days
    mediumTerm: Trajectory; // 30-45 days
  };

  // Scores
  scores: {
    momentum: number;
    identity_cohesion: number;
    scene_alignment: number;
    creative_quality: number;
    press_effectiveness: number;
    burnout_risk: number;
    fatigue_risk: number;
  };
}

export interface SystemHealthMetrics {
  status: 'healthy' | 'degraded' | 'failing';
  activeCount: number;
  successRate: number;
  lastActivity?: Date;
}

export interface Correlation {
  id: string;
  type: CorrelationType;
  description: string;
  systems: SourceSystem[];
  strength: number; // 0-1
  insights: string[];
  data: Record<string, any>;
}

export type CorrelationType =
  | 'scene_creative_alignment'
  | 'campaign_coverage_correlation'
  | 'reply_quality_surge'
  | 'creative_identity_drift'
  | 'momentum_spike'
  | 'fatigue_pattern';

export interface Mismatch {
  id: string;
  type: MismatchType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  systems: SourceSystem[];
  suggestedActions: string[];
  data: Record<string, any>;
}

export type MismatchType =
  | 'creative_vs_scene'
  | 'identity_vs_output'
  | 'coverage_vs_effort'
  | 'brand_vs_messaging'
  | 'autopilot_vs_reality';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  description: string;
  confidence: number;
  potentialImpact: 'low' | 'medium' | 'high';
  window: {
    opensAt?: Date;
    closesAt?: Date;
    duration?: string;
  };
  suggestedActions: string[];
  data: Record<string, any>;
}

export type OpportunityType =
  | 'scene_spike'
  | 'coverage_surge'
  | 'reply_momentum'
  | 'creative_resonance'
  | 'geographic_expansion'
  | 'playlist_potential'
  | 'pr_lift_window';

export interface Risk {
  id: string;
  type: RiskType;
  description: string;
  severity: Priority;
  probability: number; // 0-1
  mitigationActions: string[];
  data: Record<string, any>;
}

export type RiskType =
  | 'campaign_stall'
  | 'creative_stagnation'
  | 'press_drought'
  | 'contact_fatigue'
  | 'identity_drift'
  | 'burnout'
  | 'follower_decay'
  | 'scene_misalignment';

export interface Trajectory {
  period: string; // '7d' | '30d' | '45d'
  direction: 'rising' | 'stable' | 'declining';
  confidence: number;
  projections: {
    momentum: TrendProjection;
    coverage: TrendProjection;
    engagement: TrendProjection;
    creative_output: TrendProjection;
  };
  projectedMetrics: Record<string, number>;
  inflectionPoints: InflectionPoint[];
}

export interface TrendProjection {
  current: number;
  projected: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export interface InflectionPoint {
  date: Date;
  expectedAt: Date;
  metric: string;
  type: 'peak' | 'trough' | 'inflection';
  description: string;
  significance: 'low' | 'medium' | 'high';
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export interface FusionContext {
  userId: string;
  workspaceId?: string | null;
  timestamp: Date;
  // Fusion Layer provides unified context across all TAP systems
  // This is READ-ONLY access
  [key: string]: any;
}

export interface CMGFingerprint {
  emotional_arc: string[];
  creative_motifs: string[];
  quality_score: number;
  consistency_score: number;
  evolution_rate: number;
}

export interface MIGCluster {
  clusterId: string;
  microgenre: string;
  scene: string;
  nodes: string[];
  edges: number;
  momentum: number;
  adjacentClusters: string[];
}

export interface IdentityKernelProfile {
  narrativeArcs: string[];
  coreThemes: string[];
  narrative: {
    themes: string[];
    archetype: string;
  };
  brandPalette: string[];
  voiceTone: string[];
  cohesionScore: number;
}

export interface AutopilotMissionState {
  missionId: string;
  phase: string;
  status: string;
  isActive: boolean;
  progress: number;
  blockers: string[];
  outcomes: Record<string, any>;
}

export interface MALFlowState {
  flowId: string;
  isActive: boolean;
  lastExecution?: Date;
  successRate: number;
  avgDuration: number;
}

export interface CampaignMetrics {
  campaignId: string;
  sent: number;
  opened: number;
  replied: number;
  coverage: number;
  openRate: number;
  replyRate: number;
  coverageRate: number;
}

export interface CISCreativeAsset {
  assetId: string;
  type: string;
  brandAlignment: number;
  sceneRelevance: number;
  qualityScore: number;
  createdAt: Date;
}

// ============================================================================
// OBSERVER TYPES
// ============================================================================

export interface WatcherResult {
  watcherType: string;
  findings: Finding[];
  eventsGenerated: AwarenessEvent[];
}

export interface Finding {
  type: string;
  description: string;
  severity: Priority;
  data: Record<string, any>;
}

export interface WatcherConfig {
  enabled: boolean;
  intervalMinutes: number;
  thresholds: Record<string, number>;
}

// ============================================================================
// REASONER TYPES
// ============================================================================

export interface ReasoningResult {
  correlations: Correlation[];
  mismatches: Mismatch[];
  opportunities: Opportunity[];
  risks: Risk[];
  insights: string[];
  confidence: number;
}

export interface ReasoningInput {
  fusionContext: FusionContext;
  cmgFingerprints: CMGFingerprint[];
  migClusters: MIGCluster[];
  identityProfile: IdentityKernelProfile;
  autopilotStates: AutopilotMissionState[];
  malStates: MALFlowState[];
  campaignMetrics: CampaignMetrics[];
  creativeAssets: CISCreativeAsset[];
  recentEvents: AwarenessEvent[];
}

// ============================================================================
// PREDICTOR TYPES
// ============================================================================

export interface PredictionResult {
  shortTermTrajectory: Trajectory;
  mediumTermTrajectory: Trajectory;
  scores: {
    momentum: number;
    burnoutRisk: number;
    fatigueRisk: number;
    liftPotential: number;
    freshness: number;
  };
  confidence: number;
}

// ============================================================================
// RECOMMENDER TYPES
// ============================================================================

export interface RecommendationInput {
  reasoning: ReasoningResult;
  predictions: PredictionResult;
  integrationData: IntegrationData;
}

export interface RecommendationOutput {
  recommendations: AwarenessRecommendation[];
  signals: AwarenessSignal[];
}

// ============================================================================
// METRICS TYPES
// ============================================================================

export interface ScoreCalculation {
  score: number;
  factors: Record<string, number>;
  confidence: number;
  explanation: string;
}

// ============================================================================
// ALERT TYPES
// ============================================================================

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: Priority;
  targetSystem?: TargetSystem;
  actionable: boolean;
  suggestedActions: string[];
  data: Record<string, any>;
  createdAt: Date;
}

export type AlertType = 'risk' | 'opportunity' | 'mismatch' | 'anomaly';

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface Logger {
  info(message: string, meta?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

export interface CacheEntry<T> {
  data: T;
  cachedAt: Date;
  expiresAt: Date;
}

export type TimeWindow = '1h' | '6h' | '24h' | '7d' | '30d' | '90d';

// ============================================================================
// TYPE ALIASES FOR CONVENIENCE
// ============================================================================

export type IdentityProfile = IdentityKernelProfile;
export type CampaignMetric = CampaignMetrics;
export type PredictionInput = {
  campaignMetrics: CampaignMetrics[];
  migClusters: MIGCluster[];
  cmgFingerprints: CMGFingerprint[];
  autopilotStates: AutopilotMissionState[];
  malStates: MALFlowState[];
};
export type PredictiveScores = {
  momentum: number;
  burnoutRisk: number;
  fatigueRisk: number;
  liftPotential: number;
  freshness: number;
};
export type IntegrationData = {
  fusionContext: FusionContext;
  cmgFingerprints: CMGFingerprint[];
  migClusters: MIGCluster[];
  identityProfile: IdentityKernelProfile;
  autopilotStates: AutopilotMissionState[];
  malStates: MALFlowState[];
  campaignMetrics: CampaignMetrics[];
  creativeAssets: CISCreativeAsset[];
};

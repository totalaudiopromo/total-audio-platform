/**
 * MeshOS Type Definitions
 * Core types for the universal multi-agent coordination layer
 */

// ============================================================================
// MESH MESSAGE TYPES
// ============================================================================

export type MessageSource =
  | 'autopilot'
  | 'mal'
  | 'coachOS'
  | 'talentRadar'
  | 'scenesEngine'
  | 'mig'
  | 'cmg'
  | 'fusionLayer'
  | 'identityKernel'
  | 'rcf'
  | 'coverageMap'
  | 'studio'
  | 'dashboard'
  | 'operatorOS'
  | 'meshOS';

export type MessageTarget =
  | 'meshOS'
  | 'planning'
  | 'negotiation'
  | 'insight'
  | 'policy'
  | 'drift'
  | 'context';

export type MessageType =
  | 'request'
  | 'response'
  | 'notification'
  | 'negotiation'
  | 'insight'
  | 'drift'
  | 'query';

export type MessageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface MeshMessage {
  id: string;
  workspace_id: string;
  source: MessageSource;
  target: MessageTarget;
  type: MessageType;
  payload: Record<string, any>;
  status: MessageStatus;
  result?: Record<string, any>;
  created_at: string;
  processed_at?: string;
}

// ============================================================================
// NEGOTIATION TYPES
// ============================================================================

export type NegotiationStrategy =
  | 'consensus'
  | 'weighted'
  | 'risk-adjusted'
  | 'opportunity';

export type NegotiationStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed';

export interface Negotiation {
  id: string;
  workspace_id: string;
  participants: string[];
  context: {
    goal: string;
    constraints?: Record<string, any>;
    data?: Record<string, any>;
    deadline?: string;
  };
  strategy: NegotiationStrategy;
  result?: {
    decision: string;
    rationale: string;
    participants_agreement: Record<string, number>; // participant -> agreement score (0-1)
    actions?: Array<{
      system: string;
      action: string;
      priority: number;
    }>;
  };
  confidence?: number;
  status: NegotiationStatus;
  created_at: string;
  completed_at?: string;
}

// ============================================================================
// PLANNING TYPES
// ============================================================================

export type PlanTimeframe = '7d' | '30d' | '90d';

export type PlanStatus = 'active' | 'superseded' | 'archived';

export interface MeshPlan {
  id: string;
  workspace_id: string;
  timeframe: PlanTimeframe;
  plan: {
    objectives: Array<{
      id: string;
      description: string;
      priority: number;
      owner: string; // system responsible
      deadline?: string;
      dependencies?: string[]; // IDs of other objectives
    }>;
    actions: Array<{
      id: string;
      objective_id: string;
      description: string;
      system: string;
      scheduled_for?: string;
      estimated_effort?: number;
      status?: 'pending' | 'in_progress' | 'completed';
    }>;
    milestones: Array<{
      date: string;
      description: string;
      objectives: string[]; // objective IDs
    }>;
    risks: Array<{
      description: string;
      probability: number; // 0-1
      impact: number; // 0-1
      mitigation?: string;
    }>;
    opportunities: Array<{
      description: string;
      value: number; // 0-1
      effort: number; // 0-1
      window?: string; // time window
    }>;
  };
  confidence?: number;
  generated_at: string;
  valid_until?: string;
  status: PlanStatus;
}

// ============================================================================
// DRIFT DETECTION TYPES
// ============================================================================

export type DriftType =
  | 'creative_vs_campaign'
  | 'scene_vs_pitch'
  | 'segment_vs_autopilot'
  | 'rcf_vs_goals'
  | 'coverage_vs_strategy'
  | 'identity_vs_actions'
  | 'timing_drift'
  | 'priority_conflict';

export type DriftStatus =
  | 'detected'
  | 'acknowledged'
  | 'correcting'
  | 'resolved'
  | 'ignored';

export interface DriftReport {
  id: string;
  workspace_id: string;
  drift_type: DriftType;
  systems_involved: string[];
  drift_score: number; // 0-1, higher = more drift
  analysis: {
    description: string;
    specifics: Record<string, any>;
    evidence: Array<{
      system: string;
      state: Record<string, any>;
      timestamp: string;
    }>;
  };
  recommended_corrections?: Array<{
    system: string;
    action: string;
    priority: number;
    rationale: string;
  }>;
  status: DriftStatus;
  detected_at: string;
  resolved_at?: string;
}

// ============================================================================
// INSIGHT ROUTING TYPES
// ============================================================================

export type InsightType =
  | 'opportunity'
  | 'threat'
  | 'drift'
  | 'momentum'
  | 'coverage'
  | 'talent'
  | 'scene'
  | 'performance'
  | 'risk';

export type InsightDestination =
  | 'dashboard'
  | 'autopilot'
  | 'coachOS'
  | 'talentRadar'
  | 'scenesEngine'
  | 'operatorOS'
  | 'studio'
  | 'anr'
  | 'community';

export interface InsightRoute {
  id: string;
  workspace_id: string;
  insight_type: InsightType;
  destination: InsightDestination;
  rule: {
    conditions?: Record<string, any>;
    filters?: Record<string, any>;
    transformations?: string[];
  };
  priority: number; // 1-10
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  data: Record<string, any>;
  confidence: number; // 0-1
  urgency: number; // 0-1
  source: string;
  timestamp: string;
}

// ============================================================================
// POLICY TYPES
// ============================================================================

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  type: 'constraint' | 'threshold' | 'schedule' | 'budget' | 'ethical';
  rule: Record<string, any>;
  enabled: boolean;
}

export interface GlobalPolicy {
  workspace_id: string;
  quiet_hours?: {
    start: string; // HH:MM
    end: string; // HH:MM
    timezone: string;
  };
  contact_fatigue?: {
    max_contacts_per_day: number;
    max_contacts_per_week: number;
    min_days_between_contacts: number;
  };
  risk_ceilings?: {
    max_risk_score: number; // 0-1
    require_approval_above: number; // 0-1
  };
  autonomy_caps?: {
    max_autonomous_actions_per_day: number;
    require_human_approval: string[]; // action types
  };
  token_budgets?: {
    daily_limit: number;
    monthly_limit: number;
    alert_at_percentage: number;
  };
  rate_limiting?: {
    max_actions_per_hour: number;
    max_messages_per_hour: number;
  };
  ethical_constraints?: {
    no_spam: boolean;
    respect_privacy: boolean;
    transparent_ai_use: boolean;
    custom_rules?: string[];
  };
}

// ============================================================================
// GLOBAL CONTEXT TYPES
// ============================================================================

export interface SystemState {
  system: string;
  health: 'healthy' | 'degraded' | 'error' | 'unknown';
  load: number; // 0-1
  last_activity?: string;
  metrics?: Record<string, number>;
  alerts?: string[];
}

export interface GlobalContext {
  workspace_id: string;
  timestamp: string;
  systems: SystemState[];
  active_negotiations: number;
  active_plans: Record<PlanTimeframe, boolean>;
  drift_reports: {
    total: number;
    active: number;
    avg_score: number;
  };
  opportunities: Array<{
    type: string;
    value: number;
    window?: string;
  }>;
  threats: Array<{
    type: string;
    severity: number;
    mitigation?: string;
  }>;
  contradictions: Array<{
    systems: string[];
    description: string;
    severity: number;
  }>;
}

// ============================================================================
// ADAPTER TYPES
// ============================================================================

export interface AdapterConfig {
  workspace_id: string;
  read_only: true; // ALWAYS true - MeshOS only reads from other systems
}

export interface AdapterReadResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// ============================================================================
// ORCHESTRATOR TYPES
// ============================================================================

export interface OrchestratorOptions {
  workspace_id: string;
  enable_auto_planning?: boolean;
  enable_auto_drift_detection?: boolean;
  enable_auto_negotiation?: boolean;
  policy?: Partial<GlobalPolicy>;
}

export interface OrchestratorStatus {
  running: boolean;
  last_cycle: string;
  cycles_completed: number;
  errors: number;
  context: GlobalContext;
}

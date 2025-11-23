/**
 * PR Autopilot Core Types
 *
 * Type definitions for the Multi-Agent PR Autopilot system.
 * These types match the database schema and provide runtime type safety.
 */

import { z } from 'zod';

// ============================================
// Agent Roles
// ============================================

export const AgentRoleSchema = z.enum([
  'strategist',
  'pitch',
  'contact',
  'scheduler',
  'followup',
  'analyst',
  'archivist',
  'simulator',
  'coordinator',
]);

export type AgentRole = z.infer<typeof AgentRoleSchema>;

// ============================================
// Mission and Task Status
// ============================================

export const MissionModeSchema = z.enum(['suggest', 'semi_auto', 'full_auto']);
export type MissionMode = z.infer<typeof MissionModeSchema>;

export const MissionStatusSchema = z.enum([
  'draft',
  'active',
  'paused',
  'completed',
  'failed',
]);
export type MissionStatus = z.infer<typeof MissionStatusSchema>;

export const TaskStatusSchema = z.enum([
  'pending',
  'in_progress',
  'blocked',
  'waiting_approval',
  'completed',
  'failed',
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const RunStatusSchema = z.enum([
  'running',
  'succeeded',
  'failed',
  'partial',
]);
export type RunStatus = z.infer<typeof RunStatusSchema>;

export const TriggerTypeSchema = z.enum(['manual', 'schedule', 'event']);
export type TriggerType = z.infer<typeof TriggerTypeSchema>;

export const LogLevelSchema = z.enum(['info', 'warn', 'error', 'debug']);
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const PolicyScopeSchema = z.enum(['user', 'workspace', 'global']);
export type PolicyScope = z.infer<typeof PolicyScopeSchema>;

// ============================================
// Database Models
// ============================================

export interface AutopilotMission {
  id: string;
  user_id: string;
  workspace_id: string | null;
  title: string;
  description: string | null;
  campaign_id: string | null;
  mode: MissionMode;
  status: MissionStatus;
  config: MissionConfig;
  created_at: string;
  updated_at: string;
}

export interface AutopilotTask {
  id: string;
  mission_id: string;
  parent_task_id: string | null;
  agent_role: AgentRole;
  type: string;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  status: TaskStatus;
  priority: number;
  blocking_reason: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface AutopilotRun {
  id: string;
  mission_id: string;
  triggered_by: string | null;
  trigger_type: TriggerType;
  started_at: string;
  finished_at: string | null;
  status: RunStatus;
  summary: RunSummary | null;
}

export interface AutopilotLog {
  id: string;
  mission_id: string;
  task_id: string | null;
  agent_role: AgentRole | null;
  level: LogLevel;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AutopilotPolicy {
  id: string;
  user_id: string | null;
  workspace_id: string | null;
  scope: PolicyScope;
  config: PolicyConfig;
  created_at: string;
}

export interface AutopilotSetting {
  id: string;
  user_id: string | null;
  workspace_id: string | null;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ============================================
// Configuration Types
// ============================================

export interface MissionConfig {
  // Strategy
  strategy?: {
    goals?: string[];
    timeline?: {
      start_date?: string;
      end_date?: string;
      phases?: Array<{
        name: string;
        start: string;
        end: string;
      }>;
    };
    target_metrics?: {
      reach?: number;
      coverage?: number;
      engagement?: number;
    };
  };

  // Contact targeting
  targeting?: {
    genres?: string[];
    territories?: string[];
    contact_types?: Array<'radio' | 'blog' | 'playlist' | 'press' | 'influencer'>;
    tier_priority?: Array<'tier_1' | 'tier_2' | 'tier_3'>;
    max_contacts?: number;
  };

  // Budget and limits
  budget?: {
    max_sends_per_day?: number;
    max_total_sends?: number;
    contact_fatigue_days?: number;
  };

  // Preferences
  preferences?: {
    pitch_style?: 'formal' | 'casual' | 'personal';
    follow_up_strategy?: 'conservative' | 'balanced' | 'aggressive';
    quiet_hours?: {
      start: string;
      end: string;
      timezone?: string;
    };
  };

  // Asset references
  assets?: {
    artist_id?: string;
    release_id?: string;
    press_kit_url?: string;
    spotify_url?: string;
    youtube_url?: string;
  };
}

export interface PolicyConfig {
  allowed_modes: MissionMode[];
  max_emails_per_day: number;
  max_contacts_per_mission: number;
  approval_required: ActionType[];
  quiet_hours?: {
    start: string;
    end: string;
  };
  contact_fatigue_days: number;
}

export type ActionType =
  | 'send_email'
  | 'create_campaign'
  | 'modify_segment'
  | 'generate_pitch'
  | 'select_contacts'
  | 'schedule_send'
  | 'send_followup';

export interface RunSummary {
  tasks_executed: number;
  tasks_succeeded: number;
  tasks_failed: number;
  tasks_blocked: number;
  agents_invoked: AgentRole[];
  actions_taken: ActionType[];
  approvals_required: number;
  errors?: string[];
  performance?: {
    duration_ms: number;
    agent_timings: Record<AgentRole, number>;
  };
}

// ============================================
// Agent Context
// ============================================

export interface AgentContext {
  // Identity
  userId: string;
  workspaceId?: string;

  // Mission
  mission: AutopilotMission;

  // Fusion Layer integration
  fusionContext: FusionContext;

  // Client wrappers for existing systems
  clients: {
    cmg: CMGClient;
    emailEngine: EmailEngineClient;
    listBuilder: ListBuilderClient;
    tracker: TrackerClient;
    intel: IntelClient;
    pitch: PitchClient;
    narrative: NarrativeClient;
    successProfiles: SuccessProfilesClient;
  };

  // Utilities
  logger: AutopilotLogger;
  policyEngine: PolicyEngine;
}

// ============================================
// Fusion Layer Context (placeholder)
// ============================================

export interface FusionContext {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  workspace?: {
    id: string;
    name: string;
    type: 'personal' | 'team' | 'agency';
  };
  preferences?: Record<string, unknown>;
  features?: string[];
  // Additional fusion layer context from @total-audio/fusion-layer
  [key: string]: unknown;
}

// ============================================
// Client Interfaces (thin wrappers)
// ============================================

export interface CMGClient {
  getMemories(filter: Record<string, unknown>): Promise<unknown[]>;
  createMemory(data: Record<string, unknown>): Promise<unknown>;
  updateMemory(id: string, data: Record<string, unknown>): Promise<unknown>;
  query(query: string): Promise<unknown>;
}

export interface EmailEngineClient {
  createCampaign(data: CreateCampaignInput): Promise<Campaign>;
  getCampaign(id: string): Promise<Campaign>;
  scheduleEmail(data: ScheduleEmailInput): Promise<ScheduledEmail>;
  getTemplates(): Promise<EmailTemplate[]>;
  renderTemplate(templateId: string, data: Record<string, unknown>): Promise<string>;
}

export interface ListBuilderClient {
  createSegment(data: CreateSegmentInput): Promise<Segment>;
  getSegment(id: string): Promise<Segment>;
  updateSegment(id: string, data: Partial<CreateSegmentInput>): Promise<Segment>;
  evaluateSegment(id: string): Promise<Contact[]>;
}

export interface TrackerClient {
  getCampaignMetrics(campaignId: string): Promise<CampaignMetrics>;
  getContactActivity(contactId: string): Promise<ContactActivity[]>;
  logActivity(data: LogActivityInput): Promise<Activity>;
}

export interface IntelClient {
  enrichContact(email: string): Promise<EnrichedContact>;
  searchContacts(query: ContactSearchQuery): Promise<Contact[]>;
  getContactIntelligence(contactId: string): Promise<ContactIntelligence>;
}

export interface PitchClient {
  generatePitch(data: GeneratePitchInput): Promise<GeneratedPitch>;
  generateVariations(pitchId: string, count: number): Promise<GeneratedPitch[]>;
  scorePitch(pitch: string, audience: string): Promise<PitchScore>;
}

export interface NarrativeClient {
  synthesizeNarrative(data: SynthesizeInput): Promise<Narrative>;
  extractInsights(campaignId: string): Promise<Insight[]>;
}

export interface SuccessProfilesClient {
  findSimilarCampaigns(query: CampaignQuery): Promise<SuccessProfile[]>;
  getBestPractices(genre: string, type: string): Promise<BestPractice[]>;
  recordOutcome(data: OutcomeData): Promise<void>;
}

// ============================================
// Client Input/Output Types
// ============================================

export interface CreateCampaignInput {
  name: string;
  type: string;
  segments?: string[];
  template_id?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
}

export interface ScheduleEmailInput {
  campaign_id: string;
  contact_id: string;
  template_id: string;
  send_at: string;
  variables: Record<string, unknown>;
}

export interface ScheduledEmail {
  id: string;
  campaign_id: string;
  contact_id: string;
  send_at: string;
  status: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface CreateSegmentInput {
  name: string;
  criteria: SegmentCriteria;
  workspace_id?: string;
}

export interface SegmentCriteria {
  genres?: string[];
  territories?: string[];
  contact_types?: string[];
  tiers?: string[];
  custom_filters?: Record<string, unknown>;
}

export interface Segment {
  id: string;
  name: string;
  criteria: SegmentCriteria;
  contact_count?: number;
}

export interface Contact {
  id: string;
  email: string;
  name?: string;
  outlet?: string;
  type?: string;
  territory?: string;
}

export interface CampaignMetrics {
  sends: number;
  opens: number;
  clicks: number;
  replies: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
}

export interface ContactActivity {
  id: string;
  contact_id: string;
  type: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface LogActivityInput {
  campaign_id: string;
  contact_id: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export interface Activity {
  id: string;
  campaign_id: string;
  contact_id: string;
  type: string;
  created_at: string;
}

export interface EnrichedContact extends Contact {
  role?: string;
  genres?: string[];
  outlets?: string[];
  social_links?: Record<string, string>;
  last_updated?: string;
}

export interface ContactSearchQuery {
  query?: string;
  genres?: string[];
  territories?: string[];
  types?: string[];
  limit?: number;
}

export interface ContactIntelligence {
  contact_id: string;
  responsiveness_score?: number;
  best_contact_time?: string;
  preferred_pitch_style?: string;
  historical_engagement?: {
    total_campaigns: number;
    response_rate: number;
    avg_time_to_respond: number;
  };
}

export interface GeneratePitchInput {
  artist_name: string;
  release_title?: string;
  genre?: string;
  target_outlet?: string;
  style?: 'formal' | 'casual' | 'personal';
  context?: Record<string, unknown>;
}

export interface GeneratedPitch {
  id: string;
  subject: string;
  body: string;
  style: string;
  metadata?: Record<string, unknown>;
}

export interface PitchScore {
  overall: number;
  relevance: number;
  personalization: number;
  clarity: number;
  suggestions?: string[];
}

export interface SynthesizeInput {
  campaign_id?: string;
  data: Record<string, unknown>;
  narrative_type: 'performance' | 'strategy' | 'outcome';
}

export interface Narrative {
  id: string;
  type: string;
  summary: string;
  key_points: string[];
  recommendations?: string[];
}

export interface Insight {
  type: string;
  description: string;
  confidence: number;
  supporting_data?: Record<string, unknown>;
}

export interface CampaignQuery {
  genre?: string;
  territory?: string;
  campaign_type?: string;
  min_success_score?: number;
}

export interface SuccessProfile {
  id: string;
  campaign_type: string;
  genre: string;
  success_score: number;
  patterns: Record<string, unknown>;
}

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  confidence: number;
  source: string;
}

export interface OutcomeData {
  campaign_id: string;
  metrics: Record<string, number>;
  patterns: Record<string, unknown>;
}

// ============================================
// Agent Output Types
// ============================================

export interface StrategyOutput {
  phases: CampaignPhase[];
  channel_mix: ChannelStrategy[];
  contact_targeting: ContactTargeting;
  timeline: TimelineStrategy;
  downstream_tasks: TaskDefinition[];
}

export interface CampaignPhase {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  goals: string[];
  tactics: string[];
}

export interface ChannelStrategy {
  channel: string;
  priority: 'high' | 'medium' | 'low';
  allocation: number; // percentage
  rationale: string;
}

export interface ContactTargeting {
  primary_pool: {
    criteria: SegmentCriteria;
    estimated_size: number;
  };
  secondary_pool?: {
    criteria: SegmentCriteria;
    estimated_size: number;
  };
  experimental_pool?: {
    criteria: SegmentCriteria;
    estimated_size: number;
  };
}

export interface TimelineStrategy {
  start_date: string;
  end_date: string;
  milestones: Array<{
    date: string;
    event: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

export interface TaskDefinition {
  agent_role: AgentRole;
  type: string;
  priority: number;
  input: Record<string, unknown>;
  depends_on?: string[]; // task IDs
}

export interface PitchOutput {
  variations: GeneratedPitch[];
  recommended_variant: string; // pitch ID
  ab_test_plan?: {
    variant_a: string;
    variant_b: string;
    split_percentage: number;
  };
  metadata: {
    style: string;
    tone: string;
    word_count: number;
  };
}

export interface ContactSelectionOutput {
  primary_contacts: Contact[];
  secondary_contacts: Contact[];
  experimental_contacts: Contact[];
  segment_ids: string[];
  rationale: Record<string, string>;
  estimated_reach: number;
}

export interface ScheduleOutput {
  scheduled_sends: SchedulePlan[];
  policy_constraints: {
    max_daily_sends: number;
    quiet_hours: { start: string; end: string };
    contact_fatigue_check: boolean;
  };
  timeline: {
    first_send: string;
    last_send: string;
    total_days: number;
  };
}

export interface SchedulePlan {
  contact_id: string;
  send_at: string;
  pitch_variant: string;
  priority: number;
  rationale: string;
}

export interface FollowupPlanOutput {
  followup_tasks: FollowupTask[];
  strategy: 'conservative' | 'balanced' | 'aggressive';
  estimated_additional_reach: number;
}

export interface FollowupTask {
  contact_id: string;
  original_send_id: string;
  followup_type: 'gentle_reminder' | 'value_add' | 'final_touch';
  suggested_date: string;
  template_id?: string;
  custom_message?: string;
}

export interface AnalysisOutput {
  performance_summary: {
    overall_score: number;
    metrics: CampaignMetrics;
    vs_benchmark: Record<string, number>;
  };
  insights: Insight[];
  recommendations: string[];
  next_iteration_suggestions: {
    what_worked: string[];
    what_didnt: string[];
    try_next_time: string[];
  };
}

export interface ArchivistOutput {
  memories_created: number;
  fingerprints_updated: string[];
  success_profile_impact: {
    profile_id: string;
    contribution: Record<string, unknown>;
  }[];
  long_term_learnings: string[];
}

export interface SimulationOutput {
  scenarios: SimulationScenario[];
  recommended_scenario: string;
  risk_assessment: {
    overall_risk: 'low' | 'medium' | 'high';
    risk_factors: string[];
  };
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  estimated_outcomes: {
    reach: number;
    engagement: number;
    resource_usage: number;
  };
  confidence: number;
}

// ============================================
// Utility Types
// ============================================

export interface AutopilotLogger {
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
  debug(message: string, metadata?: Record<string, unknown>): void;
}

export interface PolicyEngine {
  canSendEmails(count: number, timeWindow?: string): Promise<boolean>;
  requiresApprovalFor(actionType: ActionType): Promise<boolean>;
  maxContactsForMission(mission: AutopilotMission): Promise<number>;
  allowedModesForUser(userId: string): Promise<MissionMode[]>;
  enforceQuietHours(sendTime: string): Promise<boolean>;
  checkContactFatigue(contactId: string, missionId: string): Promise<boolean>;
}

// ============================================
// Validation Schemas
// ============================================

export const MissionConfigSchema = z.object({
  strategy: z
    .object({
      goals: z.array(z.string()).optional(),
      timeline: z
        .object({
          start_date: z.string().optional(),
          end_date: z.string().optional(),
          phases: z
            .array(
              z.object({
                name: z.string(),
                start: z.string(),
                end: z.string(),
              })
            )
            .optional(),
        })
        .optional(),
      target_metrics: z
        .object({
          reach: z.number().optional(),
          coverage: z.number().optional(),
          engagement: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  targeting: z
    .object({
      genres: z.array(z.string()).optional(),
      territories: z.array(z.string()).optional(),
      contact_types: z
        .array(
          z.enum(['radio', 'blog', 'playlist', 'press', 'influencer'])
        )
        .optional(),
      tier_priority: z
        .array(z.enum(['tier_1', 'tier_2', 'tier_3']))
        .optional(),
      max_contacts: z.number().optional(),
    })
    .optional(),
  budget: z
    .object({
      max_sends_per_day: z.number().optional(),
      max_total_sends: z.number().optional(),
      contact_fatigue_days: z.number().optional(),
    })
    .optional(),
  preferences: z
    .object({
      pitch_style: z.enum(['formal', 'casual', 'personal']).optional(),
      follow_up_strategy: z
        .enum(['conservative', 'balanced', 'aggressive'])
        .optional(),
      quiet_hours: z
        .object({
          start: z.string(),
          end: z.string(),
          timezone: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  assets: z
    .object({
      artist_id: z.string().optional(),
      release_id: z.string().optional(),
      press_kit_url: z.string().optional(),
      spotify_url: z.string().optional(),
      youtube_url: z.string().optional(),
    })
    .optional(),
});

export const PolicyConfigSchema = z.object({
  allowed_modes: z.array(MissionModeSchema),
  max_emails_per_day: z.number(),
  max_contacts_per_mission: z.number(),
  approval_required: z.array(z.string()),
  quiet_hours: z
    .object({
      start: z.string(),
      end: z.string(),
    })
    .optional(),
  contact_fatigue_days: z.number(),
});

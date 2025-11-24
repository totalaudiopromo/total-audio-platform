/**
 * Marketing Automation Layer (MAL) - Type Definitions
 *
 * Core types for the workflow engine, nodes, triggers, conditions, and actions.
 */

// ============================================================================
// NODE TYPES
// ============================================================================

export type NodeType = 'trigger' | 'condition' | 'action';

// ============================================================================
// TRIGGER SUBTYPES
// ============================================================================

export type TriggerSubtype =
  | 'email_open'
  | 'email_click'
  | 'email_reply'
  | 'campaign_created'
  | 'campaign_status_changed'
  | 'asset_uploaded'
  | 'release_approaching'
  | 'manual_trigger'
  | 'segment_updated'
  | 'contact_added';

// ============================================================================
// CONDITION SUBTYPES
// ============================================================================

export type ConditionSubtype =
  | 'if_field_match'
  | 'if_segment_contains'
  | 'if_metric_greater'
  | 'if_tag_present'
  | 'if_time_elapsed'
  | 'if_campaign_status';

// ============================================================================
// ACTION SUBTYPES
// ============================================================================

export type ActionSubtype =
  | 'send_email_campaign'
  | 'schedule_followup'
  | 'update_segment'
  | 'create_release_task'
  | 'notify_user'
  | 'log_event'
  | 'update_cmg_node'
  | 'tag_contact'
  | 'delay';

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface AutomationFlow {
  id: string;
  userId: string;
  workspaceId?: string | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  triggerType: 'event' | 'schedule' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationNode {
  id: string;
  flowId: string;
  type: NodeType;
  subtype: string;
  config: Record<string, any>;
  position?: { x: number; y: number } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationEdge {
  id: string;
  flowId: string;
  sourceNodeId: string;
  targetNodeId: string;
  conditionLabel?: string | null;
  createdAt: Date;
}

export interface AutomationExecution {
  id: string;
  flowId: string;
  triggerContext: TriggerContext;
  status: ExecutionStatus;
  startedAt: Date;
  finishedAt?: Date | null;
  error?: string | null;
}

export interface AutomationExecutionStep {
  id: string;
  executionId: string;
  nodeId: string;
  status: StepStatus;
  input?: Record<string, any> | null;
  output?: Record<string, any> | null;
  error?: string | null;
  startedAt?: Date | null;
  finishedAt?: Date | null;
}

// ============================================================================
// ENUMS
// ============================================================================

export type ExecutionStatus = 'running' | 'succeeded' | 'failed' | 'partial';
export type StepStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'skipped';

// ============================================================================
// TRIGGER CONTEXT
// ============================================================================

export interface TriggerContext {
  type: string;
  source: string;
  payload: any;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

// Specific trigger context types
export interface EmailOpenTrigger extends TriggerContext {
  type: 'email_open';
  source: 'email_engine';
  payload: {
    emailId: string;
    campaignId: string;
    contactId: string;
    openedAt: Date;
  };
}

export interface EmailReplyTrigger extends TriggerContext {
  type: 'email_reply';
  source: 'email_engine';
  payload: {
    emailId: string;
    campaignId: string;
    contactId: string;
    replyText: string;
    repliedAt: Date;
  };
}

export interface CampaignStatusChangedTrigger extends TriggerContext {
  type: 'campaign_status_changed';
  source: 'tracker';
  payload: {
    campaignId: string;
    oldStatus: string;
    newStatus: string;
    changedAt: Date;
  };
}

export interface AssetUploadedTrigger extends TriggerContext {
  type: 'asset_uploaded';
  source: 'asset_drop';
  payload: {
    assetId: string;
    userId: string;
    assetType: string;
    uploadedAt: Date;
  };
}

// ============================================================================
// EXECUTION CONTEXT
// ============================================================================

export interface ExecutionContext {
  userId: string;
  workspaceId?: string | null;
  fusionContext: any; // From Fusion Layer
  clients: ExecutionClients;
  logger: Logger;
  limits: ExecutionLimits;
}

export interface ExecutionClients {
  emailEngine: EmailEngineClient;
  listBuilder: ListBuilderClient;
  tracker: TrackerClient;
  releasePlanner: ReleasePlannerClient;
  cmg: CMGClient;
}

export interface ExecutionLimits {
  maxActionsPerExecution: number;
  maxExternalWrites: number;
  maxContactActions: number;
}

// ============================================================================
// CLIENT INTERFACES (Thin wrappers for existing systems)
// ============================================================================

export interface EmailEngineClient {
  createCampaign(params: CreateCampaignParams): Promise<{ campaignId: string }>;
  scheduleCampaign(campaignId: string, scheduleAt: Date): Promise<void>;
  sendCampaign(campaignId: string): Promise<void>;
}

export interface CreateCampaignParams {
  name: string;
  subject: string;
  body: string;
  fromEmail: string;
  toSegmentId?: string;
  toContactIds?: string[];
}

export interface ListBuilderClient {
  addContactToSegment(contactId: string, segmentId: string): Promise<void>;
  removeContactFromSegment(contactId: string, segmentId: string): Promise<void>;
  getSegmentContacts(segmentId: string): Promise<string[]>;
  tagContact(contactId: string, tag: string): Promise<void>;
}

export interface TrackerClient {
  getCampaignMetrics(campaignId: string): Promise<CampaignMetrics>;
  updateCampaignStatus(campaignId: string, status: string): Promise<void>;
}

export interface CampaignMetrics {
  openRate: number;
  clickRate: number;
  replyRate: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalReplied: number;
}

export interface ReleasePlannerClient {
  createTask(params: CreateTaskParams): Promise<{ taskId: string }>;
}

export interface CreateTaskParams {
  releaseId: string;
  title: string;
  description?: string;
  dueDate?: Date;
}

export interface CMGClient {
  logSuccessPattern(params: CMGLogParams): Promise<void>;
  logAttempt(params: CMGLogParams): Promise<void>;
}

export interface CMGLogParams {
  campaignId?: string;
  contactId?: string;
  outcome: string;
  metadata?: Record<string, any>;
}

export interface Logger {
  info(message: string, meta?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

// ============================================================================
// NODE EXECUTION RESULTS
// ============================================================================

export interface NodeExecutionResult {
  status: StepStatus;
  output?: any;
  error?: string;
  nextNodes?: string[]; // Node IDs to execute next
}

export interface ConditionResult {
  outcome: 'true' | 'false' | 'skip';
  output?: any;
}

export interface ActionResult {
  success: boolean;
  output?: any;
  error?: string;
}

// ============================================================================
// WORKFLOW GRAPH
// ============================================================================

export interface WorkflowGraph {
  nodes: Map<string, AutomationNode>;
  edges: AutomationEdge[];
  triggerNode?: AutomationNode;
}

export interface GraphValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// SAFETY & LIMITS
// ============================================================================

export interface SafetyMetrics {
  actionsExecuted: number;
  externalWrites: number;
  contactActionsPerformed: number;
}

export const DEFAULT_LIMITS: ExecutionLimits = {
  maxActionsPerExecution: 100,
  maxExternalWrites: 50,
  maxContactActions: 200,
};

// ============================================================================
// NODE CONFIG TYPES (Examples)
// ============================================================================

export interface EmailOpenTriggerConfig {
  campaignId?: string; // Optional: filter to specific campaign
  allCampaigns?: boolean;
}

export interface IfFieldMatchConfig {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_equals';
  value: any;
}

export interface SendEmailCampaignConfig {
  templateId?: string;
  subject: string;
  body: string;
  fromEmail: string;
  toSegmentId?: string;
  delay?: number; // Delay in seconds before sending
}

export interface UpdateSegmentConfig {
  segmentId: string;
  action: 'add' | 'remove';
  contactIdField?: string; // Field path in execution context to get contact ID
}

export interface DelayConfig {
  delaySeconds: number;
}

// ============================================================================
// FLOW STORE OPERATIONS
// ============================================================================

export interface CreateFlowData {
  userId: string;
  workspaceId?: string | null;
  name: string;
  description?: string;
  triggerType: 'event' | 'schedule' | 'manual';
}

export interface UpdateFlowData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateNodeData {
  flowId: string;
  type: NodeType;
  subtype: string;
  config: Record<string, any>;
  position?: { x: number; y: number };
}

export interface CreateEdgeData {
  flowId: string;
  sourceNodeId: string;
  targetNodeId: string;
  conditionLabel?: string;
}

// ============================================================================
// EVENT BUS
// ============================================================================

export interface EventBusConfig {
  enableLogging?: boolean;
  maxConcurrentExecutions?: number;
}

export type EventHandler = (event: TriggerContext) => Promise<void>;

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'post_release' | 'reactivation' | 'reminders' | 'pr_boost';
  triggerType: 'event' | 'schedule' | 'manual';
  nodes: Omit<CreateNodeData, 'flowId'>[];
  edges: Omit<CreateEdgeData, 'flowId'>[];
}

/**
 * Agent Mesh OS Core Types
 */

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface AgentProfile {
  name: string;
  role: string;
  domain: string;
  inputs: string[];
  outputs: string[];
  constraints: string[];
  strengths: string[];
  weaknesses: string[];
  collaborationPreferences: {
    pairsWellWith: string[];
    avoids: string[];
    needsContext: string;
  };
  decisionAuthority: 'advisory' | 'tactical' | 'operational' | 'strategic' | 'creative' | 'analytical';
  escalationThreshold: 'low' | 'medium' | 'high' | 'proactive';
}

export interface RegisteredAgent {
  id: string;
  name: string;
  type: string;
  profile: AgentProfile;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export type MessageType =
  | 'REQUEST_CONTEXT'
  | 'PROVIDE_CONTEXT'
  | 'ASK_RECOMMENDATION'
  | 'OFFER_RECOMMENDATION'
  | 'NEGOTIATION_START'
  | 'NEGOTIATION_RESPONSE'
  | 'ESCALATION'
  | 'OPPORTUNITY'
  | 'RISK_DETECTED'
  | 'CREATIVE_SIGNAL'
  | 'STRATEGY_SIGNAL'
  | 'AUTOPILOT_HINT'
  | 'MAL_HINT'
  | 'COACHOS_HINT'
  | 'IDENTITY_HINT'
  | 'CMG_HINT'
  | 'MIG_HINT'
  | 'SCENES_HINT'
  | 'AWARENESS_ALERT'
  | 'TEAM_FORMATION'
  | 'TEAM_DISSOLUTION'
  | 'TASK_DELEGATION'
  | 'TASK_COMPLETION';

export interface MeshMessage {
  id: string;
  agent_from: string;
  agent_to: string | null; // null = broadcast
  message_type: MessageType;
  payload: any;
  workspace_id: string;
  created_at: string;
}

// ============================================================================
// MEMORY TYPES
// ============================================================================

export interface LongTermMemory {
  id: string;
  agent_name: string;
  key: string;
  value: any;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export interface EpisodicMemory {
  id: string;
  agent_name: string;
  event_type: string;
  payload: any;
  workspace_id: string;
  expires_at: string;
  created_at: string;
}

export interface SharedMemory {
  id: string;
  key: string;
  value: any;
  source_agent: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkingMemoryItem {
  key: string;
  value: any;
  timestamp: number;
}

// ============================================================================
// TEAM TYPES
// ============================================================================

export interface MeshTeam {
  id: string;
  name?: string;
  purpose: string;
  agent_names: string[];
  state: any;
  workspace_id: string;
  active: boolean;
  created_at: string;
  dissolved_at?: string;
}

export interface Negotiation {
  id: string;
  team_id: string;
  topic: string;
  initial_positions: Record<string, any>;
  conversation: Array<{
    agent: string;
    message: string;
    position: any;
    timestamp: string;
  }>;
  outcome?: any;
  status: 'in_progress' | 'converged' | 'escalated';
  workspace_id: string;
  created_at: string;
  resolved_at?: string;
}

// ============================================================================
// REASONING TYPES
// ============================================================================

export interface ReasoningCycle {
  id: string;
  cycle_type: 'opportunity' | 'conflict' | 'routine';
  inputs: any;
  reasoning: any;
  outputs: any;
  workspace_id: string;
  created_at: string;
}

export interface Opportunity {
  type: string;
  source: string;
  confidence: number;
  description: string;
  recommendations: string[];
  context: any;
}

export interface Conflict {
  type: string;
  agents: string[];
  positions: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
  resolution?: any;
}

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface MeshContext {
  workspaceId: string;
  fusion?: any;
  campaigns?: any;
  scenes?: any;
  mig?: any;
  cmg?: any;
  identity?: any;
  awareness?: any;
  cis?: any;
  autopilot?: any;
  mal?: any;
  coachos?: any;
  timestamp: string;
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export interface Action {
  type: string;
  target_system: 'autopilot' | 'mal' | 'coachos' | 'cis' | 'identity' | 'dashboard' | 'awareness';
  payload: any;
  binding: boolean; // false = recommendation only
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source_agent: string;
}

export interface GuardrailCheck {
  action: Action;
  passed: boolean;
  violations: string[];
  warnings: string[];
}

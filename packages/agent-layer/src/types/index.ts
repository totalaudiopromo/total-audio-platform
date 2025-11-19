// Agent Layer Type Definitions

export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
  inputs: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    description: string;
    default?: any;
  }[];
  outputs: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
  }[];
  permissions?: string[];
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  cost?: {
    tokens?: number;
    apiCalls?: number;
  };
}

export interface SkillContext {
  userId: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface SkillResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    duration: number;
    tokensUsed?: number;
    cost?: number;
    model?: string;
  };
}

export interface AgentInvocation {
  agentName: string;
  skillName?: string;
  input: Record<string, any>;
  context: SkillContext;
}

export interface AgentResponse<T = any> {
  success: boolean;
  result?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    startTime: number;
    endTime: number;
    duration: number;
    skillsInvoked?: string[];
  };
}

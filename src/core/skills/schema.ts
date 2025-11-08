/**
 * Skills System Schema
 * Total Audio Platform - Modular AI Capabilities
 *
 * Skills are reusable, versioned capability modules that agents can load and execute.
 * Each skill encapsulates specific behavior, constraints, and quality standards.
 */

export interface SkillMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  created: Date;
  updated: Date;
  tags: string[];
  category: SkillCategory;
}

export type SkillCategory =
  | 'pitch_generation'
  | 'contact_enrichment'
  | 'brand_voice'
  | 'content_creation'
  | 'analytics'
  | 'follow_up'
  | 'validation';

export interface SkillInput {
  name: string;
  type: 'string' | 'object' | 'array' | 'number' | 'boolean';
  description: string;
  required: boolean;
  default?: any;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface SkillOutput {
  name: string;
  type: 'string' | 'object' | 'array' | 'number' | 'boolean';
  description: string;
}

export interface SkillRule {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'constraint' | 'guideline' | 'best_practice';
}

export interface SkillDependency {
  skillName: string;
  version: string;
  required: boolean;
}

export interface SkillPrompt {
  system?: string;
  user?: string;
  examples?: Array<{
    input: Record<string, any>;
    output: Record<string, any>;
  }>;
}

export interface Skill {
  metadata: SkillMetadata;
  inputs: SkillInput[];
  outputs: SkillOutput[];
  rules: SkillRule[];
  dependencies?: SkillDependency[];
  prompt: SkillPrompt;
  config?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeout?: number;
  };
}

export interface SkillExecutionContext {
  skillName: string;
  version: string;
  inputs: Record<string, any>;
  agentId?: string;
  userId?: string;
  timestamp: Date;
}

export interface SkillExecutionResult {
  success: boolean;
  outputs: Record<string, any>;
  metadata: {
    executionTime: number;
    tokensUsed?: number;
    confidence?: number;
    warnings?: string[];
  };
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
}

export interface SkillRegistry {
  skills: Map<string, Skill>;
  versions: Map<string, string[]>; // skillName -> versions
}

/**
 * Skill validation error types
 */
export class SkillValidationError extends Error {
  constructor(public field: string, public constraint: string, message: string) {
    super(message);
    this.name = 'SkillValidationError';
  }
}

export class SkillExecutionError extends Error {
  constructor(public skillName: string, public context: string, message: string) {
    super(message);
    this.name = 'SkillExecutionError';
  }
}

export class SkillNotFoundError extends Error {
  constructor(public skillName: string, public version?: string) {
    super(`Skill "${skillName}"${version ? `@${version}` : ''} not found in registry`);
    this.name = 'SkillNotFoundError';
  }
}

/**
 * Skill Engine - Complete Skills Runtime
 * Total Audio Platform
 *
 * Manages skill loading, execution, permissions, versioning, and audit.
 * Integrates with Supabase for persistence and Claude API for AI execution.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import Ajv from 'ajv';
import {
  Skill,
  SkillExecutionContext,
  SkillExecutionResult,
  SkillNotFoundError,
  SkillValidationError,
  SkillExecutionError,
} from './schema';

const ajv = new Ajv();

export interface SkillContext {
  orgId: string;
  userId?: string;
  tools: {
    llm?: Anthropic;
    db: SupabaseClient;
  };
  config: Record<string, unknown>;
}

export interface SkillInvokeOptions {
  orgId: string;
  userId?: string;
  skillKey: string;
  version?: string;
  payload: Record<string, any>;
}

export class SkillEngine {
  private registry: Map<string, Skill> = new Map();
  private db: SupabaseClient;
  private llm?: Anthropic;
  private initialized: boolean = false;

  constructor(db: SupabaseClient, anthropicKey?: string) {
    this.db = db;
    if (anthropicKey) {
      this.llm = new Anthropic({ apiKey: anthropicKey });
    }
  }

  /**
   * Initialize the skill engine by loading all active skills
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadActiveSkills();
      this.initialized = true;
      console.log(
        `[SkillEngine] Initialized with ${this.registry.size} active skills`
      );
    } catch (error) {
      console.error('[SkillEngine] Initialization failed:', error);
      throw new SkillExecutionError(
        'system',
        'initialization',
        `Failed to initialize skill engine: ${error.message}`
      );
    }
  }

  /**
   * Load all active skills from database
   */
  private async loadActiveSkills(): Promise<void> {
    const { data: skills, error } = await this.db
      .from('skill_version')
      .select(`
        id,
        version,
        manifest,
        skill:skill_id (
          id,
          key,
          name,
          description,
          category,
          tags
        )
      `)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to load skills: ${error.message}`);
    }

    for (const skillVersion of skills || []) {
      const skill: Skill = {
        metadata: {
          name: skillVersion.manifest.key,
          version: skillVersion.version,
          description: skillVersion.skill.description,
          created: new Date(),
          updated: new Date(),
          tags: skillVersion.skill.tags || [],
          category: skillVersion.skill.category,
        },
        inputs: skillVersion.manifest.io?.input_schema?.properties
          ? Object.entries(skillVersion.manifest.io.input_schema.properties).map(
              ([name, schema]: [string, any]) => ({
                name,
                type: schema.type || 'object',
                description: schema.description || '',
                required:
                  skillVersion.manifest.io.input_schema.required?.includes(
                    name
                  ) || false,
                validation: schema.validation,
              })
            )
          : [],
        outputs: skillVersion.manifest.io?.output_schema?.properties
          ? Object.entries(skillVersion.manifest.io.output_schema.properties).map(
              ([name, schema]: [string, any]) => ({
                name,
                type: schema.type || 'object',
                description: schema.description || '',
              })
            )
          : [],
        rules: skillVersion.manifest.rules || [],
        dependencies: skillVersion.manifest.dependencies,
        prompt: skillVersion.manifest.prompt || {},
        config: skillVersion.manifest.config,
      };

      const key = this.getSkillKey(skill.metadata.name, skill.metadata.version);
      this.registry.set(key, skill);
    }
  }

  /**
   * Invoke a skill with comprehensive validation and audit
   */
  async invokeSkill(options: SkillInvokeOptions): Promise<SkillExecutionResult> {
    const startTime = Date.now();
    const { orgId, userId, skillKey, version = 'latest', payload } = options;

    try {
      // 1. Check if skill is enabled for this org/user
      const binding = await this.getSkillBinding(orgId, userId, skillKey);
      if (!binding?.enabled) {
        throw new SkillExecutionError(
          skillKey,
          'permissions',
          `Skill "${skillKey}" is not enabled for this organization`
        );
      }

      // 2. Load the skill
      const skill = await this.loadSkill(skillKey, version);

      // 3. Validate inputs against schema
      this.validateInputs(skill, payload);

      // 4. Check permissions
      await this.checkPermissions(skill, orgId);

      // 5. Build execution context
      const context: SkillContext = {
        orgId,
        userId,
        tools: {
          llm: this.llm,
          db: this.db,
        },
        config: binding.config || {},
      };

      // 6. Execute the skill
      const outputs = await this.executeSkill(skill, payload, context);

      // 7. Validate outputs
      this.validateOutputs(skill, outputs);

      const executionTime = Date.now() - startTime;

      // 8. Audit the invocation
      await this.auditInvocation({
        orgId,
        userId,
        skillKey,
        version: skill.metadata.version,
        inputs: payload,
        outputs,
        duration_ms: executionTime,
        tokens_used: outputs.metadata?.tokensUsed,
        confidence: outputs.confidence,
      });

      return {
        success: true,
        outputs,
        metadata: {
          executionTime,
          tokensUsed: outputs.metadata?.tokensUsed,
          confidence: outputs.confidence,
          warnings: outputs.warnings,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Audit failed invocation
      await this.auditInvocation({
        orgId,
        userId,
        skillKey,
        version,
        inputs: payload,
        error: error.message,
        duration_ms: executionTime,
      });

      if (
        error instanceof SkillValidationError ||
        error instanceof SkillNotFoundError ||
        error instanceof SkillExecutionError
      ) {
        return {
          success: false,
          outputs: {},
          metadata: { executionTime },
          errors: [
            {
              code: error.name,
              message: error.message,
              field: 'field' in error ? error.field : undefined,
            },
          ],
        };
      }

      return {
        success: false,
        outputs: {},
        metadata: { executionTime },
        errors: [
          {
            code: 'EXECUTION_ERROR',
            message: error.message,
          },
        ],
      };
    }
  }

  /**
   * Execute the actual skill logic
   */
  private async executeSkill(
    skill: Skill,
    inputs: Record<string, any>,
    context: SkillContext
  ): Promise<Record<string, any>> {
    if (!context.tools.llm) {
      throw new SkillExecutionError(
        skill.metadata.name,
        'llm',
        'LLM client not available - cannot execute AI-powered skill'
      );
    }

    // Build prompt from skill definition
    const systemPrompt = this.buildSystemPrompt(skill);
    const userPrompt = this.buildUserPrompt(skill, inputs);

    console.log(`[SkillEngine] Executing ${skill.metadata.name}@${skill.metadata.version}`);

    try {
      const message = await context.tools.llm.messages.create({
        model: skill.config?.model || 'claude-3-5-haiku-20241022',
        max_tokens: skill.config?.maxTokens || 1024,
        temperature: skill.config?.temperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      // Extract JSON response from Claude's output
      const contentBlock = message.content[0];
      if (contentBlock.type !== 'text') {
        throw new SkillExecutionError(
          skill.metadata.name,
          'execution',
          'Unexpected response format from LLM'
        );
      }

      // Parse JSON from response
      const jsonMatch = contentBlock.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new SkillExecutionError(
          skill.metadata.name,
          'execution',
          'No JSON output found in LLM response'
        );
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        ...result,
        metadata: {
          tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
          model: skill.config?.model || 'claude-3-5-haiku-20241022',
        },
      };
    } catch (error) {
      throw new SkillExecutionError(
        skill.metadata.name,
        'llm_execution',
        `LLM execution failed: ${error.message}`
      );
    }
  }

  /**
   * Build system prompt from skill definition
   */
  private buildSystemPrompt(skill: Skill): string {
    let prompt = skill.prompt.system || '';

    // Add rules to system prompt
    if (skill.rules && skill.rules.length > 0) {
      prompt += '\n\nCRITICAL RULES:\n';
      const criticalRules = skill.rules.filter((r) => r.priority === 'critical');
      criticalRules.forEach((rule) => {
        prompt += `- ${rule.description}\n`;
      });
    }

    return prompt;
  }

  /**
   * Build user prompt from skill definition and inputs
   */
  private buildUserPrompt(skill: Skill, inputs: Record<string, any>): string {
    let prompt = skill.prompt.user || '';

    // Simple template replacement
    for (const [key, value] of Object.entries(inputs)) {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      prompt = prompt.replace(placeholder, JSON.stringify(value, null, 2));
    }

    return prompt;
  }

  /**
   * Load a skill from the registry
   */
  private async loadSkill(skillKey: string, version: string): Promise<Skill> {
    // Resolve version if 'latest'
    const resolvedVersion =
      version === 'latest' ? await this.getLatestVersion(skillKey) : version;

    const key = this.getSkillKey(skillKey, resolvedVersion);
    const skill = this.registry.get(key);

    if (!skill) {
      throw new SkillNotFoundError(skillKey, resolvedVersion);
    }

    return skill;
  }

  /**
   * Get latest version of a skill
   */
  private async getLatestVersion(skillKey: string): Promise<string> {
    const { data, error } = await this.db
      .from('skill_version')
      .select('version')
      .eq('skill_id', this.db.from('skill').select('id').eq('key', skillKey).single())
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      throw new SkillNotFoundError(skillKey);
    }

    return data.version;
  }

  /**
   * Get skill binding for org/user
   */
  private async getSkillBinding(
    orgId: string,
    userId: string | undefined,
    skillKey: string
  ): Promise<{ enabled: boolean; config: Record<string, any> } | null> {
    const { data: skill } = await this.db
      .from('skill')
      .select('id')
      .eq('key', skillKey)
      .single();

    if (!skill) return null;

    const { data: binding } = await this.db
      .from('skill_binding')
      .select('enabled, config')
      .eq('org_id', orgId)
      .eq('skill_id', skill.id)
      .or(userId ? `user_id.eq.${userId},user_id.is.null` : 'user_id.is.null')
      .order('user_id', { ascending: false }) // User-specific bindings take precedence
      .limit(1)
      .single();

    return binding || { enabled: true, config: {} }; // Default to enabled if no binding
  }

  /**
   * Check if skill has required permissions
   */
  private async checkPermissions(skill: Skill, orgId: string): Promise<void> {
    // TODO: Implement org-level permission checks
    // For now, all skills are allowed
    return;
  }

  /**
   * Validate inputs against skill schema
   */
  private validateInputs(skill: Skill, inputs: Record<string, any>): void {
    for (const inputDef of skill.inputs) {
      if (inputDef.required && !(inputDef.name in inputs)) {
        throw new SkillValidationError(
          inputDef.name,
          'required',
          `Required input "${inputDef.name}" is missing`
        );
      }

      const value = inputs[inputDef.name];
      if (value !== undefined) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== inputDef.type) {
          throw new SkillValidationError(
            inputDef.name,
            'type',
            `Input "${inputDef.name}" must be of type ${inputDef.type}, got ${actualType}`
          );
        }
      }
    }
  }

  /**
   * Validate outputs
   */
  private validateOutputs(skill: Skill, outputs: Record<string, any>): void {
    for (const outputDef of skill.outputs) {
      if (!(outputDef.name in outputs)) {
        console.warn(
          `[SkillEngine] Expected output "${outputDef.name}" not found in skill result`
        );
      }
    }
  }

  /**
   * Audit skill invocation to database
   */
  private async auditInvocation(data: {
    orgId: string;
    userId?: string;
    skillKey: string;
    version: string;
    inputs: Record<string, any>;
    outputs?: Record<string, any>;
    error?: string;
    duration_ms: number;
    tokens_used?: number;
    confidence?: number;
  }): Promise<void> {
    try {
      await this.db.from('skill_invocation').insert({
        org_id: data.orgId,
        user_id: data.userId,
        skill_key: data.skillKey,
        version: data.version,
        inputs: data.inputs,
        outputs: data.outputs,
        error: data.error,
        duration_ms: data.duration_ms,
        tokens_used: data.tokens_used,
        confidence: data.confidence,
      });
    } catch (error) {
      console.error('[SkillEngine] Failed to audit invocation:', error);
      // Don't throw - audit failures shouldn't break execution
    }
  }

  /**
   * Get skill key for registry
   */
  private getSkillKey(name: string, version: string): string {
    return `${name}@${version}`;
  }

  /**
   * List all available skills
   */
  async listSkills(): Promise<Array<{ key: string; name: string; versions: string[] }>> {
    const { data: skills, error } = await this.db
      .from('skill')
      .select(`
        key,
        name,
        skill_version!inner(version, status)
      `)
      .eq('skill_version.status', 'active');

    if (error) {
      throw new Error(`Failed to list skills: ${error.message}`);
    }

    return (
      skills?.map((skill) => ({
        key: skill.key,
        name: skill.name,
        versions: skill.skill_version?.map((v) => v.version) || [],
      })) || []
    );
  }

  /**
   * Reload skills from database
   */
  async reload(): Promise<void> {
    this.registry.clear();
    await this.loadActiveSkills();
  }
}

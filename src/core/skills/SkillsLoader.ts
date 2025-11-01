/**
 * Skills Loader - Dynamic Skill Loading & Execution
 * Total Audio Platform
 *
 * Handles loading, versioning, caching, and execution of skill modules.
 * Integrates with Notion MCP for metadata tracking.
 */

import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import {
  Skill,
  SkillRegistry,
  SkillExecutionContext,
  SkillExecutionResult,
  SkillNotFoundError,
  SkillValidationError,
  SkillExecutionError,
} from './schema';

export class SkillsLoader {
  private registry: SkillRegistry = {
    skills: new Map(),
    versions: new Map(),
  };

  private cache: Map<string, Skill> = new Map();
  private skillsDir: string;
  private cacheEnabled: boolean;

  constructor(skillsDir?: string, options?: { cacheEnabled?: boolean }) {
    this.skillsDir = skillsDir || path.join(process.cwd(), 'skills/definitions');
    this.cacheEnabled = options?.cacheEnabled ?? true;
  }

  /**
   * Initialize the skills loader by scanning the skills directory
   */
  async initialize(): Promise<void> {
    try {
      await this.loadAllSkills();
      console.log(`[SkillsLoader] Initialized with ${this.registry.skills.size} skills`);
    } catch (error) {
      console.error('[SkillsLoader] Initialization failed:', error);
      throw new SkillExecutionError(
        'system',
        'initialization',
        `Failed to initialize skills loader: ${error.message}`
      );
    }
  }

  /**
   * Load all skills from the skills directory
   */
  private async loadAllSkills(): Promise<void> {
    try {
      const files = await fs.readdir(this.skillsDir);
      const skillFiles = files.filter(
        f => f.endsWith('.yml') || f.endsWith('.yaml') || f.endsWith('.json')
      );

      for (const file of skillFiles) {
        try {
          await this.loadSkillFile(path.join(this.skillsDir, file));
        } catch (error) {
          console.warn(`[SkillsLoader] Failed to load ${file}:`, error.message);
        }
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`[SkillsLoader] Skills directory not found: ${this.skillsDir}`);
        // Create directory if it doesn't exist
        await fs.mkdir(this.skillsDir, { recursive: true });
      } else {
        throw error;
      }
    }
  }

  /**
   * Load a skill from a file
   */
  private async loadSkillFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    const skill: Skill = filePath.endsWith('.json') ? JSON.parse(content) : yaml.parse(content);

    this.registerSkill(skill);
  }

  /**
   * Register a skill in the registry
   */
  private registerSkill(skill: Skill): void {
    const key = this.getSkillKey(skill.metadata.name, skill.metadata.version);
    this.registry.skills.set(key, skill);

    // Track versions
    const versions = this.registry.versions.get(skill.metadata.name) || [];
    if (!versions.includes(skill.metadata.version)) {
      versions.push(skill.metadata.version);
      versions.sort(this.compareVersions);
      this.registry.versions.set(skill.metadata.name, versions);
    }

    console.log(`[SkillsLoader] Registered ${skill.metadata.name}@${skill.metadata.version}`);
  }

  /**
   * Load a specific skill by name and version
   */
  async load(skillName: string, version: string = 'latest'): Promise<Skill> {
    const resolvedVersion = this.resolveVersion(skillName, version);
    const key = this.getSkillKey(skillName, resolvedVersion);

    // Check cache first
    if (this.cacheEnabled && this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Check registry
    const skill = this.registry.skills.get(key);
    if (!skill) {
      throw new SkillNotFoundError(skillName, resolvedVersion);
    }

    // Cache the skill
    if (this.cacheEnabled) {
      this.cache.set(key, skill);
    }

    return skill;
  }

  /**
   * Execute a skill with given inputs
   */
  async execute(
    skillName: string,
    inputs: Record<string, any>,
    context?: Partial<SkillExecutionContext>
  ): Promise<SkillExecutionResult> {
    const startTime = Date.now();

    try {
      // Load the skill
      const skill = await this.load(skillName, context?.version || 'latest');

      // Validate inputs
      this.validateInputs(skill, inputs);

      // Check dependencies
      if (skill.dependencies) {
        await this.checkDependencies(skill.dependencies);
      }

      // Execute the skill (this is where we'd integrate with Claude API or local execution)
      const outputs = await this.executeSkill(skill, inputs, context);

      // Validate outputs
      this.validateOutputs(skill, outputs);

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        outputs,
        metadata: {
          executionTime,
          confidence: outputs.confidence,
          warnings: outputs.warnings,
        },
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      if (error instanceof SkillValidationError || error instanceof SkillNotFoundError) {
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
   * Execute the actual skill logic (stub for now - would integrate with Claude API)
   */
  private async executeSkill(
    skill: Skill,
    inputs: Record<string, any>,
    context?: Partial<SkillExecutionContext>
  ): Promise<Record<string, any>> {
    // This is where we'd integrate with:
    // 1. Claude API for AI-powered skills
    // 2. Local functions for deterministic skills
    // 3. External APIs for data enrichment skills

    // For now, return a stub response
    console.log(`[SkillsLoader] Executing ${skill.metadata.name}...`);

    return {
      // Stub outputs - would be replaced with actual execution
      result: 'Skill execution pending - integrate with Claude API',
      confidence: 0.85,
    };
  }

  /**
   * Validate skill inputs against schema
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
        // Type validation
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== inputDef.type) {
          throw new SkillValidationError(
            inputDef.name,
            'type',
            `Input "${inputDef.name}" must be of type ${inputDef.type}, got ${actualType}`
          );
        }

        // Custom validation rules
        if (inputDef.validation) {
          this.validateInputRules(inputDef.name, value, inputDef.validation);
        }
      }
    }
  }

  /**
   * Validate input against custom rules
   */
  private validateInputRules(
    fieldName: string,
    value: any,
    rules: NonNullable<typeof SkillInput.prototype.validation>
  ): void {
    if (rules.minLength && value.length < rules.minLength) {
      throw new SkillValidationError(
        fieldName,
        'minLength',
        `Input "${fieldName}" must be at least ${rules.minLength} characters`
      );
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      throw new SkillValidationError(
        fieldName,
        'maxLength',
        `Input "${fieldName}" must be at most ${rules.maxLength} characters`
      );
    }

    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      throw new SkillValidationError(
        fieldName,
        'pattern',
        `Input "${fieldName}" does not match required pattern`
      );
    }

    if (rules.enum && !rules.enum.includes(value)) {
      throw new SkillValidationError(
        fieldName,
        'enum',
        `Input "${fieldName}" must be one of: ${rules.enum.join(', ')}`
      );
    }
  }

  /**
   * Validate skill outputs
   */
  private validateOutputs(skill: Skill, outputs: Record<string, any>): void {
    for (const outputDef of skill.outputs) {
      if (!(outputDef.name in outputs)) {
        console.warn(
          `[SkillsLoader] Expected output "${outputDef.name}" not found in skill result`
        );
      }
    }
  }

  /**
   * Check if skill dependencies are available
   */
  private async checkDependencies(dependencies: NonNullable<Skill['dependencies']>): Promise<void> {
    for (const dep of dependencies) {
      try {
        await this.load(dep.skillName, dep.version);
      } catch (error) {
        if (dep.required) {
          throw new SkillExecutionError(
            dep.skillName,
            'dependency',
            `Required dependency "${dep.skillName}@${dep.version}" not found`
          );
        } else {
          console.warn(
            `[SkillsLoader] Optional dependency "${dep.skillName}@${dep.version}" not found`
          );
        }
      }
    }
  }

  /**
   * Resolve version string to actual version
   */
  private resolveVersion(skillName: string, version: string): string {
    if (version === 'latest') {
      const versions = this.registry.versions.get(skillName);
      if (!versions || versions.length === 0) {
        throw new SkillNotFoundError(skillName);
      }
      return versions[versions.length - 1];
    }
    return version;
  }

  /**
   * Generate cache key for skill
   */
  private getSkillKey(name: string, version: string): string {
    return `${name}@${version}`;
  }

  /**
   * Compare semantic versions
   */
  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0;
      const bVal = bParts[i] || 0;
      if (aVal !== bVal) {
        return aVal - bVal;
      }
    }
    return 0;
  }

  /**
   * Get list of all registered skills
   */
  listSkills(): Array<{ name: string; versions: string[] }> {
    return Array.from(this.registry.versions.entries()).map(([name, versions]) => ({
      name,
      versions,
    }));
  }

  /**
   * Reload skills from disk (useful for development)
   */
  async reload(): Promise<void> {
    this.registry.skills.clear();
    this.registry.versions.clear();
    this.cache.clear();
    await this.loadAllSkills();
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const skillsLoader = new SkillsLoader();

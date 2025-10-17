/**
 * Skills System - Main Export File
 * Total Audio Platform
 *
 * Import everything you need from this single entry point.
 */

// Core engine
export { SkillEngine } from './SkillEngine';
export { SkillsLoader, skillsLoader } from './SkillsLoader';

// Schema and types
export type {
  Skill,
  SkillMetadata,
  SkillInput,
  SkillOutput,
  SkillRule,
  SkillDependency,
  SkillPrompt,
  SkillExecutionContext,
  SkillExecutionResult,
  SkillRegistry,
  SkillCategory,
} from './schema';

export {
  SkillValidationError,
  SkillExecutionError,
  SkillNotFoundError,
} from './schema';

// Built-in skills
export {
  VoiceGuardSkill,
  type VoiceGuardInput,
  type VoiceGuardOutput,
} from './implementations/VoiceGuardSkill';

export {
  PitchDraftSkill,
  type PitchDraftInput,
  type PitchDraftOutput,
} from './implementations/PitchDraftSkill';

export {
  ContactMatcherSkill,
  type ContactMatcherInput,
  type ContactMatcherOutput,
} from './implementations/ContactMatcherSkill';

// API routes
export { createSkillsRouter } from './api/routes';

/**
 * Quick start helper
 *
 * @example
 * ```typescript
 * import { initializeSkills } from '@/core/skills';
 *
 * const skillEngine = await initializeSkills({
 *   supabaseUrl: process.env.SUPABASE_URL,
 *   supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
 *   anthropicKey: process.env.ANTHROPIC_API_KEY,
 * });
 *
 * // Use skills
 * const result = await skillEngine.invokeSkill({
 *   orgId: 'org_123',
 *   skillKey: 'pitch_draft',
 *   payload: { track, contact },
 * });
 * ```
 */
export async function initializeSkills(config: {
  supabaseUrl: string;
  supabaseKey: string;
  anthropicKey?: string;
}) {
  const { createClient } = await import('@supabase/supabase-js');

  const supabase = createClient(config.supabaseUrl, config.supabaseKey);

  const skillEngine = new SkillEngine(supabase, config.anthropicKey);

  await skillEngine.initialize();

  return skillEngine;
}

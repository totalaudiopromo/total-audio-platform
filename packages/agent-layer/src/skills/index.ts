// Skills export
import type { SkillManifest, SkillContext, SkillResult } from '../types';

export interface Skill {
  manifest: SkillManifest;
  run: (input: any, context: SkillContext) => Promise<SkillResult>;
  validate?: (input: any) => boolean;
}

// Export pitch-variation skill
export { run as runPitchVariation, validate as validatePitchVariation } from '../../skills/pitch-variation/run';

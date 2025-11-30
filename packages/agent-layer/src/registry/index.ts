// Skill Registry (placeholder for future implementation)
import type { SkillManifest } from '../types';

export class SkillRegistry {
  private skills: Map<string, SkillManifest> = new Map();

  register(manifest: SkillManifest): void {
    this.skills.set(manifest.name, manifest);
  }

  get(name: string): SkillManifest | undefined {
    return this.skills.get(name);
  }

  list(): SkillManifest[] {
    return Array.from(this.skills.values());
  }
}

export const registry = new SkillRegistry();

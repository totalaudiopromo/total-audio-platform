/**
 * MIG Scenes Bridge - READ-ONLY interface to MIG and Scenes Engine
 * Provides scene palette hints, narrative angles, and microgenre visual hints
 */

import type { ScenePaletteHint, SceneNarrativeAngle, MicrogenreVisualHint } from './types';

export class MIGScenesBridge {
  private mig: any;

  constructor(migInstance?: any) {
    this.mig = migInstance;
  }

  async getScenePaletteHints(artistSlug: string): Promise<ScenePaletteHint[]> {
    try {
      if (!this.mig?.getScenePalettes) {
        return this.getMockPaletteHints();
      }

      const palettes = await this.mig.getScenePalettes(artistSlug);
      return palettes.map((p: any) => ({
        scene: p.scene,
        suggestedColors: p.colors || [],
        mood: p.mood,
        rationale: p.rationale,
      }));
    } catch (error) {
      console.error('Error fetching scene palette hints:', error);
      return [];
    }
  }

  async getSceneNarrativeAngles(artistSlug: string): Promise<SceneNarrativeAngle[]> {
    try {
      if (!this.mig?.getSceneNarratives) {
        return [];
      }

      const narratives = await this.mig.getSceneNarratives(artistSlug);
      return narratives.map((n: any) => ({
        scene: n.scene,
        angle: n.angle,
        hooks: n.hooks || [],
        rationale: n.rationale,
      }));
    } catch (error) {
      console.error('Error fetching scene narrative angles:', error);
      return [];
    }
  }

  async getMicrogenreVisualHints(artistSlug: string): Promise<MicrogenreVisualHint[]> {
    try {
      if (!this.mig?.getMicrogenreVisuals) {
        return [];
      }

      const hints = await this.mig.getMicrogenreVisuals(artistSlug);
      return hints.map((h: any) => ({
        microgenre: h.microgenre,
        visualElements: h.elements || [],
        references: h.references || [],
        rationale: h.rationale,
      }));
    } catch (error) {
      console.error('Error fetching microgenre visual hints:', error);
      return [];
    }
  }

  private getMockPaletteHints(): ScenePaletteHint[] {
    return [
      {
        scene: 'underground-electronic',
        suggestedColors: ['#0F172A', '#3AA9BE', '#6366F1'],
        mood: 'dark-futuristic',
        rationale: 'Underground electronic scenes favor dark, neon-accented palettes',
      },
    ];
  }
}

export const createMIGScenesBridge = (migInstance?: any): MIGScenesBridge => {
  return new MIGScenesBridge(migInstance);
};

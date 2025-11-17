/**
 * CMG Bridge - READ-ONLY interface to Creative Memory Graph
 * Provides creative fingerprints, emotional arcs, and structural motifs
 */

import type { CreativeFingerprint, EmotionalArcPattern, StructuralMotif } from './types';

export class CMGBridge {
  private cmg: any;

  constructor(cmgInstance?: any) {
    this.cmg = cmgInstance;
  }

  async getCreativeFingerprint(artistSlug: string): Promise<CreativeFingerprint | null> {
    try {
      if (!this.cmg?.getFingerprint) {
        return this.getMockFingerprint();
      }

      const fingerprint = await this.cmg.getFingerprint(artistSlug);
      return {
        visualThemes: fingerprint.visualThemes || [],
        narrativePatterns: fingerprint.narrativePatterns || [],
        colorPreferences: fingerprint.colorPreferences || [],
        compositionalStyle: fingerprint.compositionalStyle,
        brandPersonality: fingerprint.brandPersonality || [],
      };
    } catch (error) {
      console.error('Error fetching creative fingerprint:', error);
      return null;
    }
  }

  async getEmotionalArcPatterns(artistSlug: string): Promise<EmotionalArcPattern[]> {
    try {
      if (!this.cmg?.getEmotionalArcs) {
        return [];
      }

      const arcs = await this.cmg.getEmotionalArcs(artistSlug);
      return arcs.map((arc: any) => ({
        pattern: arc.pattern,
        frequency: arc.frequency || 1,
        contexts: arc.contexts || [],
      }));
    } catch (error) {
      console.error('Error fetching emotional arc patterns:', error);
      return [];
    }
  }

  async getStructuralMotifs(artistSlug: string): Promise<StructuralMotif[]> {
    try {
      if (!this.cmg?.getMotifs) {
        return [];
      }

      const motifs = await this.cmg.getMotifs(artistSlug);
      return motifs.map((motif: any) => ({
        type: motif.type,
        description: motif.description,
        examples: motif.examples || [],
      }));
    } catch (error) {
      console.error('Error fetching structural motifs:', error);
      return [];
    }
  }

  private getMockFingerprint(): CreativeFingerprint {
    return {
      visualThemes: ['minimalist', 'geometric', 'futuristic'],
      narrativePatterns: ['transformation', 'discovery'],
      colorPreferences: ['#3AA9BE', '#6366F1', '#0F172A'],
      compositionalStyle: 'asymmetric-dynamic',
      brandPersonality: ['innovative', 'authentic', 'bold'],
    };
  }
}

export const createCMGBridge = (cmgInstance?: any): CMGBridge => {
  return new CMGBridge(cmgInstance);
};

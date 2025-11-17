/**
 * Context-Aware Generator - Enhanced generation using full CISContext
 */

import type { CISContext } from '@total-audio/cis-integrations';
import type { CreativeSuggestions, ColorPalette } from '@total-audio/cis-core';

export class ContextAwareGenerator {
  async generateWithContext(context: CISContext): Promise<CreativeSuggestions & { rationale: string }> {
    const suggestions: CreativeSuggestions = {
      palettes: this.generateContextAwarePalettes(context),
      layouts: [],
      typography: [],
      references: [],
      moodDescriptors: this.generateMoodDescriptors(context),
      visualMetaphors: [],
    };

    const rationale = this.generateRationale(context);

    return { ...suggestions, rationale };
  }

  private generateContextAwarePalettes(context: CISContext): ColorPalette[] {
    const palettes: ColorPalette[] = [];

    // From MIG scene hints
    if (context.scenePaletteHints) {
      context.scenePaletteHints.forEach(hint => {
        palettes.push({
          name: `${hint.scene} Scene`,
          colors: hint.suggestedColors,
          description: hint.rationale,
          mood: hint.mood,
        });
      });
    }

    // From Identity Kernel
    if (context.identityProfile?.visualIdentity?.palettes) {
      palettes.push(...context.identityProfile.visualIdentity.palettes);
    }

    // From CMG creative fingerprint
    if (context.creativeFingerprint?.colorPreferences) {
      palettes.push({
        name: 'Creative Fingerprint',
        colors: context.creativeFingerprint.colorPreferences,
        description: 'Colors derived from your creative history',
      });
    }

    return palettes;
  }

  private generateMoodDescriptors(context: CISContext): string[] {
    const descriptors: string[] = [];

    if (context.emotionalArcPatterns) {
      descriptors.push(...context.emotionalArcPatterns.map(p => p.pattern));
    }

    if (context.creativeFingerprint?.brandPersonality) {
      descriptors.push(...context.creativeFingerprint.brandPersonality);
    }

    if (context.sceneContext?.primaryScene) {
      descriptors.push(context.sceneContext.primaryScene);
    }

    return [...new Set(descriptors)];
  }

  private generateRationale(context: CISContext): string {
    const parts: string[] = [];

    if (context.artistContext) {
      parts.push(`Based on ${context.artistContext.name}'s ${context.artistContext.genre} style`);
    }

    if (context.sceneContext?.primaryScene) {
      parts.push(`aligned with ${context.sceneContext.primaryScene} scene aesthetics`);
    }

    if (context.creativeFingerprint) {
      parts.push(`incorporating established creative patterns`);
    }

    if (context.identityProfile) {
      parts.push(`consistent with brand identity`);
    }

    return parts.join(', ') + '.';
  }
}

export const createContextAwareGenerator = (): ContextAwareGenerator => {
  return new ContextAwareGenerator();
};

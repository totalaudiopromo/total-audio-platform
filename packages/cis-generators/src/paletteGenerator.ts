/**
 * Palette Generator - Creates color palettes for creative projects
 */

import type { CreativeContext, ColorPalette } from '@total-audio/cis-core';

export class PaletteGenerator {
  /**
   * Generate multiple color palette variations
   */
  async generate(context: CreativeContext): Promise<ColorPalette[]> {
    const palettes: ColorPalette[] = [];

    // Hero palette based on genre
    const genre = context.artist?.genre || 'Electronic';
    palettes.push(this.generateHeroPalette(genre));

    // Emotional palettes
    if (context.emotionalArc) {
      palettes.push(...this.generateEmotionalPalettes(context.emotionalArc.dominantEmotion));
    }

    // Sonic palettes
    if (context.sonicFingerprint) {
      palettes.push(this.generateSonicPalette(context.sonicFingerprint));
    }

    // Gradient suggestions
    palettes.push(...this.generateGradientPalettes());

    return palettes;
  }

  private generateHeroPalette(genre: string): ColorPalette {
    const genrePalettes: Record<string, string[]> = {
      Electronic: ['#3AA9BE', '#6366F1', '#0F172A', '#FFFFFF'],
      Rock: ['#DC2626', '#78716C', '#000000', '#FBBF24'],
      'Hip Hop': ['#FBBF24', '#EF4444', '#1F2937', '#FFFFFF'],
      Pop: ['#EC4899', '#A855F7', '#3B82F6', '#FFFFFF'],
      Indie: ['#86EFAC', '#FBBF24', '#E5E7EB', '#1F2937'],
      Jazz: ['#92400E', '#FBBF24', '#0C4A6E', '#F1F5F9'],
    };

    return {
      name: `${genre} Hero`,
      colors: genrePalettes[genre] || genrePalettes.Electronic,
      description: `Primary palette for ${genre} aesthetic`,
      genreAlignment: genre,
    };
  }

  private generateEmotionalPalettes(emotion: string): ColorPalette[] {
    const palettes: Record<string, ColorPalette> = {
      energetic: {
        name: 'Energy Burst',
        colors: ['#EF4444', '#F97316', '#FBBF24', '#DC2626'],
        mood: 'energetic',
      },
      melancholic: {
        name: 'Deep Blue',
        colors: ['#3B82F6', '#1E40AF', '#475569', '#E0F2FE'],
        mood: 'melancholic',
      },
      uplifting: {
        name: 'Sunrise',
        colors: ['#FBBF24', '#FDE047', '#FEF3C7', '#F59E0B'],
        mood: 'uplifting',
      },
      dark: {
        name: 'Midnight',
        colors: ['#0F172A', '#1E293B', '#475569', '#DC2626'],
        mood: 'dark',
      },
    };

    return palettes[emotion] ? [palettes[emotion]] : [];
  }

  private generateSonicPalette(sonic: any): ColorPalette {
    const { energy, valence } = sonic;

    // Map sonic properties to colors
    let colors: string[];
    if (energy > 0.7 && valence > 0.7) {
      colors = ['#FBBF24', '#F59E0B', '#FEF3C7', '#DC2626']; // High energy, positive
    } else if (energy > 0.7 && valence < 0.3) {
      colors = ['#DC2626', '#991B1B', '#0F172A', '#EF4444']; // High energy, negative
    } else if (energy < 0.3 && valence > 0.7) {
      colors = ['#86EFAC', '#3AA9BE', '#E0F2FE', '#DCFCE7']; // Low energy, positive
    } else {
      colors = ['#3B82F6', '#1E3A8A', '#475569', '#94A3B8']; // Low energy, negative
    }

    return {
      name: 'Sonic Profile',
      colors,
      description: 'Palette derived from sonic characteristics',
    };
  }

  private generateGradientPalettes(): ColorPalette[] {
    return [
      {
        name: 'Cyan to Purple',
        colors: ['#3AA9BE', '#6366F1', '#A855F7', '#EC4899'],
        description: 'Modern gradient palette',
      },
      {
        name: 'Sunset Fade',
        colors: ['#F97316', '#FBBF24', '#FDE047', '#FEF3C7'],
        description: 'Warm gradient palette',
      },
      {
        name: 'Ocean Depths',
        colors: ['#0F766E', '#0891B2', '#3AA9BE', '#E0F2FE'],
        description: 'Cool gradient palette',
      },
    ];
  }
}

export const createPaletteGenerator = (): PaletteGenerator => {
  return new PaletteGenerator();
};

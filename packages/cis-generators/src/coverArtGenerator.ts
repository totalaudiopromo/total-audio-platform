/**
 * Cover Art Generator - AI-powered cover art suggestions
 * Uses CreativeContext to generate palettes, layouts, and typography recommendations
 */

import type {
  CreativeContext,
  ColorPalette,
  LayoutSuggestion,
  TypographySuggestion,
  CreativeSuggestions,
} from '@total-audio/cis-core';

export interface CoverArtSuggestions extends CreativeSuggestions {
  shootConcepts: string[];
  visualMetaphors: string[];
  compositionRules: string[];
}

export class CoverArtGenerator {
  private anthropicClient: any;

  constructor(anthropicClient?: any) {
    this.anthropicClient = anthropicClient;
  }

  /**
   * Generate comprehensive cover art suggestions
   */
  async generate(context: CreativeContext): Promise<CoverArtSuggestions> {
    // Extract key context
    const genre = context.artist?.genre || 'Electronic';
    const emotionalArc = context.emotionalArc;
    const genreProfile = context.genreProfile;

    // Generate palettes based on genre and emotional arc
    const palettes = this.generatePalettes(genre, emotionalArc, genreProfile);

    // Generate layout suggestions
    const layouts = this.generateLayouts(genre, genreProfile);

    // Generate typography recommendations
    const typography = this.generateTypography(genre, genreProfile);

    // Generate shoot concepts
    const shootConcepts = this.generateShootConcepts(context);

    // Generate visual metaphors
    const visualMetaphors = this.generateVisualMetaphors(context);

    // Generate mood descriptors
    const moodDescriptors = this.generateMoodDescriptors(context);

    // Generate composition rules
    const compositionRules = this.generateCompositionRules(genre);

    return {
      palettes,
      layouts,
      typography,
      references: [],
      moodDescriptors,
      visualMetaphors,
      shootConcepts,
      compositionRules,
    };
  }

  /**
   * Generate color palettes
   */
  private generatePalettes(
    genre: string,
    emotionalArc: any,
    genreProfile: any
  ): ColorPalette[] {
    const palettes: ColorPalette[] = [];

    // Use genre profile palettes if available
    if (genreProfile?.colorPalettes) {
      genreProfile.colorPalettes.forEach((colors: string[], i: number) => {
        palettes.push({
          name: `${genre} ${i + 1}`,
          colors,
          description: `Palette inspired by ${genre} aesthetics`,
          genreAlignment: genre,
        });
      });
    }

    // Add emotional palettes based on dominant emotion
    const dominantEmotion = emotionalArc?.dominantEmotion || 'neutral';
    const emotionalPalette = this.getEmotionalPalette(dominantEmotion);
    if (emotionalPalette) {
      palettes.push(emotionalPalette);
    }

    // Add slate cyan brand palette
    palettes.push({
      name: 'Total Audio Brand',
      colors: ['#3AA9BE', '#1F2937', '#FFFFFF', '#0F172A'],
      description: 'Professional slate cyan palette with dark accents',
      mood: 'professional',
    });

    return palettes;
  }

  /**
   * Get palette based on emotion
   */
  private getEmotionalPalette(emotion: string): ColorPalette | null {
    const emotionPalettes: Record<string, ColorPalette> = {
      energetic: {
        name: 'High Energy',
        colors: ['#EF4444', '#F97316', '#FBBF24', '#1F2937'],
        description: 'Bold, vibrant palette for energetic music',
        mood: 'energetic',
      },
      melancholic: {
        name: 'Melancholic',
        colors: ['#6366F1', '#3B82F6', '#1E293B', '#64748B'],
        description: 'Cool, introspective palette for emotional depth',
        mood: 'melancholic',
      },
      uplifting: {
        name: 'Uplifting',
        colors: ['#FBBF24', '#FDE047', '#A78BFA', '#FFFFFF'],
        description: 'Bright, optimistic palette for positive vibes',
        mood: 'uplifting',
      },
      dark: {
        name: 'Dark & Intense',
        colors: ['#0F172A', '#DC2626', '#78716C', '#E5E7EB'],
        description: 'Moody, dramatic palette for intense music',
        mood: 'dark',
      },
      peaceful: {
        name: 'Peaceful',
        colors: ['#86EFAC', '#3AA9BE', '#E0F2FE', '#F1F5F9'],
        description: 'Calm, serene palette for peaceful music',
        mood: 'peaceful',
      },
    };

    return emotionPalettes[emotion] || null;
  }

  /**
   * Generate layout suggestions
   */
  private generateLayouts(genre: string, genreProfile: any): LayoutSuggestion[] {
    const layouts: LayoutSuggestion[] = [
      {
        name: 'Centered Hero',
        description: 'Artist/title centered with minimal background',
        archetype: 'minimal',
        gridStructure: { columns: 3, rows: 3 },
        placementRules: ['Center element in middle', 'Use thirds for balance'],
      },
      {
        name: 'Asymmetric Split',
        description: 'Bold asymmetric composition with text on one side',
        archetype: 'dynamic',
        gridStructure: { columns: 2, rows: 1 },
        placementRules: ['60/40 split', 'High contrast between sections'],
      },
      {
        name: 'Full Bleed Image',
        description: 'Full frame visual with overlaid typography',
        archetype: 'immersive',
        placementRules: ['Text must have contrast background', 'Use gradient overlays'],
      },
      {
        name: 'Geometric Frame',
        description: 'Geometric shapes framing the main visual',
        archetype: 'structured',
        gridStructure: { columns: 4, rows: 4 },
        placementRules: ['Use sacred geometry', 'Balance negative space'],
      },
    ];

    // Add genre-specific layouts
    if (genreProfile?.visualArchetypes?.includes('minimal')) {
      layouts.push({
        name: 'Ultra Minimal',
        description: 'Maximum negative space, single focal point',
        archetype: 'minimal',
        placementRules: ['One visual element only', '80% negative space'],
      });
    }

    return layouts;
  }

  /**
   * Generate typography suggestions
   */
  private generateTypography(
    genre: string,
    genreProfile: any
  ): TypographySuggestion[] {
    const suggestions: TypographySuggestion[] = [];

    // Modern sans-serif
    suggestions.push({
      headingFont: 'Inter',
      bodyFont: 'Inter',
      accentFont: 'JetBrains Mono',
      description: 'Clean, modern sans-serif for professional aesthetic',
      genreAlignment: 'Electronic',
    });

    // Genre-specific typography
    const genreTypography: Record<string, TypographySuggestion> = {
      Rock: {
        headingFont: 'Impact',
        bodyFont: 'Arial',
        description: 'Bold, condensed fonts for high impact',
        genreAlignment: 'Rock',
      },
      'Hip Hop': {
        headingFont: 'Bebas Neue',
        bodyFont: 'Helvetica',
        description: 'Urban, street-inspired typography',
        genreAlignment: 'Hip Hop',
      },
      Electronic: {
        headingFont: 'Space Grotesk',
        bodyFont: 'Inter',
        description: 'Futuristic, geometric sans-serif',
        genreAlignment: 'Electronic',
      },
      Pop: {
        headingFont: 'Poppins',
        bodyFont: 'Montserrat',
        description: 'Friendly, rounded fonts for accessibility',
        genreAlignment: 'Pop',
      },
    };

    if (genreTypography[genre]) {
      suggestions.push(genreTypography[genre]);
    }

    return suggestions;
  }

  /**
   * Generate shoot concepts
   */
  private generateShootConcepts(context: CreativeContext): string[] {
    const concepts: string[] = [
      'Close-up portrait with dramatic lighting',
      'Environmental portrait in meaningful location',
      'Abstract visual metaphor representing the music',
      'Minimalist composition with single color accent',
      'Collage-style mixed media composition',
      'Vintage film photography aesthetic',
      'High-contrast black and white portrait',
      'Surreal composite with symbolic elements',
    ];

    // Add genre-specific concepts
    const genre = context.artist?.genre || 'Electronic';
    if (genre === 'Electronic') {
      concepts.push(
        'Neon-lit urban nightscape',
        'Abstract geometric patterns and shapes',
        'Futuristic digital glitch aesthetic'
      );
    }

    return concepts;
  }

  /**
   * Generate visual metaphors
   */
  private generateVisualMetaphors(context: CreativeContext): string[] {
    const metaphors: string[] = [];

    // Base metaphors
    metaphors.push(
      'Light breaking through darkness',
      'Reflection and duality',
      'Growth and transformation',
      'Isolation and connection',
      'Time and memory'
    );

    // Emotional arc-based metaphors
    const dominantEmotion = context.emotionalArc?.dominantEmotion;
    if (dominantEmotion === 'energetic') {
      metaphors.push('Explosive energy', 'Motion and momentum', 'Fire and electricity');
    } else if (dominantEmotion === 'melancholic') {
      metaphors.push('Rain and water', 'Empty spaces', 'Fading light');
    }

    return metaphors;
  }

  /**
   * Generate mood descriptors
   */
  private generateMoodDescriptors(context: CreativeContext): string[] {
    const descriptors: string[] = [];

    // From emotional arc
    if (context.emotionalArc) {
      descriptors.push(context.emotionalArc.dominantEmotion);
    }

    // From sonic fingerprint
    if (context.sonicFingerprint) {
      const { energy, valence, acousticness } = context.sonicFingerprint;

      if (energy > 0.7) descriptors.push('energetic', 'dynamic', 'powerful');
      if (energy < 0.3) descriptors.push('calm', 'subdued', 'gentle');

      if (valence > 0.7) descriptors.push('uplifting', 'joyful', 'bright');
      if (valence < 0.3) descriptors.push('melancholic', 'dark', 'introspective');

      if (acousticness > 0.7) descriptors.push('organic', 'natural', 'intimate');
      if (acousticness < 0.3) descriptors.push('electronic', 'synthetic', 'produced');
    }

    return [...new Set(descriptors)]; // Remove duplicates
  }

  /**
   * Generate composition rules
   */
  private generateCompositionRules(genre: string): string[] {
    return [
      'Rule of thirds for focal point placement',
      'Use leading lines to guide the eye',
      'Balance negative space with visual elements',
      'Maintain high contrast for text readability',
      'Consider how the design looks as a small thumbnail',
      'Ensure genre alignment with visual style',
      'Use color psychology to reinforce mood',
      'Typography should be legible at all sizes',
    ];
  }
}

/**
 * Factory function
 */
export const createCoverArtGenerator = (anthropicClient?: any): CoverArtGenerator => {
  return new CoverArtGenerator(anthropicClient);
};

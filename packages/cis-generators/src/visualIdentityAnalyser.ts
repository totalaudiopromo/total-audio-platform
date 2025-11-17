/**
 * Visual Identity Analyser - Analyzes artist profile to create visual identity matrix
 */

import type { CreativeContext } from '@total-audio/cis-core';

export interface VisualIdentityMatrix {
  primaryVisualTheme: string;
  colorDirection: string;
  typographyDirection: string;
  compositionStyle: string;
  moodKeywords: string[];
  visualReferences: string[];
  brandArchetype: string;
  recommendations: string[];
}

export class VisualIdentityAnalyser {
  async analyse(context: CreativeContext): Promise<VisualIdentityMatrix> {
    const genre = context.artist?.genre || 'Electronic';
    const sonic = context.sonicFingerprint;
    const emotional = context.emotionalArc;

    return {
      primaryVisualTheme: this.determinePrimaryTheme(genre, emotional),
      colorDirection: this.determineColorDirection(sonic, emotional),
      typographyDirection: this.determineTypography(genre),
      compositionStyle: this.determineComposition(sonic),
      moodKeywords: this.extractMoodKeywords(context),
      visualReferences: this.suggestReferences(genre),
      brandArchetype: this.determineBrandArchetype(context),
      recommendations: this.generateRecommendations(context),
    };
  }

  private determinePrimaryTheme(genre: string, emotional: any): string {
    const themes: Record<string, string> = {
      Electronic: 'Futuristic minimalism with geometric elements',
      Rock: 'Bold, raw authenticity with gritty textures',
      'Hip Hop': 'Urban confidence with cultural iconography',
      Pop: 'Vibrant accessibility with playful energy',
      Indie: 'Organic intimacy with handcrafted feel',
    };

    return themes[genre] || themes.Electronic;
  }

  private determineColorDirection(sonic: any, emotional: any): string {
    if (!sonic) return 'Balanced complementary palette';

    const { energy, valence } = sonic;

    if (energy > 0.7 && valence > 0.7) {
      return 'High-energy warm palette (oranges, yellows, reds)';
    } else if (energy > 0.7 && valence < 0.3) {
      return 'Intense dark palette (deep reds, blacks, high contrast)';
    } else if (energy < 0.3 && valence > 0.7) {
      return 'Calm uplifting palette (soft blues, greens, pastels)';
    } else if (energy < 0.3 && valence < 0.3) {
      return 'Introspective cool palette (deep blues, purples, grays)';
    }

    return 'Balanced complementary palette';
  }

  private determineTypography(genre: string): string {
    const typography: Record<string, string> = {
      Electronic: 'Geometric sans-serif (Inter, Space Grotesk, DM Sans)',
      Rock: 'Bold condensed fonts (Impact, Bebas Neue, Oswald)',
      'Hip Hop': 'Custom lettering or bold display (Druk, Monument)',
      Pop: 'Friendly rounded sans (Poppins, Montserrat, Quicksand)',
      Indie: 'Organic serif or handwritten (Libre Baskerville, Caveat)',
    };

    return typography[genre] || typography.Electronic;
  }

  private determineComposition(sonic: any): string {
    if (!sonic) return 'Balanced asymmetric composition';

    const { energy } = sonic;

    if (energy > 0.7) {
      return 'Dynamic diagonal composition with motion';
    } else if (energy < 0.3) {
      return 'Calm symmetrical composition with balance';
    }

    return 'Balanced asymmetric composition';
  }

  private extractMoodKeywords(context: CreativeContext): string[] {
    const keywords: string[] = [];

    if (context.emotionalArc) {
      keywords.push(context.emotionalArc.dominantEmotion);
    }

    if (context.sonicFingerprint) {
      const { energy, valence, acousticness } = context.sonicFingerprint;

      if (energy > 0.7) keywords.push('energetic', 'powerful');
      if (energy < 0.3) keywords.push('calm', 'subdued');

      if (valence > 0.7) keywords.push('uplifting', 'positive');
      if (valence < 0.3) keywords.push('introspective', 'dark');

      if (acousticness > 0.7) keywords.push('organic', 'intimate');
      if (acousticness < 0.3) keywords.push('electronic', 'produced');
    }

    if (context.artist?.genre) {
      keywords.push(context.artist.genre.toLowerCase());
    }

    return [...new Set(keywords)];
  }

  private suggestReferences(genre: string): string[] {
    const references: Record<string, string[]> = {
      Electronic: [
        'Arca - experimental visual design',
        'Four Tet - minimal geometric aesthetics',
        'Burial - lo-fi atmospheric visuals',
      ],
      Rock: [
        'Led Zeppelin - classic album art',
        'The Strokes - vintage photography',
        'Queens of the Stone Age - bold graphics',
      ],
      'Hip Hop': [
        'Kendrick Lamar - conceptual storytelling',
        'Tyler, The Creator - bold color blocking',
        'Travis Scott - maximalist design',
      ],
      Pop: [
        'Billie Eilish - unique brand identity',
        'Dua Lipa - retro-modern fusion',
        'The Weeknd - cinematic visuals',
      ],
    };

    return references[genre] || references.Electronic;
  }

  private determineBrandArchetype(context: CreativeContext): string {
    // Simplified brand archetype determination
    const genre = context.artist?.genre || 'Electronic';

    const archetypes: Record<string, string> = {
      Electronic: 'The Innovator - pushing boundaries with future-forward aesthetics',
      Rock: 'The Rebel - authentic and unapologetically bold',
      'Hip Hop': 'The Ruler - confident cultural leadership',
      Pop: 'The Entertainer - accessible joy and connection',
      Indie: 'The Creator - artistic authenticity and craft',
    };

    return archetypes[genre] || archetypes.Electronic;
  }

  private generateRecommendations(context: CreativeContext): string[] {
    return [
      'Maintain visual consistency across all platforms',
      'Use 2-3 primary colors maximum for brand recognition',
      'Ensure all text is legible at thumbnail size',
      'Consider how design looks in both light and dark modes',
      'Test cover art on actual streaming platforms',
      'Keep file organization clean for easy asset access',
      'Document brand guidelines for future reference',
      'Review competitor visual strategies for differentiation',
    ];
  }
}

export const createVisualIdentityAnalyser = (): VisualIdentityAnalyser => {
  return new VisualIdentityAnalyser();
};

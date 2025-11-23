/**
 * Brand Identity Generator - Creates comprehensive brand identity suggestions
 */

import type { CreativeContext, ColorPalette, TypographySuggestion } from '@total-audio/cis-core';

export interface BrandIdentity {
  logoStyles: string[];
  brandPersonality: string[];
  visualArchetypes: string[];
  colorPalettes: ColorPalette[];
  typography: TypographySuggestion[];
  brandVoice: {
    tone: string;
    descriptors: string[];
    doNots: string[];
  };
  applicationExamples: string[];
}

export class BrandIdentityGenerator {
  async generate(context: CreativeContext): Promise<BrandIdentity> {
    const genre = context.artist?.genre || 'Electronic';
    const artistName = context.artist?.name || 'Artist';

    return {
      logoStyles: this.generateLogoStyles(genre),
      brandPersonality: this.generateBrandPersonality(context),
      visualArchetypes: this.generateVisualArchetypes(genre),
      colorPalettes: this.generateBrandPalettes(genre),
      typography: this.generateTypography(genre),
      brandVoice: this.generateBrandVoice(context),
      applicationExamples: this.generateApplications(),
    };
  }

  private generateLogoStyles(genre: string): string[] {
    const universal = [
      'Wordmark (typography-only)',
      'Monogram (initials)',
      'Symbol + wordmark combination',
      'Abstract geometric mark',
    ];

    const genreSpecific: Record<string, string[]> = {
      Electronic: ['Geometric minimalist', 'Futuristic letterform', 'Digital glitch aesthetic'],
      Rock: ['Bold condensed type', 'Hand-drawn rough mark', 'Vintage badge style'],
      'Hip Hop': ['Custom lettering', 'Bold iconic symbol', 'Street art inspired'],
      Pop: ['Playful rounded mark', 'Colorful gradient wordmark', 'Modern sans-serif'],
    };

    return [...universal, ...(genreSpecific[genre] || [])];
  }

  private generateBrandPersonality(context: CreativeContext): string[] {
    const traits = ['Authentic', 'Professional', 'Creative', 'Bold'];

    if (context.sonicFingerprint) {
      const { energy, valence } = context.sonicFingerprint;
      if (energy > 0.7) traits.push('Energetic', 'Dynamic');
      if (valence > 0.7) traits.push('Uplifting', 'Positive');
      if (energy < 0.3) traits.push('Introspective', 'Thoughtful');
    }

    return traits;
  }

  private generateVisualArchetypes(genre: string): string[] {
    const archetypes: Record<string, string[]> = {
      Electronic: ['Futuristic', 'Minimal', 'Geometric', 'Tech-forward'],
      Rock: ['Bold', 'Raw', 'Authentic', 'Gritty'],
      'Hip Hop': ['Urban', 'Confident', 'Cultural', 'Dynamic'],
      Pop: ['Accessible', 'Vibrant', 'Modern', 'Friendly'],
      Indie: ['Organic', 'Handmade', 'Intimate', 'Authentic'],
    };

    return archetypes[genre] || archetypes.Electronic;
  }

  private generateBrandPalettes(genre: string): ColorPalette[] {
    const palettes: ColorPalette[] = [
      {
        name: 'Primary Brand',
        colors: ['#3AA9BE', '#1F2937', '#FFFFFF', '#F1F5F9'],
        description: 'Main brand palette for all touchpoints',
        genreAlignment: genre,
      },
      {
        name: 'Accent Palette',
        colors: ['#6366F1', '#A855F7', '#0F172A'],
        description: 'For highlights and special moments',
        genreAlignment: genre,
      },
    ];

    return palettes;
  }

  private generateTypography(genre: string): TypographySuggestion[] {
    return [
      {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        accentFont: 'JetBrains Mono',
        description: 'Professional, modern sans-serif system',
        genreAlignment: genre,
      },
    ];
  }

  private generateBrandVoice(context: CreativeContext): BrandIdentity['brandVoice'] {
    return {
      tone: 'Authentic, professional, creative',
      descriptors: [
        'Clear and direct',
        'Industry-credible',
        'Passionate about music',
        'Supportive of independent artists',
      ],
      doNots: [
        'Avoid corporate jargon',
        'No forced lowercase aesthetic',
        'No vanity metrics',
        'No false promises',
      ],
    };
  }

  private generateApplications(): string[] {
    return [
      'Social media profile images',
      'Cover art templates',
      'Promotional graphics',
      'Email signatures',
      'Press kit materials',
      'Merchandise designs',
      'Website branding',
      'Streaming platform assets',
    ];
  }
}

export const createBrandIdentityGenerator = (): BrandIdentityGenerator => {
  return new BrandIdentityGenerator();
};

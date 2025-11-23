/**
 * Moodboard Ideas Generator - Visual reference and composition suggestions
 */

import type { CreativeContext, VisualReference } from '@total-audio/cis-core';

export interface MoodboardSuggestions {
  imagePrompts: string[];
  compositions: string[];
  textures: string[];
  cinematicArchetypes: string[];
  references: VisualReference[];
}

export class MoodboardIdeasGenerator {
  async generate(context: CreativeContext): Promise<MoodboardSuggestions> {
    const genre = context.artist?.genre || 'Electronic';
    const emotionalArc = context.emotionalArc;

    return {
      imagePrompts: this.generateImagePrompts(genre, emotionalArc),
      compositions: this.generateCompositions(),
      textures: this.generateTextures(genre),
      cinematicArchetypes: this.generateCinematicArchetypes(genre),
      references: this.generateReferences(context),
    };
  }

  private generateImagePrompts(genre: string, emotionalArc: any): string[] {
    const basePrompts = [
      'Atmospheric urban nightscape with neon reflections',
      'Abstract geometric patterns in motion',
      'Intimate close-up portrait with dramatic lighting',
      'Vintage film photography with grain texture',
      'Minimalist composition with single color accent',
      'Surreal dreamlike landscape',
      'High-contrast black and white portrait',
      'Collage-style mixed media composition',
      'Nature meets technology juxtaposition',
      'Retro-futuristic aesthetic',
    ];

    const genreSpecific: Record<string, string[]> = {
      Electronic: [
        'Digital glitch art aesthetic',
        'Cyberpunk neon cityscape',
        'Sacred geometry and fractals',
        'Liquid chrome and metallic surfaces',
      ],
      Rock: [
        'Gritty industrial textures',
        'Vintage concert posters',
        'Raw, unpolished photography',
        'Bold typography overlays',
      ],
      'Hip Hop': [
        'Urban street photography',
        'Bold graphic design elements',
        'Cultural iconography',
        'Dynamic action shots',
      ],
      Pop: [
        'Vibrant color explosions',
        'Playful surreal compositions',
        'Fashion-forward photography',
        'Maximalist design elements',
      ],
    };

    return [...basePrompts, ...(genreSpecific[genre] || [])].slice(0, 20);
  }

  private generateCompositions(): string[] {
    return [
      'Rule of thirds focal point',
      'Centered symmetrical composition',
      'Asymmetric dynamic balance',
      'Leading lines perspective',
      'Frame within frame technique',
      'Golden ratio spiral',
      'Minimalist negative space',
      'Layered depth of field',
      'Diagonal tension composition',
      'Radial symmetry pattern',
    ];
  }

  private generateTextures(genre: string): string[] {
    const universal = [
      'Film grain overlay',
      'Concrete and urban surfaces',
      'Liquid metal reflections',
      'Fabric and textile close-ups',
      'Natural organic patterns',
      'Glass and transparency',
    ];

    const genreTextures: Record<string, string[]> = {
      Electronic: ['Digital noise', 'Holographic gradients', 'Circuit board patterns'],
      Rock: ['Distressed paper', 'Rust and weathering', 'Spray paint textures'],
      'Hip Hop': ['Brick walls', 'Vinyl records', 'Spray can art'],
      Pop: ['Glossy plastics', 'Candy-colored surfaces', 'Glitter and shine'],
    };

    return [...universal, ...(genreTextures[genre] || [])];
  }

  private generateCinematicArchetypes(genre: string): string[] {
    return [
      'Blade Runner neon noir',
      'Wes Anderson symmetrical framing',
      'Christopher Nolan IMAX scope',
      'Wong Kar-wai saturated color',
      'Terrence Malick natural light',
      'Denis Villeneuve minimalist epic',
      'David Fincher cold precision',
      'Nicolas Winding Refn synthwave',
      'Gaspar Noé psychedelic intensity',
      'Roger Deakins painterly lighting',
    ];
  }

  private generateReferences(context: CreativeContext): VisualReference[] {
    return [
      {
        type: 'composition',
        description: 'Asymmetric balance with strong diagonal',
        relevance: 0.9,
      },
      {
        type: 'color',
        description: 'Complementary color harmony',
        relevance: 0.85,
      },
      {
        type: 'texture',
        description: 'High contrast grain overlay',
        relevance: 0.8,
      },
      {
        type: 'image',
        description: 'Atmospheric environmental portrait',
        relevance: 0.95,
      },
    ];
  }
}

export const createMoodboardIdeasGenerator = (): MoodboardIdeasGenerator => {
  return new MoodboardIdeasGenerator();
};

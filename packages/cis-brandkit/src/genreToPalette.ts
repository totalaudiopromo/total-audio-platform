/**
 * Genre to Palette mappings
 */

export interface GenrePaletteMapping {
  genre: string;
  palettes: Array<{
    name: string;
    colors: string[];
    mood: string;
  }>;
}

export const genrePalettes: GenrePaletteMapping[] = [
  {
    genre: 'Electronic',
    palettes: [
      {
        name: 'Neon Cyber',
        colors: ['#3AA9BE', '#6366F1', '#0F172A', '#FFFFFF'],
        mood: 'futuristic',
      },
      {
        name: 'Dark Techno',
        colors: ['#0F172A', '#DC2626', '#64748B', '#E5E7EB'],
        mood: 'intense',
      },
    ],
  },
  {
    genre: 'Rock',
    palettes: [
      {
        name: 'Classic Rock',
        colors: ['#DC2626', '#000000', '#FFFFFF', '#FBBF24'],
        mood: 'bold',
      },
      {
        name: 'Grunge',
        colors: ['#78716C', '#1C1917', '#A8A29E', '#FEF3C7'],
        mood: 'gritty',
      },
    ],
  },
  {
    genre: 'Hip Hop',
    palettes: [
      {
        name: 'Golden Era',
        colors: ['#FBBF24', '#000000', '#FFFFFF', '#DC2626'],
        mood: 'bold',
      },
      {
        name: 'Modern Trap',
        colors: ['#EF4444', '#1F2937', '#FCD34D', '#0F172A'],
        mood: 'dynamic',
      },
    ],
  },
  {
    genre: 'Pop',
    palettes: [
      {
        name: 'Pop Vibrant',
        colors: ['#EC4899', '#3B82F6', '#FBBF24', '#FFFFFF'],
        mood: 'energetic',
      },
      {
        name: 'Pop Pastel',
        colors: ['#F472B6', '#A78BFA', '#FDE047', '#FECACA'],
        mood: 'playful',
      },
    ],
  },
];

export const getPalettesByGenre = (genre: string) => {
  const match = genrePalettes.find((gp) => gp.genre === genre);
  return match?.palettes || genrePalettes[0].palettes;
};

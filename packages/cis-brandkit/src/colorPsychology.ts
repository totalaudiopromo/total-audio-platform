/**
 * Color psychology mappings for music marketing
 */

export interface ColorMeaning {
  color: string;
  emotions: string[];
  genres: string[];
  usage: string;
}

export const colorPsychology: ColorMeaning[] = [
  { color: '#DC2626', emotions: ['energy', 'passion', 'intensity'], genres: ['Rock', 'Hip Hop'], usage: 'Attention-grabbing accents' },
  { color: '#3AA9BE', emotions: ['trust', 'calm', 'professional'], genres: ['Electronic', 'Pop'], usage: 'Primary brand color' },
  { color: '#FBBF24', emotions: ['optimism', 'creativity', 'warmth'], genres: ['Pop', 'Hip Hop'], usage: 'Uplifting highlights' },
  { color: '#6366F1', emotions: ['creativity', 'imagination', 'mystery'], genres: ['Electronic', 'Indie'], usage: 'Artistic expression' },
  { color: '#000000', emotions: ['sophistication', 'power', 'drama'], genres: ['Rock', 'Electronic'], usage: 'Bold contrast' },
  { color: '#FFFFFF', emotions: ['purity', 'simplicity', 'clarity'], genres: ['All'], usage: 'Clean backgrounds' },
];

export const getColorsByEmotion = (emotion: string) => {
  return colorPsychology.filter(cp => cp.emotions.includes(emotion));
};

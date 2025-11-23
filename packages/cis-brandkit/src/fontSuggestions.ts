/**
 * Font suggestions by genre and style
 */

export interface FontSuggestion {
  category: 'heading' | 'body' | 'accent';
  fontFamily: string;
  description: string;
  genreAlignment: string[];
  googleFonts?: boolean;
}

export const fontSuggestions: FontSuggestion[] = [
  // Sans-serif modern
  { category: 'heading', fontFamily: 'Inter', description: 'Clean modern sans', genreAlignment: ['Electronic', 'Pop'], googleFonts: true },
  { category: 'heading', fontFamily: 'Space Grotesk', description: 'Geometric futuristic', genreAlignment: ['Electronic'], googleFonts: true },
  { category: 'heading', fontFamily: 'Poppins', description: 'Friendly rounded', genreAlignment: ['Pop'], googleFonts: true },
  
  // Bold display
  { category: 'heading', fontFamily: 'Bebas Neue', description: 'Bold condensed', genreAlignment: ['Hip Hop', 'Rock'], googleFonts: true },
  { category: 'heading', fontFamily: 'Oswald', description: 'Strong condensed', genreAlignment: ['Rock'], googleFonts: true },
  
  // Monospace
  { category: 'accent', fontFamily: 'JetBrains Mono', description: 'Technical monospace', genreAlignment: ['Electronic'], googleFonts: true },
  { category: 'accent', fontFamily: 'Roboto Mono', description: 'Clean monospace', genreAlignment: ['Electronic', 'Hip Hop'], googleFonts: true },
  
  // Body text
  { category: 'body', fontFamily: 'Inter', description: 'Versatile body text', genreAlignment: ['Electronic', 'Pop', 'Rock'], googleFonts: true },
  { category: 'body', fontFamily: 'Montserrat', description: 'Geometric sans body', genreAlignment: ['Pop'], googleFonts: true },
];

export const getFontsByGenre = (genre: string) => {
  return fontSuggestions.filter(f => f.genreAlignment.includes(genre));
};

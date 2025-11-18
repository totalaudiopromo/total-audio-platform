/**
 * OperatorOS Theme System
 *
 * Multiple themes for the cinematic OS experience.
 * Each theme defines window chrome, colours, shadows, and feel.
 *
 * Themes:
 * - xp: Windows XP inspired (playful but tasteful)
 * - aqua: macOS Aqua inspired (glossy, translucent)
 * - daw: DAW/audio workstation inspired (pro audio aesthetic)
 * - ascii: Terminal/ASCII art inspired (monospace, retro)
 * - analogue: Vintage hardware inspired (warm, tactile)
 */

export interface Theme {
  id: string;
  name: string;
  windowChrome: {
    background: string;
    border: string;
    titleBar: string;
    titleBarText: string;
    shadow: string;
  };
  colors: {
    background: string;
    foreground: string;
    accent: string;
    border: string;
    muted: string;
  };
  effects: {
    grain?: boolean;
    noise?: boolean;
    blur?: boolean;
  };
}

export const themes: Record<string, Theme> = {
  xp: {
    id: 'xp',
    name: 'XP',
    windowChrome: {
      background: 'linear-gradient(180deg, #F0F0F0 0%, #D8D8D8 100%)',
      border: '#0054E3',
      titleBar: 'linear-gradient(180deg, #0058E7 0%, #3A8BFF 100%)',
      titleBarText: '#FFFFFF',
      shadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    },
    colors: {
      background: '#ECE9D8',
      foreground: '#000000',
      accent: '#0054E3',
      border: '#ACA899',
      muted: '#FFFFFF',
    },
    effects: {
      grain: false,
      noise: false,
      blur: false,
    },
  },

  aqua: {
    id: 'aqua',
    name: 'Aqua',
    windowChrome: {
      background: 'rgba(245, 245, 247, 0.85)',
      border: 'rgba(0, 0, 0, 0.1)',
      titleBar: 'rgba(235, 235, 237, 0.9)',
      titleBarText: '#1D1D1F',
      shadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
    colors: {
      background: 'rgba(255, 255, 255, 0.8)',
      foreground: '#1D1D1F',
      accent: '#007AFF',
      border: 'rgba(0, 0, 0, 0.1)',
      muted: 'rgba(0, 0, 0, 0.5)',
    },
    effects: {
      grain: false,
      noise: false,
      blur: true,
    },
  },

  daw: {
    id: 'daw',
    name: 'DAW',
    windowChrome: {
      background: '#2A2A2A',
      border: '#1A1A1A',
      titleBar: '#1E1E1E',
      titleBarText: '#CCCCCC',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
    },
    colors: {
      background: '#1E1E1E',
      foreground: '#CCCCCC',
      accent: '#3AA9BE', // Slate cyan
      border: '#3A3A3A',
      muted: '#666666',
    },
    effects: {
      grain: false,
      noise: false,
      blur: false,
    },
  },

  ascii: {
    id: 'ascii',
    name: 'ASCII',
    windowChrome: {
      background: '#000000',
      border: '#00FF00',
      titleBar: '#000000',
      titleBarText: '#00FF00',
      shadow: 'none',
    },
    colors: {
      background: '#000000',
      foreground: '#00FF00',
      accent: '#00FF00',
      border: '#00FF00',
      muted: '#008000',
    },
    effects: {
      grain: true,
      noise: false,
      blur: false,
    },
  },

  analogue: {
    id: 'analogue',
    name: 'Analogue',
    windowChrome: {
      background: 'linear-gradient(180deg, #3E2723 0%, #2C1810 100%)',
      border: '#5D4037',
      titleBar: '#4E342E',
      titleBarText: '#EFEBE9',
      shadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
    },
    colors: {
      background: '#1C1410',
      foreground: '#EFEBE9',
      accent: '#FF6F00',
      border: '#5D4037',
      muted: '#8D6E63',
    },
    effects: {
      grain: true,
      noise: true,
      blur: false,
    },
  },
};

export type ThemeId = keyof typeof themes;

export function getTheme(id: ThemeId): Theme {
  return themes[id];
}

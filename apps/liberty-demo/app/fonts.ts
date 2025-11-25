import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';

// Plus Jakarta Sans (Variable Font) - Using Google Fonts for easier management
export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

// Inter — body
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Mono — metadata + numbers
export const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

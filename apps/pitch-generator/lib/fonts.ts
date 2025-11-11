/**
 * Font configuration with CI/CD resilience
 * Uses system fonts to avoid Google Fonts fetch failures in CI
 */

// Simple font configuration using CSS variables
// Falls back to system fonts - no external fetching required
export const geistSans = {
  variable: '--font-sans',
  className: 'font-sans'
};

export const geistMono = {
  variable: '--font-mono',
  className: 'font-mono'
};

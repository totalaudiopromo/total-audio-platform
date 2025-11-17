/**
 * Brand rules and guidelines
 */

export interface BrandRule {
  category: 'color' | 'typography' | 'layout' | 'general';
  rule: string;
  rationale: string;
}

export const brandRules: BrandRule[] = [
  {
    category: 'color',
    rule: 'Use maximum 3 primary colors in any design',
    rationale: 'Maintains visual clarity and brand recognition',
  },
  {
    category: 'color',
    rule: 'Ensure 4.5:1 contrast ratio for text',
    rationale: 'WCAG AA accessibility compliance',
  },
  {
    category: 'typography',
    rule: 'Limit to 2 font families maximum',
    rationale: 'Maintains professional cohesion',
  },
  {
    category: 'typography',
    rule: 'Minimum 14px for body text',
    rationale: 'Ensures readability across devices',
  },
  {
    category: 'layout',
    rule: 'Test all designs at 300x300px thumbnail size',
    rationale: 'Cover art must work on streaming platforms',
  },
  {
    category: 'layout',
    rule: 'Maintain 10% safe margin on all edges',
    rationale: 'Prevents text/elements from being cut off',
  },
  {
    category: 'general',
    rule: 'Keep brand consistency across all platforms',
    rationale: 'Builds recognition and professionalism',
  },
  {
    category: 'general',
    rule: 'Avoid trendy effects that date quickly',
    rationale: 'Ensures longevity of visual identity',
  },
];

export const getRulesByCategory = (category: BrandRule['category']) => {
  return brandRules.filter((rule) => rule.category === category);
};

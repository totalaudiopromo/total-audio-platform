/**
 * Layout templates for cover art and brand materials
 */

export interface LayoutTemplate {
  name: string;
  description: string;
  gridStructure: { columns: number; rows: number };
  zones: Array<{ name: string; position: string }>;
  bestFor: string[];
}

export const layoutTemplates: LayoutTemplate[] = [
  {
    name: 'Centered Hero',
    description: 'Single focal point centered',
    gridStructure: { columns: 3, rows: 3 },
    zones: [
      { name: 'Hero', position: 'center' },
      { name: 'Text', position: 'bottom-third' },
    ],
    bestFor: ['minimal', 'portrait', 'logo-focused'],
  },
  {
    name: 'Split Screen',
    description: 'Two equal halves',
    gridStructure: { columns: 2, rows: 1 },
    zones: [
      { name: 'Visual', position: 'left' },
      { name: 'Text/Color', position: 'right' },
    ],
    bestFor: ['bold', 'typographic', 'contrast'],
  },
  {
    name: 'Full Bleed',
    description: 'Edge-to-edge visual',
    gridStructure: { columns: 1, rows: 1 },
    zones: [
      { name: 'Background', position: 'full' },
      { name: 'Overlay Text', position: 'overlay' },
    ],
    bestFor: ['photographic', 'immersive', 'atmospheric'],
  },
];

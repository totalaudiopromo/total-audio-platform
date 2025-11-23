/**
 * PaletteExporter tests
 */

import { describe, it, expect } from '@jest/globals';
import { PaletteExporter } from '../src/exportPalette';

describe('PaletteExporter', () => {
  it('should export palette to JSON', () => {
    const exporter = new PaletteExporter();
    const palette = {
      name: 'Test Palette',
      colors: ['#3AA9BE', '#1F2937', '#FFFFFF'],
    };

    const json = exporter.exportToJSON(palette);
    expect(json).toContain('Test Palette');
    expect(json).toContain('#3AA9BE');
  });

  it('should export palette to CSS', () => {
    const exporter = new PaletteExporter();
    const palette = {
      name: 'Test Palette',
      colors: ['#3AA9BE', '#1F2937'],
    };

    const css = exporter.exportToCSS(palette);
    expect(css).toContain(':root');
    expect(css).toContain('--test-palette');
    expect(css).toContain('#3AA9BE');
  });
});

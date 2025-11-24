/**
 * Palette export (JSON/CSS) functionality
 */

import type { ColorPalette } from '@total-audio/cis-core';

export class PaletteExporter {
  exportToJSON(palette: ColorPalette): string {
    return JSON.stringify(palette, null, 2);
  }

  exportToCSS(palette: ColorPalette): string {
    const paletteName = palette.name.toLowerCase().replace(/\s+/g, '-');
    let css = `:root {\n`;
    palette.colors.forEach((color, i) => {
      css += `  --${paletteName}-${i + 1}: ${color};\n`;
    });
    css += `}\n`;
    return css;
  }

  exportToTailwind(palette: ColorPalette): string {
    const paletteName = palette.name.toLowerCase().replace(/\s+/g, '-');
    const colors = palette.colors.reduce((acc, color, i) => {
      acc[`${i + 1}00`] = color;
      return acc;
    }, {} as Record<string, string>);

    return `'${paletteName}': ${JSON.stringify(colors, null, 2)}`;
  }

  async exportToFile(palette: ColorPalette, format: 'json' | 'css' | 'tailwind' = 'json'): Promise<File> {
    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'css':
        content = this.exportToCSS(palette);
        mimeType = 'text/css';
        extension = 'css';
        break;
      case 'tailwind':
        content = this.exportToTailwind(palette);
        mimeType = 'text/plain';
        extension = 'js';
        break;
      default:
        content = this.exportToJSON(palette);
        mimeType = 'application/json';
        extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
    return new File([blob], filename, { type: mimeType });
  }
}

export const createPaletteExporter = (): PaletteExporter => {
  return new PaletteExporter();
};

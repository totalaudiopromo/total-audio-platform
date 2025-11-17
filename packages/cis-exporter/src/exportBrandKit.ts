/**
 * Brand Kit Advanced Exports - Figma JSON, CSS Vars, Notion
 */

import type { ColorPalette } from '@total-audio/cis-core';

export class BrandKitExporter {
  async exportToFigmaJSON(brandKit: {
    palettes: ColorPalette[];
    typography?: any[];
    logos?: any[];
  }): Promise<string> {
    const figmaDoc = {
      name: 'Brand Kit',
      type: 'FILE',
      children: [
        {
          name: 'Colors',
          type: 'PAGE',
          children: brandKit.palettes.map((palette, i) => ({
            name: palette.name,
            type: 'FRAME',
            fills: palette.colors.map(color => ({
              type: 'SOLID',
              color: this.hexToRGB(color),
            })),
          })),
        },
      ],
    };

    return JSON.stringify(figmaDoc, null, 2);
  }

  async exportToCSSVars(brandKit: {
    palettes: ColorPalette[];
    typography?: any[];
  }): Promise<string> {
    let css = ':root {\n';
    css += '  /* Brand Colors */\n';

    brandKit.palettes.forEach((palette, i) => {
      const paletteName = palette.name.toLowerCase().replace(/\s+/g, '-');
      palette.colors.forEach((color, j) => {
        css += `  --${paletteName}-${j + 1}: ${color};\n`;
      });
    });

    if (brandKit.typography) {
      css += '\n  /* Typography */\n';
      brandKit.typography.forEach((typo: any, i: number) => {
        css += `  --font-heading-${i + 1}: '${typo.headingFont}';\n`;
        css += `  --font-body-${i + 1}: '${typo.bodyFont}';\n`;
      });
    }

    css += '}\n';
    return css;
  }

  async exportToNotionMarkdown(brandKit: {
    name?: string;
    palettes: ColorPalette[];
    typography?: any[];
    guidelines?: string[];
  }): Promise<string> {
    let md = `# ${brandKit.name || 'Brand Kit'}\n\n`;

    md += '## Color Palettes\n\n';
    brandKit.palettes.forEach(palette => {
      md += `### ${palette.name}\n\n`;
      if (palette.description) {
        md += `${palette.description}\n\n`;
      }
      palette.colors.forEach((color, i) => {
        md += `- **Color ${i + 1}**: \`${color}\`\n`;
      });
      md += '\n';
    });

    if (brandKit.typography) {
      md += '## Typography\n\n';
      brandKit.typography.forEach((typo: any, i: number) => {
        md += `### System ${i + 1}\n\n`;
        md += `- **Heading**: ${typo.headingFont}\n`;
        md += `- **Body**: ${typo.bodyFont}\n`;
        if (typo.description) {
          md += `- **Usage**: ${typo.description}\n`;
        }
        md += '\n';
      });
    }

    if (brandKit.guidelines) {
      md += '## Brand Guidelines\n\n';
      brandKit.guidelines.forEach(guideline => {
        md += `- ${guideline}\n`;
      });
    }

    return md;
  }

  private hexToRGB(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0, g: 0, b: 0 };

    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    };
  }
}

export const createBrandKitExporter = (): BrandKitExporter => {
  return new BrandKitExporter();
};

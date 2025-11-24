/**
 * BrandKitCanvas - Brand kit builder
 */

import React from 'react';
import { PalettePreview } from '@total-audio/cis-ui';
import type { ColorPalette } from '@total-audio/cis-core';

export interface BrandKitCanvasProps {
  projectId: string;
  palettes?: ColorPalette[];
  typography?: any[];
}

export const BrandKitCanvas: React.FC<BrandKitCanvasProps> = ({
  palettes = [],
  typography = [],
}) => {
  return (
    <div className="p-6 space-y-6">
      <section>
        <h2 className="text-white text-xl font-semibold mb-4">Color Palettes</h2>
        <div className="grid grid-cols-2 gap-4">
          {palettes.map((palette, i) => (
            <PalettePreview key={i} palette={palette} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-white text-xl font-semibold mb-4">Typography</h2>
        <div className="space-y-4">
          {typography.map((typo, i) => (
            <div key={i} className="bg-[#1F2937] p-4 rounded-xl text-white">
              <div className="text-sm text-gray-400">Heading</div>
              <div className="text-2xl font-bold">{typo.headingFont}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

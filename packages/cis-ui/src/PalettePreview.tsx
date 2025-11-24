/**
 * PalettePreview - Display full color palette
 */

import React from 'react';
import { ColorSwatch } from './ColorSwatch';
import type { ColorPalette } from '@total-audio/cis-core';

export interface PalettePreviewProps {
  palette: ColorPalette;
  onClick?: (palette: ColorPalette) => void;
  selected?: boolean;
}

export const PalettePreview: React.FC<PalettePreviewProps> = ({
  palette,
  onClick,
  selected = false,
}) => {
  return (
    <div
      onClick={() => onClick?.(palette)}
      className={`rounded-2xl bg-[#1F2937] p-4 transition-all duration-240 ${
        onClick ? 'cursor-pointer hover:bg-[#374151]' : ''
      } ${selected ? 'ring-2 ring-[#3AA9BE]' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-white">{palette.name}</h4>
        {palette.mood && (
          <span className="text-xs text-gray-400">{palette.mood}</span>
        )}
      </div>
      <div className="flex gap-2 mb-2">
        {palette.colors.map((color, i) => (
          <ColorSwatch key={i} color={color} size="sm" showHex={false} />
        ))}
      </div>
      {palette.description && (
        <p className="text-xs text-gray-500 mt-2">{palette.description}</p>
      )}
    </div>
  );
};

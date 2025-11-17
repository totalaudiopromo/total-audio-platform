/**
 * MoodboardCanvas - Grid-based moodboard creator
 */

import React from 'react';
import type { CISElement } from '@total-audio/cis-core';

export interface MoodboardCanvasProps {
  projectId: string;
  elements: CISElement[];
}

export const MoodboardCanvas: React.FC<MoodboardCanvasProps> = ({
  elements,
}) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4">
        {elements.map((element) => (
          <div
            key={element.id}
            className="aspect-square bg-[#1F2937] rounded-xl overflow-hidden"
          >
            {element.elementType === 'image' && (
              <img
                src={element.content.url}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

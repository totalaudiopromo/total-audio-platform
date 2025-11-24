/**
 * LayerList - Display and manage canvas layers
 */

import React from 'react';
import type { CISElement } from '@total-audio/cis-core';

export interface LayerListProps {
  elements: CISElement[];
  onSelect?: (element: CISElement) => void;
  onDelete?: (elementId: string) => void;
  onReorder?: (updates: Array<{ id: string; ordering: number }>) => void;
  selectedId?: string;
}

export const LayerList: React.FC<LayerListProps> = ({
  elements,
  onSelect,
  onDelete,
  selectedId,
}) => {
  return (
    <div className="space-y-2">
      {elements.map((element) => (
        <div
          key={element.id}
          onClick={() => onSelect?.(element)}
          className={`rounded-lg bg-[#374151] p-3 cursor-pointer transition-all duration-240 hover:bg-[#4B5563] ${
            selectedId === element.id ? 'ring-2 ring-[#3AA9BE]' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-white capitalize">{element.elementType}</span>
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

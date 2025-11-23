/**
 * CoverArtCanvas - Canvas for cover art creation
 */

import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import type { CISElement, CreateElementInput, UpdateElementInput } from '@total-audio/cis-core';
import { LayerList } from '@total-audio/cis-ui';

export interface CoverArtCanvasProps {
  projectId: string;
  elements: CISElement[];
  onElementCreate?: (input: CreateElementInput) => void;
  onElementUpdate?: (id: string, input: UpdateElementInput) => void;
  onElementDelete?: (id: string) => void;
}

export const CoverArtCanvas: React.FC<CoverArtCanvasProps> = ({
  projectId,
  elements,
  onElementCreate,
  onElementUpdate,
  onElementDelete,
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const element = elements.find((el) => el.id === active.id);

    if (element && onElementUpdate) {
      const newPosition = {
        ...element.position,
        x: element.position.x + delta.x,
        y: element.position.y + delta.y,
      };

      onElementUpdate(element.id, { position: newPosition });
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Left Sidebar - Tools & Layers */}
      <div className="w-64 bg-[#0F172A] p-4 rounded-2xl">
        <h3 className="text-white font-semibold mb-4">Layers</h3>
        <LayerList
          elements={elements}
          selectedId={selectedElementId || undefined}
          onSelect={(el) => setSelectedElementId(el.id)}
          onDelete={onElementDelete}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 bg-[#1F2937] rounded-2xl p-4">
        <DndContext onDragEnd={handleDragEnd}>
          <div
            className="relative w-full aspect-square max-w-3xl mx-auto bg-white rounded-xl overflow-hidden"
            style={{ maxHeight: '600px' }}
          >
            {elements.map((element) => (
              <div
                key={element.id}
                className={`absolute cursor-move ${
                  selectedElementId === element.id ? 'ring-2 ring-[#3AA9BE]' : ''
                }`}
                style={{
                  left: `${element.position.x}px`,
                  top: `${element.position.y}px`,
                  width: `${element.position.w}px`,
                  height: `${element.position.h}px`,
                }}
                onClick={() => setSelectedElementId(element.id)}
              >
                {element.elementType === 'color' && (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: element.content.color }}
                  />
                )}
                {element.elementType === 'text' && (
                  <div className="text-black p-2 font-bold">
                    {element.content.text}
                  </div>
                )}
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
        </DndContext>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 bg-[#0F172A] p-4 rounded-2xl">
        <h3 className="text-white font-semibold mb-4">Properties</h3>
        {selectedElementId && (
          <div className="text-gray-400 text-sm">
            Element properties would go here
          </div>
        )}
      </div>
    </div>
  );
};

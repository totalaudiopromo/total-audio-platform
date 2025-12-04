'use client';

import { LayoutGrid, TableProperties } from 'lucide-react';

export type ViewMode = 'table' | 'cards';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  disabled?: boolean;
}

export function ViewToggle({
  viewMode,
  onViewChange,
  disabled,
}: ViewToggleProps) {
  if (disabled) return null;

  return (
    <div className="flex items-center gap-1 bg-white rounded-xl border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <button
        onClick={() => onViewChange('table')}
        className={`p-2 rounded-lg transition-all ${
          viewMode === 'table'
            ? 'bg-teal-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            : 'hover:bg-gray-50 border-2 border-transparent'
        }`}
        title="Table view"
        aria-label="Switch to table view"
        aria-pressed={viewMode === 'table'}
      >
        <TableProperties className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange('cards')}
        className={`p-2 rounded-lg transition-all ${
          viewMode === 'cards'
            ? 'bg-teal-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            : 'hover:bg-gray-50 border-2 border-transparent'
        }`}
        title="Card view"
        aria-label="Switch to card view"
        aria-pressed={viewMode === 'cards'}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}

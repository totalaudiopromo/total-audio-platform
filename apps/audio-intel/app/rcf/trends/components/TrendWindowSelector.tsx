/**
 * Trend Window Selector Component
 * Allows switching between different time windows (1h, 6h, 24h, 7d, 30d)
 */

'use client';

import type { TrendWindow } from '@total-audio/rcf/trends';

interface TrendWindowSelectorProps {
  selected: TrendWindow;
  onChange: (window: TrendWindow) => void;
}

const WINDOWS: { value: TrendWindow; label: string }[] = [
  { value: '1h', label: '1 Hour' },
  { value: '6h', label: '6 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

export function TrendWindowSelector({ selected, onChange }: TrendWindowSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-slate-400 font-mono">Window:</span>
      <div className="flex space-x-1">
        {WINDOWS.map((window) => (
          <button
            key={window.value}
            onClick={() => onChange(window.value)}
            className={`
              px-4 py-2 text-sm font-medium font-mono rounded-lg
              transition-all duration-240 ease-out
              ${
                selected === window.value
                  ? 'bg-[#3AA9BE] text-white shadow-lg shadow-[#3AA9BE]/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }
            `}
          >
            {window.label}
          </button>
        ))}
      </div>
    </div>
  );
}

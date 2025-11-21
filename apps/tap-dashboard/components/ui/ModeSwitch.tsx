'use client';

import clsx from 'clsx';

export type DashboardMode = 'campaign' | 'contact' | 'scene' | 'creative' | 'performance' | 'team';

interface ModeSwitchProps {
  currentMode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
}

const MODES: { id: DashboardMode; label: string; icon: string }[] = [
  { id: 'campaign', label: 'campaign', icon: '🚀' },
  { id: 'contact', label: 'contact', icon: '👥' },
  { id: 'scene', label: 'scene', icon: '🎯' },
  { id: 'creative', label: 'creative', icon: '🎨' },
  { id: 'performance', label: 'performance', icon: '📊' },
  { id: 'team', label: 'team', icon: '👔' },
];

export function ModeSwitch({ currentMode, onModeChange }: ModeSwitchProps) {
  return (
    <div className="flex gap-2 bg-postcraft-gray-50 p-2 rounded-xl border-3 border-postcraft-black shadow-brutal">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={clsx(
            'px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-150 border-2',
            {
              'bg-postcraft-blue text-postcraft-white border-postcraft-black shadow-brutal-sm': currentMode === mode.id,
              'text-postcraft-gray-700 hover:text-postcraft-black hover:bg-postcraft-white border-postcraft-gray-200': currentMode !== mode.id,
            }
          )}
        >
          <span className="mr-2">{mode.icon}</span>
          {mode.label}
        </button>
      ))}
    </div>
  );
}

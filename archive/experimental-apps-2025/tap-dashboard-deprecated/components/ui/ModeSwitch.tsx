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
    <div className="flex gap-2 bg-tap-black/50 p-2 rounded-tap">
      {MODES.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium lowercase transition-all duration-180',
            {
              'bg-tap-cyan text-tap-black': currentMode === mode.id,
              'text-tap-grey hover:text-tap-white hover:bg-tap-panel': currentMode !== mode.id,
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

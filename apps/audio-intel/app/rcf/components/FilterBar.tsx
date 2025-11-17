/**
 * Filter Bar Component
 *
 * Filter events by type, artist, scene, etc.
 */

'use client';

import type { RCFEventType } from '@total-audio/rcf/types';

interface FilterBarProps {
  selectedTypes: RCFEventType[];
  onTypesChange: (types: RCFEventType[]) => void;
}

const EVENT_TYPE_GROUPS = {
  Coverage: [
    { value: 'playlist_add' as RCFEventType, label: 'Playlist', icon: '🎵' },
    { value: 'press_feature' as RCFEventType, label: 'Press', icon: '📰' },
    { value: 'radio_spin' as RCFEventType, label: 'Radio', icon: '📻' },
    { value: 'blog_post' as RCFEventType, label: 'Blog', icon: '✍️' },
  ],
  Scenes: [
    { value: 'scene_pulse_change' as RCFEventType, label: 'Pulse', icon: '📊' },
    { value: 'scene_trend_spike' as RCFEventType, label: 'Trend', icon: '📈' },
  ],
  Network: [{ value: 'mig_connection' as RCFEventType, label: 'MIG', icon: '🔗' }],
  Campaigns: [
    { value: 'campaign_event' as RCFEventType, label: 'Campaign', icon: '🎯' },
    { value: 'tracker_event' as RCFEventType, label: 'Tracker', icon: '📋' },
    { value: 'autopilot_event' as RCFEventType, label: 'Autopilot', icon: '🤖' },
  ],
  Signals: [
    { value: 'coverage_spike' as RCFEventType, label: 'Spike', icon: '🚀' },
    { value: 'creative_breakthrough' as RCFEventType, label: 'Creative', icon: '💡' },
  ],
};

export function FilterBar({ selectedTypes, onTypesChange }: FilterBarProps) {
  function toggleType(type: RCFEventType) {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  }

  function toggleGroup(group: RCFEventType[]) {
    const allSelected = group.every((type) => selectedTypes.includes(type));
    if (allSelected) {
      // Deselect all in group
      onTypesChange(selectedTypes.filter((t) => !group.includes(t)));
    } else {
      // Select all in group
      const newTypes = [...selectedTypes];
      group.forEach((type) => {
        if (!newTypes.includes(type)) {
          newTypes.push(type);
        }
      });
      onTypesChange(newTypes);
    }
  }

  function clearAll() {
    onTypesChange([]);
  }

  return (
    <div className="space-y-3">
      {/* Quick actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-400">Filter by Type</div>
        {selectedTypes.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-[#3AA9BE] hover:text-[#3AA9BE]/80"
          >
            Clear All ({selectedTypes.length})
          </button>
        )}
      </div>

      {/* Filter groups */}
      <div className="space-y-2">
        {Object.entries(EVENT_TYPE_GROUPS).map(([groupName, types]) => {
          const allSelected = types.every((type) => selectedTypes.includes(type.value));
          const someSelected = types.some((type) => selectedTypes.includes(type.value));

          return (
            <div key={groupName} className="space-y-2">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(types.map((t) => t.value))}
                className="flex items-center space-x-2 text-xs font-medium text-slate-500 hover:text-slate-300"
              >
                <span
                  className={`h-3 w-3 rounded border transition-colors ${
                    allSelected
                      ? 'border-[#3AA9BE] bg-[#3AA9BE]'
                      : someSelected
                      ? 'border-[#3AA9BE] bg-[#3AA9BE]/50'
                      : 'border-slate-600'
                  }`}
                />
                <span>{groupName}</span>
              </button>

              {/* Type filters */}
              <div className="flex flex-wrap gap-2 pl-5">
                {types.map((type) => {
                  const isSelected = selectedTypes.includes(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => toggleType(type.value)}
                      className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all ${
                        isSelected
                          ? 'border-[#3AA9BE] bg-[#3AA9BE]/20 text-[#3AA9BE]'
                          : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

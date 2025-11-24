/**
 * Rule Form Component
 * Create or edit ingestion rules
 */

'use client';

import { useState } from 'react';
import type { RCFRule } from '@total-audio/rcf/rules';

interface RuleFormProps {
  initialRule?: RCFRule;
  onSubmit: (rule: Partial<RCFRule>) => void;
  onCancel?: () => void;
}

export function RuleForm({ initialRule, onSubmit, onCancel }: RuleFormProps) {
  const [ruleType, setRuleType] = useState<'block' | 'weight'>(
    initialRule?.rule_type || 'block'
  );
  const [priority, setPriority] = useState(initialRule?.priority ?? 100);
  const [isActive, setIsActive] = useState(initialRule?.is_active ?? true);

  // Conditions
  const [sourcePattern, setSourcePattern] = useState(
    initialRule?.conditions?.source_pattern || ''
  );
  const [eventType, setEventType] = useState(initialRule?.conditions?.event_type || '');
  const [artistSlug, setArtistSlug] = useState(initialRule?.conditions?.artist_slug || '');
  const [sceneSlug, setSceneSlug] = useState(initialRule?.conditions?.scene_slug || '');

  // Actions
  const [weightMultiplier, setWeightMultiplier] = useState(
    initialRule?.actions?.weight_multiplier ?? 1.0
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const rule: Partial<RCFRule> = {
      rule_type: ruleType,
      priority,
      is_active: isActive,
      conditions: {
        ...(sourcePattern && { source_pattern: sourcePattern }),
        ...(eventType && { event_type: eventType }),
        ...(artistSlug && { artist_slug: artistSlug }),
        ...(sceneSlug && { scene_slug: sceneSlug }),
      },
      actions:
        ruleType === 'block'
          ? { block: true }
          : { weight_multiplier: weightMultiplier },
    };

    onSubmit(rule);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rule Type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 font-mono">
          Rule Type
        </label>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setRuleType('block')}
            className={`
              flex-1 px-4 py-3 rounded-lg text-sm font-medium font-mono
              transition-all duration-240 ease-out
              ${
                ruleType === 'block'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }
            `}
          >
            🚫 Block Source
          </button>
          <button
            type="button"
            onClick={() => setRuleType('weight')}
            className={`
              flex-1 px-4 py-3 rounded-lg text-sm font-medium font-mono
              transition-all duration-240 ease-out
              ${
                ruleType === 'weight'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }
            `}
          >
            ⚖️ Modify Weight
          </button>
        </div>
      </div>

      {/* Priority & Active Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 font-mono">
            Priority
          </label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            min="0"
            max="1000"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono focus:border-[#3AA9BE] focus:outline-none"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-[#3AA9BE] focus:ring-[#3AA9BE] focus:ring-offset-0"
            />
            <span className="text-sm text-slate-300 font-mono">Active</span>
          </label>
        </div>
      </div>

      {/* Conditions Section */}
      <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200">Conditions</h3>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 font-mono">
            Source Pattern (optional)
          </label>
          <input
            type="text"
            value={sourcePattern}
            onChange={(e) => setSourcePattern(e.target.value)}
            placeholder="e.g., spammy-blog, low-quality-*"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:border-[#3AA9BE] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 font-mono">
            Event Type (optional)
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:border-[#3AA9BE] focus:outline-none"
          >
            <option value="">All event types</option>
            <option value="playlist_add">Playlist Add</option>
            <option value="press_feature">Press Feature</option>
            <option value="radio_spin">Radio Spin</option>
            <option value="blog_post">Blog Post</option>
            <option value="social_mention">Social Mention</option>
            <option value="creative_breakthrough">Creative Breakthrough</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 font-mono">
              Artist Slug (optional)
            </label>
            <input
              type="text"
              value={artistSlug}
              onChange={(e) => setArtistSlug(e.target.value)}
              placeholder="specific-artist"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:border-[#3AA9BE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 font-mono">
              Scene Slug (optional)
            </label>
            <input
              type="text"
              value={sceneSlug}
              onChange={(e) => setSceneSlug(e.target.value)}
              placeholder="uk-garage"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:border-[#3AA9BE] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions Section */}
      {ruleType === 'weight' && (
        <div className="space-y-4 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
          <h3 className="text-sm font-semibold text-slate-200">Weight Modification</h3>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 font-mono">
              Weight Multiplier (0.0 - 2.0)
            </label>
            <input
              type="number"
              value={weightMultiplier}
              onChange={(e) => setWeightMultiplier(parseFloat(e.target.value))}
              min="0"
              max="2"
              step="0.1"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono focus:border-[#3AA9BE] focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {weightMultiplier < 1
                ? `Reduce weight to ${(weightMultiplier * 100).toFixed(0)}%`
                : weightMultiplier > 1
                ? `Boost weight to ${(weightMultiplier * 100).toFixed(0)}%`
                : 'No change'}
            </p>
          </div>
        </div>
      )}

      {/* Submit Actions */}
      <div className="flex space-x-3 pt-4 border-t border-slate-800">
        <button
          type="submit"
          className="
            flex-1 px-6 py-3 bg-[#3AA9BE] text-white rounded-lg font-medium
            transition-all duration-240 ease-out
            hover:bg-[#3AA9BE]/80
          "
        >
          {initialRule ? 'Update Rule' : 'Create Rule'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              px-6 py-3 bg-slate-800 text-slate-300 rounded-lg font-medium
              transition-colors hover:bg-slate-700
            "
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

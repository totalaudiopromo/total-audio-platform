/**
 * Rule Card Component
 * Display individual ingestion rule with actions
 */

import type { RCFRule } from '@total-audio/rcf/rules';

interface RuleCardProps {
  rule: RCFRule;
  onEdit?: (rule: RCFRule) => void;
  onDelete?: (ruleId: string) => void;
}

const RULE_TYPE_LABELS: Record<string, string> = {
  block: 'Block Source',
  weight: 'Modify Weight',
};

const RULE_TYPE_ICONS: Record<string, string> = {
  block: '🚫',
  weight: '⚖️',
};

const RULE_TYPE_COLORS: Record<string, string> = {
  block: 'bg-red-500/10 text-red-400 border-red-500/30',
  weight: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export function RuleCard({ rule, onEdit, onDelete }: RuleCardProps) {
  const typeLabel = RULE_TYPE_LABELS[rule.rule_type] || rule.rule_type;
  const typeIcon = RULE_TYPE_ICONS[rule.rule_type] || '📋';
  const typeColor = RULE_TYPE_COLORS[rule.rule_type] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 transition-all duration-240 ease-out hover:bg-slate-900/70">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded border font-medium font-mono text-sm ${typeColor}`}>
              <span>{typeIcon}</span>
              <span>{typeLabel}</span>
            </span>

            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs font-mono">
              Priority: {rule.priority}
            </span>

            {!rule.is_active && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-xs font-mono">
                Inactive
              </span>
            )}
          </div>

          {/* Rule Conditions */}
          <div className="space-y-2">
            {rule.conditions.source_pattern && (
              <div className="text-sm">
                <span className="text-slate-500 font-mono">Source Pattern:</span>{' '}
                <span className="text-slate-200 font-mono">{rule.conditions.source_pattern}</span>
              </div>
            )}

            {rule.conditions.event_type && (
              <div className="text-sm">
                <span className="text-slate-500 font-mono">Event Type:</span>{' '}
                <span className="text-slate-200 font-mono">{rule.conditions.event_type}</span>
              </div>
            )}

            {rule.conditions.artist_slug && (
              <div className="text-sm">
                <span className="text-slate-500 font-mono">Artist:</span>{' '}
                <span className="text-[#3AA9BE] font-medium">{rule.conditions.artist_slug}</span>
              </div>
            )}

            {rule.conditions.scene_slug && (
              <div className="text-sm">
                <span className="text-slate-500 font-mono">Scene:</span>{' '}
                <span className="text-blue-400 font-medium">{rule.conditions.scene_slug}</span>
              </div>
            )}
          </div>

          {/* Rule Actions */}
          {rule.actions && (
            <div className="mt-3 pt-3 border-t border-slate-800">
              {rule.actions.block && (
                <div className="text-sm text-red-400 font-mono">
                  ✓ Block events matching this pattern
                </div>
              )}

              {rule.actions.weight_multiplier !== undefined && (
                <div className="text-sm text-blue-400 font-mono">
                  ✓ Weight multiplier: {rule.actions.weight_multiplier}x
                </div>
              )}
            </div>
          )}

          {rule.created_at && (
            <div className="mt-3 text-xs text-slate-500 font-mono">
              Created: {new Date(rule.created_at).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="ml-4 flex flex-col space-y-2">
          {onEdit && (
            <button
              onClick={() => onEdit(rule)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium transition-colors hover:bg-slate-700"
            >
              Edit
            </button>
          )}

          {onDelete && rule.id && (
            <button
              onClick={() => onDelete(rule.id!)}
              className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors hover:bg-red-500/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

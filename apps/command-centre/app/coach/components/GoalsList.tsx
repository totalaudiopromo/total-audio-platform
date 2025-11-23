'use client';

/**
 * GoalsList Component
 * Displays user's goals with filtering
 */

import React, { useState } from 'react';
import { CoachCard } from './CoachCard';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'active' | 'paused' | 'completed';
  priority: number;
  progress: number;
  target_date?: string;
}

interface GoalsListProps {
  goals: Goal[];
  onUpdateGoal?: (goalId: string, updates: Partial<Goal>) => void;
  onDeleteGoal?: (goalId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  career: 'text-purple-400',
  release: 'text-blue-400',
  branding: 'text-pink-400',
  marketing: 'text-green-400',
  skills: 'text-yellow-400',
  growth: 'text-cyan-400',
  creative: 'text-orange-400',
};

export function GoalsList({ goals, onUpdateGoal, onDeleteGoal }: GoalsListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  return (
    <CoachCard
      title="Goals"
      headerAction={
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                text-xs px-3 py-1 rounded-lg transition-all duration-240
                ${
                  filter === f
                    ? 'bg-[#3AA9BE] text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }
              `}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      }
    >
      {filteredGoals.length === 0 ? (
        <div className="text-center py-8 text-white/50">
          No {filter !== 'all' && filter} goals yet
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="
                bg-black/40 border border-[#3AA9BE]/10
                rounded-xl p-4
                hover:border-[#3AA9BE]/30
                transition-all duration-240
              "
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white/90 font-medium">{goal.title}</h4>
                    <span
                      className={`text-xs ${
                        CATEGORY_COLORS[goal.category] || 'text-white/50'
                      }`}
                    >
                      {goal.category}
                    </span>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-white/60">{goal.description}</p>
                  )}
                </div>

                {onDeleteGoal && (
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-white/30 hover:text-red-400 transition-colors"
                    title="Delete goal"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3AA9BE] transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span className={`priority-${goal.priority}`}>
                  Priority: {goal.priority}
                </span>
                {goal.target_date && (
                  <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                )}
                {goal.status === 'completed' && (
                  <span className="text-green-400">✓ Completed</span>
                )}
              </div>

              {/* Actions */}
              {onUpdateGoal && goal.status !== 'completed' && (
                <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() =>
                      onUpdateGoal(goal.id, {
                        status: 'completed',
                        progress: 100,
                      })
                    }
                    className="
                      text-xs px-3 py-1 rounded-lg
                      bg-green-500/20 text-green-300 border border-green-500/30
                      hover:bg-green-500/30
                      transition-all duration-240
                    "
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() =>
                      onUpdateGoal(goal.id, {
                        status: goal.status === 'active' ? 'paused' : 'active',
                      })
                    }
                    className="
                      text-xs px-3 py-1 rounded-lg
                      bg-white/5 text-white/60
                      hover:bg-white/10
                      transition-all duration-240
                    "
                  >
                    {goal.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CoachCard>
  );
}

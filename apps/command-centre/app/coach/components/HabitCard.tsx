/**
 * HabitCard Component
 * Displays a habit with frequency, streak, and completion button
 */

'use client';

import React from 'react';
import type { Habit } from '@total-audio/coach-os/habits';

interface HabitCardProps {
  habit: Habit;
  onComplete?: (habitId: string) => void;
  onEdit?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
}

export default function HabitCard({ habit, onComplete, onEdit, onDelete }: HabitCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'creative':
        return 'text-purple-400';
      case 'outreach':
        return 'text-blue-400';
      case 'wellness':
        return 'text-green-400';
      case 'admin':
        return 'text-orange-400';
      case 'learning':
        return 'text-cyan-400';
      default:
        return 'text-white/70';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case '3x_week':
        return '3x/week';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return frequency;
    }
  };

  const isDueToday = () => {
    if (!habit.last_completed) return true;

    const now = new Date();
    const lastCompleted = new Date(habit.last_completed);
    const daysSinceCompletion = Math.floor(
      (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (habit.frequency) {
      case 'daily':
        return daysSinceCompletion >= 1;
      case '3x_week':
        return daysSinceCompletion >= 2;
      case 'weekly':
        return daysSinceCompletion >= 7;
      case 'monthly':
        return daysSinceCompletion >= 30;
      default:
        return false;
    }
  };

  const dueToday = isDueToday();

  return (
    <div
      className="
        bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20
        rounded-2xl p-6 transition-all duration-300
        hover:border-[#3AA9BE]/40 hover:shadow-lg hover:shadow-[#3AA9BE]/10
      "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white/90 mb-1">{habit.name}</h3>
          <div className="flex items-center gap-3 text-sm">
            <span className={getCategoryColor(habit.category)}>
              {habit.category}
            </span>
            <span className="text-white/50">•</span>
            <span className="text-white/70">{getFrequencyLabel(habit.frequency)}</span>
          </div>
        </div>

        {/* Streak indicator */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white/90">
            {habit.streak}
            {habit.streak > 0 && <span className="ml-1">🔥</span>}
          </div>
          <div className="text-xs text-white/50">day streak</div>
        </div>
      </div>

      {/* Last completed */}
      {habit.last_completed && (
        <div className="text-sm text-white/50 mb-4">
          Last completed:{' '}
          {new Date(habit.last_completed).toLocaleDateString('en-GB', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {dueToday && onComplete && (
          <button
            onClick={() => onComplete(habit.id)}
            className="
              flex-1 bg-[#3AA9BE] text-white px-4 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:bg-[#3AA9BE]/80 hover:shadow-lg hover:shadow-[#3AA9BE]/20
            "
          >
            ✓ Complete
          </button>
        )}
        {!dueToday && (
          <div
            className="
              flex-1 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl
              font-medium text-center border border-green-500/20
            "
          >
            ✓ Completed Today
          </div>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(habit.id)}
            className="
              px-4 py-2 rounded-xl border border-white/10 text-white/70
              transition-all duration-240 hover:border-white/20 hover:text-white/90
            "
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(habit.id)}
            className="
              px-4 py-2 rounded-xl border border-red-500/20 text-red-400
              transition-all duration-240 hover:border-red-500/40 hover:text-red-300
            "
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

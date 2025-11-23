/**
 * RoutineCard Component
 * Displays a routine template with steps and duration
 */

'use client';

import React, { useState } from 'react';
import type { Routine } from '@total-audio/coach-os/routines';

interface RoutineCardProps {
  routine: Routine;
  onApplyToWeeklyPlan?: (routineId: string) => void;
  onEdit?: (routineId: string) => void;
  onDelete?: (routineId: string) => void;
}

export default function RoutineCard({ routine, onApplyToWeeklyPlan, onEdit, onDelete }: RoutineCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'creative':
        return 'text-purple-400 border-purple-400/20';
      case 'outreach':
        return 'text-blue-400 border-blue-400/20';
      case 'wellness':
        return 'text-green-400 border-green-400/20';
      case 'admin':
        return 'text-orange-400 border-orange-400/20';
      case 'learning':
        return 'text-cyan-400 border-cyan-400/20';
      default:
        return 'text-white/70 border-white/10';
    }
  };

  const totalDuration = routine.duration_minutes || 0;
  const stepCount = routine.steps.length;

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
          <h3 className="text-lg font-semibold text-white/90 mb-1">{routine.name}</h3>
          {routine.description && (
            <p className="text-sm text-white/60 mb-2">{routine.description}</p>
          )}
          <div className="flex items-center gap-3 text-sm">
            {routine.category && (
              <span className={`px-2 py-1 rounded-lg border ${getCategoryColor(routine.category)}`}>
                {routine.category}
              </span>
            )}
            <span className="text-white/50">{stepCount} steps</span>
            {totalDuration > 0 && (
              <>
                <span className="text-white/50">•</span>
                <span className="text-white/70">{totalDuration} min</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="
            px-3 py-1 rounded-lg border border-white/10 text-white/70 text-sm
            transition-all duration-240 hover:border-white/20 hover:text-white/90
          "
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Steps (expanded) */}
      {expanded && (
        <div className="mb-4 space-y-2">
          <div className="text-sm font-medium text-white/70 mb-2">Steps:</div>
          {routine.steps.map((step, index) => (
            <div
              key={index}
              className="
                bg-black/20 border border-white/5 rounded-lg p-3
                flex items-start gap-3
              "
            >
              <div className="
                w-6 h-6 rounded-full bg-[#3AA9BE]/20 text-[#3AA9BE]
                flex items-center justify-center text-xs font-medium
                flex-shrink-0 mt-0.5
              ">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white/90">{step.title}</div>
                {step.description && (
                  <div className="text-xs text-white/60 mt-1">{step.description}</div>
                )}
              </div>
              {step.duration_minutes && (
                <div className="text-xs text-white/50 flex-shrink-0">
                  {step.duration_minutes} min
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onApplyToWeeklyPlan && (
          <button
            onClick={() => onApplyToWeeklyPlan(routine.id)}
            className="
              flex-1 bg-[#3AA9BE] text-white px-4 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:bg-[#3AA9BE]/80 hover:shadow-lg hover:shadow-[#3AA9BE]/20
            "
          >
            Apply to Weekly Plan
          </button>
        )}

        {onEdit && (
          <button
            onClick={() => onEdit(routine.id)}
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
            onClick={() => onDelete(routine.id)}
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

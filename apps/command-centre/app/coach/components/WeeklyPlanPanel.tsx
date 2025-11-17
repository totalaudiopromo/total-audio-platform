'use client';

/**
 * WeeklyPlanPanel Component
 * Displays the current week's coaching plan
 */

import React from 'react';
import { CoachCard } from './CoachCard';
import { CoachTaskCard } from './CoachTaskCard';

interface WeeklyPlanPanelProps {
  session: {
    id: string;
    week_start: string;
    plan: {
      focus_theme: string;
      tasks: any[];
      metricsToTrack: string[];
      recommendations: string[];
      estimated_hours: number;
    };
    insights: any[];
    completed: boolean;
  } | null;
  onTaskToggle?: (taskId: string) => void;
  onRegeneratePlan?: () => void;
}

export function WeeklyPlanPanel({
  session,
  onTaskToggle,
  onRegeneratePlan,
}: WeeklyPlanPanelProps) {
  if (!session) {
    return (
      <CoachCard>
        <div className="text-center py-12">
          <p className="text-white/70 mb-4">No weekly plan yet</p>
          <button
            onClick={onRegeneratePlan}
            className="
              px-6 py-3 rounded-xl
              bg-[#3AA9BE] text-black font-medium
              hover:bg-[#3AA9BE]/90
              transition-all duration-240 ease-out
              hover:shadow-lg hover:shadow-[#3AA9BE]/30
            "
          >
            Generate Your First Weekly Plan
          </button>
        </div>
      </CoachCard>
    );
  }

  const { plan } = session;

  return (
    <div className="space-y-6">
      {/* Focus Theme */}
      <CoachCard
        title="This Week's Focus"
        headerAction={
          <button
            onClick={onRegeneratePlan}
            className="text-xs text-[#3AA9BE] hover:text-[#3AA9BE]/80 transition-colors"
          >
            Regenerate Plan
          </button>
        }
      >
        <p className="text-white/90 text-lg leading-relaxed">
          {plan.focus_theme}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-white/50">
          <span>📅 Week of {new Date(session.week_start).toLocaleDateString()}</span>
          <span>⏱️ ~{plan.estimated_hours}h estimated</span>
          <span>{plan.tasks.length} tasks</span>
        </div>
      </CoachCard>

      {/* Tasks */}
      <CoachCard title="Weekly Tasks">
        <div className="space-y-3">
          {plan.tasks.map((task, idx) => (
            <CoachTaskCard
              key={task.id || idx}
              task={task}
              onToggle={() => onTaskToggle && task.id && onTaskToggle(task.id)}
            />
          ))}
        </div>
      </CoachCard>

      {/* Insights */}
      {plan.insights && plan.insights.length > 0 && (
        <CoachCard title="Weekly Insights">
          <div className="space-y-4">
            {session.insights.map((insight, idx) => (
              <div
                key={idx}
                className="
                  bg-black/40 border border-[#3AA9BE]/10
                  rounded-xl p-4
                "
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#3AA9BE] uppercase tracking-wide">
                    {insight.type}
                  </span>
                  {insight.priority === 'high' && (
                    <span className="text-xs text-red-400">● HIGH PRIORITY</span>
                  )}
                </div>
                <p className="text-white/90 font-medium mb-1">{insight.summary}</p>
                <p className="text-sm text-white/70 leading-relaxed">{insight.detail}</p>
                {insight.actionable_steps && insight.actionable_steps.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {insight.actionable_steps.map((step: string, stepIdx: number) => (
                      <li key={stepIdx} className="text-sm text-white/60 flex items-start gap-2">
                        <span className="text-[#3AA9BE]">→</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CoachCard>
      )}

      {/* Recommendations */}
      {plan.recommendations && plan.recommendations.length > 0 && (
        <CoachCard title="Recommendations">
          <ul className="space-y-2">
            {plan.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-white/70">
                <span className="text-[#3AA9BE] mt-1">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CoachCard>
      )}
    </div>
  );
}

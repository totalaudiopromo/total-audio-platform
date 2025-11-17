'use client';

/**
 * CoachTaskCard Component
 * Displays individual coaching tasks
 */

import React from 'react';

interface CoachTaskCardProps {
  task: {
    id?: string;
    title: string;
    description: string;
    category: string;
    effort: 'low' | 'medium' | 'high';
    completed?: boolean;
    resources?: Array<{
      title: string;
      url?: string;
      type: string;
    }>;
  };
  onToggle?: () => void;
}

const EFFORT_COLORS = {
  low: 'bg-green-500/20 text-green-300 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const CATEGORY_LABELS: Record<string, string> = {
  creative_growth: 'Creative Growth',
  promotional_understanding: 'Promotional',
  relationship_building: 'Relationships',
  career_skill: 'Career',
  wellbeing: 'Wellbeing',
};

export function CoachTaskCard({ task, onToggle }: CoachTaskCardProps) {
  return (
    <div
      className={`
        bg-black/60 backdrop-blur-sm
        border border-[#3AA9BE]/20
        rounded-xl
        p-4
        transition-all duration-240 ease-out
        ${task.completed ? 'opacity-60' : 'opacity-100'}
        hover:border-[#3AA9BE]/40
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`
            mt-1 w-5 h-5 rounded border-2
            transition-all duration-240 ease-out
            ${
              task.completed
                ? 'bg-[#3AA9BE] border-[#3AA9BE]'
                : 'bg-transparent border-white/30 hover:border-[#3AA9BE]'
            }
          `}
        >
          {task.completed && (
            <svg
              className="w-full h-full text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {/* Title & Category */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4
              className={`
                text-base font-medium font-['Inter']
                ${task.completed ? 'line-through text-white/50' : 'text-white/90'}
              `}
            >
              {task.title}
            </h4>
            <span className="text-xs text-[#3AA9BE] whitespace-nowrap">
              {CATEGORY_LABELS[task.category] || task.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 mb-3 leading-relaxed">
            {task.description}
          </p>

          {/* Effort & Resources */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`
                text-xs px-2 py-1 rounded-lg border font-mono
                ${EFFORT_COLORS[task.effort]}
              `}
            >
              {task.effort.toUpperCase()} EFFORT
            </span>

            {task.resources && task.resources.length > 0 && (
              <span className="text-xs text-white/50">
                • {task.resources.length} resource{task.resources.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Resources List */}
          {task.resources && task.resources.length > 0 && (
            <div className="mt-3 space-y-1">
              {task.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-2 text-xs text-[#3AA9BE]
                    hover:text-[#3AA9BE]/80 transition-colors duration-240
                  "
                >
                  <span className="opacity-50">→</span>
                  {resource.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

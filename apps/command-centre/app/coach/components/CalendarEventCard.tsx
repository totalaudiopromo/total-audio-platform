/**
 * CalendarEventCard Component
 * Displays a single calendar event with category color coding
 */

'use client';

import React from 'react';
import type { CalendarEvent } from '@total-audio/coach-os/calendar';

interface CalendarEventCardProps {
  event: CalendarEvent;
  onComplete?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

export default function CalendarEventCard({ event, onComplete, onEdit, onDelete }: CalendarEventCardProps) {
  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'creative':
        return 'border-l-purple-400 bg-purple-400/5';
      case 'promotional':
        return 'border-l-blue-400 bg-blue-400/5';
      case 'relationship':
        return 'border-l-pink-400 bg-pink-400/5';
      case 'career':
        return 'border-l-yellow-400 bg-yellow-400/5';
      case 'wellbeing':
        return 'border-l-green-400 bg-green-400/5';
      case 'admin':
        return 'border-l-orange-400 bg-orange-400/5';
      case 'learning':
        return 'border-l-cyan-400 bg-cyan-400/5';
      default:
        return 'border-l-white/20 bg-white/5';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return '✓';
      case 'habit':
        return '🔁';
      case 'routine':
        return '📋';
      case 'manual':
        return '📌';
      case 'goal_milestone':
        return '🎯';
      default:
        return '•';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = () => {
    if (!event.end_time) return null;

    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    const durationMs = end.getTime() - start.getTime();
    const durationMin = Math.floor(durationMs / (1000 * 60));

    if (durationMin < 60) {
      return `${durationMin}m`;
    } else {
      const hours = Math.floor(durationMin / 60);
      const minutes = durationMin % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  return (
    <div
      className={`
        border-l-4 ${getCategoryColor(event.category)}
        rounded-lg p-4 transition-all duration-300
        ${event.completed ? 'opacity-50' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-lg">{getEventTypeIcon(event.event_type)}</span>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${event.completed ? 'line-through text-white/50' : 'text-white/90'}`}>
              {event.title}
            </h4>
            {event.description && (
              <p className="text-xs text-white/60 mt-1">{event.description}</p>
            )}
          </div>
        </div>

        {event.completed && (
          <span className="text-xs text-green-400 font-medium">✓ Done</span>
        )}
      </div>

      {/* Time and duration */}
      <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
        <span>{formatTime(event.start_time)}</span>
        {event.end_time && (
          <>
            <span>→</span>
            <span>{formatTime(event.end_time)}</span>
          </>
        )}
        {formatDuration() && (
          <>
            <span>•</span>
            <span>{formatDuration()}</span>
          </>
        )}
      </div>

      {/* Actions */}
      {!event.completed && (
        <div className="flex items-center gap-2">
          {onComplete && (
            <button
              onClick={() => onComplete(event.id)}
              className="
                flex-1 bg-[#3AA9BE]/20 text-[#3AA9BE] px-3 py-1.5 rounded-lg
                text-xs font-medium transition-all duration-240
                hover:bg-[#3AA9BE]/30 border border-[#3AA9BE]/20
              "
            >
              Mark Complete
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(event.id)}
              className="
                px-3 py-1.5 rounded-lg border border-white/10 text-white/70 text-xs
                transition-all duration-240 hover:border-white/20 hover:text-white/90
              "
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="
                px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs
                transition-all duration-240 hover:border-red-500/40
              "
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

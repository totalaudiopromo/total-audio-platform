/**
 * CalendarWeekView Component
 * Week-based calendar view with color-coded events
 */

'use client';

import React, { useState } from 'react';
import type { CalendarEvent } from '@total-audio/coach-os/calendar';
import CalendarEventCard from './CalendarEventCard';

interface CalendarWeekViewProps {
  events: CalendarEvent[];
  weekStart: Date;
  onEventComplete?: (eventId: string) => void;
  onEventEdit?: (eventId: string) => void;
  onEventDelete?: (eventId: string) => void;
  onWeekChange?: (newWeekStart: Date) => void;
}

export default function CalendarWeekView({
  events,
  weekStart,
  onEventComplete,
  onEventEdit,
  onEventDelete,
  onWeekChange,
}: CalendarWeekViewProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Generate array of days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    return day;
  });

  // Group events by day
  const eventsByDay = weekDays.map((day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return eventDate >= dayStart && eventDate <= dayEnd;
    });
  });

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    onWeekChange?.(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    onWeekChange?.(newWeekStart);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    onWeekChange?.(monday);
  };

  const isToday = (day: Date) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];

    const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white/90">{formatWeekRange()}</h2>
          <p className="text-sm text-white/50">
            {events.length} events • {events.filter(e => e.completed).length} completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToCurrentWeek}
            className="
              px-4 py-2 rounded-xl border border-[#3AA9BE]/20 text-[#3AA9BE]
              transition-all duration-240 hover:bg-[#3AA9BE]/10
            "
          >
            Today
          </button>
          <button
            onClick={goToPreviousWeek}
            className="
              px-4 py-2 rounded-xl border border-white/10 text-white/70
              transition-all duration-240 hover:border-white/20 hover:text-white/90
            "
          >
            ← Prev
          </button>
          <button
            onClick={goToNextWeek}
            className="
              px-4 py-2 rounded-xl border border-white/10 text-white/70
              transition-all duration-240 hover:border-white/20 hover:text-white/90
            "
          >
            Next →
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, dayIndex) => {
          const dayEvents = eventsByDay[dayIndex];
          const today = isToday(day);

          return (
            <div
              key={dayIndex}
              className={`
                border rounded-2xl p-3 transition-all duration-240
                ${today ? 'border-[#3AA9BE]/40 bg-[#3AA9BE]/5' : 'border-white/10 bg-black/20'}
                ${selectedDay === dayIndex ? 'ring-2 ring-[#3AA9BE]/40' : ''}
                hover:border-[#3AA9BE]/30 cursor-pointer
              `}
              onClick={() => setSelectedDay(selectedDay === dayIndex ? null : dayIndex)}
            >
              {/* Day header */}
              <div className="text-center mb-2">
                <div className="text-xs font-medium text-white/50 uppercase">
                  {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${today ? 'text-[#3AA9BE]' : 'text-white/90'}`}>
                  {day.getDate()}
                </div>
              </div>

              {/* Event count */}
              <div className="text-center">
                {dayEvents.length > 0 ? (
                  <div className="text-xs text-white/60">
                    {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </div>
                ) : (
                  <div className="text-xs text-white/30">No events</div>
                )}

                {/* Event dots */}
                {dayEvents.length > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={`
                          w-2 h-2 rounded-full
                          ${event.completed ? 'bg-green-400' : 'bg-[#3AA9BE]'}
                        `}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-white/50">+{dayEvents.length - 3}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay !== null && eventsByDay[selectedDay].length > 0 && (
        <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white/90 mb-4">
            {weekDays[selectedDay].toLocaleDateString('en-GB', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>

          <div className="space-y-3">
            {eventsByDay[selectedDay]
              .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
              .map((event) => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  onComplete={onEventComplete}
                  onEdit={onEventEdit}
                  onDelete={onEventDelete}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

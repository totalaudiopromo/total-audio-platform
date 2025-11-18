/**
 * Timeline Chart Component
 * Chronological visualization of artist events with date grouping
 */

'use client';

import { useState } from 'react';
import { EventBubble } from './EventBubble';

interface TimelineEvent {
  id: string;
  event_type: string;
  weight: number;
  created_at: string;
  metadata?: Record<string, any>;
}

interface TimelineDay {
  date: string;
  events: TimelineEvent[];
  event_count: number;
  total_weight: number;
}

interface TimelineChartProps {
  timeline: TimelineDay[];
  artistSlug: string;
}

export function TimelineChart({ timeline, artistSlug }: TimelineChartProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  if (timeline.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <div className="text-lg mb-2">No events found</div>
        <div className="text-sm">No coverage events recorded for {artistSlug}</div>
      </div>
    );
  }

  // Calculate max weight for scaling
  const maxDailyWeight = Math.max(...timeline.map((day) => day.total_weight), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">
          Event Timeline for <span className="text-[#3AA9BE]">{artistSlug}</span>
        </h2>
        <div className="text-sm text-slate-400 font-mono">
          {timeline.length} {timeline.length === 1 ? 'day' : 'days'} with coverage
        </div>
      </div>

      <div className="relative">
        {/* Timeline vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800" />

        <div className="space-y-8">
          {timeline.map((day, dayIdx) => {
            const barHeight = (day.total_weight / maxDailyWeight) * 100;
            const formattedDate = new Date(day.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div key={day.date} className="relative pl-16">
                {/* Date marker on timeline */}
                <div className="absolute left-0 top-0 flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-full border-2 border-[#3AA9BE] bg-slate-900 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-xs font-mono text-slate-400">
                        {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit' })}
                      </div>
                      <div className="text-xs font-mono text-[#3AA9BE]">
                        {new Date(day.date).toLocaleDateString('en-GB', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day card */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">{formattedDate}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-slate-400 font-mono">
                          {day.event_count} {day.event_count === 1 ? 'event' : 'events'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Weight: {day.total_weight.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Activity bar */}
                    <div className="flex items-end h-12 w-24">
                      <div
                        className="w-full bg-[#3AA9BE] rounded-t transition-all duration-300"
                        style={{ height: `${barHeight}%` }}
                        title={`Activity: ${day.total_weight.toFixed(2)}`}
                      />
                    </div>
                  </div>

                  {/* Events bubbles */}
                  <div className="flex flex-wrap gap-3">
                    {day.events.map((event, eventIdx) => (
                      <EventBubble
                        key={event.id || `event-${dayIdx}-${eventIdx}`}
                        eventType={event.event_type}
                        weight={event.weight}
                        timestamp={event.created_at}
                        onClick={() => setSelectedEvent(event)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected event detail panel */}
      {selectedEvent && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-6 z-20 shadow-2xl">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-xs font-mono">
                    {selectedEvent.event_type}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">
                    Weight: {selectedEvent.weight.toFixed(2)}
                  </span>
                  <span className="text-sm text-slate-500 font-mono">
                    {new Date(selectedEvent.created_at).toLocaleString()}
                  </span>
                </div>

                {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-slate-500 font-mono mb-2">Event Details</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedEvent.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-mono"
                        >
                          {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="ml-4 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

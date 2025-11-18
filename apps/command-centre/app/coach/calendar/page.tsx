/**
 * CoachOS Calendar Page
 * Week-based calendar view with tasks, habits, routines, and manual events
 */

'use client';

import React, { useEffect, useState } from 'react';
import CalendarWeekView from '../components/CalendarWeekView';
import type { CalendarEvent, CalendarSummary } from '@total-audio/coach-os/calendar';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [summary, setSummary] = useState<CalendarSummary | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(getCurrentWeekStart());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [weekStart]);

  function getCurrentWeekStart(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  const fetchCalendarData = async () => {
    try {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      // Fetch events
      const eventsRes = await fetch(
        `/api/coach/calendar?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`
      );
      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);

      // Fetch summary
      const summaryRes = await fetch(
        `/api/coach/calendar?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}&summary=true`
      );
      const summaryData = await summaryRes.json();
      setSummary(summaryData.summary || null);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncHabits = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/coach/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_habits',
          weekStart: weekStart.toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh calendar
        await fetchCalendarData();
        alert(`Synced ${data.count} habit events to calendar!`);
      }
    } catch (error) {
      console.error('Failed to sync habits:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleEventComplete = async (eventId: string) => {
    try {
      // TODO: Implement event completion API endpoint
      setEvents(events.map(e =>
        e.id === eventId ? { ...e, completed: true } : e
      ));
    } catch (error) {
      console.error('Failed to complete event:', error);
    }
  };

  const handleEventDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      // TODO: Implement delete API endpoint
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleWeekChange = (newWeekStart: Date) => {
    setWeekStart(newWeekStart);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white/70">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">Calendar</h1>
          <p className="text-white/60">
            Your weekly schedule with tasks, habits, and routines all in one place.
          </p>
        </div>

        {/* Summary stats */}
        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-white/90">{summary.totalEvents}</div>
              <div className="text-sm text-white/50">Total Events</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-400">{summary.completedEvents}</div>
              <div className="text-sm text-white/50">Completed</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-[#3AA9BE]/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-white/90">{summary.upcomingEvents}</div>
              <div className="text-sm text-white/50">Upcoming</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
              <div className="text-3xl font-bold text-purple-400">
                {summary.eventsByCategory.creative || 0}
              </div>
              <div className="text-sm text-white/50">Creative Tasks</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleSyncHabits}
            disabled={syncing}
            className="
              bg-[#3AA9BE] text-white px-6 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:bg-[#3AA9BE]/80 hover:shadow-lg hover:shadow-[#3AA9BE]/20
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {syncing ? 'Syncing...' : '🔁 Sync Habits'}
          </button>

          <button
            className="
              border border-white/10 text-white/70 px-6 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:border-white/20 hover:text-white/90
            "
          >
            + Manual Event
          </button>

          <button
            className="
              border border-white/10 text-white/70 px-6 py-2 rounded-xl
              font-medium transition-all duration-240
              hover:border-white/20 hover:text-white/90
            "
          >
            📊 Export Week
          </button>
        </div>

        {/* Event type filters */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-white/50">Show:</span>
          <div className="flex items-center gap-2">
            {[
              { type: 'task', label: 'Tasks', icon: '✓', color: 'bg-[#3AA9BE]' },
              { type: 'habit', label: 'Habits', icon: '🔁', color: 'bg-green-500' },
              { type: 'routine', label: 'Routines', icon: '📋', color: 'bg-purple-500' },
              { type: 'manual', label: 'Manual', icon: '📌', color: 'bg-orange-500' },
            ].map(({ type, label, icon, color }) => (
              <button
                key={type}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium
                  border border-white/10 text-white/70
                  transition-all duration-240 hover:border-white/20
                `}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <CalendarWeekView
          events={events}
          weekStart={weekStart}
          onEventComplete={handleEventComplete}
          onEventDelete={handleEventDelete}
          onWeekChange={handleWeekChange}
        />

        {/* Category legend */}
        <div className="mt-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-3">Category Colors</h3>
          <div className="grid grid-cols-7 gap-3">
            {[
              { category: 'creative', label: 'Creative', color: 'border-l-purple-400' },
              { category: 'promotional', label: 'Promotional', color: 'border-l-blue-400' },
              { category: 'relationship', label: 'Relationship', color: 'border-l-pink-400' },
              { category: 'career', label: 'Career', color: 'border-l-yellow-400' },
              { category: 'wellbeing', label: 'Wellbeing', color: 'border-l-green-400' },
              { category: 'admin', label: 'Admin', color: 'border-l-orange-400' },
              { category: 'learning', label: 'Learning', color: 'border-l-cyan-400' },
            ].map(({ category, label, color }) => (
              <div key={category} className="flex items-center gap-2">
                <div className={`w-3 h-3 border-l-4 ${color}`} />
                <span className="text-xs text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

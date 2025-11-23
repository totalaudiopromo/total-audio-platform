/**
 * Weekly Plan Page
 * View and manage the current week's coaching plan
 */

'use client';

import React, { useEffect, useState } from 'react';
import { WeeklyPlanPanel } from '../components/WeeklyPlanPanel';

export default function WeeklyPlanPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSession();
  }, []);

  const fetchCurrentSession = async () => {
    try {
      const res = await fetch('/api/coach/sessions?current=true');
      const data = await res.json();
      setSession(data.session);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/coach/generate-weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRegenerate: true }),
      });
      const data = await res.json();
      setSession(data.session);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white/70">Loading weekly plan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">Weekly Plan</h1>
          <p className="text-white/60">Your structured plan for the week</p>
        </div>

        <WeeklyPlanPanel
          session={session}
          onRegeneratePlan={handleGeneratePlan}
        />
      </div>
    </div>
  );
}

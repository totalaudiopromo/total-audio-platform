/**
 * Insights Page
 * View AI-generated coaching insights
 */

'use client';

import React, { useEffect, useState } from 'react';
import { InsightCard } from '../components/InsightCard';
import { CoachCard } from '../components/CoachCard';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/coach/insights');
      const data = await res.json();
      setInsights(data.insights || []);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    try {
      setGenerating(true);
      await fetch('/api/coach/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchInsights();
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white/70">Loading insights...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white/90 mb-2">Insights</h1>
            <p className="text-white/60">AI-generated coaching insights</p>
          </div>
          <button
            onClick={handleGenerateInsights}
            disabled={generating}
            className="
              px-6 py-3 rounded-xl
              bg-[#3AA9BE] text-black font-medium
              hover:bg-[#3AA9BE]/90
              disabled:opacity-50
              transition-all duration-240
            "
          >
            {generating ? 'Generating...' : 'Generate New Insights'}
          </button>
        </div>

        {insights.length === 0 ? (
          <CoachCard>
            <div className="text-center py-12">
              <p className="text-white/70 mb-4">No insights yet</p>
              <p className="text-sm text-white/50">
                Generate insights to get personalized coaching recommendations
              </p>
            </div>
          </CoachCard>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

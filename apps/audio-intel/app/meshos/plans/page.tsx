/**
 * MeshOS Long-Range Plans Page
 * 7-day, 30-day, and 90-day planning visualization
 */

'use client';

import { useState, useEffect } from 'react';
import { LongRangePlanGrid } from '../../components/meshos/LongRangePlanGrid';
import type { MeshPlan, PlanTimeframe } from '@total-audio/meshos';

export default function PlansPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<PlanTimeframe>('7d');
  const [plan, setPlan] = useState<MeshPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlan(selectedTimeframe);
  }, [selectedTimeframe]);

  const fetchPlan = async (timeframe: PlanTimeframe) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/meshos/plan/${timeframe}`);
      const data = await response.json();

      if (data.success) {
        setPlan(data.plan);
      } else {
        setError(data.error || 'Failed to fetch plan');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-2">Long-Range Plans</h1>
      <p className="text-muted-foreground mb-8">
        Strategic planning across multiple timeframes
      </p>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSelectedTimeframe('7d')}
          className={`px-4 py-2 rounded transition-colors ${
            selectedTimeframe === '7d'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => setSelectedTimeframe('30d')}
          className={`px-4 py-2 rounded transition-colors ${
            selectedTimeframe === '30d'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          30 Days
        </button>
        <button
          onClick={() => setSelectedTimeframe('90d')}
          className={`px-4 py-2 rounded transition-colors ${
            selectedTimeframe === '90d'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          90 Days
        </button>
      </div>

      {/* Plan Content */}
      {loading && (
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded"></div>
        </div>
      )}

      {error && (
        <div className="border border-destructive bg-destructive/10 p-4 rounded">
          <h2 className="font-semibold mb-2">Error Loading Plan</h2>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && plan && <LongRangePlanGrid plan={plan} />}
    </div>
  );
}

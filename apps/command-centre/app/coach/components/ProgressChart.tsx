'use client';

/**
 * ProgressChart Component
 * Simple progress visualization
 */

import React from 'react';
import { CoachCard } from './CoachCard';

interface ProgressChartProps {
  metrics: Array<{
    metric: string;
    value: number;
    created_at: string;
  }>;
  title?: string;
}

export function ProgressChart({ metrics, title = 'Progress' }: ProgressChartProps) {
  if (metrics.length === 0) {
    return (
      <CoachCard title={title}>
        <div className="text-center py-8 text-white/50">
          No progress data yet. Complete tasks to track your progress!
        </div>
      </CoachCard>
    );
  }

  // Group by metric
  const metricGroups = metrics.reduce((acc, item) => {
    if (!acc[item.metric]) {
      acc[item.metric] = [];
    }
    acc[item.metric].push(item);
    return acc;
  }, {} as Record<string, typeof metrics>);

  return (
    <CoachCard title={title}>
      <div className="space-y-6">
        {Object.entries(metricGroups).map(([metric, data]) => {
          const latest = data[data.length - 1];
          const earliest = data[0];
          const change =
            data.length > 1
              ? ((latest.value - earliest.value) / earliest.value) * 100
              : 0;

          return (
            <div key={metric}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/90 font-medium capitalize">
                  {metric.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-white/70 font-mono">{latest.value}</span>
                  {change !== 0 && (
                    <span
                      className={`
                        text-xs px-2 py-0.5 rounded-lg font-mono
                        ${
                          change > 0
                            ? 'text-green-400 bg-green-500/20'
                            : 'text-red-400 bg-red-500/20'
                        }
                      `}
                    >
                      {change > 0 ? '+' : ''}
                      {change.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Simple sparkline visualization */}
              <div className="flex items-end gap-1 h-12">
                {data.map((point, idx) => {
                  const maxValue = Math.max(...data.map((d) => d.value));
                  const height = (point.value / maxValue) * 100;

                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-[#3AA9BE]/30 rounded-t transition-all duration-240"
                      style={{ height: `${height}%` }}
                      title={`${point.value} on ${new Date(
                        point.created_at
                      ).toLocaleDateString()}`}
                    />
                  );
                })}
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <span>
                  {new Date(earliest.created_at).toLocaleDateString()}
                </span>
                <span>{data.length} data points</span>
                <span>
                  {new Date(latest.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </CoachCard>
  );
}

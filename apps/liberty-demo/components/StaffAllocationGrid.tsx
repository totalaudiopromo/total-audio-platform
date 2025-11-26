import React, { useState, useEffect, useCallback } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { fetchStaffAllocations } from '@/lib/api/monday';
import { MondayAllocation } from '@/lib/types';
import { EmptyState, ErrorState, DataFreshness, LoadingState } from '@/components/ui';

export default function StaffAllocationGrid() {
  const [allocations, setAllocations] = useState<MondayAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStaffAllocations();
      setAllocations(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[Monday.com] Failed to load staff allocations:', err);
      setError('Failed to load allocations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getWorkloadColour = (score: number) => {
    if (score < 60) return 'bg-green-500';
    if (score <= 85) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getWorkloadLabel = (score: number) => {
    if (score < 60) return 'Available';
    if (score <= 85) return 'Busy';
    return 'Overloaded';
  };

  const overloadedStaff = allocations.filter(a => a.workloadScore > 85);
  const atCapacityStaff = allocations.filter(a => a.workloadScore >= 75 && a.workloadScore <= 85);

  const renderContent = () => {
    if (loading && allocations.length === 0) {
      return <LoadingState message="Loading team allocation..." size="sm" />;
    }

    if (error && allocations.length === 0) {
      return <ErrorState variant="default" onRetry={loadData} />;
    }

    if (allocations.length === 0) {
      return (
        <EmptyState
          variant="team"
          description="No team members found. Connect Monday.com to see staff workload."
        />
      );
    }

    return (
      <div className="space-y-3">
        {allocations.map((allocation, idx) => (
          <div
            key={allocation.staffName + '-' + idx}
            className="pb-3 border-b border-tap-line last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-tap-text truncate">
                  {allocation.staffName}
                </div>
                <div className="text-xs text-tap-muted truncate">{allocation.role}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-tap-muted font-mono">
                  {allocation.activeCampaigns.length}{' '}
                  {allocation.activeCampaigns.length === 1 ? 'campaign' : 'campaigns'}
                </span>
                {allocation.workloadScore > 85 && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-tap-bg rounded-full overflow-hidden border border-tap-line">
                <div
                  className={
                    'h-full transition-all duration-300 ease-out ' +
                    getWorkloadColour(allocation.workloadScore)
                  }
                  style={{ width: Math.min(allocation.workloadScore, 100) + '%' }}
                />
              </div>
              <span
                className={
                  'text-xs font-mono w-12 text-right ' +
                  (allocation.workloadScore > 85 ? 'text-red-600 font-medium' : 'text-tap-text')
                }
              >
                {allocation.workloadScore}%
              </span>
            </div>

            {/* Show workload status label on mobile */}
            <div className="mt-1 sm:hidden">
              <span
                className={
                  'text-xs ' +
                  (allocation.workloadScore > 85
                    ? 'text-red-600'
                    : allocation.workloadScore > 60
                      ? 'text-amber-600'
                      : 'text-green-600')
                }
              >
                {getWorkloadLabel(allocation.workloadScore)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-tap-text" />
            <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
              Team Allocation
            </h2>
          </div>
          <DataFreshness
            lastUpdated={lastUpdated}
            isLoading={loading}
            onRefresh={loadData}
            showRefreshButton={!loading}
          />
        </div>

        {renderContent()}

        {/* Legend */}
        {allocations.length > 0 && (
          <div className="mt-4 pt-3 border-t border-tap-line flex flex-wrap gap-4 text-xs text-tap-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>&lt;60% Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span>60-85% Busy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>&gt;85% Overloaded</span>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      {(overloadedStaff.length > 0 || atCapacityStaff.length > 0) && (
        <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
          <h3 className="text-sm font-heading font-medium text-tap-text mb-3 uppercase tracking-wide">
            Workload Recommendations
          </h3>
          <div className="space-y-3">
            {overloadedStaff.map((staff, idx) => (
              <div
                key={'overload-' + idx}
                className="p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm text-tap-text font-medium">
                      Reassign campaign from {staff.staffName.split(' ')[0]}
                    </p>
                    <p className="text-xs text-tap-muted mt-1 leading-relaxed">
                      Current load is{' '}
                      <span className="font-mono text-red-600 font-medium">
                        {staff.workloadScore}%
                      </span>
                      .
                      {staff.activeCampaigns[0] && (
                        <span>
                          {' '}
                          Consider moving &ldquo;{staff.activeCampaigns[0]}&rdquo; to someone with
                          capacity.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {atCapacityStaff.map((staff, idx) => (
              <div
                key={'capacity-' + idx}
                className="p-3 bg-amber-50 rounded-lg border border-amber-100"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm text-tap-text font-medium">
                      {staff.staffName.split(' ')[0]} approaching capacity
                    </p>
                    <p className="text-xs text-tap-muted mt-1">
                      At <span className="font-mono text-amber-600">{staff.workloadScore}%</span> —
                      avoid assigning new campaigns.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

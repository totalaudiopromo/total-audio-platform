import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { fetchStaffAllocations } from '@/lib/api/monday';
import { MondayAllocation } from '@/lib/types';

export default function StaffAllocationGrid() {
  const [allocations, setAllocations] = useState<MondayAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllocations = async () => {
      try {
        const data = await fetchStaffAllocations();
        setAllocations(data);
      } catch (error) {
        console.error('Failed to load staff allocations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllocations();
  }, []);

  const getWorkloadColour = (score: number) => {
    if (score < 60) return 'bg-tap-good';
    if (score <= 85) return 'bg-orange-500';
    return 'bg-tap-risk';
  };

  if (loading) {
    return (
      <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-tap-text" />
          <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
            Team Allocation
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-tap-line border-t-tap-text rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const overloadedStaff = allocations.filter(a => a.workloadScore > 85);

  return (
    <div className="space-y-6">
      <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-tap-text" />
          <h2 className="text-lg font-heading font-normal tracking-tight text-tap-text">
            Team Allocation
          </h2>
        </div>

        <div className="space-y-3">
          {allocations.map((allocation, idx) => (
            <div
              key={`${allocation.staffName}-${idx}`}
              className="pb-3 border-b border-tap-line last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-tap-text">{allocation.staffName}</div>
                  <div className="text-xs text-tap-muted">{allocation.role}</div>
                </div>
                <div className="text-xs text-tap-muted font-mono">
                  {allocation.activeCampaigns.length}{' '}
                  {allocation.activeCampaigns.length === 1 ? 'campaign' : 'campaigns'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-tap-bg rounded-full overflow-hidden border border-tap-line">
                  <div
                    className={`h-full ${getWorkloadColour(allocation.workloadScore)} transition-all duration-300`}
                    style={{ width: `${Math.min(allocation.workloadScore, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-tap-text w-12 text-right">
                  {allocation.workloadScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      {overloadedStaff.length > 0 && (
        <div className="bg-tap-panel border border-tap-line rounded-lg p-5">
          <h3 className="text-sm font-heading font-medium text-tap-text mb-3 uppercase tracking-wide">
            Workload Recommendations
          </h3>
          <div className="space-y-3">
            {overloadedStaff.map((staff, idx) => (
              <div key={idx} className="p-3 bg-tap-bg rounded-md border border-tap-line">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-full bg-tap-risk rounded-full min-h-[2rem]"></div>
                  <div>
                    <p className="text-sm text-tap-text font-medium">
                      Reassign 1 campaign from {staff.staffName.split(' ')[0]}
                    </p>
                    <p className="text-xs text-tap-muted mt-1 leading-relaxed">
                      Current load is{' '}
                      <span className="font-mono text-tap-risk">{staff.workloadScore}%</span>.
                      Suggest moving "{staff.activeCampaigns[0]}" to a team member with capacity.
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

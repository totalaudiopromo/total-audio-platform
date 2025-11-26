import { MONDAY_TIMELINES, MONDAY_ALLOCATIONS } from '@/lib/constants';
import type { MondayTimeline, MondayAllocation } from '@/lib/types';

const USE_MOCKS = !process.env.NEXT_PUBLIC_ENABLE_LIVE_API;

export async function fetchAgencyTimelines(): Promise<MondayTimeline[]> {
  if (USE_MOCKS) {
    // Return mock timelines sorted by start date
    return MONDAY_TIMELINES.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  try {
    const res = await fetch('/api/monday?type=timelines');
    if (!res.ok) throw new Error('Monday API error');
    const data = await res.json();
    return data.sort(
      (a: MondayTimeline, b: MondayTimeline) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  } catch (err) {
    console.warn('[Monday.com] Timelines failed, falling back to mocks', err);
    return MONDAY_TIMELINES.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }
}

export async function fetchStaffAllocations(): Promise<MondayAllocation[]> {
  if (USE_MOCKS) {
    // Return mock allocations sorted by workload score descending
    return MONDAY_ALLOCATIONS.sort((a, b) => b.workloadScore - a.workloadScore);
  }

  try {
    const res = await fetch('/api/monday?type=allocations');
    if (!res.ok) throw new Error('Monday API error');
    const data = await res.json();
    return data.sort(
      (a: MondayAllocation, b: MondayAllocation) => b.workloadScore - a.workloadScore
    );
  } catch (err) {
    console.warn('[Monday.com] Allocations failed, falling back to mocks', err);
    return MONDAY_ALLOCATIONS.sort((a, b) => b.workloadScore - a.workloadScore);
  }
}

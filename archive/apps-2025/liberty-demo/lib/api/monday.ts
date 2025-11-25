import { tapFetch } from '../httpClient';
import { MONDAY_TIMELINES, MONDAY_ALLOCATIONS } from '@/lib/constants';
import type { MondayTimeline, MondayAllocation } from '@/lib/types';

const USE_MOCKS = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchAgencyTimelines(): Promise<MondayTimeline[]> {
  if (USE_MOCKS) {
    // Return mock timelines sorted by start date
    return MONDAY_TIMELINES.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  try {
    // TODO: Replace with actual Monday.com API endpoint
    return await tapFetch<MondayTimeline[]>('/monday/timelines');
  } catch (err) {
    console.warn('[TAP API] Monday.com timelines failed, falling back to mocks', err);
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
    // TODO: Replace with actual Monday.com API endpoint
    return await tapFetch<MondayAllocation[]>('/monday/allocations');
  } catch (err) {
    console.warn('[TAP API] Monday.com allocations failed, falling back to mocks', err);
    return MONDAY_ALLOCATIONS.sort((a, b) => b.workloadScore - a.workloadScore);
  }
}

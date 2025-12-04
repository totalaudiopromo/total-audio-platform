import { MONDAY_TIMELINES, MONDAY_ALLOCATIONS } from '@/lib/constants';
import type { MondayTimeline, MondayAllocation } from '@/lib/types';

const USE_MOCKS = !process.env.NEXT_PUBLIC_ENABLE_LIVE_API;

// Chris Radio Campaign type
export interface ChrisRadioCampaign {
  id: string;
  name: string;
  source: string;
  releaseDate: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'done' | 'pending';
  reportLink: string | null;
}

// Mock data for Chris's radio campaigns
const MOCK_CHRIS_CAMPAIGNS: ChrisRadioCampaign[] = [
  {
    id: 'mock-1',
    name: 'KYARA - Bloodshot',
    source: 'Liberty',
    releaseDate: '2025-10-14',
    startDate: '2025-09-29',
    endDate: '2025-11-11',
    status: 'active',
    reportLink: null,
  },
  {
    id: 'mock-2',
    name: 'Senior Dunce - Bestial',
    source: 'Liberty',
    releaseDate: '2025-08-26',
    startDate: '2025-08-26',
    endDate: '2025-09-30',
    status: 'done',
    reportLink: null,
  },
  {
    id: 'mock-3',
    name: 'WARM Report - 285 Plays',
    source: 'Liberty',
    releaseDate: '2024-07-08',
    startDate: '2024-07-08',
    endDate: '2024-08-26',
    status: 'done',
    reportLink: 'https://drive.google.com/file/d/example',
  },
];

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

/**
 * Fetch Chris's radio campaigns from Monday.com
 */
export async function fetchChrisRadioCampaigns(): Promise<ChrisRadioCampaign[]> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CHRIS_CAMPAIGNS;
  }

  try {
    const res = await fetch('/api/monday?type=chris-radio');
    if (!res.ok) throw new Error('Monday API error: ' + res.status);
    const data = await res.json();
    // Sort by status (active first) then by end date
    return data.sort((a: ChrisRadioCampaign, b: ChrisRadioCampaign) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return new Date(b.endDate || 0).getTime() - new Date(a.endDate || 0).getTime();
    });
  } catch (err) {
    console.warn('[Monday.com] Chris radio campaigns failed, falling back to mocks', err);
    return MOCK_CHRIS_CAMPAIGNS;
  }
}

/**
 * Format campaign date range
 */
export function formatCampaignDateRange(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return 'No dates set';
  if (!startDate) return `Until ${formatDate(endDate)}`;
  if (!endDate) return `From ${formatDate(startDate)}`;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Format a single date
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/**
 * Calculate campaign progress percentage
 */
export function calculateCampaignProgress(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();

  if (now < start) return 0;
  if (now > end) return 100;

  return Math.round(((now - start) / (end - start)) * 100);
}

/**
 * Get status colour for campaign
 */
export function getStatusColour(status: ChrisRadioCampaign['status']): string {
  switch (status) {
    case 'active':
      return 'bg-[#3AA9BE] text-white';
    case 'done':
      return 'bg-[#22C55E] text-white';
    case 'pending':
      return 'bg-[#A1A1A1] text-white';
    default:
      return 'bg-[#E8E6E1] text-[#737373]';
  }
}

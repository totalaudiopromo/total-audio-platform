import { tapFetch } from '../httpClient';
import type { WarmAgencySummary, WarmSpin } from '@/lib/types';
import { WARM_AGENCY_SUMMARY, WARM_SPINS_BY_CAMPAIGN } from '@/lib/constants';

const USE_MOCKS = true; // Force mocks for demo

export async function fetchWarmAgencySummary(agencyId: string): Promise<WarmAgencySummary[]> {
  if (USE_MOCKS) {
    // Return mock data sorted by total spins descending
    return WARM_AGENCY_SUMMARY.sort((a, b) => b.totalSpins - a.totalSpins);
  }

  try {
    // TODO: Replace with actual WARM API endpoint
    return await tapFetch<WarmAgencySummary[]>(
      `/warm/agency?agencyId=${encodeURIComponent(agencyId)}`
    );
  } catch (err) {
    console.warn('[TAP API] WARM agency summary failed, falling back to mocks', err);
    return WARM_AGENCY_SUMMARY.sort((a, b) => b.totalSpins - a.totalSpins);
  }
}

export async function fetchWarmSpinsForCampaign(campaignId: string): Promise<WarmSpin[]> {
  if (USE_MOCKS) {
    // Return mock spins for this campaign, sorted by time descending
    const spins = WARM_SPINS_BY_CAMPAIGN[campaignId] || [];
    return spins.sort((a, b) => new Date(b.spinTime).getTime() - new Date(a.spinTime).getTime());
  }

  try {
    // TODO: Replace with actual WARM API endpoint
    return await tapFetch<WarmSpin[]>(`/warm/campaign/${campaignId}/spins`);
  } catch (err) {
    console.warn('[TAP API] WARM campaign spins failed, falling back to mocks', err);
    const spins = WARM_SPINS_BY_CAMPAIGN[campaignId] || [];
    return spins.sort((a, b) => new Date(b.spinTime).getTime() - new Date(a.spinTime).getTime());
  }
}

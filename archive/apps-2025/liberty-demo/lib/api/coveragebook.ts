import { tapFetch } from '../httpClient';
import { COVERAGEBOOK_SUMMARIES } from '@/lib/constants';
import type { CoverageSummary } from '@/lib/types';

const USE_MOCKS = !process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCoverageSummaryForCampaign(
  campaignId: string
): Promise<CoverageSummary> {
  if (USE_MOCKS) {
    // Return mock data; fallback to empty object if not found
    return COVERAGEBOOK_SUMMARIES[campaignId] as CoverageSummary;
  }

  try {
    // TODO: replace with real endpoint
    return await tapFetch<CoverageSummary>(
      `/coveragebook/campaign/${encodeURIComponent(campaignId)}/summary`
    );
  } catch (err) {
    console.warn('[TAP API] CoverageBook fetch failed, using mock data', err);
    return COVERAGEBOOK_SUMMARIES[campaignId] as CoverageSummary;
  }
}

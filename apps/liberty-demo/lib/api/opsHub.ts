import { fetchCampaignDetail } from './tracker';
import { fetchCoverageSummaryForCampaign } from './coveragebook';
import { fetchWarmSpinsForCampaign } from './warm';
import { fetchRecentTypeformSubmissions } from './typeform';
import { fetchAgencyTimelines, fetchStaffAllocations } from './monday';
import { fetchPitchEventsForCampaign } from './pitch';
import { fetchAssetsForCampaign } from './drive';
import { buildOpsHubData, OpsHubData } from '../opsHubModel';

/**
 * Fetch all data required for the Ops Hub view for a specific campaign
 * Orchestrates parallel API calls and builds the unified view model
 */
export async function fetchOpsHubDataForCampaign(campaignId: string): Promise<OpsHubData> {
  try {
    // 1. Fetch campaign detail first (required)
    const campaign = await fetchCampaignDetail(campaignId);

    // 2. Fetch all supporting data in parallel
    const [
      coverageSummary,
      warmSpins,
      typeformSubmissions,
      mondayTimelines,
      mondayAllocations,
      pitchEvents,
      assets,
    ] = await Promise.all([
      fetchCoverageSummaryForCampaign(campaignId).catch(() => null),
      fetchWarmSpinsForCampaign(campaignId).catch(() => null),
      fetchRecentTypeformSubmissions().catch(() => null),
      fetchAgencyTimelines().catch(() => null),
      fetchStaffAllocations().catch(() => null),
      fetchPitchEventsForCampaign(campaignId).catch(() => null),
      fetchAssetsForCampaign(campaignId).catch(() => null),
    ]);

    // 3. Build the unified Ops Hub view model
    const opsHubData = buildOpsHubData({
      campaign,
      coverageSummary,
      warmSpins,
      typeformSubmissions,
      mondayTimelines,
      mondayAllocations,
      pitchEvents,
      assets,
    });

    return opsHubData;
  } catch (error) {
    console.error('[TAP API] Failed to fetch Ops Hub data:', error);
    throw error;
  }
}

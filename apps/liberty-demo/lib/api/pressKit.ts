/**
 * Liberty Press Kit API Adapter
 *
 * Mock-first pattern for generating press kits from campaign context
 */

import { buildPressKitFromContext, type PressKit } from '../pressKitModel';
import { fetchCampaignDetail } from './tracker';
import { fetchAssetsByCampaign, fetchPressProfileForAsset } from './drive';
import { WARM_AGENCY_SUMMARY, COVERAGEBOOK_SUMMARIES } from '@/lib/constants';
import type { WarmAgencySummary, CoverageSummary } from '@/lib/types';

/**
 * Generate a complete press kit for a campaign
 *
 * Combines:
 * - Campaign details (from tracker API)
 * - Press profile (from first press release asset)
 * - All campaign assets (from drive API)
 * - WARM radio data (from constants)
 * - CoverageBook press data (from constants)
 */
export async function generatePressKitForCampaign(campaignId: string): Promise<PressKit> {
  try {
    // 1. Fetch campaign detail to get artistId and context
    const campaign = await fetchCampaignDetail(campaignId);

    // Extract artistId (map from artistName if needed)
    // Campaign has artistName, need to find artistId
    let artistId: string = '';

    // Map campaign IDs to artist IDs based on constants
    const campaignToArtistMap: Record<string, string> = {
      c1: '1', // KYARA
      c2: '2', // Senior Dunce
      c3: '3', // Concerta
    };

    artistId = campaignToArtistMap[campaignId] || '1';

    // 2. Fetch all assets for this campaign
    const assets = await fetchAssetsByCampaign(campaignId);

    // 3. Find first press release asset and get its press profile
    const pressReleaseAsset = assets.find(
      a => a.folder === 'Press Releases' && (a.type === 'pdf' || a.type === 'other')
    );

    let pressProfile = null;
    if (pressReleaseAsset) {
      pressProfile = await fetchPressProfileForAsset(pressReleaseAsset.id);
    }

    // 4. Fetch WARM summary (from constants - mock data)
    const warmSummary: WarmAgencySummary | null =
      WARM_AGENCY_SUMMARY.find(w => w.artistId === artistId) || null;

    // 5. Fetch CoverageBook summary (from constants - mock data)
    const coverageSummary: CoverageSummary | null = COVERAGEBOOK_SUMMARIES[campaignId] || null;

    // 6. Build the press kit from all context
    const pressKit = buildPressKitFromContext({
      artistId,
      campaignId,
      pressProfile,
      assets,
      warmSummary,
      coverageSummary,
    });

    return pressKit;
  } catch (err) {
    console.warn('[Press Kit API] Failed to generate press kit, using minimal fallback', err);

    // Fallback: return minimal press kit
    return {
      id: `presskit_${campaignId}_${Date.now()}`,
      artistId: '1',
      campaignId,
      title: 'Press Kit',
      tagline: '',
      createdAt: new Date().toISOString(),
      sections: [],
    };
  }
}

/**
 * Generate a PDF export URL for the press kit
 * (Mock implementation)
 */
export async function exportPressKitPdf(pressKitId: string): Promise<string> {
  // Mock delay to simulate PDF generation
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real app, this would return a signed URL to the generated PDF
  return `https://liberty-demo.com/exports/press-kit-${pressKitId}.pdf`;
}

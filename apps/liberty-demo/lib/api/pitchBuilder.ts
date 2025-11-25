/**
 * Liberty Pitch Builder API Adapter
 *
 * Mock-first pattern for generating multi-segment pitches from campaign context
 */

import { buildPitchFromContext, type Pitch, type PitchType } from '../pitchBuilderModel';
import { generatePressKitForCampaign } from './pressKit';
import { fetchCampaignDetail } from './tracker';
import { fetchPitchEventsForCampaign } from './pitch';
import { fetchPriorityContacts } from './intel';
import { fetchAssetsByCampaign, fetchPressProfileForAsset } from './drive';
import { WARM_AGENCY_SUMMARY, COVERAGEBOOK_SUMMARIES, ARTISTS } from '@/lib/constants';
import type { WarmAgencySummary, CoverageSummary } from '@/lib/types';
import type { PressProfile } from '@/lib/constants/pressProfiles';
import { PRESS_PROFILES, ASSET_TO_PRESS_PROFILE } from '@/lib/constants/pressProfiles';

/**
 * Generate a pitch for a campaign and pitch type
 *
 * Combines:
 * - Campaign details (from tracker API)
 * - Press kit (from pressKit API)
 * - Press profile (from press release asset)
 * - WARM radio data (from constants)
 * - CoverageBook press data (from constants)
 * - Pitch event history (from pitch API)
 * - Priority contacts (from intel API)
 * - Campaign assets (from drive API)
 */
export async function generatePitchForCampaign(
  campaignId: string,
  type: PitchType
): Promise<Pitch> {
  try {
    // 1. Fetch campaign detail
    const campaign = await fetchCampaignDetail(campaignId);

    // 2. Derive artistId from campaign
    // Map campaign IDs to artist IDs based on constants
    const campaignToArtistMap: Record<string, string> = {
      c1: '1', // KYARA
      c2: '2', // Senior Dunce
      c3: '3', // Concerta
    };

    const artistId = campaignToArtistMap[campaignId] || '1';

    // 3. Fetch press kit via generatePressKitForCampaign
    const pressKit = await generatePressKitForCampaign(campaignId);

    // 4. Fetch all assets for this campaign
    const assets = await fetchAssetsByCampaign(campaignId);

    // 5. Fetch press profile from first press release asset
    const pressReleaseAsset = assets.find(
      a => a.folder === 'Press Releases' && (a.type === 'pdf' || a.type === 'other')
    );

    let pressProfile: PressProfile | null = null;
    if (pressReleaseAsset) {
      pressProfile = await fetchPressProfileForAsset(pressReleaseAsset.id);
    }

    // If no press profile from asset, try to find by artistId
    if (!pressProfile) {
      // Try to find press profile by artist name
      const artist = ARTISTS[artistId];
      if (artist) {
        const profileKey = Object.keys(PRESS_PROFILES).find(key => {
          const profile = PRESS_PROFILES[key];
          return profile.artist === artist.name;
        });
        if (profileKey) {
          pressProfile = PRESS_PROFILES[profileKey];
        }
      }
    }

    // 6. Fetch WARM summary (from constants - mock data)
    const warmSummary: WarmAgencySummary | null =
      WARM_AGENCY_SUMMARY.find(w => w.artistId === artistId) || null;

    // 7. Fetch CoverageBook summary (from constants - mock data)
    const coverageSummary: CoverageSummary | null = COVERAGEBOOK_SUMMARIES[campaignId] || null;

    // 8. Fetch pitch events for this campaign
    const pitchEvents = await fetchPitchEventsForCampaign(campaignId);

    // 9. Fetch priority contacts (optional, may filter by type later)
    let priorityContacts = null;
    try {
      priorityContacts = await fetchPriorityContacts();
      // Optionally filter by type if we have role information
      // For now, we'll use all contacts and let the model decide
    } catch (err) {
      console.warn('[Pitch Builder] Failed to fetch priority contacts, continuing without', err);
    }

    // 10. Build the pitch from all context
    const pitch = buildPitchFromContext({
      campaign,
      pressProfile,
      pressKit,
      warmSummary,
      coverageSummary,
      pitchEvents,
      priorityContacts,
      assets,
      type,
    });

    return pitch;
  } catch (err) {
    console.warn('[Pitch Builder] Failed to generate pitch, using minimal fallback', err);

    // Fallback: return minimal pitch
    const campaign = await fetchCampaignDetail(campaignId).catch(() => null);

    return {
      id: `pitch_${campaignId}_${type}_${Date.now()}`,
      campaignId,
      artistId: '1',
      type,
      subjectLine: campaign ? `${campaign.artistName} — ${campaign.campaignName}` : 'Pitch',
      greeting: 'Hi there',
      openingHook: campaign
        ? `We'd love to share ${campaign.artistName}'s latest work with you.`
        : `We'd love to share this with you.`,
      narrative: campaign
        ? `${campaign.artistName} is an emerging artist. Their latest campaign, "${campaign.campaignName}", represents a significant step forward.`
        : `We'd love to share this work with you.`,
      keyAngles: ['Strong momentum building', 'Tastemaker support', 'Essential listening'],
      stats: [],
      recommendedAssets: [],
      callToAction:
        'Would you consider featuring this? Happy to provide any additional materials or access.',
      targetSegmentLabel: 'Music industry contacts',
      createdAt: new Date().toISOString(),
    };
  }
}

/**
 * Send a pitch email to a contact
 * (Mock implementation)
 */
export async function sendPitchEmail(
  campaignId: string,
  contactId: string,
  pitch: Pitch
): Promise<{ success: boolean; eventId: string }> {
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real app, this would call the backend to send the email via SES/SendGrid
  // and log the event in the database.

  return {
    success: true,
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
}

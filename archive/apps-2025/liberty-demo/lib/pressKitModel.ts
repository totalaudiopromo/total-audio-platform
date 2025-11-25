/**
 * Liberty Press Kit Generator — Domain Model
 *
 * Assembles press-ready kits for artists/campaigns using:
 * - Press profiles (AI-generated summaries, angles, quotes)
 * - Drive assets (press releases, artwork, photos)
 * - Campaign context (timeline, momentum, coverage)
 * - WARM + CoverageBook data (radio spins, press mentions)
 */

import type { PressProfile } from './constants/pressProfiles';
import type { DriveAsset, WarmAgencySummary, CoverageSummary } from './types';
import { ARTISTS } from './constants';

export interface PressKitSection {
  id: string;
  title: string;
  body?: string;
  bullets?: string[];
  assets?: string[]; // assetIds
}

export interface PressKit {
  id: string;
  artistId: string;
  campaignId: string;
  title: string;
  tagline: string;
  createdAt: string;
  sections: PressKitSection[];
  primaryPressReleaseAssetId?: string;
  artworkAssetIds?: string[];
  photoAssetIds?: string[];
  links?: { label: string; url: string }[];
}

interface BuildPressKitArgs {
  artistId: string;
  campaignId: string;
  pressProfile: PressProfile | null;
  assets: DriveAsset[];
  warmSummary?: WarmAgencySummary | null;
  coverageSummary?: CoverageSummary | null;
}

/**
 * Build a complete press kit from available context
 */
export function buildPressKitFromContext(args: BuildPressKitArgs): PressKit {
  const { artistId, campaignId, pressProfile, assets, warmSummary, coverageSummary } = args;

  const artist = ARTISTS[artistId];
  const artistName = artist?.name || 'Unknown Artist';

  // Find primary press release
  const primaryPressRelease = assets.find(
    a => a.folder === 'Press Releases' && (a.type === 'pdf' || a.type === 'other')
  );

  // Find artwork assets
  const artworkAssets = assets.filter(a => a.folder === 'Artwork');

  // Find photo assets
  const photoAssets = assets.filter(a => a.folder === 'Photos');

  // Build sections
  const sections: PressKitSection[] = [];

  // 1. Artist Overview (from press profile)
  if (pressProfile) {
    sections.push({
      id: 'artist-overview',
      title: 'Artist Overview',
      body: pressProfile.shortSummary,
    });
  }

  // 2. Key Angles (from press profile)
  if (pressProfile?.keyAngles && pressProfile.keyAngles.length > 0) {
    sections.push({
      id: 'key-angles',
      title: 'Key Angles',
      bullets: pressProfile.keyAngles,
    });
  }

  // 3. Suggested Quotes (from press profile)
  if (pressProfile?.suggestedPullQuotes && pressProfile.suggestedPullQuotes.length > 0) {
    sections.push({
      id: 'suggested-quotes',
      title: 'Suggested Quotes',
      bullets: pressProfile.suggestedPullQuotes,
    });
  }

  // 4. Target Press Cluster (from press profile)
  if (pressProfile?.suggestedOutlets && pressProfile.suggestedOutlets.length > 0) {
    sections.push({
      id: 'target-press',
      title: 'Target Press Cluster',
      bullets: pressProfile.suggestedOutlets.slice(0, 10), // Top 10 outlets
    });
  }

  // 5. Campaign Momentum (from WARM + CoverageBook)
  const momentumBullets: string[] = [];

  if (warmSummary) {
    momentumBullets.push(
      `${warmSummary.totalSpins} radio spins across ${warmSummary.uniqueStations} stations`
    );
    if (warmSummary.topTerritories && warmSummary.topTerritories.length > 0) {
      momentumBullets.push(`Strong airplay in ${warmSummary.topTerritories.join(', ')}`);
    }
  }

  if (coverageSummary) {
    momentumBullets.push(
      `${coverageSummary.totalMentions} press mentions generating ${coverageSummary.estimatedViews.toLocaleString()} estimated views`
    );
    momentumBullets.push(`Average domain authority: ${coverageSummary.avgDomainAuthority}/100`);
    if (coverageSummary.topOutlets && coverageSummary.topOutlets.length > 0) {
      const topOutletNames = coverageSummary.topOutlets.map(o => o.name).join(', ');
      momentumBullets.push(`Featured in ${topOutletNames}`);
    }
  }

  if (momentumBullets.length > 0) {
    sections.push({
      id: 'campaign-momentum',
      title: 'Campaign Momentum',
      bullets: momentumBullets,
    });
  }

  // 6. Assets section
  const assetIds = assets.map(a => a.id);
  if (assetIds.length > 0) {
    sections.push({
      id: 'campaign-assets',
      title: 'Campaign Assets',
      body: `${assets.length} asset${assets.length !== 1 ? 's' : ''} available including press releases, artwork, photos, and audio files.`,
      assets: assetIds,
    });
  }

  // Build the complete press kit
  const pressKit: PressKit = {
    id: `presskit_${campaignId}_${Date.now()}`,
    artistId,
    campaignId,
    title: pressProfile?.headline || `${artistName} - Press Kit`,
    tagline: pressProfile?.title || artist?.genre || '',
    createdAt: new Date().toISOString(),
    sections,
    primaryPressReleaseAssetId: primaryPressRelease?.id,
    artworkAssetIds: artworkAssets.map(a => a.id),
    photoAssetIds: photoAssets.map(a => a.id),
    links: [
      // Placeholder for streaming/social links
      // In production, these would come from artist profile or campaign data
    ],
  };

  return pressKit;
}

/**
 * Format a press kit section for display
 */
export function formatPressKitSection(section: PressKitSection): string {
  let output = `## ${section.title}\n\n`;

  if (section.body) {
    output += `${section.body}\n\n`;
  }

  if (section.bullets && section.bullets.length > 0) {
    section.bullets.forEach(bullet => {
      output += `- ${bullet}\n`;
    });
    output += '\n';
  }

  return output;
}

/**
 * Generate a plain text version of the press kit
 */
export function exportPressKitAsText(pressKit: PressKit): string {
  let output = '';

  output += `# ${pressKit.title}\n`;
  if (pressKit.tagline) {
    output += `${pressKit.tagline}\n`;
  }
  output += `\n`;
  output += `Generated: ${new Date(pressKit.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}\n`;
  output += `\n---\n\n`;

  pressKit.sections.forEach(section => {
    output += formatPressKitSection(section);
  });

  return output;
}

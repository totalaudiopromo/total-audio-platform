/**
 * Liberty Pitch Builder — Domain Model
 *
 * Generates multi-segment pitches by combining:
 * - Press profiles (headlines, angles, quotes)
 * - Press kits (sections, assets)
 * - Campaign context (momentum, stats)
 * - WARM + CoverageBook data (radio spins, press coverage)
 * - Pitch event history (open/reply rates)
 * - Priority contacts (target segment identification)
 */

import type { PressProfile } from './constants/pressProfiles';
import type { PressKit } from './pressKitModel';
import type {
  TrackerCampaignDetail,
  PitchEvent,
  IntelContact,
  WarmAgencySummary,
  CoverageSummary,
  DriveAsset,
} from './types';
import { ARTISTS } from './constants';

export type PitchType = 'radio' | 'editorial' | 'blogs' | 'playlists' | 'sync' | 'brand';

export interface PitchStat {
  label: string;
  value: string;
  context?: string;
}

export interface PitchAssetRef {
  assetId: string;
  label: string;
  kind: 'press-release' | 'artwork' | 'photo' | 'link' | 'audio';
}

export interface Pitch {
  id: string;
  campaignId: string;
  artistId: string;
  type: PitchType;
  subjectLine: string;
  greeting: string;
  openingHook: string;
  narrative: string;
  keyAngles: string[];
  stats: PitchStat[];
  recommendedAssets: PitchAssetRef[];
  callToAction: string;
  followUpNote?: string;
  targetSegmentLabel: string;
  createdAt: string;
}

export interface PitchContext {
  campaign: TrackerCampaignDetail;
  pressProfile: PressProfile | null;
  pressKit: PressKit | null;
  warmSummary?: WarmAgencySummary | null;
  coverageSummary?: CoverageSummary | null;
  pitchEvents?: PitchEvent[] | null;
  priorityContacts?: IntelContact[] | null;
  assets?: DriveAsset[];
  type: PitchType;
}

/**
 * Build a pitch from available context
 *
 * Uses deterministic templates and context-aware copy generation.
 * Not a full LLM—just structured content building with smart defaults.
 */
export function buildPitchFromContext(ctx: PitchContext): Pitch {
  const {
    campaign,
    pressProfile,
    pressKit,
    warmSummary,
    coverageSummary,
    pitchEvents,
    priorityContacts,
    assets,
    type,
  } = ctx;

  const artist = ARTISTS[campaign.id] || ARTISTS['1']; // Fallback to first artist
  const artistId = Object.keys(ARTISTS).find(id => ARTISTS[id].name === campaign.artistName) || '1';

  // Derive subject line per pitch type
  const subjectLine = deriveSubjectLine(type, campaign, pressProfile, warmSummary ?? null);

  // Build greeting (formal but friendly)
  const greeting = `Hi ${getGreetingName(type)}`;

  // Opening hook (engaging, type-specific)
  const openingHook = deriveOpeningHook(type, campaign, pressProfile, warmSummary ?? null);

  // Narrative (main body)
  const narrative = buildNarrative(
    type,
    campaign,
    pressProfile,
    pressKit,
    warmSummary ?? null,
    coverageSummary ?? null
  );

  // Key angles (from press profile, filtered/enriched by type)
  const keyAngles = deriveKeyAngles(type, pressProfile, pressKit);

  // Stats section
  const stats = buildStats(
    campaign,
    warmSummary ?? null,
    coverageSummary ?? null,
    pitchEvents ?? null,
    type
  );

  // Recommended assets
  const recommendedAssets = buildRecommendedAssets(assets || [], pressKit, type);

  // Call to action
  const callToAction = deriveCallToAction(type);

  // Follow-up note (optional)
  const followUpNote = deriveFollowUpNote(type, campaign);

  // Target segment label
  const targetSegmentLabel = deriveTargetSegmentLabel(type, priorityContacts ?? null, campaign);

  return {
    id: `pitch_${campaign.id}_${type}_${Date.now()}`,
    campaignId: campaign.id,
    artistId,
    type,
    subjectLine,
    greeting,
    openingHook,
    narrative,
    keyAngles,
    stats,
    recommendedAssets,
    callToAction,
    followUpNote,
    targetSegmentLabel,
    createdAt: new Date().toISOString(),
  };
}

// ===== Subject Line Generation =====

function deriveSubjectLine(
  type: PitchType,
  campaign: TrackerCampaignDetail,
  pressProfile: PressProfile | null,
  warmSummary: WarmAgencySummary | null
): string {
  const artistName = campaign.artistName;
  const trackName = campaign.campaignName.split(' - ')[1] || campaign.campaignName;

  switch (type) {
    case 'radio':
      if (warmSummary) {
        return `${artistName} — ${warmSummary.totalSpins} spins across ${warmSummary.uniqueStations} stations | New: ${trackName}`;
      }
      return `${artistName} — New Track: ${trackName} | BBC 6 Music support building`;

    case 'editorial':
      if (pressProfile?.headline) {
        return `${pressProfile.headline}`;
      }
      return `${artistName} Returns with "${trackName}" — ${pressProfile?.shortSummary.slice(0, 50) || 'Latest single'}...`;

    case 'blogs':
      return `${artistName} — "${trackName}" | ${pressProfile?.keyAngles[0]?.slice(0, 40) || 'New single out now'}...`;

    case 'playlists':
      return `${artistName} — ${trackName} | ${warmSummary ? `${warmSummary.totalSpins} radio spins` : 'Fresh alt-pop'}`;

    case 'sync':
      return `${artistName} — "${trackName}" | Cinematic alt-pop for sync opportunities`;

    case 'brand':
      return `${artistName} — Visual identity & brand partnership opportunities | ${trackName}`;

    default:
      return `${artistName} — ${trackName}`;
  }
}

// ===== Greeting =====

function getGreetingName(type: PitchType): string {
  switch (type) {
    case 'radio':
      return 'team';
    case 'editorial':
      return 'there';
    case 'blogs':
      return 'team';
    case 'playlists':
      return 'curator';
    case 'sync':
      return 'team';
    case 'brand':
      return 'team';
    default:
      return 'there';
  }
}

// ===== Opening Hook =====

function deriveOpeningHook(
  type: PitchType,
  campaign: TrackerCampaignDetail,
  pressProfile: PressProfile | null,
  warmSummary: WarmAgencySummary | null
): string {
  switch (type) {
    case 'radio':
      if (warmSummary) {
        return `"${warmSummary.trackName}" is already seeing strong rotation across ${warmSummary.uniqueStations} stations, with momentum building in ${warmSummary.topTerritories.join(', ')}.`;
      }
      return `We're excited to share ${campaign.artistName}'s latest, "${campaign.campaignName.split(' - ')[1] || campaign.campaignName}", which we believe fits perfectly with your programming.`;

    case 'editorial':
      if (pressProfile?.headline) {
        return pressProfile.headline;
      }
      return `We'd love to share ${campaign.artistName}'s latest single, "${campaign.campaignName.split(' - ')[1] || campaign.campaignName}", which we believe deserves coverage.`;

    case 'blogs':
      if (pressProfile?.shortSummary) {
        return pressProfile.shortSummary.slice(0, 120) + '...';
      }
      return `Hot off the press: ${campaign.artistName}'s new track is already generating buzz.`;

    case 'playlists':
      if (warmSummary) {
        return `"${warmSummary.trackName}" has racked up ${warmSummary.totalSpins} radio spins and is perfect for your playlist.`;
      }
      return `Fresh alt-pop from ${campaign.artistName} — perfect for your next playlist update.`;

    case 'sync':
      return `We're offering exclusive sync opportunities for ${campaign.artistName}'s "${campaign.campaignName.split(' - ')[1] || campaign.campaignName}" — ideal for cinematic and brand campaigns.`;

    case 'brand':
      return `We're exploring brand partnership opportunities for ${campaign.artistName}, whose visual identity and audience align perfectly with forward-thinking brands.`;

    default:
      return `We'd love to share ${campaign.artistName}'s latest work with you.`;
  }
}

// ===== Narrative =====

function buildNarrative(
  type: PitchType,
  campaign: TrackerCampaignDetail,
  pressProfile: PressProfile | null,
  pressKit: PressKit | null,
  warmSummary: WarmAgencySummary | null,
  coverageSummary: CoverageSummary | null
): string {
  let narrative = '';

  // Base narrative from press profile or campaign
  if (pressProfile?.shortSummary) {
    narrative += pressProfile.shortSummary + '\n\n';
  } else if (pressKit?.sections.find(s => s.id === 'artist-overview')?.body) {
    narrative += pressKit.sections.find(s => s.id === 'artist-overview')!.body! + '\n\n';
  } else {
    narrative += `${campaign.artistName} is ${ARTISTS[Object.keys(ARTISTS).find(id => ARTISTS[id].name === campaign.artistName) || '1']?.genre || 'an emerging artist'}. `;
    narrative += `Their latest campaign, "${campaign.campaignName}", represents a significant step forward.\n\n`;
  }

  // Type-specific additions
  switch (type) {
    case 'radio':
      if (warmSummary) {
        narrative += `Radio support is already building, with ${warmSummary.totalSpins} spins across ${warmSummary.uniqueStations} stations in ${warmSummary.topTerritories.join(', ')}. `;
        narrative += `The track is proving a strong fit for daytime and specialist programming alike.\n\n`;
      }
      if (coverageSummary) {
        narrative += `Press coverage is also strong, with ${coverageSummary.totalMentions} mentions generating ${coverageSummary.estimatedViews.toLocaleString()} estimated views. `;
      }
      narrative += `We'd be grateful for consideration for your playlist.\n\n`;
      break;

    case 'editorial':
      if (pressProfile?.keyAngles && pressProfile.keyAngles.length > 0) {
        narrative += `Key angles for coverage:\n`;
        pressProfile.keyAngles.slice(0, 3).forEach((angle, idx) => {
          narrative += `• ${angle}\n`;
        });
        narrative += '\n';
      }
      if (coverageSummary?.topOutlets && coverageSummary.topOutlets.length > 0) {
        const outletNames = coverageSummary.topOutlets.map(o => o.name).join(', ');
        narrative += `Early coverage includes features in ${outletNames}.\n\n`;
      }
      narrative += `We'd love to discuss interview opportunities or exclusive features.\n\n`;
      break;

    case 'blogs':
      if (pressProfile?.suggestedPullQuotes && pressProfile.suggestedPullQuotes.length > 0) {
        narrative += `Pull quote: "${pressProfile.suggestedPullQuotes[0]}"\n\n`;
      }
      narrative += `Would you consider covering this for your blog?\n\n`;
      break;

    case 'playlists':
      if (warmSummary) {
        narrative += `Radio momentum: ${warmSummary.totalSpins} spins, strong engagement. `;
      }
      narrative += `The track is perfect for your ${type === 'playlists' ? 'playlist' : 'show'} and aligns with artists like [comparable artists from press profile if available].\n\n`;
      break;

    case 'sync':
      narrative += `The track's cinematic quality and emotional depth make it ideal for sync placements in film, TV, and brand campaigns. `;
      narrative += `We're offering exclusive opportunities for forward-thinking creative projects.\n\n`;
      break;

    case 'brand':
      narrative += `With a growing audience of ${ARTISTS[Object.keys(ARTISTS).find(id => ARTISTS[id].name === campaign.artistName) || '1']?.stats.followers || 'engaged fans'} and strong visual identity, `;
      narrative += `${campaign.artistName} offers authentic brand partnership opportunities.\n\n`;
      break;
  }

  return narrative.trim();
}

// ===== Key Angles =====

function deriveKeyAngles(
  type: PitchType,
  pressProfile: PressProfile | null,
  pressKit: PressKit | null
): string[] {
  const angles: string[] = [];

  if (pressProfile?.keyAngles) {
    // Filter/prioritise angles by type
    switch (type) {
      case 'radio':
        // Focus on momentum, BBC support, station fit
        angles.push(
          ...pressProfile.keyAngles
            .filter(
              a =>
                a.toLowerCase().includes('bbc') ||
                a.toLowerCase().includes('radio') ||
                a.toLowerCase().includes('support') ||
                a.toLowerCase().includes('momentum')
            )
            .slice(0, 3)
        );
        if (angles.length === 0) angles.push(...pressProfile.keyAngles.slice(0, 3));
        break;

      case 'editorial':
      case 'blogs':
        // Use all key angles
        angles.push(...pressProfile.keyAngles.slice(0, 4));
        break;

      case 'playlists':
        // Focus on streaming, comparable artists, mood
        angles.push(...pressProfile.keyAngles.slice(0, 3));
        break;

      default:
        angles.push(...pressProfile.keyAngles.slice(0, 3));
    }
  }

  // Fallback to press kit if needed
  if (angles.length === 0 && pressKit?.sections.find(s => s.id === 'key-angles')?.bullets) {
    angles.push(...pressKit.sections.find(s => s.id === 'key-angles')!.bullets!.slice(0, 3));
  }

  return angles.length > 0
    ? angles
    : ['Strong momentum building', 'Tastemaker support', 'Essential listening'];
}

// ===== Stats =====

function buildStats(
  campaign: TrackerCampaignDetail,
  warmSummary: WarmAgencySummary | null,
  coverageSummary: CoverageSummary | null,
  pitchEvents: PitchEvent[] | null,
  type: PitchType
): PitchStat[] {
  const stats: PitchStat[] = [];

  // Campaign momentum
  stats.push({
    label: 'Campaign Momentum',
    value: `${campaign.momentum}%`,
    context: campaign.status === 'active' ? 'Active campaign' : undefined,
  });

  // Radio spins (for radio pitches)
  if (type === 'radio' && warmSummary) {
    stats.push({
      label: 'Radio Spins',
      value: `${warmSummary.totalSpins}`,
      context: `Across ${warmSummary.uniqueStations} stations`,
    });
  }

  // Press coverage (for editorial/blogs)
  if ((type === 'editorial' || type === 'blogs') && coverageSummary) {
    stats.push({
      label: 'Press Mentions',
      value: `${coverageSummary.totalMentions}`,
      context: `${coverageSummary.estimatedViews.toLocaleString()} estimated views`,
    });
  }

  // Pitch performance (if available)
  if (pitchEvents && pitchEvents.length > 0) {
    const opened = pitchEvents.filter(e => e.status === 'opened' || e.status === 'replied').length;
    const replied = pitchEvents.filter(e => e.status === 'replied').length;
    const openRate = Math.round((opened / pitchEvents.length) * 100);
    const replyRate = Math.round((replied / pitchEvents.length) * 100);

    stats.push({
      label: 'Campaign Open Rate',
      value: `${openRate}%`,
      context: replyRate > 0 ? `${replyRate}% reply rate` : undefined,
    });
  }

  // Health score
  if (campaign.health > 0) {
    stats.push({
      label: 'Health Score',
      value: `${campaign.health}%`,
    });
  }

  return stats;
}

// ===== Recommended Assets =====

function buildRecommendedAssets(
  assets: DriveAsset[],
  pressKit: PressKit | null,
  type: PitchType
): PitchAssetRef[] {
  const refs: PitchAssetRef[] = [];

  // Press release (always recommended)
  const pressRelease = assets.find(
    a => a.folder === 'Press Releases' && (a.type === 'pdf' || a.type === 'other')
  );
  if (pressRelease) {
    refs.push({
      assetId: pressRelease.id,
      label: 'Press Release PDF',
      kind: 'press-release',
    });
  }

  // Type-specific assets
  switch (type) {
    case 'radio':
      // Audio file
      const audio = assets.find(a => a.folder === 'Audio Assets');
      if (audio) {
        refs.push({
          assetId: audio.id,
          label: 'Radio Edit (WAV)',
          kind: 'audio',
        });
      }
      break;

    case 'editorial':
    case 'blogs':
      // Photos + artwork
      const artwork = assets.find(a => a.folder === 'Artwork');
      if (artwork) {
        refs.push({
          assetId: artwork.id,
          label: 'Single Artwork (Hi-Res)',
          kind: 'artwork',
        });
      }
      const photos = assets.find(a => a.folder === 'Photos');
      if (photos) {
        refs.push({
          assetId: photos.id,
          label: 'Press Photos',
          kind: 'photo',
        });
      }
      break;

    case 'playlists':
      // Audio + artwork
      const audio2 = assets.find(a => a.folder === 'Audio Assets');
      const artwork2 = assets.find(a => a.folder === 'Artwork');
      if (audio2) {
        refs.push({
          assetId: audio2.id,
          label: 'Track (WAV/MP3)',
          kind: 'audio',
        });
      }
      if (artwork2) {
        refs.push({
          assetId: artwork2.id,
          label: 'Cover Art',
          kind: 'artwork',
        });
      }
      break;

    case 'sync':
    case 'brand':
      // All visual assets
      const artwork3 = assets.find(a => a.folder === 'Artwork');
      const photos3 = assets.find(a => a.folder === 'Photos');
      if (artwork3) {
        refs.push({
          assetId: artwork3.id,
          label: 'Visual Identity Package',
          kind: 'artwork',
        });
      }
      if (photos3) {
        refs.push({
          assetId: photos3.id,
          label: 'Brand Assets',
          kind: 'photo',
        });
      }
      break;
  }

  return refs;
}

// ===== Call to Action =====

function deriveCallToAction(type: PitchType): string {
  switch (type) {
    case 'radio':
      return 'Would you consider adding this to your rotation? Happy to provide the radio edit and any additional materials.';

    case 'editorial':
      return `Would you be interested in covering this, or perhaps arranging an interview? We're flexible on exclusivity and timing.`;

    case 'blogs':
      return `Would you consider featuring this on your blog? Happy to provide quotes, high-res images, and interview access.`;

    case 'playlists':
      return `Would you consider adding this to your playlist? The track is already seeing strong engagement and radio support.`;

    case 'sync':
      return `Would you like to hear more about sync opportunities? We're open to exclusive placements for the right projects.`;

    case 'brand':
      return `Would you be interested in exploring brand partnership opportunities? We'd love to discuss how we can work together.`;

    default:
      return `Would you consider featuring this? Happy to provide any additional materials or access.`;
  }
}

// ===== Follow-up Note =====

function deriveFollowUpNote(type: PitchType, campaign: TrackerCampaignDetail): string | undefined {
  if (campaign.status !== 'active') {
    return undefined;
  }

  switch (type) {
    case 'radio':
      return 'Available for radio interviews and live sessions if helpful.';
    case 'editorial':
      return 'Interview availability: flexible on timing and format.';
    default:
      return undefined;
  }
}

// ===== Target Segment Label =====

function deriveTargetSegmentLabel(
  type: PitchType,
  priorityContacts: IntelContact[] | null,
  campaign: TrackerCampaignDetail
): string {
  if (!priorityContacts || priorityContacts.length === 0) {
    // Fallback generic labels
    switch (type) {
      case 'radio':
        return 'UK & Ireland radio pluggers';
      case 'editorial':
        return 'Alt-pop editorial contacts';
      case 'blogs':
        return 'Music blog curators';
      case 'playlists':
        return 'Spotify playlist curators';
      case 'sync':
        return 'Music supervisors & sync agencies';
      case 'brand':
        return 'Brand partnership managers';
      default:
        return 'Music industry contacts';
    }
  }

  // Analyse contacts to derive segment
  const roles = priorityContacts.map(c => c.role);
  const outlets = priorityContacts.map(c => c.outlet);

  // Group by type
  const radioCount = roles.filter(r => r === 'Radio').length;
  const pressCount = roles.filter(r => r === 'Press').length;
  const playlistCount = roles.filter(r => r === 'Playlist').length;

  switch (type) {
    case 'radio':
      if (radioCount > 0) {
        return `UK radio pluggers (${radioCount} priority contacts)`;
      }
      return 'UK & Ireland radio stations';

    case 'editorial':
      if (pressCount > 0) {
        const topOutlets = [...new Set(outlets)].slice(0, 3).join(', ');
        return `Alt-pop editorial (${pressCount} contacts: ${topOutlets})`;
      }
      return 'Alt-pop editorial contacts';

    case 'blogs':
      if (pressCount > 0) {
        return `Music blogs (${pressCount} contacts)`;
      }
      return 'Music blog curators';

    case 'playlists':
      if (playlistCount > 0) {
        return `Spotify playlist curators (${playlistCount} contacts)`;
      }
      return 'Playlist curators';

    case 'sync':
      return 'Music supervisors & sync agencies';

    case 'brand':
      return 'Brand partnership managers';

    default:
      return 'Music industry contacts';
  }
}

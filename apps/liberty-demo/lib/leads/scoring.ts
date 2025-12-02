/**
 * Lead Scoring Algorithm
 * Calculates a 0-100 score based on timing, momentum, fit, and availability
 */

import type { Lead, LeadSignal, ScoreBreakdown } from './types';

// Genre fit - genres that work well for PR campaigns
const FIT_GENRES = [
  'indie',
  'alternative',
  'electronic',
  'synth',
  'dream pop',
  'shoegaze',
  'post-punk',
  'indie rock',
  'indie pop',
  'bedroom pop',
  'folk',
  'singer-songwriter',
  'post-rock',
  'ambient',
  'neo-soul',
  'art pop',
  'synthwave',
  'chillwave',
];

// Major market locations
const MAJOR_MARKETS = [
  // North America
  'usa',
  'canada',
  'los angeles',
  'new york',
  'brooklyn',
  'nashville',
  'austin',
  'portland',
  'vancouver',
  'toronto',
  // Europe
  'uk',
  'london',
  'manchester',
  'bristol',
  'glasgow',
  'dublin',
  'ireland',
  'berlin',
  'germany',
  'paris',
  'france',
  'stockholm',
  'sweden',
  'copenhagen',
  'denmark',
  'reykjavik',
  'iceland',
  'amsterdam',
  'netherlands',
  // Asia Pacific
  'melbourne',
  'australia',
  'tokyo',
  'japan',
  'seoul',
  'korea',
];

/**
 * Calculate days between two dates
 */
function daysBetween(from: Date, to: Date): number {
  const diffTime = to.getTime() - from.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate timing score (max 25 points)
 * Based on upcoming release date proximity
 */
function calculateTimingScore(lead: Partial<Lead>): number {
  if (!lead.upcomingReleaseDate) {
    return 5; // Some credit for having a track record
  }

  const releaseDate = new Date(lead.upcomingReleaseDate);
  const now = new Date();
  const daysUntil = daysBetween(now, releaseDate);

  // Release has passed
  if (daysUntil < 0) {
    return 5;
  }

  // Imminent release (within 2 weeks) - highest score
  if (daysUntil <= 14) {
    return 25;
  }

  // Within 1 month - very good
  if (daysUntil <= 30) {
    return 22;
  }

  // Within 2 months - good
  if (daysUntil <= 60) {
    return 18;
  }

  // Within 3 months - decent
  if (daysUntil <= 90) {
    return 12;
  }

  // More than 3 months out
  return 8;
}

/**
 * Calculate momentum score (max 25 points)
 * Based on streaming numbers and source quality
 */
function calculateMomentumScore(lead: Partial<Lead>): number {
  let score = 0;

  // Spotify monthly listeners scoring
  const listeners = lead.spotifyMonthlyListeners || 0;
  if (listeners >= 100000) {
    score += 8; // Very established
  } else if (listeners >= 50000) {
    score += 12; // Strong but still emerging
  } else if (listeners >= 20000) {
    score += 15; // Sweet spot - growing fast
  } else if (listeners >= 10000) {
    score += 12; // Good traction
  } else if (listeners >= 5000) {
    score += 10; // Building
  } else if (listeners >= 1000) {
    score += 6; // Early stage
  } else {
    score += 2; // Very early
  }

  // Source quality bonus
  const sourceSignals = lead.signals?.filter(s => s.type === 'source') || [];
  if (sourceSignals.some(s => s.label.toLowerCase().includes('hype machine'))) {
    score += 5;
  }
  if (
    sourceSignals.some(
      s => s.label.toLowerCase().includes('spotify') && s.label.toLowerCase().includes('editorial')
    )
  ) {
    score += 5;
  }
  if (
    sourceSignals.some(
      s => s.label.toLowerCase().includes('bandcamp') && s.label.toLowerCase().includes('staff')
    )
  ) {
    score += 4;
  }

  // Social momentum (Instagram as proxy)
  const igFollowers = lead.instagramFollowers || 0;
  if (igFollowers >= 50000) {
    score += 3;
  } else if (igFollowers >= 20000) {
    score += 2;
  } else if (igFollowers >= 10000) {
    score += 1;
  }

  return Math.min(25, score);
}

/**
 * Calculate fit score (max 25 points)
 * Based on genre and location match
 */
function calculateFitScore(lead: Partial<Lead>): number {
  let score = 0;

  // Genre fit
  const genre = (lead.genre || '').toLowerCase();
  const hasGenreFit = FIT_GENRES.some(g => genre.includes(g));
  if (hasGenreFit) {
    score += 15;
  } else {
    score += 5; // Some credit for any artist
  }

  // Location fit
  const location = (lead.location || '').toLowerCase();
  const hasMajorMarket = MAJOR_MARKETS.some(m => location.includes(m));
  if (hasMajorMarket) {
    score += 10;
  } else {
    score += 3; // Some credit for any location
  }

  return Math.min(25, score);
}

/**
 * Calculate availability score (max 25 points)
 * Based on PR representation status
 */
function calculateAvailabilityScore(lead: Partial<Lead>): number {
  switch (lead.prConfidence) {
    case 'unlikely':
      return 25; // Best - no PR detected
    case 'unknown':
      return 20; // Good - worth investigating
    case 'likely':
      return 8; // Might have PR but not confirmed
    case 'confirmed':
      return 0; // Already has PR
    default:
      return 15; // Default if not set
  }
}

/**
 * Generate lead signals based on data
 */
export function generateSignals(lead: Partial<Lead>): LeadSignal[] {
  const signals: LeadSignal[] = [];

  // Release timing signal
  if (lead.upcomingReleaseDate) {
    const releaseDate = new Date(lead.upcomingReleaseDate);
    const now = new Date();
    const daysUntil = daysBetween(now, releaseDate);

    if (daysUntil > 0 && daysUntil <= 90) {
      const releaseType = lead.upcomingReleaseTitle?.toLowerCase().includes('ep')
        ? 'EP'
        : lead.upcomingReleaseTitle?.toLowerCase().includes('album')
          ? 'Album'
          : 'Single';
      signals.push({
        type: 'release',
        label: `${releaseType} in ${daysUntil} days`,
        positive: daysUntil <= 45,
      });
    }
  }

  // Momentum signals
  if (lead.spotifyMonthlyListeners) {
    const listeners = lead.spotifyMonthlyListeners;
    if (listeners >= 50000) {
      signals.push({
        type: 'momentum',
        label: `${Math.round(listeners / 1000)}k monthly listeners`,
        positive: true,
      });
    } else if (listeners >= 10000) {
      signals.push({
        type: 'momentum',
        label: `${Math.round(listeners / 1000)}k monthly listeners`,
        positive: true,
      });
    } else if (listeners >= 1000) {
      signals.push({
        type: 'momentum',
        label: `${(listeners / 1000).toFixed(1)}k Spotify monthly`,
        positive: true,
      });
    }
  }

  // Availability signal
  if (lead.prConfidence === 'unlikely' || lead.prConfidence === 'unknown') {
    signals.push({
      type: 'availability',
      label: lead.prConfidence === 'unlikely' ? 'No PR detected' : 'PR status unknown',
      positive: true,
    });
  } else if (lead.prConfidence === 'likely' || lead.prConfidence === 'confirmed') {
    signals.push({
      type: 'availability',
      label: lead.prAgencyName ? `May have PR (${lead.prAgencyName})` : 'Likely has PR',
      positive: false,
    });
  }

  // Genre fit signal
  const genre = (lead.genre || '').toLowerCase();
  const matchedGenre = FIT_GENRES.find(g => genre.includes(g));
  if (matchedGenre) {
    signals.push({
      type: 'fit',
      label: `${capitalizeFirst(matchedGenre)} fits roster`,
      positive: true,
    });
  }

  // Source signal
  if (lead.sourceType && lead.sourceRank) {
    const sourceName = getSourceDisplayName(lead.sourceType);
    signals.push({
      type: 'source',
      label: `${sourceName} #${lead.sourceRank}`,
      positive: lead.sourceRank <= 20,
    });
  }

  return signals;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSourceDisplayName(sourceType: string): string {
  const names: Record<string, string> = {
    hype_machine: 'Hype Machine',
    bandcamp: 'Bandcamp',
    submithub: 'SubmitHub',
    spotify_playlist: 'Spotify Playlist',
    soundcloud: 'SoundCloud',
    youtube_music: 'YouTube Music',
    manual: 'Manual Entry',
  };
  return names[sourceType] || sourceType;
}

/**
 * Calculate full score breakdown and total score
 */
export function calculateScore(lead: Partial<Lead>): {
  score: number;
  breakdown: ScoreBreakdown;
} {
  const breakdown: ScoreBreakdown = {
    timing: calculateTimingScore(lead),
    momentum: calculateMomentumScore(lead),
    fit: calculateFitScore(lead),
    availability: calculateAvailabilityScore(lead),
  };

  const score = breakdown.timing + breakdown.momentum + breakdown.fit + breakdown.availability;

  return { score, breakdown };
}

/**
 * Get score category for display
 */
export function getScoreCategory(score: number): {
  label: string;
  color: string;
} {
  if (score >= 85) {
    return { label: 'Excellent', color: '#22C55E' };
  }
  if (score >= 70) {
    return { label: 'Good', color: '#3AA9BE' };
  }
  if (score >= 55) {
    return { label: 'Fair', color: '#F59E0B' };
  }
  return { label: 'Low', color: '#737373' };
}

/**
 * Sort leads by score (descending by default)
 */
export function sortLeadsByScore(leads: Lead[], ascending = false): Lead[] {
  return [...leads].sort((a, b) => {
    return ascending ? a.score - b.score : b.score - a.score;
  });
}

/**
 * Filter leads by minimum score
 */
export function filterLeadsByMinScore(leads: Lead[], minScore: number): Lead[] {
  return leads.filter(lead => lead.score >= minScore);
}

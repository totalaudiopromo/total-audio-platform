/**
 * Showcase Engine
 *
 * Build showcase summaries with artist data for one-pagers, pitches, and presentations.
 */

import * as showcaseStore from './showcaseStore.js';
import { getCandidateBySlug, getLatestScore } from '../anrStore.js';
import { computeMomentum } from '../momentumEngine.js';
import { logger } from '../utils/logger.js';

export interface ShowcaseArtistSummary {
  artist_slug: string;
  position?: number;
  notes?: string;

  // Core data
  name?: string;
  microgenre?: string;
  country?: string;

  // Scores
  composite_score?: number;
  breakout_probability?: number;
  momentum_score?: number;
  scene_alignment?: number;
  creative_uniqueness?: number;

  // Momentum
  velocity?: number;
  acceleration?: number;
  trend?: 'rising' | 'stable' | 'declining';

  // Highlights
  campaign_highlights?: string[];
  scene_fit_summary?: string;
  one_line_pitch?: string;
}

export interface ShowcaseSummary {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  context: Record<string, any>;
  created_at: string;
  updated_at: string;

  artists: ShowcaseArtistSummary[];

  // Aggregates
  avg_composite_score?: number;
  avg_breakout_probability?: number;
  total_artists: number;
  scenes_represented: string[];
  countries_represented: string[];
}

/**
 * Build showcase summary with full artist data
 */
export async function buildShowcaseSummary(showcaseId: string): Promise<ShowcaseSummary | null> {
  try {
    logger.info('Building showcase summary', { showcaseId });

    const showcase = await showcaseStore.getShowcaseById(showcaseId);
    if (!showcase) {
      logger.warn('Showcase not found', { showcaseId });
      return null;
    }

    const members = await showcaseStore.listShowcaseMembers(showcaseId);

    const artistSummaries: ShowcaseArtistSummary[] = [];
    const scores: number[] = [];
    const breakoutProbs: number[] = [];
    const scenesSet = new Set<string>();
    const countriesSet = new Set<string>();

    for (const member of members) {
      const candidate = await getCandidateBySlug(member.artist_slug);

      const summary: ShowcaseArtistSummary = {
        artist_slug: member.artist_slug,
        position: member.position,
        notes: member.notes,
      };

      if (candidate) {
        summary.name = candidate.name;
        summary.microgenre = candidate.microgenre;
        summary.country = candidate.country;

        if (candidate.microgenre) {
          scenesSet.add(candidate.microgenre);
        }
        if (candidate.country) {
          countriesSet.add(candidate.country);
        }

        // Get latest score
        const score = await getLatestScore(candidate.id);
        if (score) {
          summary.composite_score = score.composite_score;
          summary.breakout_probability = score.breakout_probability;
          summary.momentum_score = score.momentum_score;
          summary.scene_alignment = score.scene_alignment;
          summary.creative_uniqueness = score.creative_uniqueness;

          scores.push(score.composite_score);
          if (score.breakout_probability !== undefined) {
            breakoutProbs.push(score.breakout_probability);
          }
        }

        // Get momentum
        const momentum = await computeMomentum(candidate.id);
        if (momentum) {
          summary.velocity = momentum.velocity;
          summary.acceleration = momentum.acceleration;
          summary.trend = momentum.trend;
        }

        // Generate highlights
        summary.campaign_highlights = generateCampaignHighlights(candidate, score);
        summary.scene_fit_summary = generateSceneFitSummary(candidate, score);
        summary.one_line_pitch = generateOneLinePitch(candidate, score, momentum);
      }

      artistSummaries.push(summary);
    }

    // Compute aggregates
    const avgScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : undefined;

    const avgBreakout = breakoutProbs.length > 0
      ? breakoutProbs.reduce((a, b) => a + b, 0) / breakoutProbs.length
      : undefined;

    return {
      ...showcase,
      artists: artistSummaries,
      avg_composite_score: avgScore,
      avg_breakout_probability: avgBreakout,
      total_artists: members.length,
      scenes_represented: Array.from(scenesSet),
      countries_represented: Array.from(countriesSet),
    };
  } catch (error) {
    logger.error('Failed to build showcase summary', error, { showcaseId });
    return null;
  }
}

/**
 * Generate campaign highlights for an artist
 */
function generateCampaignHighlights(candidate: any, score: any): string[] {
  const highlights: string[] = [];

  if (score) {
    if (score.breakout_probability && score.breakout_probability > 0.7) {
      highlights.push(`High breakout probability (${Math.round(score.breakout_probability * 100)}%)`);
    }

    if (score.momentum_score && score.momentum_score > 0.7) {
      highlights.push('Strong momentum');
    }

    if (score.creative_uniqueness && score.creative_uniqueness > 0.7) {
      highlights.push('Highly distinctive sound');
    }

    if (score.scene_alignment && score.scene_alignment > 0.7) {
      highlights.push('Strong scene alignment');
    }

    if (score.engagement_quality && score.engagement_quality > 0.7) {
      highlights.push('High-quality audience engagement');
    }

    if (score.campaign_efficiency && score.campaign_efficiency > 0.7) {
      highlights.push('Efficient campaign performance');
    }
  }

  if (candidate.country && candidate.country !== 'GB') {
    highlights.push(`International (${candidate.country})`);
  }

  return highlights;
}

/**
 * Generate scene fit summary
 */
function generateSceneFitSummary(candidate: any, score: any): string {
  if (!candidate.microgenre) {
    return 'No scene data available';
  }

  if (!score || !score.scene_alignment) {
    return `Active in ${candidate.microgenre}`;
  }

  const alignment = score.scene_alignment;

  if (alignment > 0.8) {
    return `Central figure in ${candidate.microgenre} scene`;
  } else if (alignment > 0.6) {
    return `Well-integrated in ${candidate.microgenre}`;
  } else if (alignment > 0.4) {
    return `Emerging in ${candidate.microgenre}`;
  } else {
    return `New to ${candidate.microgenre} scene`;
  }
}

/**
 * Generate one-line pitch
 */
function generateOneLinePitch(candidate: any, score: any, momentum: any): string {
  const parts: string[] = [];

  // Genre
  if (candidate.microgenre) {
    parts.push(candidate.microgenre);
  }

  // Location
  if (candidate.country && candidate.country !== 'GB') {
    parts.push(`from ${candidate.country}`);
  } else if (candidate.country === 'GB') {
    parts.push('UK');
  }

  // Momentum
  if (momentum && momentum.trend === 'rising') {
    parts.push('with rising momentum');
  }

  // Breakout
  if (score && score.breakout_probability && score.breakout_probability > 0.7) {
    parts.push('high breakout potential');
  }

  // Uniqueness
  if (score && score.creative_uniqueness && score.creative_uniqueness > 0.7) {
    parts.push('distinctive sound');
  }

  if (parts.length === 0) {
    return candidate.name || candidate.artist_slug;
  }

  return parts.join(', ');
}

/**
 * Re-export store functions
 */
export const {
  createShowcase,
  getShowcaseById,
  listShowcasesForWorkspace,
  addArtistToShowcase,
  listShowcaseMembers,
} = showcaseStore;

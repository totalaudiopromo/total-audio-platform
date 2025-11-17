/**
 * Roster Engine
 *
 * Roster analytics: profile, gaps, and candidate fit scoring.
 */

import { getRosterMembers, type RosterMember } from './rosterStore.js';
import { getCandidateBySlug, getLatestScore } from '../anrStore.js';
import { getSceneContext } from '../contextAdapters/scenesAdapter.js';
import { getCMGSummary } from '../contextAdapters/cmgAdapter.js';
import { getMIGNeighborhood } from '../contextAdapters/migAdapter.js';
import { logger } from '../utils/logger.js';
import { round, clamp } from '../utils/math.js';

export interface RosterProfile {
  roster_id: string;
  total_members: number;
  active_members: number;
  scenes: Array<{ slug: string; count: number; percentage: number }>;
  microgenres: Array<{ name: string; count: number; percentage: number }>;
  countries: Array<{ country: string; count: number; percentage: number }>;
  roles: Record<string, number>;
  avg_composite_score?: number;
  avg_momentum_score?: number;
}

export interface RosterGap {
  type: 'scene' | 'microgenre' | 'archetype' | 'geographic';
  name: string;
  current_coverage: number;
  opportunity_score: number;
  recommendation: string;
}

export interface CandidateRosterFit {
  artist_slug: string;
  roster_id: string;
  strategic_fit: number;        // 0.0-1.0
  uniqueness_vs_roster: number; // 0.0-1.0
  redundancy_risk: number;      // 0.0-1.0
  portfolio_value: number;      // 0.0-1.0
  composite_fit: number;        // 0.0-1.0
  recommendation: string;
}

/**
 * Get roster profile
 */
export async function getRosterProfile(rosterId: string): Promise<RosterProfile | null> {
  try {
    logger.info('Computing roster profile', { rosterId });

    const members = await getRosterMembers(rosterId);

    if (members.length === 0) {
      return {
        roster_id: rosterId,
        total_members: 0,
        active_members: 0,
        scenes: [],
        microgenres: [],
        countries: [],
        roles: {},
      };
    }

    // Get candidate data for all members
    const memberData = await Promise.all(
      members.map(async (m) => {
        const candidate = await getCandidateBySlug(m.artist_slug);
        const score = candidate ? await getLatestScore(candidate.id) : null;
        return { member: m, candidate, score };
      })
    );

    const activeMemberData = memberData.filter((m) => m.member.status === 'active');

    // Aggregate scenes
    const sceneMap = new Map<string, number>();
    activeMemberData.forEach(({ candidate }) => {
      if (candidate?.primary_scene_slug) {
        sceneMap.set(
          candidate.primary_scene_slug,
          (sceneMap.get(candidate.primary_scene_slug) || 0) + 1
        );
      }
    });

    const scenes = Array.from(sceneMap.entries())
      .map(([slug, count]) => ({
        slug,
        count,
        percentage: round((count / activeMemberData.length) * 100, 1),
      }))
      .sort((a, b) => b.count - a.count);

    // Aggregate microgenres
    const microgenreMap = new Map<string, number>();
    activeMemberData.forEach(({ candidate }) => {
      candidate?.microgenres?.forEach((mg: string) => {
        microgenreMap.set(mg, (microgenreMap.get(mg) || 0) + 1);
      });
    });

    const microgenres = Array.from(microgenreMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: round((count / activeMemberData.length) * 100, 1),
      }))
      .sort((a, b) => b.count - a.count);

    // Aggregate countries
    const countryMap = new Map<string, number>();
    activeMemberData.forEach(({ candidate }) => {
      if (candidate?.country) {
        countryMap.set(candidate.country, (countryMap.get(candidate.country) || 0) + 1);
      }
    });

    const countries = Array.from(countryMap.entries())
      .map(([country, count]) => ({
        country,
        count,
        percentage: round((count / activeMemberData.length) * 100, 1),
      }))
      .sort((a, b) => b.count - a.count);

    // Aggregate roles
    const roles: Record<string, number> = {};
    members.forEach((m) => {
      roles[m.role] = (roles[m.role] || 0) + 1;
    });

    // Calculate average scores
    const scores = memberData.map((m) => m.score).filter(Boolean);
    const avgComposite = scores.length > 0
      ? scores.reduce((sum, s) => sum + (s?.composite_score || 0), 0) / scores.length
      : undefined;
    const avgMomentum = scores.length > 0
      ? scores.reduce((sum, s) => sum + (s?.momentum_score || 0), 0) / scores.length
      : undefined;

    const profile: RosterProfile = {
      roster_id: rosterId,
      total_members: members.length,
      active_members: activeMemberData.length,
      scenes,
      microgenres,
      countries,
      roles,
      avg_composite_score: avgComposite ? round(avgComposite, 3) : undefined,
      avg_momentum_score: avgMomentum ? round(avgMomentum, 3) : undefined,
    };

    logger.info('Roster profile computed', {
      rosterId,
      total_members: profile.total_members,
      scenes_count: scenes.length,
    });

    return profile;
  } catch (error) {
    logger.error('Failed to compute roster profile', error, { rosterId });
    return null;
  }
}

/**
 * Compute roster gaps
 */
export async function computeRosterGaps(rosterId: string): Promise<RosterGap[]> {
  try {
    logger.info('Computing roster gaps', { rosterId });

    const profile = await getRosterProfile(rosterId);
    if (!profile) return [];

    const gaps: RosterGap[] = [];

    // Scene gaps: identify underrepresented high-opportunity scenes
    const totalScenes = profile.scenes.length;
    if (totalScenes < 3) {
      gaps.push({
        type: 'scene',
        name: 'scene_diversity',
        current_coverage: totalScenes,
        opportunity_score: 0.8,
        recommendation: 'Roster has low scene diversity. Consider adding artists from different scenes.',
      });
    }

    // Check if any scene is over-represented (>50%)
    const dominantScene = profile.scenes.find((s) => s.percentage > 50);
    if (dominantScene) {
      gaps.push({
        type: 'scene',
        name: dominantScene.slug,
        current_coverage: dominantScene.percentage / 100,
        opportunity_score: 0.6,
        recommendation: `Over-reliance on ${dominantScene.slug} scene (${dominantScene.percentage}%). Diversify to reduce risk.`,
      });
    }

    // Geographic gaps
    const totalCountries = profile.countries.length;
    if (totalCountries < 2) {
      gaps.push({
        type: 'geographic',
        name: 'geographic_diversity',
        current_coverage: totalCountries,
        opportunity_score: 0.7,
        recommendation: 'Roster lacks geographic diversity. Consider international artists.',
      });
    }

    // Role balance
    const coreCount = profile.roles['core'] || 0;
    const devCount = profile.roles['development'] || 0;
    if (devCount === 0 && coreCount > 0) {
      gaps.push({
        type: 'archetype',
        name: 'development_pipeline',
        current_coverage: 0,
        opportunity_score: 0.75,
        recommendation: 'No development artists. Consider building pipeline for future talent.',
      });
    }

    logger.info('Roster gaps computed', { rosterId, gap_count: gaps.length });

    return gaps;
  } catch (error) {
    logger.error('Failed to compute roster gaps', error, { rosterId });
    return [];
  }
}

/**
 * Assess candidate roster fit
 */
export async function assessCandidateRosterFit(
  rosterId: string,
  artistSlug: string
): Promise<CandidateRosterFit | null> {
  try {
    logger.info('Assessing candidate roster fit', { rosterId, artistSlug });

    const [profile, candidate] = await Promise.all([
      getRosterProfile(rosterId),
      getCandidateBySlug(artistSlug),
    ]);

    if (!profile || !candidate) {
      logger.warn('Cannot assess fit: missing profile or candidate', {
        rosterId,
        artistSlug,
      });
      return null;
    }

    const score = await getLatestScore(candidate.id);

    // Strategic fit: Does this artist strengthen the roster?
    const strategicFit = (() => {
      let fit = score?.composite_score || 0.5;

      // Bonus if fills a gap
      const isInUnderrepresentedScene = profile.scenes.every((s) => s.slug !== candidate.primary_scene_slug);
      if (isInUnderrepresentedScene) {
        fit = Math.min(fit + 0.15, 1.0);
      }

      return round(clamp(fit, 0, 1), 3);
    })();

    // Uniqueness vs roster
    const uniquenessVsRoster = (() => {
      // High uniqueness if in different scene
      const isUnique = !profile.scenes.some((s) => s.slug === candidate.primary_scene_slug);
      const baseUniqueness = isUnique ? 0.8 : 0.4;

      // Adjust by creative uniqueness score
      const creativeUniqueness = score?.creative_uniqueness_score || 0.5;

      return round((baseUniqueness + creativeUniqueness) / 2, 3);
    })();

    // Redundancy risk
    const redundancyRisk = (() => {
      // High risk if scene is already well-represented
      const sceneRep = profile.scenes.find((s) => s.slug === candidate.primary_scene_slug);
      const risk = sceneRep ? sceneRep.percentage / 100 : 0.1;

      return round(clamp(risk, 0, 1), 3);
    })();

    // Portfolio diversification value
    const portfolioValue = (() => {
      // Higher value if adds diversity
      const diversityBonus = 1 - redundancyRisk;
      const qualityFactor = score?.composite_score || 0.5;

      return round((diversityBonus * 0.6 + qualityFactor * 0.4), 3);
    })();

    // Composite fit
    const compositeFit = round(
      (strategicFit * 0.3 +
        uniquenessVsRoster * 0.25 +
        (1 - redundancyRisk) * 0.2 +
        portfolioValue * 0.25),
      3
    );

    const recommendation = (() => {
      if (compositeFit >= 0.75) return 'Strong fit - highly recommended for roster';
      if (compositeFit >= 0.6) return 'Good fit - consider for roster';
      if (compositeFit >= 0.4) return 'Moderate fit - evaluate carefully';
      return 'Low fit - may not strengthen roster';
    })();

    const fit: CandidateRosterFit = {
      artist_slug: artistSlug,
      roster_id: rosterId,
      strategic_fit: strategicFit,
      uniqueness_vs_roster: uniquenessVsRoster,
      redundancy_risk: redundancyRisk,
      portfolio_value: portfolioValue,
      composite_fit: compositeFit,
      recommendation,
    };

    logger.info('Candidate roster fit assessed', {
      rosterId,
      artistSlug,
      composite_fit: compositeFit,
    });

    return fit;
  } catch (error) {
    logger.error('Failed to assess candidate roster fit', error, { rosterId, artistSlug });
    return null;
  }
}

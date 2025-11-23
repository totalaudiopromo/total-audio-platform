/**
 * Shortlist Engine
 *
 * Generates and manages A&R shortlists based on criteria.
 */

import type {
  ANRShortlist,
  ANRShortlistMember,
  ShortlistCriteria,
  ANRCandidate,
  MomentumDirection,
} from './types.js';
import { listCandidates, getLatestScore, createShortlist, addCandidateToShortlist } from './anrStore.js';
import { computeMomentum } from './momentumEngine.js';
import { getArtistsInScene } from './contextAdapters/scenesAdapter.js';
import { logger } from './utils/logger.js';

/**
 * Generate agency shortlist based on criteria
 */
export async function generateAgencyShortlist(
  userId: string,
  criteria: ShortlistCriteria
): Promise<ANRShortlist | null> {
  try {
    logger.info('Generating agency shortlist', { userId, criteria });

    // Fetch candidates matching criteria
    const candidatesResponse = await listCandidates({
      scenes: criteria.scenes,
      countries: criteria.countries,
      microgenres: criteria.microgenres,
      limit: criteria.limit || 50,
    });

    const candidates = candidatesResponse.data;

    // Filter and score candidates
    const scoredCandidates = await Promise.all(
      candidates.map(async candidate => {
        const latestScore = await getLatestScore(candidate.id);

        if (!latestScore) {
          return null;
        }

        // Apply score filters
        if (
          criteria.min_composite_score &&
          latestScore.composite_score < criteria.min_composite_score
        ) {
          return null;
        }

        if (
          criteria.min_breakout_score &&
          latestScore.breakout_score < criteria.min_breakout_score
        ) {
          return null;
        }

        if (
          criteria.min_momentum_score &&
          latestScore.momentum_score < criteria.min_momentum_score
        ) {
          return null;
        }

        // Apply momentum direction filter
        if (criteria.momentum_direction) {
          const momentum = await computeMomentum(candidate.id);
          if (!momentum || momentum.direction !== criteria.momentum_direction) {
            return null;
          }
        }

        return {
          candidate,
          score: latestScore.composite_score,
          breakout_score: latestScore.breakout_score,
          momentum_score: latestScore.momentum_score,
        };
      })
    );

    // Filter out nulls and sort by score
    const validCandidates = scoredCandidates
      .filter(c => c !== null)
      .sort((a, b) => b!.score - a!.score);

    // Create shortlist
    const shortlistName =
      criteria.scenes && criteria.scenes.length > 0
        ? `${criteria.scenes.join(', ')} Prospects`
        : 'Top Prospects';

    const shortlist = await createShortlist(userId, {
      name: shortlistName,
      description: `Generated shortlist based on criteria`,
      criteria,
    });

    if (!shortlist) {
      logger.error('Failed to create shortlist', { userId });
      return null;
    }

    // Add candidates to shortlist
    for (let i = 0; i < validCandidates.length; i++) {
      const { candidate, score } = validCandidates[i]!;

      await addCandidateToShortlist(shortlist.id, candidate.id, {
        score,
        position: i + 1,
      });
    }

    logger.info('Agency shortlist generated', {
      userId,
      shortlistId: shortlist.id,
      candidateCount: validCandidates.length,
    });

    return shortlist;
  } catch (error) {
    logger.error('Failed to generate agency shortlist', error, { userId });
    return null;
  }
}

/**
 * Generate scene shortlist
 */
export async function generateSceneShortlist(
  userId: string,
  sceneSlug: string,
  criteria?: Partial<ShortlistCriteria>
): Promise<ANRShortlist | null> {
  try {
    logger.info('Generating scene shortlist', { userId, sceneSlug });

    // Get artists in scene
    const artistsResponse = await getArtistsInScene(sceneSlug, criteria?.limit || 50);

    if (!artistsResponse.success || !artistsResponse.data) {
      logger.warn('No artists found in scene', { sceneSlug });
      return null;
    }

    const artistSlugs = artistsResponse.data;

    // Fetch candidates for these artists
    const candidatesResponse = await listCandidates({
      limit: artistSlugs.length,
    });

    const sceneCandidates = candidatesResponse.data.filter(c =>
      artistSlugs.includes(c.artist_slug)
    );

    // Score and sort
    const scoredCandidates = await Promise.all(
      sceneCandidates.map(async candidate => {
        const latestScore = await getLatestScore(candidate.id);

        if (!latestScore) {
          return null;
        }

        return {
          candidate,
          score: latestScore.composite_score,
        };
      })
    );

    const validCandidates = scoredCandidates
      .filter(c => c !== null)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, criteria?.limit || 20);

    // Create shortlist
    const shortlist = await createShortlist(userId, {
      name: `${sceneSlug} Scene Prospects`,
      description: `Top prospects in ${sceneSlug} scene`,
      criteria: {
        scenes: [sceneSlug],
        ...criteria,
      },
    });

    if (!shortlist) {
      logger.error('Failed to create scene shortlist', { userId, sceneSlug });
      return null;
    }

    // Add candidates
    for (let i = 0; i < validCandidates.length; i++) {
      const { candidate, score } = validCandidates[i]!;

      await addCandidateToShortlist(shortlist.id, candidate.id, {
        score,
        position: i + 1,
      });
    }

    logger.info('Scene shortlist generated', {
      userId,
      sceneSlug,
      shortlistId: shortlist.id,
      candidateCount: validCandidates.length,
    });

    return shortlist;
  } catch (error) {
    logger.error('Failed to generate scene shortlist', error, { userId, sceneSlug });
    return null;
  }
}

/**
 * Generate roster gap shortlist
 *
 * Identifies high-opportunity scenes/genres where agency/label is underrepresented
 */
export async function generateRosterGapShortlist(
  userId: string,
  userScenes?: string[]
): Promise<ANRShortlist | null> {
  try {
    logger.info('Generating roster gap shortlist', { userId });

    // TODO: Implement roster gap analysis
    // 1. Analyze user's existing roster (from workspace data)
    // 2. Identify underrepresented scenes with high opportunity
    // 3. Find top candidates in those scenes

    // Stub implementation: Find candidates in scenes user doesn't have coverage in
    const candidatesResponse = await listCandidates({
      limit: 50,
    });

    const candidates = candidatesResponse.data;

    // Filter candidates not in user's existing scenes
    const gapCandidates = userScenes
      ? candidates.filter(c => !userScenes.includes(c.primary_scene_slug || ''))
      : candidates;

    // Score and sort
    const scoredCandidates = await Promise.all(
      gapCandidates.map(async candidate => {
        const latestScore = await getLatestScore(candidate.id);

        if (!latestScore) {
          return null;
        }

        // Prioritize high opportunity (scene alignment + breakout)
        const opportunityScore =
          latestScore.scene_alignment_score * 0.5 + latestScore.breakout_score * 0.5;

        return {
          candidate,
          score: opportunityScore,
        };
      })
    );

    const validCandidates = scoredCandidates
      .filter(c => c !== null)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, 20);

    // Create shortlist
    const shortlist = await createShortlist(userId, {
      name: 'Roster Gap Opportunities',
      description: 'High-potential artists in underrepresented scenes',
      criteria: {},
    });

    if (!shortlist) {
      logger.error('Failed to create roster gap shortlist', { userId });
      return null;
    }

    // Add candidates
    for (let i = 0; i < validCandidates.length; i++) {
      const { candidate, score } = validCandidates[i]!;

      await addCandidateToShortlist(shortlist.id, candidate.id, {
        score,
        position: i + 1,
      });
    }

    logger.info('Roster gap shortlist generated', {
      userId,
      shortlistId: shortlist.id,
      candidateCount: validCandidates.length,
    });

    return shortlist;
  } catch (error) {
    logger.error('Failed to generate roster gap shortlist', error, { userId });
    return null;
  }
}

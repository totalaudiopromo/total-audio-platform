/**
 * Collaboration Engine
 *
 * Recommend collaboration pairings based on:
 * - MIG (shared nodes, mutual collaborators)
 * - Scenes (overlapping genres/scenes)
 * - CMG (complementary creative motifs)
 */

import { getCandidateBySlug, getLatestScore } from '../anrStore.js';
import { getRosterMembers } from '../roster/rosterStore.js';
import { getMIGContext } from '../contextAdapters/migAdapter.js';
import { getScenesContext } from '../contextAdapters/scenesAdapter.js';
import { getCMGContext } from '../contextAdapters/cmgAdapter.js';
import { logger } from '../utils/logger.js';
import { round } from '../utils/math.js';

export interface CollabRecommendation {
  artist_a: string;
  artist_b: string;

  // Pairing scores
  compatibility_score: number; // 0.0-1.0 composite
  mig_overlap: number; // shared network nodes
  scene_overlap: number; // genre/scene alignment
  creative_complementarity: number; // CMG motif pairing

  // Justification
  shared_nodes?: string[]; // MIG shared connections
  shared_scenes?: string[]; // Overlapping scenes/genres
  complementary_motifs?: string[]; // CMG motif pairings
  reason_summary: string;
}

/**
 * Suggest collaborations within a roster
 */
export async function suggestCollabsWithinRoster(
  rosterId: string,
  minCompatibility: number = 0.5
): Promise<CollabRecommendation[]> {
  try {
    logger.info('Suggesting collaborations within roster', { rosterId, minCompatibility });

    const members = await getRosterMembers(rosterId);

    if (members.length < 2) {
      logger.warn('Roster has fewer than 2 members', { rosterId });
      return [];
    }

    const recommendations: CollabRecommendation[] = [];

    // Generate all pairs
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const artistA = members[i].artist_slug;
        const artistB = members[j].artist_slug;

        const recommendation = await assessCollabPairing(artistA, artistB);

        if (recommendation && recommendation.compatibility_score >= minCompatibility) {
          recommendations.push(recommendation);
        }
      }
    }

    // Sort by compatibility descending
    recommendations.sort((a, b) => b.compatibility_score - a.compatibility_score);

    return recommendations;
  } catch (error) {
    logger.error('Failed to suggest collabs within roster', error, { rosterId });
    return [];
  }
}

/**
 * Suggest roster members who could collaborate with a candidate
 */
export async function suggestRosterCandidateCollabs(
  rosterId: string,
  candidateSlug: string,
  minCompatibility: number = 0.5
): Promise<CollabRecommendation[]> {
  try {
    logger.info('Suggesting roster-candidate collabs', { rosterId, candidateSlug, minCompatibility });

    const members = await getRosterMembers(rosterId);

    const recommendations: CollabRecommendation[] = [];

    for (const member of members) {
      // Don't recommend self-collaboration
      if (member.artist_slug === candidateSlug) {
        continue;
      }

      const recommendation = await assessCollabPairing(candidateSlug, member.artist_slug);

      if (recommendation && recommendation.compatibility_score >= minCompatibility) {
        recommendations.push(recommendation);
      }
    }

    // Sort by compatibility descending
    recommendations.sort((a, b) => b.compatibility_score - a.compatibility_score);

    return recommendations;
  } catch (error) {
    logger.error('Failed to suggest roster-candidate collabs', error, { rosterId, candidateSlug });
    return [];
  }
}

/**
 * Suggest external collaborations for an artist
 *
 * NOTE: This is a placeholder. In production, you would query a database of
 * all artists and find best matches. For now, we return an empty array.
 */
export async function suggestExternalCollabsForArtist(
  artistSlug: string,
  minCompatibility: number = 0.6,
  limit: number = 10
): Promise<CollabRecommendation[]> {
  try {
    logger.info('Suggesting external collabs for artist', { artistSlug, minCompatibility, limit });

    // TODO: Implement full database scan for external collaborations
    // For now, return empty array
    logger.warn('External collab suggestions not yet implemented');

    return [];
  } catch (error) {
    logger.error('Failed to suggest external collabs', error, { artistSlug });
    return [];
  }
}

/**
 * Assess collaboration pairing between two artists
 */
async function assessCollabPairing(
  artistSlugA: string,
  artistSlugB: string
): Promise<CollabRecommendation | null> {
  try {
    const candidateA = await getCandidateBySlug(artistSlugA);
    const candidateB = await getCandidateBySlug(artistSlugB);

    if (!candidateA || !candidateB) {
      return null;
    }

    // Get context from adapters
    const migA = await getMIGContext(artistSlugA);
    const migB = await getMIGContext(artistSlugB);

    const scenesA = await getScenesContext(artistSlugA);
    const scenesB = await getScenesContext(artistSlugB);

    const cmgA = await getCMGContext(artistSlugA);
    const cmgB = await getCMGContext(artistSlugB);

    // Compute MIG overlap
    const migOverlap = computeMIGOverlap(migA, migB);

    // Compute scene overlap
    const sceneOverlap = computeSceneOverlap(candidateA, candidateB, scenesA, scenesB);

    // Compute creative complementarity
    const creativeComplementarity = computeCreativeComplementarity(cmgA, cmgB);

    // Compute composite compatibility score
    const compatibilityScore = round(
      migOverlap.score * 0.3 +
      sceneOverlap.score * 0.4 +
      creativeComplementarity.score * 0.3,
      3
    );

    // Generate reason summary
    const reasonParts: string[] = [];

    if (migOverlap.shared_nodes.length > 0) {
      reasonParts.push(`${migOverlap.shared_nodes.length} shared connections`);
    }

    if (sceneOverlap.shared_scenes.length > 0) {
      reasonParts.push(`overlapping ${sceneOverlap.shared_scenes.join(', ')} scenes`);
    }

    if (creativeComplementarity.complementary_motifs.length > 0) {
      reasonParts.push('complementary creative styles');
    }

    const reasonSummary = reasonParts.length > 0
      ? reasonParts.join('; ')
      : 'No strong connections detected';

    return {
      artist_a: artistSlugA,
      artist_b: artistSlugB,
      compatibility_score: compatibilityScore,
      mig_overlap: migOverlap.score,
      scene_overlap: sceneOverlap.score,
      creative_complementarity: creativeComplementarity.score,
      shared_nodes: migOverlap.shared_nodes,
      shared_scenes: sceneOverlap.shared_scenes,
      complementary_motifs: creativeComplementarity.complementary_motifs,
      reason_summary: reasonSummary,
    };
  } catch (error) {
    logger.error('Failed to assess collab pairing', error, { artistSlugA, artistSlugB });
    return null;
  }
}

/**
 * Compute MIG overlap (shared network nodes)
 */
function computeMIGOverlap(
  migA: any,
  migB: any
): { score: number; shared_nodes: string[] } {
  if (!migA || !migB) {
    return { score: 0, shared_nodes: [] };
  }

  // Extract node sets (collaborators, labels, producers, etc.)
  const nodesA = new Set<string>();
  const nodesB = new Set<string>();

  if (migA.collaborators) {
    migA.collaborators.forEach((c: string) => nodesA.add(c));
  }

  if (migA.labels) {
    migA.labels.forEach((l: string) => nodesA.add(l));
  }

  if (migA.producers) {
    migA.producers.forEach((p: string) => nodesA.add(p));
  }

  if (migB.collaborators) {
    migB.collaborators.forEach((c: string) => nodesB.add(c));
  }

  if (migB.labels) {
    migB.labels.forEach((l: string) => nodesB.add(l));
  }

  if (migB.producers) {
    migB.producers.forEach((p: string) => nodesB.add(p));
  }

  // Find intersection
  const sharedNodes: string[] = [];

  for (const node of nodesA) {
    if (nodesB.has(node)) {
      sharedNodes.push(node);
    }
  }

  // Score based on Jaccard similarity
  const union = new Set([...nodesA, ...nodesB]);
  const score = union.size > 0
    ? sharedNodes.length / union.size
    : 0;

  return {
    score: round(score, 3),
    shared_nodes: sharedNodes,
  };
}

/**
 * Compute scene overlap
 */
function computeSceneOverlap(
  candidateA: any,
  candidateB: any,
  scenesA: any,
  scenesB: any
): { score: number; shared_scenes: string[] } {
  const scenesSetA = new Set<string>();
  const scenesSetB = new Set<string>();

  // Add primary microgenre
  if (candidateA.microgenre) {
    scenesSetA.add(candidateA.microgenre);
  }

  if (candidateB.microgenre) {
    scenesSetB.add(candidateB.microgenre);
  }

  // Add scenes from context
  if (scenesA && scenesA.active_scenes) {
    scenesA.active_scenes.forEach((s: string) => scenesSetA.add(s));
  }

  if (scenesB && scenesB.active_scenes) {
    scenesB.active_scenes.forEach((s: string) => scenesSetB.add(s));
  }

  // Find intersection
  const sharedScenes: string[] = [];

  for (const scene of scenesSetA) {
    if (scenesSetB.has(scene)) {
      sharedScenes.push(scene);
    }
  }

  // Score based on Jaccard similarity
  const union = new Set([...scenesSetA, ...scenesSetB]);
  const score = union.size > 0
    ? sharedScenes.length / union.size
    : 0;

  return {
    score: round(score, 3),
    shared_scenes: sharedScenes,
  };
}

/**
 * Compute creative complementarity (CMG motif pairing)
 */
function computeCreativeComplementarity(
  cmgA: any,
  cmgB: any
): { score: number; complementary_motifs: string[] } {
  if (!cmgA || !cmgB) {
    return { score: 0, complementary_motifs: [] };
  }

  // Extract motifs
  const motifsA = new Set<string>();
  const motifsB = new Set<string>();

  if (cmgA.creative_motifs) {
    cmgA.creative_motifs.forEach((m: string) => motifsA.add(m));
  }

  if (cmgB.creative_motifs) {
    cmgB.creative_motifs.forEach((m: string) => motifsB.add(m));
  }

  // Heuristic: complementarity means some overlap but not complete duplication
  // Ideal Jaccard: 0.3-0.7 (some shared, some unique)
  const sharedMotifs: string[] = [];

  for (const motif of motifsA) {
    if (motifsB.has(motif)) {
      sharedMotifs.push(motif);
    }
  }

  const union = new Set([...motifsA, ...motifsB]);
  const jaccard = union.size > 0
    ? sharedMotifs.length / union.size
    : 0;

  // Score peaks at Jaccard ~0.5 (balanced overlap)
  // Use inverted parabola: 1 - abs(jaccard - 0.5) * 2
  const score = Math.max(0, 1 - Math.abs(jaccard - 0.5) * 2);

  return {
    score: round(score, 3),
    complementary_motifs: sharedMotifs,
  };
}

/**
 * Music Industry Graph (MIG) - Recommendations Engine
 *
 * Graph-based recommendations for similar artists, outlets, and pitch targets.
 * NOTE: This module provides graph-based candidate lists only.
 * For PR-intelligence filtering, it integrates with the Fusion Layer.
 */

import { getNodeById, getNeighbors, supabase } from './client';
import { computeInfluenceScore } from './graphStore';
import type {
  GraphRecommendation,
  RecommendationOptions,
  MIGNode,
  MIGNodeType,
} from './types';
import { logger } from './utils/logger';

// ============================================================================
// SIMILAR ARTISTS
// ============================================================================

/**
 * Recommend similar artists based on graph connections
 */
export async function recommendSimilarArtists(
  artistId: string,
  options?: RecommendationOptions
): Promise<GraphRecommendation[]> {
  const limit = options?.limit || 10;
  const minScore = options?.min_score || 0.3;

  const artist = await getNodeById(artistId);
  if (!artist || artist.type !== 'artist') {
    logger.warn('Invalid artist node', { artistId });
    return [];
  }

  // Get direct neighbors
  const neighbors = await getNeighbors(artistId, {
    relationship_filter: ['similar_to', 'same_scene', 'same_microgenre', 'collaborates'],
    depth_limit: 2,
    node_type_filter: ['artist'],
  });

  // Score each neighbor
  const recommendations: GraphRecommendation[] = [];

  for (const neighbor of neighbors) {
    const neighborNode = await getNodeById(neighbor.neighbor_id);
    if (!neighborNode || neighborNode.type !== 'artist') {
      continue;
    }

    // Calculate similarity score
    let score = 0;

    // Direct connection bonus
    if (neighbor.path_length === 1) {
      score += 0.5;
    }

    // Relationship-specific bonuses
    if (neighbor.relationship === 'similar_to') score += 0.4;
    if (neighbor.relationship === 'same_scene') score += 0.3;
    if (neighbor.relationship === 'same_microgenre') score += 0.3;
    if (neighbor.relationship === 'collaborates') score += 0.2;

    // Edge weight contribution
    score += neighbor.weight * 0.2;

    // Apply filters
    if (options?.filters?.country && neighborNode.country !== options.filters.country) {
      continue;
    }

    if (score >= minScore) {
      // Get related nodes for this recommendation
      const relatedNeighbors = await getNeighbors(neighbor.neighbor_id, {
        depth_limit: 1,
        node_type_filter: ['scene', 'microgenre'],
      });

      const relatedNodes: MIGNode[] = [];
      for (const rn of relatedNeighbors.slice(0, 3)) {
        const node = await getNodeById(rn.neighbor_id);
        if (node) relatedNodes.push(node);
      }

      recommendations.push({
        node: neighborNode,
        score,
        reasoning: `Shares ${neighbor.relationship} connection (distance: ${neighbor.path_length})`,
        related_nodes: relatedNodes,
        common_connections: 1, // TODO: Calculate actual common connections
      });
    }
  }

  // Sort by score and limit
  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, limit);
}

// ============================================================================
// SIMILAR OUTLETS
// ============================================================================

/**
 * Recommend similar outlets (blogs, playlists, radio shows)
 */
export async function recommendSimilarOutlets(
  outletId: string,
  options?: RecommendationOptions
): Promise<GraphRecommendation[]> {
  const limit = options?.limit || 10;
  const minScore = options?.min_score || 0.3;

  const outlet = await getNodeById(outletId);
  if (!outlet || !['blog', 'playlist', 'radio_show', 'podcast'].includes(outlet.type)) {
    logger.warn('Invalid outlet node', { outletId });
    return [];
  }

  // Get neighbors with similar coverage
  const neighbors = await getNeighbors(outletId, {
    relationship_filter: ['similar_audience', 'similar_to', 'covers'],
    depth_limit: 2,
    node_type_filter: ['blog', 'playlist', 'radio_show', 'podcast'],
  });

  const recommendations: GraphRecommendation[] = [];

  for (const neighbor of neighbors) {
    const neighborNode = await getNodeById(neighbor.neighbor_id);
    if (!neighborNode) continue;

    let score = 0;

    if (neighbor.path_length === 1) score += 0.5;
    if (neighbor.relationship === 'similar_audience') score += 0.4;
    if (neighbor.relationship === 'similar_to') score += 0.4;
    if (neighbor.relationship === 'covers') score += 0.2;
    score += neighbor.weight * 0.2;

    if (score >= minScore) {
      recommendations.push({
        node: neighborNode,
        score,
        reasoning: `Similar audience profile via ${neighbor.relationship}`,
        related_nodes: [],
        common_connections: 1,
      });
    }
  }

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, limit);
}

// ============================================================================
// PITCH TARGETS (FUSION LAYER INTEGRATION)
// ============================================================================

/**
 * Recommend pitch targets for an artist
 * NOTE: This provides graph-based candidates. Fusion Layer refines with PR intelligence.
 */
export async function recommendPitchTargets(
  artistId: string,
  options?: RecommendationOptions
): Promise<GraphRecommendation[]> {
  const limit = options?.limit || 20;

  const artist = await getNodeById(artistId);
  if (!artist || artist.type !== 'artist') {
    logger.warn('Invalid artist node', { artistId });
    return [];
  }

  // Get journalists, radio hosts, playlist curators who cover similar artists
  const similarArtists = await recommendSimilarArtists(artistId, { limit: 10 });
  const targetIds = new Set<string>();
  const targets = new Map<string, { node: MIGNode; score: number; sources: string[] }>();

  // Find outlets that cover similar artists
  for (const similar of similarArtists) {
    const outlets = await getNeighbors(similar.node.id, {
      relationship_filter: ['covers', 'writes_for', 'programmes', 'curates'],
      node_type_filter: ['journalist', 'radio_host', 'blog', 'playlist', 'podcast'],
    });

    for (const outlet of outlets) {
      if (targetIds.has(outlet.neighbor_id)) {
        // Already found this target, increase score
        const existing = targets.get(outlet.neighbor_id)!;
        existing.score += similar.score * 0.5;
        existing.sources.push(similar.node.name);
      } else {
        targetIds.add(outlet.neighbor_id);
        const node = await getNodeById(outlet.neighbor_id);
        if (node) {
          targets.set(outlet.neighbor_id, {
            node,
            score: similar.score * 0.5,
            sources: [similar.node.name],
          });
        }
      }
    }
  }

  // Convert to recommendations
  const recommendations: GraphRecommendation[] = Array.from(targets.values()).map((target) => ({
    node: target.node,
    score: Math.min(target.score, 1.0),
    reasoning: `Covers artists similar to you: ${target.sources.slice(0, 3).join(', ')}`,
    related_nodes: [],
    common_connections: target.sources.length,
  }));

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, limit);
}

// ============================================================================
// SCENE RECOMMENDATIONS
// ============================================================================

/**
 * Recommend scenes for an artist
 */
export async function recommendScenes(
  artistId: string,
  options?: RecommendationOptions
): Promise<GraphRecommendation[]> {
  const limit = options?.limit || 5;

  const artist = await getNodeById(artistId);
  if (!artist || artist.type !== 'artist') {
    logger.warn('Invalid artist node', { artistId });
    return [];
  }

  const scenes = await getNeighbors(artistId, {
    relationship_filter: ['part_of', 'same_scene'],
    node_type_filter: ['scene'],
    depth_limit: 2,
  });

  const recommendations: GraphRecommendation[] = [];

  for (const scene of scenes) {
    const sceneNode = await getNodeById(scene.neighbor_id);
    if (!sceneNode) continue;

    const score = scene.path_length === 1 ? 0.8 : 0.5;

    recommendations.push({
      node: sceneNode,
      score,
      reasoning:
        scene.path_length === 1 ? 'Direct scene membership' : 'Connected to similar artists',
      related_nodes: [],
      common_connections: 1,
    });
  }

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, limit);
}

// ============================================================================
// COLLABORATOR RECOMMENDATIONS
// ============================================================================

/**
 * Recommend potential collaborators for an artist
 */
export async function recommendCollaborators(
  artistId: string,
  options?: RecommendationOptions
): Promise<GraphRecommendation[]> {
  const limit = options?.limit || 10;

  const artist = await getNodeById(artistId);
  if (!artist || artist.type !== 'artist') {
    logger.warn('Invalid artist node', { artistId });
    return [];
  }

  // Get artists in same scenes/microgenres who haven't collaborated yet
  const neighbors = await getNeighbors(artistId, {
    relationship_filter: ['same_scene', 'same_microgenre', 'similar_audience'],
    node_type_filter: ['artist'],
    depth_limit: 2,
  });

  const recommendations: GraphRecommendation[] = [];

  for (const neighbor of neighbors) {
    const neighborNode = await getNodeById(neighbor.neighbor_id);
    if (!neighborNode) continue;

    // Check if already collaborated
    const existingCollabs = await getNeighbors(artistId, {
      relationship_filter: ['collaborates', 'features', 'remixes'],
      node_type_filter: ['artist'],
    });

    const alreadyCollabed = existingCollabs.some((c) => c.neighbor_id === neighbor.neighbor_id);
    if (alreadyCollabed) continue;

    const score = neighbor.relationship === 'same_scene' ? 0.7 : 0.5;

    recommendations.push({
      node: neighborNode,
      score,
      reasoning: `Shares ${neighbor.relationship} connection`,
      related_nodes: [],
      common_connections: 1,
    });
  }

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, limit);
}

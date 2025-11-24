/**
 * Music Industry Graph (MIG) - Microgenre Clustering
 *
 * Computes microgenre-level clustering and adjacency.
 */

import { getNodeBySlug, getNeighbors, supabase } from './client';
import type { MicrogenreCluster, MIGNode } from './types';
import { logger } from './utils/logger';

// ============================================================================
// MICROGENRE CLUSTERING
// ============================================================================

/**
 * Compute cluster data for a microgenre
 */
export async function computeMicrogenreCluster(
  microSlug: string
): Promise<MicrogenreCluster | null> {
  const micro = await getNodeBySlug(microSlug);
  if (!micro || micro.type !== 'microgenre') {
    logger.warn('Invalid microgenre node', { microSlug });
    return null;
  }

  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    // Get all artists in this microgenre
    const artistNeighbors = await getNeighbors(micro.id, {
      relationship_filter: ['same_microgenre', 'part_of'],
      node_type_filter: ['artist'],
      depth_limit: 1,
    });

    const total_artists = artistNeighbors.length;
    const representative_artists = artistNeighbors
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .map((a) => a.neighbor_name);

    // Get related scenes
    const sceneNeighbors = await getNeighbors(micro.id, {
      node_type_filter: ['scene'],
      depth_limit: 2,
    });

    const related_scenes = sceneNeighbors.map((s) => s.neighbor_name);

    // Get adjacent microgenres (microgenres with overlapping artists)
    const { data: adjacentData, error: adjacentError } = await supabase
      .from('migraph_edges')
      .select('source, target, weight')
      .or(`source.eq.${micro.id},target.eq.${micro.id}`)
      .in('rel', ['similar_to', 'trend_link']);

    if (adjacentError) {
      logger.error('Failed to fetch adjacent microgenres', adjacentError);
    }

    const adjacent_microgenres = [];
    for (const edge of adjacentData || []) {
      const otherId = edge.source === micro.id ? edge.target : edge.source;
      const otherNode = await supabase
        .from('migraph_nodes')
        .select('name, slug, type')
        .eq('id', otherId)
        .eq('type', 'microgenre')
        .single();

      if (otherNode.data) {
        adjacent_microgenres.push({
          slug: otherNode.data.slug,
          name: otherNode.data.name,
          similarity_score: edge.weight || 0,
        });
      }
    }

    adjacent_microgenres.sort((a, b) => b.similarity_score - a.similarity_score);

    // Get geographic distribution
    const artistNodes = [];
    for (const artist of artistNeighbors) {
      const node = await supabase
        .from('migraph_nodes')
        .select('country')
        .eq('id', artist.neighbor_id)
        .single();

      if (node.data && node.data.country) {
        artistNodes.push(node.data.country);
      }
    }

    const countryCounts = new Map<string, number>();
    for (const country of artistNodes) {
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    }

    const geographic_distribution = Array.from(countryCounts.entries())
      .map(([country, artist_count]) => ({ country, artist_count }))
      .sort((a, b) => b.artist_count - a.artist_count);

    return {
      microgenre_slug: micro.slug,
      microgenre_name: micro.name,
      total_artists,
      representative_artists,
      related_scenes,
      adjacent_microgenres: adjacent_microgenres.slice(0, 10),
      geographic_distribution,
    };
  } catch (err) {
    logger.error('Exception in computeMicrogenreCluster', err);
    return null;
  }
}

/**
 * Get all microgenre clusters
 */
export async function getAllMicrogenreClusters(
  limit: number = 50
): Promise<MicrogenreCluster[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    const { data: microData, error: microError } = await supabase
      .from('migraph_nodes')
      .select('slug')
      .eq('type', 'microgenre')
      .limit(limit);

    if (microError) {
      logger.error('Failed to fetch microgenres', microError);
      return [];
    }

    const clusters: MicrogenreCluster[] = [];

    for (const micro of (microData as { slug: string }[]) || []) {
      const cluster = await computeMicrogenreCluster(micro.slug);
      if (cluster) {
        clusters.push(cluster);
      }
    }

    return clusters;
  } catch (err) {
    logger.error('Exception in getAllMicrogenreClusters', err);
    return [];
  }
}

/**
 * Find emerging microgenres (high growth, low total artists)
 */
export async function findEmergingMicrogenres(limit: number = 10): Promise<MicrogenreCluster[]> {
  const clusters = await getAllMicrogenreClusters(100);

  // Filter for emerging (10-100 artists, high geographic diversity)
  const emerging = clusters.filter((c) => {
    return c.total_artists >= 10 && c.total_artists <= 100 && c.geographic_distribution.length >= 3;
  });

  // Sort by number of scenes (more scenes = more momentum)
  emerging.sort((a, b) => b.related_scenes.length - a.related_scenes.length);

  return emerging.slice(0, limit);
}

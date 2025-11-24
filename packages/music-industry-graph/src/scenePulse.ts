/**
 * Music Industry Graph (MIG) - Scene Pulse Analytics
 *
 * Computes scene-level dynamics:
 * - Growth rate of scenes (based on edges/mentions)
 * - Trending microgenres
 * - Scene influence heatmaps
 * - Shifts in tastemaker activity
 */

import { getNodeBySlug, getNeighbors, supabase } from './client';
import { getGraphForScene, computeInfluenceScore } from './graphStore';
import type { ScenePulse, CountryScenePulse, MIGNode } from './types';
import { logger } from './utils/logger';

// ============================================================================
// SCENE PULSE COMPUTATION
// ============================================================================

/**
 * Compute pulse metrics for a specific scene
 */
export async function computeScenePulse(sceneSlug: string): Promise<ScenePulse | null> {
  const scene = await getNodeBySlug(sceneSlug);
  if (!scene || scene.type !== 'scene') {
    logger.warn('Invalid scene node', { sceneSlug });
    return null;
  }

  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    // Get all nodes in this scene
    const neighbors = await getNeighbors(scene.id, {
      relationship_filter: ['part_of', 'same_scene'],
      depth_limit: 1,
    });

    const total_nodes = neighbors.length + 1; // +1 for scene node itself

    // Get all edges in this scene
    const { data: edgeData, error: edgeError } = await supabase
      .from('migraph_edges')
      .select('id, created_at, weight')
      .or(`source.eq.${scene.id},target.eq.${scene.id}`);

    if (edgeError) {
      logger.error('Failed to fetch scene edges', edgeError);
      return null;
    }

    const total_edges = edgeData?.length || 0;

    // Calculate growth rate (new edges in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentEdges, error: recentError } = await supabase
      .from('migraph_edges')
      .select('id')
      .or(`source.eq.${scene.id},target.eq.${scene.id}`)
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (recentError) {
      logger.error('Failed to fetch recent edges', recentError);
    }

    const newEdgesCount = recentEdges?.length || 0;
    const growth_rate_30d = total_edges > 0 ? (newEdgesCount / total_edges) * 100 : 0;

    // Calculate new nodes in last 30 days
    const { data: recentNodes, error: recentNodesError } = await supabase
      .from('migraph_nodes')
      .select('id')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (recentNodesError) {
      logger.error('Failed to fetch recent nodes', recentNodesError);
    }

    const new_nodes_30d = recentNodes?.length || 0;

    // Calculate interaction intensity (average edge weight)
    const avgWeight = edgeData?.reduce((sum, edge) => sum + (edge.weight || 1), 0) || 0;
    const interaction_intensity = total_edges > 0 ? avgWeight / total_edges : 0;

    // Get trending microgenres
    const microgenreNeighbors = await getNeighbors(scene.id, {
      node_type_filter: ['microgenre'],
      depth_limit: 1,
    });

    const trending_microgenres = microgenreNeighbors
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .map((mg) => mg.neighbor_name);

    // Get top artists by influence
    const artistNeighbors = await getNeighbors(scene.id, {
      node_type_filter: ['artist'],
      depth_limit: 1,
    });

    const top_artists = [];
    for (const artist of artistNeighbors.slice(0, 10)) {
      const influenceScore = await computeInfluenceScore(artist.neighbor_id);
      top_artists.push({
        name: artist.neighbor_name,
        slug: artist.neighbor_id, // TODO: Get actual slug
        influence_score: influenceScore?.total_score || 0,
      });
    }

    top_artists.sort((a, b) => b.influence_score - a.influence_score);

    // Get cross-scene links
    const { data: crossSceneData, error: crossSceneError } = await supabase
      .from('migraph_edges')
      .select('source, target, weight')
      .eq('rel', 'scene_crossover')
      .or(`source.eq.${scene.id},target.eq.${scene.id}`);

    if (crossSceneError) {
      logger.error('Failed to fetch cross-scene links', crossSceneError);
    }

    const cross_scene_links = [];
    for (const edge of crossSceneData || []) {
      const otherSceneId = edge.source === scene.id ? edge.target : edge.source;
      const otherScene = await supabase
        .from('migraph_nodes')
        .select('name, slug')
        .eq('id', otherSceneId)
        .single();

      if (otherScene.data) {
        cross_scene_links.push({
          scene_slug: otherScene.data.slug,
          scene_name: otherScene.data.name,
          connection_strength: edge.weight || 1,
        });
      }
    }

    return {
      scene_slug: scene.slug,
      scene_name: scene.name,
      total_nodes,
      total_edges,
      growth_rate_30d,
      new_nodes_30d,
      interaction_intensity,
      trending_microgenres,
      top_artists: top_artists.slice(0, 10),
      cross_scene_links,
    };
  } catch (err) {
    logger.error('Exception in computeScenePulse', err);
    return null;
  }
}

// ============================================================================
// COUNTRY SCENE PULSE
// ============================================================================

/**
 * Get scene pulse for all scenes in a country
 */
export async function getScenePulseForCountry(country: string): Promise<CountryScenePulse | null> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return null;
  }

  try {
    // Get all scenes in this country
    const { data: sceneData, error: sceneError } = await supabase
      .from('migraph_nodes')
      .select('*')
      .eq('type', 'scene')
      .eq('country', country);

    if (sceneError) {
      logger.error('Failed to fetch scenes for country', sceneError);
      return null;
    }

    const scenes: ScenePulse[] = [];
    let totalActivity = 0;

    for (const sceneNode of (sceneData as MIGNode[]) || []) {
      const pulse = await computeScenePulse(sceneNode.slug);
      if (pulse) {
        scenes.push(pulse);
        totalActivity += pulse.total_edges;
      }
    }

    // Identify trending scenes (top 5 by growth rate)
    const trendingScenes = [...scenes]
      .sort((a, b) => b.growth_rate_30d - a.growth_rate_30d)
      .slice(0, 5)
      .map((s) => s.scene_name);

    // Identify emerging microgenres (appear in multiple scenes)
    const microgenreCounts = new Map<string, number>();
    for (const scene of scenes) {
      for (const mg of scene.trending_microgenres) {
        microgenreCounts.set(mg, (microgenreCounts.get(mg) || 0) + 1);
      }
    }

    const emergingMicrogenres = Array.from(microgenreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map((e) => e[0]);

    return {
      country,
      scenes,
      total_activity: totalActivity,
      trending_scenes: trendingScenes,
      emerging_microgenres: emergingMicrogenres,
    };
  } catch (err) {
    logger.error('Exception in getScenePulseForCountry', err);
    return null;
  }
}

// ============================================================================
// TRENDING ANALYSIS
// ============================================================================

/**
 * Get globally trending scenes (across all countries)
 */
export async function getGlobalTrendingScenes(limit: number = 10): Promise<ScenePulse[]> {
  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    // Get all scenes
    const { data: sceneData, error: sceneError } = await supabase
      .from('migraph_nodes')
      .select('*')
      .eq('type', 'scene')
      .limit(100); // Limit to prevent excessive queries

    if (sceneError) {
      logger.error('Failed to fetch scenes', sceneError);
      return [];
    }

    const pulses: ScenePulse[] = [];

    for (const sceneNode of (sceneData as MIGNode[]) || []) {
      const pulse = await computeScenePulse(sceneNode.slug);
      if (pulse) {
        pulses.push(pulse);
      }
    }

    // Sort by growth rate
    pulses.sort((a, b) => b.growth_rate_30d - a.growth_rate_30d);

    return pulses.slice(0, limit);
  } catch (err) {
    logger.error('Exception in getGlobalTrendingScenes', err);
    return [];
  }
}

/**
 * Detect shifts in tastemaker activity
 * Identifies journalists/DJs who are increasing coverage of a scene
 */
export async function detectTastemakerShifts(
  sceneSlug: string
): Promise<Array<{ name: string; type: string; activity_increase: number }>> {
  const scene = await getNodeBySlug(sceneSlug);
  if (!scene || scene.type !== 'scene') {
    logger.warn('Invalid scene node', { sceneSlug });
    return [];
  }

  if (!supabase) {
    logger.error('Supabase client not initialized');
    return [];
  }

  try {
    // Get all tastemakers (journalists, DJs, radio hosts) connected to this scene
    const tastemakers = await getNeighbors(scene.id, {
      node_type_filter: ['journalist', 'radio_host', 'dj'],
      depth_limit: 2,
    });

    const shifts = [];

    for (const tastemaker of tastemakers) {
      // Get edges from tastemaker to scene artists created in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentEdges, error: recentError } = await supabase
        .from('migraph_edges')
        .select('id')
        .eq('source', tastemaker.neighbor_id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (recentError) {
        logger.error('Failed to fetch recent edges', recentError);
        continue;
      }

      // Get total edges for comparison
      const { data: totalEdges, error: totalError } = await supabase
        .from('migraph_edges')
        .select('id')
        .eq('source', tastemaker.neighbor_id);

      if (totalError) {
        logger.error('Failed to fetch total edges', totalError);
        continue;
      }

      const recentCount = recentEdges?.length || 0;
      const totalCount = totalEdges?.length || 1;

      // Calculate activity increase (percentage)
      const activity_increase = (recentCount / totalCount) * 100;

      if (activity_increase > 20) {
        // Significant increase threshold
        shifts.push({
          name: tastemaker.neighbor_name,
          type: tastemaker.neighbor_type,
          activity_increase,
        });
      }
    }

    shifts.sort((a, b) => b.activity_increase - a.activity_increase);
    return shifts;
  } catch (err) {
    logger.error('Exception in detectTastemakerShifts', err);
    return [];
  }
}

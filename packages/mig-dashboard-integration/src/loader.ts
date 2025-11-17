/**
 * MIG Fusion Adapter - The Key Integration Layer
 * Extends Fusion Layer with MIG-powered intelligence
 */

import { createClient } from '@supabase/supabase-js';
import {
  getNodeBySlug,
  getNeighbors,
  computeInfluenceScore,
  findShortestPath,
  recommendPitchTargets,
  computeScenePulse,
} from '@total-audio/music-industry-graph';
import type {
  MIGInfluenceScore,
  MIGSceneAlignment,
  MIGContactFit,
  GraphPath,
  MIGGraphOpportunity,
  MIGCorrelation,
  MIGDashboardInsight,
  MIGPitchIntelBoost,
} from './types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// MIG FUSION ADAPTER
// This object extends the Fusion Layer with MIG-powered methods
// ============================================================================

export const MIGFusionAdapter = {
  /**
   * Get influence scores for an artist
   */
  async getInfluenceScores(
    artistSlug: string,
    workspaceId: string
  ): Promise<MIGInfluenceScore | null> {
    try {
      // Check cache first
      const { data: cached } = await supabase
        .from('mig_influence_scores')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('entity_slug', artistSlug)
        .single();

      if (cached && new Date(cached.updated_at) > new Date(Date.now() - 3600000)) {
        return cached as MIGInfluenceScore;
      }

      // Compute from MIG
      const influence = await computeInfluenceScore(artistSlug);
      if (!influence) return null;

      // Calculate authority (based on incoming high-weight edges)
      const neighbors = await getNeighbors(artistSlug, { depth_limit: 1 });
      const authorityScore =
        neighbors.filter((n) => n.weight > 0.7 && n.relationship === 'influences').length /
        Math.max(neighbors.length, 1);

      // Calculate relevance (based on recent activity)
      const relevanceScore = 0.8; // Placeholder - would check recent coverage events

      const scores: MIGInfluenceScore = {
        entity_slug: artistSlug,
        entity_type: 'artist',
        influence_score: influence.total_score,
        authority_score: authorityScore,
        relevance_score: relevanceScore,
        metadata: influence.breakdown,
      };

      // Update cache
      await supabase.from('mig_influence_scores').upsert({
        workspace_id: workspaceId,
        ...scores,
      });

      return scores;
    } catch (error) {
      console.error('Error getting influence scores:', error);
      return null;
    }
  },

  /**
   * Get scene alignment for an artist
   */
  async getSceneAlignment(
    artistSlug: string,
    workspaceId: string
  ): Promise<MIGSceneAlignment[]> {
    try {
      // Check cache
      const { data: cached } = await supabase
        .from('mig_scene_alignment')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('artist_slug', artistSlug);

      if (cached && cached.length > 0) {
        const recent = cached.filter(
          (c) => new Date(c.updated_at) > new Date(Date.now() - 86400000)
        );
        if (recent.length > 0) {
          return recent as MIGSceneAlignment[];
        }
      }

      // Compute from MIG
      const neighbors = await getNeighbors(artistSlug, {
        node_type_filter: ['scene'],
        depth_limit: 2,
      });

      const alignments: MIGSceneAlignment[] = neighbors.map((neighbor) => ({
        artist_slug: artistSlug,
        scene_slug: neighbor.neighbor_id,
        alignment: neighbor.weight / (neighbor.path_length || 1),
        source: {
          relationship: neighbor.relationship,
          path_length: neighbor.path_length,
          weight: neighbor.weight,
        },
        reasoning: `${neighbor.relationship} connection at distance ${neighbor.path_length}`,
      }));

      // Update cache
      for (const alignment of alignments) {
        await supabase.from('mig_scene_alignment').upsert({
          workspace_id: workspaceId,
          ...alignment,
        });
      }

      return alignments;
    } catch (error) {
      console.error('Error getting scene alignment:', error);
      return [];
    }
  },

  /**
   * Get contact fit score using MIG
   */
  async getContactFit(
    contactId: string,
    artistSlug: string,
    workspaceId: string
  ): Promise<MIGContactFit | null> {
    try {
      // Check cache
      const { data: cached } = await supabase
        .from('mig_contact_fit')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('contact_id', contactId)
        .eq('artist_slug', artistSlug)
        .single();

      if (cached && new Date(cached.updated_at) > new Date(Date.now() - 3600000)) {
        return cached as MIGContactFit;
      }

      // Get contact's MIG node (assumes contact has slug mapping)
      // This is a placeholder - real implementation would map contact to MIG node
      const contactSlug = `journalist-${contactId.slice(0, 8)}`;

      // Find paths between contact and artist
      const path = await findShortestPath(contactSlug, artistSlug);

      if (!path) {
        return {
          contact_id: contactId,
          artist_slug: artistSlug,
          fit_score: 0,
          reasons: ['No graph connection found'],
          mig_paths: [],
          shared_scenes: [],
          shared_microgenres: [],
          mutual_connections: 0,
        };
      }

      // Calculate fit score
      const fitScore = Math.max(0, 1 - path.degrees_of_separation * 0.15);

      // Find shared scenes
      const artistScenes = await getNeighbors(artistSlug, { node_type_filter: ['scene'] });
      const contactScenes = await getNeighbors(contactSlug, { node_type_filter: ['scene'] });
      const sharedScenes = artistScenes
        .filter((as) => contactScenes.some((cs) => cs.neighbor_id === as.neighbor_id))
        .map((s) => s.neighbor_name);

      // Find shared microgenres
      const artistMicro = await getNeighbors(artistSlug, { node_type_filter: ['microgenre'] });
      const contactMicro = await getNeighbors(contactSlug, { node_type_filter: ['microgenre'] });
      const sharedMicro = artistMicro
        .filter((am) => contactMicro.some((cm) => cm.neighbor_id === am.neighbor_id))
        .map((m) => m.neighbor_name);

      const fit: MIGContactFit = {
        contact_id: contactId,
        artist_slug: artistSlug,
        fit_score: fitScore,
        reasons: [
          `${path.degrees_of_separation} degrees of separation`,
          sharedScenes.length > 0 ? `Shared scenes: ${sharedScenes.join(', ')}` : '',
          sharedMicro.length > 0 ? `Shared microgenres: ${sharedMicro.join(', ')}` : '',
        ].filter(Boolean),
        mig_paths: [
          {
            nodes: path.path.nodes.map((n) => n.slug),
            edges: path.path.edges.map((e) => ({
              from: e.source,
              to: e.target,
              relationship: e.rel,
              weight: e.weight,
            })),
            total_weight: path.total_weight,
            length: path.degrees_of_separation,
          },
        ],
        graph_distance: path.degrees_of_separation,
        shared_scenes: sharedScenes,
        shared_microgenres: sharedMicro,
        mutual_connections: sharedScenes.length + sharedMicro.length,
      };

      // Update cache
      await supabase.from('mig_contact_fit').upsert({
        workspace_id: workspaceId,
        ...fit,
      });

      return fit;
    } catch (error) {
      console.error('Error getting contact fit:', error);
      return null;
    }
  },

  /**
   * Get graph paths between two entities
   */
  async getGraphPaths(fromSlug: string, toSlug: string): Promise<GraphPath[]> {
    try {
      const path = await findShortestPath(fromSlug, toSlug);
      if (!path) return [];

      return [
        {
          nodes: path.path.nodes.map((n) => n.slug),
          edges: path.path.edges.map((e) => ({
            from: e.source,
            to: e.target,
            relationship: e.rel,
            weight: e.weight,
          })),
          total_weight: path.total_weight,
          length: path.degrees_of_separation,
        },
      ];
    } catch (error) {
      console.error('Error getting graph paths:', error);
      return [];
    }
  },

  /**
   * Get graph opportunities for an artist
   */
  async getGraphOpportunities(
    artistSlug: string,
    workspaceId: string
  ): Promise<MIGGraphOpportunity[]> {
    try {
      const recommendations = await recommendPitchTargets(artistSlug, { limit: 10 });

      return recommendations.map((rec) => ({
        type: rec.node.type as any,
        name: rec.node.name,
        slug: rec.node.slug,
        fit_score: rec.score,
        reasoning: rec.reasoning,
        path_summary: `${rec.common_connections} common connections`,
        recommended_action: `Pitch to ${rec.node.name} - ${rec.reasoning}`,
      }));
    } catch (error) {
      console.error('Error getting graph opportunities:', error);
      return [];
    }
  },

  /**
   * Get trending nodes from MIG
   */
  async getTrendingNodes(limit: number = 10) {
    try {
      // This would query recent edge creation activity
      // Placeholder implementation
      return [];
    } catch (error) {
      console.error('Error getting trending nodes:', error);
      return [];
    }
  },

  /**
   * Get correlation links for an artist
   */
  async getCorrelationLinks(artistSlug: string, workspaceId: string): Promise<MIGCorrelation[]> {
    try {
      // This would correlate MIG metrics with campaign performance
      // Placeholder - real implementation would query success_profiles + MIG
      return [];
    } catch (error) {
      console.error('Error getting correlation links:', error);
      return [];
    }
  },

  /**
   * Get dashboard insights powered by MIG
   */
  async getDashboardInsights(
    artistSlug: string,
    workspaceId: string
  ): Promise<MIGDashboardInsight[]> {
    const insights: MIGDashboardInsight[] = [];

    try {
      // Get rising scenes
      const scenes = await this.getSceneAlignment(artistSlug, workspaceId);
      const topScene = scenes.sort((a, b) => b.alignment - a.alignment)[0];
      if (topScene && topScene.alignment > 0.7) {
        insights.push({
          type: 'rising_scene',
          title: 'Strong Scene Alignment',
          description: `Your music has high alignment with the ${topScene.scene_slug} scene`,
          priority: 'high',
          entities: [{ slug: topScene.scene_slug, type: 'scene', name: topScene.scene_slug }],
          action: 'Explore scene-specific pitch targets',
        });
      }

      // Get graph opportunities
      const opportunities = await this.getGraphOpportunities(artistSlug, workspaceId);
      if (opportunities.length > 0) {
        insights.push({
          type: 'graph_opportunity',
          title: 'High-Fit Pitch Targets Identified',
          description: `Found ${opportunities.length} contacts with strong graph connections`,
          priority: 'high',
          entities: opportunities.slice(0, 3).map((o) => ({
            slug: o.slug,
            type: o.type,
            name: o.name,
          })),
          action: 'Review recommended pitch targets',
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating dashboard insights:', error);
      return insights;
    }
  },

  /**
   * Get pitch intel boost using MIG
   */
  async getPitchIntelBoost(
    contactSlug: string,
    artistSlug: string
  ): Promise<MIGPitchIntelBoost | null> {
    try {
      const paths = await this.getGraphPaths(artistSlug, contactSlug);
      if (paths.length === 0) return null;

      const path = paths[0];
      const relationships = path.edges.map((e) => ({
        type: e.relationship,
        description: `${e.relationship} connection`,
        relevance: e.weight,
      }));

      return {
        contact_slug: contactSlug,
        suggested_angles: [
          `You recently covered ${path.nodes[1]} who shares similar sound`,
          `Your focus on [microgenre] aligns with our latest release`,
          `We're part of the same scene community as artists you've featured`,
        ],
        graph_relationships: relationships,
        scene_context: 'Connected through underground electronic scene',
        microgenre_context: 'Both operate in experimental bass space',
        similar_coverage: [],
      };
    } catch (error) {
      console.error('Error getting pitch intel boost:', error);
      return null;
    }
  },
};

// Export for use in Fusion Layer
export default MIGFusionAdapter;

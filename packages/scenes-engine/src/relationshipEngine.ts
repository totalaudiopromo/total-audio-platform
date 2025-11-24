/**
 * Relationship Engine
 * Builds and analyzes scene-to-scene relationships
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ScenesStore } from './scenesStore.js';
import { MIGAdapter } from './migAdapter.js';
import { FusionAdapter } from './fusionAdapter.js';
import {
  SceneRelationship,
  CreateRelationshipInput,
  RelationType,
  SceneCluster,
} from './types.js';
import { createLogger } from './utils/logger.js';
import { jaccardSimilarity } from './utils/math.js';

const logger = createLogger('RelationshipEngine');

export interface RelationshipEngineConfig {
  supabase: SupabaseClient;
  scenesStore: ScenesStore;
  migAdapter: MIGAdapter;
  fusionAdapter: FusionAdapter;
}

/**
 * Relationship Engine - Builds scene relationships
 */
export class RelationshipEngine {
  private supabase: SupabaseClient;
  private scenesStore: ScenesStore;
  private migAdapter: MIGAdapter;
  private fusionAdapter: FusionAdapter;

  constructor(config: RelationshipEngineConfig) {
    this.supabase = config.supabase;
    this.scenesStore = config.scenesStore;
    this.migAdapter = config.migAdapter;
    this.fusionAdapter = config.fusionAdapter;
  }

  /**
   * Rebuild all scene relationships
   * Analyzes all scene pairs to identify connections
   */
  async rebuildSceneRelationships(): Promise<SceneRelationship[]> {
    try {
      logger.info('Starting scene relationship rebuild');

      const scenes = await this.scenesStore.listScenes();
      const relationships: CreateRelationshipInput[] = [];

      // Analyze all scene pairs
      for (let i = 0; i < scenes.length; i++) {
        for (let j = i + 1; j < scenes.length; j++) {
          const sceneA = scenes[i];
          const sceneB = scenes[j];

          const sceneRelationships = await this.analyzeScenePair(
            sceneA.slug,
            sceneB.slug
          );

          relationships.push(...sceneRelationships);
        }
      }

      // Batch upsert relationships
      if (relationships.length > 0) {
        const created = await this.scenesStore.batchSetRelationships(relationships);
        logger.info(`Created/updated ${created.length} scene relationships`);
        return created;
      }

      return [];
    } catch (error) {
      logger.error('Failed to rebuild scene relationships:', error);
      return [];
    }
  }

  /**
   * Analyze relationship between two scenes
   */
  private async analyzeScenePair(
    sceneSlugA: string,
    sceneSlugB: string
  ): Promise<CreateRelationshipInput[]> {
    try {
      const relationships: CreateRelationshipInput[] = [];

      // 1. Shared members analysis (shares_audience)
      const sharedMembersRel = await this.analyzeSharedMembers(sceneSlugA, sceneSlugB);
      if (sharedMembersRel) {
        relationships.push(sharedMembersRel);
      }

      // 2. MIG connection analysis (influences, adjacent)
      const migRel = await this.analyzeMIGConnections(sceneSlugA, sceneSlugB);
      if (migRel) {
        relationships.push(migRel);
      }

      // 3. Crossover campaign analysis
      const crossoverRel = await this.analyzeCrossoverCampaigns(sceneSlugA, sceneSlugB);
      if (crossoverRel) {
        relationships.push(crossoverRel);
      }

      return relationships;
    } catch (error) {
      logger.error(`Failed to analyze scene pair ${sceneSlugA} <-> ${sceneSlugB}:`, error);
      return [];
    }
  }

  /**
   * Analyze shared members between scenes
   */
  private async analyzeSharedMembers(
    sceneSlugA: string,
    sceneSlugB: string
  ): Promise<CreateRelationshipInput | null> {
    try {
      // Get members of both scenes
      const [membersA, membersB] = await Promise.all([
        this.scenesStore.getSceneMemberships({ sceneSlug: sceneSlugA }),
        this.scenesStore.getSceneMemberships({ sceneSlug: sceneSlugB }),
      ]);

      // Calculate overlap
      const slugsA = new Set(membersA.map(m => m.entity_slug));
      const slugsB = new Set(membersB.map(m => m.entity_slug));

      const overlap = jaccardSimilarity(slugsA, slugsB);

      // If significant overlap, create shares_audience relationship
      if (overlap > 0.2) {
        // 20% threshold
        return {
          source_scene_slug: sceneSlugA,
          target_scene_slug: sceneSlugB,
          relation_type: 'shares_audience',
          weight: overlap,
          metadata: {
            shared_members: [...slugsA].filter(s => slugsB.has(s)).length,
            overlap_percentage: overlap * 100,
          },
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to analyze shared members:', error);
      return null;
    }
  }

  /**
   * Analyze MIG graph connections between scenes
   */
  private async analyzeMIGConnections(
    sceneSlugA: string,
    sceneSlugB: string
  ): Promise<CreateRelationshipInput | null> {
    try {
      const migAnalysis = await this.migAdapter.inferSceneRelationshipsFromMIG(
        sceneSlugA,
        sceneSlugB
      );

      if (migAnalysis.connectionStrength > 0.3) {
        // Determine relationship type based on connection pattern
        let relationType: RelationType = 'adjacent';

        // If shared tastemakers > shared artists, likely influence relationship
        if (migAnalysis.sharedTastemakers > migAnalysis.sharedArtists) {
          relationType = 'influences';
        }

        return {
          source_scene_slug: sceneSlugA,
          target_scene_slug: sceneSlugB,
          relation_type: relationType,
          weight: migAnalysis.connectionStrength,
          metadata: {
            shared_nodes: migAnalysis.sharedNodes,
            shared_artists: migAnalysis.sharedArtists,
            shared_tastemakers: migAnalysis.sharedTastemakers,
          },
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to analyze MIG connections:', error);
      return null;
    }
  }

  /**
   * Analyze crossover campaigns between scenes
   */
  private async analyzeCrossoverCampaigns(
    sceneSlugA: string,
    sceneSlugB: string
  ): Promise<CreateRelationshipInput | null> {
    try {
      const timeRange = {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        end: new Date(),
      };

      const crossoverAnalysis = await this.fusionAdapter.analyzeCrossSceneCampaigns(
        sceneSlugA,
        sceneSlugB,
        timeRange
      );

      if (crossoverAnalysis.crossoverCampaigns > 5) {
        // Threshold
        return {
          source_scene_slug: sceneSlugA,
          target_scene_slug: sceneSlugB,
          relation_type: 'crossover',
          weight: Math.min(1.0, crossoverAnalysis.crossoverCampaigns / 20), // Normalize
          metadata: {
            shared_artists: crossoverAnalysis.sharedArtists,
            crossover_campaigns: crossoverAnalysis.crossoverCampaigns,
            avg_success_rate: crossoverAnalysis.avgSuccessRate,
          },
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to analyze crossover campaigns:', error);
      return null;
    }
  }

  /**
   * Get relationships for a specific scene
   */
  async getSceneRelationships(sceneSlug: string): Promise<SceneRelationship[]> {
    try {
      return await this.scenesStore.getSceneRelationships(sceneSlug);
    } catch (error) {
      logger.error(`Failed to get relationships for ${sceneSlug}:`, error);
      return [];
    }
  }

  /**
   * Get scene cluster (highly interconnected scenes)
   */
  async getSceneCluster(sceneSlug: string, depth: number = 2): Promise<SceneCluster> {
    try {
      logger.debug(`Building scene cluster for ${sceneSlug} with depth ${depth}`);

      const visited = new Set<string>([sceneSlug]);
      const cluster: string[] = [sceneSlug];
      let currentLevel = [sceneSlug];

      // BFS to find connected scenes
      for (let d = 0; d < depth; d++) {
        const nextLevel: string[] = [];

        for (const currentScene of currentLevel) {
          const relationships = await this.scenesStore.getSceneRelationships(
            currentScene
          );

          for (const rel of relationships) {
            // Get the "other" scene in the relationship
            const otherScene =
              rel.source_scene_slug === currentScene
                ? rel.target_scene_slug
                : rel.source_scene_slug;

            if (!visited.has(otherScene) && rel.weight > 0.3) {
              // Threshold
              visited.add(otherScene);
              cluster.push(otherScene);
              nextLevel.push(otherScene);
            }
          }
        }

        currentLevel = nextLevel;
      }

      // Calculate average interconnectedness
      const allRelationships = await Promise.all(
        cluster.map(s => this.scenesStore.getSceneRelationships(s))
      );

      const totalRelationships = allRelationships.flat().length;
      const maxPossibleRelationships = (cluster.length * (cluster.length - 1)) / 2;
      const avgInterconnectedness =
        maxPossibleRelationships > 0
          ? totalRelationships / maxPossibleRelationships
          : 0;

      // Get scenes data to determine dominant region
      const sceneData = await Promise.all(
        cluster.map(s => this.scenesStore.getSceneBySlug(s))
      );

      const regionCounts: Record<string, number> = {};
      const microgenreSets: Set<string>[] = [];

      sceneData.forEach(scene => {
        if (scene) {
          if (scene.region) {
            regionCounts[scene.region] = (regionCounts[scene.region] || 0) + 1;
          }
          microgenreSets.push(new Set(scene.microgenres));
        }
      });

      const dominantRegion =
        Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      // Find shared microgenres
      const sharedMicrogenres =
        microgenreSets.length > 0
          ? Array.from(microgenreSets[0]).filter(mg =>
              microgenreSets.every(set => set.has(mg))
            )
          : [];

      return {
        scenes: cluster,
        centerScene: sceneSlug,
        avgInterconnectedness,
        dominantRegion,
        sharedMicrogenres,
      };
    } catch (error) {
      logger.error(`Failed to get scene cluster for ${sceneSlug}:`, error);
      return {
        scenes: [sceneSlug],
        centerScene: sceneSlug,
        avgInterconnectedness: 0,
        dominantRegion: null,
        sharedMicrogenres: [],
      };
    }
  }

  /**
   * Find emerging scene relationships
   * Identifies new or strengthening connections
   */
  async findEmergingRelationships(
    sceneSlug: string
  ): Promise<Array<{ targetScene: string; relationType: RelationType; trend: string }>> {
    try {
      // TODO: Implement temporal analysis to identify emerging relationships
      // This would compare recent relationship weights to historical data
      // and identify growing connections

      logger.debug(`Finding emerging relationships for ${sceneSlug}`);
      return [];
    } catch (error) {
      logger.error('Failed to find emerging relationships:', error);
      return [];
    }
  }
}

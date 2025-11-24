/**
 * Membership Engine
 * Infers and manages scene/microgenre memberships for entities
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ScenesStore } from './scenesStore.js';
import { MIGAdapter } from './migAdapter.js';
import { CMGAdapter } from './cmgAdapter.js';
import { FusionAdapter } from './fusionAdapter.js';
import {
  SceneMembership,
  CreateMembershipInput,
  EntityType,
  MembershipSource,
  EntitySceneProfile,
} from './types.js';
import { createLogger } from './utils/logger.js';
import { jaccardSimilarity } from './utils/math.js';

const logger = createLogger('MembershipEngine');

export interface MembershipEngineConfig {
  supabase: SupabaseClient;
  scenesStore: ScenesStore;
  migAdapter: MIGAdapter;
  cmgAdapter: CMGAdapter;
  fusionAdapter: FusionAdapter;
}

/**
 * Membership Engine - Infers and manages scene memberships
 */
export class MembershipEngine {
  private supabase: SupabaseClient;
  private scenesStore: ScenesStore;
  private migAdapter: MIGAdapter;
  private cmgAdapter: CMGAdapter;
  private fusionAdapter: FusionAdapter;

  constructor(config: MembershipEngineConfig) {
    this.supabase = config.supabase;
    this.scenesStore = config.scenesStore;
    this.migAdapter = config.migAdapter;
    this.cmgAdapter = config.cmgAdapter;
    this.fusionAdapter = config.fusionAdapter;
  }

  // ==========================================================================
  // INFERENCE FROM MIG
  // ==========================================================================

  /**
   * Infer scene memberships from MIG data
   * Analyzes MIG nodes and their relationships to assign scene affiliations
   */
  async inferSceneMembershipsFromMIG(): Promise<SceneMembership[]> {
    try {
      logger.info('Starting MIG-based scene membership inference');

      const scenes = await this.scenesStore.listScenes();
      const allMemberships: CreateMembershipInput[] = [];

      for (const scene of scenes) {
        logger.debug(`Inferring memberships for scene: ${scene.slug}`);

        // Get MIG nodes related to this scene
        const relatedNodes = await this.migAdapter.getSceneRelatedNodes(scene.slug);

        // Create memberships for each node
        for (const node of relatedNodes) {
          const confidence = this.calculateMIGConfidence(node);

          if (confidence >= 0.3) {
            // Minimum threshold
            allMemberships.push({
              entity_type: this.migAdapter.mapMIGTypeToEntityType(node.type),
              entity_id: node.id,
              entity_slug: node.slug,
              scene_slug: scene.slug,
              confidence,
              source: 'mig',
            });
          }
        }
      }

      // Batch insert memberships
      if (allMemberships.length > 0) {
        const created = await this.scenesStore.batchSetMemberships(allMemberships);
        logger.info(`Created ${created.length} MIG-based memberships`);
        return created;
      }

      return [];
    } catch (error) {
      logger.error('Failed to infer memberships from MIG:', error);
      throw error;
    }
  }

  /**
   * Calculate confidence score for MIG-based membership
   */
  private calculateMIGConfidence(node: any): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on metadata signals
    if (node.metadata?.scene_verified) {
      confidence += 0.3;
    }
    if (node.metadata?.influence_score > 0.7) {
      confidence += 0.2;
    }
    if (node.metadata?.community_endorsed) {
      confidence += 0.1;
    }

    return Math.min(1.0, confidence);
  }

  // ==========================================================================
  // INFERENCE FROM CMG
  // ==========================================================================

  /**
   * Infer scene memberships from CMG creative arcs
   */
  async inferSceneMembershipsFromCMG(artistId: string): Promise<SceneMembership[]> {
    try {
      logger.debug(`Inferring scene memberships from CMG for artist: ${artistId}`);

      // Get suggested microgenres from CMG
      const suggestedMicrogenres = await this.cmgAdapter.deriveMicrogenreFromCMG(artistId);

      if (suggestedMicrogenres.length === 0) {
        return [];
      }

      const memberships: CreateMembershipInput[] = [];

      // For each suggested microgenre, find parent scenes
      for (const microgenreSlug of suggestedMicrogenres) {
        const microgenre = await this.scenesStore.getMicrogenreBySlug(microgenreSlug);

        if (microgenre) {
          // Add microgenre membership
          memberships.push({
            entity_type: 'artist',
            entity_slug: artistId,
            scene_slug: microgenre.parent_scene_slug || 'unknown',
            microgenre_slug: microgenreSlug,
            confidence: 0.6, // CMG-based confidence
            source: 'cmg',
          });
        }
      }

      // Get emotional scene affinity
      const affinities = await this.cmgAdapter.deriveEmotionalSceneAffinity(artistId);

      for (const affinity of affinities) {
        memberships.push({
          entity_type: 'artist',
          entity_slug: artistId,
          scene_slug: affinity.sceneSlug,
          confidence: affinity.affinityScore,
          source: 'cmg',
        });
      }

      if (memberships.length > 0) {
        return await this.scenesStore.batchSetMemberships(memberships);
      }

      return [];
    } catch (error) {
      logger.error(`Failed to infer CMG memberships for ${artistId}:`, error);
      return [];
    }
  }

  // ==========================================================================
  // ENTITY ANALYSIS
  // ==========================================================================

  /**
   * Get comprehensive scene profile for an entity
   */
  async getEntitySceneProfile(
    entitySlug: string,
    entityType: EntityType
  ): Promise<EntitySceneProfile> {
    try {
      logger.debug(`Building scene profile for entity: ${entitySlug}`);

      // Get all memberships for this entity
      const memberships = await this.scenesStore.getSceneMemberships({
        entitySlug,
        entityType,
        minConfidence: 0.3,
      });

      if (memberships.length === 0) {
        return {
          entitySlug,
          entityType,
          primaryScene: null,
          secondaryScenes: [],
          microgenres: [],
          lastUpdated: new Date().toISOString(),
        };
      }

      // Sort by confidence
      const sortedMemberships = [...memberships].sort(
        (a, b) => b.confidence - a.confidence
      );

      // Identify primary scene (highest confidence)
      const primaryMembership = sortedMemberships[0];
      const primaryScene = await this.scenesStore.getSceneBySlug(
        primaryMembership.scene_slug
      );

      // Collect secondary scenes
      const secondaryScenes = [];
      const seenScenes = new Set([primaryMembership.scene_slug]);

      for (let i = 1; i < sortedMemberships.length && secondaryScenes.length < 5; i++) {
        const membership = sortedMemberships[i];
        if (!seenScenes.has(membership.scene_slug)) {
          const scene = await this.scenesStore.getSceneBySlug(membership.scene_slug);
          if (scene) {
            secondaryScenes.push({
              slug: scene.slug,
              name: scene.name,
              confidence: membership.confidence,
            });
            seenScenes.add(membership.scene_slug);
          }
        }
      }

      // Collect microgenres
      const microgenres = [];
      const seenMicrogenres = new Set<string>();

      for (const membership of sortedMemberships) {
        if (
          membership.microgenre_slug &&
          !seenMicrogenres.has(membership.microgenre_slug)
        ) {
          const microgenre = await this.scenesStore.getMicrogenreBySlug(
            membership.microgenre_slug
          );
          if (microgenre) {
            microgenres.push({
              slug: microgenre.slug,
              name: microgenre.name,
              confidence: membership.confidence,
            });
            seenMicrogenres.add(membership.microgenre_slug);
          }
        }
      }

      return {
        entitySlug,
        entityType,
        primaryScene: primaryScene
          ? {
              slug: primaryScene.slug,
              name: primaryScene.name,
              confidence: primaryMembership.confidence,
            }
          : null,
        secondaryScenes,
        microgenres,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Failed to build entity scene profile for ${entitySlug}:`, error);
      throw error;
    }
  }

  /**
   * Get top entities in a scene
   */
  async getTopEntitiesForScene(
    sceneSlug: string,
    entityType?: EntityType,
    limit: number = 20
  ): Promise<Array<{
    entitySlug: string;
    entityType: EntityType;
    confidence: number;
    source: MembershipSource;
  }>> {
    try {
      const memberships = await this.scenesStore.getSceneMemberships({
        sceneSlug,
        entityType,
        minConfidence: 0.5,
        limit,
      });

      return memberships.map(m => ({
        entitySlug: m.entity_slug,
        entityType: m.entity_type,
        confidence: m.confidence,
        source: m.source,
      }));
    } catch (error) {
      logger.error(`Failed to get top entities for scene ${sceneSlug}:`, error);
      return [];
    }
  }

  // ==========================================================================
  // CONFIDENCE CALCULATION
  // ==========================================================================

  /**
   * Calculate confidence for entity-scene match
   * Combines multiple signals: MIG, CMG, Fusion performance
   */
  async calculateConfidenceForEntitySceneMatch(
    entitySlug: string,
    sceneSlug: string,
    entityType: EntityType = 'artist'
  ): Promise<number> {
    try {
      logger.debug(`Calculating confidence: ${entitySlug} -> ${sceneSlug}`);

      let totalWeight = 0;
      let weightedScore = 0;

      // Signal 1: MIG connections (weight: 0.3)
      const migEntity = await this.migAdapter.getEntityBySlug(entitySlug);
      if (migEntity) {
        const sceneNodes = await this.migAdapter.getSceneRelatedNodes(sceneSlug);
        const entityNeighbors = await this.migAdapter.getEntityNeighbors(entitySlug);

        const sceneNodeSlugs = new Set(sceneNodes.map(n => n.slug));
        const neighborSlugs = new Set(entityNeighbors.map(n => n.slug));

        const overlapScore = jaccardSimilarity(sceneNodeSlugs, neighborSlugs);

        weightedScore += overlapScore * 0.3;
        totalWeight += 0.3;
      }

      // Signal 2: CMG emotional/thematic match (weight: 0.25)
      if (entityType === 'artist') {
        const thematicAnalysis = await this.cmgAdapter.analyzeThematicOverlap(
          entitySlug,
          sceneSlug
        );

        weightedScore += thematicAnalysis.overlapScore * 0.25;
        totalWeight += 0.25;
      }

      // Signal 3: Campaign performance in scene (weight: 0.45)
      const sceneSignals = await this.fusionAdapter.getArtistSceneSignals(entitySlug);
      const scenePerformance = sceneSignals.performanceByScene[sceneSlug];

      if (scenePerformance) {
        const performanceScore =
          scenePerformance.avgSuccessRate * 0.7 +
          Math.min(1, scenePerformance.campaignCount / 10) * 0.3;

        weightedScore += performanceScore * 0.45;
        totalWeight += 0.45;
      }

      // Calculate final confidence
      const confidence = totalWeight > 0 ? weightedScore / totalWeight : 0.5;

      logger.debug(`Confidence for ${entitySlug} -> ${sceneSlug}: ${confidence.toFixed(2)}`);
      return Math.max(0, Math.min(1, confidence));
    } catch (error) {
      logger.error('Failed to calculate confidence:', error);
      return 0.5; // Default confidence
    }
  }

  // ==========================================================================
  // BATCH OPERATIONS
  // ==========================================================================

  /**
   * Infer memberships for multiple entities
   */
  async batchInferMemberships(
    entities: Array<{ slug: string; type: EntityType }>,
    scenes: string[]
  ): Promise<SceneMembership[]> {
    try {
      logger.info(
        `Batch inferring memberships for ${entities.length} entities across ${scenes.length} scenes`
      );

      const memberships: CreateMembershipInput[] = [];

      for (const entity of entities) {
        for (const sceneSlug of scenes) {
          const confidence = await this.calculateConfidenceForEntitySceneMatch(
            entity.slug,
            sceneSlug,
            entity.type
          );

          if (confidence >= 0.4) {
            // Threshold
            memberships.push({
              entity_type: entity.type,
              entity_slug: entity.slug,
              scene_slug: sceneSlug,
              confidence,
              source: 'ai_inference',
            });
          }
        }
      }

      if (memberships.length > 0) {
        return await this.scenesStore.batchSetMemberships(memberships);
      }

      return [];
    } catch (error) {
      logger.error('Failed to batch infer memberships:', error);
      return [];
    }
  }

  /**
   * Update membership confidence based on new data
   */
  async recalculateMembershipConfidence(
    membershipId: string
  ): Promise<number> {
    try {
      // TODO: Implement membership confidence recalculation
      // This would fetch the membership, recalculate confidence
      // using current signals, and update if significantly changed

      return 0.5;
    } catch (error) {
      logger.error('Failed to recalculate membership confidence:', error);
      return 0.5;
    }
  }
}

/**
 * Recommendation Engine
 * Provides personalized scene and microgenre recommendations
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { ScenesStore } from './scenesStore.js';
import { CMGAdapter } from './cmgAdapter.js';
import { FusionAdapter } from './fusionAdapter.js';
import { MembershipEngine } from './membershipEngine.js';
import { ScenePulse } from './scenePulse.js';
import {
  SceneRecommendation,
  SceneRecommendationItem,
  MicrogenreRecommendationItem,
} from './types.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('RecommendationEngine');

export interface RecommendationEngineConfig {
  supabase: SupabaseClient;
  scenesStore: ScenesStore;
  cmgAdapter: CMGAdapter;
  fusionAdapter: FusionAdapter;
  membershipEngine: MembershipEngine;
  scenePulse: ScenePulse;
}

/**
 * Recommendation Engine - Personalized scene recommendations
 */
export class RecommendationEngine {
  private supabase: SupabaseClient;
  private scenesStore: ScenesStore;
  private cmgAdapter: CMGAdapter;
  private fusionAdapter: FusionAdapter;
  private membershipEngine: MembershipEngine;
  private scenePulse: ScenePulse;

  constructor(config: RecommendationEngineConfig) {
    this.supabase = config.supabase;
    this.scenesStore = config.scenesStore;
    this.cmgAdapter = config.cmgAdapter;
    this.fusionAdapter = config.fusionAdapter;
    this.membershipEngine = config.membershipEngine;
    this.scenePulse = config.scenePulse;
  }

  /**
   * Recommend scenes for a user
   * Generic recommendations based on user's overall activity
   */
  async recommendScenesForUser(userId: string): Promise<SceneRecommendation> {
    try {
      logger.info(`Generating scene recommendations for user: ${userId}`);

      // Check cache first
      const cached = await this.scenesStore.getCachedRecommendations(userId);
      if (cached) {
        logger.debug('Returning cached recommendations');
        return cached.recommendations as SceneRecommendation;
      }

      // Get user's artists (if any) to understand preferences
      // TODO: Query user's workspace or campaigns to get their artists

      // For now, return trending scenes
      const trendingScenes = await this.getGlobalTrendingScenes(10);
      const recommendation: SceneRecommendation = {
        scenes: trendingScenes,
        microgenres: [],
        notes: [
          'These are currently the most active scenes globally.',
          'Connect your artist profiles to get personalized recommendations.',
        ],
        generatedAt: new Date().toISOString(),
      };

      // Cache recommendations
      await this.scenesStore.cacheRecommendations(userId, recommendation, 24);

      return recommendation;
    } catch (error) {
      logger.error(`Failed to recommend scenes for user ${userId}:`, error);
      return this.emptyRecommendation();
    }
  }

  /**
   * Recommend scenes for an artist
   * Personalized based on artist's sound, campaigns, and creative profile
   */
  async recommendScenesForArtist(artistSlug: string): Promise<SceneRecommendation> {
    try {
      logger.info(`Generating scene recommendations for artist: ${artistSlug}`);

      const sceneRecommendations: SceneRecommendationItem[] = [];
      const microgenreRecommendations: MicrogenreRecommendationItem[] = [];
      const notes: string[] = [];

      // 1. Get existing scene profile
      const existingProfile = await this.membershipEngine.getEntitySceneProfile(
        artistSlug,
        'artist'
      );

      if (existingProfile.primaryScene) {
        // Artist already has scene affiliations
        sceneRecommendations.push({
          slug: existingProfile.primaryScene.slug,
          name: existingProfile.primaryScene.name,
          score: existingProfile.primaryScene.confidence,
          reason: 'Your primary scene based on existing data',
          confidence: 'high',
          category: 'core',
        });

        notes.push(
          `You're already established in ${existingProfile.primaryScene.name}.`
        );
      }

      // 2. CMG-based recommendations (creative/emotional fit)
      const cmgMicrogenres = await this.cmgAdapter.deriveMicrogenreFromCMG(artistSlug);

      for (const microgenreSlug of cmgMicrogenres) {
        const microgenre = await this.scenesStore.getMicrogenreBySlug(microgenreSlug);
        if (microgenre) {
          microgenreRecommendations.push({
            slug: microgenre.slug,
            name: microgenre.name,
            score: 0.75,
            reason: 'Matches your creative and emotional profile',
            parentScenes: microgenre.parent_scene_slug
              ? [microgenre.parent_scene_slug]
              : [],
          });

          // If microgenre has parent scene, recommend it
          if (microgenre.parent_scene_slug) {
            const parentScene = await this.scenesStore.getSceneBySlug(
              microgenre.parent_scene_slug
            );
            if (parentScene) {
              sceneRecommendations.push({
                slug: parentScene.slug,
                name: parentScene.name,
                score: 0.7,
                reason: `Your sound aligns with ${microgenre.name}`,
                confidence: 'medium',
                category: 'adjacent',
              });
            }
          }
        }
      }

      // 3. Campaign performance-based recommendations
      const campaignSignals = await this.fusionAdapter.getArtistSceneSignals(
        artistSlug
      );

      for (const suggestion of campaignSignals.suggestedScenes) {
        const scene = await this.scenesStore.getSceneBySlug(suggestion.sceneSlug);
        if (scene) {
          sceneRecommendations.push({
            slug: scene.slug,
            name: scene.name,
            score: suggestion.score,
            reason: suggestion.reason,
            confidence: suggestion.score > 0.7 ? 'high' : 'medium',
            category: 'opportunity',
          });
        }
      }

      // 4. Add trending/emerging scenes with high pulse
      const emergingScenes = await this.getEmergingScenes(3);

      for (const scene of emergingScenes) {
        // Check if not already recommended
        if (!sceneRecommendations.find(s => s.slug === scene.slug)) {
          sceneRecommendations.push({
            slug: scene.slug,
            name: scene.name,
            score: scene.score,
            reason: scene.reason,
            confidence: 'low',
            category: 'experimental',
          });
        }
      }

      // Deduplicate and sort
      const uniqueScenes = this.deduplicateRecommendations(sceneRecommendations);
      const sortedScenes = uniqueScenes.sort((a, b) => b.score - a.score).slice(0, 10);

      const sortedMicrogenres = microgenreRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 7);

      // Add general notes
      if (sortedScenes.length > 0) {
        notes.push(
          `We've identified ${sortedScenes.length} scenes that match your profile.`
        );
      }
      if (sortedMicrogenres.length > 0) {
        notes.push(
          `${sortedMicrogenres.length} specific microgenres align with your sound.`
        );
      }

      return {
        scenes: sortedScenes,
        microgenres: sortedMicrogenres,
        notes,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Failed to recommend scenes for artist ${artistSlug}:`, error);
      return this.emptyRecommendation();
    }
  }

  /**
   * Recommend microgenres for an artist
   */
  async recommendMicrogenresForArtist(
    artistSlug: string
  ): Promise<MicrogenreRecommendationItem[]> {
    try {
      logger.debug(`Recommending microgenres for artist: ${artistSlug}`);

      const recommendations: MicrogenreRecommendationItem[] = [];

      // Get CMG-based suggestions
      const cmgMicrogenres = await this.cmgAdapter.deriveMicrogenreFromCMG(artistSlug);

      for (const microgenreSlug of cmgMicrogenres) {
        const microgenre = await this.scenesStore.getMicrogenreBySlug(microgenreSlug);
        if (microgenre) {
          recommendations.push({
            slug: microgenre.slug,
            name: microgenre.name,
            score: 0.8,
            reason: 'Derived from your creative arcs and themes',
            parentScenes: microgenre.parent_scene_slug
              ? [microgenre.parent_scene_slug]
              : [],
          });
        }
      }

      // Get similar artists' microgenres
      const similarArtists = await this.cmgAdapter.findSimilarArtists(artistSlug, 5);

      for (const similar of similarArtists) {
        const similarProfile = await this.membershipEngine.getEntitySceneProfile(
          similar.artistId,
          'artist'
        );

        for (const microgenre of similarProfile.microgenres) {
          // Check if not already in recommendations
          if (!recommendations.find(r => r.slug === microgenre.slug)) {
            recommendations.push({
              slug: microgenre.slug,
              name: microgenre.name,
              score: similar.similarityScore * 0.7,
              reason: 'Popular among artists with similar profiles',
              parentScenes: [], // Would need to fetch from DB
            });
          }
        }
      }

      return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
    } catch (error) {
      logger.error(`Failed to recommend microgenres for ${artistSlug}:`, error);
      return [];
    }
  }

  /**
   * Get globally trending scenes
   */
  private async getGlobalTrendingScenes(
    limit: number
  ): Promise<SceneRecommendationItem[]> {
    try {
      const pulses = await this.scenePulse.getGlobalScenePulse(limit);

      return pulses.map(pulse => ({
        slug: pulse.sceneSlug,
        name: pulse.sceneName,
        score: pulse.hotnessScore / 100,
        reason: `${pulse.growthClassification} scene with ${pulse.hotnessScore}/100 hotness`,
        confidence: 'medium',
        category: 'opportunity' as const,
      }));
    } catch (error) {
      logger.error('Failed to get trending scenes:', error);
      return [];
    }
  }

  /**
   * Get emerging scenes (high growth potential)
   */
  private async getEmergingScenes(
    limit: number
  ): Promise<SceneRecommendationItem[]> {
    try {
      const allScenes = await this.scenesStore.listScenes();
      const emergingScenes: SceneRecommendationItem[] = [];

      for (const scene of allScenes) {
        const pulse = await this.scenePulse.getScenePulse(scene.slug);

        if (pulse.growthClassification === 'Emerging') {
          emergingScenes.push({
            slug: scene.slug,
            name: scene.name,
            score: pulse.growthRate,
            reason: `Emerging scene with ${pulse.growthRate.toFixed(0)}% growth`,
            confidence: 'medium',
            category: 'experimental',
          });
        }
      }

      return emergingScenes.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (error) {
      logger.error('Failed to get emerging scenes:', error);
      return [];
    }
  }

  /**
   * Deduplicate recommendations by slug
   */
  private deduplicateRecommendations(
    recommendations: SceneRecommendationItem[]
  ): SceneRecommendationItem[] {
    const seen = new Set<string>();
    const unique: SceneRecommendationItem[] = [];

    for (const rec of recommendations) {
      if (!seen.has(rec.slug)) {
        seen.add(rec.slug);
        unique.push(rec);
      }
    }

    return unique;
  }

  /**
   * Empty recommendation result
   */
  private emptyRecommendation(): SceneRecommendation {
    return {
      scenes: [],
      microgenres: [],
      notes: ['No recommendations available at this time.'],
      generatedAt: new Date().toISOString(),
    };
  }
}

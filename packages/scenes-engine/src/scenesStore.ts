/**
 * Scenes Store
 * CRUD operations for scenes engine database tables
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  Scene,
  Microgenre,
  SceneMembership,
  SceneTrend,
  SceneRelationship,
  SceneRecommendationsCache,
  CreateSceneInput,
  CreateMicrogenreInput,
  CreateMembershipInput,
  CreateTrendInput,
  CreateRelationshipInput,
  SceneFilters,
  MembershipQueryOptions,
  NotFoundError,
  ValidationError,
} from './types.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('ScenesStore');

export interface ScenesStoreConfig {
  supabase: SupabaseClient;
}

/**
 * Scenes Store - Database operations for scenes engine
 */
export class ScenesStore {
  private supabase: SupabaseClient;

  constructor(config: ScenesStoreConfig) {
    this.supabase = config.supabase;
  }

  // ==========================================================================
  // SCENES CRUD
  // ==========================================================================

  /**
   * List all scenes with optional filters
   */
  async listScenes(filters?: SceneFilters): Promise<Scene[]> {
    try {
      let query = this.supabase
        .from('scenes')
        .select('*')
        .order('name', { ascending: true });

      if (filters?.region) {
        query = query.eq('region', filters.region);
      }
      if (filters?.country) {
        query = query.eq('country', filters.country);
      }
      if (filters?.tag) {
        query = query.contains('tags', [filters.tag]);
      }
      if (filters?.microgenre) {
        query = query.contains('microgenres', [filters.microgenre]);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to list scenes:', error);
        throw error;
      }

      return (data as Scene[]) || [];
    } catch (error) {
      logger.error('Error in listScenes:', error);
      throw error;
    }
  }

  /**
   * Get scene by slug
   */
  async getSceneBySlug(slug: string): Promise<Scene | null> {
    try {
      const { data, error } = await this.supabase
        .from('scenes')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw error;
      }

      return data as Scene;
    } catch (error) {
      logger.error(`Error fetching scene ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Create or update a scene
   */
  async upsertScene(input: CreateSceneInput): Promise<Scene> {
    try {
      this.validateSceneInput(input);

      const sceneData = {
        slug: input.slug,
        name: input.name,
        description: input.description || null,
        region: input.region || null,
        country: input.country || null,
        microgenres: input.microgenres || [],
        tags: input.tags || [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabase
        .from('scenes')
        .upsert(sceneData, {
          onConflict: 'slug',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to upsert scene:', error);
        throw error;
      }

      logger.info(`Upserted scene: ${input.slug}`);
      return data as Scene;
    } catch (error) {
      logger.error('Error in upsertScene:', error);
      throw error;
    }
  }

  /**
   * Delete a scene
   */
  async deleteScene(slug: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('scenes')
        .delete()
        .eq('slug', slug);

      if (error) {
        throw error;
      }

      logger.info(`Deleted scene: ${slug}`);
    } catch (error) {
      logger.error(`Error deleting scene ${slug}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // MICROGENRES CRUD
  // ==========================================================================

  /**
   * List all microgenres
   */
  async listMicrogenres(parentSceneSlug?: string): Promise<Microgenre[]> {
    try {
      let query = this.supabase
        .from('microgenres')
        .select('*')
        .order('name', { ascending: true });

      if (parentSceneSlug) {
        query = query.eq('parent_scene_slug', parentSceneSlug);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to list microgenres:', error);
        throw error;
      }

      return (data as Microgenre[]) || [];
    } catch (error) {
      logger.error('Error in listMicrogenres:', error);
      throw error;
    }
  }

  /**
   * Get microgenre by slug
   */
  async getMicrogenreBySlug(slug: string): Promise<Microgenre | null> {
    try {
      const { data, error } = await this.supabase
        .from('microgenres')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data as Microgenre;
    } catch (error) {
      logger.error(`Error fetching microgenre ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Create or update a microgenre
   */
  async upsertMicrogenre(input: CreateMicrogenreInput): Promise<Microgenre> {
    try {
      this.validateMicrogenreInput(input);

      const microgenreData = {
        slug: input.slug,
        name: input.name,
        description: input.description || null,
        parent_scene_slug: input.parent_scene_slug || null,
        tags: input.tags || [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await this.supabase
        .from('microgenres')
        .upsert(microgenreData, {
          onConflict: 'slug',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to upsert microgenre:', error);
        throw error;
      }

      logger.info(`Upserted microgenre: ${input.slug}`);
      return data as Microgenre;
    } catch (error) {
      logger.error('Error in upsertMicrogenre:', error);
      throw error;
    }
  }

  // ==========================================================================
  // SCENE MEMBERSHIPS
  // ==========================================================================

  /**
   * Get scene memberships with filters
   */
  async getSceneMemberships(options: MembershipQueryOptions): Promise<SceneMembership[]> {
    try {
      let query = this.supabase
        .from('scene_memberships')
        .select('*')
        .order('confidence', { ascending: false });

      if (options.sceneSlug) {
        query = query.eq('scene_slug', options.sceneSlug);
      }
      if (options.microgenreSlug) {
        query = query.eq('microgenre_slug', options.microgenreSlug);
      }
      if (options.entityType) {
        query = query.eq('entity_type', options.entityType);
      }
      if (options.entitySlug) {
        query = query.eq('entity_slug', options.entitySlug);
      }
      if (options.minConfidence !== undefined) {
        query = query.gte('confidence', options.minConfidence);
      }
      if (options.source) {
        query = query.eq('source', options.source);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to get scene memberships:', error);
        throw error;
      }

      return (data as SceneMembership[]) || [];
    } catch (error) {
      logger.error('Error in getSceneMemberships:', error);
      throw error;
    }
  }

  /**
   * Set/update a scene membership
   */
  async setSceneMembership(input: CreateMembershipInput): Promise<SceneMembership> {
    try {
      this.validateMembershipInput(input);

      const membershipData = {
        entity_type: input.entity_type,
        entity_id: input.entity_id || null,
        entity_slug: input.entity_slug,
        scene_slug: input.scene_slug,
        microgenre_slug: input.microgenre_slug || null,
        confidence: input.confidence,
        source: input.source,
      };

      const { data, error } = await this.supabase
        .from('scene_memberships')
        .insert(membershipData)
        .select()
        .single();

      if (error) {
        logger.error('Failed to set scene membership:', error);
        throw error;
      }

      logger.info(`Set membership: ${input.entity_slug} -> ${input.scene_slug}`);
      return data as SceneMembership;
    } catch (error) {
      logger.error('Error in setSceneMembership:', error);
      throw error;
    }
  }

  /**
   * Batch insert scene memberships
   */
  async batchSetMemberships(inputs: CreateMembershipInput[]): Promise<SceneMembership[]> {
    try {
      if (inputs.length === 0) {
        return [];
      }

      const membershipData = inputs.map(input => ({
        entity_type: input.entity_type,
        entity_id: input.entity_id || null,
        entity_slug: input.entity_slug,
        scene_slug: input.scene_slug,
        microgenre_slug: input.microgenre_slug || null,
        confidence: input.confidence,
        source: input.source,
      }));

      const { data, error } = await this.supabase
        .from('scene_memberships')
        .insert(membershipData)
        .select();

      if (error) {
        logger.error('Failed to batch set memberships:', error);
        throw error;
      }

      logger.info(`Batch set ${data.length} memberships`);
      return (data as SceneMembership[]) || [];
    } catch (error) {
      logger.error('Error in batchSetMemberships:', error);
      throw error;
    }
  }

  // ==========================================================================
  // SCENE TRENDS
  // ==========================================================================

  /**
   * Record a trend data point
   */
  async recordTrend(input: CreateTrendInput): Promise<SceneTrend> {
    try {
      const { data, error } = await this.supabase
        .from('scene_trends')
        .insert(input)
        .select()
        .single();

      if (error) {
        logger.error('Failed to record trend:', error);
        throw error;
      }

      return data as SceneTrend;
    } catch (error) {
      logger.error('Error in recordTrend:', error);
      throw error;
    }
  }

  /**
   * Batch record trend data points
   */
  async batchRecordTrends(inputs: CreateTrendInput[]): Promise<SceneTrend[]> {
    try {
      if (inputs.length === 0) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('scene_trends')
        .insert(inputs)
        .select();

      if (error) {
        logger.error('Failed to batch record trends:', error);
        throw error;
      }

      logger.info(`Batch recorded ${data.length} trend data points`);
      return (data as SceneTrend[]) || [];
    } catch (error) {
      logger.error('Error in batchRecordTrends:', error);
      throw error;
    }
  }

  /**
   * Get trend history for a scene
   */
  async getTrendHistory(
    sceneSlug: string,
    metric: string,
    startDate?: string,
    endDate?: string
  ): Promise<SceneTrend[]> {
    try {
      let query = this.supabase
        .from('scene_trends')
        .select('*')
        .eq('scene_slug', sceneSlug)
        .eq('metric', metric)
        .order('time_bucket', { ascending: true });

      if (startDate) {
        query = query.gte('time_bucket', startDate);
      }
      if (endDate) {
        query = query.lte('time_bucket', endDate);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Failed to get trend history:', error);
        throw error;
      }

      return (data as SceneTrend[]) || [];
    } catch (error) {
      logger.error('Error in getTrendHistory:', error);
      throw error;
    }
  }

  // ==========================================================================
  // SCENE RELATIONSHIPS
  // ==========================================================================

  /**
   * Create or update a scene relationship
   */
  async setSceneRelationship(input: CreateRelationshipInput): Promise<SceneRelationship> {
    try {
      const { data, error } = await this.supabase
        .from('scene_relationships')
        .upsert(input, {
          onConflict: 'source_scene_slug,target_scene_slug,relation_type',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        logger.error('Failed to set scene relationship:', error);
        throw error;
      }

      logger.info(`Set relationship: ${input.source_scene_slug} -> ${input.target_scene_slug} (${input.relation_type})`);
      return data as SceneRelationship;
    } catch (error) {
      logger.error('Error in setSceneRelationship:', error);
      throw error;
    }
  }

  /**
   * Get relationships for a scene
   */
  async getSceneRelationships(sceneSlug: string): Promise<SceneRelationship[]> {
    try {
      const { data, error } = await this.supabase
        .from('scene_relationships')
        .select('*')
        .or(`source_scene_slug.eq.${sceneSlug},target_scene_slug.eq.${sceneSlug}`)
        .order('weight', { ascending: false });

      if (error) {
        logger.error(`Failed to get relationships for scene ${sceneSlug}:`, error);
        throw error;
      }

      return (data as SceneRelationship[]) || [];
    } catch (error) {
      logger.error('Error in getSceneRelationships:', error);
      throw error;
    }
  }

  /**
   * Batch upsert scene relationships
   */
  async batchSetRelationships(inputs: CreateRelationshipInput[]): Promise<SceneRelationship[]> {
    try {
      if (inputs.length === 0) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('scene_relationships')
        .upsert(inputs, {
          onConflict: 'source_scene_slug,target_scene_slug,relation_type',
          ignoreDuplicates: false,
        })
        .select();

      if (error) {
        logger.error('Failed to batch set relationships:', error);
        throw error;
      }

      logger.info(`Batch set ${data.length} relationships`);
      return (data as SceneRelationship[]) || [];
    } catch (error) {
      logger.error('Error in batchSetRelationships:', error);
      throw error;
    }
  }

  // ==========================================================================
  // RECOMMENDATIONS CACHE
  // ==========================================================================

  /**
   * Get cached recommendations for a user
   */
  async getCachedRecommendations(
    userId: string,
    artistSlug?: string
  ): Promise<SceneRecommendationsCache | null> {
    try {
      let query = this.supabase
        .from('scene_recommendations_cache')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString());

      if (artistSlug) {
        query = query.eq('artist_slug', artistSlug);
      } else {
        query = query.is('artist_slug', null);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No cache found
        }
        throw error;
      }

      return data as SceneRecommendationsCache;
    } catch (error) {
      logger.error('Error in getCachedRecommendations:', error);
      return null;
    }
  }

  /**
   * Cache recommendations for a user
   */
  async cacheRecommendations(
    userId: string,
    recommendations: any,
    ttlHours: number = 24,
    artistSlug?: string
  ): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + ttlHours);

      const cacheData = {
        user_id: userId,
        artist_slug: artistSlug || null,
        recommendations,
        expires_at: expiresAt.toISOString(),
      };

      const { error } = await this.supabase
        .from('scene_recommendations_cache')
        .upsert(cacheData, {
          onConflict: 'user_id,artist_slug',
          ignoreDuplicates: false,
        });

      if (error) {
        logger.error('Failed to cache recommendations:', error);
        throw error;
      }

      logger.info(`Cached recommendations for user ${userId}`);
    } catch (error) {
      logger.error('Error in cacheRecommendations:', error);
      throw error;
    }
  }

  // ==========================================================================
  // VALIDATION HELPERS
  // ==========================================================================

  private validateSceneInput(input: CreateSceneInput): void {
    if (!input.slug || input.slug.trim() === '') {
      throw new ValidationError('Scene slug is required');
    }
    if (!input.name || input.name.trim() === '') {
      throw new ValidationError('Scene name is required');
    }
    if (!/^[a-z0-9-]+$/.test(input.slug)) {
      throw new ValidationError('Scene slug must be lowercase alphanumeric with hyphens');
    }
  }

  private validateMicrogenreInput(input: CreateMicrogenreInput): void {
    if (!input.slug || input.slug.trim() === '') {
      throw new ValidationError('Microgenre slug is required');
    }
    if (!input.name || input.name.trim() === '') {
      throw new ValidationError('Microgenre name is required');
    }
    if (!/^[a-z0-9-]+$/.test(input.slug)) {
      throw new ValidationError('Microgenre slug must be lowercase alphanumeric with hyphens');
    }
  }

  private validateMembershipInput(input: CreateMembershipInput): void {
    if (!input.entity_slug || input.entity_slug.trim() === '') {
      throw new ValidationError('Entity slug is required');
    }
    if (!input.scene_slug || input.scene_slug.trim() === '') {
      throw new ValidationError('Scene slug is required');
    }
    if (input.confidence < 0 || input.confidence > 1) {
      throw new ValidationError('Confidence must be between 0 and 1');
    }
  }
}

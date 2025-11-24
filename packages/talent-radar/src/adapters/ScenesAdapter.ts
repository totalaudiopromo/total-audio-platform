/**
 * Scenes Adapter - Interface to Scenes Engine
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ScenesAdapter');

export interface SceneSignals {
  sceneSlug: string;
  hotness: number; // 0-100
  influence: number; // 0-1
  growthClassification: string;
  crossoverPotential: number;
}

export class ScenesAdapter {
  constructor(private supabase: SupabaseClient) {}

  async getScenePulse(sceneSlug: string): Promise<SceneSignals> {
    try {
      // Query scenes engine pulse data
      const { data } = await this.supabase
        .from('scenes')
        .select('*')
        .eq('slug', sceneSlug)
        .single();

      if (!data) {
        return {
          sceneSlug,
          hotness: 50,
          influence: 0.5,
          growthClassification: 'Stable',
          crossoverPotential: 50,
        };
      }

      // TODO: Integrate with actual Scenes Engine API
      return {
        sceneSlug,
        hotness: 75, // Placeholder
        influence: 0.68,
        growthClassification: 'Hot',
        crossoverPotential: 65,
      };
    } catch (error) {
      logger.error(`Failed to fetch scene pulse for ${sceneSlug}:`, error);
      return {
        sceneSlug,
        hotness: 50,
        influence: 0.5,
        growthClassification: 'Unknown',
        crossoverPotential: 50,
      };
    }
  }

  async getArtistSceneFit(artistSlug: string): Promise<{
    primaryScene: string | null;
    sceneConfidence: number;
    microgenres: string[];
  }> {
    try {
      const { data } = await this.supabase
        .from('scene_memberships')
        .select('*')
        .eq('entity_slug', artistSlug)
        .order('confidence', { ascending: false })
        .limit(1)
        .single();

      if (!data) {
        return {
          primaryScene: null,
          sceneConfidence: 0,
          microgenres: [],
        };
      }

      return {
        primaryScene: data.scene_slug,
        sceneConfidence: data.confidence,
        microgenres: data.microgenre_slug ? [data.microgenre_slug] : [],
      };
    } catch (error) {
      logger.error(`Failed to fetch scene fit for ${artistSlug}:`, error);
      return {
        primaryScene: null,
        sceneConfidence: 0,
        microgenres: [],
      };
    }
  }
}

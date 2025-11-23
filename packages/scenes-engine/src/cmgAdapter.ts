/**
 * CMG (Creative Memory Graph) Adapter
 * Read-only adapter for accessing artist creative arcs and emotional profiles
 *
 * IMPORTANT: This adapter MUST NOT modify CMG tables or logic
 * It only reads arc data to inform scene/microgenre matching
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { CMGArcReference } from './types.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('CMGAdapter');

export interface CMGAdapterConfig {
  supabase: SupabaseClient;
}

/**
 * CMG Adapter - Read-only interface to Creative Memory Graph
 */
export class CMGAdapter {
  private supabase: SupabaseClient;

  constructor(config: CMGAdapterConfig) {
    this.supabase = config.supabase;
  }

  /**
   * Derive microgenre suggestions from an artist's CMG arcs
   * Analyzes emotional tone and themes to suggest microgenres
   */
  async deriveMicrogenreFromCMG(artistId: string): Promise<string[]> {
    try {
      logger.debug(`Deriving microgenre from CMG for artist: ${artistId}`);

      // TODO: Actual CMG query implementation
      // This would query cmg_arcs or similar tables
      // and analyze emotional/thematic patterns

      const { data: arcs, error } = await this.supabase
        .from('cmg_arcs')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error || !arcs || arcs.length === 0) {
        logger.debug(`No CMG arcs found for artist ${artistId}`);
        return [];
      }

      // Analyze arcs to derive microgenres
      const suggestedMicrogenres = this.mapArcsToMicrogenres(arcs);

      logger.info(`Derived ${suggestedMicrogenres.length} microgenres for artist ${artistId}`);
      return suggestedMicrogenres;
    } catch (error) {
      logger.error(`Failed to derive microgenre from CMG for ${artistId}:`, error);
      return [];
    }
  }

  /**
   * Derive emotional scene affinity from CMG arcs
   * Matches artist's emotional arcs to scene emotional profiles
   */
  async deriveEmotionalSceneAffinity(artistId: string): Promise<Array<{
    sceneSlug: string;
    affinityScore: number; // 0-1
    matchedThemes: string[];
  }>> {
    try {
      logger.debug(`Deriving emotional scene affinity for artist: ${artistId}`);

      // Get artist's CMG arcs
      const arcs = await this.getArtistArcs(artistId);
      if (arcs.length === 0) {
        return [];
      }

      // Extract themes and emotional tones
      const artistThemes = new Set<string>();
      const emotionalTones: string[] = [];

      arcs.forEach(arc => {
        arc.themes.forEach(theme => artistThemes.add(theme));
        emotionalTones.push(arc.emotionalTone);
      });

      // TODO: Query scenes with emotional profiles
      // Match artist themes/tones to scene profiles
      // Calculate affinity scores

      // Placeholder: return empty for now
      return [];
    } catch (error) {
      logger.error(`Failed to derive emotional scene affinity for ${artistId}:`, error);
      return [];
    }
  }

  /**
   * Get artist's creative arcs from CMG
   */
  async getArtistArcs(artistId: string, limit: number = 10): Promise<CMGArcReference[]> {
    try {
      const { data: arcs, error } = await this.supabase
        .from('cmg_arcs')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !arcs) {
        return [];
      }

      return arcs.map((arc: any) => ({
        artistId: arc.artist_id,
        arcType: arc.arc_type || 'unknown',
        emotionalTone: arc.emotional_tone || 'neutral',
        themes: Array.isArray(arc.themes) ? arc.themes : [],
        suggestedMicrogenres: Array.isArray(arc.suggested_microgenres)
          ? arc.suggested_microgenres
          : [],
      }));
    } catch (error) {
      logger.error(`Failed to fetch arcs for artist ${artistId}:`, error);
      return [];
    }
  }

  /**
   * Analyze thematic overlap between artist and scene
   * Uses CMG themes to measure fit
   */
  async analyzeThematicOverlap(
    artistId: string,
    sceneSlug: string
  ): Promise<{
    overlapScore: number; // 0-1
    matchedThemes: string[];
    artistThemes: string[];
    sceneThemes: string[];
  }> {
    try {
      logger.debug(`Analyzing thematic overlap: artist ${artistId} <-> scene ${sceneSlug}`);

      // Get artist themes from CMG
      const arcs = await this.getArtistArcs(artistId);
      const artistThemesSet = new Set<string>();
      arcs.forEach(arc => {
        arc.themes.forEach(theme => artistThemesSet.add(theme));
      });
      const artistThemes = Array.from(artistThemesSet);

      // TODO: Get scene thematic profile
      // For now, use placeholder
      const sceneThemes: string[] = [];

      // Calculate overlap
      const matchedThemes = artistThemes.filter(theme =>
        sceneThemes.includes(theme)
      );
      const overlapScore = artistThemes.length > 0
        ? matchedThemes.length / artistThemes.length
        : 0;

      return {
        overlapScore,
        matchedThemes,
        artistThemes,
        sceneThemes,
      };
    } catch (error) {
      logger.error(`Failed to analyze thematic overlap:`, error);
      return {
        overlapScore: 0,
        matchedThemes: [],
        artistThemes: [],
        sceneThemes: [],
      };
    }
  }

  /**
   * Get artists with similar creative profiles
   * Useful for scene clustering based on creative similarity
   */
  async findSimilarArtists(
    artistId: string,
    limit: number = 20
  ): Promise<Array<{
    artistId: string;
    similarityScore: number;
    sharedThemes: string[];
  }>> {
    try {
      logger.debug(`Finding similar artists to: ${artistId}`);

      // Get target artist's arcs
      const targetArcs = await this.getArtistArcs(artistId);
      if (targetArcs.length === 0) {
        return [];
      }

      // Extract target themes
      const targetThemes = new Set<string>();
      targetArcs.forEach(arc => {
        arc.themes.forEach(theme => targetThemes.add(theme));
      });

      // TODO: Query other artists with similar themes
      // Calculate similarity scores
      // Return top matches

      // Placeholder
      return [];
    } catch (error) {
      logger.error(`Failed to find similar artists for ${artistId}:`, error);
      return [];
    }
  }

  /**
   * Map CMG arcs to microgenre suggestions
   * Internal helper for theme/emotion -> microgenre mapping
   */
  private mapArcsToMicrogenres(arcs: any[]): string[] {
    const microgenres = new Set<string>();

    // TODO: Implement sophisticated mapping logic
    // This is a simplified placeholder that would use:
    // - Emotional tone patterns
    // - Theme combinations
    // - Arc type characteristics
    // - Machine learning model or rule-based system

    arcs.forEach(arc => {
      const tone = arc.emotional_tone?.toLowerCase() || '';
      const themes = Array.isArray(arc.themes) ? arc.themes : [];

      // Example simple mappings (to be expanded)
      if (tone.includes('dark') || tone.includes('melancholy')) {
        if (themes.includes('electronic')) {
          microgenres.add('dark-garage');
          microgenres.add('ambient-techno');
        }
      }

      if (tone.includes('energetic') || tone.includes('uplifting')) {
        if (themes.includes('rap')) {
          microgenres.add('drill');
        }
        if (themes.includes('electronic')) {
          microgenres.add('high-energy-techno');
        }
      }

      if (themes.includes('experimental')) {
        microgenres.add('avant-electronic');
      }

      // Add any explicitly suggested microgenres
      if (Array.isArray(arc.suggested_microgenres)) {
        arc.suggested_microgenres.forEach((mg: string) => microgenres.add(mg));
      }
    });

    return Array.from(microgenres);
  }

  /**
   * Get aggregate emotional profile for multiple artists
   * Useful for scene emotional profiling
   */
  async getAggregateEmotionalProfile(artistIds: string[]): Promise<{
    dominantTones: Array<{ tone: string; frequency: number }>;
    commonThemes: Array<{ theme: string; frequency: number }>;
    suggestedMicrogenres: string[];
  }> {
    try {
      logger.debug(`Getting aggregate emotional profile for ${artistIds.length} artists`);

      if (artistIds.length === 0) {
        return {
          dominantTones: [],
          commonThemes: [],
          suggestedMicrogenres: [],
        };
      }

      // Get arcs for all artists
      const { data: arcs, error } = await this.supabase
        .from('cmg_arcs')
        .select('*')
        .in('artist_id', artistIds)
        .order('created_at', { ascending: false });

      if (error || !arcs || arcs.length === 0) {
        return {
          dominantTones: [],
          commonThemes: [],
          suggestedMicrogenres: [],
        };
      }

      // Aggregate tones and themes
      const toneCount: Record<string, number> = {};
      const themeCount: Record<string, number> = {};
      const microgenreSet = new Set<string>();

      arcs.forEach((arc: any) => {
        // Count tones
        const tone = arc.emotional_tone || 'neutral';
        toneCount[tone] = (toneCount[tone] || 0) + 1;

        // Count themes
        if (Array.isArray(arc.themes)) {
          arc.themes.forEach((theme: string) => {
            themeCount[theme] = (themeCount[theme] || 0) + 1;
          });
        }

        // Collect microgenres
        if (Array.isArray(arc.suggested_microgenres)) {
          arc.suggested_microgenres.forEach((mg: string) => microgenreSet.add(mg));
        }
      });

      // Sort by frequency
      const dominantTones = Object.entries(toneCount)
        .map(([tone, frequency]) => ({ tone, frequency }))
        .sort((a, b) => b.frequency - a.frequency);

      const commonThemes = Object.entries(themeCount)
        .map(([theme, frequency]) => ({ theme, frequency }))
        .sort((a, b) => b.frequency - a.frequency);

      return {
        dominantTones,
        commonThemes,
        suggestedMicrogenres: Array.from(microgenreSet),
      };
    } catch (error) {
      logger.error(`Failed to get aggregate emotional profile:`, error);
      return {
        dominantTones: [],
        commonThemes: [],
        suggestedMicrogenres: [],
      };
    }
  }
}

/**
 * Context Builder - Assembles complete CISContext from all bridges
 */

import type { CISContext } from './types';
import { FusionContextBridge } from './FusionContextBridge';
import { CMGBridge } from './CMGBridge';
import { IdentityKernelBridge } from './IdentityKernelBridge';
import { MIGScenesBridge } from './MIGScenesBridge';

export interface ContextBuilderConfig {
  fusionBridge?: FusionContextBridge;
  cmgBridge?: CMGBridge;
  identityBridge?: IdentityKernelBridge;
  migBridge?: MIGScenesBridge;
}

export class ContextBuilder {
  private config: ContextBuilderConfig;

  constructor(config: ContextBuilderConfig) {
    this.config = config;
  }

  async buildContext(
    projectId: string,
    userId: string,
    options: {
      artistSlug?: string;
      campaignId?: string;
      releaseId?: string;
      includeFusion?: boolean;
      includeCMG?: boolean;
      includeIdentity?: boolean;
      includeMIG?: boolean;
    } = {}
  ): Promise<CISContext> {
    const context: CISContext = {
      projectId,
      userId,
      artistSlug: options.artistSlug,
      campaignId: options.campaignId,
      releaseId: options.releaseId,
      timestamp: new Date().toISOString(),
    };

    // Fetch Fusion Layer context
    if (options.includeFusion !== false && options.artistSlug && this.config.fusionBridge) {
      try {
        const [artistContext, campaignContext, sceneContext, audienceSignals] = await Promise.all([
          this.config.fusionBridge.getArtistContext(options.artistSlug),
          this.config.fusionBridge.getCampaignContext(options.artistSlug, options.campaignId),
          this.config.fusionBridge.getSceneContext(options.artistSlug),
          this.config.fusionBridge.getAudienceSignals(options.artistSlug),
        ]);

        if (artistContext) context.artistContext = artistContext;
        if (campaignContext) context.campaignContext = campaignContext;
        if (sceneContext) context.sceneContext = sceneContext;
        if (audienceSignals) context.audienceSignals = audienceSignals;
      } catch (error) {
        console.warn('Error fetching Fusion context:', error);
      }
    }

    // Fetch CMG context
    if (options.includeCMG !== false && options.artistSlug && this.config.cmgBridge) {
      try {
        const [fingerprint, arcPatterns, motifs] = await Promise.all([
          this.config.cmgBridge.getCreativeFingerprint(options.artistSlug),
          this.config.cmgBridge.getEmotionalArcPatterns(options.artistSlug),
          this.config.cmgBridge.getStructuralMotifs(options.artistSlug),
        ]);

        if (fingerprint) context.creativeFingerprint = fingerprint;
        if (arcPatterns.length) context.emotionalArcPatterns = arcPatterns;
        if (motifs.length) context.structuralMotifs = motifs;
      } catch (error) {
        console.warn('Error fetching CMG context:', error);
      }
    }

    // Fetch Identity Kernel context
    if (options.includeIdentity !== false && options.artistSlug && this.config.identityBridge) {
      try {
        const identityProfile = await this.config.identityBridge.fetchIdentityProfile(options.artistSlug);
        if (identityProfile) context.identityProfile = identityProfile;
      } catch (error) {
        console.warn('Error fetching Identity context:', error);
      }
    }

    // Fetch MIG Scenes context
    if (options.includeMIG !== false && options.artistSlug && this.config.migBridge) {
      try {
        const [paletteHints, narrativeAngles, visualHints] = await Promise.all([
          this.config.migBridge.getScenePaletteHints(options.artistSlug),
          this.config.migBridge.getSceneNarrativeAngles(options.artistSlug),
          this.config.migBridge.getMicrogenreVisualHints(options.artistSlug),
        ]);

        if (paletteHints.length) context.scenePaletteHints = paletteHints;
        if (narrativeAngles.length) context.sceneNarrativeAngles = narrativeAngles;
        if (visualHints.length) context.microgenreVisualHints = visualHints;
      } catch (error) {
        console.warn('Error fetching MIG context:', error);
      }
    }

    return context;
  }
}

export const createContextBuilder = (config: ContextBuilderConfig): ContextBuilder => {
  return new ContextBuilder(config);
};

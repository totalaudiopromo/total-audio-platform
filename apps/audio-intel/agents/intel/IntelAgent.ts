/**
 * IntelAgent - Contact Enrichment & Validation
 * Orchestrates contact discovery, label matching, and enrichment validation
 */

import { BaseAgent } from '../core/BaseAgent';
import type { AgentPayload, AgentResult } from '../core/AgentTypes';
import { ContactFinder } from './subagents/ContactFinder';
import { LabelMatcher } from './subagents/LabelMatcher';
import { EnrichmentValidator } from './subagents/EnrichmentValidator';

export interface IntelAgentPayload extends AgentPayload {
  artist: string;
  release?: string;
  genre?: string;
  region?: string;
  includeLabels?: boolean;
}

export class IntelAgent extends BaseAgent {
  constructor() {
    super('IntelAgent', '1.0.0');
  }

  async run(payload: IntelAgentPayload): Promise<AgentResult> {
    this.log('Starting enrichment', { artist: payload.artist, release: payload.release });

    try {
      // Step 1: Find contacts
      const contactResult = await ContactFinder.find({
        artist: payload.artist,
        genre: payload.genre,
        region: payload.region,
      });

      if (!contactResult.success) {
        return {
          success: false,
          error: `Contact search failed: ${contactResult.error}`,
        };
      }

      const contacts = contactResult.data?.contacts || [];
      this.log('Found contacts', { count: contacts.length });

      // Step 2: Find labels (if release provided and requested)
      let labels = [];
      if (payload.release && payload.includeLabels !== false) {
        const labelResult = await LabelMatcher.match({
          artist: payload.artist,
          release: payload.release,
          genre: payload.genre,
        });

        if (labelResult.success) {
          labels = labelResult.data?.labels || [];
          this.log('Found labels', { count: labels.length });
        } else {
          this.log('Label matching failed', { error: labelResult.error });
        }
      }

      // Step 3: Validate enrichment quality
      const validationResult = await EnrichmentValidator.validate({
        contacts,
        labels,
      });

      if (!validationResult.success) {
        return {
          success: false,
          error: `Validation failed: ${validationResult.error}`,
        };
      }

      const validation = validationResult.data;

      // Return comprehensive enrichment result
      return {
        success: true,
        data: {
          artist: payload.artist,
          release: payload.release,
          contacts,
          labels,
          validation,
          summary: {
            contactsFound: contacts.length,
            labelsFound: labels.length,
            qualityScore: validation.score,
            isValid: validation.isValid,
          },
        },
      };
    } catch (error) {
      this.log('Enrichment error', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Enrichment failed',
      };
    }
  }
}

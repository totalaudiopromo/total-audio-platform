/**
 * ContactFinder Sub-Agent
 * Discovers relevant music industry contacts for artists/releases
 */

import type { SubAgentResult } from '../../core/AgentTypes';
import {
  ClaudeEnrichmentService,
  type Contact as ClaudeContact,
  type EnrichedContact,
} from '@/utils/claudeEnrichmentService';

export interface ContactFinderPayload {
  artist: string;
  genre?: string;
  region?: string;
  contactEmail?: string; // Email for direct enrichment
}

export interface Contact {
  name: string;
  role: string;
  organisation: string;
  email?: string;
  source: string;
  confidence: number;
  // Extended enrichment data
  platform?: string;
  format?: string;
  coverage?: string;
  genres?: string[];
  contactMethod?: string;
  bestTiming?: string;
  submissionGuidelines?: string;
  pitchTips?: string[];
  reasoning?: string;
}

/**
 * Extract name from email address
 */
function extractNameFromEmail(email: string): string {
  if (!email || !email.includes('@')) return email;

  const localPart = email.split('@')[0];
  // Convert dots/underscores to spaces and title case
  return localPart
    .replace(/[._]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export class ContactFinder {
  private static enrichmentService = new ClaudeEnrichmentService();

  /**
   * Find relevant contacts for an artist
   */
  static async find(payload: ContactFinderPayload): Promise<SubAgentResult> {
    try {
      console.log('[ContactFinder] Searching contacts for:', payload.artist);

      // Query Audio Intel contact database
      let contacts = await this.queryContactDatabase(payload);

      // If no contacts in database, create a contact from the provided data to enrich
      if (contacts.length === 0) {
        console.log('[ContactFinder] No contacts in database, enriching contact directly');

        // Create a contact from the provided data
        // This allows us to enrich ANY email, not just ones in our database
        const email = payload.contactEmail || payload.artist;
        const name = payload.contactEmail ? payload.artist : extractNameFromEmail(email);

        contacts = [
          {
            name,
            role: 'Contact',
            organisation: 'Unknown',
            email,
            source: 'user-provided',
            confidence: 0.5,
          },
        ];

        console.log(`[ContactFinder] Created contact for enrichment: ${name} (${email})`);
      }

      // Enrich with Claude API
      const enrichedContacts = await this.enrichContacts(contacts, payload);

      return {
        success: true,
        data: {
          contacts: enrichedContacts,
          count: enrichedContacts.length,
        },
      };
    } catch (error) {
      console.error('[ContactFinder] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Contact search failed',
      };
    }
  }

  /**
   * Query Audio Intel contact database
   */
  private static async queryContactDatabase(payload: ContactFinderPayload): Promise<Contact[]> {
    // TODO: Integrate with Audio Intel contact database (Supabase)
    // For now, return empty array - enrichment happens at API route level
    console.log('[ContactFinder] Querying database for:', payload.artist);

    // In production, this would query Supabase for relevant contacts
    // based on artist genre, region, and existing relationships
    return [];
  }

  /**
   * Enrich contacts with Claude API
   */
  private static async enrichContacts(
    contacts: Contact[],
    payload: ContactFinderPayload
  ): Promise<Contact[]> {
    console.log(`[ContactFinder] Enriching ${contacts.length} contacts with Claude...`);

    try {
      // Transform ContactFinder contacts to Claude service format
      const claudeContacts: ClaudeContact[] = contacts.map(contact => ({
        name: contact.name,
        email: contact.email || '',
        company: contact.organisation,
        role: contact.role,
      }));

      // Enrich using Claude service with genre/region context
      const enriched = await this.enrichmentService.enrichBatch(claudeContacts, {
        context: {
          genre: payload.genre,
          region: payload.region,
          campaignType: 'all',
        },
        useCache: true,
        onProgress: progress => {
          console.log(
            `[ContactFinder] Enrichment progress: ${progress.completed}/${progress.total} ` +
              `(${progress.failed} failed)`
          );
        },
      });

      // Transform enriched results back to ContactFinder format
      const transformedContacts: Contact[] = enriched.map(enrichedContact =>
        this.transformEnrichedContact(enrichedContact)
      );

      console.log(`[ContactFinder] Successfully enriched ${transformedContacts.length} contacts`);
      return transformedContacts;
    } catch (error) {
      console.error('[ContactFinder] Enrichment failed:', error);
      // Return original contacts with fallback enrichment
      return contacts.map(contact => ({
        ...contact,
        source: 'database',
        confidence: 0.5,
      }));
    }
  }

  /**
   * Transform Claude enriched contact to ContactFinder format
   */
  private static transformEnrichedContact(enriched: EnrichedContact): Contact {
    // Map confidence string to numeric score
    const confidenceMap = {
      High: 0.9,
      Medium: 0.7,
      Low: 0.4,
    };

    return {
      name: enriched.name,
      role: enriched.role || 'Unknown',
      organisation: enriched.company || enriched.platform,
      email: enriched.email,
      source: enriched.source,
      confidence: confidenceMap[enriched.confidence] || 0.5,
      // Extended enrichment data
      platform: enriched.platform,
      format: enriched.format,
      coverage: enriched.coverage,
      genres: enriched.genres,
      contactMethod: enriched.contactMethod,
      bestTiming: enriched.bestTiming,
      submissionGuidelines: enriched.submissionGuidelines,
      pitchTips: enriched.pitchTips,
      reasoning: enriched.reasoning,
    };
  }
}

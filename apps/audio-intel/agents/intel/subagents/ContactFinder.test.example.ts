/**
 * ContactFinder Test Examples
 *
 * This file demonstrates how the refactored ContactFinder integrates with Claude enrichment service
 *
 * NOTE: This is a documentation file, not a runnable test suite.
 * Actual tests would require Jest/Vitest configuration and mock setup.
 */

import { ContactFinder } from './ContactFinder';
import type { ContactFinderPayload, Contact } from './ContactFinder';

/**
 * Example 1: Basic contact enrichment
 *
 * When the ContactFinder receives a payload with artist information,
 * it queries the database (currently returns empty) and then enriches
 * any contacts it finds using the Claude API.
 */
async function example1_BasicEnrichment() {
  const payload: ContactFinderPayload = {
    artist: 'sadact',
    genre: 'electronic',
    region: 'UK',
  };

  const result = await ContactFinder.find(payload);

  if (result.success) {
    const contacts = result.data?.contacts || [];
    console.log(`Found ${contacts.length} contacts`);

    contacts.forEach((contact: Contact) => {
      console.log(`
        Name: ${contact.name}
        Role: ${contact.role}
        Organisation: ${contact.organisation}
        Email: ${contact.email}
        Confidence: ${contact.confidence}
        Platform: ${contact.platform}
        Genres: ${contact.genres?.join(', ')}
        Best Timing: ${contact.bestTiming}
        Source: ${contact.source} (claude/cache/fallback)
      `);
    });
  }
}

/**
 * Example 2: Enrichment with context
 *
 * The genre and region from the payload are passed to Claude as context,
 * which helps generate more relevant enrichment data for the contacts.
 */
async function example2_ContextualEnrichment() {
  const payload: ContactFinderPayload = {
    artist: 'Example Artist',
    genre: 'indie rock',
    region: 'London',
  };

  const result = await ContactFinder.find(payload);

  // Claude uses genre and region context to provide:
  // - Genre-specific pitch tips
  // - Regional coverage information
  // - Relevant submission guidelines
}

/**
 * Example 3: Extended contact data
 *
 * The refactored Contact interface now includes extended enrichment data
 * from Claude, providing actionable intelligence for music promotion.
 */
async function example3_ExtendedContactData() {
  const payload: ContactFinderPayload = {
    artist: 'Radio Campaign Test',
    genre: 'electronic',
    region: 'UK',
  };

  const result = await ContactFinder.find(payload);

  if (result.success) {
    const contacts = result.data?.contacts || [];

    contacts.forEach((contact: Contact) => {
      // Original fields
      console.log('Basic Info:', {
        name: contact.name,
        role: contact.role,
        organisation: contact.organisation,
        email: contact.email,
        confidence: contact.confidence,
        source: contact.source,
      });

      // Extended enrichment fields from Claude
      console.log('Enrichment Data:', {
        platform: contact.platform,
        format: contact.format,
        coverage: contact.coverage,
        genres: contact.genres,
        contactMethod: contact.contactMethod,
        bestTiming: contact.bestTiming,
        submissionGuidelines: contact.submissionGuidelines,
        pitchTips: contact.pitchTips,
        reasoning: contact.reasoning,
      });
    });
  }
}

/**
 * Example 4: Confidence scoring
 *
 * Claude's confidence levels (High/Medium/Low) are mapped to numeric scores:
 * - High: 0.9
 * - Medium: 0.7
 * - Low: 0.4
 */
async function example4_ConfidenceScoring() {
  const payload: ContactFinderPayload = {
    artist: 'Test Artist',
    genre: 'ambient',
  };

  const result = await ContactFinder.find(payload);

  if (result.success) {
    const contacts = result.data?.contacts || [];

    // Filter high-confidence contacts
    const highConfidence = contacts.filter((c: Contact) => c.confidence >= 0.8);
    console.log(`High confidence contacts: ${highConfidence.length}`);

    // Filter medium-confidence contacts
    const mediumConfidence = contacts.filter(
      (c: Contact) => c.confidence >= 0.6 && c.confidence < 0.8
    );
    console.log(`Medium confidence contacts: ${mediumConfidence.length}`);

    // Filter low-confidence contacts
    const lowConfidence = contacts.filter((c: Contact) => c.confidence < 0.6);
    console.log(`Low confidence contacts: ${lowConfidence.length}`);
  }
}

/**
 * Example 5: Error handling and fallback
 *
 * If Claude enrichment fails, the ContactFinder falls back to
 * returning contacts with default enrichment data.
 */
async function example5_ErrorHandling() {
  const payload: ContactFinderPayload = {
    artist: 'Test Artist',
  };

  const result = await ContactFinder.find(payload);

  if (!result.success) {
    console.error('Contact search failed:', result.error);
    // Handle error appropriately in your application
  } else {
    const contacts = result.data?.contacts || [];

    // Check which contacts used fallback enrichment
    const fallbackContacts = contacts.filter((c: Contact) => c.source === 'fallback');
    const claudeContacts = contacts.filter((c: Contact) => c.source === 'claude');
    const cachedContacts = contacts.filter((c: Contact) => c.source === 'cache');

    console.log(`
      Claude-enriched: ${claudeContacts.length}
      Cached: ${cachedContacts.length}
      Fallback: ${fallbackContacts.length}
    `);
  }
}

/**
 * Integration with IntelAgent
 *
 * The ContactFinder is called by the IntelAgent as part of the
 * complete enrichment pipeline:
 *
 * 1. ContactFinder.find() - Discover and enrich contacts
 * 2. LabelMatcher.match() - Find relevant record labels
 * 3. EnrichmentValidator.validate() - Validate data quality
 */
async function example6_IntelAgentIntegration() {
  // This is how IntelAgent uses ContactFinder:

  const contactResult = await ContactFinder.find({
    artist: 'Artist Name',
    genre: 'electronic',
    region: 'UK',
  });

  if (contactResult.success) {
    const contacts = contactResult.data?.contacts || [];

    // Contacts are then passed to EnrichmentValidator
    // which checks confidence scores, email coverage, etc.

    // EnrichmentValidator already supports the extended Contact interface
    // and will automatically benefit from the new enrichment data
  }
}

/**
 * Summary of Changes
 *
 * 1. Removed TODO comments about Perplexity integration
 * 2. Replaced mock data with real Claude API calls via ClaudeEnrichmentService
 * 3. Extended Contact interface with enrichment fields (platform, format, etc.)
 * 4. Added proper error handling and fallback logic
 * 5. Implemented context passing (genre, region) to Claude for better results
 * 6. Added confidence score mapping (High/Medium/Low → 0.9/0.7/0.4)
 * 7. Integrated caching for performance optimization
 * 8. Added progress tracking for batch enrichment
 *
 * Next Steps:
 *
 * 1. Integrate with Supabase contact database (queryContactDatabase method)
 * 2. Add actual contact data to enrich (currently returns empty array)
 * 3. Test with real BBC Radio 6 Music contacts
 * 4. Verify enrichment quality with validation pipeline
 * 5. Monitor Claude API costs and adjust batch sizes if needed
 */

#!/usr/bin/env node

/**
 * Automated Contact Enrichment with Status Logging
 *
 * Wraps enrich-all-contacts.js with AgentLogger for Command Centre integration
 * Designed to run automatically via cron (daily 2am)
 */

const AgentLogger = require('../lib/agent-logger.js');
const fs = require('fs');
const fetch = require('node-fetch');
const Anthropic = require('@anthropic-ai/sdk');

const AIRTABLE_API_KEY =
  process.env.AIRTABLE_API_KEY ||
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

const anthropic = new Anthropic({
  apiKey:
    process.env.ANTHROPIC_API_KEY ||
    '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',
});

const logger = new AgentLogger('contact-enrichment');

async function fetchAllContacts() {
  logger.info('Fetching all contacts from Airtable...');
  const allRecords = [];
  let offset = null;

  do {
    const url = offset
      ? `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
      : `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  logger.success(`Fetched ${allRecords.length} total contacts`);
  return allRecords;
}

async function enrichContact(contact) {
  const email = contact.fields.Email || '';
  const station = contact.fields.Station || 'Unknown';
  const firstName = contact.fields['First Name'] || '';
  const lastName = contact.fields['Last Name'] || '';
  const show = contact.fields.Show || '';
  const genres = contact.fields.Genres || [];
  const notes = contact.fields.Notes || '';
  const contactType = contact.fields['Contact Type'] || '';

  const prompt = `Analyze this radio contact and provide intelligence for music promotion:

**Contact Information:**
- Email: ${email}
- Name: ${firstName} ${lastName}
- Station: ${station}
- Show: ${show}
- Contact Type: ${contactType}
- Current Genres: ${genres.join(', ') || 'None listed'}
- Notes: ${notes}

**Provide:**
1. **Quality Assessment**: High/Medium/Low (High = BBC/major stations, Medium = established community/regional, Low = unclear/invalid)
2. **Station Identification**: What is the actual station name and format?
3. **Genre Classification**: What genres does this station/show focus on? (list 2-5 genres)
4. **Contact Intelligence**: Who is this person? What's their role? Why would they be valuable for music promotion?
5. **Pitch Strategy**: How should you approach this contact? What makes them unique?
6. **Data Quality Issues**: Any red flags or missing information?

**Format your response as:**

QUALITY: [High/Medium/Low]

STATION: [Station name and format]

GENRES: [Genre1, Genre2, Genre3]

INTELLIGENCE: [2-3 sentences about this contact]

STRATEGY: [1-2 sentences on how to pitch]

ISSUES: [Any data quality concerns or N/A]`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;

    // Parse response
    const qualityMatch = responseText.match(/QUALITY:\s*(\w+)/i);
    const stationMatch = responseText.match(/STATION:\s*(.+?)(?=\n|$)/i);
    const genresMatch = responseText.match(/GENRES:\s*(.+?)(?=\n|$)/i);
    const intelligenceMatch = responseText.match(/INTELLIGENCE:\s*(.+?)(?=\n\n|STRATEGY:|$)/is);
    const strategyMatch = responseText.match(/STRATEGY:\s*(.+?)(?=\n\n|ISSUES:|$)/is);

    return {
      quality: qualityMatch ? qualityMatch[1].trim() : 'Unknown',
      station: stationMatch ? stationMatch[1].trim() : station,
      genres: genresMatch ? genresMatch[1].split(',').map(g => g.trim()) : genres,
      intelligence: intelligenceMatch ? intelligenceMatch[1].trim() : '',
      strategy: strategyMatch ? strategyMatch[1].trim() : '',
      enriched: true,
    };
  } catch (error) {
    logger.warn(`Failed to enrich ${email}: ${error.message}`);
    return {
      enriched: false,
      error: error.message,
    };
  }
}

async function updateContact(recordId, enrichmentData) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`;

  const fields = {
    'Quality Score': enrichmentData.quality,
    'Enrichment Notes': enrichmentData.intelligence,
    'Pitch Strategy': enrichmentData.strategy,
    Enriched: true,
  };

  // Add genres if new ones identified
  if (enrichmentData.genres && enrichmentData.genres.length > 0) {
    fields['Genres'] = enrichmentData.genres;
  }

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      throw new Error(`Airtable update failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    logger.warn(`Failed to update record ${recordId}: ${error.message}`);
    return false;
  }
}

async function main() {
  logger.info('🚀 Starting automated contact enrichment...');
  logger.setStatus('fetching');

  try {
    // Fetch all contacts
    const allContacts = await fetchAllContacts();

    // Filter to only contacts that haven't been enriched yet
    const unenriched = allContacts.filter(c => !c.fields.Enriched);

    logger.updateMetrics({
      totalContacts: allContacts.length,
      unenrichedContacts: unenriched.length,
      alreadyEnriched: allContacts.length - unenriched.length,
    });

    if (unenriched.length === 0) {
      logger.success('All contacts already enriched! Nothing to do.');
      logger.complete({
        contactsProcessed: 0,
        contactsEnriched: 0,
        contactsFailed: 0,
        cost: 0,
      });
      return;
    }

    logger.info(`Found ${unenriched.length} contacts to enrich`);
    logger.setStatus('enriching');

    // Enrich contacts
    let enriched = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < unenriched.length; i++) {
      const contact = unenriched[i];
      const email = contact.fields.Email || 'No email';
      const progress = Math.round(((i + 1) / unenriched.length) * 100);

      logger.updateProgress(progress, `Enriching ${i + 1}/${unenriched.length}: ${email}`);

      // Skip if no email
      if (!contact.fields.Email) {
        skipped++;
        continue;
      }

      // Enrich
      const enrichmentData = await enrichContact(contact);

      if (enrichmentData.enriched) {
        // Update Airtable
        const updated = await updateContact(contact.id, enrichmentData);
        if (updated) {
          enriched++;
        } else {
          failed++;
        }
      } else {
        failed++;
      }

      // Rate limiting: wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Calculate cost (Claude Sonnet 4.5: ~$0.003 per request)
    const cost = enriched * 0.003;

    logger.success(`Enrichment complete!`);
    logger.complete({
      contactsProcessed: unenriched.length,
      contactsEnriched: enriched,
      contactsFailed: failed,
      contactsSkipped: skipped,
      costUSD: cost.toFixed(2),
      costGBP: (cost * 0.79).toFixed(2), // Approx conversion
    });
  } catch (error) {
    logger.fail('Enrichment failed', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    logger.fail('Unhandled error', error);
    process.exit(1);
  });
}

module.exports = { main };

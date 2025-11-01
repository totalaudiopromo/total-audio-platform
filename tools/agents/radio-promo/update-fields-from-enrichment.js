#!/usr/bin/env node

/**
 * Update Missing Fields from Existing Enrichment Notes
 *
 * Extracts genres, station, and region from existing enrichment notes
 * WITHOUT re-running AI enrichment (saves API costs)
 */

const fetch = require('node-fetch');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

async function fetchAllContacts() {
  console.log('📥 Fetching all contacts from Airtable...\n');
  const allRecords = [];
  let offset = null;

  do {
    const url = offset
      ? `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
      : `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });

    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  console.log(`✅ Total contacts: ${allRecords.length}\n`);
  return allRecords;
}

function extractFieldsFromEnrichment(enrichmentNotes, currentFields) {
  if (!enrichmentNotes) return null;

  const updates = {};

  // Extract station name
  const stationMatch = enrichmentNotes.match(/STATION:\s*([^\n]+)/i);
  if (stationMatch && (!currentFields.Station || currentFields.Station === 'Unknown')) {
    let stationName = stationMatch[1]
      .trim()
      .replace(/^[*-]\s*/, '')
      .replace(/\s*-\s*.*$/, '')
      .replace(/\(.*?\)/, '')
      .trim();

    const skipTerms = ['unknown', 'unclear', 'not specified', 'n/a'];
    if (!skipTerms.some(term => stationName.toLowerCase().includes(term))) {
      updates.Station = stationName;
    }
  }

  // Extract genres
  const STANDARD_GENRES = [
    'Indie',
    'Alternative',
    'Rock',
    'Metal',
    'Pop',
    'Electronic',
    'Dance',
    'Hip-Hop',
    'R&B / Soul',
    'Jazz / Funk',
    'Folk',
    'Blues',
    'Reggae',
    'Punk',
    'Pop-Punk',
    'Techno',
    'All',
  ];

  let extractedGenres = [];
  const genresMatch = enrichmentNotes.match(/GENRES?:\s*([^\n]+)/i);
  if (genresMatch && (!currentFields.Genres || currentFields.Genres.length === 0)) {
    const genresList = genresMatch[1]
      .split(/,|;|\band\b/)
      .map(g => g.trim())
      .filter(g => g.length > 0);

    genresList.forEach(extracted => {
      const lowerExtracted = extracted.toLowerCase();
      if (lowerExtracted.includes('indie')) extractedGenres.push('Indie');
      if (lowerExtracted.includes('alternative') || lowerExtracted.includes('alt'))
        extractedGenres.push('Alternative');
      if (lowerExtracted.includes('rock') && !lowerExtracted.includes('punk'))
        extractedGenres.push('Rock');
      if (lowerExtracted.includes('metal')) extractedGenres.push('Metal');
      if (lowerExtracted.includes('pop') && !lowerExtracted.includes('punk'))
        extractedGenres.push('Pop');
      if (lowerExtracted.includes('electronic') || lowerExtracted.includes('electro'))
        extractedGenres.push('Electronic');
      if (lowerExtracted.includes('dance') || lowerExtracted.includes('edm'))
        extractedGenres.push('Dance');
      if (
        lowerExtracted.includes('hip-hop') ||
        lowerExtracted.includes('hip hop') ||
        lowerExtracted.includes('rap')
      )
        extractedGenres.push('Hip-Hop');
      if (lowerExtracted.includes('r&b') || lowerExtracted.includes('soul'))
        extractedGenres.push('R&B / Soul');
      if (lowerExtracted.includes('jazz') || lowerExtracted.includes('funk'))
        extractedGenres.push('Jazz / Funk');
      if (lowerExtracted.includes('folk')) extractedGenres.push('Folk');
      if (lowerExtracted.includes('blues')) extractedGenres.push('Blues');
      if (lowerExtracted.includes('reggae')) extractedGenres.push('Reggae');
      if (lowerExtracted.includes('punk') && !lowerExtracted.includes('pop'))
        extractedGenres.push('Punk');
      if (lowerExtracted.includes('pop-punk') || lowerExtracted.includes('pop punk')) {
        extractedGenres = extractedGenres.filter(g => g !== 'Pop' && g !== 'Punk');
        extractedGenres.push('Pop-Punk');
      }
      if (lowerExtracted.includes('techno')) extractedGenres.push('Techno');
      if (
        lowerExtracted.includes('all') ||
        lowerExtracted.includes('eclectic') ||
        lowerExtracted.includes('variety')
      )
        extractedGenres.push('All');
    });

    extractedGenres = [...new Set(extractedGenres)];
    if (extractedGenres.length > 0) {
      updates.Genres = extractedGenres;
    }
  }

  // Extract region/country
  if (!currentFields['Region / Country']) {
    let region = null;
    const notesLower = enrichmentNotes.toLowerCase();

    if (
      notesLower.includes('uk') ||
      notesLower.includes('united kingdom') ||
      notesLower.includes('england') ||
      notesLower.includes('scotland') ||
      notesLower.includes('wales') ||
      notesLower.includes('northern ireland')
    ) {
      region = 'UK';
    } else if (notesLower.includes('australia') || notesLower.includes('australian')) {
      region = 'Australia';
    } else if (
      notesLower.includes('usa') ||
      notesLower.includes('united states') ||
      notesLower.includes('american')
    ) {
      region = 'USA';
    } else if (notesLower.includes('canada') || notesLower.includes('canadian')) {
      region = 'Canada';
    } else if (notesLower.includes('europe') || notesLower.includes('european')) {
      region = 'Europe';
    }

    if (region) {
      updates['Region / Country'] = region;
    }
  }

  // Extract Show name
  const showMatch = enrichmentNotes.match(/SHOW:\s*([^\n]+)/i);
  if (showMatch && (!currentFields.Show || currentFields.Show === 'Unknown')) {
    let showName = showMatch[1]
      .trim()
      .replace(/^[*-]\s*/, '')
      .replace(/\(.*?\)/, '')
      .trim();

    const skipTerms = ['unknown', 'unclear', 'not specified', 'n/a', 'varies', 'various'];
    if (!skipTerms.some(term => showName.toLowerCase().includes(term))) {
      updates.Show = showName;
    }
  }

  // Extract Last Name (if First Name exists but Last Name is missing)
  if (currentFields['First Name'] && !currentFields['Last Name']) {
    // Try to extract from enrichment notes patterns like:
    // "Chris Mann is...", "Sarah Ward at...", etc.
    const firstNamePattern = new RegExp(`${currentFields['First Name']}\\s+([A-Z][a-z]+)`, 'i');
    const nameMatch = enrichmentNotes.match(firstNamePattern);

    if (nameMatch && nameMatch[1]) {
      const lastName = nameMatch[1].trim();
      // Don't use common words as last names
      const skipWords = ['is', 'at', 'from', 'presents', 'hosts', 'works', 'the', 'and', 'for'];
      if (!skipWords.includes(lastName.toLowerCase())) {
        updates['Last Name'] = lastName;
      }
    }
  }

  return Object.keys(updates).length > 0 ? updates : null;
}

async function updateContact(recordId, fields) {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function updateAllFields() {
  console.log('🔄 Update Fields from Existing Enrichment\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllContacts();

  // Filter to only enriched contacts with missing fields
  const contactsToUpdate = contacts.filter(
    c =>
      c.fields['Enrichment Notes'] &&
      (!c.fields.Genres ||
        c.fields.Genres.length === 0 ||
        !c.fields.Station ||
        c.fields.Station === 'Unknown' ||
        !c.fields['Region / Country'])
  );

  console.log(`📊 Update Status:`);
  console.log(`   Total contacts: ${contacts.length}`);
  console.log(`   Need field updates: ${contactsToUpdate.length}\n`);

  if (contactsToUpdate.length === 0) {
    console.log('✅ All contacts already have complete field data!\n');
    return;
  }

  console.log(`Starting field extraction for ${contactsToUpdate.length} contacts...\n`);

  const stats = {
    total: contactsToUpdate.length,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  for (let i = 0; i < contactsToUpdate.length; i++) {
    const contact = contactsToUpdate[i];
    const email = contact.fields.Email || 'no-email';

    console.log(`[${i + 1}/${contactsToUpdate.length}] ${email}`);

    // Extract fields from enrichment notes
    const updates = extractFieldsFromEnrichment(contact.fields['Enrichment Notes'], contact.fields);

    if (updates) {
      const result = await updateContact(contact.id, updates);

      if (result.success) {
        stats.updated++;
        console.log(`   📝 Updated: ${Object.keys(updates).join(', ')}`);
        console.log(`   ✅ Saved to Airtable`);
      } else {
        stats.errors++;
        console.log(`   ❌ Update failed: ${result.error}`);
      }
    } else {
      stats.skipped++;
      console.log(`   ⏭️  No extractable fields`);
    }

    console.log('');

    // Rate limiting (10 requests per second for updates)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 UPDATE SUMMARY:\n');
  console.log(`Total contacts processed: ${stats.total}`);
  console.log(`   ✅ Successfully updated: ${stats.updated}`);
  console.log(`   ⏭️  Skipped (no data): ${stats.skipped}`);
  console.log(`   ❌ Errors: ${stats.errors}\n`);
  console.log('✅ Field update complete!\n');
}

if (require.main === module) {
  updateAllFields().catch(console.error);
}

module.exports = { updateAllFields };

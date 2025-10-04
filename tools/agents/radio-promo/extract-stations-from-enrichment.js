#!/usr/bin/env node

/**
 * Extract Station Names from Enrichment Notes
 *
 * Parses AI enrichment notes to populate missing station names in Airtable
 */

const fs = require('fs');
const fetch = require('node-fetch');

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
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
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });

    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  console.log(`✅ Total: ${allRecords.length}\n`);
  return allRecords;
}

function extractStationName(enrichmentNotes, currentStation, email) {
  if (!enrichmentNotes) return null;

  // Look for "STATION: " line in enrichment notes
  const stationMatch = enrichmentNotes.match(/STATION:\s*([^\n]+)/i);

  if (stationMatch) {
    let stationName = stationMatch[1].trim();

    // Clean up common formatting
    stationName = stationName
      .replace(/^[*-]\s*/, '') // Remove leading * or -
      .replace(/\s*-\s*.*$/, '') // Remove everything after first dash
      .replace(/\(.*?\)/, '') // Remove parenthetical info
      .trim();

    // Skip if it's too generic or unclear
    const skipTerms = ['unknown', 'unclear', 'not specified', 'n/a', 'none', 'not available'];
    if (skipTerms.some(term => stationName.toLowerCase().includes(term))) {
      return null;
    }

    // Skip if it's too long (likely a full sentence, not a station name)
    if (stationName.length > 50) {
      return null;
    }

    return stationName;
  }

  // Fallback: Try to extract from email domain
  if (email && email.includes('@')) {
    const domain = email.split('@')[1];

    // BBC email patterns
    if (domain === 'bbc.co.uk') {
      // Check enrichment for specific BBC station
      if (enrichmentNotes.match(/BBC Radio 6 Music/i)) return 'BBC Radio 6 Music';
      if (enrichmentNotes.match(/BBC Radio 1/i)) return 'BBC Radio 1';
      if (enrichmentNotes.match(/BBC Radio 2/i)) return 'BBC Radio 2';
      if (enrichmentNotes.match(/BBC Radio Devon/i)) return 'BBC Radio Devon';
      if (enrichmentNotes.match(/BBC[\s-]?(\w+)/i)) {
        const match = enrichmentNotes.match(/BBC[\s-]?(\w+(?:\s+\w+)?)/i);
        if (match) return `BBC ${match[1]}`;
      }
      return 'BBC Radio';
    }

    // Radio domain patterns
    if (domain.includes('radio') || domain.includes('fm')) {
      const cleanDomain = domain
        .replace(/\.(com|co\.uk|org|net|fm)$/, '')
        .replace(/radio|fm/, '')
        .trim();

      if (cleanDomain.length > 2) {
        return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1) + ' Radio';
      }
    }
  }

  return null;
}

async function updateStationName(recordId, newStation) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: { 'Station': newStation }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function extractStations() {
  console.log('🏢 Extracting Station Names from Enrichment\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllContacts();

  // Filter to contacts with enrichment but missing/unclear station names
  const needsStation = contacts.filter(c => {
    const station = c.fields.Station || '';
    const hasEnrichment = c.fields['Enrichment Notes'];

    const isUnknown = station === 'Unknown' ||
                     station === '' ||
                     station.length < 3 ||
                     station.toLowerCase().includes('unknown');

    return hasEnrichment && isUnknown;
  });

  console.log(`📊 Station Extraction Status:`);
  console.log(`   Total contacts: ${contacts.length}`);
  console.log(`   Have enrichment: ${contacts.filter(c => c.fields['Enrichment Notes']).length}`);
  console.log(`   Need station names: ${needsStation.length}\n`);

  if (needsStation.length === 0) {
    console.log('✅ All enriched contacts already have station names!\n');
    return { stats: { total: 0, extracted: 0, errors: 0 } };
  }

  console.log(`Starting station extraction for ${needsStation.length} contacts...\n`);

  const stats = {
    total: needsStation.length,
    extracted: 0,
    errors: 0
  };

  const extractions = [];

  for (let i = 0; i < needsStation.length; i++) {
    const contact = needsStation[i];
    const email = contact.fields.Email || 'no-email';
    const currentStation = contact.fields.Station || 'Unknown';
    const enrichmentNotes = contact.fields['Enrichment Notes'];

    console.log(`[${i+1}/${needsStation.length}] ${email}`);
    console.log(`   Current: "${currentStation}"`);

    // Extract station name
    const newStation = extractStationName(enrichmentNotes, currentStation, email);

    if (newStation && newStation !== currentStation) {
      console.log(`   Extracted: "${newStation}"`);

      // Update Airtable
      const result = await updateStationName(contact.id, newStation);

      if (result.success) {
        stats.extracted++;
        extractions.push({
          email,
          oldStation: currentStation,
          newStation
        });
        console.log(`   ✅ Updated in Airtable`);
      } else {
        stats.errors++;
        console.log(`   ❌ Update failed: ${result.error}`);
      }
    } else {
      console.log(`   ⏭️  No station name found in enrichment`);
    }

    console.log('');

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 EXTRACTION SUMMARY:\n');
  console.log(`Total contacts processed: ${stats.total}`);
  console.log(`   ✅ Stations extracted: ${stats.extracted}`);
  console.log(`   ⏭️  No station found: ${stats.total - stats.extracted - stats.errors}`);
  console.log(`   ❌ Errors: ${stats.errors}\n`);

  if (extractions.length > 0) {
    console.log('🏢 EXTRACTED STATIONS:\n');
    extractions.forEach((e, i) => {
      console.log(`${i+1}. ${e.email}`);
      console.log(`   "${e.oldStation}" → "${e.newStation}"\n`);
    });
  }

  fs.writeFileSync('./STATION_EXTRACTION_REPORT.json', JSON.stringify({ stats, extractions }, null, 2));
  console.log('💾 Report saved: STATION_EXTRACTION_REPORT.json\n');
  console.log('✅ Station extraction complete!\n');

  return { stats, extractions };
}

if (require.main === module) {
  extractStations().catch(console.error);
}

module.exports = { extractStations };

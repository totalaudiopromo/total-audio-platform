#!/usr/bin/env node

/**
 * Clean and Enrich Airtable Contacts - Enhanced
 *
 * Fixes:
 * - Last names that say "appears" or are incomplete
 * - Missing station names (extracts from enrichment notes)
 * - Fills in Shows from enrichment data
 * - Fills in Country/Region from enrichment and email
 * - Removes "Auto-extracted from domain" messages
 * - Standardizes data format using Intel enrichment
 */

require('dotenv').config();
const fetch = require('node-fetch');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patH8DF1YEieVCSvo';

async function listBases() {
  const response = await fetch('https://api.airtable.com/v0/meta/bases', {
    headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
  });
  const data = await response.json();
  return data.bases || [];
}

async function listTables(baseId) {
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` }
  });
  const data = await response.json();
  return data.tables || [];
}

async function getRecords(baseId, tableName) {
  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
    { headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` } }
  );
  const data = await response.json();
  return data.records || [];
}

async function updateRecord(baseId, tableName, recordId, fields) {
  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields })
    }
  );
  return response.json();
}

function extractInfoFromEmail(email) {
  if (!email) return {};

  const domain = email.split('@')[1];
  const username = email.split('@')[0];

  let info = {};

  // Extract country from domain
  if (domain?.endsWith('.uk') || domain?.endsWith('bbc.co.uk')) {
    info.country = 'UK';
  } else if (domain?.endsWith('.au')) {
    info.country = 'Australia';
  } else if (domain?.endsWith('.ca')) {
    info.country = 'Canada';
  } else if (domain?.endsWith('.com') || domain?.endsWith('.org')) {
    info.country = 'USA'; // Default for .com/.org
  }

  // Extract station name from domain
  if (domain) {
    let stationName = domain.replace(/\.(com|org|co\.uk|uk|fm|ca|au)$/g, '');
    stationName = stationName.replace(/radio|fm|music|station/gi, '').trim();

    // Clean up station name
    if (stationName && stationName.length > 2) {
      info.stationName = stationName.charAt(0).toUpperCase() + stationName.slice(1);
    }
  }

  return info;
}

function extractFromEnrichment(enrichmentNotes) {
  if (!enrichmentNotes) return {};

  const extracted = {};

  // Extract station name from bold text at start
  const stationMatch = enrichmentNotes.match(/^\*\*([^*]+)\*\*/);
  if (stationMatch) {
    const station = stationMatch[1].trim();
    // Filter out quality indicators
    if (!station.includes('Contact Quality') &&
        !station.includes('Contact Analysis') &&
        station.length < 50) {
      extracted.station = station;
    }
  }

  // Extract show names
  const showPatterns = [
    /show[:\s]+([A-Z][^.,(]+)/i,
    /programme[:\s]+([A-Z][^.,(]+)/i,
    /presents[:\s]+([A-Z][^.,(]+)/i,
    /"([^"]+)"/g  // Quoted show names
  ];

  for (const pattern of showPatterns) {
    const match = enrichmentNotes.match(pattern);
    if (match && match[1] && match[1].length < 50 && match[1].length > 3) {
      extracted.show = match[1].trim();
      break;
    }
  }

  // Extract region/location
  const locationPatterns = [
    /Location:\s*([A-Za-z\s]+?)(?:\||Market|Format|$)/,
    /based in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /serving\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s+[A-Z][a-z]+)?)/i,
    /(London|Manchester|Birmingham|Liverpool|Bristol|Scotland|Wales|Ireland|National|California|Central Coast)/
  ];

  for (const pattern of locationPatterns) {
    const match = enrichmentNotes.match(pattern);
    if (match && match[1]) {
      extracted.region = match[1].trim();
      break;
    }
  }

  // Extract person names (for Last Name)
  const namePatterns = [
    /contact:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/,
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)\s*-/,
    /presenter:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/i
  ];

  for (const pattern of namePatterns) {
    const match = enrichmentNotes.match(pattern);
    if (match && match[1]) {
      const names = match[1].split(' ');
      if (names.length === 2) {
        extracted.firstName = names[0];
        extracted.lastName = names[1];
      }
    }
  }

  return extracted;
}

function cleanLastName(lastName, firstName, enrichmentNotes, email) {
  // If already has a good last name, keep it
  if (lastName &&
      lastName !== 'BBC' &&
      !lastName.toLowerCase().includes('appears') &&
      lastName.length > 1 &&
      lastName !== 'Mansell' // Keep existing good ones
  ) {
    return lastName;
  }

  // Try to extract from enrichment notes
  const enriched = extractFromEnrichment(enrichmentNotes);
  if (enriched.lastName) {
    return enriched.lastName;
  }

  // Try to extract from email (professional emails often have firstname.lastname)
  if (email && email.includes('.')) {
    const username = email.split('@')[0];
    const parts = username.split('.');
    if (parts.length === 2 && parts[1].length > 2 && !parts[1].includes('bbc')) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }
  }

  return null; // Remove if we can't determine
}

function cleanFirstName(firstName, station, email) {
  // Fix weird first names
  if (!firstName ||
      firstName === 'Unknown' ||
      firstName === '3wk' ||
      firstName === 'kjbdjakbcf' ||
      firstName === 'Scrshell' ||
      firstName === 'Isthisrob' ||
      firstName === 'Nimoysucks' ||
      (firstName === 'Doris' && station === 'Unique Expansion Radio')) {

    // Try to extract from station name
    if (station && !station.includes('Radio') && !station.includes('BBC')) {
      return station;
    }

    // Try to extract from email
    if (email) {
      const username = email.split('@')[0];
      if (username.length > 2 && !username.includes('radio')) {
        return username.charAt(0).toUpperCase() + username.slice(1);
      }
    }

    return null; // Leave blank if we can't determine
  }

  return firstName;
}

function cleanStationName(station, email, enrichmentNotes) {
  // Fix generic or missing station names
  if (!station ||
      station === 'Radio Station' ||
      station === 'Unknown' ||
      station === 'BBC Radio' ||
      station === 'hjkllkhn') {

    // Try to extract from enrichment notes
    const enriched = extractFromEnrichment(enrichmentNotes);
    if (enriched.station) {
      return enriched.station;
    }

    // Try to extract from email domain
    const info = extractInfoFromEmail(email);
    if (info.stationName) {
      return info.stationName;
    }
  }

  return station;
}

function cleanReplyNotes(replyNotes) {
  if (!replyNotes) return replyNotes;

  // Remove auto-extracted domain messages
  if (replyNotes.includes('Auto-extracted from domain:') ||
      replyNotes.includes('(No specific pattern matched)')) {
    return null; // Clear it
  }

  // Remove "Radio enhancement:" prefix if it's not useful
  if (replyNotes.startsWith('Radio enhancement:') && replyNotes.includes('Unknown Radio')) {
    return null;
  }

  // Keep useful reply notes (BBC Radio details, actual presenter names, etc.)
  if (replyNotes.includes('BBC Radio') && replyNotes.includes('Location:')) {
    return replyNotes; // Keep BBC enrichment data
  }

  return replyNotes;
}

function extractShow(show, enrichmentNotes, replyNotes) {
  // If already has a show, keep it
  if (show && show !== 'Unknown') return show;

  // Try enrichment notes first
  const enriched = extractFromEnrichment(enrichmentNotes);
  if (enriched.show) return enriched.show;

  // Check reply notes for show info
  if (replyNotes) {
    const showMatch = replyNotes.match(/Show:\s*([A-Z][^|]+)/);
    if (showMatch) return showMatch[1].trim();
  }

  return show;
}

function extractRegion(region, enrichmentNotes, replyNotes, email) {
  // If already has a good region, keep it
  if (region &&
      region !== 'Unknown' &&
      region !== 'USA' &&
      !region.includes('m,nm,nb') &&
      region.length > 1) {
    return region;
  }

  // Try enrichment notes first
  const enriched = extractFromEnrichment(enrichmentNotes);
  if (enriched.region && enriched.region !== 'Unknown') {
    return enriched.region;
  }

  // Try reply notes
  if (replyNotes && replyNotes.includes('Location:')) {
    const locationMatch = replyNotes.match(/Location:\s*([A-Za-z\s]+?)(?:\||$)/);
    if (locationMatch && locationMatch[1] !== 'Unknown') {
      return locationMatch[1].trim();
    }
  }

  // Extract from email
  const info = extractInfoFromEmail(email);
  if (info.country) return info.country;

  return region;
}

async function cleanUpContacts() {
  console.log('🧹 Enhanced Airtable Contact Cleanup (using Intel enrichment)...\n');

  // Find all bases
  const bases = await listBases();
  console.log(`Found ${bases.length} base(s)\n`);

  let totalCleaned = 0;

  for (const base of bases) {
    console.log(`📊 Checking base: ${base.name}`);

    const tables = await listTables(base.id);

    for (const table of tables) {
      // Look for contact tables
      if (table.name.toLowerCase().includes('contact') ||
          table.name.toLowerCase().includes('radio') ||
          table.name.toLowerCase().includes('station')) {

        console.log(`  📋 Cleaning table: ${table.name}`);

        const records = await getRecords(base.id, table.name);
        console.log(`     Found ${records.length} records`);

        for (const record of records) {
          const fields = record.fields;
          const updates = {};

          // Clean Last Name
          const cleanedLast = cleanLastName(
            fields['Last Name'],
            fields['First Name'],
            fields['Enrichment Notes'],
            fields['Email']
          );
          if (cleanedLast !== fields['Last Name']) {
            if (cleanedLast === null) {
              updates['Last Name'] = ''; // Clear it
            } else {
              updates['Last Name'] = cleanedLast;
            }
          }

          // Clean First Name
          if (fields['First Name']) {
            const cleanedFirst = cleanFirstName(
              fields['First Name'],
              fields['Station'],
              fields['Email']
            );
            if (cleanedFirst !== fields['First Name'] && cleanedFirst !== null) {
              updates['First Name'] = cleanedFirst;
            }
          }

          // Clean Station Name
          const cleanedStation = cleanStationName(
            fields['Station'],
            fields['Email'],
            fields['Enrichment Notes']
          );
          if (cleanedStation !== fields['Station'] && cleanedStation) {
            updates['Station'] = cleanedStation;
          }

          // Clean Show
          const cleanedShow = extractShow(
            fields['Show'],
            fields['Enrichment Notes'],
            fields['Reply Notes']
          );
          if (cleanedShow !== fields['Show'] && cleanedShow) {
            updates['Show'] = cleanedShow;
          }

          // Clean Region/Country
          const cleanedRegion = extractRegion(
            fields['Region / Country'],
            fields['Enrichment Notes'],
            fields['Reply Notes'],
            fields['Email']
          );
          if (cleanedRegion !== fields['Region / Country'] && cleanedRegion) {
            updates['Region / Country'] = cleanedRegion;
          }

          // Clean Reply Notes (remove auto-extracted messages)
          const cleanedReplyNotes = cleanReplyNotes(fields['Reply Notes']);
          if (cleanedReplyNotes !== fields['Reply Notes']) {
            if (cleanedReplyNotes === null) {
              updates['Reply Notes'] = ''; // Clear it
            } else {
              updates['Reply Notes'] = cleanedReplyNotes;
            }
          }

          // Apply updates if any
          if (Object.keys(updates).length > 0) {
            try {
              await updateRecord(base.id, table.name, record.id, updates);
              console.log(`     ✅ Updated: ${fields['First Name'] || 'Unknown'} - ${Object.keys(updates).join(', ')}`);
              totalCleaned++;

              // Rate limit: 5 requests per second
              await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
              console.error(`     ❌ Failed to update ${record.id}:`, error.message);
            }
          }
        }
      }
    }
  }

  console.log(`\n✨ Enhanced cleanup complete! Updated ${totalCleaned} records.\n`);
}

cleanUpContacts().catch(console.error);

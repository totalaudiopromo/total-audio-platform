#!/usr/bin/env node

/**
 * Search Airtable for KYARA Alternative/Indie Contacts
 *
 * Searches all bases and tables for contacts matching:
 * - Genre: Alternative, Indie, Alternative Rock, Indie Rock
 * - Station types: All
 * - Relationship: All statuses
 */

require('dotenv').config();
const fetch = require('node-fetch');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patH8DF1YEieVCSvo';

async function listBases() {
  console.log('🔍 Finding all Airtable bases...\n');

  try {
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list bases: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.bases || [];
  } catch (error) {
    console.error('❌ Failed to list bases:', error.message);
    return [];
  }
}

async function listTables(baseId) {
  try {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list tables: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.tables || [];
  } catch (error) {
    console.error(`❌ Failed to list tables for base ${baseId}:`, error.message);
    return [];
  }
}

async function searchTable(baseId, tableName) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search table: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error(`❌ Failed to search table ${tableName}:`, error.message);
    return [];
  }
}

function isRelevantContact(record) {
  const fields = record.fields;

  // Check for genre match
  const genreFields = ['Genre', 'Genres', 'genre', 'genres', 'Genre Focus', 'Music Genre'];
  let hasGenreMatch = false;

  for (const field of genreFields) {
    if (fields[field]) {
      const genreValue = Array.isArray(fields[field])
        ? fields[field].join(' ')
        : String(fields[field]);
      const genreLower = genreValue.toLowerCase();

      if (
        genreLower.includes('alternative') ||
        genreLower.includes('indie') ||
        genreLower.includes('alt') ||
        genreLower.includes('rock')
      ) {
        hasGenreMatch = true;
        break;
      }
    }
  }

  // Check for station name or contact name
  const nameFields = ['Name', 'Station Name', 'Contact Name', 'name', 'Station'];
  let hasName = false;

  for (const field of nameFields) {
    if (fields[field]) {
      hasName = true;
      break;
    }
  }

  // Check for email
  const emailFields = ['Email', 'email', 'Contact Email', 'E-mail'];
  let hasEmail = false;

  for (const field of emailFields) {
    if (fields[field]) {
      hasEmail = true;
      break;
    }
  }

  return hasGenreMatch && hasName && hasEmail;
}

function extractContactInfo(record) {
  const fields = record.fields;

  // Extract name
  const nameFields = ['Name', 'Station Name', 'Contact Name', 'name', 'Station'];
  let name = 'Unknown';
  for (const field of nameFields) {
    if (fields[field]) {
      name = fields[field];
      break;
    }
  }

  // Extract email
  const emailFields = ['Email', 'email', 'Contact Email', 'E-mail'];
  let email = '';
  for (const field of emailFields) {
    if (fields[field]) {
      email = fields[field];
      break;
    }
  }

  // Extract genre
  const genreFields = ['Genre', 'Genres', 'genre', 'genres', 'Genre Focus', 'Music Genre'];
  let genre = '';
  for (const field of genreFields) {
    if (fields[field]) {
      genre = Array.isArray(fields[field]) ? fields[field].join(', ') : String(fields[field]);
      break;
    }
  }

  // Extract station type
  const typeFields = ['Type', 'Station Type', 'type', 'Category'];
  let stationType = '';
  for (const field of typeFields) {
    if (fields[field]) {
      stationType = fields[field];
      break;
    }
  }

  // Extract relationship status
  const relationshipFields = ['Relationship', 'Status', 'Relationship Status'];
  let relationship = '';
  for (const field of relationshipFields) {
    if (fields[field]) {
      relationship = fields[field];
      break;
    }
  }

  return {
    id: record.id,
    name,
    email,
    genre,
    stationType,
    relationship,
    allFields: Object.keys(fields).join(', '),
  };
}

async function main() {
  console.log('🎵 Searching Airtable for KYARA Alternative/Indie Contacts\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // List all bases
  const bases = await listBases();

  if (bases.length === 0) {
    console.log('⚠️  No bases found. Check your API key permissions.');
    return;
  }

  console.log(`✅ Found ${bases.length} Airtable base(s):\n`);
  bases.forEach((base, i) => {
    console.log(`   ${i + 1}. ${base.name} (${base.id})`);
  });
  console.log('');

  const allContacts = [];

  // Search each base
  for (const base of bases) {
    console.log(`🔍 Searching base: ${base.name} (${base.id})...\n`);

    const tables = await listTables(base.id);

    if (tables.length === 0) {
      console.log(`   ⚠️  No tables found in ${base.name}\n`);
      continue;
    }

    console.log(`   Found ${tables.length} table(s):\n`);

    for (const table of tables) {
      console.log(`   📋 Searching table: ${table.name}...`);

      const records = await searchTable(base.id, table.name);

      if (records.length === 0) {
        console.log(`      No records found\n`);
        continue;
      }

      console.log(`      ${records.length} records found`);

      // Filter for relevant contacts
      const relevantRecords = records.filter(isRelevantContact);

      if (relevantRecords.length > 0) {
        console.log(`      ✅ ${relevantRecords.length} relevant alternative/indie contacts!\n`);

        relevantRecords.forEach(record => {
          const contact = extractContactInfo(record);
          contact.baseId = base.id;
          contact.baseName = base.name;
          contact.tableName = table.name;
          allContacts.push(contact);
        });
      } else {
        console.log(`      No alternative/indie contacts found\n`);
      }
    }
  }

  // Display results
  console.log('\n═══════════════════════════════════════════════════════════\n');
  console.log(`🎯 KYARA ALTERNATIVE/INDIE CONTACTS - TOTAL: ${allContacts.length}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (allContacts.length === 0) {
    console.log('⚠️  No alternative/indie contacts found in your Airtable.\n');
    console.log('Possible reasons:');
    console.log('1. Contacts might be in a different genre field');
    console.log('2. Genre values might use different terms');
    console.log('3. Contacts might be in bases not accessible with this API key\n');
    return;
  }

  allContacts.forEach((contact, i) => {
    console.log(`${i + 1}. ${contact.name}`);
    console.log(`   Email: ${contact.email}`);
    console.log(`   Genre: ${contact.genre}`);
    if (contact.stationType) console.log(`   Type: ${contact.stationType}`);
    if (contact.relationship) console.log(`   Relationship: ${contact.relationship}`);
    console.log(`   Source: ${contact.baseName} / ${contact.tableName}`);
    console.log(`   Available fields: ${contact.allFields}`);
    console.log('');
  });

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`✅ Search complete! Found ${allContacts.length} relevant contacts.\n`);
}

main().catch(console.error);

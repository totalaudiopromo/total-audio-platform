#!/usr/bin/env node

/**
 * Search Real Airtable Base for KYARA Contacts
 *
 * Base ID: appx7uTQWRH8cIC20
 * Table ID: tblcZnUsB4Swyjcip
 */

require('dotenv').config();
const fetch = require('node-fetch');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

async function getTableSchema() {
  console.log('📋 Getting table schema...\n');

  try {
    const response = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get schema: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    const table = data.tables.find(t => t.id === TABLE_ID);

    if (table) {
      console.log(`✅ Table Name: ${table.name}\n`);
      console.log('Available Fields:');
      table.fields.forEach(field => {
        console.log(`   - ${field.name} (${field.type})`);
      });
      console.log('');
    }

    return table;
  } catch (error) {
    console.error('❌ Failed to get table schema:', error.message);
    return null;
  }
}

async function searchAllRecords() {
  console.log('🔍 Searching all records in table...\n');

  const allRecords = [];
  let offset = null;

  try {
    do {
      let url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?pageSize=100`;
      if (offset) {
        url += `&offset=${offset}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to search: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      allRecords.push(...data.records);
      offset = data.offset;

      console.log(`   Fetched ${data.records.length} records... (Total: ${allRecords.length})`);
    } while (offset);

    console.log(`\n✅ Total records fetched: ${allRecords.length}\n`);
    return allRecords;
  } catch (error) {
    console.error('❌ Failed to search records:', error.message);
    return allRecords;
  }
}

function isAlternativeIndieContact(record) {
  const fields = record.fields;

  // Check all possible genre fields
  const genreFields = [
    'Genre',
    'Genres',
    'genre',
    'genres',
    'Genre Focus',
    'Music Genre',
    'Station Genre',
    'Format',
  ];

  for (const field of genreFields) {
    if (fields[field]) {
      const genreValue = Array.isArray(fields[field])
        ? fields[field].join(' ')
        : String(fields[field]);
      const genreLower = genreValue.toLowerCase();

      if (
        genreLower.includes('alternative') ||
        genreLower.includes('indie') ||
        genreLower.includes('alt rock') ||
        genreLower.includes('indie rock') ||
        (genreLower.includes('alt') && genreLower.includes('rock'))
      ) {
        return true;
      }
    }
  }

  return false;
}

function extractContactDetails(record) {
  const fields = record.fields;

  return {
    id: record.id,
    name: fields['Name'] || fields['Station Name'] || fields['Contact Name'] || 'Unknown',
    email: fields['Email'] || fields['email'] || fields['Contact Email'] || '',
    stationType: fields['Type'] || fields['Station Type'] || fields['Category'] || '',
    genre: fields['Genre'] || fields['Genres'] || fields['Genre Focus'] || '',
    relationship: fields['Relationship'] || fields['Status'] || fields['Relationship Status'] || '',
    country: fields['Country'] || fields['Location'] || '',
    website: fields['Website'] || fields['URL'] || '',
    notes: fields['Notes'] || fields['Description'] || '',
    lastContacted: fields['Last Contacted'] || fields['Last Contact'] || '',
    responseRate: fields['Response Rate'] || '',
    allFields: fields,
  };
}

async function main() {
  console.log('🎵 KYARA Campaign - Real Airtable Contact Search\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`Base ID: ${BASE_ID}`);
  console.log(`Table ID: ${TABLE_ID}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get table schema
  const schema = await getTableSchema();

  if (!schema) {
    console.log('⚠️  Could not retrieve table schema. Continuing with search...\n');
  }

  // Search all records
  const allRecords = await searchAllRecords();

  if (allRecords.length === 0) {
    console.log('❌ No records found in table.\n');
    return;
  }

  // Filter for alternative/indie contacts
  console.log('🎯 Filtering for Alternative/Indie contacts...\n');

  const alternativeIndieContacts = allRecords
    .filter(isAlternativeIndieContact)
    .map(extractContactDetails)
    .filter(contact => contact.email); // Only contacts with email addresses

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`🎯 ALTERNATIVE/INDIE CONTACTS FOR KYARA: ${alternativeIndieContacts.length}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (alternativeIndieContacts.length === 0) {
    console.log('⚠️  No alternative/indie contacts found.\n');
    console.log('Showing first 5 records to help debug:\n');

    allRecords.slice(0, 5).forEach((record, i) => {
      console.log(`${i + 1}. Record ID: ${record.id}`);
      console.log(`   Fields: ${Object.keys(record.fields).join(', ')}`);
      console.log(`   Sample values:`, JSON.stringify(record.fields, null, 2).slice(0, 200));
      console.log('');
    });
    return;
  }

  // Group by relationship status
  const byRelationship = {
    hot: [],
    warm: [],
    cold: [],
    other: [],
  };

  alternativeIndieContacts.forEach(contact => {
    const rel = String(contact.relationship).toLowerCase();
    if (rel.includes('hot')) byRelationship.hot.push(contact);
    else if (rel.includes('warm')) byRelationship.warm.push(contact);
    else if (rel.includes('cold')) byRelationship.cold.push(contact);
    else byRelationship.other.push(contact);
  });

  // Display by priority
  console.log('🔥 HOT CONTACTS (Highest Priority):\n');
  byRelationship.hot.forEach((contact, i) => {
    displayContact(contact, i + 1);
  });

  console.log('\n🌡️  WARM CONTACTS:\n');
  byRelationship.warm.forEach((contact, i) => {
    displayContact(contact, i + 1);
  });

  console.log('\n❄️  COLD CONTACTS:\n');
  byRelationship.cold.forEach((contact, i) => {
    displayContact(contact, i + 1);
  });

  if (byRelationship.other.length > 0) {
    console.log('\n📋 OTHER CONTACTS:\n');
    byRelationship.other.forEach((contact, i) => {
      displayContact(contact, i + 1);
    });
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');
  console.log('📊 SUMMARY:\n');
  console.log(`   Total Alternative/Indie Contacts: ${alternativeIndieContacts.length}`);
  console.log(`   🔥 Hot: ${byRelationship.hot.length}`);
  console.log(`   🌡️  Warm: ${byRelationship.warm.length}`);
  console.log(`   ❄️  Cold: ${byRelationship.cold.length}`);
  console.log(`   📋 Other: ${byRelationship.other.length}`);
  console.log('\n═══════════════════════════════════════════════════════════\n');

  // Save to file
  const fs = require('fs');
  const outputPath = './KYARA_AIRTABLE_CONTACTS.json';
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        total: alternativeIndieContacts.length,
        hot: byRelationship.hot,
        warm: byRelationship.warm,
        cold: byRelationship.cold,
        other: byRelationship.other,
      },
      null,
      2
    )
  );

  console.log(`✅ Contact list saved to: ${outputPath}\n`);
}

function displayContact(contact, index) {
  console.log(`${index}. ${contact.name}`);
  console.log(`   📧 ${contact.email}`);
  if (contact.stationType) console.log(`   📻 ${contact.stationType}`);
  if (contact.genre) console.log(`   🎵 ${contact.genre}`);
  if (contact.country) console.log(`   🌍 ${contact.country}`);
  if (contact.lastContacted) console.log(`   📅 Last contacted: ${contact.lastContacted}`);
  if (contact.notes)
    console.log(`   📝 ${contact.notes.slice(0, 100)}${contact.notes.length > 100 ? '...' : ''}`);
  console.log('');
}

main().catch(console.error);

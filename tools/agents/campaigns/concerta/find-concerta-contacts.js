#!/usr/bin/env node

/**
 * Find Relevant Contacts for Concerta Campaign
 *
 * Artist: Concerta (South Korean)
 * Track: Consumption
 * Genre: Dance/Electronic
 * Target Markets:
 * - Eastern Europe (primary)
 * - South Korea (secondary)
 * - Electronic/Dance music specialists globally
 */

// Use native fetch or fallback
const fetch = globalThis.fetch || require('node-fetch');

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

async function fetchAllRecords() {
  console.log('🔍 Fetching all Airtable contacts...\n');

  const allRecords = [];
  let offset = null;

  do {
    const url = offset
      ? `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?offset=${offset}`
      : `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  console.log(`✅ Fetched ${allRecords.length} total contacts\n`);
  return allRecords;
}

function findRelevantContacts(records) {
  console.log('🎯 Finding contacts relevant to Concerta campaign...\n');

  const relevantContacts = {
    easternEurope: [],
    southKorea: [],
    electronicDance: [],
    allRelevant: []
  };

  // Eastern European countries
  const easternEuropeCountries = [
    'poland', 'czech', 'slovakia', 'hungary', 'romania', 'bulgaria',
    'ukraine', 'belarus', 'lithuania', 'latvia', 'estonia', 'slovenia',
    'croatia', 'serbia', 'bosnia', 'montenegro', 'albania', 'macedonia'
  ];

  // Electronic/Dance genre keywords
  const electronicGenres = [
    'electronic', 'dance', 'edm', 'house', 'techno', 'trance',
    'dnb', 'drum and bass', 'dubstep', 'electro', 'synth'
  ];

  records.forEach(record => {
    const fields = record.fields;
    const station = (fields.Station || '').toLowerCase();
    const country = (fields.Country || '').toLowerCase();
    const genres = Array.isArray(fields.Genres)
      ? fields.Genres.join(' ').toLowerCase()
      : (fields.Genres || '').toLowerCase();
    const email = fields.Email;
    const status = fields.Status;

    // Skip if no email or opted out
    if (!email || status === 'Opted Out' || status === 'Bounced') {
      return;
    }

    const contactData = {
      id: record.id,
      station: fields.Station,
      email: fields.Email,
      country: fields.Country,
      genres: fields.Genres,
      status: fields.Status,
      notes: fields.Notes
    };

    // Check for Eastern Europe
    const isEasternEurope = easternEuropeCountries.some(country =>
      (fields.Country || '').toLowerCase().includes(country) ||
      station.includes(country)
    );

    if (isEasternEurope) {
      relevantContacts.easternEurope.push(contactData);
      relevantContacts.allRelevant.push({ ...contactData, reason: 'Eastern Europe' });
    }

    // Check for South Korea
    if (country.includes('korea') || station.includes('korea')) {
      relevantContacts.southKorea.push(contactData);
      relevantContacts.allRelevant.push({ ...contactData, reason: 'South Korea' });
    }

    // Check for Electronic/Dance genres
    const isElectronicDance = electronicGenres.some(genre =>
      genres.includes(genre)
    );

    if (isElectronicDance && !isEasternEurope && !country.includes('korea')) {
      relevantContacts.electronicDance.push(contactData);
      relevantContacts.allRelevant.push({ ...contactData, reason: 'Electronic/Dance' });
    }
  });

  return relevantContacts;
}

function displayResults(relevantContacts) {
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 CONCERTA CAMPAIGN - RELEVANT CONTACTS SUMMARY\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log(`🇪🇺 Eastern Europe Contacts: ${relevantContacts.easternEurope.length}`);
  console.log(`🇰🇷 South Korea Contacts: ${relevantContacts.southKorea.length}`);
  console.log(`🎵 Electronic/Dance Contacts (Global): ${relevantContacts.electronicDance.length}`);
  console.log(`📈 Total Relevant Contacts: ${relevantContacts.allRelevant.length}\n`);

  // Display top 10 Eastern Europe contacts
  if (relevantContacts.easternEurope.length > 0) {
    console.log('═══ TOP EASTERN EUROPE CONTACTS ═══\n');
    relevantContacts.easternEurope.slice(0, 10).forEach((contact, i) => {
      console.log(`${i + 1}. ${contact.station || 'Unknown Station'}`);
      console.log(`   📍 ${contact.country || 'Unknown Country'}`);
      console.log(`   📧 ${contact.email}`);
      console.log(`   🎵 Genres: ${Array.isArray(contact.genres) ? contact.genres.join(', ') : contact.genres || 'None'}`);
      console.log('');
    });
  }

  // Display South Korea contacts
  if (relevantContacts.southKorea.length > 0) {
    console.log('═══ SOUTH KOREA CONTACTS ═══\n');
    relevantContacts.southKorea.forEach((contact, i) => {
      console.log(`${i + 1}. ${contact.station || 'Unknown Station'}`);
      console.log(`   📧 ${contact.email}`);
      console.log(`   🎵 Genres: ${Array.isArray(contact.genres) ? contact.genres.join(', ') : contact.genres || 'None'}`);
      console.log('');
    });
  }

  // Display top 10 Electronic/Dance contacts
  if (relevantContacts.electronicDance.length > 0) {
    console.log('═══ TOP ELECTRONIC/DANCE CONTACTS (GLOBAL) ═══\n');
    relevantContacts.electronicDance.slice(0, 10).forEach((contact, i) => {
      console.log(`${i + 1}. ${contact.station || 'Unknown Station'}`);
      console.log(`   📍 ${contact.country || 'Unknown Country'}`);
      console.log(`   📧 ${contact.email}`);
      console.log(`   🎵 Genres: ${Array.isArray(contact.genres) ? contact.genres.join(', ') : contact.genres || 'None'}`);
      console.log('');
    });
  }
}

async function findConcertaContacts() {
  try {
    const allRecords = await fetchAllRecords();
    const relevantContacts = findRelevantContacts(allRecords);
    displayResults(relevantContacts);

    // Save to file
    const fs = require('fs');
    const outputPath = '/Users/chrisschofield/workspace/active/total-audio-platform/tools/agents/campaigns/concerta/concerta-contacts.json';
    fs.writeFileSync(outputPath, JSON.stringify(relevantContacts, null, 2));
    console.log(`\n💾 Full contact list saved to: ${outputPath}\n`);

    return relevantContacts;
  } catch (error) {
    console.error('❌ Error finding Concerta contacts:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  findConcertaContacts().catch(console.error);
}

module.exports = { findConcertaContacts };

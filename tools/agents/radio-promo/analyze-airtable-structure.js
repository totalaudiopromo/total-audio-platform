#!/usr/bin/env node

/**
 * Analyze Airtable Structure and Data Quality
 *
 * Provides a comprehensive overview of:
 * - Field completeness
 * - Data quality issues
 * - Optimization recommendations
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

async function analyzeStructure() {
  console.log('🔍 Airtable Structure Analysis\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllContacts();

  // Get all field names from first contact
  const firstContact = contacts[0];
  const allFields = Object.keys(firstContact.fields);

  console.log('📊 FIELD ANALYSIS\n');
  console.log(`Total fields: ${allFields.length}\n`);

  // Analyze each field
  const fieldStats = {};

  allFields.forEach(fieldName => {
    fieldStats[fieldName] = {
      populated: 0,
      empty: 0,
      unique: new Set(),
      types: new Set(),
    };
  });

  contacts.forEach(contact => {
    allFields.forEach(fieldName => {
      const value = contact.fields[fieldName];

      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        fieldStats[fieldName].empty++;
      } else {
        fieldStats[fieldName].populated++;
        fieldStats[fieldName].unique.add(JSON.stringify(value));
        fieldStats[fieldName].types.add(typeof value);
      }
    });
  });

  // Print field analysis
  console.log('Field Completeness:\n');

  const sortedFields = Object.entries(fieldStats).sort((a, b) => {
    const aPercent = (a[1].populated / contacts.length) * 100;
    const bPercent = (b[1].populated / contacts.length) * 100;
    return bPercent - aPercent;
  });

  sortedFields.forEach(([fieldName, stats]) => {
    const percent = ((stats.populated / contacts.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));
    console.log(
      `${fieldName.padEnd(30)} ${bar} ${percent}% (${stats.populated}/${contacts.length})`
    );
  });

  console.log('\n═══════════════════════════════════════════════════════════\n');

  // Data Quality Analysis
  console.log('⚠️  DATA QUALITY ISSUES\n');

  let issues = [];

  // Missing emails
  const noEmail = contacts.filter(c => !c.fields.Email || c.fields.Email === 'no-email');
  if (noEmail.length > 0) {
    issues.push({
      severity: 'HIGH',
      issue: 'Missing Emails',
      count: noEmail.length,
      fix: 'Remove or research these contacts',
    });
  }

  // Station = Unknown
  const unknownStation = contacts.filter(c => c.fields.Station === 'Unknown');
  if (unknownStation.length > 0) {
    issues.push({
      severity: 'MEDIUM',
      issue: 'Station = "Unknown"',
      count: unknownStation.length,
      fix: 'AI enrichment should have populated these',
    });
  }

  // Missing genres
  const noGenres = contacts.filter(c => !c.fields.Genres || c.fields.Genres.length === 0);
  if (noGenres.length > 0) {
    issues.push({
      severity: 'MEDIUM',
      issue: 'Missing Genres',
      count: noGenres.length,
      fix: 'AI enrichment should have populated these',
    });
  }

  // Missing first/last names
  const noFirstName = contacts.filter(c => !c.fields['First Name']);
  const noLastName = contacts.filter(c => !c.fields['Last Name']);

  if (noFirstName.length > 0) {
    issues.push({
      severity: 'LOW',
      issue: 'Missing First Name',
      count: noFirstName.length,
      fix: 'Extract from email or enrichment notes',
    });
  }

  if (noLastName.length > 0) {
    issues.push({
      severity: 'LOW',
      issue: 'Missing Last Name',
      count: noLastName.length,
      fix: 'Extract from enrichment notes or email',
    });
  }

  // Not enriched
  const notEnriched = contacts.filter(c => !c.fields['Enrichment Notes']);
  if (notEnriched.length > 0) {
    issues.push({
      severity: 'HIGH',
      issue: 'Not AI Enriched',
      count: notEnriched.length,
      fix: 'Run enrich-all-contacts.js',
    });
  }

  // Missing region
  const noRegion = contacts.filter(c => !c.fields['Region / Country']);
  if (noRegion.length > 0) {
    issues.push({
      severity: 'LOW',
      issue: 'Missing Region/Country',
      count: noRegion.length,
      fix: 'Extract from enrichment or infer from station',
    });
  }

  issues.sort((a, b) => {
    const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  issues.forEach(issue => {
    const icon = issue.severity === 'HIGH' ? '🚨' : issue.severity === 'MEDIUM' ? '⚠️' : 'ℹ️';
    console.log(`${icon} ${issue.severity}: ${issue.issue}`);
    console.log(`   Count: ${issue.count} contacts`);
    console.log(`   Fix: ${issue.fix}\n`);
  });

  console.log('═══════════════════════════════════════════════════════════\n');

  // Enrichment Quality Distribution
  console.log('📈 ENRICHMENT QUALITY DISTRIBUTION\n');

  const qualityDistribution = {
    High: 0,
    Medium: 0,
    Low: 0,
    'Not Enriched': 0,
  };

  contacts.forEach(c => {
    const quality = c.fields['Enrichment Quality'];
    if (!quality) {
      qualityDistribution['Not Enriched']++;
    } else {
      qualityDistribution[quality] = (qualityDistribution[quality] || 0) + 1;
    }
  });

  Object.entries(qualityDistribution).forEach(([quality, count]) => {
    const percent = ((count / contacts.length) * 100).toFixed(1);
    console.log(`${quality.padEnd(15)} ${count.toString().padStart(3)} contacts (${percent}%)`);
  });

  console.log('\n═══════════════════════════════════════════════════════════\n');

  // Genre distribution
  console.log('🎵 GENRE DISTRIBUTION (Top 15)\n');

  const genreCount = {};
  contacts.forEach(c => {
    const genres = c.fields.Genres || [];
    genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  sortedGenres.forEach(([genre, count]) => {
    const percent = ((count / contacts.length) * 100).toFixed(1);
    const bar =
      '█'.repeat(Math.floor(count / 10)) + '░'.repeat(Math.max(0, 20 - Math.floor(count / 10)));
    console.log(`${genre.padEnd(20)} ${bar} ${count} (${percent}%)`);
  });

  console.log('\n═══════════════════════════════════════════════════════════\n');

  // Recommendations
  console.log('💡 OPTIMIZATION RECOMMENDATIONS\n');

  console.log('1. Field Organization:');
  console.log('   ✓ Group related fields together in Airtable UI');
  console.log('   ✓ Core Info: Email, First Name, Last Name, Station');
  console.log('   ✓ Targeting: Genres, Region/Country, Show');
  console.log('   ✓ Intelligence: Enrichment Quality, Enrichment Notes');
  console.log('   ✓ Campaign: Subscription Status, Mailchimp Account, Tags\n');

  console.log('2. Views to Create:');
  console.log('   → High Quality UK Contacts (Quality=High, Region=UK)');
  console.log('   → Ready to Pitch (Quality=High/Medium, Has Genres)');
  console.log('   → Needs Cleanup (Missing Email, Station=Unknown)');
  console.log('   → By Genre (Indie, Alternative, Electronic, etc.)');
  console.log('   → By Mailchimp Account (Liberty/TAP/Both/None)\n');

  console.log('3. Automation Ideas:');
  console.log('   → Auto-tag by enrichment quality');
  console.log('   → Auto-assign to campaigns by genre match');
  console.log('   → Alert when high-quality contact added');
  console.log('   → Weekly digest of new contacts needing enrichment\n');

  console.log('4. Data Cleanup Priority:');
  console.log('   1️⃣  Remove/fix contacts with no email');
  console.log('   2️⃣  Complete AI enrichment for all contacts');
  console.log('   3️⃣  Extract missing last names from enrichment notes');
  console.log('   4️⃣  Sync Mailchimp subscription status');
  console.log('   5️⃣  Add region/country to all contacts\n');

  console.log('✅ Analysis complete!\n');
}

analyzeStructure();

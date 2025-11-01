#!/usr/bin/env node

/**
 * Export Full Airtable Backup
 *
 * Creates a complete backup of all 517 contacts before making any cleanup changes
 */

const fs = require('fs');
const fetch = require('node-fetch');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

async function fetchAllRecords() {
  console.log('💾 Creating Full Airtable Backup...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const allRecords = [];
  let offset = null;
  let pageNum = 1;

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
    console.log(
      `   Fetched page ${pageNum}: ${data.records.length} records (Total: ${allRecords.length})`
    );

    offset = data.offset;
    pageNum++;
  } while (offset);

  console.log(`\n✅ Total records fetched: ${allRecords.length}\n`);

  return allRecords;
}

function analyzeFieldUsage(records) {
  console.log('📊 Analyzing Field Usage...\n');

  const fieldStats = {};

  records.forEach(record => {
    Object.keys(record.fields).forEach(fieldName => {
      if (!fieldStats[fieldName]) {
        fieldStats[fieldName] = {
          count: 0,
          emptyCount: 0,
          sampleValues: [],
        };
      }

      const value = record.fields[fieldName];

      if (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        fieldStats[fieldName].emptyCount++;
      } else {
        fieldStats[fieldName].count++;

        // Collect sample values (max 3)
        if (fieldStats[fieldName].sampleValues.length < 3) {
          let sampleValue = value;
          if (Array.isArray(value)) {
            sampleValue = value.join(', ');
          } else if (typeof value === 'object') {
            sampleValue = JSON.stringify(value).substring(0, 50);
          } else if (typeof value === 'string' && value.length > 50) {
            sampleValue = value.substring(0, 50) + '...';
          }
          fieldStats[fieldName].sampleValues.push(sampleValue);
        }
      }
    });
  });

  return fieldStats;
}

function identifyIssues(records) {
  console.log('🔍 Identifying Data Quality Issues...\n');

  const issues = {
    invalidEmails: [],
    missingStations: [],
    noGenres: [],
    statusMismatches: [], // Will be populated by sync script
    duplicateEmails: [],
    testContacts: [],
  };

  const emailSet = new Set();

  records.forEach(record => {
    const email = record.fields.Email;
    const station = record.fields.Station;
    const genres = record.fields.Genres;
    const testMode = record.fields['Test Mode'];

    // Check for invalid/suspicious emails
    if (email && (email.includes('jkhjks') || email.length < 5 || !email.includes('@'))) {
      issues.invalidEmails.push({
        id: record.id,
        email,
        station: station || 'Unknown',
      });
    }

    // Check for duplicate emails
    if (email) {
      if (emailSet.has(email.toLowerCase())) {
        issues.duplicateEmails.push({
          id: record.id,
          email,
        });
      } else {
        emailSet.add(email.toLowerCase());
      }
    }

    // Check for missing stations
    if (!station || station === 'Unknown' || station.length < 2) {
      issues.missingStations.push({
        id: record.id,
        email,
        currentStation: station || '(empty)',
      });
    }

    // Check for missing genres
    if (!genres || genres.length === 0) {
      issues.noGenres.push({
        id: record.id,
        email,
        station: station || 'Unknown',
      });
    }

    // Check for test contacts
    if (testMode === true) {
      issues.testContacts.push({
        id: record.id,
        email,
        station: station || 'Unknown',
      });
    }
  });

  return issues;
}

async function exportBackup() {
  const timestamp = new Date().toISOString().split('T')[0];

  try {
    // Fetch all records
    const records = await fetchAllRecords();

    // Analyze field usage
    const fieldStats = analyzeFieldUsage(records);

    // Identify issues
    const issues = identifyIssues(records);

    // Create backup object
    const backup = {
      exportDate: new Date().toISOString(),
      totalRecords: records.length,
      baseId: BASE_ID,
      tableId: TABLE_ID,
      records,
      fieldStats,
      issues,
    };

    // Save full backup
    const backupFilename = `AIRTABLE_FULL_BACKUP_${timestamp}.json`;
    fs.writeFileSync(backupFilename, JSON.stringify(backup, null, 2));

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`✅ Full backup saved: ${backupFilename}`);
    console.log(`   Total records: ${backup.totalRecords}`);
    console.log(`   Export date: ${backup.exportDate}\n`);

    // Print field statistics
    console.log('📊 FIELD USAGE STATISTICS:\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    const sortedFields = Object.entries(fieldStats).sort((a, b) => b[1].count - a[1].count);

    sortedFields.forEach(([fieldName, stats]) => {
      const totalRecords = records.length;
      const populatedPercent = ((stats.count / totalRecords) * 100).toFixed(1);
      const emptyPercent = ((stats.emptyCount / totalRecords) * 100).toFixed(1);

      console.log(`${fieldName}:`);
      console.log(`   Populated: ${stats.count}/${totalRecords} (${populatedPercent}%)`);
      console.log(`   Empty: ${stats.emptyCount}/${totalRecords} (${emptyPercent}%)`);
      if (stats.sampleValues.length > 0) {
        console.log(`   Samples: ${stats.sampleValues.join(' | ')}`);
      }
      console.log('');
    });

    // Print issues summary
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('🚨 DATA QUALITY ISSUES FOUND:\n');
    console.log(`   Invalid Emails: ${issues.invalidEmails.length}`);
    console.log(`   Missing Stations: ${issues.missingStations.length}`);
    console.log(`   No Genres: ${issues.noGenres.length}`);
    console.log(`   Duplicate Emails: ${issues.duplicateEmails.length}`);
    console.log(`   Test Contacts: ${issues.testContacts.length}\n`);

    if (issues.invalidEmails.length > 0) {
      console.log('⚠️  Invalid Emails:');
      issues.invalidEmails.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.email} (${issue.station})`);
      });
      console.log('');
    }

    if (issues.duplicateEmails.length > 0) {
      console.log('⚠️  Duplicate Emails:');
      issues.duplicateEmails.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.email}`);
      });
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('✅ Backup complete! Ready for cleanup operations.\n');

    return backup;
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  exportBackup().catch(console.error);
}

module.exports = { exportBackup };

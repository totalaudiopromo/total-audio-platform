#!/usr/bin/env node

/**
 * Consolidate Notes Fields in Airtable
 *
 * Merges "Reply Notes" and "Description" into single "Notes" field
 */

const fs = require('fs');
const fetch = require('node-fetch');

const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

async function fetchAllContacts() {
  console.log('📥 Fetching all contacts...\n');
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

  console.log(`✅ Total: ${allRecords.length}\n`);
  return allRecords;
}

async function updateContactNotes(recordId, consolidatedNotes) {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Notes: consolidatedNotes,
          'Reply Notes': '', // Clear after merge
          Description: '', // Clear after merge
        },
      }),
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

async function consolidateNotes() {
  console.log('📝 Consolidating Notes Fields\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllContacts();

  const stats = {
    total: contacts.length,
    updated: 0,
    noChange: 0,
    errors: 0,
  };

  const consolidations = [];

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const email = contact.fields.Email;
    const replyNotes = contact.fields['Reply Notes'] || '';
    const description = contact.fields['Description'] || '';
    const existingNotes = contact.fields['Notes'] || '';

    // Skip if no Reply Notes or Description to merge
    if (!replyNotes && !description) {
      stats.noChange++;
      continue;
    }

    // Build consolidated notes
    const parts = [];

    if (existingNotes) {
      parts.push(existingNotes);
    }

    if (replyNotes) {
      parts.push(`REPLY: ${replyNotes}`);
    }

    if (description) {
      parts.push(`DESCRIPTION: ${description}`);
    }

    const consolidatedNotes = parts.join('\n\n');

    // Update Airtable
    const result = await updateContactNotes(contact.id, consolidatedNotes);

    if (result.success) {
      stats.updated++;
      consolidations.push({
        email,
        hadReplyNotes: !!replyNotes,
        hadDescription: !!description,
        hadExistingNotes: !!existingNotes,
      });

      if (stats.updated % 50 === 0) {
        console.log(`   Consolidated ${stats.updated} contacts...`);
      }
    } else {
      stats.errors++;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');
  console.log('📊 CONSOLIDATION SUMMARY:\n');
  console.log(`Total contacts: ${stats.total}`);
  console.log(`   ✅ Updated: ${stats.updated}`);
  console.log(`   ⏭️  No change needed: ${stats.noChange}`);
  console.log(`   ❌ Errors: ${stats.errors}\n`);

  const withReplyNotes = consolidations.filter(c => c.hadReplyNotes).length;
  const withDescription = consolidations.filter(c => c.hadDescription).length;
  const withExisting = consolidations.filter(c => c.hadExistingNotes).length;

  console.log('📈 FIELD BREAKDOWN:\n');
  console.log(`   Merged Reply Notes: ${withReplyNotes}`);
  console.log(`   Merged Description: ${withDescription}`);
  console.log(`   Had existing Notes: ${withExisting}\n`);

  fs.writeFileSync(
    './NOTES_CONSOLIDATION_REPORT.json',
    JSON.stringify({ stats, consolidations }, null, 2)
  );
  console.log('💾 Report saved: NOTES_CONSOLIDATION_REPORT.json\n');
  console.log('✅ Notes consolidation complete!\n');

  return { stats, consolidations };
}

if (require.main === module) {
  consolidateNotes().catch(console.error);
}

module.exports = { consolidateNotes };

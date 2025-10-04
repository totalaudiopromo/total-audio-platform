#!/usr/bin/env node

/**
 * Sync Subscription Status from Mailchimp to Airtable (Fixed)
 *
 * Only updates contacts that exist in Mailchimp with valid Airtable status options
 */

const fs = require('fs');
const fetch = require('node-fetch');
const crypto = require('crypto');

const MAILCHIMP_API_KEY = '83f53d36bd6667b4c56015e8a0d1ed66-us13';
const MAILCHIMP_SERVER = 'us13';
const LIST_ID = '137bcedead';

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

function getSubscriberHash(email) {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
}

async function fetchAllAirtableContacts() {
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

async function checkMailchimpStatus(email) {
  const subscriberHash = getSubscriberHash(email);

  try {
    const response = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${subscriberHash}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 404) {
      return { exists: false };
    }

    if (!response.ok) {
      return { exists: false };
    }

    const data = await response.json();
    return { exists: true, status: data.status };

  } catch (error) {
    return { exists: false };
  }
}

async function updateAirtableStatus(recordId, newStatus) {
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
          fields: { 'Status': newStatus }
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

async function syncAllStatuses() {
  console.log('🔄 Syncing Status: Mailchimp → Airtable (Fixed)\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllAirtableContacts();

  const stats = {
    total: contacts.length,
    updated: 0,
    noChange: 0,
    skipped: 0,
    errors: 0
  };

  const changes = [];

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const email = contact.fields.Email;

    if (!email) {
      stats.skipped++;
      continue;
    }

    const currentStatus = contact.fields.Status || 'No status';
    const mailchimpStatus = await checkMailchimpStatus(email);

    // Skip if not in Mailchimp
    if (!mailchimpStatus.exists) {
      stats.skipped++;
      continue;
    }

    // Map Mailchimp status to Airtable (only valid options)
    let newStatus;
    if (mailchimpStatus.status === 'subscribed' || mailchimpStatus.status === 'pending') {
      newStatus = 'Opted-In';
    } else if (mailchimpStatus.status === 'unsubscribed' || mailchimpStatus.status === 'cleaned') {
      newStatus = 'Unsubscribed';
    } else {
      stats.skipped++;
      continue;
    }

    // Only update if changed
    if (newStatus !== currentStatus) {
      const updateResult = await updateAirtableStatus(contact.id, newStatus);

      if (updateResult.success) {
        stats.updated++;
        changes.push({
          email,
          station: contact.fields.Station || 'Unknown',
          oldStatus: currentStatus,
          newStatus
        });

        if (stats.updated % 10 === 0) {
          console.log(`   Updated ${stats.updated} contacts...`);
        }
      } else {
        stats.errors++;
      }
    } else {
      stats.noChange++;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');
  console.log('📊 SYNC SUMMARY:\n');
  console.log(`Total contacts: ${stats.total}`);
  console.log(`   ✅ Updated: ${stats.updated}`);
  console.log(`   ⏭️  No change: ${stats.noChange}`);
  console.log(`   ⏸️  Skipped (not in Mailchimp): ${stats.skipped}`);
  console.log(`   ❌ Errors: ${stats.errors}\n`);

  if (changes.length > 0) {
    console.log(`🔍 STATUS CHANGES (${changes.length} total):\n`);
    changes.forEach((c, i) => {
      console.log(`${i+1}. ${c.email}`);
      console.log(`   ${c.oldStatus} → ${c.newStatus}`);
      console.log(`   Station: ${c.station}\n`);
    });
  }

  fs.writeFileSync('./MAILCHIMP_SYNC_REPORT.json', JSON.stringify({ stats, changes }, null, 2));
  console.log('💾 Report saved: MAILCHIMP_SYNC_REPORT.json\n');
  console.log('✅ Sync complete!\n');

  return { stats, changes };
}

if (require.main === module) {
  syncAllStatuses().catch(console.error);
}

module.exports = { syncAllStatuses };

#!/usr/bin/env node

/**
 * Sync Subscription Status from Mailchimp to Airtable
 *
 * Updates all 516 Airtable contacts with accurate subscription status from Mailchimp
 */

const fs = require('fs');
const fetch = require('node-fetch');
const crypto = require('crypto');

const MAILCHIMP_API_KEY = '83f53d36bd6667b4c56015e8a0d1ed66-us13';
const MAILCHIMP_SERVER = 'us13';
const LIST_ID = '137bcedead'; // Liberty Music PR list

const AIRTABLE_API_KEY = 'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

// Get MD5 hash of email (Mailchimp uses this as member ID)
function getSubscriberHash(email) {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
}

// Fetch all contacts from Airtable
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

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    allRecords.push(...data.records);
    console.log(`   Fetched ${data.records.length} records (Total: ${allRecords.length})`);

    offset = data.offset;

  } while (offset);

  console.log(`\n✅ Total Airtable contacts: ${allRecords.length}\n`);
  return allRecords;
}

// Check subscription status in Mailchimp
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
      return { exists: false, status: 'Not in Mailchimp' };
    }

    if (!response.ok) {
      return { exists: false, status: 'Error', error: response.status };
    }

    const data = await response.json();

    return {
      exists: true,
      status: data.status, // subscribed, unsubscribed, cleaned, pending
      lastChanged: data.last_changed
    };

  } catch (error) {
    return { exists: false, status: 'Error', error: error.message };
  }
}

// Update Airtable record with new status
async function updateAirtableStatus(recordId, newStatus, currentStatus) {
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
          fields: {
            'Status': newStatus,
            'Last Enriched': new Date().toISOString().split('T')[0]
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable update error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return { success: true };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function syncAllStatuses() {
  console.log('🔄 Syncing Subscription Status: Mailchimp → Airtable\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = await fetchAllAirtableContacts();

  const stats = {
    total: contacts.length,
    updated: 0,
    noChange: 0,
    errors: 0,
    statusChanges: {
      'Opted-In → Subscribed': 0,
      'Unsubscribed → Subscribed': 0,
      'Subscribed → Unsubscribed': 0,
      'New → Subscribed': 0,
      'Any → Not in Mailchimp': 0
    }
  };

  const changes = [];

  console.log('Starting status check for all contacts...\n');

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const email = contact.fields.Email;

    if (!email) {
      console.log(`[${i+1}/${contacts.length}] Skipping: No email address`);
      stats.errors++;
      continue;
    }

    const currentStatus = contact.fields.Status || 'No status';
    console.log(`[${i+1}/${contacts.length}] ${email}`);

    // Check Mailchimp status
    const mailchimpStatus = await checkMailchimpStatus(email);

    // Map Mailchimp status to Airtable status
    let newStatus;
    if (mailchimpStatus.exists) {
      if (mailchimpStatus.status === 'subscribed') {
        newStatus = 'Opted-In'; // Keep Airtable terminology
      } else if (mailchimpStatus.status === 'unsubscribed') {
        newStatus = 'Unsubscribed';
      } else if (mailchimpStatus.status === 'cleaned') {
        newStatus = 'Unsubscribed'; // Treat cleaned as unsubscribed
      } else if (mailchimpStatus.status === 'pending') {
        newStatus = 'Opted-In'; // Treat pending as opted-in
      } else {
        newStatus = currentStatus; // Keep current if unknown status
      }
    } else {
      newStatus = 'Not in Mailchimp';
    }

    console.log(`   Current: ${currentStatus}`);
    console.log(`   Mailchimp: ${mailchimpStatus.status}`);
    console.log(`   New: ${newStatus}`);

    // Check if status changed
    if (newStatus !== currentStatus) {
      console.log(`   ⚠️  STATUS CHANGE: ${currentStatus} → ${newStatus}`);

      // Track change type
      const changeKey = `${currentStatus} → ${newStatus}`;
      if (!stats.statusChanges[changeKey]) {
        stats.statusChanges[changeKey] = 0;
      }
      stats.statusChanges[changeKey]++;

      // Update Airtable
      const updateResult = await updateAirtableStatus(contact.id, newStatus, currentStatus);

      if (updateResult.success) {
        console.log(`   ✅ Updated in Airtable`);
        stats.updated++;

        changes.push({
          email,
          station: contact.fields.Station || 'Unknown',
          oldStatus: currentStatus,
          newStatus,
          mailchimpStatus: mailchimpStatus.status
        });
      } else {
        console.log(`   ❌ Update failed: ${updateResult.error}`);
        stats.errors++;
      }

    } else {
      console.log(`   ✅ No change needed`);
      stats.noChange++;
    }

    console.log('');

    // Rate limiting (10 requests per second max)
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 SYNC SUMMARY:\n');
  console.log(`Total contacts processed: ${stats.total}`);
  console.log(`   ✅ Updated: ${stats.updated}`);
  console.log(`   ⏭️  No change: ${stats.noChange}`);
  console.log(`   ❌ Errors: ${stats.errors}\n`);

  console.log('📈 STATUS CHANGES:\n');
  Object.entries(stats.statusChanges).forEach(([change, count]) => {
    if (count > 0) {
      console.log(`   ${change}: ${count}`);
    }
  });
  console.log('');

  if (changes.length > 0) {
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`🔍 DETAILED CHANGES (${changes.length} total):\n`);

    // Group by change type
    const changesByType = {};
    changes.forEach(change => {
      const key = `${change.oldStatus} → ${change.newStatus}`;
      if (!changesByType[key]) {
        changesByType[key] = [];
      }
      changesByType[key].push(change);
    });

    Object.entries(changesByType).forEach(([changeType, contacts]) => {
      console.log(`${changeType} (${contacts.length}):`);
      contacts.forEach((c, i) => {
        console.log(`   ${i+1}. ${c.email} (${c.station})`);
      });
      console.log('');
    });
  }

  // Save detailed report
  const report = {
    syncDate: new Date().toISOString(),
    stats,
    changes
  };

  fs.writeFileSync('./MAILCHIMP_SYNC_REPORT.json', JSON.stringify(report, null, 2));
  console.log('💾 Full sync report saved to: MAILCHIMP_SYNC_REPORT.json\n');

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('✅ Sync complete! Airtable now reflects accurate Mailchimp status.\n');

  return report;
}

// Run if called directly
if (require.main === module) {
  syncAllStatuses().catch(console.error);
}

module.exports = { syncAllStatuses };

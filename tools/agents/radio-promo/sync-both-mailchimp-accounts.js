#!/usr/bin/env node

/**
 * Sync Both Mailchimp Accounts to Airtable
 *
 * Checks both Liberty and TAP Mailchimp accounts and updates Airtable with:
 * 1. Subscription Status (subscribed/unsubscribed/cleaned)
 * 2. Which Mailchimp Account they're subscribed to (Liberty/TAP/Both/None)
 */

const fetch = require('node-fetch');

// Airtable Configuration
const AIRTABLE_API_KEY =
  'pat52SEWV8PWmKZfW.d557f03560fdc8aa0895ac6fda0cbffd753054ea2fedbedd53207e7c265469ec';
const BASE_ID = 'appx7uTQWRH8cIC20';
const TABLE_ID = 'tblcZnUsB4Swyjcip';

// Liberty Mailchimp (existing)
const LIBERTY_API_KEY = '83f53d36bd6667b4c56015e8a0d1ed66-us13';
const LIBERTY_SERVER = 'us13';
const LIBERTY_LIST_ID = '137bcedead';

// TAP Mailchimp (new)
const TAP_API_KEY = 'e028ec0ce85df6990c0a824e3b55e033-us17';
const TAP_SERVER = 'us17';
const TAP_LIST_ID = '2c81175fba';

async function fetchAllAirtableContacts() {
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

  console.log(`✅ Total Airtable contacts: ${allRecords.length}\n`);
  return allRecords;
}

async function getMailchimpListMembers(apiKey, server, listId, listName) {
  console.log(`📧 Fetching ${listName} Mailchimp members...\n`);

  const members = new Map(); // email -> status
  let offset = 0;
  const count = 1000;

  while (true) {
    const url = `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members?count=${count}&offset=${offset}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`${listName} API Error: ${response.status}`);
    }

    const data = await response.json();

    data.members.forEach(member => {
      members.set(member.email_address.toLowerCase(), member.status);
    });

    if (data.members.length < count) break;
    offset += count;
  }

  console.log(`✅ ${listName}: ${members.size} members\n`);
  return members;
}

async function updateAirtableContact(recordId, updates) {
  const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: updates }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { success: false, error: errorData.error.message };
  }

  return { success: true };
}

async function syncBothMailchimpAccounts() {
  console.log('🔄 Sync Both Mailchimp Accounts to Airtable\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Fetch data from both Mailchimp accounts
    const libertyMembers = await getMailchimpListMembers(
      LIBERTY_API_KEY,
      LIBERTY_SERVER,
      LIBERTY_LIST_ID,
      'Liberty Music PR'
    );

    const tapMembers = await getMailchimpListMembers(
      TAP_API_KEY,
      TAP_SERVER,
      TAP_LIST_ID,
      'Total Audio Promo'
    );

    console.log('═══════════════════════════════════════════════════════════\n');

    // Fetch all Airtable contacts
    const contacts = await fetchAllAirtableContacts();

    console.log('🔄 Processing contacts...\n');

    let updated = 0;
    let libertyCount = 0;
    let tapCount = 0;
    let bothCount = 0;
    let noneCount = 0;

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const email = contact.fields.Email?.toLowerCase();

      if (!email) {
        console.log(`[${i + 1}/${contacts.length}] Skipping - no email`);
        continue;
      }

      const inLiberty = libertyMembers.has(email);
      const inTAP = tapMembers.has(email);

      let mailchimpAccount = 'None';
      let subscriptionStatus = 'unsubscribed';

      if (inLiberty && inTAP) {
        mailchimpAccount = 'Both';
        bothCount++;
        // Use Liberty status as primary
        subscriptionStatus = libertyMembers.get(email);
      } else if (inLiberty) {
        mailchimpAccount = 'Liberty';
        libertyCount++;
        subscriptionStatus = libertyMembers.get(email);
      } else if (inTAP) {
        mailchimpAccount = 'TAP';
        tapCount++;
        subscriptionStatus = tapMembers.get(email);
      } else {
        noneCount++;
      }

      const updates = {
        'Mailchimp Account': mailchimpAccount,
        'Subscription Status': subscriptionStatus,
      };

      const result = await updateAirtableContact(contact.id, updates);

      if (result.success) {
        console.log(`[${i + 1}/${contacts.length}] ${email}`);
        console.log(`   Account: ${mailchimpAccount} | Status: ${subscriptionStatus}`);
        updated++;
      } else {
        console.log(`[${i + 1}/${contacts.length}] ❌ ${email}: ${result.error}`);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');
    console.log('📊 SYNC SUMMARY:\n');
    console.log(`Total contacts processed: ${contacts.length}`);
    console.log(`Successfully updated: ${updated}\n`);
    console.log('Mailchimp Account Distribution:');
    console.log(`   Liberty only: ${libertyCount}`);
    console.log(`   TAP only: ${tapCount}`);
    console.log(`   Both accounts: ${bothCount}`);
    console.log(`   Neither account: ${noneCount}\n`);

    console.log('✅ Sync complete!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncBothMailchimpAccounts();

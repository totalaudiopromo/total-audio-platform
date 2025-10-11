#!/usr/bin/env node

/**
 * Verify KYARA Contact Status in Mailchimp
 *
 * Checks if the 21 KYARA contacts are actually subscribed in Mailchimp
 * and compares to Airtable status
 */

const fs = require('fs');
const fetch = require('node-fetch');
const crypto = require('crypto');

const MAILCHIMP_API_KEY = '83f53d36bd6667b4c56015e8a0d1ed66-us13';
const MAILCHIMP_SERVER = 'us13';
const LIST_ID = '137bcedead'; // Liberty Music PR list

// Load KYARA contacts from Airtable
function loadKYARAContacts() {
  const data = JSON.parse(fs.readFileSync('./KYARA_AIRTABLE_CONTACTS.json', 'utf-8'));
  return [...data.hot, ...data.warm, ...data.cold, ...data.other];
}

// Get MD5 hash of email (Mailchimp uses this as member ID)
function getSubscriberHash(email) {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
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
      return { exists: false, status: 'Error checking status', error: response.status };
    }

    const data = await response.json();

    return {
      exists: true,
      status: data.status, // subscribed, unsubscribed, cleaned, pending
      email: data.email_address,
      tags: data.tags ? data.tags.map(t => t.name) : [],
      lastChanged: data.last_changed,
      memberRating: data.member_rating
    };

  } catch (error) {
    return { exists: false, status: 'Error', error: error.message };
  }
}

async function verifyKYARAContacts() {
  console.log('🔍 Verifying KYARA Contact Status in Mailchimp...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const contacts = loadKYARAContacts();
  console.log(`Found ${contacts.length} KYARA contacts in Airtable\n`);

  const results = {
    subscribed: [],
    unsubscribed: [],
    notInMailchimp: [],
    pending: [],
    cleaned: [],
    errors: []
  };

  const mismatches = [];

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    console.log(`[${i+1}/${contacts.length}] Checking: ${contact.email}`);

    const mailchimpStatus = await checkMailchimpStatus(contact.email);
    const airtableStatus = contact.relationship || contact.allFields?.Status || 'No status';

    // Log status
    if (mailchimpStatus.exists) {
      console.log(`   Mailchimp: ${mailchimpStatus.status}`);
      console.log(`   Airtable: ${airtableStatus}`);

      // Check for mismatch
      const mailchimpSubscribed = mailchimpStatus.status === 'subscribed';
      const airtableSubscribed = airtableStatus === 'Opted-In' || airtableStatus === '';

      if (mailchimpSubscribed !== airtableSubscribed) {
        console.log(`   ⚠️  MISMATCH DETECTED`);
        mismatches.push({
          email: contact.email,
          mailchimpStatus: mailchimpStatus.status,
          airtableStatus,
          station: contact.allFields?.Station || contact.name
        });
      } else {
        console.log(`   ✅ Status matches`);
      }

      // Categorize
      if (mailchimpStatus.status === 'subscribed') {
        results.subscribed.push({ ...contact, mailchimpStatus });
      } else if (mailchimpStatus.status === 'unsubscribed') {
        results.unsubscribed.push({ ...contact, mailchimpStatus });
      } else if (mailchimpStatus.status === 'pending') {
        results.pending.push({ ...contact, mailchimpStatus });
      } else if (mailchimpStatus.status === 'cleaned') {
        results.cleaned.push({ ...contact, mailchimpStatus });
      }

      // Show tags
      if (mailchimpStatus.tags && mailchimpStatus.tags.length > 0) {
        console.log(`   Tags: ${mailchimpStatus.tags.join(', ')}`);
      }

    } else {
      console.log(`   ❌ Not in Mailchimp: ${mailchimpStatus.status}`);
      results.notInMailchimp.push({ ...contact, mailchimpStatus });

      if (airtableStatus === 'Opted-In') {
        mismatches.push({
          email: contact.email,
          mailchimpStatus: 'Not in Mailchimp',
          airtableStatus,
          station: contact.allFields?.Station || contact.name
        });
      }
    }

    console.log('');

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 VERIFICATION SUMMARY:\n');
  console.log(`✅ Subscribed in Mailchimp: ${results.subscribed.length}`);
  console.log(`❌ Unsubscribed in Mailchimp: ${results.unsubscribed.length}`);
  console.log(`⏳ Pending confirmation: ${results.pending.length}`);
  console.log(`🧹 Cleaned (bounced/invalid): ${results.cleaned.length}`);
  console.log(`❓ Not in Mailchimp: ${results.notInMailchimp.length}`);
  console.log('');

  if (mismatches.length > 0) {
    console.log('⚠️  AIRTABLE ↔ MAILCHIMP MISMATCHES:\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    mismatches.forEach((mismatch, i) => {
      console.log(`${i+1}. ${mismatch.email}`);
      console.log(`   Station: ${mismatch.station}`);
      console.log(`   Mailchimp: ${mismatch.mailchimpStatus}`);
      console.log(`   Airtable: ${mismatch.airtableStatus}`);
      console.log('');
    });

    console.log(`Total Mismatches: ${mismatches.length}/${contacts.length} contacts\n`);
  } else {
    console.log('✅ All statuses match between Airtable and Mailchimp!\n');
  }

  // High-value contacts that are unsubscribed
  const valuableUnsubscribed = results.unsubscribed.filter(c =>
    c.email.includes('bbc') || c.allFields?.['MC TAGS']?.includes('BBC')
  );

  if (valuableUnsubscribed.length > 0) {
    console.log('🚨 HIGH-VALUE UNSUBSCRIBED CONTACTS:\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    valuableUnsubscribed.forEach((contact, i) => {
      console.log(`${i+1}. ${contact.email}`);
      console.log(`   Station: ${contact.allFields?.Station || 'Unknown'}`);
      console.log(`   Show: ${contact.allFields?.Show || 'N/A'}`);
      console.log(`   Tags: ${contact.allFields?.['MC TAGS'] || 'None'}`);
      console.log(`   Last Changed: ${contact.mailchimpStatus.lastChanged || 'Unknown'}`);
      console.log('');
    });

    console.log('⚠️  Consider manually investigating these high-value contacts\n');
  }

  console.log('═══════════════════════════════════════════════════════════\n');

  // Save results to file
  const report = {
    totalContacts: contacts.length,
    summary: {
      subscribed: results.subscribed.length,
      unsubscribed: results.unsubscribed.length,
      pending: results.pending.length,
      cleaned: results.cleaned.length,
      notInMailchimp: results.notInMailchimp.length
    },
    mismatches,
    valuableUnsubscribed: valuableUnsubscribed.map(c => ({
      email: c.email,
      station: c.allFields?.Station,
      show: c.allFields?.Show,
      tags: c.allFields?.['MC TAGS'],
      lastChanged: c.mailchimpStatus.lastChanged
    })),
    subscribedContacts: results.subscribed.map(c => c.email),
    unsubscribedContacts: results.unsubscribed.map(c => c.email),
    notInMailchimpContacts: results.notInMailchimp.map(c => c.email)
  };

  fs.writeFileSync('./KYARA_MAILCHIMP_VERIFICATION.json', JSON.stringify(report, null, 2));
  console.log('💾 Full report saved to: KYARA_MAILCHIMP_VERIFICATION.json\n');

  return report;
}

// Run if called directly
if (require.main === module) {
  verifyKYARAContacts().catch(console.error);
}

module.exports = { verifyKYARAContacts };

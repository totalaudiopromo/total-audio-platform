#!/usr/bin/env node

/**
 * Fix Total Audio Promo Mailchimp Account
 *
 * Issues to fix:
 * 1. Change primary email from radiopromo@totalaudiotransfer.com to promo@totalaudiopromo.com
 * 2. Check contact limit status (500 free plan limit)
 * 3. Audit lists and contacts
 */

const fetch = require('node-fetch');

const TAP_API_KEY = 'e028ec0ce85df6990c0a824e3b55e033-us17';
const TAP_SERVER = 'us17';

async function getAccountInfo() {
  console.log('🔍 Fetching TAP Mailchimp Account Info...\n');

  const response = await fetch(`https://${TAP_SERVER}.api.mailchimp.com/3.0/`, {
    headers: {
      'Authorization': `Bearer ${TAP_API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  console.log('📊 Account Details:');
  console.log(`   Account Name: ${data.account_name}`);
  console.log(`   Email: ${data.email}`);
  console.log(`   Total Subscribers: ${data.total_subscribers}`);
  console.log(`   Contact Limit: ${data.contact.contact_limit || 'Unlimited'}`);
  console.log(`   Current Contacts: ${data.contact.contact_count}`);
  console.log(`   Plan Type: ${data.plan_type}`);
  console.log(`   Plan Name: ${data.plan_name}\n`);

  return data;
}

async function getLists() {
  console.log('📋 Fetching All Lists...\n');

  const response = await fetch(`https://${TAP_SERVER}.api.mailchimp.com/3.0/lists?count=100`, {
    headers: {
      'Authorization': `Bearer ${TAP_API_KEY}`
    }
  });

  const data = await response.json();

  console.log(`Found ${data.total_items} lists:\n`);

  data.lists.forEach((list, idx) => {
    console.log(`${idx + 1}. ${list.name}`);
    console.log(`   ID: ${list.id}`);
    console.log(`   Members: ${list.stats.member_count}`);
    console.log(`   Created: ${new Date(list.date_created).toLocaleDateString()}\n`);
  });

  return data.lists;
}

async function getAuthorizedApps() {
  console.log('🔑 Fetching Authorized Apps...\n');

  const response = await fetch(`https://${TAP_SERVER}.api.mailchimp.com/3.0/authorized-apps`, {
    headers: {
      'Authorization': `Bearer ${TAP_API_KEY}`
    }
  });

  const data = await response.json();

  if (data.apps && data.apps.length > 0) {
    console.log(`Found ${data.apps.length} authorized apps:\n`);
    data.apps.forEach((app, idx) => {
      console.log(`${idx + 1}. ${app.name}`);
      console.log(`   Description: ${app.description || 'N/A'}`);
      console.log(`   Created: ${new Date(app.created_at).toLocaleDateString()}\n`);
    });
  } else {
    console.log('No authorized apps found.\n');
  }

  return data;
}

async function checkContactLimit() {
  console.log('⚠️  Contact Limit Analysis:\n');

  const account = await getAccountInfo();

  const contactCount = account.contact.contact_count;
  const contactLimit = account.contact.contact_limit || Infinity;
  const percentUsed = ((contactCount / contactLimit) * 100).toFixed(1);

  console.log(`📊 Limit Status:`);
  console.log(`   Current Contacts: ${contactCount}`);
  console.log(`   Contact Limit: ${contactLimit === Infinity ? 'Unlimited' : contactLimit}`);
  console.log(`   Usage: ${percentUsed}%`);

  if (contactCount >= 500 && account.plan_type.toLowerCase().includes('free')) {
    console.log('\n🚨 ISSUE DETECTED:');
    console.log('   You have hit the 500 contact limit on the Free plan.');
    console.log('   Sending is paused until you either:');
    console.log('   1. Upgrade to a paid plan');
    console.log('   2. Delete/archive contacts to get under 500\n');
  }
}

async function main() {
  console.log('🔧 Total Audio Promo Mailchimp Account Audit\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    await checkContactLimit();
    console.log('\n═══════════════════════════════════════════════════════════\n');

    const lists = await getLists();
    console.log('═══════════════════════════════════════════════════════════\n');

    await getAuthorizedApps();
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📝 NEXT STEPS:\n');
    console.log('1. To change primary email:');
    console.log('   - Log in to mailchimp.com with radiopromo@totalaudiotransfer.com');
    console.log('   - Go to Account Settings > Account Details');
    console.log('   - Update email to promo@totalaudiopromo.com');
    console.log('   - Verify the new email address\n');

    console.log('2. To fix contact limit:');
    console.log('   - Archive or delete old/inactive contacts');
    console.log('   - OR upgrade to paid plan ($13/month for 500 contacts)\n');

    console.log('3. To add to .env file:');
    console.log('   TAP_MAILCHIMP_API_KEY=e028ec0ce85df6990c0a824e3b55e033-us17');
    console.log('   TAP_MAILCHIMP_SERVER=us17');
    console.log('   LIBERTY_MAILCHIMP_API_KEY=83f53d36bd6667b4c56015e8a0d1ed66-us13');
    console.log('   LIBERTY_MAILCHIMP_SERVER=us13\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

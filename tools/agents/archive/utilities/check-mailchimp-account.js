#!/usr/bin/env node

/**
 * Check Mailchimp Account Details
 *
 * Identifies which Mailchimp account is connected and checks contact limits
 */

const fetch = require('node-fetch');

const MAILCHIMP_API_KEY = '83f53d36bd6667b4c56015e8a0d1ed66-us13';
const MAILCHIMP_SERVER = 'us13';

async function checkMailchimpAccount() {
  console.log('🔍 Checking Mailchimp Account Details...\n');

  try {
    // Get account info
    const accountResponse = await fetch(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!accountResponse.ok) {
      throw new Error(`Mailchimp API error: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();

    console.log('📧 MAILCHIMP ACCOUNT INFORMATION:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`Account Name: ${accountData.account_name || 'Unknown'}`);
    console.log(`Account ID: ${accountData.account_id || 'Unknown'}`);
    console.log(`Email: ${accountData.email || 'Unknown'}`);
    console.log(`Username: ${accountData.username || 'Unknown'}`);
    console.log(`Account Created: ${accountData.account_created_date || 'Unknown'}`);
    console.log(`Total Subscribers: ${accountData.total_subscribers || 0}`);
    console.log('');

    // Determine which account this is
    const isLiberty =
      accountData.account_name?.toLowerCase().includes('liberty') ||
      accountData.email?.toLowerCase().includes('liberty');
    const isTotalAudio =
      accountData.account_name?.toLowerCase().includes('total') ||
      accountData.email?.toLowerCase().includes('total');

    console.log('🎯 ACCOUNT IDENTIFICATION:');
    if (isLiberty) {
      console.log('   ✅ This is the LIBERTY MUSIC PR account');
    } else if (isTotalAudio) {
      console.log('   ✅ This is the TOTAL AUDIO PROMO account');
    } else {
      console.log('   ⚠️  Cannot determine account type from name/email');
      console.log('   📧 Account Email:', accountData.email);
      console.log('   📋 Account Name:', accountData.account_name);
    }
    console.log('');

    // Get all audiences/lists
    console.log('📋 AUDIENCES/LISTS:');
    console.log('═══════════════════════════════════════════════════════════\n');

    const listsResponse = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists?count=50`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const listsData = await listsResponse.json();

    if (listsData.lists && listsData.lists.length > 0) {
      let totalContacts = 0;

      listsData.lists.forEach((list, i) => {
        console.log(`${i + 1}. ${list.name}`);
        console.log(`   ID: ${list.id}`);
        console.log(`   Total Contacts: ${list.stats.member_count}`);
        console.log(`   Subscribed: ${list.stats.member_count - list.stats.unsubscribe_count}`);
        console.log(`   Unsubscribed: ${list.stats.unsubscribe_count}`);
        console.log(`   Created: ${list.date_created}`);
        console.log('');

        totalContacts += list.stats.member_count;
      });

      console.log('═══════════════════════════════════════════════════════════');
      console.log(`Total Contacts Across All Lists: ${totalContacts}`);
      console.log('');
    } else {
      console.log('   No audiences found');
      console.log('');
    }

    // Check plan limits
    console.log('💳 PLAN & LIMITS:');
    console.log('═══════════════════════════════════════════════════════════\n');

    const pricingTier = accountData.pricing_plan_type || 'Unknown';
    console.log(`Pricing Plan: ${pricingTier}`);

    // Estimate limits based on common Mailchimp plans
    let contactLimit = 'Unknown';
    if (pricingTier.toLowerCase().includes('free')) {
      contactLimit = '500 contacts, 1,000 sends/month';
    } else if (pricingTier.toLowerCase().includes('essentials')) {
      contactLimit = 'Variable (check Mailchimp dashboard)';
    } else if (pricingTier.toLowerCase().includes('standard')) {
      contactLimit = 'Variable (check Mailchimp dashboard)';
    } else if (pricingTier.toLowerCase().includes('premium')) {
      contactLimit = 'Variable (check Mailchimp dashboard)';
    }

    console.log(`Estimated Limit: ${contactLimit}`);
    console.log('');

    console.log('📊 CURRENT USAGE:');
    console.log(`   Total Subscribers: ${accountData.total_subscribers || 0}`);
    if (pricingTier.toLowerCase().includes('free') && accountData.total_subscribers) {
      const percentUsed = ((accountData.total_subscribers / 500) * 100).toFixed(1);
      console.log(`   Usage: ${percentUsed}% of free plan limit`);
      console.log(`   Remaining: ${500 - accountData.total_subscribers} contacts available`);
    }
    console.log('');

    // Check for KYARA campaign tag
    console.log('🏷️  CHECKING FOR KYARA CAMPAIGN TAG:');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (listsData.lists && listsData.lists.length > 0) {
      for (const list of listsData.lists) {
        const tagsResponse = await fetch(
          `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${list.id}/segments?type=static&count=100`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const tagsData = await tagsResponse.json();

        if (tagsData.segments) {
          const kyaraTags = tagsData.segments.filter(seg =>
            seg.name.toLowerCase().includes('kyara')
          );

          if (kyaraTags.length > 0) {
            console.log(`List: ${list.name}`);
            kyaraTags.forEach(tag => {
              console.log(`   ✅ Tag: ${tag.name} (${tag.member_count} members)`);
            });
            console.log('');
          }
        }
      }
    }

    console.log('═══════════════════════════════════════════════════════════\n');

    return {
      accountName: accountData.account_name,
      email: accountData.email,
      isLiberty,
      isTotalAudio,
      totalSubscribers: accountData.total_subscribers,
      pricingPlan: pricingTier,
      lists: listsData.lists || [],
    };
  } catch (error) {
    console.error('❌ Error checking Mailchimp account:', error.message);
    return null;
  }
}

// Run if called directly
if (require.main === module) {
  checkMailchimpAccount().catch(console.error);
}

module.exports = { checkMailchimpAccount };

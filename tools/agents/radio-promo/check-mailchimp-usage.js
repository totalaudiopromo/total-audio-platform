#!/usr/bin/env node

/**
 * Check Mailchimp Usage and Free Tier Status
 */

require('dotenv').config();

async function checkMailchimpUsage() {
  console.log('📊 Checking Mailchimp Usage and Free Tier Status\n');
  
  try {
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    
    if (!apiKey || !serverPrefix) {
      console.log('❌ Mailchimp API credentials not found in environment variables');
      console.log('   Please check your .env file for MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX');
      return;
    }
    
    console.log('🔑 Mailchimp API configured');
    console.log(`   Server: ${serverPrefix}`);
    console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
    console.log('');
    
    // Check account info
    const accountResponse = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (accountResponse.ok) {
      const accountData = await accountResponse.json();
      console.log('📊 Mailchimp Account Info:');
      console.log(`   Account Name: ${accountData.account_name || 'Unknown'}`);
      console.log(`   Login ID: ${accountData.login_id || 'Unknown'}`);
      console.log(`   Contact Count: ${accountData.contact_count || 'Unknown'}`);
      console.log(`   Member Count: ${accountData.member_count || 'Unknown'}`);
      console.log('');
    } else {
      console.log('❌ Could not fetch account info');
      console.log(`   Status: ${accountResponse.status}`);
      console.log(`   Response: ${await accountResponse.text()}`);
    }
    
    // Check audiences
    const audiencesResponse = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/lists?count=100`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (audiencesResponse.ok) {
      const audiencesData = await audiencesResponse.json();
      console.log('📋 Mailchimp Audiences:');
      
      if (audiencesData.lists && audiencesData.lists.length > 0) {
        let totalContacts = 0;
        
        audiencesData.lists.forEach((audience, i) => {
          const contactCount = audience.stats?.member_count || 0;
          totalContacts += contactCount;
          
          console.log(`   ${i+1}. ${audience.name}`);
          console.log(`      ID: ${audience.id}`);
          console.log(`      Contacts: ${contactCount}`);
          console.log(`      Created: ${audience.date_created || 'Unknown'}`);
          console.log('');
        });
        
        console.log(`📊 Total Contacts Across All Audiences: ${totalContacts}`);
        console.log('');
        
        // Check free tier status
        if (totalContacts <= 2000) {
          console.log('✅ You are within Mailchimp FREE tier limits!');
          console.log(`   Current: ${totalContacts} contacts`);
          console.log(`   Free Limit: 2,000 contacts`);
          console.log(`   Remaining: ${2000 - totalContacts} contacts`);
        } else if (totalContacts <= 5000) {
          console.log('⚠️  You are in Mailchimp ESSENTIALS tier');
          console.log(`   Current: ${totalContacts} contacts`);
          console.log(`   Cost: £8.99/month`);
          console.log(`   Free Limit: 2,000 contacts`);
        } else if (totalContacts <= 10000) {
          console.log('⚠️  You are in Mailchimp STANDARD tier');
          console.log(`   Current: ${totalContacts} contacts`);
          console.log(`   Cost: £14.99/month`);
          console.log(`   Free Limit: 2,000 contacts`);
        } else {
          console.log('❌ You are in Mailchimp PREMIUM tier');
          console.log(`   Current: ${totalContacts} contacts`);
          console.log(`   Cost: £299/month`);
          console.log(`   Free Limit: 2,000 contacts`);
        }
        
      } else {
        console.log('   No audiences found');
        console.log('✅ You are within Mailchimp FREE tier limits!');
        console.log('   Current: 0 contacts');
        console.log('   Free Limit: 2,000 contacts');
        console.log('   Remaining: 2,000 contacts');
      }
      
    } else {
      console.log('❌ Could not fetch audiences');
      console.log(`   Status: ${audiencesResponse.status}`);
      console.log(`   Response: ${await audiencesResponse.text()}`);
    }
    
    // Recommendations
    console.log('💡 RECOMMENDATIONS:\n');
    
    if (totalContacts <= 2000) {
      console.log('✅ You can use Mailchimp FREE tier for radio promo');
      console.log('   • Add up to 250 radio contacts');
      console.log('   • Create separate audiences by station type');
      console.log('   • Use for targeted campaigns');
      console.log('   • Cost: £0/month');
    } else {
      console.log('⚠️  Consider alternatives to avoid Mailchimp costs:');
      console.log('   • Use Airtable + Gmail (free)');
      console.log('   • Use Mailgun (10,000 emails/month free)');
      console.log('   • Use SendGrid (40,000 emails/month free)');
      console.log('   • Keep Mailchimp for major campaigns only');
    }
    
    console.log('');
    console.log('🎯 For Radio Promo Specifically:');
    console.log('   • You only need 50-200 contacts');
    console.log('   • Personal outreach works better than mass email');
    console.log('   • Gmail can handle the volume');
    console.log('   • Airtable can track responses');
    console.log('   • WARM API tracks actual plays');
    
  } catch (error) {
    console.log('❌ Error checking Mailchimp usage:', error.message);
    throw error;
  }
}

// Run the check
if (require.main === module) {
  checkMailchimpUsage().catch(console.error);
}

module.exports = { checkMailchimpUsage };















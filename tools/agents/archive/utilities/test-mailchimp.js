#!/usr/bin/env node

/**
 * Test Mailchimp Integration for Liberty Music PR
 *
 * Verifies API connection and creates test audience
 */

const MailchimpApiIntegration = require('./integrations/mailchimp-api');

async function testMailchimpIntegration() {
  console.log('🧪 Testing Mailchimp Integration for Liberty Music PR...\n');

  try {
    const mailchimp = new MailchimpApiIntegration();

    // Test 1: Health check
    console.log('1. Testing API connection...');
    const health = await mailchimp.healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   Server: ${health.serverPrefix}`);
    console.log(`   ✅ API connection successful\n`);

    // Test 2: Get existing audiences
    console.log('2. Getting existing audiences...');
    const audiences = await mailchimp.getAudiences();
    console.log(`   Found ${audiences.length} audiences:`);
    audiences.forEach(audience => {
      console.log(`   - ${audience.name} (${audience.id})`);
    });
    console.log('');

    // Test 3: Ensure Liberty audience exists
    console.log('3. Ensuring Liberty Music PR audience exists...');
    const libertyAudience = await mailchimp.ensureLibertyAudience();
    console.log(`   Audience: ${libertyAudience.name}`);
    console.log(`   ID: ${libertyAudience.id}`);
    console.log(`   ✅ Liberty audience ready\n`);

    // Test 4: Add test client
    console.log('4. Adding test client...');
    const testClient = {
      email: 'test@example.com',
      artistName: 'Test Artist',
      genre: 'Indie Pop',
    };

    try {
      await mailchimp.addClientToAudience(testClient, libertyAudience.id);
      console.log(`   ✅ Test client added: ${testClient.email}\n`);
    } catch (error) {
      if (error.message.includes('already a list member')) {
        console.log(`   ⚠️  Test client already exists: ${testClient.email}\n`);
      } else {
        throw error;
      }
    }

    // Test 5: Create test campaign
    console.log('5. Creating test email campaign...');
    const testCampaign = {
      artistName: 'Test Artist',
      trackTitle: 'Test Track',
      genre: 'Indie Pop',
      releaseDate: '2024-02-01',
    };

    const sequence = await mailchimp.createRadioPromoSequence(testCampaign, libertyAudience.id);
    console.log(`   Announcement Campaign: ${sequence.announcementCampaign.id}`);
    console.log(`   Follow-up Campaign: ${sequence.followUpCampaign.id}`);
    console.log(`   ✅ Test email sequence created\n`);

    console.log('🎉 All Mailchimp tests passed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check your Mailchimp dashboard for the new audience');
    console.log('2. Review the test campaigns (they are created but not sent)');
    console.log('3. Set up your Google Chat webhook for notifications');
    console.log('4. Test the complete Radio Promo workflow');
  } catch (error) {
    console.error('❌ Mailchimp test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your API key is correct');
    console.error('2. Verify your server prefix (us13)');
    console.error('3. Ensure you have API access enabled');
    console.error('4. Check your Mailchimp account status');
  }
}

// Run the test
testMailchimpIntegration();

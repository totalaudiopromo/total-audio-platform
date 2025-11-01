#!/usr/bin/env node

/**
 * Test Monday.com Connection and Campaign Creation
 */

require('dotenv').config();
const MondayApiIntegration = require('./integrations/monday-api');

async function testMondayConnection() {
  console.log('🧪 Testing Monday.com Connection and Campaign Creation...\n');

  const mondayApi = new MondayApiIntegration();

  try {
    console.log('📋 Step 1: Testing Monday.com API connection...');

    // Test basic connection
    const campaigns = await mondayApi.getCampaignItems();
    console.log(`✅ Connected to Monday.com successfully`);
    console.log(`   Found ${campaigns.length} existing campaigns`);

    if (campaigns.length > 0) {
      console.log('\n📊 Existing Campaigns:');
      campaigns.forEach((campaign, index) => {
        console.log(`   ${index + 1}. ${campaign.name || 'Unnamed'} (ID: ${campaign.id})`);
        if (campaign.groupTitle) {
          console.log(`      Group: ${campaign.groupTitle}`);
        }
      });
    }

    console.log('\n🎵 Step 2: Testing campaign creation for Senior Dunce...');

    // Test campaign creation
    const testCampaignData = {
      artistName: 'Senior Dunce',
      trackName: 'Bestial',
      genre: 'Electronic/Experimental',
      releaseDate: '2025-10-15',
      artistEmail: 'senior.dunce@example.com',
      budget: '£500',
      campaignType: 'Radio Promo',
    };

    console.log('📝 Campaign Data:');
    console.log(`   Artist: ${testCampaignData.artistName}`);
    console.log(`   Track: ${testCampaignData.trackName}`);
    console.log(`   Genre: ${testCampaignData.genre}`);
    console.log(`   Release Date: ${testCampaignData.releaseDate}`);

    // Create the campaign
    const campaignResult = await mondayApi.createLibertyCampaign(testCampaignData, null);

    console.log('\n✅ Campaign creation test successful!');
    console.log(`   Campaign ID: ${campaignResult.id}`);
    console.log(`   Campaign Name: ${campaignResult.name}`);

    console.log('\n📋 Step 3: Verifying campaign was created...');

    // Check if the campaign appears in the list
    const updatedCampaigns = await mondayApi.getCampaignItems();
    const newCampaign = updatedCampaigns.find(c => c.id === campaignResult.id);

    if (newCampaign) {
      console.log('✅ Campaign verification successful!');
      console.log(`   Campaign found: ${newCampaign.name}`);
      console.log(`   Group: ${newCampaign.groupTitle}`);
      console.log(`   Artist: ${newCampaign.artistName}`);
      console.log(`   Track: ${newCampaign.trackName}`);
    } else {
      console.log('❌ Campaign verification failed!');
      console.log('   Campaign was created but not found in the list');
    }

    console.log('\n🎉 Monday.com Connection Test Complete!');

    return {
      success: true,
      campaignId: campaignResult.id,
      totalCampaigns: updatedCampaigns.length,
    };
  } catch (error) {
    console.error('❌ Monday.com connection test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check MONDAY_API_KEY in .env file');
    console.log('2. Verify LIBERTY_MONDAY_BOARD_ID is correct');
    console.log('3. Check Monday.com API permissions');
    console.log('4. Verify network connectivity');

    return {
      success: false,
      error: error.message,
    };
  }
}

// Run the test
testMondayConnection().then(result => {
  if (result.success) {
    console.log('\n🎉 Test completed successfully!');
    console.log(`Campaign ID: ${result.campaignId}`);
    console.log(`Total campaigns: ${result.totalCampaigns}`);
  } else {
    console.log('\n❌ Test failed.');
  }
});

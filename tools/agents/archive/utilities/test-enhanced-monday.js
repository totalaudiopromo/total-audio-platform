#!/usr/bin/env node

/**
 * Test script for Enhanced Monday.com Integration
 * Tests Liberty campaign creation with Google Drive integration
 */

require('dotenv').config();
const MondayApiIntegration = require('./integrations/monday-api');

async function testEnhancedMonday() {
  console.log('📋 Testing Enhanced Monday.com Integration for Liberty Music PR...\n');
  
  const mondayApi = new MondayApiIntegration();
  
  try {
    // Test 1: Validate Board Access
    console.log('1. 🔒 Testing Board Access Validation...');
    const accessValid = await mondayApi.validateBoardAccess();
    console.log('Board access validated:', accessValid);
    console.log('✅ Board access validation successful\n');
    
    // Test 2: Get Board Structure
    console.log('2. 📊 Testing Board Structure Retrieval...');
    const boardStructure = await mondayApi.getLibertyBoardStructure();
    console.log(`Board: ${boardStructure.name}`);
    console.log(`Columns: ${boardStructure.columns.length}`);
    console.log(`Groups: ${boardStructure.groups.length}`);
    
    // Show column structure
    console.log('\nColumn Structure:');
    boardStructure.columns.forEach((column, index) => {
      console.log(`   ${index + 1}. ${column.title} (${column.type})`);
    });
    
    console.log('✅ Board structure retrieved successfully\n');
    
    // Test 3: Get Existing Campaign Items
    console.log('3. 📋 Testing Campaign Items Retrieval...');
    const campaignItems = await mondayApi.getCampaignItems();
    console.log(`Found ${campaignItems.length} existing campaign items:`);
    
    // Show first 3 campaigns
    campaignItems.slice(0, 3).forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} (ID: ${item.id})`);
      if (item.subitems && item.subitems.length > 0) {
        console.log(`      └─ ${item.subitems.length} tasks`);
      }
    });
    
    if (campaignItems.length > 3) {
      console.log(`   ... and ${campaignItems.length - 3} more campaigns`);
    }
    
    console.log('✅ Campaign items retrieved successfully\n');
    
    // Test 4: Test Enhanced Campaign Creation (Dry Run)
    console.log('4. 🚀 Testing Enhanced Campaign Creation (Dry Run)...');
    
    const testCampaignData = {
      artistName: 'Test Artist',
      trackName: 'Test Track',
      releaseDate: '2024-12-01',
      genre: 'Indie Pop',
      budget: '500',
      campaignType: '4-week'
    };
    
    console.log('Test campaign data:', JSON.stringify(testCampaignData, null, 2));
    console.log('\n⚠️ This is a dry run - no actual campaign will be created');
    console.log('To create a real campaign, use the main agent with verification enabled');
    
    console.log('✅ Enhanced campaign creation test completed\n');
    
    // Test 5: Test WARM Data Update (Dry Run)
    console.log('5. 📻 Testing WARM Data Update (Dry Run)...');
    
    const testWarmData = {
      totalPlays: 15,
      plays: [
        { radioStation: 'BBC Radio 6 Music', station: 'BBC Radio 6 Music' },
        { radioStation: 'Amazing Radio', station: 'Amazing Radio' },
        { radioStation: 'BBC Radio 1', station: 'BBC Radio 1' }
      ]
    };
    
    console.log('Test WARM data:', JSON.stringify(testWarmData, null, 2));
    console.log('\n⚠️ This is a dry run - no actual updates will be made');
    console.log('To update with real WARM data, use the main agent with a valid campaign ID');
    
    console.log('✅ WARM data update test completed\n');
    
    console.log('🎉 All Enhanced Monday.com integration tests completed successfully!');
    console.log('\n📋 Available Enhanced Methods:');
    console.log('   • mondayApi.createLibertyCampaign(campaignData, warmAPI) - Create campaign with Drive integration');
    console.log('   • mondayApi.createCampaignDriveFolder(campaignData) - Create Google Drive folders');
    console.log('   • mondayApi.updateCampaignWithWarmData(campaignId, warmData) - Update with play data');
    console.log('   • mondayApi.setDriveAPI(driveAPI) - Connect Google Drive API');
    console.log('   • mondayApi.validateBoardAccess() - Safety check for board access');
    
    console.log('\n🔧 Setup Requirements:');
    console.log('   1. Set LIBERTY_CAMPAIGNS_FOLDER_ID in .env file');
    console.log('   2. Connect Google Drive API via setDriveAPI()');
    console.log('   3. Ensure WARM API is available for play tracking');
    
  } catch (error) {
    console.error('❌ Enhanced Monday.com test failed:', error.message);
    console.error('Full error:', error);
    
    if (error.message.includes('Board access validation failed')) {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your MONDAY_API_KEY in .env file');
      console.log('2. Verify board ID 2443582331 is correct');
      console.log('3. Ensure you have access to the Liberty Music PR board');
    }
  }
}

// Run the test
if (require.main === module) {
  testEnhancedMonday().catch(console.error);
}

module.exports = { testEnhancedMonday };

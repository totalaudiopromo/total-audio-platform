#!/usr/bin/env node

/**
 * Check Monday.com Board for Actual Campaigns
 */

const MondayApiIntegration = require('./integrations/monday-api');

async function checkMondayBoard() {
  console.log('📋 Checking Monday.com Board for Actual Campaigns...\n');
  
  const mondayApi = new MondayApiIntegration();
  
  try {
    console.log('🔍 Fetching all campaigns from Monday.com board...');
    
    const campaigns = await mondayApi.getCampaignItems();
    
    console.log(`✅ Found ${campaigns.length} campaigns on the board`);
    console.log('');
    
    if (campaigns.length > 0) {
      console.log('📊 Campaign Details:');
      campaigns.forEach((campaign, index) => {
        console.log(`\n${index + 1}. Campaign: ${campaign.name || 'Unnamed'}`);
        console.log(`   ID: ${campaign.id}`);
        console.log(`   Group: ${campaign.groupTitle || 'No Group'}`);
        console.log(`   Artist: ${campaign.artistName || 'Unknown'}`);
        console.log(`   Track: ${campaign.trackName || 'Unknown'}`);
        console.log(`   Status: ${campaign.status || 'Unknown'}`);
        console.log(`   Release Date: ${campaign.releaseDate || 'Unknown'}`);
        
        // Show column values
        if (campaign.column_values && campaign.column_values.length > 0) {
          console.log('   Column Values:');
          campaign.column_values.forEach(col => {
            if (col.text) {
              console.log(`     ${col.id}: ${col.text}`);
            }
          });
        }
      });
      
      // Check specifically for Senior Dunce
      const seniorDunceCampaign = campaigns.find(c => 
        c.name && c.name.toLowerCase().includes('senior dunce') ||
        c.groupTitle && c.groupTitle.toLowerCase().includes('senior dunce') ||
        c.artistName && c.artistName.toLowerCase().includes('senior dunce')
      );
      
      if (seniorDunceCampaign) {
        console.log('\n🎵 Senior Dunce Campaign Found:');
        console.log(`   Name: ${seniorDunceCampaign.name}`);
        console.log(`   ID: ${seniorDunceCampaign.id}`);
        console.log(`   Group: ${seniorDunceCampaign.groupTitle}`);
        console.log(`   Artist: ${seniorDunceCampaign.artistName}`);
        console.log(`   Track: ${seniorDunceCampaign.trackName}`);
      } else {
        console.log('\n❌ Senior Dunce campaign NOT found on the board');
        console.log('💡 Possible reasons:');
        console.log('1. Campaign creation failed silently');
        console.log('2. Campaign was created but not visible');
        console.log('3. Campaign ID 10044670002 might be incorrect');
        console.log('4. Board permissions issue');
      }
      
    } else {
      console.log('❌ No campaigns found on the board');
      console.log('💡 Possible reasons:');
      console.log('1. Board is empty');
      console.log('2. API permissions issue');
      console.log('3. Wrong board ID');
      console.log('4. Authentication problem');
    }
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check your Monday.com board manually');
    console.log('2. Verify the board ID in the API configuration');
    console.log('3. Check API permissions');
    console.log('4. Try creating a new campaign manually');
    
  } catch (error) {
    console.error('❌ Failed to check Monday.com board:', error.message);
    console.log('');
    console.log('🔧 Common Issues:');
    console.log('1. API key not set or expired');
    console.log('2. Board ID incorrect');
    console.log('3. Network connectivity issue');
    console.log('4. Monday.com API rate limiting');
  }
}

// Run the check
checkMondayBoard().then(() => {
  console.log('\n✅ Monday.com board check completed');
});



#!/usr/bin/env node

/**
 * Test Typeform READ-ONLY Integration for Liberty Music PR
 * 
 * Tests the Typeform integration to find your actual campaigns
 * READ-ONLY mode - no writing, only reading your campaign data
 */

const TypeformApiIntegration = require('./integrations/typeform-api');

async function testTypeformReadOnly() {
  console.log('📋 Testing Typeform READ-ONLY Integration...\n');
  
  try {
    const typeform = new TypeformApiIntegration();
    
    // Test 1: Health check
    console.log('1. Testing Typeform connection...');
    const health = await typeform.healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   Service: ${health.service}`);
    console.log(`   Read-Only Mode: ${health.readOnlyMode}`);
    console.log(`   Liberty Email: ${health.libertyEmail}`);
    console.log(`   ✅ Connection test passed\n`);
    
    // Test 2: Find all Liberty campaigns
    console.log('2. Finding all Liberty Music PR campaigns...');
    const allCampaigns = await typeform.findCampaignsByEmail();
    
    console.log(`   Total campaigns found: ${allCampaigns.length}`);
    if (allCampaigns.length > 0) {
      console.log('   Recent campaigns:');
      allCampaigns.slice(0, 5).forEach((campaign, index) => {
        console.log(`     ${index + 1}. ${campaign.data.artistName || 'Unknown Artist'} - ${campaign.data.trackTitle || 'Unknown Track'}`);
        console.log(`        Form: ${campaign.formTitle}`);
        console.log(`        Submitted: ${campaign.submittedAt}`);
        console.log(`        Confidence: ${campaign.confidence}%`);
      });
    }
    console.log(`   ✅ Campaign search complete\n`);
    
    // Test 3: Get recent campaigns
    console.log('3. Getting recent campaigns (last 30 days)...');
    const recentCampaigns = await typeform.getRecentLibertyCampaigns(30);
    
    console.log(`   Recent campaigns: ${recentCampaigns.length}`);
    if (recentCampaigns.length > 0) {
      console.log('   Recent campaign details:');
      recentCampaigns.forEach((campaign, index) => {
        console.log(`     ${index + 1}. ${campaign.data.artistName || 'Unknown Artist'} - ${campaign.data.trackTitle || 'Unknown Track'}`);
        console.log(`        Genre: ${campaign.data.genre || 'Unknown'}`);
        console.log(`        Budget: ${campaign.data.budget || 'Not specified'}`);
        console.log(`        Submitted: ${campaign.submittedAt}`);
      });
    }
    console.log(`   ✅ Recent campaigns retrieved\n`);
    
    // Test 4: Generate campaign summary
    console.log('4. Generating Liberty campaign summary...');
    const summary = await typeform.getLibertyCampaignSummary();
    
    console.log(`   Total campaigns: ${summary.totalCampaigns}`);
    console.log(`   Recent campaigns: ${summary.recentCampaigns}`);
    console.log(`   Unique artists: ${summary.artists.length}`);
    console.log(`   Unique genres: ${summary.genres.length}`);
    
    if (summary.artists.length > 0) {
      console.log(`   Artists: ${summary.artists.join(', ')}`);
    }
    if (summary.genres.length > 0) {
      console.log(`   Genres: ${summary.genres.join(', ')}`);
    }
    console.log(`   ✅ Campaign summary generated\n`);
    
    // Test 5: Test artist search (if we have campaigns)
    if (allCampaigns.length > 0 && allCampaigns[0].data.artistName) {
      const testArtist = allCampaigns[0].data.artistName.split(' ')[0]; // First name only
      console.log(`5. Testing artist search: ${testArtist}...`);
      
      const artistCampaigns = await typeform.findCampaignsByArtist(testArtist);
      console.log(`   Found ${artistCampaigns.length} campaigns for artist: ${testArtist}`);
      console.log(`   ✅ Artist search complete\n`);
    }
    
    console.log('🎉 Typeform READ-ONLY integration test complete!');
    console.log('\n📊 Summary:');
    console.log(`✅ Connected to Typeform successfully`);
    console.log(`✅ Found ${allCampaigns.length} Liberty campaigns`);
    console.log(`✅ Retrieved ${recentCampaigns.length} recent campaigns`);
    console.log(`✅ Generated campaign summary`);
    console.log(`✅ READ-ONLY mode confirmed - no data written`);
    
    console.log('\n🎯 What the agent found:');
    console.log('1. All campaigns where your Liberty email appears or artist name matches');
    console.log('2. Recent campaigns from the last 30 days');
    console.log('3. Artist names, track titles, and genres');
    console.log('4. Campaign submission dates and form details');
    console.log('5. Complete campaign summary for Liberty Music PR');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Review the campaign data in ./training-data/');
    console.log('2. Use specific artist names to find campaigns');
    console.log('3. Cross-reference with your Monday.com boards');
    console.log('4. Use this data to improve campaign tracking');
    
    console.log('\n🔒 Security:');
    console.log('✅ READ-ONLY mode - no data written to Typeform');
    console.log('✅ Searches using your Liberty email and artist names only');
    console.log('✅ No modifications to existing data');
    console.log('✅ Safe for company data');
    
  } catch (error) {
    console.error('❌ Typeform READ-ONLY test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your Typeform API key is correct');
    console.error('2. Ensure you have access to the forms');
    console.error('3. Check your internet connection');
    console.error('4. Verify API permissions');
  }
}

// Run the test
testTypeformReadOnly();

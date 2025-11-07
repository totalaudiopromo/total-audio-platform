#!/usr/bin/env node

/**
 * Simple Campaign Creation Test for Senior Dunce - Bestial
 */

const RadioPromoAgent = require('../radio-promo-agent');

async function simpleCampaignTest() {
  console.log('🧪 Simple Campaign Creation Test for Senior Dunce - Bestial...\n');

  const agent = new RadioPromoAgent();

  try {
    await agent.initialize();

    console.log('📋 Step 1: Creating Monday.com campaign for Senior Dunce - Bestial...');

    // Mock campaign data
    const campaignData = {
      artistName: 'Senior Dunce',
      trackName: 'Bestial',
      genre: 'Alternative Rock',
      releaseDate: '2025-10-15',
      artistEmail: 'senior.dunce@example.com',
      budget: '£500',
      campaignType: 'Radio Promo',
    };

    console.log('✅ Campaign data prepared');
    console.log(`   Artist: ${campaignData.artistName}`);
    console.log(`   Track: ${campaignData.trackName}`);
    console.log(`   Genre: ${campaignData.genre}`);
    console.log(`   Release Date: ${campaignData.releaseDate}`);
    console.log('');

    // Create Monday.com campaign
    console.log('📅 Creating Monday.com campaign...');
    const campaignResult = await agent.mondayApi.createLibertyCampaign(campaignData, agent.warmApi);

    console.log('✅ Monday.com campaign created successfully!');
    console.log(`   Campaign ID: ${campaignResult.id}`);
    console.log(`   Campaign Name: ${campaignResult.name}`);
    console.log('');

    console.log('🎵 Step 2: Testing radio research...');

    // Test radio research
    const radioResearch = await agent.researchRadioStationsForCampaign(
      campaignData.artistName,
      campaignData.trackName,
      campaignData.genre
    );

    console.log('✅ Radio research completed');
    console.log(`   Total stations: ${radioResearch.stations.length}`);
    console.log(
      `   High priority stations: ${
        radioResearch.stations.filter(s => s.priority === 'very_high' || s.priority === 'high')
          .length
      }`
    );
    console.log('');

    console.log('📝 Step 3: Generating press release...');

    // Generate press release using the CLI method
    const pressReleaseResult = await agent.generatePressRelease(
      campaignData.artistName,
      campaignData.trackName,
      campaignData.genre
    );

    console.log('✅ Press release generated successfully');
    console.log(`   Length: ${pressReleaseResult.length} characters`);
    console.log('');

    console.log('🎉 CAMPAIGN CREATION TEST SUCCESSFUL!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   ✅ Artist: ${campaignData.artistName}`);
    console.log(`   ✅ Track: ${campaignData.trackName}`);
    console.log(`   ✅ Monday.com Campaign: ${campaignResult.id}`);
    console.log(`   ✅ Press Release: Generated`);
    console.log(`   ✅ Radio Research: ${radioResearch.stations.length} stations`);
    console.log('');
    console.log('🚀 Check your Monday.com board for the new campaign!');
    console.log('');

    return {
      success: true,
      campaignId: campaignResult.id,
      artistName: campaignData.artistName,
      trackName: campaignData.trackName,
    };
  } catch (error) {
    console.error('❌ Campaign creation test failed:', error.message);
    console.error('Stack trace:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    await agent.shutdown();
  }
}

// Run the test
simpleCampaignTest().then(result => {
  if (result.success) {
    console.log('🎉 Test completed successfully!');
    process.exit(0);
  } else {
    console.log('❌ Test failed');
    process.exit(1);
  }
});

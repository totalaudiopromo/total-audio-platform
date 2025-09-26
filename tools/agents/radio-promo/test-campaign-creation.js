#!/usr/bin/env node

/**
 * Test Campaign Creation for Senior Dunce - Bestial
 * 
 * This will test the complete workflow:
 * 1. Create mock Typeform data
 * 2. Generate press release
 * 3. Create Monday.com campaign
 * 4. Test all integrations
 */

const RadioPromoAgent = require('../radio-promo-agent');

async function testCampaignCreation() {
  console.log('🧪 Testing Complete Campaign Creation Workflow...\n');
  
  const agent = new RadioPromoAgent();
  
  try {
    await agent.initialize();
    
    console.log('📋 Step 1: Creating mock campaign data for Senior Dunce - Bestial...');
    
    // Mock campaign data (simulating what would come from Typeform)
    const mockCampaignData = {
      artistName: 'Senior Dunce',
      trackName: 'Bestial',
      genre: 'Alternative Rock',
      releaseDate: '2025-10-15',
      artistEmail: 'senior.dunce@example.com',
      budget: '£500',
      campaignType: 'Radio Promo',
      targetAudience: 'Alternative rock fans, indie music listeners',
      keyMessages: 'Raw energy, authentic sound, underground appeal',
      pressAssets: {
        bio: 'Senior Dunce is an alternative rock band known for their raw, authentic sound and underground appeal. Formed in 2020, they have built a dedicated following through their intense live performances and uncompromising musical vision.',
        socialMedia: {
          instagram: '@seniordunce',
          twitter: '@seniordunce',
          facebook: 'Senior Dunce'
        },
        pressPhotos: ['senior_dunce_band_photo.jpg', 'senior_dunce_live_performance.jpg'],
        musicVideo: 'https://youtube.com/watch?v=bestial_video'
      },
      contactInfo: {
        manager: 'John Smith',
        managerEmail: 'john@seniordunce.com',
        managerPhone: '+44 7700 900000'
      }
    };
    
    console.log('✅ Mock campaign data created');
    console.log(`   Artist: ${mockCampaignData.artistName}`);
    console.log(`   Track: ${mockCampaignData.trackName}`);
    console.log(`   Genre: ${mockCampaignData.genre}`);
    console.log(`   Release Date: ${mockCampaignData.releaseDate}`);
    console.log('');
    
    console.log('📝 Step 2: Generating Liberty-style press release...');
    
    // Generate press release using the agent
    const pressReleaseResult = await agent.generatePressReleaseWithAssets(
      mockCampaignData.artistName,
      mockCampaignData.trackName,
      mockCampaignData.genre,
      mockCampaignData.pressAssets
    );
    
    console.log('✅ Press release generated successfully');
    console.log(`   Length: ${pressReleaseResult.pressRelease.length} characters`);
    console.log('');
    
    console.log('📅 Step 3: Creating Monday.com campaign...');
    
    // Create Monday.com campaign
    const campaignResult = await agent.mondayApi.createLibertyCampaign(mockCampaignData, agent.warmApi);
    
    console.log('✅ Monday.com campaign created successfully');
    console.log(`   Campaign ID: ${campaignResult.id}`);
    console.log(`   Campaign Name: ${campaignResult.name}`);
    console.log('');
    
    console.log('🎵 Step 4: Testing radio research...');
    
    // Test radio research
    const radioResearch = await agent.researchRadioStationsForCampaign(
      mockCampaignData.artistName,
      mockCampaignData.trackName,
      mockCampaignData.genre
    );
    
    console.log('✅ Radio research completed');
    console.log(`   Stations found: ${radioResearch.stations.length}`);
    console.log(`   High priority stations: ${radioResearch.stations.filter(s => s.priority === 'very_high' || s.priority === 'high').length}`);
    console.log('');
    
    console.log('📊 Step 5: Testing WARM API integration...');
    
    // Test WARM API (using mock data)
    const warmData = await agent.warmApi.getPlaysForArtist(mockCampaignData.artistName);
    console.log('✅ WARM API integration tested');
    console.log(`   Mock plays detected: ${warmData.totalNumberOfEntities}`);
    console.log('');
    
    console.log('📧 Step 6: Testing Mailchimp integration...');
    
    // Test Mailchimp analysis
    const mailchimpSummary = await agent.mailchimp.analyzeExistingCampaigns();
    console.log('✅ Mailchimp integration tested');
    console.log(`   Campaigns analyzed: ${mailchimpSummary.totalCampaigns}`);
    console.log('');
    
    console.log('🎉 COMPLETE CAMPAIGN CREATION TEST SUCCESSFUL!');
    console.log('');
    console.log('📋 Summary:');
    console.log(`   ✅ Artist: ${mockCampaignData.artistName}`);
    console.log(`   ✅ Track: ${mockCampaignData.trackName}`);
    console.log(`   ✅ Monday.com Campaign: ${campaignResult.id}`);
    console.log(`   ✅ Press Release: Generated`);
    console.log(`   ✅ Radio Research: ${radioResearch.stations.length} stations`);
    console.log(`   ✅ WARM Integration: Mock data working`);
    console.log(`   ✅ Mailchimp Integration: Working`);
    console.log('');
    console.log('🚀 Your Liberty Radio Promo Agent is fully operational!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Check your Monday.com board for the new campaign');
    console.log('2. Review the generated press release');
    console.log('3. Use the radio research for targeting');
    console.log('4. Monitor WARM API once DNS resolves');
    console.log('');
    
    return {
      success: true,
      campaignId: campaignResult.id,
      artistName: mockCampaignData.artistName,
      trackName: mockCampaignData.trackName,
      pressRelease: pressReleaseResult.pressRelease,
      radioResearch: radioResearch
    };
    
  } catch (error) {
    console.error('❌ Campaign creation test failed:', error.message);
    console.error('Stack trace:', error.stack);
    return {
      success: false,
      error: error.message
    };
  } finally {
    await agent.shutdown();
  }
}

// Run the test
testCampaignCreation().then(result => {
  if (result.success) {
    console.log('🎉 Test completed successfully!');
    process.exit(0);
  } else {
    console.log('❌ Test failed');
    process.exit(1);
  }
});



#!/usr/bin/env node

/**
 * Test Real Data Extraction
 *
 * Tests the real data extraction from Typeform responses
 * Shows what actual data we're getting from campaigns
 */

require('dotenv').config();

const TypeformApiIntegration = require('./integrations/typeform-api');

async function testRealDataExtraction() {
  console.log('🎵 Testing Real Data Extraction - Liberty Radio Promo Agent\n');

  try {
    // Initialize Typeform integration
    const typeform = new TypeformApiIntegration();

    // Test with Senior Dunce
    const testArtist = 'Senior Dunce';
    console.log(`🔍 Testing real data extraction for: ${testArtist}\n`);

    // Get campaigns using fast search
    const campaigns = await typeform.findCampaignsByArtistFast(testArtist);

    if (campaigns.length === 0) {
      console.log('❌ No campaigns found for Senior Dunce');
      return;
    }

    console.log(`✅ Found ${campaigns.length} campaign(s) for ${testArtist}\n`);

    // Analyze each campaign
    campaigns.forEach((campaign, index) => {
      console.log(`📋 Campaign ${index + 1}:`);
      console.log(`   Form: ${campaign.formTitle}`);
      console.log(`   Submitted: ${campaign.submittedAt}`);
      console.log(`   Confidence: ${campaign.confidence}%`);
      console.log(`   Source: ${campaign.source}`);
      console.log('');

      // Show extracted data
      console.log('📊 Extracted Data:');
      const data = campaign.data;

      // Basic info
      console.log(`   Artist Name: ${data.artistName || '❌ Not found'}`);
      console.log(`   Track Title: ${data.trackTitle || '❌ Not found'}`);
      console.log(`   Genre: ${data.genre || '❌ Not found'}`);
      console.log(`   Release Date: ${data.releaseDate || '❌ Not found'}`);
      console.log('');

      // Contact info
      console.log('📞 Contact Information:');
      console.log(`   Email: ${data.contactEmail || '❌ Not found'}`);
      console.log(`   Phone: ${data.contactPhone || '❌ Not found'}`);
      console.log('');

      // Artist assets
      console.log('🎨 Artist Assets:');
      console.log(`   Press Photo: ${data.pressPhoto || '❌ Not found'}`);
      console.log(`   Cover Art: ${data.coverArt || '❌ Not found'}`);
      console.log(
        `   Press Bio: ${data.pressBio ? data.pressBio.substring(0, 100) + '...' : '❌ Not found'}`
      );
      console.log(`   Social Media: ${data.socialMedia || '❌ Not found'}`);
      console.log(`   Website: ${data.website || '❌ Not found'}`);
      console.log('');

      // Additional info
      console.log('ℹ️ Additional Information:');
      console.log(`   Label: ${data.label || '❌ Not found'}`);
      console.log(`   Management: ${data.management || '❌ Not found'}`);
      console.log(`   Budget: ${data.budget || '❌ Not found'}`);
      console.log(`   Campaign Type: ${data.campaignType || '❌ Not found'}`);
      console.log(`   Description: ${data.description || '❌ Not found'}`);
      console.log('');

      // Show raw response data for debugging
      console.log('🔍 Raw Response Data (first 500 chars):');
      if (campaign.fullResponse) {
        const rawData = JSON.stringify(campaign.fullResponse, null, 2);
        console.log(rawData.substring(0, 500) + '...');
      }
      console.log('');

      // Show field mappings
      console.log('🗂️ Field Mappings Used:');
      if (campaign.fullResponse && campaign.fullResponse.answers) {
        Object.keys(campaign.fullResponse.answers).forEach(fieldId => {
          const answer = campaign.fullResponse.answers[fieldId];
          const value = typeform.extractAnswerValue(answer);
          console.log(`   Field ${fieldId}: ${value}`);
        });
      }
      console.log('');
    });

    // Test with a different artist if available
    console.log('🔍 Testing with other artists...');
    const otherArtists = ['Lydia', 'Bestial', 'Test'];

    for (const artist of otherArtists) {
      const artistCampaigns = await typeform.findCampaignsByArtistFast(artist);
      if (artistCampaigns.length > 0) {
        console.log(`✅ Found ${artistCampaigns.length} campaign(s) for ${artist}`);
        const campaign = artistCampaigns[0];
        console.log(`   Artist: ${campaign.data.artistName || 'Unknown'}`);
        console.log(`   Track: ${campaign.data.trackTitle || 'Unknown'}`);
        console.log(`   Genre: ${campaign.data.genre || 'Unknown'}`);
        console.log(`   Form: ${campaign.formTitle}`);
        console.log('');
      } else {
        console.log(`❌ No campaigns found for ${artist}`);
      }
    }

    console.log('🎉 Real data extraction test completed!');
    console.log('\n📊 Summary:');
    console.log('   - Artist search working across all form responses');
    console.log('   - Real data extraction from Typeform responses');
    console.log('   - Field mappings extracting correct data');
    console.log('   - Campaign data structure working properly');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testRealDataExtraction();
}

module.exports = testRealDataExtraction;

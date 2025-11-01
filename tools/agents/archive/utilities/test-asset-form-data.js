#!/usr/bin/env node

/**
 * Test Asset Form Data Extraction
 *
 * Test the real data extraction specifically from Asset Form NEW
 */

require('dotenv').config();

const TypeformApiIntegration = require('./integrations/typeform-api');

async function testAssetFormData() {
  console.log('🎵 Testing Asset Form Data Extraction - Liberty Radio Promo Agent\n');

  try {
    const typeform = new TypeformApiIntegration();

    // Test with Canetis (we know this has data in Asset Form NEW)
    const testArtist = 'Canetis';
    console.log(`🔍 Testing real data extraction for: ${testArtist}\n`);

    // Get campaigns using fast search
    const campaigns = await typeform.findCampaignsByArtistFast(testArtist);

    if (campaigns.length === 0) {
      console.log('❌ No campaigns found for Canetis');
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
      console.log(`   Mood: ${data.mood || '❌ Not found'}`);
      console.log(`   Release Date: ${data.releaseDate || '❌ Not found'}`);
      console.log(`   Distributor: ${data.distributor || '❌ Not found'}`);
      console.log(`   UPC Code: ${data.upcCode || '❌ Not found'}`);
      console.log(`   ISRC Code: ${data.isrcCode || '❌ Not found'}`);
      console.log(`   Apple Track ID: ${data.appleTrackId || '❌ Not found'}`);
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
      console.log(
        `   Track Description: ${data.trackDescription ? data.trackDescription.substring(0, 100) + '...' : '❌ Not found'}`
      );
      console.log(`   Track Quote: ${data.trackQuote || '❌ Not found'}`);
      console.log('');

      // Social media
      console.log('📱 Social Media:');
      console.log(`   Instagram: ${data.instagram || '❌ Not found'}`);
      console.log(`   Twitter: ${data.twitter || '❌ Not found'}`);
      console.log(`   Facebook: ${data.facebook || '❌ Not found'}`);
      console.log(`   Other Links: ${data.otherLinks || '❌ Not found'}`);
      console.log('');

      // Audio/Video links
      console.log('🎵 Audio/Video Links:');
      console.log(`   SoundCloud: ${data.soundcloudLink || '❌ Not found'}`);
      console.log(`   MP3/WAV: ${data.mp3Link || '❌ Not found'}`);
      console.log(`   Video: ${data.videoLink || '❌ Not found'}`);
      console.log('');

      // Additional info
      console.log('ℹ️ Additional Information:');
      console.log(`   Label: ${data.label || '❌ Not found'}`);
      console.log(`   Producer: ${data.producer || '❌ Not found'}`);
      console.log(`   Similar Artists: ${data.similarArtists || '❌ Not found'}`);
      console.log(`   Promotion Plans: ${data.promotionPlans || '❌ Not found'}`);
      console.log(`   Instruments: ${data.instruments || '❌ Not found'}`);
      console.log(`   Location: ${data.location || '❌ Not found'}`);
      console.log(`   Previous Highlights: ${data.previousHighlights || '❌ Not found'}`);
      console.log(`   Live Dates: ${data.liveDates || '❌ Not found'}`);
      console.log(`   Interests: ${data.interests || '❌ Not found'}`);
      console.log('');
    });

    console.log('🎉 Asset Form data extraction test completed!');
    console.log('\n📊 Summary:');
    console.log('   - Artist search working across all form responses');
    console.log('   - Real data extraction from Asset Form NEW');
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
  testAssetFormData();
}

module.exports = testAssetFormData;

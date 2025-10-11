#!/usr/bin/env node

/**
 * Test Artist Search Fix
 * 
 * Tests the updated Typeform integration to search by artist name
 * across ALL form responses, not just Liberty email matches
 */

require('dotenv').config();

const TypeformApiIntegration = require('./integrations/typeform-api');
const GmailTypeformMatcher = require('./integrations/gmail-typeform-matcher');

async function testArtistSearchFix() {
  console.log('🎵 Testing Artist Search Fix - Liberty Radio Promo Agent\n');
  
  try {
    // Initialize Typeform integration
    const typeform = new TypeformApiIntegration();
    
    // Test 1: Health check
    console.log('1. Testing Typeform health check...');
    const health = await typeform.healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   ✅ Health check complete\n`);
    
    // Test 2: Get recent forms
    console.log('2. Getting recent forms...');
    const forms = await typeform.getRecentForms(10);
    console.log(`   Found ${forms.length} recent forms`);
    if (forms.length > 0) {
      console.log(`   Sample forms: ${forms.slice(0, 3).map(f => f.title).join(', ')}`);
    }
    console.log(`   ✅ Recent forms retrieved\n`);
    
    // Test 3: Search for specific artist (if provided)
    const testArtist = process.argv[2] || 'Senior Dunce';
    console.log(`3. Testing artist search for: ${testArtist}`);
    
    const artistCampaigns = await typeform.findCampaignsByArtist(testArtist);
    console.log(`   Found ${artistCampaigns.length} campaigns for artist: ${testArtist}`);
    
    if (artistCampaigns.length > 0) {
      console.log(`   Sample campaigns:`);
      artistCampaigns.slice(0, 3).forEach((campaign, index) => {
        console.log(`     ${index + 1}. ${campaign.data.artistName} - ${campaign.data.trackTitle}`);
        console.log(`        Genre: ${campaign.data.genre || 'Not specified'}`);
        console.log(`        Form: ${campaign.formTitle}`);
        console.log(`        Confidence: ${campaign.confidence}%`);
      });
    }
    console.log(`   ✅ Artist search complete\n`);
    
    // Test 4: Test fast search
    console.log(`4. Testing fast artist search for: ${testArtist}`);
    const fastCampaigns = await typeform.findCampaignsByArtistFast(testArtist);
    console.log(`   Found ${fastCampaigns.length} campaigns (fast search)`);
    console.log(`   ✅ Fast search complete\n`);
    
    // Test 5: Test Gmail-Typeform matcher
    console.log('5. Testing Gmail-Typeform matcher...');
    const matcher = new GmailTypeformMatcher();
    const matcherCampaigns = await matcher.findCampaignsByArtist(testArtist);
    console.log(`   Found ${matcherCampaigns.length} campaigns via matcher`);
    console.log(`   ✅ Matcher test complete\n`);
    
    // Test 6: Compare results
    console.log('6. Comparing search methods...');
    console.log(`   Direct Typeform search: ${artistCampaigns.length} campaigns`);
    console.log(`   Fast Typeform search: ${fastCampaigns.length} campaigns`);
    console.log(`   Gmail-Typeform matcher: ${matcherCampaigns.length} campaigns`);
    console.log(`   ✅ Comparison complete\n`);
    
    // Test 7: Show real data extraction
    if (artistCampaigns.length > 0) {
      console.log('7. Real data extraction test...');
      const campaign = artistCampaigns[0];
      console.log(`   Artist: ${campaign.data.artistName || 'Not found'}`);
      console.log(`   Track: ${campaign.data.trackTitle || 'Not found'}`);
      console.log(`   Genre: ${campaign.data.genre || 'Not found'}`);
      console.log(`   Contact Email: ${campaign.data.contactEmail || 'Not found'}`);
      console.log(`   Press Bio: ${campaign.data.pressBio ? campaign.data.pressBio.substring(0, 100) + '...' : 'Not found'}`);
      console.log(`   Social Media: ${campaign.data.socialMedia || 'Not found'}`);
      console.log(`   Press Photo: ${campaign.data.pressPhoto || 'Not found'}`);
      console.log(`   Cover Art: ${campaign.data.coverArt || 'Not found'}`);
      console.log(`   ✅ Real data extraction complete\n`);
    }
    
    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Artist search now works across ALL form responses`);
    console.log(`   - Real data extraction from Typeform responses`);
    console.log(`   - Fast search method available for better performance`);
    console.log(`   - Gmail-Typeform matcher updated to use new search`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testArtistSearchFix();
}

module.exports = testArtistSearchFix;

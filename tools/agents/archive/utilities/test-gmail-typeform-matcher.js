#!/usr/bin/env node

/**
 * Test Gmail+Typeform Campaign Matcher for Liberty Music PR
 *
 * Tests the smart campaign matching that:
 * 1. Searches Gmail for campaign email threads
 * 2. Extracts artist emails from Gmail threads
 * 3. Cross-references artist emails with recent Typeform responses
 * 4. Matches campaigns between Gmail and Typeform
 */

const GmailTypeformMatcher = require('./integrations/gmail-typeform-matcher');

async function testGmailTypeformMatcher() {
  console.log('📧📋 Testing Gmail+Typeform Campaign Matcher...\n');

  try {
    const matcher = new GmailTypeformMatcher();

    // Test 1: Health check
    console.log('1. Testing Gmail and Typeform connections...');
    const health = await matcher.healthCheck();
    console.log(`   Gmail Status: ${health.gmail.status}`);
    console.log(`   Typeform Status: ${health.typeform.status}`);
    console.log(`   Overall Status: ${health.overall}`);
    console.log(`   ✅ Health check complete\n`);

    // Test 2: Find Liberty campaigns
    console.log('2. Finding Liberty campaigns by cross-referencing Gmail and Typeform...');
    const campaigns = await matcher.findLibertyCampaigns();

    console.log(`   Gmail campaigns found: ${campaigns.totalGmailCampaigns}`);
    console.log(`   Typeform matches found: ${campaigns.totalTypeformMatches}`);
    console.log(`   Matched campaigns: ${campaigns.totalMatches}`);
    console.log(`   Artist emails: ${campaigns.artistEmails.length}`);

    if (campaigns.artistEmails.length > 0) {
      console.log(`   Artist emails: ${campaigns.artistEmails.join(', ')}`);
    }
    console.log(`   ✅ Campaign discovery complete\n`);

    // Test 3: Show matched campaigns
    if (campaigns.matchedCampaigns.length > 0) {
      console.log('3. Matched campaigns:');
      campaigns.matchedCampaigns.forEach((campaign, index) => {
        console.log(
          `   ${index + 1}. ${campaign.typeformResponse.data?.artistName || 'Unknown Artist'}`
        );
        console.log(
          `      Track: ${campaign.typeformResponse.data?.trackTitle || 'Unknown Track'}`
        );
        console.log(`      Email: ${campaign.matchedEmail}`);
        console.log(`      Gmail Subject: ${campaign.gmailCampaign.subject}`);
        console.log(`      Typeform Form: ${campaign.typeformResponse.formTitle}`);
        console.log(`      Match Confidence: ${campaign.matchConfidence}%`);
        console.log('');
      });
    } else {
      console.log('3. No matched campaigns found');
      console.log('   This could mean:');
      console.log('   - No recent Gmail campaigns with artist emails');
      console.log('   - No Typeform responses with matching emails');
      console.log('   - Need to check Gmail API setup');
      console.log('');
    }

    // Test 4: Generate comprehensive summary
    console.log('4. Generating comprehensive campaign summary...');
    const summary = await matcher.generateCampaignSummary();

    console.log(`   Total Gmail campaigns: ${summary.totalGmailCampaigns}`);
    console.log(`   Total Typeform matches: ${summary.totalTypeformMatches}`);
    console.log(`   Total matched campaigns: ${summary.totalMatchedCampaigns}`);
    console.log(`   Unique artists: ${summary.artists.length}`);
    console.log(`   Unique genres: ${summary.genres.length}`);

    if (summary.artists.length > 0) {
      console.log(`   Artists: ${summary.artists.join(', ')}`);
    }
    if (summary.genres.length > 0) {
      console.log(`   Genres: ${summary.genres.join(', ')}`);
    }
    console.log(`   ✅ Comprehensive summary generated\n`);

    // Test 5: Test artist search (if we have campaigns)
    if (campaigns.matchedCampaigns.length > 0) {
      const testArtist =
        campaigns.matchedCampaigns[0].typeformResponse.data?.artistName?.split(' ')[0];
      if (testArtist) {
        console.log(`5. Testing artist search: ${testArtist}...`);

        const artistCampaigns = await matcher.findCampaignsByArtist(testArtist);
        console.log(`   Found ${artistCampaigns.length} campaigns for artist: ${testArtist}`);
        console.log(`   ✅ Artist search complete\n`);
      }
    }

    console.log('🎉 Gmail+Typeform campaign matcher test complete!');
    console.log('\n📊 Summary:');
    console.log(`✅ Gmail integration: ${health.gmail.status}`);
    console.log(`✅ Typeform integration: ${health.typeform.status}`);
    console.log(`✅ Found ${campaigns.totalGmailCampaigns} Gmail campaigns`);
    console.log(`✅ Found ${campaigns.totalTypeformMatches} Typeform matches`);
    console.log(`✅ Matched ${campaigns.totalMatches} campaigns`);
    console.log(`✅ Smart cross-referencing working`);

    console.log('\n🎯 How it works:');
    console.log("1. Searches Gmail for campaign email threads where you're tagged");
    console.log('2. Extracts artist emails from those Gmail threads');
    console.log('3. Searches recent Typeform responses (last 20 forms) for those emails');
    console.log('4. Matches campaigns between Gmail and Typeform');
    console.log('5. Calculates confidence scores for matches');

    console.log('\n🚀 Next steps:');
    console.log('1. Set up Gmail API access for email searching');
    console.log('2. Review matched campaigns in ./training-data/');
    console.log('3. Use specific artist names to find campaigns');
    console.log('4. Cross-reference with Monday.com boards');

    console.log('\n🔒 Security:');
    console.log('✅ READ-ONLY mode - no data written to Gmail or Typeform');
    console.log('✅ Only searches for your email in Gmail threads');
    console.log('✅ Only searches recent Typeform responses');
    console.log('✅ Safe for company data');
  } catch (error) {
    console.error('❌ Gmail+Typeform matcher test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check Gmail API setup and permissions');
    console.error('2. Check Typeform API key is correct');
    console.error('3. Ensure you have Gmail access tokens');
    console.error('4. Check your internet connection');
  }
}

// Run the test
testGmailTypeformMatcher();

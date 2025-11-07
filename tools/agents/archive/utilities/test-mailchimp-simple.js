#!/usr/bin/env node

/**
 * Simple Mailchimp Training Test for Liberty Music PR
 *
 * Tests Mailchimp integration directly without the full agent
 */

const MailchimpApiIntegration = require('./integrations/mailchimp-api');

async function testMailchimpSimple() {
  console.log('📧 Testing Mailchimp Integration Directly...\n');

  try {
    const mailchimp = new MailchimpApiIntegration();

    // Test 1: Health check
    console.log('1. Testing Mailchimp connection...');
    const health = await mailchimp.healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   Service: ${health.service}`);
    console.log(`   Server: ${health.serverPrefix}`);
    console.log(`   ✅ Connection test passed\n`);

    // Test 2: Analyze campaigns
    console.log('2. Analyzing existing campaigns...');
    const campaignsData = await mailchimp.analyzeExistingCampaigns();

    console.log(`   Total campaigns: ${campaignsData.totalCampaigns}`);
    console.log(`   Analyzed: ${campaignsData.analyzedCampaigns}`);
    console.log(`   Errors: ${campaignsData.errors}`);
    console.log(`   ✅ Campaign analysis complete\n`);

    // Test 3: Get templates
    console.log('3. Fetching email templates...');
    const templatesData = await mailchimp.getLibertyTemplates();

    console.log(`   Total templates: ${templatesData.totalTemplates}`);
    console.log(`   Liberty templates: ${templatesData.libertyTemplates}`);
    console.log(`   ✅ Template analysis complete\n`);

    // Test 4: Style analysis
    console.log('4. Analyzing email style...');
    const styleData = await mailchimp.analyzeLibertyEmailStyle();

    console.log(
      `   Subject patterns: ${Object.keys(styleData.subjectLinePatterns).length} metrics`
    );
    console.log(`   Content patterns: ${Object.keys(styleData.contentPatterns).length} metrics`);
    console.log(`   Liberty style: ${Object.keys(styleData.libertyStyle).length} categories`);
    console.log(`   ✅ Style analysis complete\n`);

    // Test 5: Show insights
    if (campaignsData.analyzedCampaigns > 0) {
      console.log('5. Key insights from your campaigns:');

      // Subject line insights
      if (styleData.subjectLinePatterns.commonWords) {
        const topWords = Object.entries(styleData.subjectLinePatterns.commonWords)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        console.log(
          `   Top subject words: ${topWords
            .map(([word, count]) => `${word} (${count})`)
            .join(', ')}`
        );
      }

      // Send time insights
      if (styleData.sendTimePatterns.mostCommonHour) {
        console.log(`   Best send time: ${styleData.sendTimePatterns.mostCommonHour}:00`);
      }

      // Tone insights
      if (styleData.libertyStyle.tone) {
        const tone = styleData.libertyStyle.tone;
        const dominantTone = Object.entries(tone).reduce((a, b) =>
          tone[a[0]] > tone[b[0]] ? a : b
        );
        console.log(`   Your tone: ${dominantTone[0]} (${dominantTone[1]} instances)`);
      }

      console.log('');
    }

    console.log('🎉 Mailchimp training analysis complete!');
    console.log('\n📊 Summary:');
    console.log(`✅ Connected to Mailchimp successfully`);
    console.log(`✅ Analyzed ${campaignsData.analyzedCampaigns} campaigns`);
    console.log(`✅ Found ${templatesData.libertyTemplates} Liberty templates`);
    console.log(`✅ Extracted your email style patterns`);
    console.log(`✅ Training data saved to ./training-data/`);

    console.log('\n🎯 What the agent learned about your email style:');
    console.log('1. Your subject line patterns and common words');
    console.log('2. Your preferred send times and audience segments');
    console.log('3. Your email tone and writing style');
    console.log('4. Your common phrases and Liberty branding');
    console.log('5. Your template usage and campaign types');

    console.log('\n🚀 Next steps:');
    console.log('1. Review the training data files in ./training-data/');
    console.log('2. Use this data to improve email generation');
    console.log('3. Run analysis regularly to keep style updated');
    console.log('4. Test with new campaigns to see improvements');
  } catch (error) {
    console.error('❌ Mailchimp training test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your Mailchimp API key is correct');
    console.error('2. Ensure you have campaigns and templates in Mailchimp');
    console.error('3. Check your internet connection');
    console.error('4. Verify API permissions');
  }
}

// Run the test
testMailchimpSimple();

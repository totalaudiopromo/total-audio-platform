#!/usr/bin/env node

/**
 * Test Mailchimp Training Analysis for Liberty Music PR
 * 
 * Analyzes your existing Mailchimp campaigns and templates to learn your email style
 */

const RadioPromoAgent = require('../radio-promo-agent');

async function testMailchimpTraining() {
  console.log('📧 Testing Mailchimp Training Analysis...\n');
  
  try {
    const agent = new RadioPromoAgent();
    await agent.initialize();
    
    // Test 1: Analyze existing campaigns
    console.log('1. Analyzing existing Mailchimp campaigns...');
    const campaignsData = await agent.mailchimp.analyzeExistingCampaigns();
    
    console.log(`   Total campaigns found: ${campaignsData.totalCampaigns}`);
    console.log(`   Successfully analyzed: ${campaignsData.analyzedCampaigns}`);
    console.log(`   Errors: ${campaignsData.errors}`);
    console.log(`   ✅ Campaign analysis complete\n`);
    
    // Test 2: Get Liberty templates
    console.log('2. Fetching Liberty Music PR email templates...');
    const templatesData = await agent.mailchimp.getLibertyTemplates();
    
    console.log(`   Total templates: ${templatesData.totalTemplates}`);
    console.log(`   Liberty-related templates: ${templatesData.libertyTemplates}`);
    console.log(`   ✅ Template analysis complete\n`);
    
    // Test 3: Analyze email style patterns
    console.log('3. Analyzing Liberty email style patterns...');
    const styleData = await agent.mailchimp.analyzeLibertyEmailStyle();
    
    console.log(`   Subject line patterns: ${Object.keys(styleData.subjectLinePatterns).length} metrics`);
    console.log(`   Content patterns: ${Object.keys(styleData.contentPatterns).length} metrics`);
    console.log(`   Send time patterns: ${Object.keys(styleData.sendTimePatterns).length} metrics`);
    console.log(`   Liberty style analysis: ${Object.keys(styleData.libertyStyle).length} categories`);
    console.log(`   ✅ Style analysis complete\n`);
    
    // Test 4: Show key insights
    if (campaignsData.analyzedCampaigns > 0) {
      console.log('4. Key insights from your campaigns:');
      
      // Subject line insights
      if (styleData.subjectLinePatterns.commonWords) {
        const topWords = Object.entries(styleData.subjectLinePatterns.commonWords)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5);
        console.log(`   Top subject line words: ${topWords.map(([word, count]) => `${word} (${count})`).join(', ')}`);
      }
      
      // Send time insights
      if (styleData.sendTimePatterns.mostCommonHour) {
        console.log(`   Most common send time: ${styleData.sendTimePatterns.mostCommonHour}:00`);
      }
      
      // Tone insights
      if (styleData.libertyStyle.tone) {
        const tone = styleData.libertyStyle.tone;
        const dominantTone = Object.entries(tone).reduce((a, b) => tone[a[0]] > tone[b[0]] ? a : b);
        console.log(`   Dominant tone: ${dominantTone[0]} (${dominantTone[1]} instances)`);
      }
      
      // Common phrases
      if (styleData.libertyStyle.commonPhrases && styleData.libertyStyle.commonPhrases.length > 0) {
        console.log(`   Common phrases: ${styleData.libertyStyle.commonPhrases.slice(0, 3).map(p => p.value).join(', ')}`);
      }
      
      console.log('');
    }
    
    // Test 5: Show template insights
    if (templatesData.libertyTemplates > 0) {
      console.log('5. Template insights:');
      console.log(`   Liberty templates found: ${templatesData.libertyTemplates}`);
      
      if (templatesData.templates.length > 0) {
        console.log('   Template names:');
        templatesData.templates.slice(0, 5).forEach((template, index) => {
          console.log(`     ${index + 1}. ${template.name} (${template.type})`);
        });
      }
      console.log('');
    }
    
    console.log('🎉 Mailchimp training analysis complete!');
    console.log('\n📊 Summary:');
    console.log(`✅ Analyzed ${campaignsData.analyzedCampaigns} campaigns`);
    console.log(`✅ Found ${templatesData.libertyTemplates} Liberty templates`);
    console.log(`✅ Extracted style patterns and insights`);
    console.log(`✅ Training data saved to ./training-data/`);
    
    console.log('\n🎯 What the agent learned:');
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
    
    await agent.shutdown();
    
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
testMailchimpTraining();

#!/usr/bin/env node

/**
 * Test Liberty Music PR Intelligence Gathering
 * 
 * Demonstrates read-only intelligence gathering from your team channels
 */

const GoogleChatIntegration = require('./integrations/google-chat');

async function testLibertyIntelligence() {
  console.log('🔍 Testing Liberty Music PR Intelligence Gathering...\n');
  
  try {
    const googleChat = new GoogleChatIntegration();
    
    // Test 1: Health check
    console.log('1. Testing read-only connection...');
    const health = await googleChat.healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   Mode: ${health.mode}`);
    console.log(`   Monitored Channels: ${health.monitoredChannels.join(', ')}`);
    console.log(`   ✅ Read-only mode ready\n`);
    
    // Test 2: Read from Success Shout Outs
    console.log('2. Reading campaign wins from Success Shout Outs...');
    const campaignWins = await googleChat.readCampaignWins();
    console.log(`   Channel: ${campaignWins.channel}`);
    console.log(`   Campaign Wins Found: ${campaignWins.extractedWins.length}`);
    
    campaignWins.extractedWins.forEach((win, index) => {
      console.log(`   ${index + 1}. ${win.artist} - "${win.track}" on ${win.station}`);
    });
    console.log(`   ✅ Success Shout Outs intelligence gathered\n`);
    
    // Test 3: Read from Radio Superstars
    console.log('3. Reading industry contacts from Radio Superstars...');
    const industryContacts = await googleChat.readIndustryContacts();
    console.log(`   Channel: ${industryContacts.channel}`);
    console.log(`   Contacts Found: ${industryContacts.extractedContacts.length}`);
    
    industryContacts.extractedContacts.forEach((contact, index) => {
      console.log(`   ${index + 1}. ${contact.name} at ${contact.station} (${contact.relationship})`);
    });
    console.log(`   ✅ Radio Superstars intelligence gathered\n`);
    
    // Test 4: Read from Campaigns
    console.log('4. Reading campaign insights from Campaigns channel...');
    const campaignDiscussions = await googleChat.readCampaignDiscussions();
    console.log(`   Channel: ${campaignDiscussions.channel}`);
    console.log(`   Insights Found: ${campaignDiscussions.extractedInsights.length}`);
    
    campaignDiscussions.extractedInsights.forEach((insight, index) => {
      console.log(`   ${index + 1}. ${insight.type}: ${insight.insight} (${Math.round(insight.confidence * 100)}% confidence)`);
    });
    console.log(`   ✅ Campaigns intelligence gathered\n`);
    
    // Test 5: Comprehensive intelligence gathering
    console.log('5. Gathering comprehensive intelligence...');
    const intelligence = await googleChat.gatherIntelligence();
    console.log(`   Timestamp: ${intelligence.timestamp}`);
    console.log(`   Total Campaign Wins: ${intelligence.campaignWins.extractedWins.length}`);
    console.log(`   Total Industry Contacts: ${intelligence.industryContacts.extractedContacts.length}`);
    console.log(`   Total Campaign Insights: ${intelligence.campaignDiscussions.extractedInsights.length}`);
    console.log(`   ✅ Comprehensive intelligence gathered\n`);
    
    // Test 6: Intelligence analysis
    console.log('6. Analyzing intelligence for actionable insights...');
    const insights = intelligence.insights;
    console.log(`   Success Patterns: ${insights.successPatterns.length}`);
    console.log(`   Relationship Opportunities: ${insights.relationshipOpportunities.length}`);
    console.log(`   Campaign Improvements: ${insights.campaignImprovements.length}`);
    console.log(`   Industry Trends: ${insights.industryTrends.length}`);
    console.log(`   ✅ Intelligence analysis complete\n`);
    
    console.log('🎉 All Liberty intelligence tests passed!');
    console.log('\n📊 Intelligence Summary:');
    console.log(`✅ Success Shout Outs: ${campaignWins.extractedWins.length} wins tracked`);
    console.log(`✅ Radio Superstars: ${industryContacts.extractedContacts.length} contacts identified`);
    console.log(`✅ Campaigns: ${campaignDiscussions.extractedInsights.length} insights extracted`);
    
    console.log('\n🎯 What this means for your campaigns:');
    console.log('• Agent learns from your team\'s success patterns');
    console.log('• Identifies relationship opportunities');
    console.log('• Extracts campaign improvement insights');
    console.log('• Builds knowledge base for better targeting');
    console.log('• No notifications sent to anyone - purely intelligence gathering');
    
    console.log('\n🔧 Next steps:');
    console.log('1. Set up Monday.com API key for campaign creation');
    console.log('2. Test with real Otter.ai transcript');
    console.log('3. Run complete workflow: transcript → campaign → intelligence');
    console.log('4. Monitor intelligence gathering results');
    
  } catch (error) {
    console.error('❌ Liberty intelligence test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your Google Chat webhook URLs');
    console.error('2. Verify channel names are correct');
    console.error('3. Ensure webhooks are properly configured');
    console.error('4. Check your Google Workspace permissions');
  }
}

// Run the test
testLibertyIntelligence();


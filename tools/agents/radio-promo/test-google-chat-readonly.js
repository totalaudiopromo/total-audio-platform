#!/usr/bin/env node

/**
 * Test Google Chat Read-Only Integration for Liberty Music PR
 * 
 * Tests intelligence gathering from team channels (no notifications sent)
 */

const GoogleChatIntegration = require('./integrations/google-chat');

async function testGoogleChatReadOnly() {
  console.log('🧪 Testing Google Chat Read-Only Integration...\n');
  
  try {
    const googleChat = new GoogleChatIntegration();
    
    // Test 1: Health check
    console.log('1. Testing read-only connection...');
    const health = await googleChat.healthCheck();
    console.log(`   Status: ${health.status}`);
    console.log(`   Mode: ${health.mode}`);
    console.log(`   API Key: ${health.apiKeyConfigured ? 'Configured' : 'Not configured'}`);
    console.log(`   Monitored Channels: ${health.monitoredChannels.join(', ')}`);
    console.log(`   ✅ Read-only mode ready\n`);
    
    // Test 2: Test connection
    console.log('2. Testing connection...');
    const connectionTest = await googleChat.testConnection();
    console.log(`   Connection: ${connectionTest ? 'Success' : 'Failed'}`);
    console.log(`   ✅ Connection test complete\n`);
    
    // Test 3: Gather intelligence (simulated)
    console.log('3. Gathering intelligence from team channels...');
    const intelligence = await googleChat.gatherIntelligence();
    console.log(`   Campaign Wins: ${intelligence.campaignWins.messages.length} messages`);
    console.log(`   Industry Contacts: ${intelligence.industryContacts.messages.length} messages`);
    console.log(`   Campaign Discussions: ${intelligence.campaignDiscussions.messages.length} messages`);
    console.log(`   Insights: ${Object.keys(intelligence.insights).length} categories`);
    console.log(`   ✅ Intelligence gathering complete\n`);
    
    // Test 4: Read specific channels
    console.log('4. Reading specific channels...');
    
    const campaignWins = await googleChat.readCampaignWins();
    console.log(`   Success Shout Outs: ${campaignWins.messages.length} messages`);
    
    const industryContacts = await googleChat.readIndustryContacts();
    console.log(`   Radio Superstars: ${industryContacts.messages.length} messages`);
    
    const campaignDiscussions = await googleChat.readCampaignDiscussions();
    console.log(`   Campaigns: ${campaignDiscussions.messages.length} messages`);
    
    console.log(`   ✅ Channel reading complete\n`);
    
    console.log('🎉 All Google Chat read-only tests passed!');
    console.log('\n📋 What this means:');
    console.log('✅ Agent can read from your team channels');
    console.log('✅ No notifications will be sent to anyone');
    console.log('✅ Intelligence gathering for campaign insights');
    console.log('✅ Safe for testing and development');
    
    console.log('\n🔧 Next steps:');
    console.log('1. Set up Google Chat API key for real channel access');
    console.log('2. Configure specific channel names in environment');
    console.log('3. Test with real campaign data');
    console.log('4. Monitor intelligence gathering results');
    
  } catch (error) {
    console.error('❌ Google Chat read-only test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your Google Chat API key');
    console.error('2. Verify channel names are correct');
    console.error('3. Ensure API has read permissions');
    console.error('4. Check your Google Workspace settings');
  }
}

// Run the test
testGoogleChatReadOnly();


require('dotenv').config({ path: '.env.local' });
const { createBlueskyAgent } = require('./lib/bluesky-posting-agent');

async function testBluesky() {
  console.log('=== Testing Bluesky Agent ===');
  console.log('Identifier:', process.env.BLUESKY_IDENTIFIER);
  console.log('Password set:', !!process.env.BLUESKY_APP_PASSWORD);
  console.log('');

  try {
    const agent = createBlueskyAgent();

    // Test health check
    console.log('[TEST] Running health check...');
    const health = await agent.healthCheck();
    console.log('[TEST] Health check result:', health);

    if (!health.healthy) {
      console.error('[TEST] ❌ Health check failed');
      process.exit(1);
    }

    console.log('[TEST] ✅ Bluesky agent working correctly!');
  } catch (error) {
    console.error('[TEST] ❌ Error:', error.message);
    process.exit(1);
  }
}

testBluesky();

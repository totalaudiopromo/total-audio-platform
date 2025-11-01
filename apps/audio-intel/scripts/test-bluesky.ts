/**
 * Test Bluesky Agent
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { createBlueskyAgent } from '../lib/bluesky-posting-agent';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

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
      console.error('[TEST] ❌ Health check failed:', health.error);
      process.exit(1);
    }

    console.log('[TEST] ✅ Bluesky agent working correctly!');
  } catch (error) {
    console.error('[TEST] ❌ Error:', error instanceof Error ? error.message : error);
    console.error('Stack:', error);
    process.exit(1);
  }
}

testBluesky();

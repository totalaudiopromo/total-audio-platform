/**
 * Simple LinkedIn Test
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { createLinkedInAgent } from '../lib/linkedin-posting-agent';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testLinkedIn() {
  console.log('=== Testing LinkedIn Agent ===');
  console.log('Client ID:', process.env.LINKEDIN_CLIENT_ID);
  console.log('Client Secret set:', !!process.env.LINKEDIN_CLIENT_SECRET);
  console.log('Access Token set:', !!process.env.LINKEDIN_ACCESS_TOKEN);
  console.log('');

  try {
    const agent = createLinkedInAgent();

    console.log('[TEST] Running health check...');
    const health = await agent.healthCheck();
    console.log('[TEST] Health check result:', health);

    if (!health.healthy) {
      console.error('[TEST] ❌ Health check failed');
      process.exit(1);
    }

    console.log('[TEST] ✅ LinkedIn agent working correctly!');

  } catch (error) {
    console.error('[TEST] ❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testLinkedIn();

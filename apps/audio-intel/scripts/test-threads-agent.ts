#!/usr/bin/env tsx
/**
 * Threads Posting Agent Test Script
 *
 * Tests the Threads API integration with health checks and sample posts
 *
 * Usage:
 *   npx tsx scripts/test-threads-agent.ts
 *
 * Prerequisites:
 *   - THREADS_USER_ID in .env.local
 *   - THREADS_ACCESS_TOKEN in .env.local
 */

import { createThreadsAgent } from '../lib/threads-posting-agent';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

async function testThreadsAgent() {
  console.log('============================================');
  console.log('Threads API Integration Test');
  console.log('============================================\n');

  // Check environment variables
  console.log('1. Checking environment variables...');
  const userId = process.env.THREADS_USER_ID;
  const accessToken = process.env.THREADS_ACCESS_TOKEN;

  if (!userId || !accessToken) {
    console.error('❌ Missing required environment variables:');
    if (!userId) console.error('   - THREADS_USER_ID not set');
    if (!accessToken) console.error('   - THREADS_ACCESS_TOKEN not set');
    console.error('\nPlease configure these in .env.local');
    console.error('See .env.threads.example for template\n');
    process.exit(1);
  }

  console.log('✅ Environment variables configured');
  console.log(`   User ID: ${userId}`);
  console.log(`   Token: ${accessToken.substring(0, 20)}...`);
  console.log();

  try {
    // Initialize agent
    console.log('2. Creating Threads agent...');
    const agent = createThreadsAgent();
    console.log('✅ Agent created successfully\n');

    // Health check
    console.log('3. Running health check...');
    const health = await agent.healthCheck();

    if (!health.healthy) {
      console.error('❌ Health check failed:', health.error);
      console.error('\nPossible issues:');
      console.error('   - Access token expired or invalid');
      console.error('   - Instagram account not Professional');
      console.error('   - Missing Threads API permissions');
      console.error('   - User ID does not match token\n');
      process.exit(1);
    }

    console.log('✅ Health check passed - API is accessible\n');

    // Get account insights
    console.log('4. Fetching account insights...');
    const insights = await agent.getAccountInsights();

    if (insights.success && insights.insights) {
      console.log('✅ Account insights retrieved:');
      console.log('   Views:', insights.insights.views || 'N/A');
      console.log('   Likes:', insights.insights.likes || 'N/A');
      console.log('   Replies:', insights.insights.replies || 'N/A');
      console.log('   Followers:', insights.insights.followers || 'N/A');
    } else {
      console.log('⚠️  Could not retrieve insights:', insights.error);
    }
    console.log();

    // Test content retrieval
    console.log('5. Testing content retrieval...');
    const testTitle = 'The Real Problem';
    const content = agent.getContentByTitle(testTitle);

    if (!content) {
      console.error(`❌ No content found for: "${testTitle}"`);
      process.exit(1);
    }

    console.log(`✅ Content retrieved for: "${testTitle}"`);
    console.log(`   Length: ${content.length} characters`);
    console.log(`   Preview: ${content.substring(0, 100)}...`);
    console.log();

    // Ask for confirmation before posting
    console.log('6. Ready to test posting');
    console.log('⚠️  WARNING: This will create a REAL post on Threads!');
    console.log();
    console.log('Test post preview:');
    console.log('─────────────────────────────────────────');
    console.log('🧪 TEST POST - Audio Intel Threads Integration');
    console.log();
    console.log('Testing the autonomous posting system for Audio Intel social media automation.');
    console.log();
    console.log('This is a test post and will be deleted shortly.');
    console.log();
    console.log('#AudioIntel #TestPost');
    console.log('─────────────────────────────────────────');
    console.log();

    // Note: For actual posting, uncomment the section below
    console.log('⏸️  Posting test skipped (safety check)');
    console.log();
    console.log('To enable test posting:');
    console.log('1. Review the test post content above');
    console.log('2. Edit scripts/test-threads-agent.ts');
    console.log('3. Uncomment the posting section');
    console.log('4. Run the test again');
    console.log();

    /*
    // UNCOMMENT THIS SECTION TO ENABLE TEST POSTING
    console.log('Posting in 5 seconds... (Ctrl+C to cancel)');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const testPost = `🧪 TEST POST - Audio Intel Threads Integration

Testing the autonomous posting system for Audio Intel social media automation.

This is a test post and will be deleted shortly.

#AudioIntel #TestPost`;

    console.log('Posting to Threads...');
    const result = await agent.post(testPost);

    if (result.success) {
      console.log('✅ Test post published successfully!');
      console.log(`   Post ID: ${result.postId}`);
      console.log(`   URL: https://threads.net/t/${result.postId}`);
    } else {
      console.error('❌ Post failed:', result.error);
      process.exit(1);
    }
    */

    console.log('============================================');
    console.log('✅ All tests completed successfully!');
    console.log('============================================\n');

    console.log('Next steps:');
    console.log('1. Review THREADS_API_SETUP.md for production setup');
    console.log('2. Configure content calendar scheduling');
    console.log('3. Set up Vercel cron for automated posting');
    console.log('4. Monitor posting logs and insights\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);

    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }

    console.error('\nTroubleshooting:');
    console.error('1. Check THREADS_API_SETUP.md for setup instructions');
    console.error('2. Verify access token is valid and not expired');
    console.error('3. Ensure Instagram account is Professional');
    console.error('4. Check Meta Developer app configuration\n');

    process.exit(1);
  }
}

// Run tests
testThreadsAgent();

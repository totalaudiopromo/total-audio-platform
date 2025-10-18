/**
 * Twitter Posting Agent - Usage Examples
 *
 * This file demonstrates how to use the Twitter posting agent
 * for Audio Intel social media automation.
 */

import { createTwitterAgent, TwitterPostingAgent } from '../twitter-posting-agent';
import contentCalendar from '../../social-content/CONTENT_CALENDAR.json';

/**
 * Example 1: Post a single tweet
 */
async function exampleSingleTweet() {
  try {
    const agent = createTwitterAgent();

    // Authenticate
    const authenticated = await agent.authenticate();
    if (!authenticated) {
      console.error('Failed to authenticate with Twitter');
      return;
    }

    // Post a single tweet
    const result = await agent.post(
      'After 5+ years promoting music to UK radio, I was spending 15+ hours weekly researching contacts.\n\n' +
      'Built Audio Intel to solve this properly. Now it takes 2 minutes instead of 15 hours.\n\n' +
      'intel.totalaudiopromo.com'
    );

    if (result.success) {
      console.log('✅ Tweet posted successfully!');
      console.log('Tweet ID:', result.id);
    } else {
      console.error('❌ Failed to post tweet:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 2: Post a thread
 */
async function exampleThread() {
  try {
    const agent = createTwitterAgent();

    // Authenticate
    const authenticated = await agent.authenticate();
    if (!authenticated) {
      console.error('Failed to authenticate with Twitter');
      return;
    }

    // Get content from agent's content map
    const content = agent.getContentByTitle('The Brighton Producer Story');

    if (!content) {
      console.error('Content not found');
      return;
    }

    // Post thread
    const result = await agent.postThread(content);

    if (result.success) {
      console.log('✅ Thread posted successfully!');
      console.log(`Posted ${result.count} tweets`);
      console.log('Tweet IDs:', result.ids);
    } else {
      console.error('❌ Failed to post thread:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 3: Process scheduled posts from content calendar
 */
async function exampleScheduledPosts() {
  try {
    const agent = createTwitterAgent();

    // Process scheduled posts
    const results = await agent.processScheduledPosts(contentCalendar.schedule);

    console.log('\n📊 Results:');
    console.log(`✅ Posted: ${results.posted}`);
    console.log(`⏭️  Skipped: ${results.skipped}`);
    console.log(`❌ Failed: ${results.failed}`);

    console.log('\n📝 Details:');
    results.details.forEach(detail => {
      console.log(`\n${detail.status === 'posted' ? '✅' : '❌'} ${detail.title}`);
      if (detail.status === 'posted' && detail.count) {
        console.log(`   Thread: ${detail.count} tweets`);
        console.log(`   IDs: ${detail.ids?.join(', ')}`);
      } else if (detail.error) {
        console.log(`   Error: ${detail.error}`);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 4: Health check
 */
async function exampleHealthCheck() {
  try {
    const agent = createTwitterAgent();

    const health = await agent.healthCheck();

    if (health.healthy) {
      console.log('✅ Twitter agent is healthy and ready to post');
    } else {
      console.error('❌ Twitter agent health check failed:', health.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example 5: List available content
 */
function exampleListContent() {
  const agent = createTwitterAgent();

  const contentTitles = [
    'The 2AM Reality',
    'The Contact Intelligence Reality',
    'The Brighton Producer Story',
    'The Submission Window Problem',
    'The Cost Reality',
    'The Response Rate Breakthrough'
  ];

  console.log('📝 Available Twitter content:\n');

  contentTitles.forEach((title, index) => {
    const content = agent.getContentByTitle(title);
    if (content) {
      const tweetCount = content.split(/\n\n+/).length;
      console.log(`${index + 1}. ${title} (${tweetCount} tweets)`);
    }
  });
}

// Run examples
async function main() {
  console.log('🐦 Twitter Posting Agent Examples\n');
  console.log('=================================\n');

  // Uncomment the example you want to run:

  // await exampleSingleTweet();
  // await exampleThread();
  // await exampleScheduledPosts();
  // await exampleHealthCheck();
  exampleListContent();
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  exampleSingleTweet,
  exampleThread,
  exampleScheduledPosts,
  exampleHealthCheck,
  exampleListContent
};

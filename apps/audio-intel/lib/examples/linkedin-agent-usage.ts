/**
 * LinkedIn Posting Agent - Usage Examples
 *
 * Demonstrates how to use the LinkedIn autonomous posting agent
 * for Audio Intel social media automation
 */

import { createLinkedInAgent } from '../linkedin-posting-agent';
import contentCalendar from '../../social-content/CONTENT_CALENDAR.json';

/**
 * Example 1: Simple Post
 * Post a single message to LinkedIn
 */
export async function exampleSimplePost() {
  console.log('\n=== Example 1: Simple Post ===\n');

  const agent = createLinkedInAgent();

  // Authenticate
  const authenticated = await agent.authenticate();
  if (!authenticated) {
    console.error('❌ Authentication failed');
    return;
  }

  // Post a message
  const message = `Just finished a radio campaign using Audio Intel instead of manual research.

The time difference was staggering:

Manual approach: 15+ hours researching contacts
Audio Intel approach: 3 minutes

The music industry needs tools built by people who actually use them daily.

https://intel.totalaudiopromo.com?utm_source=linkedin&utm_medium=social&utm_campaign=test_post

#MusicIndustry #RadioPromotion #MusicTech`;

  const result = await agent.post(message);

  if (result.success) {
    console.log('✅ Post successful!');
    console.log('Post ID:', result.postId);
  } else {
    console.error('❌ Post failed:', result.error);
  }
}

/**
 * Example 2: Post from Content Calendar
 * Use pre-written content mapped by title
 */
export async function examplePostFromCalendar() {
  console.log('\n=== Example 2: Post from Content Calendar ===\n');

  const agent = createLinkedInAgent();

  // Authenticate
  await agent.authenticate();

  // Get content by title
  const content = agent.getContentByTitle('The 15-Hour Problem');

  if (!content) {
    console.error('❌ Content not found');
    return;
  }

  console.log('📝 Content preview:', content.substring(0, 100) + '...');

  // Post to LinkedIn
  const result = await agent.post(content);

  if (result.success) {
    console.log('✅ Posted successfully!');
    console.log('Post ID:', result.postId);
  } else {
    console.error('❌ Post failed:', result.error);
  }
}

/**
 * Example 3: Process Scheduled Posts
 * Automatically post content based on content calendar schedule
 */
export async function exampleProcessScheduledPosts() {
  console.log('\n=== Example 3: Process Scheduled Posts ===\n');

  const agent = createLinkedInAgent();

  // Process scheduled posts from content calendar
  const results = await agent.processScheduledPosts(contentCalendar.schedule);

  console.log('\n📊 Results Summary:');
  console.log(`✅ Posted: ${results.posted}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`❌ Failed: ${results.failed}`);

  console.log('\n📋 Details:');
  results.details.forEach(detail => {
    const emoji = detail.status === 'posted' ? '✅' : detail.status === 'skipped' ? '⏭️' : '❌';
    console.log(`${emoji} ${detail.title} - ${detail.status}`);
    if (detail.postId) {
      console.log(`   Post ID: ${detail.postId}`);
    }
    if (detail.error) {
      console.log(`   Error: ${detail.error}`);
    }
  });
}

/**
 * Example 4: Health Check
 * Verify authentication and API connectivity
 */
export async function exampleHealthCheck() {
  console.log('\n=== Example 4: Health Check ===\n');

  const agent = createLinkedInAgent();

  const health = await agent.healthCheck();

  if (health.healthy) {
    console.log('✅ LinkedIn agent is healthy and authenticated');
  } else {
    console.error('❌ LinkedIn agent health check failed');
    console.error('Error:', health.error);
  }
}

/**
 * Example 5: Token Refresh
 * Refresh expired access token using refresh token
 */
export async function exampleTokenRefresh() {
  console.log('\n=== Example 5: Token Refresh ===\n');

  const agent = createLinkedInAgent();

  const refreshResult = await agent.refreshAccessToken();

  if (refreshResult.success) {
    console.log('✅ Access token refreshed successfully');
    console.log('New access token:', refreshResult.accessToken?.substring(0, 20) + '...');
    console.log('\n⚠️  Important: Update your .env.local with the new access token');
  } else {
    console.error('❌ Token refresh failed');
    console.error('Error:', refreshResult.error);
  }
}

/**
 * Example 6: Character Limit Handling
 * Demonstrates automatic truncation for posts exceeding 3000 characters
 */
export async function exampleCharacterLimit() {
  console.log('\n=== Example 6: Character Limit Handling ===\n');

  const agent = createLinkedInAgent();
  await agent.authenticate();

  // Create a long post (>3000 characters)
  const longContent = `
Just finished a comprehensive analysis of UK radio promotion strategies.

${'Here is a lot of detailed information about radio promotion. '.repeat(200)}

This demonstrates the automatic truncation feature.

#MusicIndustry #RadioPromotion
  `.trim();

  console.log(`📏 Content length: ${longContent.length} characters`);

  const result = await agent.post(longContent);

  if (result.success) {
    console.log('✅ Post successful (automatically truncated to 3000 characters)');
    console.log('Post ID:', result.postId);
  } else {
    console.error('❌ Post failed:', result.error);
  }
}

/**
 * Example 7: Batch Posting with Rate Limiting
 * Post multiple items from content calendar with automatic delays
 */
export async function exampleBatchPosting() {
  console.log('\n=== Example 7: Batch Posting ===\n');

  const agent = createLinkedInAgent();
  await agent.authenticate();

  const postsToPublish = [
    'The 15-Hour Problem',
    'The Pricing Reality',
    'The Response Rate Problem'
  ];

  for (const title of postsToPublish) {
    console.log(`\n📤 Posting: ${title}`);

    const content = agent.getContentByTitle(title);
    if (!content) {
      console.error(`❌ Content not found for: ${title}`);
      continue;
    }

    const result = await agent.post(content);

    if (result.success) {
      console.log(`✅ Posted successfully: ${result.postId}`);
    } else {
      console.error(`❌ Failed: ${result.error}`);
    }

    // Rate limiting: wait 2 seconds between posts
    console.log('⏳ Waiting 2 seconds before next post...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n✅ Batch posting complete');
}

/**
 * Example 8: Content Preview
 * Preview content before posting
 */
export async function exampleContentPreview() {
  console.log('\n=== Example 8: Content Preview ===\n');

  const agent = createLinkedInAgent();

  const availableTitles = [
    'The Contact Research Reality Check',
    'The 15-Hour Problem',
    'The Pricing Reality',
    'The Response Rate Problem',
    'The Real Cost of Bad Contact Data',
    'The Brighton Producer Reality',
    'The Spreadsheet Chaos Problem',
    'The Regional Radio Opportunity',
    'The Submission Window Problem',
    'The ROI Calculation'
  ];

  console.log('📚 Available content:\n');

  availableTitles.forEach((title, index) => {
    const content = agent.getContentByTitle(title);
    if (content) {
      const preview = content.substring(0, 100).replace(/\n/g, ' ');
      console.log(`${index + 1}. ${title}`);
      console.log(`   Preview: ${preview}...`);
      console.log(`   Length: ${content.length} characters\n`);
    }
  });
}

/**
 * Main function to run all examples
 */
export async function runAllExamples() {
  try {
    await exampleHealthCheck();
    await exampleContentPreview();
    // await exampleSimplePost(); // Uncomment to actually post
    // await examplePostFromCalendar(); // Uncomment to actually post
    // await exampleProcessScheduledPosts(); // Uncomment to process schedule
    // await exampleTokenRefresh(); // Uncomment to refresh token
    // await exampleCharacterLimit(); // Uncomment to test truncation
    // await exampleBatchPosting(); // Uncomment to batch post
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().then(() => {
    console.log('\n✅ Examples complete');
    process.exit(0);
  }).catch(error => {
    console.error('\n❌ Examples failed:', error);
    process.exit(1);
  });
}

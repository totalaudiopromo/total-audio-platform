/**
 * LinkedIn Agent Verification Script
 *
 * Verifies the LinkedIn posting agent structure and content mapping
 * without requiring OAuth credentials
 */

import { LinkedInPostingAgent } from '../lib/linkedin-posting-agent';
import contentCalendar from '../social-content/CONTENT_CALENDAR.json';

interface VerificationResult {
  category: string;
  checks: Array<{
    name: string;
    status: 'pass' | 'fail';
    message: string;
  }>;
}

async function verifyLinkedInAgent(): Promise<void> {
  console.log('🔍 LinkedIn Agent Verification\n');
  console.log('=' .repeat(50));

  const results: VerificationResult[] = [];

  // 1. Agent Structure Verification
  console.log('\n1️⃣  Agent Structure Verification\n');
  const structureChecks: VerificationResult = {
    category: 'Structure',
    checks: []
  };

  try {
    // Create dummy agent (won't authenticate without credentials)
    const dummyAgent = new LinkedInPostingAgent({
      clientId: 'test',
      clientSecret: 'test',
      accessToken: 'test'
    });

    structureChecks.checks.push({
      name: 'Agent instantiation',
      status: 'pass',
      message: 'LinkedInPostingAgent class instantiates correctly'
    });

    // Check methods exist
    const methods = ['authenticate', 'post', 'refreshAccessToken', 'getContentByTitle', 'processScheduledPosts', 'healthCheck'];
    const missingMethods = methods.filter(method => typeof (dummyAgent as any)[method] !== 'function');

    if (missingMethods.length === 0) {
      structureChecks.checks.push({
        name: 'Required methods',
        status: 'pass',
        message: `All ${methods.length} required methods present`
      });
    } else {
      structureChecks.checks.push({
        name: 'Required methods',
        status: 'fail',
        message: `Missing methods: ${missingMethods.join(', ')}`
      });
    }

  } catch (error) {
    structureChecks.checks.push({
      name: 'Agent instantiation',
      status: 'fail',
      message: `Failed to instantiate: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }

  results.push(structureChecks);
  printResults(structureChecks);

  // 2. Content Mapping Verification
  console.log('\n2️⃣  Content Mapping Verification\n');
  const contentChecks: VerificationResult = {
    category: 'Content',
    checks: []
  };

  const dummyAgent = new LinkedInPostingAgent({
    clientId: 'test',
    clientSecret: 'test',
    accessToken: 'test'
  });

  const expectedTitles = [
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

  let mappedCount = 0;
  let totalChars = 0;
  let maxChars = 0;
  let maxCharTitle = '';

  expectedTitles.forEach(title => {
    const content = dummyAgent.getContentByTitle(title);
    if (content) {
      mappedCount++;
      totalChars += content.length;
      if (content.length > maxChars) {
        maxChars = content.length;
        maxCharTitle = title;
      }
    }
  });

  contentChecks.checks.push({
    name: 'Content titles mapped',
    status: mappedCount === expectedTitles.length ? 'pass' : 'fail',
    message: `${mappedCount}/${expectedTitles.length} titles have content`
  });

  contentChecks.checks.push({
    name: 'Character limits',
    status: maxChars <= 3000 ? 'pass' : 'fail',
    message: `Largest post: ${maxChars} chars (${maxCharTitle}) - Limit: 3000`
  });

  contentChecks.checks.push({
    name: 'Average content length',
    status: 'pass',
    message: `Average: ${Math.round(totalChars / mappedCount)} characters per post`
  });

  // Check for UTM tracking
  let utmCount = 0;
  expectedTitles.forEach(title => {
    const content = dummyAgent.getContentByTitle(title);
    if (content && content.includes('utm_source=linkedin')) {
      utmCount++;
    }
  });

  contentChecks.checks.push({
    name: 'UTM tracking',
    status: utmCount === mappedCount ? 'pass' : 'fail',
    message: `${utmCount}/${mappedCount} posts include LinkedIn UTM parameters`
  });

  // Check for hashtags
  let hashtagCount = 0;
  expectedTitles.forEach(title => {
    const content = dummyAgent.getContentByTitle(title);
    if (content && content.includes('#')) {
      hashtagCount++;
    }
  });

  contentChecks.checks.push({
    name: 'Hashtags',
    status: hashtagCount === mappedCount ? 'pass' : 'fail',
    message: `${hashtagCount}/${mappedCount} posts include hashtags`
  });

  results.push(contentChecks);
  printResults(contentChecks);

  // 3. Content Calendar Integration
  console.log('\n3️⃣  Content Calendar Integration\n');
  const calendarChecks: VerificationResult = {
    category: 'Calendar',
    checks: []
  };

  const linkedInPosts = contentCalendar.schedule.filter(post => post.platform === 'LinkedIn');

  calendarChecks.checks.push({
    name: 'LinkedIn posts in calendar',
    status: linkedInPosts.length > 0 ? 'pass' : 'fail',
    message: `${linkedInPosts.length} LinkedIn posts scheduled`
  });

  // Check how many calendar posts have content mapped
  let calendarMappedCount = 0;
  linkedInPosts.forEach(post => {
    const content = dummyAgent.getContentByTitle(post.title);
    if (content) {
      calendarMappedCount++;
    }
  });

  calendarChecks.checks.push({
    name: 'Calendar content mapping',
    status: calendarMappedCount === linkedInPosts.length ? 'pass' : 'fail',
    message: `${calendarMappedCount}/${linkedInPosts.length} calendar posts have content mapped`
  });

  // Check scheduling distribution
  const weeks = Array.from(new Set(linkedInPosts.map(p => p.weekTheme)));
  calendarChecks.checks.push({
    name: 'Weekly distribution',
    status: 'pass',
    message: `Posts distributed across ${weeks.length} week themes`
  });

  results.push(calendarChecks);
  printResults(calendarChecks);

  // 4. Environment Variables Check
  console.log('\n4️⃣  Environment Variables Check\n');
  const envChecks: VerificationResult = {
    category: 'Environment',
    checks: []
  };

  const requiredEnvVars = [
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET',
    'LINKEDIN_ACCESS_TOKEN',
    'LINKEDIN_REFRESH_TOKEN'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length === 0) {
    envChecks.checks.push({
      name: 'Environment variables',
      status: 'pass',
      message: 'All required environment variables are set'
    });
  } else {
    envChecks.checks.push({
      name: 'Environment variables',
      status: 'fail',
      message: `Missing: ${missingEnvVars.join(', ')} - See .env.linkedin.template`
    });
  }

  results.push(envChecks);
  printResults(envChecks);

  // Final Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Verification Summary\n');

  const totalChecks = results.reduce((sum, result) => sum + result.checks.length, 0);
  const passedChecks = results.reduce(
    (sum, result) => sum + result.checks.filter(check => check.status === 'pass').length,
    0
  );
  const failedChecks = totalChecks - passedChecks;

  console.log(`✅ Passed: ${passedChecks}/${totalChecks}`);
  console.log(`❌ Failed: ${failedChecks}/${totalChecks}`);
  console.log(`📈 Success Rate: ${Math.round((passedChecks / totalChecks) * 100)}%\n`);

  if (failedChecks === 0) {
    console.log('🎉 LinkedIn agent is fully configured and ready to use!');
  } else if (missingEnvVars.length > 0) {
    console.log('⚠️  LinkedIn agent structure is correct, but OAuth credentials need to be configured.');
    console.log('📖 Follow LINKEDIN_OAUTH_SETUP.md to complete setup.\n');
  } else {
    console.log('⚠️  Some checks failed. Review the results above.\n');
  }
}

function printResults(result: VerificationResult): void {
  result.checks.forEach(check => {
    const emoji = check.status === 'pass' ? '✅' : '❌';
    console.log(`${emoji} ${check.name}`);
    console.log(`   ${check.message}\n`);
  });
}

// Run verification
verifyLinkedInAgent().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});

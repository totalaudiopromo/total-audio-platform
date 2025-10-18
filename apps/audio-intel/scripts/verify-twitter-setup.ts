#!/usr/bin/env tsx
/**
 * Twitter Agent Setup Verification Script
 *
 * Verifies that the Twitter posting agent is properly configured
 * and ready to use for Audio Intel social media automation.
 */

import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: CheckResult[] = [];

/**
 * Check 1: Verify twitter-api-v2 is installed
 */
function checkPackageInstalled(): CheckResult {
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    if (packageJson.dependencies['twitter-api-v2']) {
      return {
        name: 'Twitter API Package',
        status: 'pass',
        message: `twitter-api-v2@${packageJson.dependencies['twitter-api-v2']} installed`
      };
    } else {
      return {
        name: 'Twitter API Package',
        status: 'fail',
        message: 'twitter-api-v2 not found in package.json'
      };
    }
  } catch (error) {
    return {
      name: 'Twitter API Package',
      status: 'fail',
      message: 'Error reading package.json: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  }
}

/**
 * Check 2: Verify agent file exists
 */
function checkAgentFileExists(): CheckResult {
  const agentPath = path.join(__dirname, '..', 'lib', 'twitter-posting-agent.ts');

  if (fs.existsSync(agentPath)) {
    return {
      name: 'Agent File',
      status: 'pass',
      message: 'twitter-posting-agent.ts exists at lib/twitter-posting-agent.ts'
    };
  } else {
    return {
      name: 'Agent File',
      status: 'fail',
      message: 'twitter-posting-agent.ts not found'
    };
  }
}

/**
 * Check 3: Verify content file exists
 */
function checkContentFileExists(): CheckResult {
  const contentPath = path.join(__dirname, '..', 'social-content', 'TWITTER_X_THREADS_RADIO_PROMOTERS.md');

  if (fs.existsSync(contentPath)) {
    return {
      name: 'Content File',
      status: 'pass',
      message: 'TWITTER_X_THREADS_RADIO_PROMOTERS.md exists'
    };
  } else {
    return {
      name: 'Content File',
      status: 'warning',
      message: 'Content file not found (agent will still work with embedded content)'
    };
  }
}

/**
 * Check 4: Verify content calendar exists
 */
function checkContentCalendarExists(): CheckResult {
  const calendarPath = path.join(__dirname, '..', 'social-content', 'CONTENT_CALENDAR.json');

  if (fs.existsSync(calendarPath)) {
    try {
      const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf-8'));
      const twitterPosts = calendar.schedule?.filter((post: any) => post.platform === 'Twitter/X') || [];

      return {
        name: 'Content Calendar',
        status: 'pass',
        message: `CONTENT_CALENDAR.json exists with ${twitterPosts.length} Twitter/X posts`
      };
    } catch (error) {
      return {
        name: 'Content Calendar',
        status: 'warning',
        message: 'CONTENT_CALENDAR.json exists but may be malformed'
      };
    }
  } else {
    return {
      name: 'Content Calendar',
      status: 'warning',
      message: 'CONTENT_CALENDAR.json not found'
    };
  }
}

/**
 * Check 5: Verify environment variables (check if .env.local exists)
 */
function checkEnvironmentVariables(): CheckResult {
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  const envExamplePath = path.join(__dirname, '..', '.env.twitter.example');

  const hasEnvLocal = fs.existsSync(envLocalPath);
  const hasEnvExample = fs.existsSync(envExamplePath);

  if (hasEnvLocal) {
    const envContent = fs.readFileSync(envLocalPath, 'utf-8');
    const hasTwitterVars = envContent.includes('TWITTER_API_KEY') ||
                           envContent.includes('TWITTER_API_SECRET') ||
                           envContent.includes('TWITTER_ACCESS_TOKEN');

    if (hasTwitterVars) {
      return {
        name: 'Environment Variables',
        status: 'pass',
        message: '.env.local exists with Twitter credentials configured'
      };
    } else {
      return {
        name: 'Environment Variables',
        status: 'warning',
        message: '.env.local exists but Twitter credentials not found. Add TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET'
      };
    }
  } else if (hasEnvExample) {
    return {
      name: 'Environment Variables',
      status: 'warning',
      message: '.env.twitter.example exists. Copy to .env.local and add your credentials'
    };
  } else {
    return {
      name: 'Environment Variables',
      status: 'fail',
      message: 'No environment configuration found'
    };
  }
}

/**
 * Check 6: Verify example file exists
 */
function checkExampleFileExists(): CheckResult {
  const examplePath = path.join(__dirname, '..', 'lib', 'examples', 'twitter-agent-example.ts');

  if (fs.existsSync(examplePath)) {
    return {
      name: 'Example File',
      status: 'pass',
      message: 'twitter-agent-example.ts exists at lib/examples/'
    };
  } else {
    return {
      name: 'Example File',
      status: 'warning',
      message: 'Example file not found (not critical for production)'
    };
  }
}

/**
 * Check 7: Verify README exists
 */
function checkReadmeExists(): CheckResult {
  const readmePath = path.join(__dirname, '..', 'lib', 'TWITTER_AGENT_README.md');

  if (fs.existsSync(readmePath)) {
    return {
      name: 'Documentation',
      status: 'pass',
      message: 'TWITTER_AGENT_README.md exists with full documentation'
    };
  } else {
    return {
      name: 'Documentation',
      status: 'warning',
      message: 'README not found (not critical for functionality)'
    };
  }
}

/**
 * Run all checks
 */
function runChecks() {
  console.log('🐦 Twitter Agent Setup Verification\n');
  console.log('===================================\n');

  results.push(checkPackageInstalled());
  results.push(checkAgentFileExists());
  results.push(checkContentFileExists());
  results.push(checkContentCalendarExists());
  results.push(checkEnvironmentVariables());
  results.push(checkExampleFileExists());
  results.push(checkReadmeExists());

  // Display results
  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}\n`);
  });

  // Summary
  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  console.log('===================================\n');
  console.log('📊 Summary:\n');
  console.log(`✅ Passed: ${passCount}`);
  console.log(`⚠️  Warnings: ${warningCount}`);
  console.log(`❌ Failed: ${failCount}\n`);

  if (failCount === 0 && warningCount === 0) {
    console.log('🎉 All checks passed! Twitter agent is ready to use.\n');
    console.log('Next steps:');
    console.log('1. Add Twitter credentials to .env.local');
    console.log('2. Run example: npx tsx lib/examples/twitter-agent-example.ts');
    console.log('3. Test health check to verify API connection\n');
  } else if (failCount === 0) {
    console.log('✨ Setup is mostly complete with some warnings.\n');
    console.log('Review warnings above and complete remaining configuration.\n');
  } else {
    console.log('❌ Setup incomplete. Please address failed checks above.\n');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

// Run verification
runChecks();

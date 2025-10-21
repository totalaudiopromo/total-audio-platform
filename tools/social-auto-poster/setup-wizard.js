#!/usr/bin/env node

/**
 * Simple Setup Wizard for Unified Social Poster
 *
 * Run this ONCE to configure all your platforms
 * Saves everything to a single config file
 */

const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function setupWizard() {
  console.log(`
==============================================
  Unified Social Poster - Setup Wizard
==============================================

This wizard will help you set up LinkedIn, Bluesky, and Threads.
You'll only need to do this ONCE.

`);

  const config = {
    linkedin: { enabled: false },
    bluesky: { enabled: false },
    threads: { enabled: false }
  };

  // LinkedIn Setup
  console.log('\n--- LinkedIn Setup ---\n');
  const setupLinkedIn = await question('Set up LinkedIn? (y/n): ');

  if (setupLinkedIn.toLowerCase() === 'y') {
    console.log(`
LinkedIn Setup Steps:
1. Go to: https://www.linkedin.com/developers/apps
2. Create a new app (or use existing)
3. In "Products", add "Share on LinkedIn" (FREE - auto-approved)
4. In "Auth" tab, copy your credentials

`);

    const linkedinClientId = await question('LinkedIn Client ID: ');
    const linkedinClientSecret = await question('LinkedIn Client Secret: ');

    console.log('\nGenerating LinkedIn OAuth URL...');
    const redirectUri = 'http://localhost:3000/auth/callback';
    const state = Math.random().toString(36).substring(7);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${linkedinClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=openid%20profile%20email%20w_member_social&` +
      `state=${state}`;

    console.log(`\nOpen this URL in your browser:\n${authUrl}\n`);
    console.log('After authorizing, you\'ll be redirected to a page that doesn\'t exist.');
    console.log('Copy the "code" parameter from the URL.\n');

    const authCode = await question('Paste the authorization code here: ');

    // Exchange code for token
    try {
      const tokenResponse = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: redirectUri,
          client_id: linkedinClientId,
          client_secret: linkedinClientSecret
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Get user profile
      const profileResponse = await axios.get(
        'https://api.linkedin.com/v2/userinfo',
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      const personUrn = `urn:li:person:${profileResponse.data.sub}`;

      config.linkedin = {
        enabled: true,
        clientId: linkedinClientId,
        clientSecret: linkedinClientSecret,
        accessToken: accessToken,
        personUrn: personUrn
      };

      console.log('\nLinkedIn setup successful!');

    } catch (error) {
      console.error('LinkedIn setup failed:', error.response?.data || error.message);
      console.log('You can configure LinkedIn manually later.');
    }
  }

  // Bluesky Setup
  console.log('\n--- Bluesky Setup ---\n');
  const setupBluesky = await question('Set up Bluesky? (y/n): ');

  if (setupBluesky.toLowerCase() === 'y') {
    console.log(`
Bluesky Setup Steps:
1. Go to your Bluesky Settings
2. Navigate to: Privacy and Security > App Passwords
3. Click "Add App Password"
4. Copy the generated password

`);

    const blueskyHandle = await question('Bluesky Handle (e.g., yourname.bsky.social): ');
    const blueskyPassword = await question('Bluesky App Password: ');

    // Test Bluesky credentials
    try {
      const testResponse = await axios.post(
        'https://bsky.social/xrpc/com.atproto.server.createSession',
        {
          identifier: blueskyHandle,
          password: blueskyPassword
        }
      );

      config.bluesky = {
        enabled: true,
        handle: blueskyHandle,
        appPassword: blueskyPassword,
        did: testResponse.data.did
      };

      console.log('\nBluesky setup successful!');

    } catch (error) {
      console.error('Bluesky setup failed:', error.response?.data || error.message);
      console.log('Please check your credentials and try again.');
    }
  }

  // Threads Setup
  console.log('\n--- Threads Setup ---\n');
  const setupThreads = await question('Set up Threads? (y/n): ');

  if (setupThreads.toLowerCase() === 'y') {
    console.log(`
Threads Setup Steps:
1. Go to: https://developers.facebook.com/apps
2. Create a new app or use existing
3. Add "Threads" product
4. Get your access token from the Threads API settings

Note: Threads uses Instagram's API and requires additional verification.
This is the most complex setup of the three platforms.

`);

    const threadsAccessToken = await question('Threads Access Token: ');
    const threadsUserId = await question('Threads User ID: ');
    const threadsUsername = await question('Threads Username (without @): ');

    config.threads = {
      enabled: true,
      accessToken: threadsAccessToken,
      userId: threadsUserId,
      username: threadsUsername
    };

    console.log('\nThreads configured!');
  }

  // Save configuration
  const configPath = path.join(__dirname, 'social-config.json');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  console.log(`\n
==============================================
  Setup Complete!
==============================================

Configuration saved to: ${configPath}

Platforms configured:
- LinkedIn: ${config.linkedin.enabled ? 'ENABLED' : 'Disabled'}
- Bluesky: ${config.bluesky.enabled ? 'ENABLED' : 'Disabled'}
- Threads: ${config.threads.enabled ? 'ENABLED' : 'Disabled'}

Next steps:
1. Test posting: node unified-poster.js post "Hello world!"
2. Set up scheduler: node scheduler.js start
3. Enjoy your auto-posting system!

`);

  rl.close();
}

// Run wizard
setupWizard().catch(error => {
  console.error('Setup failed:', error);
  rl.close();
  process.exit(1);
});

/**
 * LinkedIn OAuth Token Helper
 *
 * This script helps you get a LinkedIn access token for posting.
 *
 * Steps:
 * 1. Create app at https://www.linkedin.com/developers/apps
 * 2. Add redirect URI: https://intel.totalaudiopromo.com/auth/linkedin/callback
 * 3. Request permissions: w_member_social (for posting)
 * 4. Run this script and follow the authorization URL
 * 5. Copy the code from redirect and exchange for access token
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as readline from 'readline';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '781ioptlbwi0ok';
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==';

// Use production redirect URI (must be configured in LinkedIn app)
const REDIRECT_URI = 'https://intel.totalaudiopromo.com/auth/linkedin/callback';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function getAccessToken() {
  console.log('=== LinkedIn OAuth Token Generator ===\n');

  console.log('⚠️  IMPORTANT: Before running this, make sure your LinkedIn app has this redirect URI:');
  console.log('   https://intel.totalaudiopromo.com/auth/linkedin/callback');
  console.log('');
  console.log('Configure it at: https://www.linkedin.com/developers/apps');
  console.log('Go to: Your App → Auth → Redirect URLs');
  console.log('');

  const ready = await question('Have you configured the redirect URI? (yes/no): ');

  if (ready.toLowerCase() !== 'yes') {
    console.log('\nPlease configure the redirect URI first, then run this script again.');
    rl.close();
    return;
  }

  console.log('');

  // Step 1: Generate authorization URL
  const state = Math.random().toString(36).substring(7);
  const scope = 'openid profile email w_member_social'; // w_member_social for posting

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `state=${state}&` +
    `scope=${encodeURIComponent(scope)}`;

  console.log('Step 1: Visit this URL to authorize the app:');
  console.log('');
  console.log(authUrl);
  console.log('');
  console.log('Step 2: After authorization, you\'ll be redirected to a page that says "Cannot GET /auth/linkedin/callback"');
  console.log('        This is expected! Look at the URL in your browser - it will look like:');
  console.log('        https://intel.totalaudiopromo.com/auth/linkedin/callback?code=XXXXXXXXXX&state=XXXXX');
  console.log('');

  // Step 2: Get authorization code from user
  const code = await question('Step 3: Copy the entire "code" parameter value (the XXXXXXXXXX part) and paste it here: ');

  console.log('\nExchanging code for access token...\n');

  // Step 3: Exchange code for access token
  try {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code.trim(),
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      console.log('✅ Success! LinkedIn Access Token:');
      console.log('');
      console.log(data.access_token);
      console.log('');
      console.log('Token expires in:', data.expires_in, 'seconds (', Math.floor(data.expires_in / 86400), 'days )');
      console.log('');
      console.log('Add these to your .env.local:');
      console.log('-----------------------------------');
      console.log('LINKEDIN_CLIENT_ID=' + CLIENT_ID);
      console.log('LINKEDIN_CLIENT_SECRET=' + CLIENT_SECRET);
      console.log('LINKEDIN_ACCESS_TOKEN=' + data.access_token);
      if (data.refresh_token) {
        console.log('LINKEDIN_REFRESH_TOKEN=' + data.refresh_token);
      }
      console.log('-----------------------------------');
      console.log('');
      console.log('Then add to Vercel (production):');
      console.log('vercel env add LINKEDIN_CLIENT_ID');
      console.log('vercel env add LINKEDIN_CLIENT_SECRET');
      console.log('vercel env add LINKEDIN_ACCESS_TOKEN');
      if (data.refresh_token) {
        console.log('vercel env add LINKEDIN_REFRESH_TOKEN');
      }
    } else {
      console.error('❌ Error getting access token:');
      console.error(data);

      if (data.error === 'invalid_redirect_uri') {
        console.error('');
        console.error('⚠️  The redirect URI is not configured correctly in your LinkedIn app.');
        console.error('Go to: https://www.linkedin.com/developers/apps');
        console.error('Add this redirect URI: ' + REDIRECT_URI);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  rl.close();
}

getAccessToken();

/**
 * LinkedIn OAuth Token Helper - Simplified Version
 *
 * This script handles the common mistake of pasting the full URL parameter string
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as readline from 'readline';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || '781ioptlbwi0ok';
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'WPL_AP1.frlXgbgIa5bM62VZ.yrVM6g==';
const REDIRECT_URI = 'https://intel.totalaudiopromo.com/auth/linkedin/callback';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

function extractCode(input: string): string {
  // Handle if user pastes full URL or just the query params
  input = input.trim();

  // If it's a full URL, extract query params
  if (input.startsWith('http')) {
    const url = new URL(input);
    const code = url.searchParams.get('code');
    if (code) return code;
  }

  // If it contains &state=, split it off
  if (input.includes('&state=')) {
    return input.split('&state=')[0];
  }

  // If it starts with "code=", remove that
  if (input.startsWith('code=')) {
    return input.substring(5);
  }

  // Otherwise assume it's just the code
  return input;
}

async function getAccessToken() {
  console.log('=== LinkedIn OAuth Token Generator (Simple) ===\n');

  // Step 1: Generate authorization URL
  const state = Math.random().toString(36).substring(7);
  const scope = 'openid profile email w_member_social';

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `state=${state}&` +
    `scope=${encodeURIComponent(scope)}`;

  console.log('Step 1: Copy this URL and open it in your browser:');
  console.log('');
  console.log(authUrl);
  console.log('');
  console.log('Step 2: LinkedIn will ask you to authorize. Click "Allow".');
  console.log('');
  console.log('Step 3: You\'ll be redirected to a page that shows an error.');
  console.log('        DON\'T WORRY! This is expected.');
  console.log('');
  console.log('Step 4: Look at the URL bar. It will look something like:');
  console.log('        https://intel.totalaudiopromo.com/auth/linkedin/callback?code=AQT...V14&state=abc123');
  console.log('');
  console.log('Step 5: Copy EVERYTHING after "?code=" (or just paste the whole URL, I\'ll parse it)');
  console.log('');

  // Get input from user
  const input = await question('Paste the URL or code here: ');

  // Extract just the code
  const code = extractCode(input);

  console.log('\n✓ Extracted code:', code.substring(0, 20) + '...');
  console.log('\nExchanging code for access token...\n');

  // Exchange code for access token
  try {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      console.log('✅ SUCCESS! You have a LinkedIn access token!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('ACCESS TOKEN:');
      console.log(data.access_token);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('Token expires in:', data.expires_in, 'seconds');
      console.log('That\'s about', Math.floor(data.expires_in / 86400), 'days\n');

      console.log('NEXT STEPS:\n');
      console.log('1. Add to your .env.local file:');
      console.log('   ────────────────────────────────────────────────');
      console.log('   LINKEDIN_CLIENT_ID=' + CLIENT_ID);
      console.log('   LINKEDIN_CLIENT_SECRET=' + CLIENT_SECRET);
      console.log('   LINKEDIN_ACCESS_TOKEN=' + data.access_token);
      if (data.refresh_token) {
        console.log('   LINKEDIN_REFRESH_TOKEN=' + data.refresh_token);
      }
      console.log('   ────────────────────────────────────────────────\n');

      console.log('2. Add to Vercel (run these commands):');
      console.log('   ────────────────────────────────────────────────');
      console.log('   vercel env add LINKEDIN_CLIENT_ID');
      console.log('   vercel env add LINKEDIN_CLIENT_SECRET');
      console.log('   vercel env add LINKEDIN_ACCESS_TOKEN');
      if (data.refresh_token) {
        console.log('   vercel env add LINKEDIN_REFRESH_TOKEN');
      }
      console.log('   ────────────────────────────────────────────────\n');

      console.log('3. Test it works:');
      console.log('   ────────────────────────────────────────────────');
      console.log('   npx tsx scripts/verify-linkedin-agent.ts');
      console.log('   ────────────────────────────────────────────────\n');

      console.log('⚠️  REMINDER: Set a calendar reminder to refresh this token in 55 days!');
      console.log('   LinkedIn tokens expire after 60 days.\n');

    } else {
      console.error('❌ Error getting access token:\n');
      console.error(JSON.stringify(data, null, 2));
      console.error('');

      if (data.error === 'invalid_request' && data.error_description?.includes('authorization code')) {
        console.error('⚠️  This usually means:');
        console.error('   1. The authorization code was already used (codes can only be used once)');
        console.error('   2. The code has expired (they expire after a few minutes)');
        console.error('');
        console.error('💡 Solution: Run this script again and get a NEW authorization code.');
        console.error('   Each time you authorize, LinkedIn gives you a fresh code.');
      }

      if (data.error === 'invalid_redirect_uri') {
        console.error('⚠️  The redirect URI is not configured in your LinkedIn app.');
        console.error('');
        console.error('Fix:');
        console.error('1. Go to: https://www.linkedin.com/developers/apps');
        console.error('2. Select your app');
        console.error('3. Go to "Auth" tab');
        console.error('4. Add this redirect URI: ' + REDIRECT_URI);
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }

  rl.close();
}

getAccessToken();

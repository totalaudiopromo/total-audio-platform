/**
 * Threads (Instagram) OAuth Token Helper
 *
 * This script helps you get a Threads access token for posting.
 *
 * Prerequisites:
 * 1. You need a business Instagram account
 * 2. The account must be connected to a Facebook Page
 * 3. Create a Facebook App at https://developers.facebook.com
 * 4. Add Threads API product to your app
 * 5. Request permissions: threads_basic, threads_content_publish
 *
 * Steps:
 * 1. Create Facebook App at https://developers.facebook.com/apps
 * 2. Add "Threads API" product
 * 3. Go to Threads API > Permissions and request threads_basic, threads_content_publish
 * 4. Get your App ID and App Secret
 * 5. Run this script and follow the instructions
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as readline from 'readline';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const APP_ID = process.env.THREADS_APP_ID || process.env.INSTAGRAM_APP_ID;
const APP_SECRET = process.env.THREADS_APP_SECRET || process.env.INSTAGRAM_APP_SECRET;
const REDIRECT_URI = 'https://intel.totalaudiopromo.com/auth/threads/callback';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function getAccessToken() {
  console.log('=== Threads (Instagram) OAuth Token Generator ===\n');

  if (!APP_ID || !APP_SECRET) {
    console.log('❌ App credentials not found in environment variables.');
    console.log('');
    console.log('You need to:');
    console.log('1. Create a Facebook App at https://developers.facebook.com/apps');
    console.log('2. Add "Threads API" product to your app');
    console.log('3. Get your App ID and App Secret');
    console.log('');
    const appId = await question('Enter your Facebook App ID: ');
    const appSecret = await question('Enter your Facebook App Secret: ');
    console.log('');
    console.log('Add these to your .env.local:');
    console.log(`THREADS_APP_ID=${appId}`);
    console.log(`THREADS_APP_SECRET=${appSecret}`);
    console.log('');
    rl.close();
    return;
  }

  // Step 1: Generate authorization URL
  const state = Math.random().toString(36).substring(7);
  const scope = 'threads_basic,threads_content_publish';

  const authUrl = `https://threads.net/oauth/authorize?` +
    `client_id=${APP_ID}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `state=${state}`;

  console.log('Step 1: Visit this URL to authorize the app:');
  console.log(authUrl);
  console.log('');

  // Step 2: Get authorization code from user
  const code = await question('Step 2: After authorization, paste the "code" parameter from the redirect URL: ');

  console.log('\nExchanging code for short-lived access token...\n');

  // Step 3: Exchange code for short-lived access token
  try {
    const shortLivedResponse = await fetch(
      `https://graph.threads.net/oauth/access_token?` +
      `client_id=${APP_ID}&` +
      `client_secret=${APP_SECRET}&` +
      `grant_type=authorization_code&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `code=${code.trim()}`
    );

    const shortLivedData = await shortLivedResponse.json();

    if (shortLivedData.access_token) {
      console.log('✅ Short-lived access token received');
      console.log('User ID:', shortLivedData.user_id);
      console.log('');

      // Step 4: Exchange for long-lived access token
      console.log('Exchanging for long-lived access token...\n');

      const longLivedResponse = await fetch(
        `https://graph.threads.net/access_token?` +
        `grant_type=th_exchange_token&` +
        `client_secret=${APP_SECRET}&` +
        `access_token=${shortLivedData.access_token}`
      );

      const longLivedData = await longLivedResponse.json();

      if (longLivedData.access_token) {
        console.log('✅ Success! Threads Long-Lived Access Token:');
        console.log('');
        console.log('Access Token:', longLivedData.access_token);
        console.log('User ID:', shortLivedData.user_id);
        console.log('Token expires in:', longLivedData.expires_in, 'seconds (', Math.floor(longLivedData.expires_in / 86400), 'days )');
        console.log('');
        console.log('Add these to your .env.local and Vercel environment variables:');
        console.log(`THREADS_USER_ID=${shortLivedData.user_id}`);
        console.log(`THREADS_ACCESS_TOKEN=${longLivedData.access_token}`);
        console.log('');
        console.log('For Vercel (production):');
        console.log('vercel env add THREADS_USER_ID');
        console.log('vercel env add THREADS_ACCESS_TOKEN');
        console.log('');
        console.log('⚠️  IMPORTANT: Long-lived tokens expire after 60 days.');
        console.log('Set a reminder to refresh the token before it expires!');
      } else {
        console.error('❌ Error getting long-lived access token:');
        console.error(longLivedData);
      }
    } else {
      console.error('❌ Error getting short-lived access token:');
      console.error(shortLivedData);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }

  rl.close();
}

getAccessToken();

#!/usr/bin/env node

/**
 * Simple BlueSky authentication test
 */

require('dotenv').config();

async function testBlueSkyAuth() {
  console.log('🔵 Testing BlueSky Authentication...');

  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_APP_PASSWORD;

  console.log(`Handle: ${identifier}`);
  console.log(`Password: ${password ? '***' + password.slice(-4) : 'NOT SET'}`);

  if (!identifier || !password) {
    console.error('❌ BlueSky credentials not found in .env file');
    return false;
  }

  try {
    const response = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Authentication failed:', error);
      return false;
    }

    const session = await response.json();
    console.log('✅ BlueSky authentication successful!');
    console.log(`DID: ${session.did}`);
    console.log(`Handle: ${session.handle}`);

    return session;
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return false;
  }
}

async function testPost(session) {
  console.log('\n🧪 Testing a sample post...');

  const testContent = `Testing Audio Intel automation system! 🎵

Built by a working musician who got tired of spending weekends on spreadsheet chaos instead of making music.

Real solution for real musicians. #AudioIntel #MusicTech #TestPost`;

  console.log('Content to post:');
  console.log('---');
  console.log(testContent);
  console.log('---');

  const postData = {
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record: {
      text: testContent,
      createdAt: new Date().toISOString(),
      $type: 'app.bsky.feed.post',
    },
  };

  try {
    const response = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessJwt}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Post failed:', error);
      return false;
    }

    const result = await response.json();
    console.log('✅ Test post successful!');
    console.log(`Post URI: ${result.uri}`);

    // Extract post ID from URI for BlueSky URL
    const postId = result.uri.split('/').pop();
    const profileHandle = session.handle;
    const postUrl = `https://bsky.app/profile/${profileHandle}/post/${postId}`;

    console.log(`🔗 View your post: ${postUrl}`);

    return result;
  } catch (error) {
    console.error('❌ Post error:', error.message);
    return false;
  }
}

async function main() {
  const command = process.argv[2];

  if (command === 'auth-only') {
    const session = await testBlueSkyAuth();
    if (session) {
      console.log('\n✅ Ready for automation!');
    }
    return;
  }

  if (command === 'post-test') {
    const session = await testBlueSkyAuth();
    if (session) {
      await testPost(session);
    }
    return;
  }

  console.log(`
BlueSky Test Script

Commands:
  auth-only    Test authentication only
  post-test    Test authentication and make a test post

Examples:
  node scripts/test-bluesky.js auth-only
  node scripts/test-bluesky.js post-test
  `);
}

main().catch(console.error);
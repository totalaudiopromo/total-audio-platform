#!/usr/bin/env node

/**
 * Delete BlueSky post by URI
 */

require('dotenv').config();

async function authenticateBlueSky() {
  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_APP_PASSWORD;

  const response = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) throw new Error('Authentication failed');
  return await response.json();
}

async function deletePost(session, postUri) {
  console.log(`🗑️ Deleting post: ${postUri}`);

  const response = await fetch('https://bsky.social/xrpc/com.atproto.repo.deleteRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      rkey: postUri.split('/').pop(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Delete failed: ${error}`);
  }

  console.log('✅ Test post deleted successfully!');
}

async function main() {
  try {
    const session = await authenticateBlueSky();

    // Delete the test post
    const testPostUri = 'at://did:plc:k2a7cb2fwwxpcty6nsfkz33f/app.bsky.feed.post/3lzrcok7xsg2b';
    await deletePost(session, testPostUri);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();

#!/usr/bin/env node

/**
 * Simple WARM API Plays Test
 * 1) Auth via /auth/exchange
 * 2) Fetch a small sample of /plays
 */

require('dotenv').config();

async function getToken(baseUrl, email, password) {
  const response = await fetch(`${baseUrl}/auth/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Total-Audio-Promo/1.0' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Auth failed: ${response.status} ${response.statusText} - ${text}`);
  }
  return response.text();
}

async function fetchPlays(baseUrl, token) {
  const params = new URLSearchParams({ countryCode: 'GB', pageSize: '10' });
  const response = await fetch(`${baseUrl}/plays?${params.toString()}`, {
    headers: { Authorization: `Bearer ${await token}` }
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, body: text };
}

async function main() {
  const baseUrl = process.env.WARM_API_BASE_URL || 'https://public-api.warmmusic.net/api/v1';
  const email = process.env.WARM_API_EMAIL || 'promo@totalaudiopromo.com';
  const password = process.env.WARM_API_PASSWORD || '';

  console.log(`🌐 Base URL: ${baseUrl}`);
  console.log(`📧 Email:    ${email}`);

  try {
    console.log('🔐 Exchanging credentials for token...');
    const token = await getToken(baseUrl, email, password);
    console.log(`✅ Token received: ${token.substring(0, 24)}...\n`);

    console.log('📻 Fetching sample plays (GB, 10)...');
    const plays = await fetchPlays(baseUrl, token);
    console.log(`📡 Status: ${plays.status}`);
    console.log(`🧾 Body: ${plays.body.substring(0, 400)}${plays.body.length > 400 ? '...' : ''}`);

    if (!plays.ok) process.exitCode = 2;
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}



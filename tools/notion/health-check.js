#!/usr/bin/env node
// Minimal Notion token check (no SDK). Does not log your token.
// Usage:
//   NOTION_API_KEY=secret node tools/notion/health-check.js
// Optional:
//   NOTION_API_KEY=secret node tools/notion/health-check.js --verbose

const https = require('https');

const token = process.env.NOTION_API_KEY;
const verbose = process.argv.includes('--verbose');

if (!token) {
  console.error('NOTION_API_KEY is not set.');
  process.exit(1);
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.notion.com',
      path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28'
      }
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const resp = await get('/v1/users/me');
  if (verbose) {
    console.log('Status:', resp.status);
    console.log('Body:', resp.data);
  }
  if (resp.status === 200) {
    console.log('✅ Notion token looks valid (users/me succeeded).');
  } else if (resp.status === 401) {
    console.error('❌ Unauthorized: token invalid or expired.');
    process.exit(2);
  } else {
    console.error('⚠️ Unexpected response:', resp.status);
    process.exit(3);
  }
})().catch((e) => { console.error('Error:', e.message); process.exit(4); });


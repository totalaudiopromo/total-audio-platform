#!/usr/bin/env node
// Quick ConvertKit (Kit.com) health check script.
// Usage: node tools/email/kit-health-check.js --email you@example.com --form 8440957
// Requires: CONVERTKIT_API_KEY in environment.

const https = require('https');

function getArg(name, fallback = null) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx > -1 && process.argv[idx + 1] ? process.argv[idx + 1] : fallback;
}

function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  const email = getArg('email');
  const formId = getArg('form', '8440957');
  const apiKey = process.env.CONVERTKIT_API_KEY || process.env.KIT_API_KEY;
  if (!email) {
    console.error('Missing --email you@example.com');
    process.exit(1);
  }
  if (!apiKey) {
    console.error('Missing CONVERTKIT_API_KEY in environment');
    process.exit(1);
  }
  console.log(`Subscribing ${email} to Kit form ${formId}...`);
  const resp = await postJSON(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    api_key: apiKey,
    email,
    first_name: '',
    fields: { source: 'kit-health-check', timestamp: new Date().toISOString() },
  });
  console.log('Status:', resp.status);
  console.log('Body:', resp.body);
}

main().catch((e) => { console.error(e); process.exit(1); });


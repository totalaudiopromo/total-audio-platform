#!/usr/bin/env node

/**
 * Test OAuth URL - Check what error we get
 */

const https = require('https');
const { URL } = require('url');

const oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&prompt=consent&response_type=code&client_id=309298460159-4gcfsvpup4og77r0mifta91s8f651875.apps.googleusercontent.com&redirect_uri=postmessage';

console.log('🧪 Testing OAuth URL...\n');

console.log('URL to test:');
console.log(oauthUrl);
console.log('');

// Test the URL
const url = new URL(oauthUrl);
const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname + url.search,
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  }
};

const req = https.request(options, (res) => {
  console.log('📊 Response Status:', res.statusCode);
  console.log('📍 Response Headers:', res.headers);

  if (res.statusCode === 200) {
    console.log('✅ OAuth URL is accessible!');
    console.log('💡 Try opening it in your browser manually');
  } else if (res.statusCode === 302 || res.statusCode === 301) {
    console.log('🔄 OAuth URL redirects (normal)');
    console.log('💡 Try opening it in your browser manually');
  } else {
    console.log('❌ OAuth URL has issues');
  }

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (data.includes('error')) {
      console.log('❌ Error in response body');
      console.log('Response preview:', data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.end();

// Also provide manual instructions
console.log('\n🔧 If the URL doesn\'t work, you need to:');
console.log('1. Run: ./quick-oauth-setup.sh');
console.log('2. Fix Google Cloud Console settings');
console.log('3. Try the OAuth URL again');
console.log('\n📋 Manual OAuth URL (copy and paste):');
console.log(oauthUrl);
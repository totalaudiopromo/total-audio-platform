#!/usr/bin/env node

/**
 * WARM API Test using native Node.js https module
 */

require('dotenv').config();
const https = require('https');

function makeHttpsRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let responseData = '';

      res.on('data', chunk => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData,
        });
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

async function testWarmAuthNative() {
  console.log('🔐 Testing WARM API Authentication with native Node.js...\n');

  const credentials = {
    email: process.env.WARM_API_EMAIL || 'promo@totalaudiopromo.com',
    password: process.env.WARM_API_PASSWORD || '',
  };

  console.log('📧 Email:', credentials.email);
  console.log('🔑 Password:', credentials.password.substring(0, 3) + '***');

  const postData = JSON.stringify(credentials);

  const options = {
    hostname: 'public-api.warmmusic.net',
    port: 443,
    path: '/api/v1/auth/exchange',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Liberty-Music-PR-Agent/1.0',
    },
  };

  try {
    console.log('🌐 Making request to WARM API...');
    const response = await makeHttpsRequest(options, postData);

    console.log('\n📡 Response Status:', response.statusCode);
    console.log('📡 Response Headers:', response.headers);
    console.log('📡 Response Body:', response.data);

    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('\n✅ Authentication successful!');
      console.log('🎫 Token:', response.data.substring(0, 50) + '...');
      return response.data;
    } else {
      console.log('\n❌ Authentication failed');

      if (response.statusCode === 403) {
        console.log('🔧 Troubleshooting:');
        console.log('   • Check if email/password are correct');
        console.log('   • Verify 250-song trial is active');
        console.log('   • Contact WARM support if trial expired');
      } else if (response.statusCode === 400) {
        console.log('🔧 Troubleshooting:');
        console.log('   • Check request format');
        console.log('   • Verify API endpoint URL');
      }

      return null;
    }
  } catch (error) {
    console.log('\n❌ Network error:', error.message);
    console.log('🔧 Troubleshooting:');
    console.log('   • Check internet connection');
    console.log('   • Verify API URL is correct');
    console.log('   • Try again in a few minutes');

    return null;
  }
}

// Run the test
if (require.main === module) {
  testWarmAuthNative().catch(console.error);
}

module.exports = { testWarmAuthNative };

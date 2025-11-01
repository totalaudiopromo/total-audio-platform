#!/usr/bin/env node

/**
 * Simple WARM API Authentication Test
 * Tests the authentication endpoint directly
 */

require('dotenv').config();

async function testWarmAuth() {
  console.log('🔐 Testing WARM API Authentication...\n');

  const credentials = {
    email: process.env.WARM_API_EMAIL || 'promo@totalaudiopromo.com',
    password: process.env.WARM_API_PASSWORD || '',
  };

  const apiUrl = process.env.WARM_API_BASE_URL || 'https://public-api.warmmusic.net/api/v1';

  console.log('📧 Email:', credentials.email);
  console.log('🌐 API URL:', apiUrl);
  console.log('🔑 Password:', credentials.password.substring(0, 3) + '***');

  try {
    const response = await fetch(`${apiUrl}/auth/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Liberty-Music-PR-Agent/1.0',
      },
      body: JSON.stringify(credentials),
    });

    const responseText = await response.text();
    console.log('\n📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('📡 Response Body:', responseText);

    if (response.ok) {
      console.log('\n✅ Authentication successful!');
      console.log('🎫 Token:', responseText.substring(0, 50) + '...');
      return responseText;
    } else {
      console.log('\n❌ Authentication failed');

      if (response.status === 403) {
        console.log('🔧 Troubleshooting:');
        console.log('   • Check if email/password are correct');
        console.log('   • Verify 250-song trial is active');
        console.log('   • Contact WARM support if trial expired');
      } else if (response.status === 400) {
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
  testWarmAuth().catch(console.error);
}

module.exports = { testWarmAuth };

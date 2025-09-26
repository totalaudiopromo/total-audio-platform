#!/usr/bin/env node

/**
 * Final WARM API Test - Ready for Production
 * 
 * This script tests the WARM API with the correct credentials
 * Run this after Gustav adds your IP to the whitelist or rate limits clear
 */

require('dotenv').config();

async function testWarmAPI() {
  console.log('🎵 WARM API Final Test - Liberty Radio Promo Agent\n');
  
  // Test credentials (update with your actual password)
  const credentials = {
    email: 'promo@totalaudiopromo.com',
    password: process.env.WARM_API_PASSWORD || 'YOUR_ACTUAL_PASSWORD_HERE'
  };
  
  const apiUrl = 'https://public-api.warmmusic.net/api/v1';
  
  console.log('📧 Email:', credentials.email);
  console.log('🌐 API URL:', apiUrl);
  console.log('🔑 Password:', credentials.password.substring(0, 3) + '***');
  console.log('');
  
  try {
    console.log('🔐 Step 1: Testing Authentication...');
    const authResponse = await fetch(`${apiUrl}/auth/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Liberty-Music-PR-Agent/1.0'
      },
      body: JSON.stringify(credentials)
    });
    
    const authText = await authResponse.text();
    console.log('📡 Auth Status:', authResponse.status);
    console.log('📡 Auth Response:', authText);
    
    if (!authResponse.ok) {
      if (authResponse.status === 429) {
        console.log('\n⏳ Rate limited - wait a few minutes or ask Gustav to whitelist your IP');
        return;
      }
      throw new Error(`Auth failed: ${authResponse.status} - ${authText}`);
    }
    
    const token = authText;
    console.log('✅ Authentication successful!');
    console.log('🎫 Token:', token.substring(0, 50) + '...');
    console.log('');
    
    // Test getting UK radio stations
    console.log('📻 Step 2: Testing UK Radio Stations...');
    const stationsResponse = await fetch(`${apiUrl}/radio-stations?countryCode=GB&isMonitored=true`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!stationsResponse.ok) {
      throw new Error(`Stations failed: ${stationsResponse.status} - ${await stationsResponse.text()}`);
    }
    
    const stations = await stationsResponse.json();
    console.log('✅ UK Radio Stations:', stations.length);
    console.log('📻 Sample stations:', stations.slice(0, 3).map(s => s.name || s.radioStationName));
    console.log('');
    
    // Test getting plays for a test artist
    console.log('🎵 Step 3: Testing Play Data...');
    const playsResponse = await fetch(`${apiUrl}/plays?artistName=Test Artist&countryCode=GB`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!playsResponse.ok) {
      throw new Error(`Plays failed: ${playsResponse.status} - ${await playsResponse.text()}`);
    }
    
    const plays = await playsResponse.json();
    console.log('✅ Play Data API working');
    console.log('🎵 Sample plays:', plays.totalNumberOfEntities || 0);
    console.log('');
    
    console.log('🎉 WARM API Integration Test PASSED!');
    console.log('✅ Ready for Liberty Radio Promo Agent');
    
    return {
      success: true,
      token: token,
      stations: stations.length,
      plays: plays.totalNumberOfEntities || 0
    };
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    
    if (error.message.includes('429')) {
      console.log('\n🔧 Solution:');
      console.log('   1. Wait 10-15 minutes for rate limits to clear');
      console.log('   2. Or ask Gustav to whitelist your IP');
      console.log('   3. Then run this test again');
    } else if (error.message.includes('403')) {
      console.log('\n🔧 Solution:');
      console.log('   1. Check your password is correct');
      console.log('   2. Verify 250-song trial is active');
      console.log('   3. Contact Gustav if trial expired');
    }
    
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testWarmAPI().catch(console.error);
}

module.exports = { testWarmAPI };


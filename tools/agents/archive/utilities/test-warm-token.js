#!/usr/bin/env node

/**
 * WARM API Token Authentication Test
 * 
 * Tests the WARM API using JWT token instead of email/password
 */

require('dotenv').config();

async function testWarmWithToken() {
  console.log('🎵 WARM API Token Authentication Test\n');
  
  // Your JWT token from WARM OAuth
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5ERXpOakZFUTBVMVJrTkVSRGN6T1RGRk1qUkNRVGsxUVROQlJrRkRSRFF6TURVMU5rRXlSZyJ9.eyJpc3MiOiJodHRwczovL2F1dGgud2FybW11c2ljLm5ldC8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDgwMTI4MzQzMzIwNzMwMDkxNSIsImF1ZCI6IlRRcFY2Vm8zczY1VU1nTHJBeXpISExoa01EU2V3V1JkIiwiaWF0IjoxNzU4MTIxNTcyLCJleHAiOjE3NTgyMTE1NzJ9.nss_VlvUvOmIp07K2GSfm24f5nUcoXDfnV-_0JD3F1eBRIwYNaDkQJJeJcIG2YOQK1Hrlj1lAJ_jLE2exazfHLqMnnb3_P_hLlL_i8TxwJHq08zsK_XkRV0WO5T2Bl1p78YQT6A8jSXwXxZ5Pve3sL5wvcXz6Dqn09p-7uGsIrwUFSzNGiK6KLSk3Wn98KpQVaZsvsE8Fm-X-KVIGORVOosu3oikyj15MCWnkLaMDbgQ_re4VKKjBmyJPDymgaOCXz5sKAFttyUXd7NSDW4DzUUKxUZtvKMmLzgwcN6VSxgRk4zNbZZXptQ2QU6FtVHcIh8DoUe1_wazTrkPmxu93g';
  
  const apiUrl = 'https://public-api.warmmusic.net/api/v1';
  
  console.log('🎫 Token:', token.substring(0, 50) + '...');
  console.log('🌐 API URL:', apiUrl);
  console.log('⏰ Token expires: 2025-09-18T16:06:12.000Z');
  console.log('');
  
  try {
    // Test 1: Get UK radio stations
    console.log('📻 Step 1: Testing UK Radio Stations...');
    const stationsResponse = await fetch(`${apiUrl}/radio-stations?countryCode=GB&isMonitored=true`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Liberty-Music-PR-Agent/1.0'
      }
    });
    
    console.log('📡 Stations Status:', stationsResponse.status);
    
    if (!stationsResponse.ok) {
      const errorText = await stationsResponse.text();
      console.log('❌ Stations Error:', errorText);
      throw new Error(`Stations failed: ${stationsResponse.status} - ${errorText}`);
    }
    
    const stations = await stationsResponse.json();
    console.log('✅ UK Radio Stations Response:', JSON.stringify(stations, null, 2));
    
    // Handle different response formats
    const stationsList = stations.stations || stations.data || stations || [];
    console.log('📻 Stations count:', Array.isArray(stationsList) ? stationsList.length : 'Not an array');
    
    if (Array.isArray(stationsList) && stationsList.length > 0) {
      console.log('📻 Sample stations:', stationsList.slice(0, 3).map(s => s.name || s.radioStationName || s.stationName || s));
    }
    console.log('');
    
    // Test 2: Get plays for a test artist
    console.log('🎵 Step 2: Testing Play Data...');
    const playsResponse = await fetch(`${apiUrl}/plays?artistName=Test Artist&countryCode=GB`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Liberty-Music-PR-Agent/1.0'
      }
    });
    
    console.log('📡 Plays Status:', playsResponse.status);
    
    if (!playsResponse.ok) {
      const errorText = await playsResponse.text();
      console.log('❌ Plays Error:', errorText);
      throw new Error(`Plays failed: ${playsResponse.status} - ${errorText}`);
    }
    
    const plays = await playsResponse.json();
    console.log('✅ Play Data Response:', JSON.stringify(plays, null, 2));
    
    // Handle different response formats
    const playsList = plays.plays || plays.data || plays.currentPagesEntities || plays || [];
    const playCount = plays.totalNumberOfEntities || plays.total || (Array.isArray(playsList) ? playsList.length : 0);
    console.log('🎵 Play count:', playCount);
    console.log('');
    
    // Test 3: Try to get recent plays
    console.log('🎵 Step 3: Testing Recent Plays...');
    const recentResponse = await fetch(`${apiUrl}/plays/recent`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Liberty-Music-PR-Agent/1.0'
      }
    });
    
    console.log('📡 Recent Status:', recentResponse.status);
    
    if (recentResponse.ok) {
      const recent = await recentResponse.json();
      console.log('✅ Recent Plays Response:', JSON.stringify(recent, null, 2));
      
      const recentList = recent.plays || recent.data || recent.currentPagesEntities || recent || [];
      const recentCount = recent.totalNumberOfEntities || recent.total || (Array.isArray(recentList) ? recentList.length : 0);
      console.log('🎵 Recent plays count:', recentCount);
    } else {
      const errorText = await recentResponse.text();
      console.log('⚠️ Recent Plays Error:', errorText);
    }
    console.log('');
    
    console.log('🎉 WARM API Token Authentication Test PASSED!');
    console.log('✅ Token-based authentication is working');
    console.log('✅ Ready to update Liberty Radio Promo Agent');
    
    return {
      success: true,
      token: token,
      stations: stations.length,
      plays: plays.totalNumberOfEntities || plays.length || 0,
      tokenExpiry: '2025-09-18T16:06:12.000Z'
    };
    
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    
    if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n🔧 Solution:');
      console.log('   1. Token may be expired or invalid');
      console.log('   2. Get a fresh token from WARM dashboard');
      console.log('   3. Check if token has proper permissions');
    } else if (error.message.includes('429')) {
      console.log('\n🔧 Solution:');
      console.log('   1. Rate limited - wait a few minutes');
      console.log('   2. Or ask Gustav to whitelist your IP');
    }
    
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testWarmWithToken().catch(console.error);
}

module.exports = { testWarmWithToken };

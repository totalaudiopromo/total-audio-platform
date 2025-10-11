#!/usr/bin/env node

/**
 * WARM API Integration Test with Liberty Radio Promo Agent
 * 
 * Tests the updated WARM API integration using token authentication
 */

require('dotenv').config();

// Set the token as environment variable
process.env.WARM_API_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5ERXpOakZFUTBVMVJrTkVSRGN6T1RGRk1qUkNRVGsxUVROQlJrRkRSRFF6TURVMU5rRXlSZyJ9.eyJpc3MiOiJodHRwczovL2F1dGgud2FybW11c2ljLm5ldC8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDgwMTI4MzQzMzIwNzMwMDkxNSIsImF1ZCI6IlRRcFY2Vm8zczY1VU1nTHJBeXpISExoa01EU2V3V1JkIiwiaWF0IjoxNzU4MTIxNTcyLCJleHAiOjE3NTgyMTE1NzJ9.nss_VlvUvOmIp07K2GSfm24f5nUcoXDfnV-_0JD3F1eBRIwYNaDkQJJeJcIG2YOQK1Hrlj1lAJ_jLE2exazfHLqMnnb3_P_hLlL_i8TxwJHq08zsK_XkRV0WO5T2Bl1p78YQT6A8jSXwXxZ5Pve3sL5wvcXz6Dqn09p-7uGsIrwUFSzNGiK6KLSk3Wn98KpQVaZsvsE8Fm-X-KVIGORVOosu3oikyj15MCWnkLaMDbgQ_re4VKKjBmyJPDymgaOCXz5sKAFttyUXd7NSDW4DzUUKxUZtvKMmLzgwcN6VSxgRk4zNbZZXptQ2QU6FtVHcIh8DoUe1_wazTrkPmxu93g';

const WarmusicAPI = require('./integrations/warm-api');

async function testWarmIntegration() {
  console.log('🎵 WARM API Integration Test - Liberty Radio Promo Agent\n');
  
  try {
    // Initialize WARM API
    const warmAPI = new WarmusicAPI();
    
    // Test 1: Authentication
    console.log('🔐 Step 1: Testing Authentication...');
    const token = await warmAPI.authenticate();
    console.log('✅ Authentication successful');
    console.log(`🎫 Token: ${token.substring(0, 50)}...`);
    console.log('');
    
    // Test 2: Health Check
    console.log('🏥 Step 2: Testing Health Check...');
    const health = await warmAPI.healthCheck();
    console.log('✅ Health Check:', JSON.stringify(health, null, 2));
    console.log('');
    
    // Test 3: Get UK Radio Stations
    console.log('📻 Step 3: Testing UK Radio Stations...');
    const stationsData = await warmAPI.getUKRadioStations();
    console.log(`✅ Found ${stationsData.total} UK radio stations`);
    console.log(`📻 Sample stations:`, stationsData.stations.slice(0, 3).map(s => s.name));
    console.log('');
    
    // Test 4: Get Plays for Test Artist
    console.log('🎵 Step 4: Testing Play Data...');
    const playsData = await warmAPI.getPlaysForArtist('Test Artist');
    console.log(`✅ Found ${playsData.total} plays for Test Artist`);
    console.log('');
    
    // Test 5: Get Plays for Real Artist (if any)
    console.log('🎵 Step 5: Testing Real Artist Plays...');
    const realPlaysData = await warmAPI.getPlaysForArtist('Radiohead');
    console.log(`✅ Found ${realPlaysData.total} plays for Radiohead`);
    if (realPlaysData.plays.length > 0) {
      console.log(`🎵 Sample plays:`, realPlaysData.plays.slice(0, 2).map(p => ({
        artist: p.artistName,
        track: p.trackName,
        station: p.radioStationName,
        date: p.playDateTime
      })));
    }
    console.log('');
    
    // Test 6: Campaign Performance Summary
    console.log('📊 Step 6: Testing Campaign Performance Summary...');
    const campaignStartDate = new Date();
    campaignStartDate.setDate(campaignStartDate.getDate() - 30); // 30 days ago
    
    const performanceSummary = await warmAPI.generateCampaignPerformanceSummary('Radiohead', campaignStartDate.toISOString().split('T')[0]);
    console.log('✅ Campaign Performance Summary:', JSON.stringify(performanceSummary, null, 2));
    console.log('');
    
    console.log('🎉 WARM API Integration Test PASSED!');
    console.log('✅ All endpoints working correctly');
    console.log('✅ Ready for production use with Liberty Radio Promo Agent');
    
    return {
      success: true,
      token: token,
      stations: stationsData.total,
      plays: playsData.total,
      realPlays: realPlaysData.total,
      performance: performanceSummary
    };
    
  } catch (error) {
    console.log('\n❌ Integration test failed:', error.message);
    console.log('🔧 Error details:', error);
    
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testWarmIntegration().catch(console.error);
}

module.exports = { testWarmIntegration };


#!/usr/bin/env node

const WarmusicAPI = require('./integrations/warm-api.js');

async function getRealCampaignData() {
  const warmAPI = new WarmusicAPI();

  try {
    console.log('🔐 Authenticating with WARM API...');
    await warmAPI.authenticate();

    // Get Senior Dunce plays
    console.log('\n📊 Fetching Senior Dunce campaign data...');
    const seniorDunceData = await warmAPI.getCampaignPlaySummary('Senior Dunce', '2025-09-01');

    console.log('\n✅ REAL CAMPAIGN DATA:');
    console.log('=======================');
    console.log(`Artist: Senior Dunce`);
    console.log(`Total Plays: ${seniorDunceData.totalPlays}`);
    console.log(`Unique Stations: ${Object.keys(seniorDunceData.stationBreakdown).length}`);
    console.log('\nStation Breakdown:');
    Object.entries(seniorDunceData.stationBreakdown)
      .sort(([,a], [,b]) => b - a)
      .forEach(([station, plays]) => {
        console.log(`  - ${station}: ${plays} plays`);
      });

    // Try other artist names if you have them
    const otherArtists = ['sadact', 'KYARA'];
    for (const artist of otherArtists) {
      try {
        console.log(`\n📊 Checking ${artist}...`);
        const data = await warmAPI.getCampaignPlaySummary(artist, '2025-09-01');
        if (data.totalPlays > 0) {
          console.log(`  ✅ ${artist}: ${data.totalPlays} plays across ${Object.keys(data.stationBreakdown).length} stations`);
        }
      } catch (err) {
        console.log(`  ⚠️ ${artist}: No data or error`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);

    // Check if it's auth issue
    if (error.message.includes('403') || error.message.includes('credentials')) {
      console.log('\n💡 WARM API credentials issue. You need to:');
      console.log('1. Check if WARM_API_TOKEN or WARM_API_EMAIL/PASSWORD are set in .env');
      console.log('2. Verify your WARM account is active (250-song trial)');
      console.log('3. Get a new API token from WARM dashboard if needed');
    }
  }
}

getRealCampaignData();
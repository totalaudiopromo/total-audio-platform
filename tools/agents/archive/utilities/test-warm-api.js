#!/usr/bin/env node

/**
 * Test script for WARM API integration
 * Tests authentication, play checking, and report generation
 */

require('dotenv').config();
const WarmusicAPI = require('./integrations/warm-api');

async function testWarmAPI() {
  console.log('🎵 Testing WARM API Integration for Liberty Music PR...\n');

  const warmApi = new WarmusicAPI();

  try {
    // Test 1: Health Check
    console.log('1. 🔍 Testing WARM API Health Check...');
    const healthStatus = await warmApi.healthCheck();
    console.log('Health Status:', JSON.stringify(healthStatus, null, 2));

    if (healthStatus.status !== 'healthy') {
      console.error('❌ WARM API is not healthy. Check credentials.');
      return;
    }

    console.log('✅ WARM API is healthy and authenticated\n');

    // Test 2: Get UK Radio Stations
    console.log('2. 📻 Testing UK Radio Stations Fetch...');
    const stations = await warmApi.getUKRadioStations();
    console.log(`Found ${stations.length} UK radio stations:`);

    // Show first 5 stations
    stations.slice(0, 5).forEach((station, index) => {
      console.log(
        `   ${index + 1}. ${station.name || station.stationName || 'Unknown'} (${station.countryCode || 'GB'})`
      );
    });

    if (stations.length > 5) {
      console.log(`   ... and ${stations.length - 5} more stations`);
    }

    console.log('✅ UK Radio Stations fetched successfully\n');

    // Test 3: Check Plays for a Test Artist
    console.log('3. 🎵 Testing Artist Play Checking...');
    const testArtist = 'Ed Sheeran'; // Known artist for testing
    const sixWeeksAgo = new Date();
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);
    const startDate = sixWeeksAgo.toISOString().split('T')[0];

    console.log(`Checking plays for ${testArtist} from ${startDate}...`);
    const plays = await warmApi.getLibertyArtistPlays(testArtist, startDate);

    console.log(`Found ${plays.length} plays for ${testArtist}`);

    if (plays.length > 0) {
      // Group by station
      const stationPlays = {};
      plays.forEach(play => {
        const station = play.radioStation || play.station || 'Unknown Station';
        if (!stationPlays[station]) {
          stationPlays[station] = 0;
        }
        stationPlays[station]++;
      });

      console.log('Station breakdown:');
      Object.entries(stationPlays).forEach(([station, count]) => {
        console.log(`   📻 ${station}: ${count} plays`);
      });
    }

    console.log('✅ Artist play checking successful\n');

    // Test 4: Campaign Summary
    console.log('4. 📊 Testing Campaign Play Summary...');
    const summary = await warmApi.getCampaignPlaySummary(testArtist, startDate);
    console.log('Campaign Summary:', JSON.stringify(summary, null, 2));
    console.log('✅ Campaign summary generated successfully\n');

    // Test 5: CSV Report Generation
    console.log('5. 📄 Testing CSV Report Generation...');
    const csvData = await warmApi.generateCSVReport(
      testArtist,
      startDate,
      new Date().toISOString().split('T')[0]
    );
    console.log(`Generated CSV report (${csvData.length} characters)`);

    // Save a sample CSV for inspection
    const fs = require('fs');
    const path = require('path');
    const sampleFile = path.join(__dirname, 'sample_warm_report.csv');
    fs.writeFileSync(sampleFile, csvData);
    console.log(`Sample CSV saved to: ${sampleFile}`);

    console.log('✅ CSV report generation successful\n');

    console.log('🎉 All WARM API tests completed successfully!');
    console.log('\n📋 Available WARM API Methods:');
    console.log('   • warmApi.authenticate() - Get auth token');
    console.log('   • warmApi.getUKRadioStations() - Get monitored UK stations');
    console.log('   • warmApi.getLibertyArtistPlays(artist, startDate) - Get artist plays');
    console.log('   • warmApi.getCampaignPlaySummary(artist, startDate) - Get campaign summary');
    console.log('   • warmApi.generateCSVReport(artist, startDate, endDate) - Generate CSV report');
    console.log('   • warmApi.healthCheck() - Check API status');
  } catch (error) {
    console.error('❌ WARM API test failed:', error.message);
    console.error('Full error:', error);

    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your WARM_API_PASSWORD in .env file');
      console.log('2. Verify credentials at promo@totalaudiopromo.com');
      console.log('3. Ensure WARM API access is active');
    }
  }
}

// Run the test
if (require.main === module) {
  testWarmAPI().catch(console.error);
}

module.exports = { testWarmAPI };

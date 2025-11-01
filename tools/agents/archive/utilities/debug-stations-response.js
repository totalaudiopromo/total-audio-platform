#!/usr/bin/env node

/**
 * Debug WARM Stations Response
 *
 * Let's see exactly what we're getting from the API
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function debugStationsResponse() {
  console.log('🔍 Debugging WARM Stations Response\n');

  try {
    const warm = new WarmusicAPI();

    // Get raw response
    console.log('📻 Fetching UK radio stations...');
    const response = await fetch(
      'https://public-api.warmmusic.net/api/v1/radio-stations?countryCode=GB&isMonitored=true',
      {
        headers: {
          Authorization: `Bearer ${process.env.WARM_API_TOKEN}`,
          'User-Agent': 'Liberty-Music-PR-Agent/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📊 Raw API Response:');
    console.log(JSON.stringify(data, null, 2));

    // Check if it's paginated
    if (data.currentPagesEntities) {
      console.log('\n📄 PAGINATED RESPONSE DETECTED:');
      console.log(`   • Current Page Entities: ${data.currentPagesEntities.length}`);
      console.log(`   • Total Entities: ${data.totalNumberOfEntities}`);
      console.log(`   • Has More: ${data.hasMore}`);
      console.log(`   • Page Size: ${data.pageSize}`);

      // Show first few stations
      console.log('\n📻 SAMPLE STATIONS:');
      data.currentPagesEntities.slice(0, 5).forEach((station, i) => {
        console.log(`   ${i + 1}. ${station.name || station.radioStationName || 'Unknown'}`);
        console.log(`      Category: ${station.category || 'Unknown'}`);
        console.log(`      Type: ${station.type || 'Unknown'}`);
        console.log('');
      });
    } else {
      console.log('\n📄 NON-PAGINATED RESPONSE:');
      console.log(`   • Stations Count: ${Array.isArray(data) ? data.length : 'Not an array'}`);

      if (Array.isArray(data) && data.length > 0) {
        console.log('\n📻 SAMPLE STATIONS:');
        data.slice(0, 5).forEach((station, i) => {
          console.log(`   ${i + 1}. ${station.name || station.radioStationName || 'Unknown'}`);
          console.log(`      Category: ${station.category || 'Unknown'}`);
          console.log(`      Type: ${station.type || 'Unknown'}`);
          console.log('');
        });
      }
    }

    // Look for house pop relevant stations
    console.log('🎵 SEARCHING FOR HOUSE POP RELEVANT STATIONS:\n');

    const allStations = data.currentPagesEntities || data.stations || data.data || data || [];
    const housePopKeywords = [
      'bbc radio 1',
      'bbc radio 2',
      'capital',
      'heart',
      'kiss',
      'magic',
      'smooth',
      'virgin',
      '1xtra',
      'xtra',
      'dance',
      'electronic',
      'ministry',
      'rinse',
      'amazing',
      'boom',
      'union',
      'planet',
    ];

    const relevantStations = allStations.filter(station => {
      const name = (station.name || station.radioStationName || '').toLowerCase();
      return housePopKeywords.some(keyword => name.includes(keyword));
    });

    console.log(`🎯 Found ${relevantStations.length} house pop relevant stations:`);
    relevantStations.forEach((station, i) => {
      console.log(`   ${i + 1}. ${station.name || station.radioStationName}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      Type: ${station.type || 'Unknown'}`);
      console.log('');
    });

    // If we have pagination, let's get more stations
    if (data.hasMore && data.currentPagesEntities) {
      console.log('📄 FETCHING MORE STATIONS...\n');

      const page2Response = await fetch(
        'https://public-api.warmmusic.net/api/v1/radio-stations?countryCode=GB&isMonitored=true&page=2',
        {
          headers: {
            Authorization: `Bearer ${process.env.WARM_API_TOKEN}`,
            'User-Agent': 'Liberty-Music-PR-Agent/1.0',
          },
        }
      );

      if (page2Response.ok) {
        const page2Data = await page2Response.json();
        console.log(`📊 Page 2 Response: ${page2Data.currentPagesEntities?.length || 0} stations`);

        if (page2Data.currentPagesEntities) {
          console.log('\n📻 PAGE 2 SAMPLE STATIONS:');
          page2Data.currentPagesEntities.slice(0, 5).forEach((station, i) => {
            console.log(`   ${i + 1}. ${station.name || station.radioStationName || 'Unknown'}`);
            console.log(`      Category: ${station.category || 'Unknown'}`);
            console.log(`      Type: ${station.type || 'Unknown'}`);
            console.log('');
          });
        }
      }
    }
  } catch (error) {
    console.log('❌ Error debugging stations:', error.message);
    throw error;
  }
}

// Run the debug
if (require.main === module) {
  debugStationsResponse().catch(console.error);
}

module.exports = { debugStationsResponse };

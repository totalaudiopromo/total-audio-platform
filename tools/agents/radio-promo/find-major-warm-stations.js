#!/usr/bin/env node

/**
 * Find Major Stations in WARM
 *
 * Search through multiple pages to find BBC, commercial, and major stations
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function findMajorWarmStations() {
  console.log('📻 Finding Major Stations in WARM\n');

  try {
    const warm = new WarmusicAPI();

    // Get total count first
    console.log('📊 Getting total station count...');
    const stationsData = await warm.getUKRadioStations();
    console.log(`✅ Total UK stations in WARM: ${stationsData.total}\n`);

    // Search through multiple pages for major stations
    const majorStations = {
      bbc: [],
      commercial: [],
      dance: [],
      online: [],
      other: [],
    };

    const majorStationKeywords = {
      bbc: [
        'bbc radio 1',
        'bbc radio 2',
        'bbc radio 3',
        'bbc radio 4',
        'bbc 6 music',
        'bbc 1xtra',
        'radio 1',
        'radio 2',
        'radio 3',
        'radio 4',
        '6 music',
        '1xtra',
      ],
      commercial: [
        'capital',
        'heart',
        'kiss',
        'magic',
        'smooth',
        'virgin',
        'absolute',
        'classic fm',
        'lbc',
      ],
      dance: ['ministry', 'rinse', 'amazing', 'boom', 'dance', 'electronic'],
      online: ['union jack', 'planet', 'online', 'digital', 'streaming'],
    };

    console.log('🔍 Searching through WARM stations for major targets...\n');

    // Search through first 20 pages (200 stations)
    for (let page = 1; page <= 20; page++) {
      try {
        const response = await fetch(
          `https://public-api.warmmusic.net/api/v1/radio-stations?countryCode=GB&isMonitored=true&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.WARM_API_TOKEN}`,
              'User-Agent': 'Liberty-Music-PR-Agent/1.0',
            },
          }
        );

        if (response.ok) {
          const pageData = await response.json();
          const pageStations = pageData.currentPagesEntities || [];

          pageStations.forEach(station => {
            const name = station.name.toLowerCase();
            const category = station.category || '';
            const city = station.city?.name || '';

            // Check for BBC stations
            if (majorStationKeywords.bbc.some(keyword => name.includes(keyword))) {
              majorStations.bbc.push({
                name: station.name,
                category: category,
                city: city,
                externalId: station.externalId,
                priority: 'Critical',
                reason: 'BBC mainstream appeal',
              });
            }
            // Check for commercial stations
            else if (majorStationKeywords.commercial.some(keyword => name.includes(keyword))) {
              majorStations.commercial.push({
                name: station.name,
                category: category,
                city: city,
                externalId: station.externalId,
                priority: 'Critical',
                reason: 'Commercial mainstream appeal',
              });
            }
            // Check for dance/electronic stations
            else if (majorStationKeywords.dance.some(keyword => name.includes(keyword))) {
              majorStations.dance.push({
                name: station.name,
                category: category,
                city: city,
                externalId: station.externalId,
                priority: 'High',
                reason: 'Dance/electronic focus',
              });
            }
            // Check for online stations
            else if (majorStationKeywords.online.some(keyword => name.includes(keyword))) {
              majorStations.online.push({
                name: station.name,
                category: category,
                city: city,
                externalId: station.externalId,
                priority: 'Medium',
                reason: 'Online/digital platform',
              });
            }
          });

          console.log(`   Page ${page}: Found ${pageStations.length} stations`);

          // Show any major stations found on this page
          const majorFound = pageStations.filter(station => {
            const name = station.name.toLowerCase();
            return (
              majorStationKeywords.bbc.some(k => name.includes(k)) ||
              majorStationKeywords.commercial.some(k => name.includes(k)) ||
              majorStationKeywords.dance.some(k => name.includes(k)) ||
              majorStationKeywords.online.some(k => name.includes(k))
            );
          });

          if (majorFound.length > 0) {
            console.log(`   🎯 Major stations on page ${page}:`);
            majorFound.forEach(station => {
              console.log(
                `      • ${station.name} (${station.category}) - ${station.city?.name || 'Unknown'}`
              );
            });
          }
        } else {
          console.log(`   Page ${page}: Error ${response.status}`);
        }
      } catch (error) {
        console.log(`   Page ${page}: Error - ${error.message}`);
      }
    }

    // Display results
    console.log('\n🎯 MAJOR STATIONS FOUND IN WARM:\n');

    console.log('📻 BBC STATIONS (Critical Priority):');
    majorStations.bbc.forEach((station, i) => {
      console.log(`   ${i + 1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      City: ${station.city || 'Unknown'}`);
      console.log(`      External ID: ${station.externalId}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });

    console.log('📻 COMMERCIAL STATIONS (Critical Priority):');
    majorStations.commercial.forEach((station, i) => {
      console.log(`   ${i + 1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      City: ${station.city || 'Unknown'}`);
      console.log(`      External ID: ${station.externalId}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });

    console.log('📻 DANCE/ELECTRONIC STATIONS (High Priority):');
    majorStations.dance.forEach((station, i) => {
      console.log(`   ${i + 1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      City: ${station.city || 'Unknown'}`);
      console.log(`      External ID: ${station.externalId}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });

    console.log('📻 ONLINE/DIGITAL STATIONS (Medium Priority):');
    majorStations.online.forEach((station, i) => {
      console.log(`   ${i + 1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      External ID: ${station.externalId}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });

    // Summary
    const totalMajor =
      majorStations.bbc.length +
      majorStations.commercial.length +
      majorStations.dance.length +
      majorStations.online.length;

    console.log('📊 SUMMARY:\n');
    console.log(`   • Total WARM Stations: ${stationsData.total}`);
    console.log(`   • Pages Searched: 20 (200 stations)`);
    console.log(`   • BBC Stations Found: ${majorStations.bbc.length}`);
    console.log(`   • Commercial Stations Found: ${majorStations.commercial.length}`);
    console.log(`   • Dance/Electronic Found: ${majorStations.dance.length}`);
    console.log(`   • Online/Digital Found: ${majorStations.online.length}`);
    console.log(`   • Total Major Targets: ${totalMajor}`);

    if (totalMajor > 0) {
      console.log('\n✅ Great! We found major stations in WARM that we can target.');
      console.log('   These stations are monitored by WARM, so we can track actual plays.');
    } else {
      console.log('\n⚠️  No major stations found in first 20 pages.');
      console.log('   Major stations might be on later pages or have different names.');
    }

    return {
      totalStations: stationsData.total,
      majorStations,
      totalMajor,
    };
  } catch (error) {
    console.log('❌ Error finding major WARM stations:', error.message);
    throw error;
  }
}

// Run the search
if (require.main === module) {
  findMajorWarmStations().catch(console.error);
}

module.exports = { findMajorWarmStations };



#!/usr/bin/env node

/**
 * Senior Dunce - Bestial House Pop Targeting Strategy
 * 
 * Proper targeting for classic house pop track
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function bestialHousePopStrategy() {
  console.log('🎵 Senior Dunce - Bestial House Pop Targeting Strategy\n');
  
  try {
    const warm = new WarmusicAPI();
    
    // Get current performance
    console.log('📊 Current Campaign Performance:');
    const playsData = await warm.getPlaysForArtist('Senior Dunce');
    console.log(`   • Total Plays: ${playsData.total}`);
    console.log(`   • Supporting Stations: ${playsData.plays ? playsData.plays.length : 0}`);
    
    if (playsData.plays && playsData.plays.length > 0) {
      console.log('   • Current Supporters:');
      playsData.plays.slice(0, 5).forEach((play, i) => {
        const station = play.radioStationName || play.stationName || 'Unknown';
        console.log(`     ${i+1}. ${station}`);
      });
    }
    
    // Get UK stations for house pop targeting
    console.log('\n📻 Finding House Pop Target Stations...');
    const stationsData = await warm.getUKRadioStations();
    
    // House Pop targeting criteria
    const housePopTargets = {
      // Major Commercial - House Pop fits mainstream
      majorCommercial: [
        'BBC Radio 1',
        'BBC Radio 2', 
        'Capital FM',
        'Heart',
        'Kiss FM',
        'Magic',
        'Smooth Radio',
        'Virgin Radio'
      ],
      
      // Dance/Electronic focused
      danceElectronic: [
        'BBC Radio 1Xtra',
        'Kiss FM',
        'Capital XTRA',
        'Ministry of Sound Radio',
        'Rinse FM',
        'Amazing Radio'
      ],
      
      // Club/DJ focused
      clubDJ: [
        'BBC Radio 1 Dance',
        'Ministry of Sound Radio',
        'Rinse FM',
        'Kiss FM',
        'Capital XTRA'
      ],
      
      // Online/Digital first
      onlineDigital: [
        'Amazing Radio',
        'Boom Radio',
        'Union JACK',
        'Planet Radio'
      ]
    };
    
    // Find actual stations from WARM data that match house pop criteria
    const actualTargets = {
      major: [],
      dance: [],
      club: [],
      online: []
    };
    
    stationsData.stations.forEach(station => {
      const name = station.name.toLowerCase();
      
      // Major commercial stations
      if (name.includes('bbc radio 1') || name.includes('bbc radio 2') || 
          name.includes('capital') || name.includes('heart') || 
          name.includes('kiss') || name.includes('magic') ||
          name.includes('smooth') || name.includes('virgin')) {
        actualTargets.major.push({
          name: station.name,
          category: station.category || 'Unknown',
          priority: 'Critical',
          pitch: 'Commercial house pop with mainstream appeal'
        });
      }
      // Dance/Electronic stations
      else if (name.includes('1xtra') || name.includes('xtra') || 
               name.includes('ministry') || name.includes('rinse') ||
               name.includes('amazing')) {
        actualTargets.dance.push({
          name: station.name,
          category: station.category || 'Unknown',
          priority: 'High',
          pitch: 'Dance/electronic focused - perfect for house pop'
        });
      }
      // Online/Digital stations
      else if (name.includes('amazing') || name.includes('boom') || 
               name.includes('union') || name.includes('planet')) {
        actualTargets.online.push({
          name: station.name,
          category: station.category || 'Unknown',
          priority: 'Medium',
          pitch: 'Digital-first approach, house pop friendly'
        });
      }
    });
    
    // Display targeting strategy
    console.log('🎯 HOUSE POP TARGETING STRATEGY\n');
    
    console.log('📊 MAJOR COMMERCIAL STATIONS (Critical Priority):');
    actualTargets.major.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Pitch: ${station.pitch}`);
      console.log('');
    });
    
    console.log('📊 DANCE/ELECTRONIC STATIONS (High Priority):');
    actualTargets.dance.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Pitch: ${station.pitch}`);
      console.log('');
    });
    
    console.log('📊 ONLINE/DIGITAL STATIONS (Medium Priority):');
    actualTargets.online.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Pitch: ${station.pitch}`);
      console.log('');
    });
    
    // House Pop specific pitch recommendations
    console.log('📝 HOUSE POP PITCH RECOMMENDATIONS:\n');
    
    console.log('🎯 For Major Commercial Stations:');
    console.log('   Subject: "Classic House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a classic house pop track');
    console.log('   that would work perfectly for your mainstream audience. Senior Dunce');
    console.log('   - Bestial combines nostalgic house elements with modern pop sensibilities.');
    console.log('   Perfect for drive time and evening shows."');
    console.log('');
    
    console.log('🎯 For Dance/Electronic Stations:');
    console.log('   Subject: "New House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a fresh house pop track');
    console.log('   that bridges classic house and modern pop. Senior Dunce - Bestial');
    console.log('   has the dancefloor appeal your listeners expect with commercial');
    console.log('   radio potential."');
    console.log('');
    
    console.log('🎯 For Online/Digital Stations:');
    console.log('   Subject: "Indie House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have an indie house pop track');
    console.log('   that\'s perfect for your digital audience. Senior Dunce - Bestial');
    console.log('   combines underground house vibes with accessible pop hooks."');
    console.log('');
    
    // Optimal timing for house pop
    console.log('⏰ OPTIMAL TIMING FOR HOUSE POP:\n');
    console.log('   • Drive Time: 16:00-18:00 (commercial appeal)');
    console.log('   • Evening: 19:00-22:00 (dance/electronic shows)');
    console.log('   • Late Night: 22:00-02:00 (club/DJ shows)');
    console.log('   • Weekend: Saturday/Sunday (dance music focus)');
    console.log('');
    
    // Campaign phases
    console.log('📋 CAMPAIGN PHASES:\n');
    
    console.log('Phase 1 - Immediate (This Week):');
    console.log('   • Target major commercial stations (BBC Radio 1, Capital, Heart)');
    console.log('   • Emphasize mainstream appeal and commercial potential');
    console.log('   • Focus on drive time and evening shows');
    console.log('');
    
    console.log('Phase 2 - Dance Focus (Next Week):');
    console.log('   • Target dance/electronic stations (1Xtra, Kiss, Capital XTRA)');
    console.log('   • Highlight house elements and dancefloor appeal');
    console.log('   • Target specialist dance shows');
    console.log('');
    
    console.log('Phase 3 - Digital Expansion (Week 3-4):');
    console.log('   • Target online/digital stations');
    console.log('   • Build grassroots support');
    console.log('   • Create momentum for major station consideration');
    console.log('');
    
    // Success metrics
    console.log('📊 SUCCESS METRICS:\n');
    console.log(`   • Current Plays: ${playsData.total}`);
    console.log('   • Target: 100+ plays by end of month');
    console.log('   • Major Stations: 3+ BBC or commercial stations');
    console.log('   • Dance Stations: 5+ dance/electronic stations');
    console.log('   • Playlist Adds: 5+ confirmed playlist placements');
    console.log('');
    
    // Key differentiators for house pop
    console.log('🎵 HOUSE POP KEY SELLING POINTS:\n');
    console.log('   • Commercial appeal with dance credibility');
    console.log('   • Nostalgic house elements appeal to 25-45 demographic');
    console.log('   • Perfect for drive time and evening shows');
    console.log('   • Bridge between mainstream pop and underground house');
    console.log('   • Strong potential for club play and radio play');
    console.log('');
    
    return {
      currentPlays: playsData.total,
      targets: {
        major: actualTargets.major.length,
        dance: actualTargets.dance.length,
        online: actualTargets.online.length
      },
      strategy: 'House pop targeting: major commercial → dance/electronic → online/digital'
    };
    
  } catch (error) {
    console.log('❌ Error in house pop strategy:', error.message);
    throw error;
  }
}

// Run the strategy
if (require.main === module) {
  bestialHousePopStrategy().catch(console.error);
}

module.exports = { bestialHousePopStrategy };

















#!/usr/bin/env node

/**
 * Senior Dunce - Bestial Radio Station Targeting
 * 
 * Comprehensive targeting strategy using WARM API data
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function targetBestialStations() {
  console.log('🎵 Senior Dunce - Bestial Radio Station Targeting\n');
  
  try {
    const warm = new WarmusicAPI();
    
    // Get all UK radio stations
    console.log('📻 Fetching UK radio stations...');
    const stationsData = await warm.getUKRadioStations();
    console.log(`✅ Found ${stationsData.total} UK radio stations\n`);
    
    // Define targeting criteria for indie/alternative music
    const targetingCriteria = {
      indie: ['indie', 'alternative', '6 music', 'amazing', 'kerrang', 'xfm', 'radio x'],
      bbc: ['bbc radio 1', 'bbc radio 2', 'bbc radio 6', 'bbc radio 1xtra'],
      commercial: ['capital', 'heart', 'kiss', 'magic', 'smooth', 'absolute', 'virgin'],
      specialist: ['kerrang', 'planet rock', 'jazz fm', 'classic fm'],
      online: ['amazing', 'boom', 'union jack', 'planet radio'],
      regional: ['key', 'city', 'clyde', 'cool', 'wave', 'metro', 'hallam']
    };
    
    // Categorize stations
    const categorizedStations = {
      tier1: [],
      tier2: [],
      specialist: [],
      online: [],
      regional: [],
      community: []
    };
    
    stationsData.stations.forEach(station => {
      const name = station.name.toLowerCase();
      const category = station.category || '';
      
      // Tier 1 - Major BBC and Commercial
      if (name.includes('bbc radio 1') || name.includes('bbc radio 2') || 
          name.includes('capital fm') || name.includes('heart') || 
          name.includes('kiss fm') || name.includes('magic')) {
        categorizedStations.tier1.push({
          name: station.name,
          category: category,
          priority: 'Critical',
          pitch: 'Major commercial potential - emphasize broad appeal'
        });
      }
      // Tier 2 - BBC 6 Music, Absolute, Virgin
      else if (name.includes('bbc radio 6') || name.includes('absolute') || 
               name.includes('virgin') || name.includes('smooth')) {
        categorizedStations.tier2.push({
          name: station.name,
          category: category,
          priority: 'High',
          pitch: 'Indie credibility and artistic merit'
        });
      }
      // Specialist - Alternative/Indie focused
      else if (name.includes('kerrang') || name.includes('xfm') || 
               name.includes('radio x') || name.includes('planet rock')) {
        categorizedStations.specialist.push({
          name: station.name,
          category: category,
          priority: 'High',
          pitch: 'Alternative/rock elements and indie appeal'
        });
      }
      // Online - Digital first
      else if (name.includes('amazing') || name.includes('boom') || 
               name.includes('union jack') || name.includes('planet radio')) {
        categorizedStations.online.push({
          name: station.name,
          category: category,
          priority: 'Medium',
          pitch: 'Unique sound and digital-first approach'
        });
      }
      // Regional - Local reach
      else if (name.includes('key') || name.includes('city') || 
               name.includes('clyde') || name.includes('cool') || 
               name.includes('wave') || name.includes('metro')) {
        categorizedStations.regional.push({
          name: station.name,
          category: category,
          priority: 'Medium',
          pitch: 'Local indie scene and community support'
        });
      }
      // Community - Grassroots
      else if (category.includes('COMMUNITY') || name.includes('community') || 
               name.includes('student') || name.includes('hospital')) {
        categorizedStations.community.push({
          name: station.name,
          category: category,
          priority: 'Low',
          pitch: 'Grassroots support and local music scene'
        });
      }
    });
    
    // Display targeting strategy
    console.log('🎯 RADIO STATION TARGETING STRATEGY\n');
    
    console.log('📊 TIER 1 - CRITICAL TARGETS:');
    categorizedStations.tier1.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority} | Pitch: ${station.pitch}`);
    });
    
    console.log('\n📊 TIER 2 - HIGH PRIORITY:');
    categorizedStations.tier2.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority} | Pitch: ${station.pitch}`);
    });
    
    console.log('\n📊 SPECIALIST - ALTERNATIVE/INDIE:');
    categorizedStations.specialist.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority} | Pitch: ${station.pitch}`);
    });
    
    console.log('\n📊 ONLINE - DIGITAL FIRST:');
    categorizedStations.online.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority} | Pitch: ${station.pitch}`);
    });
    
    console.log('\n📊 REGIONAL - LOCAL REACH:');
    categorizedStations.regional.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
      console.log(`      Priority: ${station.priority} | Pitch: ${station.pitch}`);
    });
    
    // Generate pitch recommendations
    console.log('\n📝 PITCH RECOMMENDATIONS:\n');
    
    console.log('🎯 TOP 10 PRIORITY TARGETS:');
    const allTargets = [
      ...categorizedStations.tier1.slice(0, 3),
      ...categorizedStations.tier2.slice(0, 4),
      ...categorizedStations.specialist.slice(0, 3)
    ];
    
    allTargets.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Pitch Angle: ${station.pitch}`);
      console.log(`      Next Step: Research contact details and send personalized pitch`);
      console.log('');
    });
    
    // Campaign strategy
    console.log('📋 CAMPAIGN STRATEGY:\n');
    console.log('Phase 1 - Immediate (This Week):');
    console.log('   • Target Tier 1 stations with commercial pitch');
    console.log('   • Focus on BBC Radio 6 Music and Absolute Radio');
    console.log('   • Emphasize track\'s commercial potential');
    console.log('');
    
    console.log('Phase 2 - Follow-up (Next Week):');
    console.log('   • Target specialist and online stations');
    console.log('   • Highlight indie credibility and unique sound');
    console.log('   • Use current play data as social proof');
    console.log('');
    
    console.log('Phase 3 - Expansion (Week 3-4):');
    console.log('   • Target regional and community stations');
    console.log('   • Build grassroots support');
    console.log('   • Create momentum for major station consideration');
    console.log('');
    
    // Summary
    const totalTargets = Object.values(categorizedStations).reduce((sum, arr) => sum + arr.length, 0);
    console.log('📊 SUMMARY:');
    console.log(`   • Total UK Stations: ${stationsData.total}`);
    console.log(`   • Categorized Targets: ${totalTargets}`);
    console.log(`   • Tier 1 (Critical): ${categorizedStations.tier1.length}`);
    console.log(`   • Tier 2 (High): ${categorizedStations.tier2.length}`);
    console.log(`   • Specialist: ${categorizedStations.specialist.length}`);
    console.log(`   • Online: ${categorizedStations.online.length}`);
    console.log(`   • Regional: ${categorizedStations.regional.length}`);
    console.log(`   • Community: ${categorizedStations.community.length}`);
    
    return {
      totalStations: stationsData.total,
      categorizedStations,
      topTargets: allTargets,
      strategy: {
        phase1: 'Tier 1 commercial stations',
        phase2: 'Specialist and online stations', 
        phase3: 'Regional and community stations'
      }
    };
    
  } catch (error) {
    console.log('❌ Error in targeting strategy:', error.message);
    throw error;
  }
}

// Run the targeting strategy
if (require.main === module) {
  targetBestialStations().catch(console.error);
}

module.exports = { targetBestialStations };












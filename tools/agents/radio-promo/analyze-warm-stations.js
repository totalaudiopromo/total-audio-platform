#!/usr/bin/env node

/**
 * Analyze WARM Stations for House Pop Targeting
 * 
 * Let's see what stations we actually have available
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function analyzeWarmStations() {
  console.log('📻 Analyzing WARM Stations for House Pop Targeting\n');
  
  try {
    const warm = new WarmusicAPI();
    
    // Get all UK stations
    console.log('📻 Fetching UK radio stations...');
    const stationsData = await warm.getUKRadioStations();
    const stations = stationsData.stations || [];
    
    console.log(`✅ Found ${stations.length} UK radio stations\n`);
    
    // Analyze station names and categories
    console.log('📊 STATION ANALYSIS:\n');
    
    // Group by potential categories
    const categories = {
      bbc: [],
      commercial: [],
      dance: [],
      indie: [],
      community: [],
      online: [],
      other: []
    };
    
    stations.forEach(station => {
      const name = station.name.toLowerCase();
      const category = station.category || 'Unknown';
      
      if (name.includes('bbc')) {
        categories.bbc.push({ name: station.name, category });
      } else if (name.includes('capital') || name.includes('heart') || 
                 name.includes('kiss') || name.includes('magic') ||
                 name.includes('smooth') || name.includes('virgin') ||
                 name.includes('absolute')) {
        categories.commercial.push({ name: station.name, category });
      } else if (name.includes('dance') || name.includes('electronic') ||
                 name.includes('1xtra') || name.includes('xtra') ||
                 name.includes('ministry') || name.includes('rinse')) {
        categories.dance.push({ name: station.name, category });
      } else if (name.includes('indie') || name.includes('alternative') ||
                 name.includes('6 music') || name.includes('amazing')) {
        categories.indie.push({ name: station.name, category });
      } else if (name.includes('community') || name.includes('local') ||
                 name.includes('fm') || name.includes('radio')) {
        categories.community.push({ name: station.name, category });
      } else if (name.includes('online') || name.includes('digital') ||
                 name.includes('streaming')) {
        categories.online.push({ name: station.name, category });
      } else {
        categories.other.push({ name: station.name, category });
      }
    });
    
    // Display results
    console.log('🎯 BBC STATIONS:');
    categories.bbc.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
    });
    console.log(`   ... and ${categories.bbc.length - 10} more\n`);
    
    console.log('🎯 COMMERCIAL STATIONS:');
    categories.commercial.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
    });
    console.log(`   ... and ${categories.commercial.length - 10} more\n`);
    
    console.log('🎯 DANCE/ELECTRONIC STATIONS:');
    categories.dance.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
    });
    console.log(`   ... and ${categories.dance.length - 10} more\n`);
    
    console.log('🎯 INDIE/ALTERNATIVE STATIONS:');
    categories.indie.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
    });
    console.log(`   ... and ${categories.indie.length - 10} more\n`);
    
    console.log('🎯 COMMUNITY STATIONS:');
    categories.community.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category})`);
    });
    console.log(`   ... and ${categories.community.length - 10} more\n`);
    
    // Look for house pop specific targets
    console.log('🎵 HOUSE POP TARGET RECOMMENDATIONS:\n');
    
    const housePopTargets = [];
    
    // BBC stations that would work for house pop
    categories.bbc.forEach(station => {
      const name = station.name.toLowerCase();
      if (name.includes('radio 1') || name.includes('radio 2') || 
          name.includes('1xtra') || name.includes('6 music')) {
        housePopTargets.push({
          name: station.name,
          category: station.category,
          priority: name.includes('radio 1') ? 'Critical' : 'High',
          reason: 'BBC mainstream appeal'
        });
      }
    });
    
    // Commercial stations
    categories.commercial.forEach(station => {
      const name = station.name.toLowerCase();
      if (name.includes('capital') || name.includes('heart') || 
          name.includes('kiss') || name.includes('magic')) {
        housePopTargets.push({
          name: station.name,
          category: station.category,
          priority: 'Critical',
          reason: 'Commercial mainstream appeal'
        });
      }
    });
    
    // Dance/Electronic stations
    categories.dance.forEach(station => {
      housePopTargets.push({
        name: station.name,
        category: station.category,
        priority: 'High',
        reason: 'Dance/electronic focus'
      });
    });
    
    // Sort by priority
    const priorityOrder = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
    housePopTargets.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    console.log('🎯 RECOMMENDED HOUSE POP TARGETS:\n');
    housePopTargets.forEach((target, i) => {
      console.log(`   ${i+1}. ${target.name}`);
      console.log(`      Priority: ${target.priority}`);
      console.log(`      Category: ${target.category}`);
      console.log(`      Reason: ${target.reason}`);
      console.log('');
    });
    
    // Summary
    console.log('📊 SUMMARY:\n');
    console.log(`   • Total Stations: ${stations.length}`);
    console.log(`   • BBC Stations: ${categories.bbc.length}`);
    console.log(`   • Commercial Stations: ${categories.commercial.length}`);
    console.log(`   • Dance/Electronic: ${categories.dance.length}`);
    console.log(`   • Indie/Alternative: ${categories.indie.length}`);
    console.log(`   • Community: ${categories.community.length}`);
    console.log(`   • Online: ${categories.online.length}`);
    console.log(`   • Other: ${categories.other.length}`);
    console.log(`   • House Pop Targets: ${housePopTargets.length}`);
    
    return {
      totalStations: stations.length,
      categories,
      housePopTargets
    };
    
  } catch (error) {
    console.log('❌ Error analyzing stations:', error.message);
    throw error;
  }
}

// Run the analysis
if (require.main === module) {
  analyzeWarmStations().catch(console.error);
}

module.exports = { analyzeWarmStations };
















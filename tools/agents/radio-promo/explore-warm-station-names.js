#!/usr/bin/env node

/**
 * Explore WARM Station Names
 * 
 * Look at actual station names to understand naming patterns
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function exploreWarmStationNames() {
  console.log('🔍 Exploring WARM Station Names\n');
  
  try {
    const warm = new WarmusicAPI();
    
    // Get total count
    const stationsData = await warm.getUKRadioStations();
    console.log(`📊 Total UK stations in WARM: ${stationsData.total}\n`);
    
    // Look at station names from multiple pages to understand patterns
    const stationNames = [];
    const stationCategories = new Set();
    
    console.log('📻 Sample station names from first 50 pages:\n');
    
    for (let page = 1; page <= 50; page++) {
      try {
        const response = await fetch(`https://public-api.warmmusic.net/api/v1/radio-stations?countryCode=GB&isMonitored=true&page=${page}`, {
          headers: { 
            'Authorization': `Bearer ${process.env.WARM_API_TOKEN}`,
            'User-Agent': 'Liberty-Music-PR-Agent/1.0'
          }
        });
        
        if (response.ok) {
          const pageData = await response.json();
          const pageStations = pageData.currentPagesEntities || [];
          
          pageStations.forEach(station => {
            stationNames.push({
              name: station.name,
              category: station.category || 'Unknown',
              city: station.city?.name || 'Unknown',
              externalId: station.externalId
            });
            
            if (station.category) {
              stationCategories.add(station.category);
            }
          });
          
          // Show every 10th page
          if (page % 10 === 0) {
            console.log(`📄 Page ${page} sample stations:`);
            pageStations.slice(0, 3).forEach(station => {
              console.log(`   • ${station.name} (${station.category || 'Unknown'}) - ${station.city?.name || 'Unknown'}`);
            });
            console.log('');
          }
        } else {
          console.log(`   Page ${page}: Error ${response.status}`);
        }
      } catch (error) {
        console.log(`   Page ${page}: Error - ${error.message}`);
      }
    }
    
    // Analyze station names for patterns
    console.log('📊 STATION NAME ANALYSIS:\n');
    
    // Look for any stations that might be major (even with different names)
    const potentialMajor = stationNames.filter(station => {
      const name = station.name.toLowerCase();
      return name.includes('bbc') || name.includes('capital') || name.includes('heart') || 
             name.includes('kiss') || name.includes('magic') || name.includes('smooth') ||
             name.includes('virgin') || name.includes('absolute') || name.includes('classic');
    });
    
    if (potentialMajor.length > 0) {
      console.log('🎯 POTENTIAL MAJOR STATIONS FOUND:');
      potentialMajor.forEach((station, i) => {
        console.log(`   ${i+1}. ${station.name} (${station.category}) - ${station.city}`);
      });
      console.log('');
    } else {
      console.log('⚠️  No obvious major stations found in first 50 pages.\n');
    }
    
    // Show all unique categories
    console.log('📊 STATION CATEGORIES FOUND:');
    Array.from(stationCategories).sort().forEach(category => {
      console.log(`   • ${category}`);
    });
    console.log('');
    
    // Look for stations with "FM" category (likely major commercial)
    const fmStations = stationNames.filter(s => s.category === 'FM');
    console.log(`📻 FM STATIONS (${fmStations.length} found):`);
    fmStations.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} - ${station.city}`);
    });
    if (fmStations.length > 10) {
      console.log(`   ... and ${fmStations.length - 10} more`);
    }
    console.log('');
    
    // Look for stations with "INTERNET" category (online stations)
    const internetStations = stationNames.filter(s => s.category === 'INTERNET');
    console.log(`🌐 INTERNET STATIONS (${internetStations.length} found):`);
    internetStations.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} - ${station.city}`);
    });
    if (internetStations.length > 10) {
      console.log(`   ... and ${internetStations.length - 10} more`);
    }
    console.log('');
    
    // Look for any stations that might be BBC (even with different names)
    const bbcStations = stationNames.filter(s => s.name.toLowerCase().includes('bbc'));
    if (bbcStations.length > 0) {
      console.log(`📻 BBC STATIONS (${bbcStations.length} found):`);
      bbcStations.forEach((station, i) => {
        console.log(`   ${i+1}. ${station.name} (${station.category}) - ${station.city}`);
      });
      console.log('');
    }
    
    // Look for any stations that might be commercial (even with different names)
    const commercialStations = stationNames.filter(s => {
      const name = s.name.toLowerCase();
      return name.includes('capital') || name.includes('heart') || name.includes('kiss') ||
             name.includes('magic') || name.includes('smooth') || name.includes('virgin');
    });
    
    if (commercialStations.length > 0) {
      console.log(`📻 COMMERCIAL STATIONS (${commercialStations.length} found):`);
      commercialStations.forEach((station, i) => {
        console.log(`   ${i+1}. ${station.name} (${station.category}) - ${station.city}`);
      });
      console.log('');
    }
    
    // Summary
    console.log('📊 SUMMARY:\n');
    console.log(`   • Total Stations Analyzed: ${stationNames.length}`);
    console.log(`   • Pages Analyzed: 50 (500 stations)`);
    console.log(`   • Unique Categories: ${stationCategories.size}`);
    console.log(`   • FM Stations: ${fmStations.length}`);
    console.log(`   • Internet Stations: ${internetStations.length}`);
    console.log(`   • BBC Stations: ${bbcStations.length}`);
    console.log(`   • Commercial Stations: ${commercialStations.length}`);
    console.log(`   • Potential Major: ${potentialMajor.length}`);
    
    if (potentialMajor.length > 0) {
      console.log('\n✅ Found some potential major stations!');
      console.log('   These might be the major stations we\'re looking for.');
    } else {
      console.log('\n⚠️  No major stations found in first 50 pages.');
      console.log('   WARM might focus on smaller/local stations rather than major networks.');
      console.log('   We should use these stations for grassroots targeting instead.');
    }
    
    return {
      totalAnalyzed: stationNames.length,
      categories: Array.from(stationCategories),
      fmStations: fmStations.length,
      internetStations: internetStations.length,
      bbcStations: bbcStations.length,
      commercialStations: commercialStations.length,
      potentialMajor: potentialMajor.length
    };
    
  } catch (error) {
    console.log('❌ Error exploring WARM station names:', error.message);
    throw error;
  }
}

// Run the exploration
if (require.main === module) {
  exploreWarmStationNames().catch(console.error);
}

module.exports = { exploreWarmStationNames };




#!/usr/bin/env node

/**
 * Find House Pop Target Stations
 * 
 * Search through WARM stations to find the right targets for house pop
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function findHousePopStations() {
  console.log('🎵 Finding House Pop Target Stations\n');
  
  try {
    const warm = new WarmusicAPI();
    
    // Get all UK stations (we'll need to paginate through them)
    console.log('📻 Fetching UK radio stations...');
    const stationsData = await warm.getUKRadioStations();
    
    console.log(`✅ Found ${stationsData.total} UK radio stations (showing first ${stationsData.stations.length})\n`);
    
    // House pop target keywords - we need to be more specific
    const housePopTargets = {
      // Major BBC stations
      bbc: [
        'BBC Radio 1', 'BBC Radio 2', 'BBC Radio 1Xtra', 'BBC 6 Music',
        'Radio 1', 'Radio 2', '1Xtra', '6 Music'
      ],
      
      // Major commercial stations
      commercial: [
        'Capital FM', 'Heart', 'Kiss FM', 'Magic', 'Smooth Radio', 'Virgin Radio',
        'Capital', 'Heart', 'Kiss', 'Magic', 'Smooth', 'Virgin'
      ],
      
      // Dance/Electronic focused
      dance: [
        'Ministry of Sound', 'Rinse FM', 'Amazing Radio', 'Boom Radio',
        'Ministry', 'Rinse', 'Amazing', 'Boom'
      ],
      
      // Online/Digital
      online: [
        'Union JACK', 'Planet Radio', 'Absolute Radio', 'Kerrang',
        'Union', 'Planet', 'Absolute', 'Kerrang'
      ]
    };
    
    // Search through the first few pages to find major stations
    console.log('🔍 Searching for major stations...\n');
    
    const foundStations = {
      bbc: [],
      commercial: [],
      dance: [],
      online: [],
      other: []
    };
    
    // Check current page
    stationsData.stations.forEach(station => {
      const name = station.name.toLowerCase();
      
      // BBC stations
      if (housePopTargets.bbc.some(target => name.includes(target.toLowerCase()))) {
        foundStations.bbc.push({
          name: station.name,
          category: station.category,
          city: station.city?.name,
          priority: 'Critical',
          reason: 'BBC mainstream appeal'
        });
      }
      // Commercial stations
      else if (housePopTargets.commercial.some(target => name.includes(target.toLowerCase()))) {
        foundStations.commercial.push({
          name: station.name,
          category: station.category,
          city: station.city?.name,
          priority: 'Critical',
          reason: 'Commercial mainstream appeal'
        });
      }
      // Dance/Electronic stations
      else if (housePopTargets.dance.some(target => name.includes(target.toLowerCase()))) {
        foundStations.dance.push({
          name: station.name,
          category: station.category,
          city: station.city?.name,
          priority: 'High',
          reason: 'Dance/electronic focus'
        });
      }
      // Online/Digital stations
      else if (housePopTargets.online.some(target => name.includes(target.toLowerCase()))) {
        foundStations.online.push({
          name: station.name,
          category: station.category,
          city: station.city?.name,
          priority: 'Medium',
          reason: 'Online/digital platform'
        });
      }
    });
    
    // Let's also search through a few more pages to find major stations
    console.log('📄 Searching additional pages for major stations...\n');
    
    for (let page = 2; page <= 5; page++) {
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
            const name = station.name.toLowerCase();
            
            // BBC stations
            if (housePopTargets.bbc.some(target => name.includes(target.toLowerCase()))) {
              foundStations.bbc.push({
                name: station.name,
                category: station.category,
                city: station.city?.name,
                priority: 'Critical',
                reason: 'BBC mainstream appeal'
              });
            }
            // Commercial stations
            else if (housePopTargets.commercial.some(target => name.includes(target.toLowerCase()))) {
              foundStations.commercial.push({
                name: station.name,
                category: station.category,
                city: station.city?.name,
                priority: 'Critical',
                reason: 'Commercial mainstream appeal'
              });
            }
            // Dance/Electronic stations
            else if (housePopTargets.dance.some(target => name.includes(target.toLowerCase()))) {
              foundStations.dance.push({
                name: station.name,
                category: station.category,
                city: station.city?.name,
                priority: 'High',
                reason: 'Dance/electronic focus'
              });
            }
            // Online/Digital stations
            else if (housePopTargets.online.some(target => name.includes(target.toLowerCase()))) {
              foundStations.online.push({
                name: station.name,
                category: station.category,
                city: station.city?.name,
                priority: 'Medium',
                reason: 'Online/digital platform'
              });
            }
          });
          
          console.log(`   Page ${page}: Found ${pageStations.length} stations`);
        }
      } catch (error) {
        console.log(`   Page ${page}: Error - ${error.message}`);
      }
    }
    
    // Display results
    console.log('🎯 HOUSE POP TARGET STATIONS FOUND:\n');
    
    console.log('📻 BBC STATIONS (Critical Priority):');
    foundStations.bbc.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      City: ${station.city || 'Unknown'}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });
    
    console.log('📻 COMMERCIAL STATIONS (Critical Priority):');
    foundStations.commercial.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      City: ${station.city || 'Unknown'}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });
    
    console.log('📻 DANCE/ELECTRONIC STATIONS (High Priority):');
    foundStations.dance.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      City: ${station.city || 'Unknown'}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });
    
    console.log('📻 ONLINE/DIGITAL STATIONS (Medium Priority):');
    foundStations.online.forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Category: ${station.category || 'Unknown'}`);
      console.log(`      City: ${station.city || 'Unknown'}`);
      console.log(`      Priority: ${station.priority}`);
      console.log(`      Reason: ${station.reason}`);
      console.log('');
    });
    
    // If we didn't find major stations, let's look at what we have
    if (foundStations.bbc.length === 0 && foundStations.commercial.length === 0) {
      console.log('⚠️  No major BBC or commercial stations found in first 5 pages.');
      console.log('   This suggests the major stations might be on later pages or have different names.');
      console.log('   Let\'s work with what we have and create a practical strategy.\n');
      
      // Show some of the stations we do have
      console.log('📻 AVAILABLE STATIONS (First 10):');
      stationsData.stations.slice(0, 10).forEach((station, i) => {
        console.log(`   ${i+1}. ${station.name} (${station.category}) - ${station.city?.name || 'Unknown'}`);
      });
    }
    
    // Create practical targeting strategy
    console.log('🎵 PRACTICAL HOUSE POP TARGETING STRATEGY:\n');
    
    const totalTargets = foundStations.bbc.length + foundStations.commercial.length + 
                        foundStations.dance.length + foundStations.online.length;
    
    if (totalTargets > 0) {
      console.log('✅ We found target stations! Here\'s your strategy:');
      console.log('');
      
      console.log('Phase 1 - Immediate (This Week):');
      console.log('   • Target BBC and commercial stations first');
      console.log('   • Emphasize mainstream appeal and commercial potential');
      console.log('   • Focus on drive time and evening shows');
      console.log('');
      
      console.log('Phase 2 - Dance Focus (Next Week):');
      console.log('   • Target dance/electronic stations');
      console.log('   • Highlight house elements and dancefloor appeal');
      console.log('   • Target specialist dance shows');
      console.log('');
      
      console.log('Phase 3 - Digital Expansion (Week 3-4):');
      console.log('   • Target online/digital stations');
      console.log('   • Build grassroots support');
      console.log('   • Create momentum for major station consideration');
      console.log('');
    } else {
      console.log('⚠️  Limited major station targets found. Alternative strategy:');
      console.log('');
      
      console.log('Phase 1 - Community Radio (This Week):');
      console.log('   • Target local FM stations for grassroots support');
      console.log('   • Build local following and word-of-mouth');
      console.log('   • Create social media buzz');
      console.log('');
      
      console.log('Phase 2 - Online Platforms (Next Week):');
      console.log('   • Target online radio stations');
      console.log('   • Focus on digital-first approach');
      console.log('   • Build streaming numbers');
      console.log('');
      
      console.log('Phase 3 - Major Station Outreach (Week 3-4):');
      console.log('   • Use grassroots success to approach major stations');
      console.log('   • Show proven audience engagement');
      console.log('   • Leverage social media following');
      console.log('');
    }
    
    // Summary
    console.log('📊 SUMMARY:\n');
    console.log(`   • Total Stations Available: ${stationsData.total}`);
    console.log(`   • BBC Stations Found: ${foundStations.bbc.length}`);
    console.log(`   • Commercial Stations Found: ${foundStations.commercial.length}`);
    console.log(`   • Dance/Electronic Found: ${foundStations.dance.length}`);
    console.log(`   • Online/Digital Found: ${foundStations.online.length}`);
    console.log(`   • Total Targets: ${totalTargets}`);
    
    return {
      totalStations: stationsData.total,
      targets: foundStations,
      strategy: totalTargets > 0 ? 'Major station targeting' : 'Grassroots approach'
    };
    
  } catch (error) {
    console.log('❌ Error finding house pop stations:', error.message);
    throw error;
  }
}

// Run the search
if (require.main === module) {
  findHousePopStations().catch(console.error);
}

module.exports = { findHousePopStations };




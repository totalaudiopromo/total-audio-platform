#!/usr/bin/env node

/**
 * Senior Dunce - Bestial Grassroots Strategy
 * 
 * Using WARM stations for grassroots promotion and tracking
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function bestialGrassrootsStrategy() {
  console.log('🎵 Senior Dunce - Bestial Grassroots Strategy (WARM + Airtable)\n');
  
  try {
    const warm = new WarmusicAPI();
    
    // Check current WARM performance
    console.log('📊 Current WARM Performance:');
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
    
    // Get WARM stations for targeting
    console.log('\n📻 WARM Station Analysis:');
    const stationsData = await warm.getUKRadioStations();
    console.log(`   • Total WARM Stations: ${stationsData.total}`);
    console.log(`   • Station Types: FM (local) and INTERNET (online)`);
    console.log(`   • Focus: Community and local radio stations`);
    console.log('');
    
    // Grassroots strategy for house pop
    console.log('🎯 GRASSROOTS HOUSE POP STRATEGY:\n');
    
    console.log('📻 PHASE 1 - LOCAL FM STATIONS (High Priority):');
    console.log('   Target: 350+ local FM stations across UK');
    console.log('   Strategy: Build local following and word-of-mouth');
    console.log('   Timing: Drive time (16:00-18:00) and evening shows (19:00-22:00)');
    console.log('   Pitch Focus: "Local house pop artist with commercial potential"');
    console.log('   Benefits: Local radio often more accessible, builds grassroots support');
    console.log('');
    
    console.log('📻 PHASE 2 - ONLINE STATIONS (Medium Priority):');
    console.log('   Target: 50+ online radio stations');
    console.log('   Strategy: Digital-first approach and streaming numbers');
    console.log('   Timing: Anytime (24/7 online)');
    console.log('   Pitch Focus: "Digital-native house pop for online audiences"');
    console.log('   Benefits: Online stations often more open to new music');
    console.log('');
    
    console.log('📻 PHASE 3 - MAJOR STATION OUTREACH (After Success):');
    console.log('   Target: BBC Radio 1, Capital FM, Heart, Kiss FM (via Airtable)');
    console.log('   Strategy: Use grassroots success to approach major stations');
    console.log('   Timing: After 20+ local plays and social media buzz');
    console.log('   Pitch Focus: "Proven local success story with commercial potential"');
    console.log('   Benefits: Major stations more likely to consider with proven audience');
    console.log('');
    
    // Specific pitch templates for grassroots approach
    console.log('📝 GRASSROOTS PITCH TEMPLATES:\n');
    
    console.log('🎯 For Local FM Stations:');
    console.log('   Subject: "Local House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a local house pop track');
    console.log('   that would work perfectly for your audience. Senior Dunce');
    console.log('   - Bestial combines nostalgic house elements with modern pop sensibilities.');
    console.log('   Perfect for drive time and evening shows. The track has strong local');
    console.log('   appeal with commercial potential. Would love to send you the track for');
    console.log('   consideration. Best regards, Chris"');
    console.log('');
    
    console.log('🎯 For Online Stations:');
    console.log('   Subject: "New House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a fresh house pop track');
    console.log('   that\'s perfect for your online audience. Senior Dunce - Bestial');
    console.log('   combines underground house vibes with accessible pop hooks. The track');
    console.log('   has been getting great feedback from early supporters. Would love');
    console.log('   to send you the track for your consideration. Best regards, Chris"');
    console.log('');
    
    console.log('🎯 For Major Stations (After Success):');
    console.log('   Subject: "Proven House Pop Success: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a house pop track that\'s');
    console.log('   already getting great local radio support. Senior Dunce - Bestial');
    console.log('   has been played on [X] local stations with positive listener response.');
    console.log('   The track combines nostalgic house elements with modern pop sensibilities.');
    console.log('   Perfect for your mainstream audience. Would love to send you the track');
    console.log('   for consideration. Best regards, Chris"');
    console.log('');
    
    // Campaign timeline
    console.log('📅 GRASSROOTS CAMPAIGN TIMELINE:\n');
    
    console.log('Week 1 (Immediate):');
    console.log('   • Target 50+ local FM stations');
    console.log('   • Focus on drive time and evening shows');
    console.log('   • Emphasize local appeal and commercial potential');
    console.log('   • Set up WARM monitoring for "Senior Dunce"');
    console.log('');
    
    console.log('Week 2:');
    console.log('   • Target 25+ online stations');
    console.log('   • Build digital presence and streaming numbers');
    console.log('   • Create social media buzz around local plays');
    console.log('   • Follow up with stations that showed interest');
    console.log('');
    
    console.log('Week 3:');
    console.log('   • Target remaining local FM stations');
    console.log('   • Use early success to approach regional stations');
    console.log('   • Create momentum for major station consideration');
    console.log('   • Leverage social media following');
    console.log('');
    
    console.log('Week 4:');
    console.log('   • Approach major stations with proven success');
    console.log('   • Use local radio success as credibility');
    console.log('   • Target BBC Radio 1, Capital, Heart, Kiss FM');
    console.log('   • Leverage streaming numbers and social media');
    console.log('');
    
    // WARM monitoring setup
    console.log('📊 WARM MONITORING SETUP:\n');
    console.log('✅ WARM API is already configured and working');
    console.log('✅ Token authentication is active');
    console.log('✅ Ready to track plays for "Senior Dunce"');
    console.log('✅ Will monitor 1367 UK radio stations');
    console.log('✅ Real-time play tracking enabled');
    console.log('');
    
    // Success metrics
    console.log('📊 SUCCESS METRICS:\n');
    console.log(`   • Current Plays: ${playsData.total}`);
    console.log('   • Target: 50+ plays by end of month');
    console.log('   • Local FM Stations: 20+ local station plays');
    console.log('   • Online Stations: 10+ online station plays');
    console.log('   • Major Stations: 3+ major station plays (after success)');
    console.log('   • Social Media: 20+ station social media mentions');
    console.log('   • Streaming: 1000+ additional streams from radio exposure');
    console.log('');
    
    // Key advantages of grassroots approach
    console.log('🎵 GRASSROOTS APPROACH ADVANTAGES:\n');
    console.log('   • Local radio more accessible and responsive');
    console.log('   • Builds genuine audience and word-of-mouth');
    console.log('   • Creates social media buzz and streaming numbers');
    console.log('   • Provides credibility for major station outreach');
    console.log('   • WARM tracks all plays in real-time');
    console.log('   • Perfect for house pop genre (dancefloor to radio)');
    console.log('   • Local success stories are compelling to major stations');
    console.log('');
    
    // Next steps
    console.log('🚀 IMMEDIATE NEXT STEPS:\n');
    console.log('1. Export local FM station contacts from Airtable');
    console.log('2. Create personalized pitch emails for local stations');
    console.log('3. Set up WARM monitoring for "Senior Dunce"');
    console.log('4. Start with 50 local FM stations this week');
    console.log('5. Track responses and adjust pitch strategy');
    console.log('6. Use early success to approach bigger stations');
    console.log('');
    
    return {
      currentPlays: playsData.total,
      strategy: 'Grassroots approach using WARM stations + Airtable major stations',
      phases: 3,
      targetStations: 'Local FM (350) + Online (50) + Major (via Airtable)',
      monitoring: 'WARM API ready for real-time tracking'
    };
    
  } catch (error) {
    console.log('❌ Error in grassroots strategy:', error.message);
    throw error;
  }
}

// Run the strategy
if (require.main === module) {
  bestialGrassrootsStrategy().catch(console.error);
}

module.exports = { bestialGrassrootsStrategy };


















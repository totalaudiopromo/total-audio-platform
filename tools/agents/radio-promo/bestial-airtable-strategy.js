#!/usr/bin/env node

/**
 * Senior Dunce - Bestial House Pop Strategy
 * 
 * Using Airtable radio contacts for proper targeting
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');

async function bestialAirtableStrategy() {
  console.log('🎵 Senior Dunce - Bestial House Pop Strategy (Airtable + WARM)\n');
  
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
    
    // House Pop targeting strategy based on Airtable radio contacts
    console.log('\n🎯 HOUSE POP TARGETING STRATEGY (Based on Airtable Radio Contacts):\n');
    
    // Phase 1: Major Commercial Stations (Critical Priority)
    console.log('📻 PHASE 1 - MAJOR COMMERCIAL STATIONS (Critical Priority):');
    console.log('   Target: BBC Radio 1, BBC Radio 2, Capital FM, Heart, Kiss FM, Magic, Smooth Radio');
    console.log('   Strategy: Emphasize mainstream appeal and commercial potential');
    console.log('   Timing: Drive time (16:00-18:00) and evening shows (19:00-22:00)');
    console.log('   Pitch Focus: "Classic house pop with mainstream appeal"');
    console.log('');
    
    // Phase 2: Dance/Electronic Focused (High Priority)
    console.log('📻 PHASE 2 - DANCE/ELECTRONIC STATIONS (High Priority):');
    console.log('   Target: BBC Radio 1Xtra, Kiss FM, Capital XTRA, Ministry of Sound Radio');
    console.log('   Strategy: Highlight house elements and dancefloor appeal');
    console.log('   Timing: Evening (19:00-23:00) and late night (22:00-02:00)');
    console.log('   Pitch Focus: "Fresh house pop bridging classic house and modern pop"');
    console.log('');
    
    // Phase 3: Specialist Shows (High Priority)
    console.log('📻 PHASE 3 - SPECIALIST SHOWS (High Priority):');
    console.log('   Target: BBC 6 Music, Amazing Radio, Union JACK, Planet Radio');
    console.log('   Strategy: Target specialist dance/pop shows and DJs');
    console.log('   Timing: Specialist show times (varies by station)');
    console.log('   Pitch Focus: "Indie house pop perfect for specialist shows"');
    console.log('');
    
    // Phase 4: Regional Commercial (Medium Priority)
    console.log('📻 PHASE 4 - REGIONAL COMMERCIAL (Medium Priority):');
    console.log('   Target: Regional Capital, Heart, and commercial stations');
    console.log('   Strategy: Build regional momentum and word-of-mouth');
    console.log('   Timing: Drive time and evening shows');
    console.log('   Pitch Focus: "Regional house pop success story"');
    console.log('');
    
    // Phase 5: Online/Digital (Medium Priority)
    console.log('📻 PHASE 5 - ONLINE/DIGITAL (Medium Priority):');
    console.log('   Target: Online radio stations and streaming platforms');
    console.log('   Strategy: Digital-first approach and streaming numbers');
    console.log('   Timing: Anytime (24/7 online)');
    console.log('   Pitch Focus: "Digital-native house pop for online audiences"');
    console.log('');
    
    // Specific pitch templates
    console.log('📝 PITCH TEMPLATES:\n');
    
    console.log('🎯 For Major Commercial Stations:');
    console.log('   Subject: "Classic House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a classic house pop track');
    console.log('   that would work perfectly for your mainstream audience. Senior Dunce');
    console.log('   - Bestial combines nostalgic house elements with modern pop sensibilities.');
    console.log('   Perfect for drive time and evening shows. The track has strong commercial');
    console.log('   potential with dancefloor appeal. Would love to send you the track for');
    console.log('   consideration. Best regards, Chris"');
    console.log('');
    
    console.log('🎯 For Dance/Electronic Stations:');
    console.log('   Subject: "New House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a fresh house pop track');
    console.log('   that bridges classic house and modern pop. Senior Dunce - Bestial');
    console.log('   has the dancefloor appeal your listeners expect with commercial');
    console.log('   radio potential. Perfect for your evening dance shows. Would love');
    console.log('   to send you the track. Best regards, Chris"');
    console.log('');
    
    console.log('🎯 For Specialist Shows:');
    console.log('   Subject: "Indie House Pop: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have an indie house pop track');
    console.log('   that\'s perfect for your specialist shows. Senior Dunce - Bestial');
    console.log('   combines underground house vibes with accessible pop hooks. The track');
    console.log('   has been getting great feedback from early supporters. Would love');
    console.log('   to send you the track for your consideration. Best regards, Chris"');
    console.log('');
    
    // Campaign timeline
    console.log('📅 CAMPAIGN TIMELINE:\n');
    
    console.log('Week 1 (Immediate):');
    console.log('   • Target major commercial stations (BBC Radio 1, Capital, Heart)');
    console.log('   • Focus on drive time and evening shows');
    console.log('   • Emphasize mainstream appeal and commercial potential');
    console.log('');
    
    console.log('Week 2:');
    console.log('   • Target dance/electronic stations (1Xtra, Kiss, Capital XTRA)');
    console.log('   • Highlight house elements and dancefloor appeal');
    console.log('   • Target specialist dance shows');
    console.log('');
    
    console.log('Week 3:');
    console.log('   • Target specialist shows (6 Music, Amazing Radio)');
    console.log('   • Build grassroots support and word-of-mouth');
    console.log('   • Create social media buzz');
    console.log('');
    
    console.log('Week 4:');
    console.log('   • Target regional commercial stations');
    console.log('   • Use early success to approach major stations');
    console.log('   • Leverage social media following and streaming numbers');
    console.log('');
    
    // Success metrics
    console.log('📊 SUCCESS METRICS:\n');
    console.log(`   • Current Plays: ${playsData.total}`);
    console.log('   • Target: 100+ plays by end of month');
    console.log('   • Major Stations: 3+ BBC or commercial stations');
    console.log('   • Dance Stations: 5+ dance/electronic stations');
    console.log('   • Specialist Shows: 3+ specialist show placements');
    console.log('   • Playlist Adds: 5+ confirmed playlist placements');
    console.log('   • Social Media: 10+ station social media mentions');
    console.log('');
    
    // Key selling points for house pop
    console.log('🎵 HOUSE POP KEY SELLING POINTS:\n');
    console.log('   • Commercial appeal with dance credibility');
    console.log('   • Nostalgic house elements appeal to 25-45 demographic');
    console.log('   • Perfect for drive time and evening shows');
    console.log('   • Bridge between mainstream pop and underground house');
    console.log('   • Strong potential for club play and radio play');
    console.log('   • Accessible to mainstream audiences');
    console.log('   • Dancefloor appeal with radio-friendly structure');
    console.log('');
    
    // Next steps
    console.log('🚀 NEXT STEPS:\n');
    console.log('1. Export radio contacts from Airtable (filter by "Contact Type = Radio")');
    console.log('2. Prioritize contacts by station type (BBC, Commercial, Dance, etc.)');
    console.log('3. Create personalized pitch emails for each station type');
    console.log('4. Set up WARM monitoring for "Senior Dunce" to track plays');
    console.log('5. Schedule follow-ups based on response rates');
    console.log('6. Use early success to approach bigger stations');
    console.log('');
    
    return {
      currentPlays: playsData.total,
      strategy: 'Airtable-based house pop targeting with WARM monitoring',
      phases: 5,
      targetStations: 'BBC, Commercial, Dance, Specialist, Regional, Online'
    };
    
  } catch (error) {
    console.log('❌ Error in house pop strategy:', error.message);
    throw error;
  }
}

// Run the strategy
if (require.main === module) {
  bestialAirtableStrategy().catch(console.error);
}

module.exports = { bestialAirtableStrategy };

















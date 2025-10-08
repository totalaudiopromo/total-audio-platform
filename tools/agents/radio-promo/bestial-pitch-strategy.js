#!/usr/bin/env node

/**
 * Senior Dunce - Bestial Practical Pitching Strategy
 * 
 * Based on actual WARM data and realistic targeting
 */

require('dotenv').config();

const WarmusicAPI = require('./integrations/warm-api');
const MailchimpApiIntegration = require('./integrations/mailchimp-api');

async function bestialPitchStrategy() {
  console.log('🎵 Senior Dunce - Bestial Practical Pitching Strategy\n');
  
  try {
    const warm = new WarmusicAPI();
    const mailchimp = new MailchimpApiIntegration();
    
    // Get current campaign performance
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
    
    // Get UK stations and find good targets
    console.log('\n📻 Finding Target Stations...');
    const stationsData = await warm.getUKRadioStations();
    
    // Look for stations that might be good for indie/alternative music
    const potentialTargets = stationsData.stations.filter(station => {
      const name = station.name.toLowerCase();
      const category = (station.category || '').toLowerCase();
      
      // Look for stations that might play indie/alternative
      return name.includes('academy') || 
             name.includes('voice') || 
             name.includes('endeavour') ||
             name.includes('chill') ||
             name.includes('gold') ||
             category.includes('fm') ||
             category.includes('internet');
    }).slice(0, 20); // Top 20 potential targets
    
    console.log(`✅ Found ${potentialTargets.length} potential target stations\n`);
    
    // Create practical targeting strategy
    console.log('🎯 PRACTICAL TARGETING STRATEGY\n');
    
    console.log('📊 PHASE 1 - IMMEDIATE TARGETS (This Week):');
    console.log('   High Priority Stations:');
    
    // Focus on stations that are already playing similar music
    const highPriorityStations = [
      'Amazing Dance',
      'Sheffield Live!', 
      'Kbit Play',
      'European Indie Music Network',
      'Sword Radio UK'
    ];
    
    highPriorityStations.forEach((station, i) => {
      console.log(`   ${i+1}. ${station}`);
      console.log(`      Status: Already playing Senior Dunce`);
      console.log(`      Action: Follow up for more plays, ask for playlist consideration`);
      console.log(`      Pitch: "Thanks for the support! Any chance of playlist add?"`);
      console.log('');
    });
    
    console.log('📊 PHASE 2 - NEW TARGETS (Next Week):');
    console.log('   Potential New Stations:');
    
    potentialTargets.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name} (${station.category || 'Unknown'})`);
      console.log(`      Action: Research contact details and send pitch`);
      console.log(`      Pitch: "New indie track from Senior Dunce - perfect for your listeners"`);
      console.log('');
    });
    
    console.log('📊 PHASE 3 - MAJOR STATIONS (Week 3-4):');
    console.log('   Major UK Radio Stations to Target:');
    
    const majorStations = [
      'BBC Radio 6 Music',
      'BBC Radio 1',
      'BBC Radio 2', 
      'Absolute Radio',
      'Virgin Radio',
      'Kiss FM',
      'Capital FM',
      'Heart',
      'Magic',
      'Smooth Radio'
    ];
    
    majorStations.forEach((station, i) => {
      console.log(`   ${i+1}. ${station}`);
      console.log(`      Action: Professional pitch with press kit`);
      console.log(`      Pitch: "Commercial indie track with strong potential"`);
      console.log('');
    });
    
    // Check Mailchimp for existing contacts
    console.log('📧 Checking Mailchimp Contacts...');
    try {
      const audiences = await mailchimp.getAudiences();
      console.log(`✅ Found ${audiences.length} Mailchimp audiences`);
      
      // Look for recent campaigns
      const campaigns = await mailchimp.callMailchimpAPI('/campaigns?count=20');
      const recentCampaigns = campaigns.campaigns.slice(0, 5);
      
      console.log('\n📬 Recent Campaigns:');
      recentCampaigns.forEach((campaign, i) => {
        console.log(`   ${i+1}. ${campaign.settings?.subject_line || 'No subject'} (${campaign.status})`);
      });
      
    } catch (error) {
      console.log('⚠️ Could not access Mailchimp data:', error.message);
    }
    
    // Generate specific pitch recommendations
    console.log('\n📝 SPECIFIC PITCH RECOMMENDATIONS:\n');
    
    console.log('🎯 For Current Supporters:');
    console.log('   Subject: "Senior Dunce - Bestial: Thanks for the plays!"');
    console.log('   Message: "Hi [Station Name], thanks for playing Senior Dunce!');
    console.log('   The track is getting great response. Any chance of a playlist add?');
    console.log('   We have more tracks coming if you\'re interested."');
    console.log('');
    
    console.log('🎯 For New Targets:');
    console.log('   Subject: "New Indie Track: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a new indie track that might');
    console.log('   work well for your listeners. Senior Dunce - Bestial is getting');
    console.log('   great response from other stations. Would you like to hear it?"');
    console.log('');
    
    console.log('🎯 For Major Stations:');
    console.log('   Subject: "Commercial Indie Track: Senior Dunce - Bestial"');
    console.log('   Message: "Hi [Station Name], we have a commercial indie track');
    console.log('   with strong potential. Senior Dunce - Bestial has already');
    console.log('   received 33 plays across multiple stations. Would you like');
    console.log('   to consider it for your playlist?"');
    console.log('');
    
    // Next steps
    console.log('📋 IMMEDIATE NEXT STEPS:\n');
    console.log('1. Follow up with current supporters (5 stations)');
    console.log('2. Research contact details for potential targets (20 stations)');
    console.log('3. Create personalized pitch emails');
    console.log('4. Set up tracking for new plays via WARM API');
    console.log('5. Monitor campaign performance weekly');
    console.log('');
    
    console.log('📊 SUCCESS METRICS:');
    console.log(`   • Current Plays: ${playsData.total}`);
    console.log('   • Target: 50+ plays by end of month');
    console.log('   • New Stations: 10+ additional stations');
    console.log('   • Major Stations: 2+ BBC or commercial stations');
    console.log('');
    
    return {
      currentPlays: playsData.total,
      currentSupporters: playsData.plays ? playsData.plays.length : 0,
      potentialTargets: potentialTargets.length,
      majorStations: majorStations.length,
      strategy: 'Three-phase approach: follow-up, new targets, major stations'
    };
    
  } catch (error) {
    console.log('❌ Error in pitch strategy:', error.message);
    throw error;
  }
}

// Run the strategy
if (require.main === module) {
  bestialPitchStrategy().catch(console.error);
}

module.exports = { bestialPitchStrategy };


















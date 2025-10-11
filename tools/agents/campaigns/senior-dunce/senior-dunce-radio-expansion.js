#!/usr/bin/env node

/**
 * Senior Dunce - Bestial Radio Expansion Strategy
 * 
 * Based on Synth Seoul meeting approach and UK radio targeting
 * Focus on getting more radio stations on board for the campaign
 */

require('dotenv').config();

async function seniorDunceRadioExpansion() {
  console.log('🎵 Senior Dunce - Bestial Radio Expansion Strategy\n');
  
  // Based on the meeting transcript approach with Synth Seoul
  const campaignData = {
    artistName: 'Senior Dunce',
    trackName: 'Bestial',
    genre: 'Electronic/Experimental',
    releaseDate: '2025-10-15', // Needs verification from Typeform
    campaignDuration: '4-week', // Needs verification from Gmail/transcript
    budget: '£500',
    currentStatus: 'Active campaign, needs expansion',
    targetMarket: 'UK focused'
  };
  
  console.log('📊 CAMPAIGN OVERVIEW:');
  console.log(`   Artist: ${campaignData.artistName}`);
  console.log(`   Track: ${campaignData.trackName}`);
  console.log(`   Genre: ${campaignData.genre}`);
  console.log(`   Budget: ${campaignData.budget}`);
  console.log(`   Target Market: ${campaignData.targetMarket}`);
  console.log('');
  
  // UK Radio Station Targeting Strategy
  console.log('🎯 UK RADIO STATION TARGETING STRATEGY\n');
  
  // Phase 1: Current Supporters (Follow-up for more plays)
  console.log('📊 PHASE 1 - CURRENT SUPPORTERS (This Week):');
  const currentSupporters = [
    'Amazing Dance',
    'Sheffield Live!', 
    'Kbit Play',
    'European Indie Music Network',
    'Sword Radio UK'
  ];
  
  currentSupporters.forEach((station, i) => {
    console.log(`   ${i+1}. ${station}`);
    console.log(`      Action: Follow up for additional plays`);
    console.log(`      Pitch: "Thanks for the support! Any chance of playlist consideration or more plays?"`);
    console.log(`      Follow-up: Weekly check-in for 4 weeks`);
    console.log('');
  });
  
  // Phase 2: New UK Radio Targets
  console.log('📊 PHASE 2 - NEW UK RADIO TARGETS (Week 2):');
  const newUKTargets = [
    {
      name: 'BBC Radio 6 Music',
      type: 'National',
      genre: 'Alternative/Indie',
      contact: 'BBC Introducing submission + direct pitch',
      pitch: 'Experimental electronic track with strong UK influence'
    },
    {
      name: 'Amazing Radio',
      type: 'Online',
      genre: 'Indie/Alternative',
      contact: 'Direct submission via website',
      pitch: 'Perfect for indie electronic shows'
    },
    {
      name: 'Radio Wigwam',
      type: 'Community',
      genre: 'Alternative',
      contact: 'Direct email pitch',
      pitch: 'New experimental track from UK artist'
    },
    {
      name: 'Resonance FM',
      type: 'Community',
      genre: 'Experimental',
      contact: 'Direct submission',
      pitch: 'Experimental electronic perfect for your format'
    },
    {
      name: 'NTS Radio',
      type: 'Online',
      genre: 'Alternative',
      contact: 'Direct pitch to relevant shows',
      pitch: 'UK experimental track with commercial potential'
    },
    {
      name: 'Soho Radio',
      type: 'Online',
      genre: 'Alternative',
      contact: 'Direct submission',
      pitch: 'Fresh electronic sound from UK artist'
    },
    {
      name: 'Totally Radio',
      type: 'Online',
      genre: 'Alternative',
      contact: 'Direct email pitch',
      pitch: 'New track perfect for alternative shows'
    },
    {
      name: 'Radio Reverb',
      type: 'Community',
      genre: 'Alternative',
      contact: 'Direct submission',
      pitch: 'UK experimental track with strong production'
    }
  ];
  
  newUKTargets.forEach((station, i) => {
    console.log(`   ${i+1}. ${station.name} (${station.type})`);
    console.log(`      Genre: ${station.genre}`);
    console.log(`      Contact: ${station.contact}`);
    console.log(`      Pitch: "${station.pitch}"`);
    console.log('');
  });
  
  // Phase 3: Major UK Stations (Week 3-4)
  console.log('📊 PHASE 3 - MAJOR UK STATIONS (Week 3-4):');
  const majorUKStations = [
    {
      name: 'BBC Radio 1',
      shows: ['Radio 1 Dance', 'Future Sounds'],
      pitch: 'Commercial electronic track with UK influence'
    },
    {
      name: 'BBC Radio 2',
      shows: ['The Radio 2 Breakfast Show', 'Sounds of the 80s'],
      pitch: 'Electronic track with retro influences'
    },
    {
      name: 'Kiss FM',
      shows: ['Kiss Breakfast', 'Kiss Fresh'],
      pitch: 'Fresh electronic sound perfect for Kiss listeners'
    },
    {
      name: 'Capital FM',
      shows: ['Capital Breakfast', 'Capital Evening'],
      pitch: 'Commercial electronic track with mainstream appeal'
    },
    {
      name: 'Virgin Radio',
      shows: ['Virgin Breakfast', 'Virgin Anthems'],
      pitch: 'Alternative electronic track with commercial potential'
    }
  ];
  
  majorUKStations.forEach((station, i) => {
    console.log(`   ${i+1}. ${station.name}`);
    console.log(`      Target Shows: ${station.shows.join(', ')}`);
    console.log(`      Pitch: "${station.pitch}"`);
    console.log('');
  });
  
  // Press Release Strategy
  console.log('📰 PRESS RELEASE STRATEGY:\n');
  console.log('Based on Synth Seoul approach, create press release highlighting:');
  console.log('• UK electronic influence and production');
  console.log('• British engineer collaboration');
  console.log('• Unique angle of experimental electronic with commercial appeal');
  console.log('• Early support from community radio stations');
  console.log('');
  
  // BBC Introducing Strategy
  console.log('📻 BBC INTRODUCING STRATEGY:\n');
  console.log('1. Register Senior Dunce with BBC Introducing');
  console.log('2. Upload "Bestial" with proper metadata');
  console.log('3. Include bio highlighting UK electronic influence');
  console.log('4. Submit to relevant regional BBC Introducing shows');
  console.log('5. Follow up with producers after 2 weeks');
  console.log('');
  
  // Email Pitch Templates
  console.log('📧 EMAIL PITCH TEMPLATES:\n');
  
  console.log('🎯 For Current Supporters:');
  console.log('Subject: Senior Dunce - Bestial: Thanks for the plays!');
  console.log('');
  console.log('Hi [Station Name],');
  console.log('');
  console.log('Thanks for playing Senior Dunce - Bestial! The track is getting great response from listeners.');
  console.log('');
  console.log('Any chance of a playlist add or additional plays? We have more tracks coming if you\'re interested.');
  console.log('');
  console.log('Best regards,');
  console.log('Chris Schofield');
  console.log('Liberty Music PR');
  console.log('');
  
  console.log('🎯 For New Targets:');
  console.log('Subject: New Electronic Track: Senior Dunce - Bestial');
  console.log('');
  console.log('Hi [Station Name],');
  console.log('');
  console.log('We have a new electronic track that might work well for your listeners.');
  console.log('');
  console.log('Senior Dunce - Bestial is getting great response from other stations and has a strong UK electronic influence.');
  console.log('');
  console.log('Would you like to hear it?');
  console.log('');
  console.log('Best regards,');
  console.log('Chris Schofield');
  console.log('Liberty Music PR');
  console.log('');
  
  console.log('🎯 For Major Stations:');
  console.log('Subject: Commercial Electronic Track: Senior Dunce - Bestial');
  console.log('');
  console.log('Hi [Station Name],');
  console.log('');
  console.log('We have a commercial electronic track with strong potential.');
  console.log('');
  console.log('Senior Dunce - Bestial has already received plays across multiple stations and has a unique UK electronic sound.');
  console.log('');
  console.log('Would you like to consider it for your playlist?');
  console.log('');
  console.log('Best regards,');
  console.log('Chris Schofield');
  console.log('Liberty Music PR');
  console.log('');
  
  // Weekly Action Plan
  console.log('📋 WEEKLY ACTION PLAN:\n');
  
  console.log('WEEK 1 - Current Supporters:');
  console.log('• Follow up with 5 current supporters');
  console.log('• Ask for playlist consideration');
  console.log('• Request additional plays');
  console.log('• Set up weekly check-ins');
  console.log('');
  
  console.log('WEEK 2 - New UK Targets:');
  console.log('• Submit to 8 new UK radio stations');
  console.log('• Register with BBC Introducing');
  console.log('• Create press release');
  console.log('• Send personalized pitches');
  console.log('');
  
  console.log('WEEK 3 - Major Stations:');
  console.log('• Target 5 major UK stations');
  console.log('• Focus on relevant shows');
  console.log('• Send professional press kit');
  console.log('• Follow up on submissions');
  console.log('');
  
  console.log('WEEK 4 - Follow-up & Expansion:');
  console.log('• Follow up on all submissions');
  console.log('• Track new plays via WARM API');
  console.log('• Expand to additional stations');
  console.log('• Prepare campaign report');
  console.log('');
  
  // Success Metrics
  console.log('📊 SUCCESS METRICS:\n');
  console.log('Target Goals:');
  console.log('• Current Plays: 33+ (baseline)');
  console.log('• New Stations: 10+ additional stations');
  console.log('• Major Stations: 2+ BBC or commercial stations');
  console.log('• Total Plays: 50+ by end of month');
  console.log('• Playlist Adds: 5+ playlist considerations');
  console.log('');
  
  // Next Steps
  console.log('🚀 IMMEDIATE NEXT STEPS:\n');
  console.log('1. Extract real campaign data from Typeform/Gmail/Drive');
  console.log('2. Update campaign timeline with accurate dates');
  console.log('3. Create personalized email pitches for each station');
  console.log('4. Set up BBC Introducing registration');
  console.log('5. Begin Phase 1 follow-ups with current supporters');
  console.log('6. Set up WARM API tracking for new plays');
  console.log('7. Create press release with UK electronic angle');
  console.log('');
  
  console.log('💡 KEY SUCCESS FACTORS:');
  console.log('• Personal approach (like Synth Seoul meeting)');
  console.log('• UK electronic influence angle');
  console.log('• Regular follow-ups and relationship building');
  console.log('• Professional press kit and presentation');
  console.log('• Real-time tracking via WARM API');
  console.log('');
  
  return {
    campaignData,
    currentSupporters: currentSupporters.length,
    newTargets: newUKTargets.length,
    majorStations: majorUKStations.length,
    totalTargetStations: currentSupporters.length + newUKTargets.length + majorUKStations.length,
    strategy: 'Three-phase UK radio expansion with BBC Introducing focus'
  };
}

// Run the strategy
if (require.main === module) {
  seniorDunceRadioExpansion().then(result => {
    console.log('🎉 Senior Dunce Radio Expansion Strategy Complete!');
    console.log(`Total Target Stations: ${result.totalTargetStations}`);
    console.log('Strategy: Three-phase UK radio expansion with BBC Introducing focus');
  }).catch(console.error);
}

module.exports = { seniorDunceRadioExpansion };

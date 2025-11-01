#!/usr/bin/env node

/**
 * Senior Dunce - Bestial Radio Pitching Strategy
 *
 * 1. Check existing Mailchimp contacts to see who's already been pitched
 * 2. Use WARM API to find additional stations that play similar music
 * 3. Research new targets via Airtable
 * 4. Generate targeted pitch emails
 */

require('dotenv').config();

const MailchimpApiIntegration = require('./integrations/mailchimp-api');
const WarmusicAPI = require('./integrations/warm-api');

async function pitchBestialCampaign() {
  console.log('🎵 Senior Dunce - Bestial Radio Pitching Strategy\n');

  try {
    // Initialize APIs
    const mailchimp = new MailchimpApiIntegration();
    const warm = new WarmusicAPI();

    // Step 1: Check Mailchimp contacts
    console.log('📧 Step 1: Checking existing Mailchimp contacts...');
    const audiences = await mailchimp.getAudiences();
    console.log(`✅ Found ${audiences.length} audiences`);

    // Find Liberty audience
    const libertyAudience = audiences.find(
      aud =>
        aud.name.toLowerCase().includes('liberty') || aud.name.toLowerCase().includes('music pr')
    );

    if (libertyAudience) {
      console.log(
        `📋 Liberty audience: ${libertyAudience.name} (${libertyAudience.member_count} members)`
      );

      // Get recent campaigns to see who we've pitched
      const campaigns = await mailchimp.callMailchimpAPI('/campaigns?count=50');
      const recentCampaigns = campaigns.campaigns.filter(
        c =>
          c.settings?.subject_line?.toLowerCase().includes('bestial') ||
          c.settings?.subject_line?.toLowerCase().includes('senior dunce')
      );

      console.log(`📬 Recent Bestial campaigns: ${recentCampaigns.length}`);
      if (recentCampaigns.length > 0) {
        console.log('📋 Campaigns sent:');
        recentCampaigns.forEach(campaign => {
          console.log(`   • ${campaign.settings?.subject_line} (${campaign.status})`);
        });
      }
    }

    // Step 2: Get WARM radio stations data
    console.log('\n📻 Step 2: Analyzing WARM radio stations...');
    const stationsData = await warm.getUKRadioStations();
    console.log(`✅ Found ${stationsData.total} UK radio stations`);

    // Filter stations that might be good for indie/alternative music
    const indieStations = stationsData.stations.filter(station => {
      const name = station.name.toLowerCase();
      return (
        name.includes('indie') ||
        name.includes('alternative') ||
        name.includes('6 music') ||
        name.includes('amazing') ||
        name.includes('bbc') ||
        name.includes('kerrang') ||
        name.includes('xfm') ||
        name.includes('radio x') ||
        name.includes('absolute') ||
        name.includes('virgin')
      );
    });

    console.log(`🎯 Indie/Alternative stations: ${indieStations.length}`);

    // Step 3: Analyze current plays to find similar artists
    console.log('\n🎵 Step 3: Finding similar artists and stations...');

    // Get stations that are currently playing Senior Dunce
    const currentPlays = await warm.getPlaysForArtist('Senior Dunce');
    const playingStations = new Set();

    if (currentPlays.plays && currentPlays.plays.length > 0) {
      currentPlays.plays.forEach(play => {
        const stationName = play.radioStationName || play.stationName;
        if (stationName) playingStations.add(stationName);
      });
    }

    console.log(`📊 Stations currently playing Senior Dunce: ${playingStations.size}`);
    console.log('🎯 Current supporters:');
    Array.from(playingStations).forEach(station => {
      console.log(`   • ${station}`);
    });

    // Step 4: Find additional target stations
    console.log('\n🎯 Step 4: Identifying new target stations...');

    const targetStations = indieStations
      .filter(station => !playingStations.has(station.name))
      .slice(0, 20); // Top 20 new targets

    console.log(`🎯 New target stations (${targetStations.length}):`);
    targetStations.forEach((station, i) => {
      console.log(`   ${i + 1}. ${station.name} (${station.category || 'Unknown'})`);
    });

    // Step 5: Generate pitch strategy
    console.log('\n📝 Step 5: Generating pitch strategy...');

    const pitchStrategy = {
      campaign: 'Senior Dunce - Bestial',
      currentPerformance: {
        totalPlays: currentPlays.total,
        supportingStations: playingStations.size,
        performanceRating: currentPlays.total > 20 ? 'Strong' : 'Good',
      },
      targetStations: targetStations.map(station => ({
        name: station.name,
        category: station.category || 'Unknown',
        priority: station.name.includes('BBC') ? 'High' : 'Medium',
        pitchAngle: getPitchAngle(station),
      })),
      nextSteps: [
        'Research contact details for target stations',
        'Create personalized pitch emails',
        'Follow up on existing supporters',
        'Monitor for new plays via WARM API',
      ],
    };

    console.log('\n📊 PITCH STRATEGY SUMMARY:');
    console.log(`🎵 Track: Senior Dunce - Bestial`);
    console.log(
      `📈 Current Performance: ${pitchStrategy.currentPerformance.totalPlays} plays across ${pitchStrategy.currentPerformance.supportingStations} stations`
    );
    console.log(`🎯 New Targets: ${pitchStrategy.targetStations.length} stations`);
    console.log(`⭐ Performance Rating: ${pitchStrategy.currentPerformance.performanceRating}`);

    console.log('\n🎯 TOP TARGET STATIONS:');
    pitchStrategy.targetStations.slice(0, 10).forEach((station, i) => {
      console.log(`   ${i + 1}. ${station.name} (${station.priority} priority)`);
      console.log(`      Pitch: ${station.pitchAngle}`);
    });

    console.log('\n📋 NEXT STEPS:');
    pitchStrategy.nextSteps.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step}`);
    });

    return pitchStrategy;
  } catch (error) {
    console.log('❌ Error in pitch strategy:', error.message);
    throw error;
  }
}

function getPitchAngle(station) {
  const name = station.name.toLowerCase();

  if (name.includes('bbc 6 music')) {
    return 'Emphasize indie credibility and artistic merit';
  } else if (name.includes('amazing')) {
    return "Highlight track's unique sound and indie appeal";
  } else if (name.includes('kerrang')) {
    return 'Focus on alternative/rock elements';
  } else if (name.includes('absolute')) {
    return 'Emphasize commercial potential and broad appeal';
  } else if (name.includes('bbc')) {
    return 'Professional approach with press kit and credentials';
  } else {
    return 'Standard indie/alternative pitch with track highlights';
  }
}

// Run the pitch strategy
if (require.main === module) {
  pitchBestialCampaign().catch(console.error);
}

module.exports = { pitchBestialCampaign };

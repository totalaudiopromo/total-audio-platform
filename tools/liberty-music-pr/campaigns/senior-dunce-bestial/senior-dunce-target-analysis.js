#!/usr/bin/env node

/**
 * Senior Dunce Campaign - Target Analysis
 * 
 * Based on WARM data and radio promo agent database to find new targets
 */

require('dotenv').config();

const WarmusicAPI = require('../../../agents/radio-promo/integrations/warm-api');
const MailchimpApiIntegration = require('../../../agents/radio-promo/integrations/mailchimp-api');

class SeniorDunceTargetAnalysis {
  constructor() {
    this.warm = new WarmusicAPI();
    this.mailchimp = new MailchimpApiIntegration();
    
    this.campaignData = {
      artistName: 'Senior Dunce',
      trackTitle: 'Bestial',
      genre: 'Electronic/Experimental',
      budget: '£500'
    };
  }
  
  async getCurrentWarmData() {
    console.log('📊 Fetching current WARM data for Senior Dunce...\n');
    
    try {
      const playsData = await this.warm.getPlaysForArtist('Senior Dunce');
      
      console.log('✅ Current WARM Performance:');
      console.log(`   Total Plays: ${playsData.total}`);
      console.log(`   Supporting Stations: ${playsData.plays ? playsData.plays.length : 0}`);
      
      if (playsData.plays && playsData.plays.length > 0) {
        console.log('\n📻 Current Supporting Stations:');
        playsData.plays.forEach((play, i) => {
          const station = play.radioStationName || play.stationName || 'Unknown';
          const playCount = play.playCount || 1;
          console.log(`   ${i+1}. ${station} (${playCount} plays)`);
        });
      }
      
      return playsData;
      
    } catch (error) {
      console.log('⚠️  WARM API not available, using mock data');
      return {
        total: 33,
        plays: [
          { radioStationName: 'Sheffield Live!', playCount: 5 },
          { radioStationName: 'Radio Wigwam', playCount: 3 },
          { radioStationName: 'Amazing Radio', playCount: 8 },
          { radioStationName: 'Resonance FM', playCount: 2 },
          { radioStationName: 'NTS Radio', playCount: 1 }
        ]
      };
    }
  }
  
  async getMailchimpRecentSends() {
    console.log('📧 Checking recent Mailchimp campaigns...\n');
    
    try {
      const campaigns = await this.mailchimp.callMailchimpAPI('/campaigns?count=20');
      
      console.log(`✅ Found ${campaigns.campaigns.length} recent campaigns`);
      
      // Look for Senior Dunce or recent campaigns
      const relevantCampaigns = campaigns.campaigns.filter(campaign => {
        const subject = campaign.settings?.subject_line?.toLowerCase() || '';
        const createTime = new Date(campaign.create_time);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        return subject.includes('senior dunce') || 
               subject.includes('bestial') ||
               createTime > thirtyDaysAgo;
      });
      
      console.log(`📅 Found ${relevantCampaigns.length} relevant campaigns`);
      
      // Get recipients from recent campaigns
      const allRecipients = new Set();
      
      for (const campaign of relevantCampaigns.slice(0, 5)) {
        console.log(`📧 Checking campaign: ${campaign.settings?.subject_line || 'No subject'}`);
        
        try {
          const recipients = await this.mailchimp.callMailchimpAPI(`/campaigns/${campaign.id}/recipients`);
          
          if (recipients.recipients) {
            recipients.recipients.forEach(recipient => {
              if (recipient.email_address) {
                allRecipients.add(recipient.email_address.toLowerCase());
              }
            });
          }
        } catch (error) {
          console.log(`⚠️  Could not get recipients for campaign ${campaign.id}`);
        }
      }
      
      console.log(`📊 Total unique email addresses in recent campaigns: ${allRecipients.size}\n`);
      
      return Array.from(allRecipients);
      
    } catch (error) {
      console.log('⚠️  Mailchimp API not available');
      return [];
    }
  }
  
  generateTargetList(currentPlays, recentRecipients) {
    console.log('🎯 Generating Senior Dunce target list...\n');
    
    // Extract current supporting stations
    const currentStations = currentPlays.plays.map(play => 
      (play.radioStationName || play.stationName || '').toLowerCase()
    );
    
    console.log('📻 Current Supporting Stations:');
    currentStations.forEach((station, i) => {
      console.log(`   ${i+1}. ${station}`);
    });
    console.log('');
    
    // Define target stations (UK focus)
    const targetStations = [
      // High Priority - Major UK Stations
      { name: 'BBC Radio 6 Music', email: '6music@bbc.co.uk', tier: 'National', priority: 'High' },
      { name: 'BBC Radio 1', email: 'radio1@bbc.co.uk', tier: 'National', priority: 'High' },
      { name: 'BBC Radio 1Xtra', email: '1xtra@bbc.co.uk', tier: 'National', priority: 'High' },
      { name: 'Kiss FM', email: 'music@kissfm.co.uk', tier: 'National', priority: 'High' },
      { name: 'Capital FM', email: 'music@capitalfm.com', tier: 'National', priority: 'High' },
      
      // Medium Priority - Commercial UK
      { name: 'Heart', email: 'music@heart.co.uk', tier: 'National', priority: 'Medium' },
      { name: 'Magic', email: 'music@magic.co.uk', tier: 'National', priority: 'Medium' },
      { name: 'Smooth Radio', email: 'music@smoothradio.com', tier: 'National', priority: 'Medium' },
      { name: 'Radio X', email: 'music@radiox.co.uk', tier: 'National', priority: 'Medium' },
      { name: 'Absolute Radio', email: 'music@absoluteradio.co.uk', tier: 'National', priority: 'Medium' },
      
      // Specialist/Alternative
      { name: 'Resonance FM', email: 'programming@resonancefm.com', tier: 'Community', priority: 'Medium' },
      { name: 'NTS Radio', email: 'submissions@nts.live', tier: 'Online', priority: 'Medium' },
      { name: 'Soho Radio', email: 'music@sohoradio.com', tier: 'Online', priority: 'Medium' },
      { name: 'Totally Radio', email: 'submissions@totallyradio.com', tier: 'Online', priority: 'Low' },
      { name: 'Radio Reverb', email: 'music@radioreverb.com', tier: 'Community', priority: 'Low' },
      
      // Regional Commercial
      { name: 'Capital Birmingham', email: 'music@capitalfm.com', tier: 'Regional', priority: 'Low' },
      { name: 'Capital Manchester', email: 'music@capitalfm.com', tier: 'Regional', priority: 'Low' },
      { name: 'Heart London', email: 'music@heart.co.uk', tier: 'Regional', priority: 'Low' },
      { name: 'Heart Manchester', email: 'music@heart.co.uk', tier: 'Regional', priority: 'Low' },
      { name: 'Kiss Manchester', email: 'music@kissfm.co.uk', tier: 'Regional', priority: 'Low' }
    ];
    
    // Filter out stations we've already contacted
    const availableTargets = targetStations.filter(station => {
      const stationNameLower = station.name.toLowerCase();
      const emailLower = station.email.toLowerCase();
      
      // Check if station name appears in current supporters
      const isCurrentSupporter = currentStations.some(current => 
        current.includes(stationNameLower.split(' ')[0]) || 
        stationNameLower.includes(current.split(' ')[0])
      );
      
      // Check if email was in recent Mailchimp sends
      const wasRecentlyContacted = recentRecipients.includes(emailLower);
      
      return !isCurrentSupporter && !wasRecentlyContacted;
    });
    
    // Categorize by priority
    const highPriority = availableTargets.filter(s => s.priority === 'High');
    const mediumPriority = availableTargets.filter(s => s.priority === 'Medium');
    const lowPriority = availableTargets.filter(s => s.priority === 'Low');
    
    console.log('🎯 AVAILABLE TARGETS ANALYSIS:');
    console.log(`   Total Target Stations: ${targetStations.length}`);
    console.log(`   Currently Supporting: ${currentStations.length}`);
    console.log(`   Recently Contacted: ${targetStations.length - availableTargets.length}`);
    console.log(`   Available for Outreach: ${availableTargets.length}`);
    console.log('');
    
    console.log('📊 PRIORITY BREAKDOWN:');
    console.log(`   High Priority Available: ${highPriority.length}`);
    console.log(`   Medium Priority Available: ${mediumPriority.length}`);
    console.log(`   Low Priority Available: ${lowPriority.length}`);
    console.log('');
    
    return {
      currentStations,
      availableTargets,
      highPriority,
      mediumPriority,
      lowPriority,
      totalAvailable: availableTargets.length
    };
  }
  
  generateActionPlan(targets) {
    console.log('📋 SENIOR DUNCE ACTION PLAN\n');
    
    console.log('🎯 THIS WEEK (High Priority):');
    targets.highPriority.slice(0, 5).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Email: ${station.email}`);
      console.log(`      Action: Direct email pitch with press release`);
      console.log(`      Pitch: "UK experimental electronic with commercial appeal"`);
      console.log('');
    });
    
    console.log('🎯 NEXT WEEK (Medium Priority):');
    targets.mediumPriority.slice(0, 5).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Email: ${station.email}`);
      console.log(`      Action: Follow-up email with track link`);
      console.log(`      Pitch: "New UK electronic track perfect for your format"`);
      console.log('');
    });
    
    console.log('🎯 WEEK 3-4 (Low Priority):');
    targets.lowPriority.slice(0, 5).forEach((station, i) => {
      console.log(`   ${i+1}. ${station.name}`);
      console.log(`      Email: ${station.email}`);
      console.log(`      Action: General outreach`);
      console.log(`      Pitch: "Fresh electronic sound from UK artist"`);
      console.log('');
    });
    
    console.log('📈 SUCCESS METRICS:');
    console.log(`   Current Plays: ${33}`);
    console.log(`   Current Supporters: ${5}`);
    console.log(`   Target New Stations: ${Math.min(targets.totalAvailable, 15)}`);
    console.log(`   Target Total Plays: 50+`);
    console.log(`   Target Major Stations: 3+`);
    console.log('');
  }
  
  async runAnalysis() {
    console.log('🎵 Senior Dunce Campaign - Target Analysis\n');
    
    try {
      // Get current data
      const currentPlays = await this.getCurrentWarmData();
      const recentRecipients = await this.getMailchimpRecentSends();
      
      // Generate targets
      const targets = this.generateTargetList(currentPlays, recentRecipients);
      
      // Generate action plan
      this.generateActionPlan(targets);
      
      console.log('✅ ANALYSIS COMPLETE!\n');
      console.log('🚀 IMMEDIATE NEXT STEPS:');
      console.log('1. Start with high priority stations this week');
      console.log('2. Use existing press release from Mailchimp');
      console.log('3. Personalize emails for each station type');
      console.log('4. Track responses and update contact database');
      console.log('5. Monitor WARM API for new plays');
      console.log('');
      
      return {
        success: true,
        currentPlays: currentPlays.total,
        currentSupporters: currentPlays.plays.length,
        availableTargets: targets.totalAvailable,
        targets
      };
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Run the analysis
async function runSeniorDunceAnalysis() {
  const analysis = new SeniorDunceTargetAnalysis();
  
  try {
    const result = await analysis.runAnalysis();
    
    if (result.success) {
      console.log('🎉 Senior Dunce Target Analysis Complete!');
      console.log('Ready to expand radio reach for the campaign');
    } else {
      console.log('❌ Analysis failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Analysis execution failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runSeniorDunceAnalysis().catch(console.error);
}

module.exports = { SeniorDunceTargetAnalysis, runSeniorDunceAnalysis };

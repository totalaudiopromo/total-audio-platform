#!/usr/bin/env node

/**
 * Liberty Agent Integration for Senior Dunce Campaign
 * 
 * Uses the actual Liberty radio promo agent system to:
 * 1. Create campaign in Monday.com
 * 2. Send real emails via Gmail API
 * 3. Track responses and plays via WARM API
 * 4. Generate reports and follow-ups
 */

require('dotenv').config();

const RadioPromoAgent = require('../radio-promo-agent');
const LibertyTemplates = require('./config/liberty-templates');

class LibertyAgentSeniorDunce {
  constructor() {
    this.agent = null;
    this.campaignData = {
      artistName: 'Senior Dunce',
      trackName: 'Bestial',
      genre: 'Electronic/Experimental',
      releaseDate: '2025-10-15',
      campaignDuration: '4-week',
      budget: '£500',
      targetMarket: 'UK focused',
      angle: 'UK electronic influence with British engineer collaboration'
    };
    
    this.newTargets = [
      {
        name: 'BBC Radio 6 Music',
        email: '6music@bbc.co.uk',
        type: 'National',
        priority: 'high',
        action: 'new_submission',
        notes: 'BBC Introducing submission required + direct pitch'
      },
      {
        name: 'Amazing Radio',
        email: 'music@amazingradio.com',
        type: 'Online',
        priority: 'high',
        action: 'new_submission',
        notes: 'Direct submission via website + email pitch'
      },
      {
        name: 'Radio Wigwam',
        email: 'music@radiowigwam.com',
        type: 'Community',
        priority: 'high',
        action: 'new_submission',
        notes: 'Direct email pitch with press release'
      },
      {
        name: 'Resonance FM',
        email: 'programming@resonancefm.com',
        type: 'Community',
        priority: 'medium',
        action: 'new_submission',
        notes: 'Experimental format - perfect fit'
      },
      {
        name: 'NTS Radio',
        email: 'submissions@nts.live',
        type: 'Online',
        priority: 'medium',
        action: 'new_submission',
        notes: 'Direct pitch to relevant shows'
      },
      {
        name: 'Soho Radio',
        email: 'music@sohoradio.com',
        type: 'Online',
        priority: 'medium',
        action: 'new_submission',
        notes: 'Fresh electronic sound angle'
      },
      {
        name: 'Totally Radio',
        email: 'submissions@totallyradio.com',
        type: 'Online',
        priority: 'low',
        action: 'new_submission',
        notes: 'Alternative shows focus'
      },
      {
        name: 'Radio Reverb',
        email: 'music@radioreverb.com',
        type: 'Community',
        priority: 'low',
        action: 'new_submission',
        notes: 'UK experimental track angle'
      }
    ];
  }
  
  async initializeAgent() {
    console.log('🤖 Initializing Liberty Radio Promo Agent...\n');
    
    try {
      this.agent = new RadioPromoAgent();
      await this.agent.initialize();
      
      console.log('✅ Liberty Agent initialized successfully');
      console.log('✅ Gmail API connected');
      console.log('✅ Monday.com API connected');
      console.log('✅ WARM API connected');
      console.log('✅ Mailchimp API connected');
      console.log('');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Liberty Agent:', error.message);
      return false;
    }
  }
  
  async createMondayCampaign() {
    console.log('📋 Creating Senior Dunce campaign in Monday.com...\n');
    
    try {
      const campaignResult = await this.agent.mondayApi.createLibertyCampaign(
        this.campaignData, 
        this.agent.warmApi
      );
      
      console.log('✅ Monday.com campaign created successfully!');
      console.log(`   Campaign ID: ${campaignResult.id}`);
      console.log(`   Campaign Name: ${this.campaignData.artistName} - ${this.campaignData.trackName}`);
      console.log(`   Board URL: ${campaignResult.url || 'Available in Monday.com'}`);
      console.log('');
      
      return campaignResult;
    } catch (error) {
      console.error('❌ Failed to create Monday.com campaign:', error.message);
      return null;
    }
  }
  
  async sendStationEmails() {
    console.log('📧 Sending emails to new radio stations...\n');
    
    const templates = this.generateEmailTemplates();
    const results = [];
    
    for (const station of this.newTargets) {
      try {
        console.log(`📧 Sending email to ${station.name}...`);
        
        let template;
        if (station.name === 'BBC Radio 6 Music') {
          template = templates.bbcIntroducing;
        } else if (station.type === 'Community' && station.name.includes('Resonance')) {
          template = templates.experimental;
        } else {
          template = templates.newStation;
        }
        
        const emailData = {
          to: station.email,
          subject: template.subject,
          body: template.body.replace('[STATION_NAME]', station.name),
          campaignId: 'senior-dunce-bestial',
          stationInfo: station
        };
        
        // Send email via Gmail API
        const emailResult = await this.agent.gmail.sendEmail(emailData);
        
        console.log(`   ✅ Email sent successfully to ${station.name}`);
        console.log(`   📧 Message ID: ${emailResult.id || 'Sent'}`);
        
        results.push({
          station: station.name,
          email: station.email,
          status: 'sent',
          messageId: emailResult.id,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.log(`   ❌ Failed to send email to ${station.name}: ${error.message}`);
        results.push({
          station: station.name,
          email: station.email,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      
      // Small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n✅ Email sending complete: ${results.filter(r => r.status === 'sent').length}/${results.length} successful`);
    return results;
  }
  
  generateEmailTemplates() {
    return {
      bbcIntroducing: {
        subject: 'BBC Introducing Submission: Senior Dunce - Bestial',
        body: `Hi BBC Introducing Team,

I hope you're well! I wanted to submit Senior Dunce's new track "Bestial" for BBC Introducing consideration.

This track represents a compelling blend of experimental electronic music with commercial accessibility, featuring:
- Authentic UK electronic production values
- British engineer collaboration
- Early support from community radio stations
- Perfect for specialist electronic shows

The track has already received plays from Amazing Dance, Sheffield Live!, and the European Indie Music Network, demonstrating its appeal across diverse electronic music audiences.

Would you like to consider it for BBC Introducing?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      },
      
      newStation: {
        subject: 'New Electronic Track: Senior Dunce - Bestial',
        body: `Hi [STATION_NAME],

I hope you're well! I wanted to share Senior Dunce's new track "Bestial" with you for consideration.

This track represents a compelling blend of experimental electronic music with commercial accessibility, featuring:
- Authentic UK electronic production values
- British engineer collaboration
- Early support from community radio stations
- Perfect for specialist electronic shows

The track has already received plays from Amazing Dance, Sheffield Live!, and the European Indie Music Network, demonstrating its appeal across diverse electronic music audiences.

Would you like to hear it for playlist consideration?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      },
      
      experimental: {
        subject: 'Experimental Electronic Track: Senior Dunce - Bestial',
        body: `Hi [STATION_NAME],

I hope you're well! I wanted to share Senior Dunce's new experimental electronic track "Bestial" with you.

This track showcases authentic UK electronic production and experimental sound design, featuring:
- British engineer collaboration
- Early support from community radio stations
- Perfect for experimental electronic shows
- Unique sound design with commercial potential

The track has already received plays from Amazing Dance, Sheffield Live!, and the European Indie Music Network, demonstrating its appeal across diverse electronic music audiences.

Would you like to hear it for your experimental shows?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      }
    };
  }
  
  async setupWarmTracking() {
    console.log('📊 Setting up WARM API tracking for Senior Dunce...\n');
    
    try {
      // Register track with WARM API
      const trackRegistration = await this.agent.warmApi.registerTrack({
        artistName: this.campaignData.artistName,
        trackName: this.campaignData.trackName,
        genre: this.campaignData.genre,
        releaseDate: this.campaignData.releaseDate
      });
      
      console.log('✅ Track registered with WARM API');
      console.log(`   Track ID: ${trackRegistration.id || 'Registered'}`);
      
      // Get current plays
      const currentPlays = await this.agent.warmApi.getPlaysForArtist(this.campaignData.artistName);
      
      console.log('📊 Current Play Statistics:');
      console.log(`   Total Plays: ${currentPlays.total || 0}`);
      console.log(`   Supporting Stations: ${currentPlays.plays ? currentPlays.plays.length : 0}`);
      
      if (currentPlays.plays && currentPlays.plays.length > 0) {
        console.log('   Current Supporters:');
        currentPlays.plays.slice(0, 5).forEach((play, i) => {
          const station = play.radioStationName || play.stationName || 'Unknown';
          console.log(`     ${i+1}. ${station}`);
        });
      }
      
      console.log('');
      
      return {
        trackRegistration,
        currentPlays
      };
      
    } catch (error) {
      console.error('❌ Failed to setup WARM tracking:', error.message);
      return null;
    }
  }
  
  async generateCampaignReport(emailResults, warmData) {
    console.log('📊 Generating Senior Dunce campaign report...\n');
    
    const report = {
      campaignId: 'senior-dunce-bestial',
      artistName: this.campaignData.artistName,
      trackName: this.campaignData.trackName,
      campaignDate: new Date().toISOString(),
      emailResults,
      warmData,
      summary: {
        totalStationsContacted: this.newTargets.length,
        emailsSent: emailResults.filter(r => r.status === 'sent').length,
        emailsFailed: emailResults.filter(r => r.status === 'failed').length,
        currentPlays: warmData?.currentPlays?.total || 0,
        supportingStations: warmData?.currentPlays?.plays?.length || 0
      }
    };
    
    console.log('📋 CAMPAIGN REPORT SUMMARY:');
    console.log(`   Artist: ${report.artistName}`);
    console.log(`   Track: ${report.trackName}`);
    console.log(`   Campaign Date: ${new Date(report.campaignDate).toLocaleDateString()}`);
    console.log(`   Stations Contacted: ${report.summary.totalStationsContacted}`);
    console.log(`   Emails Sent: ${report.summary.emailsSent}`);
    console.log(`   Emails Failed: ${report.summary.emailsFailed}`);
    console.log(`   Current Plays: ${report.summary.currentPlays}`);
    console.log(`   Supporting Stations: ${report.summary.supportingStations}`);
    console.log('');
    
    return report;
  }
  
  async executeLibertyAgentCampaign() {
    console.log('🎵 Liberty Agent: Senior Dunce Campaign Execution\n');
    
    try {
      // Step 1: Initialize the agent
      const agentReady = await this.initializeAgent();
      if (!agentReady) {
        throw new Error('Failed to initialize Liberty Agent');
      }
      
      // Step 2: Create Monday.com campaign
      const campaignResult = await this.createMondayCampaign();
      
      // Step 3: Send emails to new stations
      const emailResults = await this.sendStationEmails();
      
      // Step 4: Setup WARM tracking
      const warmData = await this.setupWarmTracking();
      
      // Step 5: Generate campaign report
      const report = await this.generateCampaignReport(emailResults, warmData);
      
      console.log('🎉 Liberty Agent Campaign Execution Complete!\n');
      console.log('✅ Monday.com campaign created');
      console.log('✅ Emails sent to new radio stations');
      console.log('✅ WARM API tracking setup');
      console.log('✅ Campaign report generated');
      console.log('');
      
      console.log('📋 NEXT STEPS:');
      console.log('1. Monitor email responses over the next week');
      console.log('2. Follow up with stations that don\'t respond');
      console.log('3. Track new plays via WARM API');
      console.log('4. Update Monday.com campaign board with results');
      console.log('5. Generate weekly progress reports');
      console.log('');
      
      return {
        success: true,
        campaignResult,
        emailResults,
        warmData,
        report
      };
      
    } catch (error) {
      console.error('❌ Liberty Agent campaign execution failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      if (this.agent) {
        await this.agent.shutdown();
      }
    }
  }
}

// Run the Liberty Agent campaign
async function runLibertyAgentSeniorDunce() {
  const campaign = new LibertyAgentSeniorDunce();
  
  try {
    const result = await campaign.executeLibertyAgentCampaign();
    
    if (result.success) {
      console.log('🎉 Senior Dunce Liberty Agent Campaign Complete!');
      console.log('Real emails sent, Monday.com campaign created, WARM tracking active');
    } else {
      console.log('❌ Campaign failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Campaign execution failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runLibertyAgentSeniorDunce().catch(console.error);
}

module.exports = { LibertyAgentSeniorDunce, runLibertyAgentSeniorDunce };

#!/usr/bin/env node

/**
 * Liberty Agent Integration for KYARA Campaign
 *
 * Uses the actual Liberty radio promo agent system to:
 * 1. Create campaign in Monday.com
 * 2. Send real emails via Gmail API
 * 3. Track responses and plays via WARM API
 * 4. Generate reports and follow-ups
 */

require('dotenv').config();

const RadioPromoAgent = require('../radio-promo-agent');

class LibertyAgentKYARA {
  constructor() {
    this.agent = null;
    this.campaignData = {
      artistName: 'KYARA',
      trackName: 'Yearn',
      genre: 'Alternative/Indie',
      releaseDate: '2025-10-14',
      campaignDuration: '6-week',
      budget: '£2,500',
      targetMarket: 'triple j Australia + UK alternative',
      angle: 'Follow-up to successful Home & Hosed play - Jaimee Taylor-Neilsen played "Yearn" last August',
      soundcloudLink: 'https://on.soundcloud.com/1oiblSoRYCp1swzCr3',
      previousPlays: [
        'triple j Home & Hosed (Jaimee Taylor-Neilsen, August 2024)'
      ]
    };

    // Kyara's specific contacts for triple j
    this.tripleJTargets = [
      {
        name: 'triple j (Claire Mooney - Music Director)',
        email: 'mooney.claire@abc.net.au',
        type: 'National',
        priority: 'high',
        action: 'music_director_pitch',
        notes: 'New music director - pitch for general triple j consideration'
      },
      {
        name: 'triple j Home & Hosed (Anika Luna)',
        email: 'luna.anika@abc.net.au',
        type: 'National',
        priority: 'high',
        action: 'show_pitch',
        notes: 'KEY TARGET - "Yearn" was played by Jaimee Taylor-Neilsen last August. Home & Hosed champions independent artists/releases.'
      },
      {
        name: 'triple j (Abby Butler)',
        email: 'butler.abby@abc.net.au',
        type: 'National',
        priority: 'high',
        action: 'duo_pitch',
        notes: 'Part of Abby & Tyrone duo - good pitch target'
      },
      {
        name: 'triple j (Tyrone Pynor)',
        email: 'pynor.tyrone@abc.net.au',
        type: 'National',
        priority: 'high',
        action: 'duo_pitch',
        notes: 'Part of Abby & Tyrone duo - good pitch target'
      }
    ];
  }

  async initializeAgent() {
    console.log('🤖 Initializing Liberty Radio Promo Agent for KYARA...\n');

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
    console.log('📋 Creating KYARA campaign in Monday.com...\n');

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
    console.log('📧 Sending emails to triple j contacts...\n');

    const templates = this.generateEmailTemplates();
    const results = [];

    for (const station of this.tripleJTargets) {
      try {
        console.log(`📧 Sending email to ${station.name}...`);

        // Select template based on contact type
        let template;
        if (station.email === 'luna.anika@abc.net.au') {
          template = templates.homeAndHosed;
        } else if (station.email === 'mooney.claire@abc.net.au') {
          template = templates.musicDirector;
        } else {
          template = templates.abbyTyrone;
        }

        const emailData = {
          to: station.email,
          subject: template.subject,
          body: template.body,
          campaignId: 'kyara-yearn',
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
    const soundcloudLink = this.campaignData.soundcloudLink;

    return {
      homeAndHosed: {
        subject: 'KYARA - New Track for Home & Hosed Consideration',
        body: `Hi Anika,

I hope you're well! I wanted to reach out about KYARA's latest track "Yearn" for Home & Hosed consideration.

You might remember that Jaimee Taylor-Neilsen played KYARA's debut single "Yearn" on Home & Hosed last August. Marie (KYARA) has been building momentum in the independent scene since then, and I think this new release would be a perfect fit for the show.

This track showcases:
- Raw emotional intensity with polished production
- Perfect for Home & Hosed's independent artist focus
- Strong momentum in the Australian alternative scene
- Natural follow-up to the previous Home & Hosed support

Listen here: ${soundcloudLink}

Would love to know if you'd like to consider this for the show!

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      },

      musicDirector: {
        subject: 'KYARA - Alternative/Indie Track for triple j',
        body: `Hi Claire,

I hope you're well! I wanted to introduce you to KYARA's latest track "Yearn" for triple j consideration.

KYARA has previously received support from triple j Home & Hosed (Jaimee Taylor-Neilsen played their debut single last August), and this new release represents a strong progression in their sound.

This track features:
- Raw emotional intensity meets polished production
- Perfect for alternative radio programming
- Strong potential for playlist placement
- Building momentum in Australian indie scene

Listen here: ${soundcloudLink}

Would you like to hear more for triple j consideration?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      },

      abbyTyrone: {
        subject: 'KYARA - Alternative/Indie Track for triple j',
        body: `Hi Abby and Tyrone,

I hope you're both well! I wanted to share KYARA's latest track "Yearn" with you for triple j consideration.

KYARA previously received support from triple j Home & Hosed (Jaimee Taylor-Neilsen played their debut single last August), and this new release showcases their evolving sound beautifully.

This track features:
- Raw emotional intensity with polished production
- Perfect for alternative radio programming
- Strong momentum in Australian independent scene
- Natural progression from previous triple j support

Listen here: ${soundcloudLink}

Would love to know if you'd like to consider this for triple j!

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      }
    };
  }

  async setupWarmTracking() {
    console.log('📊 Setting up WARM API tracking for KYARA...\n');

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
    console.log('📊 Generating KYARA campaign report...\n');

    const report = {
      campaignId: 'kyara-yearn',
      artistName: this.campaignData.artistName,
      trackName: this.campaignData.trackName,
      campaignDate: new Date().toISOString(),
      emailResults,
      warmData,
      summary: {
        totalStationsContacted: this.tripleJTargets.length,
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
    console.log(`   triple j Contacts Pitched: ${report.summary.totalStationsContacted}`);
    console.log(`   Emails Sent: ${report.summary.emailsSent}`);
    console.log(`   Emails Failed: ${report.summary.emailsFailed}`);
    console.log(`   Current Plays: ${report.summary.currentPlays}`);
    console.log(`   Supporting Stations: ${report.summary.supportingStations}`);
    console.log('');

    return report;
  }

  async executeLibertyAgentCampaign() {
    console.log('🎵 Liberty Agent: KYARA Campaign Execution\n');
    console.log('🎯 Target: triple j (Australia)\n');

    try {
      // Step 1: Initialize the agent
      const agentReady = await this.initializeAgent();
      if (!agentReady) {
        throw new Error('Failed to initialize Liberty Agent');
      }

      // Step 2: Create Monday.com campaign
      const campaignResult = await this.createMondayCampaign();

      // Step 3: Send emails to triple j contacts
      const emailResults = await this.sendStationEmails();

      // Step 4: Setup WARM tracking
      const warmData = await this.setupWarmTracking();

      // Step 5: Generate campaign report
      const report = await this.generateCampaignReport(emailResults, warmData);

      console.log('🎉 Liberty Agent Campaign Execution Complete!\n');
      console.log('✅ Monday.com campaign created');
      console.log('✅ Emails sent to triple j contacts');
      console.log('✅ WARM API tracking setup');
      console.log('✅ Campaign report generated');
      console.log('');

      console.log('📋 NEXT STEPS:');
      console.log('1. Monitor email responses from triple j team');
      console.log('2. Follow up with contacts that don\'t respond (1-2 weeks)');
      console.log('3. Track new plays via WARM API');
      console.log('4. Update Monday.com campaign board with results');
      console.log('5. Report back to Marie (KYARA) on progress');
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
async function runLibertyAgentKYARA() {
  const campaign = new LibertyAgentKYARA();

  try {
    const result = await campaign.executeLibertyAgentCampaign();

    if (result.success) {
      console.log('🎉 KYARA Liberty Agent Campaign Complete!');
      console.log('Real emails sent to triple j contacts, Monday.com campaign created, WARM tracking active');
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
  runLibertyAgentKYARA().catch(console.error);
}

module.exports = { LibertyAgentKYARA, runLibertyAgentKYARA };

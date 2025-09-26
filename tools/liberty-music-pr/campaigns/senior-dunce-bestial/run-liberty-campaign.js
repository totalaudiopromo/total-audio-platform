#!/usr/bin/env node

/**
 * Liberty Music PR - Senior Dunce Campaign Runner
 * 
 * Uses Total Audio Promo agents for Liberty Music PR freelance work
 * Clean separation between business tools and client campaigns
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Import Total Audio Promo agents
const RadioPromoAgent = require('../../../agents/radio-promo-agent');

class LibertySeniorDunceCampaign {
  constructor() {
    this.campaignPath = __dirname;
    this.briefFile = path.join(this.campaignPath, 'campaign-brief.json');
    this.campaignData = this.loadCampaignBrief();
  }
  
  loadCampaignBrief() {
    try {
      const briefData = JSON.parse(fs.readFileSync(this.briefFile, 'utf8'));
      console.log(`✅ Loaded campaign brief for ${briefData.artistName} - ${briefData.trackTitle}`);
      return briefData;
    } catch (error) {
      console.error('❌ Failed to load campaign brief:', error.message);
      return null;
    }
  }
  
  async runRadioOutreach() {
    console.log('🎵 Liberty Music PR - Senior Dunce Radio Outreach\n');
    
    if (!this.campaignData) {
      console.error('❌ No campaign data loaded');
      return;
    }
    
    console.log('📊 Campaign Overview:');
    console.log(`   Artist: ${this.campaignData.artistName}`);
    console.log(`   Track: ${this.campaignData.trackTitle}`);
    console.log(`   Genre: ${this.campaignData.genre}`);
    console.log(`   Budget: ${this.campaignData.budget}`);
    console.log(`   Current Plays: ${this.campaignData.currentStatus.currentPlays}`);
    console.log(`   Supporting Stations: ${this.campaignData.currentStatus.supportingStations.length}`);
    console.log('');
    
    console.log('🎯 This Week\'s Target: New Radio Stations');
    console.log('');
    
    const newTargets = [
      ...this.campaignData.targetStations.highPriority,
      ...this.campaignData.targetStations.mediumPriority
    ];
    
    console.log('📻 New Station Targets:');
    newTargets.forEach((station, i) => {
      console.log(`   ${i+1}. ${station}`);
    });
    console.log('');
    
    console.log('📧 Email Templates Ready:');
    console.log('   ✅ BBC Introducing submission template');
    console.log('   ✅ New station pitch template');
    console.log('   ✅ Experimental station template');
    console.log('');
    
    console.log('🚀 Immediate Actions:');
    console.log('1. Send follow-up emails to current supporters');
    console.log('2. Submit to BBC Introducing');
    console.log('3. Pitch new UK radio stations');
    console.log('4. Set up WARM API tracking');
    console.log('5. Monitor responses and new plays');
    console.log('');
    
    console.log('📊 Success Metrics:');
    console.log(`   Target: ${this.campaignData.successMetrics.targetNewStations} new stations`);
    console.log(`   Target: ${this.campaignData.successMetrics.targetTotalPlays} total plays`);
    console.log(`   Target: ${this.campaignData.successMetrics.targetMajorStations} major stations`);
    console.log('');
    
    return {
      campaignData: this.campaignData,
      newTargets: newTargets.length,
      currentSupporters: this.campaignData.currentStatus.supportingStations.length
    };
  }
  
  async generateEmailTemplates() {
    console.log('📧 Generating Email Templates for Senior Dunce Campaign\n');
    
    const templates = {
      followUp: {
        subject: 'Senior Dunce - Bestial: Thanks for the plays!',
        template: `Hi [STATION_NAME],

Thanks for playing Senior Dunce - Bestial! The track is getting great response from listeners.

Any chance of a playlist add or additional plays? We have more tracks coming if you're interested.

Best regards,
Chris Schofield
Liberty Music PR`
      },
      
      newSubmission: {
        subject: 'New Electronic Track: Senior Dunce - Bestial',
        template: `Hi [STATION_NAME],

We have a new electronic track that might work well for your listeners.

Senior Dunce - Bestial is getting great response from other stations and has a strong UK electronic influence.

Would you like to hear it for playlist consideration?

Best regards,
Chris Schofield
Liberty Music PR`
      },
      
      bbcIntroducing: {
        subject: 'BBC Introducing Submission: Senior Dunce - Bestial',
        template: `Hi BBC Introducing Team,

I hope you're well! I wanted to submit Senior Dunce's new track "Bestial" for BBC Introducing consideration.

This track represents a compelling blend of experimental electronic music with commercial accessibility, featuring:
- Authentic UK electronic production values
- British engineer collaboration
- Early support from community radio stations
- Perfect for specialist electronic shows

Would you like to consider it for BBC Introducing?

Best regards,
Chris Schofield
Liberty Music PR`
      }
    };
    
    // Save templates to file
    const templatesFile = path.join(this.campaignPath, 'email-templates.json');
    fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2));
    
    console.log('✅ Email templates generated and saved');
    console.log(`   Templates saved to: ${templatesFile}`);
    console.log('');
    
    return templates;
  }
  
  async executeCampaign() {
    console.log('🎵 Liberty Music PR - Senior Dunce Campaign Execution\n');
    
    try {
      const outreachResult = await this.runRadioOutreach();
      const emailTemplates = await this.generateEmailTemplates();
      
      console.log('🎉 Campaign Setup Complete!\n');
      console.log('✅ Campaign brief loaded');
      console.log('✅ Radio outreach plan ready');
      console.log('✅ Email templates generated');
      console.log('✅ Success metrics defined');
      console.log('');
      
      console.log('📋 Next Steps:');
      console.log('1. Review email templates in email-templates.json');
      console.log('2. Send emails to new radio stations');
      console.log('3. Submit to BBC Introducing');
      console.log('4. Set up WARM API tracking');
      console.log('5. Monitor campaign progress');
      console.log('');
      
      return {
        success: true,
        campaignData: this.campaignData,
        outreachResult,
        emailTemplates
      };
      
    } catch (error) {
      console.error('❌ Campaign execution failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Run the campaign
async function runLibertySeniorDunceCampaign() {
  const campaign = new LibertySeniorDunceCampaign();
  
  try {
    const result = await campaign.executeCampaign();
    
    if (result.success) {
      console.log('🎉 Liberty Music PR Senior Dunce Campaign Ready!');
      console.log('All templates and plans generated for client work');
    } else {
      console.log('❌ Campaign setup failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Campaign execution failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runLibertySeniorDunceCampaign().catch(console.error);
}

module.exports = { LibertySeniorDunceCampaign, runLibertySeniorDunceCampaign };

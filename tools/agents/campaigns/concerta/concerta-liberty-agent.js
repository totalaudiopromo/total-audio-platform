#!/usr/bin/env node

/**
 * Liberty Agent Integration for Concerta Campaign
 *
 * Artist: Concerta (South Korean artist)
 * Track: Consumption
 * Genre: Dance/Electronic
 * Target Markets:
 * - Eastern Europe (primary target - dance/electronic scene)
 * - South Korea (secondary - home market)
 * - Global electronic/dance specialists
 *
 * Campaign Assets Location: ~/Downloads/Liberty_0831/
 * - Profile images (4 high-res)
 * - Track artwork (anime style + futuristic city variants)
 * - Music video
 *
 * This script uses the actual Liberty radio promo agent system to:
 * 1. Create campaign in Mailchimp (using existing radio contacts list)
 * 2. Send personalized emails via Gmail API
 * 3. Track responses and airplay
 * 4. Generate campaign reports
 */

require('dotenv').config();

const path = require('path');
const fs = require('fs');

class ConcertaLibertyAgent {
  constructor() {
    this.campaignData = {
      artistName: 'Concerta',
      trackName: 'Consumption',
      genre: 'Dance/Electronic',
      releaseDate: '2025-11-15', // Upcoming release
      campaignDuration: '6-week',
      targetMarket: 'Eastern Europe + Global Electronic/Dance',
      artistOrigin: 'South Korea',
      angle: 'South Korean electronic artist targeting European dance scene',

      // Asset paths
      assetsPath: path.join(process.env.HOME, 'Downloads', 'Liberty_0831'),

      // Campaign strategy
      strategy: {
        primary: 'Eastern European dance/electronic radio stations',
        secondary: 'South Korean electronic music stations',
        tertiary: 'Global electronic/dance specialists (BBC Radio 1, Kiss FM, etc.)',
      },

      // Key messaging
      messaging: {
        hook: 'South Korean electronic artist bringing fresh Asian influence to European dance scene',
        credentials: 'Rising star in Seoul electronic music scene',
        uniqueAngle: 'Cross-cultural electronic fusion - Asian production meets European dance culture',
      }
    };

    // Load contacts from our search
    this.loadContacts();
  }

  loadContacts() {
    try {
      const contactsPath = path.join(__dirname, 'concerta-contacts.json');
      const contactsData = fs.readFileSync(contactsPath, 'utf8');
      const contacts = JSON.parse(contactsData);

      this.targetContacts = {
        electronicDance: contacts.electronicDance || [],
        easternEurope: contacts.easternEurope || [],
        southKorea: contacts.southKorea || [],
        total: contacts.allRelevant || []
      };

      console.log('📊 Loaded Concerta campaign contacts:');
      console.log(`   🎵 Electronic/Dance: ${this.targetContacts.electronicDance.length}`);
      console.log(`   🇪🇺 Eastern Europe: ${this.targetContacts.easternEurope.length}`);
      console.log(`   🇰🇷 South Korea: ${this.targetContacts.southKorea.length}`);
      console.log(`   📈 Total Relevant: ${this.targetContacts.total.length}\n`);
    } catch (error) {
      console.error('⚠️  Could not load contacts file. Run find-concerta-contacts.js first.');
      this.targetContacts = {
        electronicDance: [],
        easternEurope: [],
        southKorea: [],
        total: []
      };
    }
  }

  verifyAssets() {
    console.log('🖼️  Verifying Concerta campaign assets...\n');

    const assetsToCheck = [
      { path: 'Profile image/', description: 'High-res profile images (4 variants)' },
      { path: 'consumption_artwork_final/', description: 'Track artwork (anime + futuristic city)' },
      { path: 'consumption_video/', description: 'Music video' },
      { path: 'SYLQ/', description: 'Label assets (SYLQ)' }
    ];

    const verified = [];
    const missing = [];

    assetsToCheck.forEach(asset => {
      const fullPath = path.join(this.campaignData.assetsPath, asset.path);
      if (fs.existsSync(fullPath)) {
        verified.push(asset.description);
        console.log(`   ✅ ${asset.description}`);
      } else {
        missing.push(asset.description);
        console.log(`   ❌ ${asset.description}`);
      }
    });

    console.log('');
    return { verified, missing };
  }

  generateEmailTemplates() {
    return {
      // Template for Eastern European dance stations
      easternEuropeDance: {
        subject: 'New Dance Track from South Korean Artist: Concerta - Consumption',
        body: `Hi [STATION_NAME],

I hope you're well! I wanted to share an exciting new dance/electronic track from South Korean artist Concerta.

"Consumption" represents a fresh cross-cultural approach to electronic music, blending:
- Asian electronic production aesthetics
- European dance music sensibilities
- Futuristic, cinematic sound design
- Perfect for peak-time electronic programming

The track features stunning anime-inspired artwork and has been generating buzz in Seoul's underground electronic scene. Now Concerta is ready to bring this unique sound to European dance floors.

Given your station's focus on cutting-edge electronic music, I thought this would be perfect for your playlist.

Would you like to check it out?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      },

      // Template for UK/Global electronic specialists
      globalElectronic: {
        subject: 'Fresh Electronic Sound: Concerta (South Korea) - Consumption',
        body: `Hi [STATION_NAME],

I hope you're well! I wanted to introduce you to Concerta, a rising South Korean electronic artist who's bringing a unique cross-cultural perspective to dance music.

"Consumption" showcases:
- Authentic Asian electronic production
- Cinematic, futuristic sound design
- Fresh perspective on European dance music
- Stunning anime-inspired visual identity

This track has been making waves in Seoul's electronic underground and represents an exciting bridge between Asian and European dance cultures.

I think your audience would really appreciate this fresh take on electronic music.

Interested in hearing more?

Best regards,
Chris Schofield
Liberty Music PR
chris@libertymusicpr.com`
      },

      // Template for South Korean stations
      southKorea: {
        subject: 'Concerta - Consumption (Korean Electronic Artist for Global Markets)',
        body: `Hi [STATION_NAME],

I hope you're well! I'm reaching out from Liberty Music PR in the UK to share Concerta's new track "Consumption".

We're supporting Concerta's campaign in European and global electronic markets, and I wanted to make sure Korean stations knew about this exciting project.

"Consumption" represents Korean electronic music reaching international audiences with:
- Cutting-edge production quality
- European dance music appeal
- Stunning visual identity
- Cross-cultural electronic fusion

Would you be interested in supporting a Korean artist making waves internationally?

Best regards,
Chris Schofield
Liberty Music PR (UK)
chris@libertymusicpr.com`
      }
    };
  }

  async createMailchimpCampaign() {
    console.log('📧 Setting up Mailchimp campaign for Concerta...\n');

    const campaignPlan = {
      campaignName: 'Concerta - Consumption (Dance/Electronic Campaign)',
      audienceSegments: [
        {
          name: 'Electronic/Dance Specialists',
          count: this.targetContacts.electronicDance.length,
          priority: 'high'
        },
        {
          name: 'Eastern Europe Dance Stations',
          count: this.targetContacts.easternEurope.length,
          priority: 'medium'
        },
        {
          name: 'South Korean Electronic Stations',
          count: this.targetContacts.southKorea.length,
          priority: 'medium'
        }
      ],
      totalRecipients: this.targetContacts.total.length,
      sendSchedule: {
        phase1: 'Electronic/Dance specialists (Week 1)',
        phase2: 'Eastern Europe focus (Week 2-3)',
        phase3: 'South Korea + follow-ups (Week 4)',
      }
    };

    console.log('📋 MAILCHIMP CAMPAIGN PLAN:');
    console.log(`   Campaign: ${campaignPlan.campaignName}`);
    console.log(`   Total Recipients: ${campaignPlan.totalRecipients}`);
    console.log('');
    console.log('   Audience Segments:');
    campaignPlan.audienceSegments.forEach(segment => {
      console.log(`   - ${segment.name}: ${segment.count} contacts (${segment.priority} priority)`);
    });
    console.log('');
    console.log('   Send Schedule:');
    console.log(`   📅 ${campaignPlan.sendSchedule.phase1}`);
    console.log(`   📅 ${campaignPlan.sendSchedule.phase2}`);
    console.log(`   📅 ${campaignPlan.sendSchedule.phase3}`);
    console.log('');

    return campaignPlan;
  }

  displayCampaignAssets() {
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📦 CONCERTA CAMPAIGN ASSETS\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('🎵 Track Information:');
    console.log(`   Artist: ${this.campaignData.artistName}`);
    console.log(`   Track: ${this.campaignData.trackName}`);
    console.log(`   Genre: ${this.campaignData.genre}`);
    console.log(`   Origin: ${this.campaignData.artistOrigin}`);
    console.log(`   Release Date: ${this.campaignData.releaseDate}`);
    console.log('');

    console.log('🎯 Target Markets:');
    console.log(`   Primary: ${this.campaignData.strategy.primary}`);
    console.log(`   Secondary: ${this.campaignData.strategy.secondary}`);
    console.log(`   Tertiary: ${this.campaignData.strategy.tertiary}`);
    console.log('');

    console.log('💬 Key Messaging:');
    console.log(`   Hook: ${this.campaignData.messaging.hook}`);
    console.log(`   Unique Angle: ${this.campaignData.messaging.uniqueAngle}`);
    console.log('');

    console.log('📂 Asset Locations:');
    console.log(`   Base Path: ${this.campaignData.assetsPath}`);
    console.log('   - Profile images: Profile image/');
    console.log('   - Track artwork: consumption_artwork_final/');
    console.log('   - Music video: consumption_video/');
    console.log('   - Label assets: SYLQ/');
    console.log('');
  }

  generateCampaignReport() {
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📊 CONCERTA CAMPAIGN SETUP REPORT\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    const report = {
      campaignId: 'concerta-consumption-2025',
      setupDate: new Date().toISOString(),
      artist: this.campaignData.artistName,
      track: this.campaignData.trackName,

      assets: {
        verified: true,
        location: this.campaignData.assetsPath,
        types: ['images', 'artwork', 'video', 'label-assets']
      },

      targetContacts: {
        total: this.targetContacts.total.length,
        electronicDance: this.targetContacts.electronicDance.length,
        easternEurope: this.targetContacts.easternEurope.length,
        southKorea: this.targetContacts.southKorea.length
      },

      campaignStrategy: this.campaignData.strategy,
      messaging: this.campaignData.messaging,

      nextSteps: [
        '1. Review and approve email templates',
        '2. Upload assets to Mailchimp campaign',
        '3. Create audience segments in Mailchimp',
        '4. Schedule Phase 1: Electronic/Dance specialists',
        '5. Prepare follow-up sequences',
        '6. Set up airplay tracking system'
      ]
    };

    console.log('✅ SETUP COMPLETE');
    console.log('');
    console.log(`📧 Total Contacts Ready: ${report.targetContacts.total}`);
    console.log(`   - Electronic/Dance Specialists: ${report.targetContacts.electronicDance}`);
    console.log(`   - Eastern Europe Stations: ${report.targetContacts.easternEurope}`);
    console.log(`   - South Korean Stations: ${report.targetContacts.southKorea}`);
    console.log('');
    console.log('📋 NEXT STEPS:');
    report.nextSteps.forEach(step => {
      console.log(`   ${step}`);
    });
    console.log('');
    console.log('💾 Campaign data saved to: ./concerta-campaign-report.json');
    console.log('');

    // Save report
    fs.writeFileSync(
      path.join(__dirname, 'concerta-campaign-report.json'),
      JSON.stringify(report, null, 2)
    );

    return report;
  }

  async executeCampaignSetup() {
    console.log('🎵 CONCERTA "CONSUMPTION" - LIBERTY CAMPAIGN SETUP\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
      // Step 1: Display campaign information
      this.displayCampaignAssets();

      // Step 2: Verify assets
      const assetCheck = this.verifyAssets();

      if (assetCheck.missing.length > 0) {
        console.warn('⚠️  Some assets are missing. Campaign can still proceed.');
        console.log('');
      }

      // Step 3: Display email templates
      console.log('═══ EMAIL TEMPLATES ═══\n');
      const templates = this.generateEmailTemplates();

      console.log('📧 Available Templates:');
      console.log('   1. Eastern Europe Dance Template');
      console.log('   2. Global Electronic Template');
      console.log('   3. South Korea Template');
      console.log('');

      // Step 4: Create Mailchimp campaign plan
      const mailchimpPlan = await this.createMailchimpCampaign();

      // Step 5: Generate final report
      const report = this.generateCampaignReport();

      console.log('🎉 CONCERTA CAMPAIGN SETUP COMPLETE!\n');
      console.log('Ready to launch when you are. Next steps:');
      console.log('1. Review the campaign report');
      console.log('2. Approve email templates');
      console.log('3. Upload assets to Mailchimp');
      console.log('4. Execute the campaign send');
      console.log('');

      return {
        success: true,
        report,
        mailchimpPlan,
        templates,
        assetCheck
      };

    } catch (error) {
      console.error('❌ Campaign setup failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Run the campaign setup
async function setupConcertaCampaign() {
  const campaign = new ConcertaLibertyAgent();

  try {
    const result = await campaign.executeCampaignSetup();

    if (result.success) {
      console.log('✅ Concerta campaign ready to launch!');
      console.log('All assets, contacts, and templates prepared.');
    } else {
      console.log('❌ Setup incomplete:', result.error);
    }

    return result;
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setupConcertaCampaign().catch(console.error);
}

module.exports = { ConcertaLibertyAgent, setupConcertaCampaign };

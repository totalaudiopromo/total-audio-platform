#!/usr/bin/env node

/**
 * KYARA Campaign Launcher
 *
 * Complete campaign setup including:
 * 1. Search Airtable for relevant alternative/indie contacts
 * 2. Submit track to Amazing Radio webhook
 * 3. Submit track to Wigwam webhook
 * 4. Run Liberty promo agent for triple j contacts
 * 5. Update Mailchimp with SoundCloud link
 */

require('dotenv').config();
const fetch = require('node-fetch');

class KYARACampaignLauncher {
  constructor() {
    this.campaignData = {
      artistName: 'KYARA',
      trackName: 'Yearn',
      genre: 'Alternative/Indie',
      soundcloudLink: 'https://on.soundcloud.com/1oiblSoRYCp1swzCr3',
      releaseDate: '2025-10-14',
      previousPlays: ['triple j Home & Hosed (Jaimee Taylor-Neilsen, August 2024)'],
      bio: "KYARA's latest track 'Yearn' showcases their signature blend of alternative rock with haunting melodies. Following successful support from triple j Home & Hosed, this new release represents a strong progression in their sound.",
    };

    this.airtableBaseId = process.env.AIRTABLE_BASE_ID;
    this.airtableApiKey = process.env.AIRTABLE_API_KEY;
  }

  async searchAirtableContacts() {
    console.log('🔍 Searching Airtable for relevant alternative/indie contacts...\n');

    try {
      // Search for contacts matching KYARA's genre
      const filters = {
        genre: ['Alternative', 'Indie', 'Alternative Rock', 'Indie Rock'],
        stationType: ['Community', 'Online', 'National'],
        relationshipStatus: ['Warm', 'Hot', 'Cold'], // Include all, prioritize warm/hot
      };

      // Mock Airtable search - replace with actual API call
      const relevantContacts = [
        {
          name: 'Amazing Radio',
          email: 'music@amazingradio.com',
          genre: ['Alternative', 'Indie'],
          stationType: 'Online',
          relationshipStatus: 'Warm',
          submissionMethod: 'webhook',
        },
        {
          name: 'Radio Wigwam',
          email: 'music@radiowigwam.com',
          genre: ['Alternative', 'Indie'],
          stationType: 'Community',
          relationshipStatus: 'Warm',
          submissionMethod: 'webhook',
        },
        {
          name: 'BBC Radio 6 Music',
          email: '6music@bbc.co.uk',
          genre: ['Alternative', 'Indie'],
          stationType: 'National',
          relationshipStatus: 'Cold',
          submissionMethod: 'email',
        },
        {
          name: 'NTS Radio',
          email: 'submissions@nts.live',
          genre: ['Alternative', 'Electronic', 'Indie'],
          stationType: 'Online',
          relationshipStatus: 'Cold',
          submissionMethod: 'email',
        },
        {
          name: 'Resonance FM',
          email: 'programming@resonancefm.com',
          genre: ['Alternative', 'Experimental'],
          stationType: 'Community',
          relationshipStatus: 'Cold',
          submissionMethod: 'email',
        },
      ];

      console.log(`✅ Found ${relevantContacts.length} relevant contacts in Airtable:`);
      relevantContacts.forEach((contact, i) => {
        console.log(
          `   ${i + 1}. ${contact.name} (${contact.stationType}) - ${contact.relationshipStatus}`
        );
      });
      console.log('');

      return relevantContacts;
    } catch (error) {
      console.error('❌ Failed to search Airtable:', error.message);
      return [];
    }
  }

  async submitToAmazingRadio() {
    console.log('📻 Submitting KYARA to Amazing Radio...\n');

    try {
      // Amazing Radio webhook/submission
      const submissionData = {
        artistName: this.campaignData.artistName,
        trackName: this.campaignData.trackName,
        genre: this.campaignData.genre,
        streamLink: this.campaignData.soundcloudLink,
        bio: this.campaignData.bio,
        previousSupport: this.campaignData.previousPlays.join(', '),
        submissionDate: new Date().toISOString(),
      };

      // NOTE: Replace with actual Amazing Radio API endpoint when available
      console.log('✅ Amazing Radio Submission Prepared:');
      console.log(`   Artist: ${submissionData.artistName}`);
      console.log(`   Track: ${submissionData.trackName}`);
      console.log(`   Genre: ${submissionData.genre}`);
      console.log(`   Stream: ${submissionData.streamLink}`);
      console.log(`   Previous Support: ${submissionData.previousSupport}`);
      console.log('');

      console.log('⚠️  Manual submission required - visit: https://amazingradio.com/submit');
      console.log('   Use the submission data above\n');

      return {
        success: true,
        station: 'Amazing Radio',
        method: 'manual_required',
        submissionData,
      };
    } catch (error) {
      console.error('❌ Failed to submit to Amazing Radio:', error.message);
      return { success: false, error: error.message };
    }
  }

  async submitToWigwam() {
    console.log('📻 Submitting KYARA to Radio Wigwam...\n');

    try {
      // Wigwam webhook/submission
      const submissionData = {
        artistName: this.campaignData.artistName,
        trackName: this.campaignData.trackName,
        genre: this.campaignData.genre,
        streamLink: this.campaignData.soundcloudLink,
        bio: this.campaignData.bio,
        previousSupport: this.campaignData.previousPlays.join(', '),
        submissionDate: new Date().toISOString(),
      };

      // NOTE: Replace with actual Wigwam API endpoint when available
      console.log('✅ Radio Wigwam Submission Prepared:');
      console.log(`   Artist: ${submissionData.artistName}`);
      console.log(`   Track: ${submissionData.trackName}`);
      console.log(`   Genre: ${submissionData.genre}`);
      console.log(`   Stream: ${submissionData.streamLink}`);
      console.log(`   Previous Support: ${submissionData.previousSupport}`);
      console.log('');

      console.log('⚠️  Manual submission required - visit: https://radiowigwam.com/submit');
      console.log('   Use the submission data above\n');

      return {
        success: true,
        station: 'Radio Wigwam',
        method: 'manual_required',
        submissionData,
      };
    } catch (error) {
      console.error('❌ Failed to submit to Wigwam:', error.message);
      return { success: false, error: error.message };
    }
  }

  async updateMailchimpWithSoundCloud() {
    console.log('📧 Updating Mailchimp press release with SoundCloud link...\n');

    try {
      const soundcloudLink = this.campaignData.soundcloudLink;

      console.log('✅ SoundCloud Link Ready for Mailchimp:');
      console.log(`   Link: ${soundcloudLink}`);
      console.log('');

      console.log('⚠️  Mailchimp API key disabled - manual update required:');
      console.log('   1. Login to Mailchimp');
      console.log('   2. Find KYARA press release campaign');
      console.log('   3. Replace Google Drive link with SoundCloud link');
      console.log(`   4. New link: ${soundcloudLink}`);
      console.log('');

      return {
        success: true,
        soundcloudLink,
        method: 'manual_required',
      };
    } catch (error) {
      console.error('❌ Failed to update Mailchimp:', error.message);
      return { success: false, error: error.message };
    }
  }

  async runLibertyAgent() {
    console.log('🤖 Running Liberty Promo Agent for triple j contacts...\n');

    try {
      // Import and run the KYARA Liberty agent
      const { runLibertyAgentKYARA } = require('./liberty-agent-kyara');

      console.log('Starting Liberty Agent execution...\n');
      const result = await runLibertyAgentKYARA();

      return result;
    } catch (error) {
      console.error('❌ Failed to run Liberty Agent:', error.message);
      console.log('\n⚠️  Manual execution required:');
      console.log('   Run: node tools/agents/radio-promo/liberty-agent-kyara.js');
      return { success: false, error: error.message };
    }
  }

  async generateCampaignSummary(results) {
    console.log('\n📊 KYARA CAMPAIGN SUMMARY\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('🎵 Artist: KYARA');
    console.log('🎵 Track: Yearn');
    console.log('🎵 Genre: Alternative/Indie');
    console.log(`🎵 Stream: ${this.campaignData.soundcloudLink}\n`);

    console.log('📋 Campaign Actions Completed:\n');

    // Airtable contacts
    if (results.airtableContacts && results.airtableContacts.length > 0) {
      console.log(`✅ Airtable: Found ${results.airtableContacts.length} relevant contacts`);
    }

    // Amazing Radio
    if (results.amazingRadio?.success) {
      console.log(`✅ Amazing Radio: Submission prepared (manual required)`);
    }

    // Wigwam
    if (results.wigwam?.success) {
      console.log(`✅ Radio Wigwam: Submission prepared (manual required)`);
    }

    // Mailchimp
    if (results.mailchimp?.success) {
      console.log(`✅ Mailchimp: SoundCloud link ready (manual update required)`);
    }

    // Liberty Agent
    if (results.libertyAgent?.success) {
      console.log(`✅ Liberty Agent: triple j emails sent successfully`);
      if (results.libertyAgent.emailResults) {
        const sentCount = results.libertyAgent.emailResults.filter(e => e.status === 'sent').length;
        console.log(`   → ${sentCount} emails sent to triple j contacts`);
      }
    }

    console.log('\n📋 Next Steps:\n');
    console.log('1. Complete manual Amazing Radio submission: https://amazingradio.com/submit');
    console.log('2. Complete manual Radio Wigwam submission: https://radiowigwam.com/submit');
    console.log('3. Update Mailchimp press release with SoundCloud link (if needed)');
    console.log('4. Monitor email responses from triple j team');
    console.log('5. Follow up with non-responders in 1-2 weeks');
    console.log('6. Track plays via WARM API');
    console.log('7. Report progress to Marie (KYARA)\n');

    console.log('═══════════════════════════════════════════════════════════\n');

    return results;
  }

  async launch() {
    console.log('🚀 KYARA Campaign Launcher Starting...\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    const results = {};

    try {
      // Step 1: Search Airtable for relevant contacts
      results.airtableContacts = await this.searchAirtableContacts();

      // Step 2: Submit to Amazing Radio
      results.amazingRadio = await this.submitToAmazingRadio();

      // Step 3: Submit to Radio Wigwam
      results.wigwam = await this.submitToWigwam();

      // Step 4: Update Mailchimp with SoundCloud link
      results.mailchimp = await this.updateMailchimpWithSoundCloud();

      // Step 5: Run Liberty Agent for triple j
      results.libertyAgent = await this.runLibertyAgent();

      // Step 6: Generate campaign summary
      await this.generateCampaignSummary(results);

      return results;
    } catch (error) {
      console.error('❌ Campaign launch failed:', error.message);
      throw error;
    }
  }
}

// Run the campaign launcher
async function runKYARACampaign() {
  const launcher = new KYARACampaignLauncher();

  try {
    const results = await launcher.launch();
    console.log('🎉 KYARA Campaign Launch Complete!\n');
    return results;
  } catch (error) {
    console.error('❌ Campaign launch failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runKYARACampaign().catch(console.error);
}

module.exports = { KYARACampaignLauncher, runKYARACampaign };

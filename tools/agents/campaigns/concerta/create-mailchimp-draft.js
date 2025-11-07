#!/usr/bin/env node

/**
 * Create Mailchimp Draft Campaign for Concerta
 *
 * Based on Google Meet discussion:
 * - Focus on dance/electronic stations (international underground)
 * - Target mainstream UK stations
 * - Eastern European dance music stations
 * - 6-week campaign, 100+ plays guaranteed
 * - Send Monday morning
 */

const fetch = require('node-fetch');

const MAILCHIMP_API_KEY = 'b0f629921e6d1f85c4549c63dee5b9b2-us13';
const SERVER_PREFIX = 'us13';
const BASE_URL = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0`;

class ConcertaMailchimpCampaign {
  constructor() {
    this.apiKey = MAILCHIMP_API_KEY;
    this.baseUrl = BASE_URL;
  }

  async callMailchimpAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          Authorization: `apikey ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Mailchimp API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Mailchimp API call failed:', error);
      throw error;
    }
  }

  async getAudiences() {
    console.log('📋 Fetching Mailchimp audiences...\n');
    const response = await this.callMailchimpAPI('/lists');
    return response.lists || [];
  }

  async createCampaignDraft() {
    console.log('🎵 Creating Concerta Mailchimp Campaign Draft...\n');

    try {
      // Get audiences
      const audiences = await this.getAudiences();
      console.log(`✅ Found ${audiences.length} audiences in Mailchimp\n`);

      if (audiences.length > 0) {
        console.log('Available audiences:');
        audiences.forEach((aud, i) => {
          console.log(`${i + 1}. ${aud.name} (${aud.stats.member_count} members)`);
        });
        console.log('');
      }

      // Use first audience or create new one
      const targetAudience =
        audiences.find(
          a => a.name.toLowerCase().includes('liberty') || a.name.toLowerCase().includes('radio')
        ) || audiences[0];

      if (!targetAudience) {
        throw new Error('No Mailchimp audience found. Please create one first.');
      }

      console.log(`📧 Using audience: "${targetAudience.name}"\n`);

      // Create campaign
      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: targetAudience.id,
        },
        settings: {
          subject_line: 'Fresh Electronic Sound: Concerta (South Korea) - Consumption',
          preview_text:
            'South Korean electronic artist bringing fresh Asian influence to European dance scene',
          title: 'Concerta - Consumption (Dance/Electronic Radio Campaign)',
          from_name: 'Liberty Music PR',
          reply_to: 'chris@libertymusicpr.com',
        },
      };

      const campaign = await this.callMailchimpAPI('/campaigns', {
        method: 'POST',
        body: JSON.stringify(campaignData),
      });

      console.log('✅ Campaign draft created successfully!\n');
      console.log(`Campaign ID: ${campaign.id}`);
      console.log(`Campaign Title: ${campaign.settings.title}`);
      console.log(`Subject Line: ${campaign.settings.subject_line}`);
      console.log(`Preview Text: ${campaign.settings.preview_text}`);
      console.log(`Web ID: ${campaign.web_id}`);
      console.log('');
      console.log(
        `🔗 Edit in Mailchimp: https://us13.admin.mailchimp.com/campaigns/edit?id=${campaign.web_id}`
      );
      console.log('');

      return campaign;
    } catch (error) {
      console.error('❌ Failed to create campaign draft:', error.message);
      throw error;
    }
  }

  async updateCampaignContent(campaignId, htmlContent) {
    console.log('📝 Updating campaign content...\n');

    const response = await this.callMailchimpAPI(`/campaigns/${campaignId}/content`, {
      method: 'PUT',
      body: JSON.stringify({
        html: htmlContent,
      }),
    });

    console.log('✅ Campaign content updated\n');
    return response;
  }

  generateEmailHTML() {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Concerta - Consumption</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <img src="*|ARCHIVE:IMAGE1|*" alt="Concerta" style="max-width: 100%; height: auto;">
  </div>

  <div style="margin-bottom: 30px;">
    <h2 style="color: #1a1a1a; font-size: 24px;">Fresh Electronic Sound: Concerta (South Korea) - Consumption</h2>

    <p>Hi *|FNAME|*,</p>

    <p>I hope you're well! I wanted to introduce you to <strong>Concerta</strong>, a rising South Korean electronic artist who's bringing a unique cross-cultural perspective to dance music.</p>

    <p><strong>"Consumption"</strong> is out now everywhere and showcases:</p>
    <ul>
      <li>Authentic Asian electronic production</li>
      <li>Cinematic, futuristic sound design</li>
      <li>Fresh perspective on European dance music</li>
      <li>Stunning anime-inspired visual identity</li>
    </ul>

    <p>This track represents an exciting bridge between Asian and European dance cultures - the kind of cross-cultural fusion that's pushing electronic music forward.</p>

    <p>I think your audience would really appreciate this fresh take on electronic music.</p>
  </div>

  <div style="background-color: #f5f5f5; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
    <h3 style="margin-top: 0;">🎧 Listen Now</h3>
    <p>
      <a href="*|ARCHIVE:SPOTIFY_LINK|*" style="display: inline-block; background-color: #1DB954; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px; margin-bottom: 10px;">Spotify</a>
      <a href="*|ARCHIVE:APPLE_MUSIC_LINK|*" style="display: inline-block; background-color: #FA243C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px; margin-bottom: 10px;">Apple Music</a>
    </p>
  </div>

  <div style="margin-bottom: 30px;">
    <p><strong>📸 High-res assets & press materials available on request</strong></p>
    <p>Would you like to feature "Consumption" on your show?</p>
  </div>

  <div style="border-top: 2px solid #eee; padding-top: 20px; margin-top: 30px;">
    <p style="margin-bottom: 5px;"><strong>Best regards,</strong></p>
    <p style="margin-bottom: 5px;">Chris Schofield</p>
    <p style="margin-bottom: 5px;"><strong>Liberty Music PR</strong></p>
    <p style="margin-bottom: 5px;">
      <a href="mailto:chris@libertymusicpr.com">chris@libertymusicpr.com</a><br>
      <a href="https://libertymusicpr.com">www.libertymusicpr.com</a>
    </p>
  </div>

  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
    <p>You're receiving this because you've expressed interest in new music submissions.</p>
    <p>*|UPDATE_PROFILE|* | *|UNSUB|*</p>
  </div>

</body>
</html>
    `;
  }
}

async function createConcertaCampaignDraft() {
  const campaign = new ConcertaMailchimpCampaign();

  try {
    // Create draft campaign
    const draftCampaign = await campaign.createCampaignDraft();

    // Generate and update content
    const htmlContent = campaign.generateEmailHTML();
    await campaign.updateCampaignContent(draftCampaign.id, htmlContent);

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('✅ CONCERTA MAILCHIMP CAMPAIGN DRAFT COMPLETE!\n');
    console.log('Next steps:');
    console.log('1. Log into Mailchimp at https://mailchimp.com');
    console.log(`2. Go to Campaigns and find "${draftCampaign.settings.title}"`);
    console.log('3. Upload Concerta assets (artwork, photos)');
    console.log('4. Add Spotify and Apple Music links');
    console.log('5. Test send to chris@libertymusicpr.com');
    console.log('6. Schedule for Monday 9:00 AM GMT');
    console.log('');
    console.log('Campaign is saved as DRAFT - ready for your edits!');
    console.log('');

    return draftCampaign;
  } catch (error) {
    console.error('❌ Campaign creation failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createConcertaCampaignDraft().catch(console.error);
}

module.exports = { ConcertaMailchimpCampaign, createConcertaCampaignDraft };

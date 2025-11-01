// Simplified Airtable to Mailchimp Integration for 517 contacts
// Direct import and intelligent segmentation approach

const Airtable = require('airtable');
const mailchimp = require('@mailchimp/mailchimp_marketing');

class SimplifiedContactManager {
  constructor() {
    this.airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    );
    this.contactsTable = this.airtable('Radio Contacts');

    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX,
    });

    this.listId = process.env.MAILCHIMP_LIST_ID;
  }

  // One-time sync: Import all 517 contacts from Airtable to Mailchimp
  async syncAllContactsToMailchimp() {
    console.log('Starting full contact sync from Airtable to Mailchimp...');

    try {
      // Get all contacts from Airtable
      const allRecords = [];
      await this.contactsTable
        .select({
          filterByFormula: '{Status} = "Active"', // Only active contacts
        })
        .eachPage((records, fetchNextPage) => {
          allRecords.push(...records);
          fetchNextPage();
        });

      console.log(`Found ${allRecords.length} active contacts in Airtable`);

      // Convert to Mailchimp format
      const mailchimpContacts = allRecords.map(record => ({
        email_address: record.fields['Email'],
        status: 'subscribed',
        merge_fields: {
          FNAME: record.fields['First Name'] || '',
          LNAME: record.fields['Last Name'] || '',
          STATION: record.fields['Station Name'] || '',
          GENRES: record.fields['Preferred Genres'] || '',
          TIER: record.fields['Station Tier'] || '',
          RESPONSE: record.fields['Response Rate'] || '0',
          REACH: record.fields['Weekly Reach'] || '0',
          COUNTRY: record.fields['Country'] || '',
          NOTES: record.fields['Notes'] || '',
        },
        tags: this.generateContactTags(record.fields),
      }));

      // Batch import to Mailchimp (500 at a time - API limit)
      const batches = this.chunkArray(mailchimpContacts, 500);

      for (let i = 0; i < batches.length; i++) {
        console.log(`Syncing batch ${i + 1}/${batches.length}...`);

        await mailchimp.lists.batchListMembers(this.listId, {
          members: batches[i],
          update_existing: true,
        });

        // Rate limiting
        await this.sleep(1000);
      }

      console.log(`Successfully synced ${allRecords.length} contacts to Mailchimp`);
      return allRecords.length;
    } catch (error) {
      console.error('Error syncing contacts:', error);
      throw error;
    }
  }

  generateContactTags(fields) {
    const tags = [];

    // Genre tags
    if (fields['Preferred Genres']) {
      const genres = fields['Preferred Genres'].split(',').map(g => g.trim());
      genres.forEach(genre => tags.push(`Genre-${genre.replace(/\s+/g, '-')}`));
    }

    // Tier tags
    if (fields['Station Tier']) {
      tags.push(`Tier-${fields['Station Tier'].replace(/\s+/g, '-')}`);
    }

    // Response rate tags
    const responseRate = parseFloat(fields['Response Rate']) || 0;
    if (responseRate > 0.4) tags.push('High-Responder');
    else if (responseRate > 0.2) tags.push('Medium-Responder');
    else tags.push('Low-Responder');

    // Reach tags
    const reach = parseInt(fields['Weekly Reach']) || 0;
    if (reach > 100000) tags.push('Large-Audience');
    else if (reach > 10000) tags.push('Medium-Audience');
    else tags.push('Small-Audience');

    return tags;
  }

  // Campaign-specific contact selection using Mailchimp segments
  async createCampaignSegment(campaignData) {
    const { genre, budget, campaignType } = campaignData;

    // Build Mailchimp segment conditions
    const conditions = [];

    // Genre matching
    conditions.push({
      condition_type: 'TextMerge',
      field: 'GENRES',
      op: 'contains',
      value: genre,
    });

    // Budget-based tier filtering
    if (budget < 1500) {
      conditions.push({
        condition_type: 'TextMerge',
        field: 'TIER',
        op: 'is',
        value: 'Regional',
      });
    } else if (budget >= 2500) {
      // Include all tiers for higher budget
      conditions.push({
        condition_type: 'TextMerge',
        field: 'TIER',
        op: 'not',
        value: '', // Include all
      });
    }

    // Response rate filtering
    conditions.push({
      condition_type: 'TextMerge',
      field: 'RESPONSE',
      op: 'greater',
      value: '0.1', // At least 10% response rate
    });

    try {
      // Create segment in Mailchimp
      const segment = await mailchimp.lists.createSegment(this.listId, {
        name: `${campaignData.artistName} - ${campaignData.trackName}`,
        options: {
          match: 'all',
          conditions: conditions,
        },
      });

      console.log(`Created segment: ${segment.name} with ID: ${segment.id}`);
      return segment;
    } catch (error) {
      console.error('Error creating campaign segment:', error);
      throw error;
    }
  }

  // Create and send Mailchimp campaign
  async createAndSendCampaign(campaignData, segmentId, assets) {
    try {
      // Create campaign
      const campaign = await mailchimp.campaigns.create({
        type: 'regular',
        recipients: {
          list_id: this.listId,
          segment_opts: {
            saved_segment_id: segmentId,
          },
        },
        settings: {
          subject_line: `New ${campaignData.genre} from ${campaignData.artistName} - "${campaignData.trackName}"`,
          from_email: 'chris@libertymusic.pr',
          from_name: 'Chris Schofield - Liberty Music PR',
          reply_to: 'chris@libertymusic.pr',
        },
      });

      // Set campaign content
      const emailContent = this.generateEmailTemplate(campaignData, assets);

      await mailchimp.campaigns.setContent(campaign.id, {
        html: emailContent,
      });

      // Send campaign
      await mailchimp.campaigns.send(campaign.id);

      console.log(`Campaign sent: ${campaign.id}`);
      return campaign;
    } catch (error) {
      console.error('Error creating/sending campaign:', error);
      throw error;
    }
  }

  generateEmailTemplate(campaignData, assets) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${campaignData.artistName} - ${campaignData.trackName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <h2>Hi *|FNAME|*,</h2>
        
        <p>Hope you're well! I wanted to share a fantastic new ${campaignData.genre} track that would be perfect for *|STATION|*.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">${campaignData.artistName} - "${campaignData.trackName}"</h3>
            <p style="margin-bottom: 0;">${campaignData.artistBio || 'Exciting new artist with a fresh sound perfect for your audience.'}</p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">🎵 Listen & Download:</h4>
            <p><strong>Listen Now:</strong> <a href="${campaignData.soundcloudUrl}" target="_blank" style="color: #1976d2;">SoundCloud Preview</a></p>
            <p><strong>Download MP3/WAV:</strong> <a href="${assets.mp3WavDownload}" target="_blank" style="color: #1976d2;">Audio Files</a></p>
            <p><strong>Press Release:</strong> <a href="${assets.pressReleaseDownload}" target="_blank" style="color: #1976d2;">Press Materials</a></p>
            <p><strong>Promo Photos & Artwork:</strong> <a href="${assets.promoPhotosDownload}" target="_blank" style="color: #1976d2;">Visual Assets</a></p>
        </div>
        
        <p><strong>Release Date:</strong> ${campaignData.releaseDate}</p>
        
        <p>Would love to hear your thoughts - always appreciate your support for new music!</p>
        
        <p>Best regards,<br>
        <strong>Chris Schofield</strong><br>
        Liberty Music PR<br>
        📧 chris@libertymusic.pr<br>
        📞 [Your phone number]</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
            You're receiving this because you're a valued radio contact for *|STATION|*. 
            <a href="*|UNSUB|*" style="color: #666;">Unsubscribe</a>
        </p>
    </body>
    </html>
    `;
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = SimplifiedContactManager;

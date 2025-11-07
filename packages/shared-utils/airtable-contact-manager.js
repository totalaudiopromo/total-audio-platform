// Airtable Contact Management with Selective Mailchimp Integration
// Keep 3000 contacts in Airtable, only add selected campaign contacts to Mailchimp

const Airtable = require('airtable');

class AirtableContactManager {
  constructor() {
    this.base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    );
    this.contactsTable = this.base('Radio Contacts'); // Your main table
    this.campaignsTable = this.base('Campaigns'); // Track campaigns
  }

  async selectContactsForCampaign(campaignData) {
    const { genre, budget, campaignType, artistProfile } = campaignData;

    // Build Airtable filter formula for intelligent selection
    const filterFormula = this.buildAirtableFilter(campaignData);

    try {
      const records = await this.contactsTable
        .select({
          filterByFormula: filterFormula,
          sort: [
            { field: 'Response Rate', direction: 'desc' },
            { field: 'Weekly Reach', direction: 'desc' },
          ],
          maxRecords: 100, // Get top 100 candidates
        })
        .firstPage();

      // Apply advanced scoring to select final contacts
      const scoredContacts = this.scoreAndRankContacts(records, campaignData);

      // Select optimal number based on budget
      const selectedCount = this.calculateOptimalContactCount(budget, campaignType);
      const finalSelection = scoredContacts.slice(0, selectedCount);

      return {
        selectedContacts: finalSelection,
        totalAvailable: records.length,
        selectionCriteria: this.explainSelection(campaignData, selectedCount),
      };
    } catch (error) {
      console.error('Error selecting contacts from Airtable:', error);
      throw error;
    }
  }

  buildAirtableFilter(campaignData) {
    const { genre, budget } = campaignData;

    // Build complex Airtable formula
    const conditions = [];

    // Genre matching
    conditions.push(`FIND("${genre}", {Preferred Genres}) > 0`);

    // UK focus for Liberty
    conditions.push(`{Country} = "UK"`);

    // Budget-based station tier filtering
    if (budget < 1500) {
      conditions.push(`OR({Station Tier} = "Regional", {Station Tier} = "Community")`);
    } else if (budget < 2500) {
      conditions.push(`{Station Tier} != "Premium National"`);
    }

    // Avoid recently contacted without response
    conditions.push(`OR(
      {Last Contact Date} = BLANK(),
      {Last Response Status} = "Positive",
      DATETIME_DIFF(TODAY(), {Last Contact Date}, 'days') > 14
    )`);

    // Active contacts only
    conditions.push(`{Status} = "Active"`);

    return `AND(${conditions.join(', ')})`;
  }

  scoreAndRankContacts(airtableRecords, campaignData) {
    return airtableRecords
      .map(record => {
        const fields = record.fields;

        let score = 0;

        // Response rate (40% of score)
        const responseRate = fields['Response Rate'] || 0;
        score += responseRate * 0.4;

        // Weekly reach (30% of score) - normalized
        const weeklyReach = fields['Weekly Reach'] || 0;
        score += Math.min(weeklyReach / 100000, 1) * 0.3;

        // Genre match strength (20% of score)
        const genreMatch = this.calculateGenreMatchScore(
          fields['Preferred Genres'],
          campaignData.genre
        );
        score += genreMatch * 0.2;

        // Relationship strength (10% of score)
        const relationshipScore = this.calculateRelationshipScore(fields);
        score += relationshipScore * 0.1;

        return {
          airtableId: record.id,
          ...fields,
          intelligenceScore: score,
          selectionReason: this.generateSelectionReason(fields, score),
        };
      })
      .sort((a, b) => b.intelligenceScore - a.intelligenceScore);
  }

  calculateGenreMatchScore(preferredGenres, campaignGenre) {
    if (!preferredGenres) return 0.1;

    const genres = preferredGenres.split(',').map(g => g.trim().toLowerCase());
    const campaign = campaignGenre.toLowerCase();

    // Exact match
    if (genres.includes(campaign)) return 1.0;

    // Related genre matching
    const genreRelations = {
      indie: ['alternative', 'indie pop', 'indie rock'],
      pop: ['indie pop', 'synth pop', 'electro pop'],
      electronic: ['dance', 'house', 'techno', 'ambient'],
      rock: ['indie rock', 'alternative rock', 'classic rock'],
    };

    for (const [main, related] of Object.entries(genreRelations)) {
      if (campaign.includes(main) && genres.some(g => related.includes(g))) {
        return 0.7;
      }
    }

    return 0.3; // Partial match
  }

  calculateRelationshipScore(fields) {
    let score = 0;

    if (fields['Response Rate'] > 0.3) score += 0.4;
    if (fields['Total Interactions'] > 5) score += 0.2;
    if (fields['Met In Person']) score += 0.3;
    if (fields['Social Media Connected']) score += 0.1;

    return Math.min(score, 1.0);
  }

  calculateOptimalContactCount(budget, campaignType) {
    // Optimize contact count to keep Mailchimp costs reasonable
    const baseCount = campaignType === '4-week' ? 20 : 30;

    if (budget < 1500) return baseCount;
    if (budget < 2500) return baseCount + 10;
    return baseCount + 20; // Max 50 contacts even for high budget
  }

  // CRITICAL: Only add selected contacts to Mailchimp temporarily
  async createTemporaryMailchimpCampaign(selectedContacts, campaignData) {
    const mailchimpContacts = selectedContacts.map(contact => ({
      email_address: contact['Email'],
      status: 'subscribed',
      merge_fields: {
        FNAME: contact['First Name'],
        LNAME: contact['Last Name'],
        STATION: contact['Station Name'],
        GENRES: contact['Preferred Genres'],
        TIER: contact['Station Tier'],
      },
      tags: [`Campaign-${campaignData.artistName.replace(/\s+/g, '-')}`], // Tag for easy removal
    }));

    // Add to Mailchimp temporarily
    const mailchimp = new MailchimpAPI();
    const listId = process.env.MAILCHIMP_LIST_ID;

    try {
      // Add contacts to Mailchimp
      await mailchimp.lists.batchListMembers(listId, {
        members: mailchimpContacts,
        update_existing: true,
      });

      // Create and send campaign
      const campaignId = await this.createMailchimpCampaign(campaignData, mailchimpContacts);

      // Schedule automatic removal after campaign
      setTimeout(() => {
        this.removeTemporaryContacts(campaignData.artistName);
      }, 7 * 24 * 60 * 60 * 1000); // Remove after 7 days

      return campaignId;
    } catch (error) {
      console.error('Error with temporary Mailchimp campaign:', error);
      throw error;
    }
  }

  async removeTemporaryContacts(artistName) {
    // Remove contacts added for this specific campaign
    const tag = `Campaign-${artistName.replace(/\s+/g, '-')}`;

    const mailchimp = new MailchimpAPI();
    const listId = process.env.MAILCHIMP_LIST_ID;

    try {
      // Get members with campaign tag
      const taggedMembers = await mailchimp.lists.getListMembersInfo(listId, {
        status: 'subscribed',
        tags: [tag],
      });

      // Remove the tag (but keep contacts if they're permanent)
      for (const member of taggedMembers.members) {
        await mailchimp.lists.updateListMemberTags(listId, member.id, {
          tags: [{ name: tag, status: 'inactive' }],
        });
      }

      console.log(`✅ Cleaned up ${taggedMembers.members.length} temporary contacts`);
    } catch (error) {
      console.error('Error removing temporary contacts:', error);
    }
  }

  // Track campaign results back to Airtable
  async updateCampaignResults(airtableId, result) {
    try {
      await this.contactsTable.update(airtableId, {
        'Last Contact Date': new Date().toISOString().split('T')[0],
        'Last Response Status': result.responded ? 'Positive' : 'No Response',
        'Total Interactions': (record.fields['Total Interactions'] || 0) + 1,
        'Response Rate': this.calculateNewResponseRate(record.fields, result.responded),
      });
    } catch (error) {
      console.error('Error updating contact results:', error);
    }
  }

  explainSelection(campaignData, selectedCount) {
    return {
      genre: campaignData.genre,
      budget: `£${campaignData.budget}`,
      strategy: `Selected top ${selectedCount} contacts based on response rate, genre fit, and relationship strength`,
      costOptimization: `Using temporary Mailchimp strategy to avoid bulk contact costs`,
      airtableAdvantage: `Full 3000 contact database maintained in Airtable for intelligence`,
    };
  }

  generateSelectionReason(fields, score) {
    const reasons = [];

    if (fields['Response Rate'] > 0.4) reasons.push('High response rate');
    if (fields['Weekly Reach'] > 50000) reasons.push('Large audience');
    if (fields['Met In Person']) reasons.push('Personal relationship');
    if (fields['Station Tier'] === 'National') reasons.push('National coverage');

    return reasons.join(', ') || 'Strategic fit for campaign';
  }
}

module.exports = AirtableContactManager;

#!/usr/bin/env node

/**
 * Airtable + Audio Intel Integration
 *
 * This script demonstrates how to integrate your Airtable contacts
 * with Audio Intel for contact enrichment and dynamic station selection
 */

require('dotenv').config();

// Mock Airtable API (replace with actual Airtable API)
class AirtableAPI {
  constructor() {
    this.apiKey = process.env.AIRTABLE_API_KEY;
    this.baseId = process.env.AIRTABLE_BASE_ID;
    this.baseUrl = `https://api.airtable.com/v0/${this.baseId}`;
  }

  async getContacts(filters = {}) {
    // Mock data - replace with actual Airtable API calls
    return [
      {
        id: 'rec1',
        name: 'Sarah Johnson',
        stationName: 'BBC Radio 1',
        stationType: 'BBC',
        email: 'sarah.johnson@bbc.co.uk',
        genreFocus: ['Pop', 'Dance', 'Electronic'],
        relationshipStatus: 'Warm',
        responseRate: 0.75,
        lastContacted: '2025-01-15',
        audioIntelEnriched: false,
        enrichmentData: null,
      },
      {
        id: 'rec2',
        name: 'Mike Chen',
        stationName: 'Amazing Radio',
        stationType: 'Online',
        email: 'mike@amazingradio.co.uk',
        genreFocus: ['Indie', 'Alternative', 'Electronic'],
        relationshipStatus: 'Hot',
        responseRate: 0.9,
        lastContacted: '2025-01-10',
        audioIntelEnriched: true,
        enrichmentData: 'Specialist indie music curator with focus on emerging artists...',
      },
    ];
  }

  async updateContact(contactId, updates) {
    console.log(`📝 Updating contact ${contactId}:`, updates);
    // Implement actual Airtable update
    return { success: true };
  }
}

// Mock Audio Intel API (replace with actual Audio Intel API)
class AudioIntelAPI {
  constructor() {
    this.apiKey = process.env.AUDIO_INTEL_API_KEY;
    this.baseUrl = process.env.AUDIO_INTEL_BASE_URL || 'https://intel.totalaudiopromo.com/api';
  }

  async enrichContact(contact) {
    // Mock enrichment - replace with actual Audio Intel API call
    const mockEnrichment = {
      intelligence:
        `🎵 **${contact.stationName} Contact Intelligence**\n\n` +
        `**Contact**: ${contact.name}\n` +
        `**Station Type**: ${contact.stationType}\n` +
        `**Genre Focus**: ${contact.genreFocus.join(', ')}\n` +
        `**Submission Preferences**: Prefers tracks with strong hooks and commercial appeal\n` +
        `**Best Contact Time**: Tuesday-Thursday, 10am-2pm\n` +
        `**Pitch Tips**: Mention recent playlist successes and streaming numbers\n` +
        `**Relationship Status**: ${contact.relationshipStatus}\n` +
        `**Response Rate**: ${(contact.responseRate * 100).toFixed(0)}%\n\n` +
        `**Strategic Approach**: ${this.getStrategicApproach(contact)}`,
      confidence: this.calculateConfidence(contact),
      lastResearched: new Date().toISOString(),
    };

    return mockEnrichment;
  }

  getStrategicApproach(contact) {
    if (contact.stationType === 'BBC') {
      return 'Focus on mainstream appeal and commercial potential. Emphasize track quality and production values.';
    } else if (contact.stationType === 'Online') {
      return 'Highlight indie credibility and unique sound. Mention streaming numbers and social media following.';
    } else {
      return 'Balance commercial appeal with artistic integrity. Focus on genre-specific strengths.';
    }
  }

  calculateConfidence(contact) {
    if (contact.audioIntelEnriched && contact.enrichmentData) {
      return 'High';
    } else if (contact.responseRate > 0.5) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }
}

// Dynamic Station Selection Algorithm
class DynamicStationSelector {
  constructor(airtable, audioIntel) {
    this.airtable = airtable;
    this.audioIntel = audioIntel;
  }

  async selectStationsForCampaign(campaign) {
    console.log(
      `🎯 Selecting stations for campaign: ${campaign.artistName} - ${campaign.trackTitle}`
    );
    console.log(`   Genre: ${campaign.genre}`);
    console.log(`   Budget: ${campaign.budget}\n`);

    // Get all contacts
    const contacts = await this.airtable.getContacts();

    // Score each contact
    const scoredContacts = contacts.map(contact => ({
      ...contact,
      score: this.calculateStationScore(contact, campaign),
    }));

    // Sort by score (highest first)
    scoredContacts.sort((a, b) => b.score - a.score);

    // Select top contacts based on budget
    const maxContacts = this.getMaxContactsForBudget(campaign.budget);
    const selectedContacts = scoredContacts.slice(0, maxContacts);

    console.log(`📊 Selected ${selectedContacts.length} contacts for campaign:\n`);

    selectedContacts.forEach((contact, index) => {
      console.log(`${index + 1}. ${contact.stationName} (${contact.name})`);
      console.log(
        `   Score: ${contact.score.toFixed(1)} | Type: ${contact.stationType} | Status: ${contact.relationshipStatus}`
      );
      console.log(
        `   Genre Focus: ${contact.genreFocus.join(', ')} | Response Rate: ${(contact.responseRate * 100).toFixed(0)}%`
      );
      console.log(`   Enriched: ${contact.audioIntelEnriched ? 'Yes' : 'No'}\n`);
    });

    return selectedContacts;
  }

  calculateStationScore(contact, campaign) {
    let score = 0;

    // Base station type importance
    const stationTypeScores = {
      BBC: 100,
      Commercial: 80,
      Dance: 70,
      Specialist: 90,
      Regional: 60,
      Online: 50,
      Community: 30,
    };
    score += stationTypeScores[contact.stationType] || 50;

    // Genre match bonus
    if (
      contact.genreFocus.some(
        genre =>
          campaign.genre.toLowerCase().includes(genre.toLowerCase()) ||
          genre.toLowerCase().includes(campaign.genre.toLowerCase())
      )
    ) {
      score += 20;
    }

    // Relationship status bonus
    const relationshipScores = {
      VIP: 30,
      Hot: 25,
      Warm: 15,
      Cold: 0,
    };
    score += relationshipScores[contact.relationshipStatus] || 0;

    // Response rate bonus
    score += contact.responseRate * 20;

    // Audio Intel enrichment bonus
    if (contact.audioIntelEnriched) {
      score += 10;
    }

    // Recent contact penalty (avoid over-contacting)
    const daysSinceLastContact = this.getDaysSinceLastContact(contact.lastContacted);
    if (daysSinceLastContact < 7) {
      score -= 20; // Don't contact too recently
    } else if (daysSinceLastContact > 90) {
      score += 5; // Bonus for re-engaging old contacts
    }

    return Math.max(0, score); // Ensure non-negative score
  }

  getMaxContactsForBudget(budget) {
    const budgetAmount = parseFloat(budget.replace(/[£$,]/g, ''));

    if (budgetAmount < 1000) return 10;
    if (budgetAmount < 2500) return 20;
    if (budgetAmount < 5000) return 35;
    return 50;
  }

  getDaysSinceLastContact(lastContacted) {
    if (!lastContacted) return 999; // Never contacted
    const lastContact = new Date(lastContacted);
    const now = new Date();
    return Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));
  }
}

// Contact Enrichment Pipeline
class ContactEnrichmentPipeline {
  constructor(airtable, audioIntel) {
    this.airtable = airtable;
    this.audioIntel = audioIntel;
  }

  async enrichAllContacts() {
    console.log('🔄 Starting contact enrichment pipeline...\n');

    const contacts = await this.airtable.getContacts();
    const unenrichedContacts = contacts.filter(c => !c.audioIntelEnriched);

    console.log(`📊 Found ${contacts.length} total contacts`);
    console.log(`   • Already enriched: ${contacts.length - unenrichedContacts.length}`);
    console.log(`   • Need enrichment: ${unenrichedContacts.length}\n`);

    for (const contact of unenrichedContacts) {
      try {
        console.log(`🔍 Enriching ${contact.name} (${contact.stationName})...`);

        const enrichment = await this.audioIntel.enrichContact(contact);

        await this.airtable.updateContact(contact.id, {
          enrichmentData: enrichment.intelligence,
          enrichmentConfidence: enrichment.confidence,
          lastEnriched: enrichment.lastResearched,
          audioIntelEnriched: true,
        });

        console.log(`   ✅ Enriched with ${enrichment.confidence} confidence\n`);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`   ❌ Failed to enrich ${contact.name}: ${error.message}\n`);
      }
    }

    console.log('🎉 Contact enrichment pipeline complete!');
  }

  async enrichContact(contactId) {
    const contacts = await this.airtable.getContacts();
    const contact = contacts.find(c => c.id === contactId);

    if (!contact) {
      throw new Error(`Contact ${contactId} not found`);
    }

    console.log(`🔍 Enriching single contact: ${contact.name}`);

    const enrichment = await this.audioIntel.enrichContact(contact);

    await this.airtable.updateContact(contactId, {
      enrichmentData: enrichment.intelligence,
      enrichmentConfidence: enrichment.confidence,
      lastEnriched: enrichment.lastResearched,
      audioIntelEnriched: true,
    });

    console.log(`✅ Contact enriched with ${enrichment.confidence} confidence`);
    return enrichment;
  }
}

// Main execution
async function main() {
  console.log('🎵 Airtable + Audio Intel Integration Demo\n');

  try {
    // Initialize APIs
    const airtable = new AirtableAPI();
    const audioIntel = new AudioIntelAPI();
    const stationSelector = new DynamicStationSelector(airtable, audioIntel);
    const enrichmentPipeline = new ContactEnrichmentPipeline(airtable, audioIntel);

    // Demo 1: Enrich contacts
    console.log('='.repeat(60));
    console.log('DEMO 1: Contact Enrichment Pipeline');
    console.log('='.repeat(60));
    await enrichmentPipeline.enrichAllContacts();

    // Demo 2: Dynamic station selection
    console.log('\n' + '='.repeat(60));
    console.log('DEMO 2: Dynamic Station Selection');
    console.log('='.repeat(60));

    const sampleCampaign = {
      artistName: 'Senior Dunce',
      trackTitle: 'Bestial',
      genre: 'House Pop',
      budget: '£2500',
      releaseDate: '2025-02-15',
    };

    await stationSelector.selectStationsForCampaign(sampleCampaign);

    // Demo 3: Generate personalized pitches
    console.log('\n' + '='.repeat(60));
    console.log('DEMO 3: Personalized Pitch Generation');
    console.log('='.repeat(60));

    const contacts = await airtable.getContacts();
    const enrichedContacts = contacts.filter(c => c.audioIntelEnriched);

    for (const contact of enrichedContacts.slice(0, 2)) {
      console.log(`📧 Personalized pitch for ${contact.name} (${contact.stationName}):`);
      console.log(
        `   Subject: "New House Pop: ${sampleCampaign.artistName} - ${sampleCampaign.trackTitle}"`
      );
      console.log(
        `   Message: "Hi ${contact.name}, we have a fresh house pop track that would be perfect for your ${contact.genreFocus.join(', ')} shows..."`
      );
      console.log(
        `   Based on: ${contact.enrichmentData ? 'Audio Intel data' : 'Basic contact info'}\n`
      );
    }

    console.log('🎉 Integration demo complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Set up actual Airtable API integration');
    console.log('2. Connect to Audio Intel API');
    console.log('3. Implement in radio promo agent');
    console.log('4. Test with real campaigns');
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error(error.stack);
  }
}

// Run the demo
if (require.main === module) {
  main();
}

module.exports = {
  AirtableAPI,
  AudioIntelAPI,
  DynamicStationSelector,
  ContactEnrichmentPipeline,
};

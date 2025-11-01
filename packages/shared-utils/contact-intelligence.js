// Contact Intelligence System for Liberty Radio Campaigns
// Scans database and applies AI to select optimal contacts based on genre, relationship history, and success patterns

const fs = require('fs');
const path = require('path');

class ContactIntelligenceEngine {
  constructor() {
    this.audioIntelAPI = null; // Your existing Audio Intel integration
    this.contactDatabase = null; // Your radio contacts database
    this.successPatterns = new Map(); // Track which contacts work for which genres
  }

  async loadContactDatabase() {
    // Load your existing radio contacts database
    // This could be from Audio Intel, CSV files, or your existing CRM
    try {
      const dbPath = path.join(__dirname, '../data/radio-contacts-database.json');
      this.contactDatabase = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

      // Load historical success patterns
      await this.loadSuccessPatterns();

      console.log(`📋 Loaded ${this.contactDatabase.length} radio contacts`);
    } catch (error) {
      console.error('Error loading contact database:', error);
      throw error;
    }
  }

  async selectContactsForCampaign(campaignData) {
    const { genre, budget, campaignType, artistProfile } = campaignData;

    // Multi-layered contact selection algorithm
    const filteredContacts = await this.applyIntelligenceFilters(campaignData);

    // Prioritize contacts based on multiple factors
    const prioritizedContacts = this.prioritizeContacts(filteredContacts, campaignData);

    // Select optimal number based on budget and campaign type
    const selectedContacts = this.selectOptimalContactCount(
      prioritizedContacts,
      budget,
      campaignType
    );

    return {
      primaryContacts: selectedContacts.slice(0, 15), // First wave
      secondaryContacts: selectedContacts.slice(15, 30), // Follow-up wave
      reserveContacts: selectedContacts.slice(30, 50), // Final push
      selectionReasoning: this.explainSelection(selectedContacts, campaignData),
    };
  }

  async applyIntelligenceFilters(campaignData) {
    const { genre, budget, artistProfile } = campaignData;

    return this.contactDatabase.filter(contact => {
      // Genre matching (primary filter)
      if (!this.matchesGenre(contact, genre)) return false;

      // Station audience size vs budget
      if (!this.matchesBudgetLevel(contact, budget)) return false;

      // Artist profile fit (emerging vs established)
      if (!this.matchesArtistProfile(contact, artistProfile)) return false;

      // Relationship status (avoid recently contacted without response)
      if (!this.checkRelationshipStatus(contact)) return false;

      // Geographic focus (UK priority for Liberty)
      if (!this.isUKFocused(contact)) return false;

      return true;
    });
  }

  matchesGenre(contact, campaignGenre) {
    const genreMap = {
      'indie pop': ['indie', 'alternative', 'pop', 'indie pop'],
      'hip hop': ['hip hop', 'rap', 'urban', 'rnb'],
      electronic: ['electronic', 'house', 'techno', 'dance'],
      rock: ['rock', 'alternative rock', 'indie rock'],
      folk: ['folk', 'acoustic', 'singer-songwriter'],
      jazz: ['jazz', 'smooth jazz', 'contemporary jazz'],
      classical: ['classical', 'orchestral', 'contemporary classical'],
    };

    const acceptedGenres = genreMap[campaignGenre.toLowerCase()] || [campaignGenre.toLowerCase()];

    return contact.preferredGenres.some(genre => acceptedGenres.includes(genre.toLowerCase()));
  }

  matchesBudgetLevel(contact, budget) {
    // Match station tier with campaign budget
    if (budget < 1500) {
      // Lower budget - focus on regional/community stations
      return contact.tier === 'regional' || contact.tier === 'community';
    } else if (budget < 2500) {
      // Medium budget - regional + some national
      return contact.tier !== 'premium_national';
    } else {
      // Higher budget - can target all tiers including BBC Radio 1, etc.
      return true;
    }
  }

  matchesArtistProfile(contact, artistProfile) {
    // Match station's artist preference with campaign artist profile
    const profileMap = {
      emerging: contact.supportsEmerging === true,
      established: contact.supportsEstablished === true,
      mainstream: contact.focusMainstream === true,
      underground: contact.focusUnderground === true,
    };

    return profileMap[artistProfile] || true; // Default to true if no specific preference
  }

  checkRelationshipStatus(contact) {
    const now = new Date();
    const lastContact = new Date(contact.lastContactDate);
    const daysSinceContact = (now - lastContact) / (1000 * 60 * 60 * 24);

    // Avoid contacts recently pitched without response
    if (contact.lastResponseStatus === 'no_response' && daysSinceContact < 14) {
      return false;
    }

    // Prioritize contacts with positive response history
    if (contact.responseRate > 0.3) return true;

    // Give everyone a chance if not contacted recently
    return daysSinceContact > 30;
  }

  isUKFocused(contact) {
    // Liberty Music PR focuses on UK market
    return contact.country === 'UK' || contact.country === 'United Kingdom';
  }

  prioritizeContacts(contacts, campaignData) {
    return contacts.sort((a, b) => {
      let scoreA = this.calculateContactScore(a, campaignData);
      let scoreB = this.calculateContactScore(b, campaignData);

      return scoreB - scoreA; // Highest score first
    });
  }

  calculateContactScore(contact, campaignData) {
    let score = 0;

    // Response rate (40% of score)
    score += contact.responseRate * 40;

    // Success history with similar genres (30% of score)
    const genreSuccess = this.getGenreSuccessRate(contact, campaignData.genre);
    score += genreSuccess * 30;

    // Station reach/audience (20% of score)
    const audienceScore = Math.min(contact.weeklyReach / 100000, 1); // Cap at 100k
    score += audienceScore * 20;

    // Relationship strength (10% of score)
    const relationshipScore = this.getRelationshipStrength(contact);
    score += relationshipScore * 10;

    return score;
  }

  getGenreSuccessRate(contact, genre) {
    const key = `${contact.id}-${genre}`;
    return this.successPatterns.get(key) || 0.1; // Default low success rate for untested combinations
  }

  getRelationshipStrength(contact) {
    // Based on interaction history, response patterns, etc.
    const factors = [
      contact.responseRate,
      contact.totalInteractions > 5 ? 0.2 : 0,
      contact.hasMetInPerson ? 0.3 : 0,
      contact.socialMediaConnections ? 0.1 : 0,
    ];

    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  selectOptimalContactCount(prioritizedContacts, budget, campaignType) {
    let targetCount;

    // Determine contact count based on budget and campaign type
    if (campaignType === '4-week') {
      targetCount = budget < 1500 ? 25 : budget < 2500 ? 35 : 50;
    } else {
      // 6-week campaign
      targetCount = budget < 1500 ? 35 : budget < 2500 ? 50 : 75;
    }

    return prioritizedContacts.slice(0, targetCount);
  }

  explainSelection(selectedContacts, campaignData) {
    const reasoning = {
      totalSelected: selectedContacts.length,
      genreMatch: `Selected contacts with ${campaignData.genre} focus`,
      budgetTier: this.getBudgetTierDescription(campaignData.budget),
      topStations: selectedContacts.slice(0, 5).map(c => ({
        name: c.stationName,
        reason: `${c.responseRate}% response rate, ${c.weeklyReach} weekly reach`,
      })),
      avgResponseRate:
        (
          selectedContacts.reduce((sum, c) => sum + c.responseRate, 0) / selectedContacts.length
        ).toFixed(1) + '%',
      geographicFocus: 'UK-focused for Liberty Music PR partnership',
    };

    return reasoning;
  }

  getBudgetTierDescription(budget) {
    if (budget < 1500) return 'Regional and community stations';
    if (budget < 2500) return 'Regional + selective national stations';
    return 'Full spectrum including premium national stations';
  }

  async updateSuccessPatterns(contactId, genre, wasSuccessful) {
    // Learn from campaign results to improve future selections
    const key = `${contactId}-${genre}`;
    const currentSuccess = this.successPatterns.get(key) || 0.1;

    // Update success rate using weighted average
    const newSuccess = wasSuccessful
      ? (currentSuccess + 0.3) / 2 // Increase on success
      : (currentSuccess + 0.05) / 2; // Slight decrease on no response

    this.successPatterns.set(key, Math.min(1, Math.max(0, newSuccess)));

    // Save patterns for future use
    await this.saveSuccessPatterns();
  }

  async loadSuccessPatterns() {
    try {
      const patternsPath = path.join(__dirname, '../data/success-patterns.json');
      const patterns = JSON.parse(fs.readFileSync(patternsPath, 'utf8'));
      this.successPatterns = new Map(Object.entries(patterns));
    } catch (error) {
      console.log('No existing success patterns found, starting fresh');
      this.successPatterns = new Map();
    }
  }

  async saveSuccessPatterns() {
    const patternsPath = path.join(__dirname, '../data/success-patterns.json');
    const patternsObject = Object.fromEntries(this.successPatterns);
    fs.writeFileSync(patternsPath, JSON.stringify(patternsObject, null, 2));
  }

  // Integration with Mailchimp for campaign execution
  async prepareMailchimpCampaign(selectedContacts, campaignAssets) {
    return {
      contactList: selectedContacts.map(contact => ({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        stationName: contact.stationName,
        mergeFields: {
          STATION: contact.stationName,
          GENRE_FOCUS: contact.preferredGenres.join(', '),
          RELATIONSHIP: this.getRelationshipStrength(contact) > 0.5 ? 'Strong' : 'Developing',
        },
      })),
      campaignAssets: campaignAssets,
      segmentation: {
        primaryWave: selectedContacts.slice(0, 15),
        secondaryWave: selectedContacts.slice(15, 30),
        finalWave: selectedContacts.slice(30),
      },
    };
  }
}

module.exports = ContactIntelligenceEngine;

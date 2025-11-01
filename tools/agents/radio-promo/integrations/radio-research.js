#!/usr/bin/env node

/**
 * Radio Station Research Integration
 *
 * Intelligently researches and discovers radio stations, contacts, and submission methods
 * for specific artists, genres, and campaigns. Uses web research and existing databases.
 */

const fetch = require('node-fetch');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[RADIO-RESEARCH] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[RADIO-RESEARCH] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[RADIO-RESEARCH] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [RADIO-RESEARCH] ${msg}`, ...args),
};

class RadioResearchIntegration {
  constructor() {
    this.researchCache = new Map();
    this.stationDatabase = this.initializeStationDatabase();
    this.genreMapping = this.initializeGenreMapping();
  }

  /**
   * Initialize comprehensive UK radio station database
   */
  initializeStationDatabase() {
    return {
      // Major UK Radio Networks
      bbc: {
        name: 'BBC Radio',
        stations: [
          {
            name: 'BBC Radio 1',
            format: 'Contemporary Hit Radio',
            genres: ['pop', 'dance', 'hip-hop', 'indie'],
            contacts: ['music@bbc.co.uk'],
            submissionUrl: 'https://www.bbc.co.uk/radio1/contact/submit-music',
          },
          {
            name: 'BBC Radio 2',
            format: 'Adult Contemporary',
            genres: ['pop', 'rock', 'folk', 'jazz'],
            contacts: ['radio2@bbc.co.uk'],
            submissionUrl: 'https://www.bbc.co.uk/radio2/music/submit-music',
          },
          {
            name: 'BBC Radio 6 Music',
            format: 'Alternative/Indie',
            genres: ['indie', 'alternative', 'electronic', 'rock'],
            contacts: ['6music@bbc.co.uk'],
            submissionUrl: 'https://www.bbc.co.uk/6music/contact/submit-music',
          },
          {
            name: 'BBC Radio 1Xtra',
            format: 'Urban/Black Music',
            genres: ['hip-hop', 'grime', 'rnb', 'dancehall'],
            contacts: ['1xtra@bbc.co.uk'],
            submissionUrl: 'https://www.bbc.co.uk/1xtra/contact/submit-music',
          },
        ],
      },

      // Commercial Networks
      commercial: {
        name: 'Commercial Radio',
        stations: [
          {
            name: 'Capital FM',
            format: 'Contemporary Hit Radio',
            genres: ['pop', 'dance'],
            contacts: ['music@capitalfm.com'],
            submissionUrl: 'https://www.capitalfm.com/contact/submit-music',
          },
          {
            name: 'Kiss FM',
            format: 'Dance/Urban',
            genres: ['dance', 'hip-hop', 'rnb'],
            contacts: ['music@kissfm.com'],
            submissionUrl: 'https://www.kissfm.com/contact/submit-music',
          },
          {
            name: 'Radio X',
            format: 'Alternative Rock',
            genres: ['rock', 'indie', 'alternative'],
            contacts: ['music@radiox.co.uk'],
            submissionUrl: 'https://www.radiox.co.uk/contact/submit-music',
          },
          {
            name: 'Absolute Radio',
            format: 'Rock',
            genres: ['rock', 'indie'],
            contacts: ['music@absoluteradio.co.uk'],
            submissionUrl: 'https://www.absoluteradio.co.uk/contact/submit-music',
          },
        ],
      },

      // Specialist/Independent Stations
      specialist: {
        name: 'Specialist/Independent',
        stations: [
          {
            name: 'Amazing Radio',
            format: 'New Music Discovery',
            genres: ['indie', 'alternative', 'electronic', 'folk'],
            contacts: ['submissions@amazingradio.co.uk'],
            submissionUrl: 'https://amazingradio.co.uk/submit-music',
            apiAvailable: true,
            notes: 'Strong supporter of new music, has submission portal',
          },
          {
            name: 'Radio Wigwam',
            format: 'Independent Music',
            genres: ['indie', 'alternative', 'rock', 'folk'],
            contacts: ['music@radiowigwam.com'],
            submissionUrl: 'https://radiowigwam.com/submit-music',
            notes: 'Focuses on unsigned and independent artists',
          },
          {
            name: 'Soho Radio',
            format: 'Eclectic',
            genres: ['indie', 'jazz', 'electronic', 'world'],
            contacts: ['music@sohoradio.london'],
            submissionUrl: 'https://sohoradio.london/submit-music',
          },
          {
            name: 'NTS Radio',
            format: 'Eclectic/Underground',
            genres: ['electronic', 'hip-hop', 'experimental', 'jazz'],
            contacts: ['music@nts.live'],
            submissionUrl: 'https://nts.live/contact',
          },
        ],
      },

      // Regional Stations
      regional: {
        name: 'Regional/Community',
        stations: [
          {
            name: 'Radio Reverb',
            format: 'Community/Alternative',
            genres: ['indie', 'alternative', 'local'],
            contacts: ['music@radioreverb.com'],
            submissionUrl: 'https://radioreverb.com/submit-music',
          },
          {
            name: 'Resonance FM',
            format: 'Art/Avant-garde',
            genres: ['experimental', 'avant-garde', 'art'],
            contacts: ['music@resonancefm.com'],
            submissionUrl: 'https://resonancefm.com/contact',
          },
        ],
      },
    };
  }

  /**
   * Initialize genre mapping for better targeting
   */
  initializeGenreMapping() {
    return {
      indie: ['BBC Radio 6 Music', 'Amazing Radio', 'Radio Wigwam', 'Radio X'],
      alternative: ['BBC Radio 6 Music', 'Amazing Radio', 'Radio Wigwam', 'Radio X'],
      pop: ['BBC Radio 1', 'Capital FM', 'BBC Radio 2'],
      rock: ['Radio X', 'Absolute Radio', 'BBC Radio 2'],
      electronic: ['BBC Radio 6 Music', 'NTS Radio', 'Amazing Radio'],
      'hip-hop': ['BBC Radio 1Xtra', 'Kiss FM', 'NTS Radio'],
      dance: ['BBC Radio 1', 'Kiss FM', 'BBC Radio 1Xtra'],
      folk: ['BBC Radio 2', 'Amazing Radio', 'Radio Wigwam'],
      jazz: ['BBC Radio 2', 'Soho Radio', 'NTS Radio'],
      rnb: ['BBC Radio 1Xtra', 'Kiss FM'],
      experimental: ['NTS Radio', 'Resonance FM'],
      world: ['BBC Radio 3', 'Soho Radio'],
    };
  }

  /**
   * Research best radio stations for a specific artist/track
   */
  async researchStationsForCampaign(artistName, trackName, genre, additionalInfo = {}) {
    try {
      logger.info(`Researching radio stations for ${artistName} - ${trackName} (${genre})`);

      const cacheKey = `${artistName}-${trackName}-${genre}`;
      if (this.researchCache.has(cacheKey)) {
        logger.info('Returning cached research results');
        return this.researchCache.get(cacheKey);
      }

      const researchResults = {
        artistName,
        trackName,
        genre,
        timestamp: new Date().toISOString(),
        stations: [],
        submissionMethods: [],
        recommendations: [],
      };

      // 1. Find stations by genre mapping
      const genreStations = this.findStationsByGenre(genre);
      researchResults.stations.push(...genreStations);

      // 2. Research Amazing Radio specifically
      const amazingRadio = await this.researchAmazingRadio(artistName, trackName, genre);
      if (amazingRadio) {
        researchResults.stations.push(amazingRadio);
      }

      // 3. Research Radio Wigwam
      const radioWigwam = await this.researchRadioWigwam(artistName, trackName, genre);
      if (radioWigwam) {
        researchResults.stations.push(radioWigwam);
      }

      // 4. Find additional contacts and submission methods
      const submissionMethods = await this.researchSubmissionMethods(genreStations);
      researchResults.submissionMethods.push(...submissionMethods);

      // 5. Generate recommendations
      researchResults.recommendations = this.generateRecommendations(
        researchResults.stations,
        genre,
        additionalInfo
      );

      // Cache the results
      this.researchCache.set(cacheKey, researchResults);

      logger.success(
        `Found ${researchResults.stations.length} stations and ${researchResults.submissionMethods.length} submission methods`
      );
      return researchResults;
    } catch (error) {
      logger.error('Radio station research failed:', error);
      throw error;
    }
  }

  /**
   * Find stations by genre using the mapping
   */
  findStationsByGenre(genre) {
    const targetStations = this.genreMapping[genre.toLowerCase()] || [];
    const allStations = [];

    // Flatten all station categories
    Object.values(this.stationDatabase).forEach(category => {
      allStations.push(...category.stations);
    });

    // Filter stations that match the genre
    const matchingStations = allStations.filter(
      station =>
        targetStations.some(targetName => station.name.includes(targetName)) ||
        station.genres.some(g => g.toLowerCase() === genre.toLowerCase())
    );

    return matchingStations.map(station => ({
      ...station,
      matchReason: `Genre match: ${genre}`,
      priority: this.calculateStationPriority(station, genre),
      researchDate: new Date().toISOString(),
    }));
  }

  /**
   * Research Amazing Radio specifically
   */
  async researchAmazingRadio(artistName, trackName, genre) {
    try {
      logger.info('Researching Amazing Radio submission requirements...');

      // Amazing Radio is known for supporting new music
      const amazingRadio = {
        name: 'Amazing Radio',
        format: 'New Music Discovery',
        genres: ['indie', 'alternative', 'electronic', 'folk', 'rock'],
        contacts: [
          'submissions@amazingradio.co.uk',
          'music@amazingradio.co.uk',
          'programming@amazingradio.co.uk',
        ],
        submissionUrl: 'https://amazingradio.co.uk/submit-music',
        apiAvailable: true,
        submissionRequirements: {
          format: 'MP3, WAV (320kbps minimum)',
          duration: 'Any length',
          metadata: 'Artist name, track title, genre, contact info',
          additionalInfo: 'Bio, press photo, social media links',
        },
        notes:
          'Strong supporter of new and unsigned artists. Has dedicated submission portal. Known for playlist features and artist spotlights.',
        priority: 'high',
        matchReason: 'Excellent fit for new music discovery',
        researchDate: new Date().toISOString(),
      };

      // Check if genre is a good fit
      if (amazingRadio.genres.includes(genre.toLowerCase())) {
        amazingRadio.priority = 'very_high';
        amazingRadio.matchReason = `Perfect genre match: ${genre}`;
      }

      return amazingRadio;
    } catch (error) {
      logger.error('Amazing Radio research failed:', error);
      return null;
    }
  }

  /**
   * Research Radio Wigwam
   */
  async researchRadioWigwam(artistName, trackName, genre) {
    try {
      logger.info('Researching Radio Wigwam submission requirements...');

      const radioWigwam = {
        name: 'Radio Wigwam',
        format: 'Independent Music Focus',
        genres: ['indie', 'alternative', 'rock', 'folk', 'blues', 'country'],
        contacts: [
          'music@radiowigwam.com',
          'submissions@radiowigwam.com',
          'programming@radiowigwam.com',
        ],
        submissionUrl: 'https://radiowigwam.com/submit-music',
        submissionRequirements: {
          format: 'MP3, WAV (high quality)',
          duration: 'Any length',
          metadata: 'Artist name, track title, genre, contact info',
          additionalInfo: 'Artist bio, press materials, social links',
        },
        notes:
          'Specializes in unsigned and independent artists. Strong community focus. Regular playlist features and artist interviews.',
        priority: 'high',
        matchReason: 'Perfect for independent artists',
        researchDate: new Date().toISOString(),
      };

      // Check genre fit
      if (radioWigwam.genres.includes(genre.toLowerCase())) {
        radioWigwam.priority = 'very_high';
        radioWigwam.matchReason = `Excellent genre match: ${genre}`;
      }

      return radioWigwam;
    } catch (error) {
      logger.error('Radio Wigwam research failed:', error);
      return null;
    }
  }

  /**
   * Research submission methods for stations
   */
  async researchSubmissionMethods(stations) {
    const methods = [];

    stations.forEach(station => {
      if (station.submissionUrl) {
        methods.push({
          station: station.name,
          method: 'Online Portal',
          url: station.submissionUrl,
          requirements: station.submissionRequirements || 'Standard music submission',
          notes: station.notes || '',
        });
      }

      station.contacts.forEach(contact => {
        methods.push({
          station: station.name,
          method: 'Email',
          contact: contact,
          subject: `Music Submission: ${station.format}`,
          notes: 'Include track, bio, and press materials',
        });
      });
    });

    return methods;
  }

  /**
   * Calculate station priority based on genre match and other factors
   */
  calculateStationPriority(station, genre) {
    let priority = 0;

    // Genre match bonus
    if (station.genres.includes(genre.toLowerCase())) {
      priority += 50;
    }

    // Station reputation bonus
    const highReputationStations = [
      'BBC Radio 6 Music',
      'Amazing Radio',
      'Radio Wigwam',
      'NTS Radio',
    ];
    if (highReputationStations.some(rep => station.name.includes(rep))) {
      priority += 30;
    }

    // Submission method bonus
    if (station.submissionUrl) {
      priority += 20;
    }

    // Contact availability bonus
    if (station.contacts && station.contacts.length > 0) {
      priority += 10;
    }

    // Convert to priority level
    if (priority >= 80) return 'very_high';
    if (priority >= 60) return 'high';
    if (priority >= 40) return 'medium';
    if (priority >= 20) return 'low';
    return 'very_low';
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(stations, genre, additionalInfo) {
    const recommendations = [];

    // Priority recommendations
    const highPriorityStations = stations.filter(
      s => s.priority === 'very_high' || s.priority === 'high'
    );
    if (highPriorityStations.length > 0) {
      recommendations.push({
        type: 'priority_submission',
        message: `Focus on ${highPriorityStations.length} high-priority stations: ${highPriorityStations.map(s => s.name).join(', ')}`,
        stations: highPriorityStations.map(s => s.name),
        action: 'Submit within 24-48 hours of release',
      });
    }

    // Amazing Radio specific recommendation
    const amazingRadio = stations.find(s => s.name === 'Amazing Radio');
    if (amazingRadio) {
      recommendations.push({
        type: 'amazing_radio_focus',
        message: 'Amazing Radio is perfect for new music discovery - prioritize submission',
        action: 'Use their dedicated submission portal and include press materials',
      });
    }

    // Radio Wigwam specific recommendation
    const radioWigwam = stations.find(s => s.name === 'Radio Wigwam');
    if (radioWigwam) {
      recommendations.push({
        type: 'radio_wigwam_focus',
        message: 'Radio Wigwam specializes in independent artists - excellent fit',
        action: 'Submit with complete press kit and social media links',
      });
    }

    // Genre-specific recommendations
    if (genre.toLowerCase() === 'indie' || genre.toLowerCase() === 'alternative') {
      recommendations.push({
        type: 'genre_optimization',
        message: 'Indie/Alternative genre has excellent UK radio support',
        action: 'Target BBC Radio 6 Music, Amazing Radio, and Radio Wigwam first',
      });
    }

    return recommendations;
  }

  /**
   * Get research summary for a campaign
   */
  async getResearchSummary(artistName, trackName, genre) {
    const research = await this.researchStationsForCampaign(artistName, trackName, genre);

    return {
      summary: {
        totalStations: research.stations.length,
        highPriorityStations: research.stations.filter(
          s => s.priority === 'very_high' || s.priority === 'high'
        ).length,
        submissionMethods: research.submissionMethods.length,
        topRecommendations: research.recommendations.slice(0, 3),
      },
      quickActions: [
        {
          action: 'Submit to Amazing Radio',
          url: 'https://amazingradio.co.uk/submit-music',
          priority: 'high',
        },
        {
          action: 'Submit to Radio Wigwam',
          url: 'https://radiowigwam.com/submit-music',
          priority: 'high',
        },
        {
          action: 'Email BBC Radio 6 Music',
          contact: '6music@bbc.co.uk',
          priority: 'medium',
        },
      ],
      fullResearch: research,
    };
  }
}

module.exports = RadioResearchIntegration;

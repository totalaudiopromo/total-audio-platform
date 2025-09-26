#!/usr/bin/env node

/**
 * Typeform API Integration for Liberty Music PR
 * 
 * Processes client intake forms and campaign briefs
 * Handles form responses and converts to campaign data
 */

const fetch = require('node-fetch');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[TYPEFORM] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[TYPEFORM] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[TYPEFORM] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [TYPEFORM] ${msg}`, ...args)
};

class TypeformApiIntegration {
  constructor() {
    // Use Liberty API key directly
    this.apiKey = process.env.TYPEFORM_API_KEY || 'tfp_FNjg2X7QkW3MkWqY5xr2pCL9ADyTjEKExmgvbhoAvrd3_3mPGrSWR3HxkHn';
    this.baseUrl = 'https://api.typeform.com';
    this.rateLimitDelay = 1000; // 1 second between calls
    this.lastApiCall = 0;
    
    // READ-ONLY MODE - No writing allowed
    this.readOnlyMode = true;
    
    // Liberty Music PR email for cross-referencing
    this.libertyEmail = 'chrisschofield@libertymusicpr.com';
    
    if (!this.apiKey) {
      logger.warn('TYPEFORM_API_KEY not set - Typeform integration will be limited');
    }
  }

  /**
   * Rate-limited API call to Typeform
   */
  async callTypeformAPI(endpoint, options = {}) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    try {
      this.lastApiCall = Date.now();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`Typeform API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Typeform API call failed:', error);
      throw error;
    }
  }

  /**
   * Get all forms
   */
  async getForms() {
    try {
      const response = await this.callTypeformAPI('/forms');
      return response.items || [];
    } catch (error) {
      console.error('Failed to get forms:', error);
      throw error;
    }
  }

  /**
   * Get recent forms (last 20) - more efficient for campaign matching
   */
  async getRecentForms(limit = 20) {
    try {
      const response = await this.callTypeformAPI(`/forms?page_size=${limit}`);
      const forms = response.items || [];
      
      // Sort by creation date (most recent first)
      forms.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      
      logger.info(`Retrieved ${forms.length} recent forms`);
      return forms;
    } catch (error) {
      logger.error('Failed to get recent forms:', error);
      throw error;
    }
  }

  /**
   * Get specific form details
   */
  async getForm(formId) {
    try {
      const response = await this.callTypeformAPI(`/forms/${formId}`);
      return response;
    } catch (error) {
      console.error(`Failed to get form ${formId}:`, error);
      throw error;
    }
  }

  /**
   * Get form responses
   */
  async getFormResponses(formId, limit = 100, offset = 0) {
    try {
      const response = await this.callTypeformAPI(`/forms/${formId}/responses?page_size=${limit}&offset=${offset}`);
      return response.items || [];
    } catch (error) {
      console.error(`Failed to get responses for form ${formId}:`, error);
      throw error;
    }
  }

  /**
   * Get specific response (fixed for API compatibility)
   */
  async getResponse(formId, responseToken) {
    try {
      // Try different API endpoints for individual responses
      let response;

      try {
        // First try with response token (most common)
        response = await this.callTypeformAPI(`/forms/${formId}/responses/${responseToken}`);
      } catch (error) {
        if (error.message.includes('404')) {
          // If 404, try to find the response in the batch responses
          logger.warn(`Individual response API failed for ${responseToken}, searching in batch responses...`);
          const allResponses = await this.getFormResponses(formId);
          response = allResponses.find(r => r.token === responseToken || r.response_id === responseToken);

          if (!response) {
            throw new Error(`Response ${responseToken} not found in form ${formId}`);
          }
        } else {
          throw error;
        }
      }

      return response;
    } catch (error) {
      logger.error(`Failed to get response ${responseToken} from form ${formId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process form response for campaign brief
   */
  async processFormResponseForCampaign(formId, responseId, existingResponse = null) {
    try {
      logger.info(`Processing Typeform response: ${responseId} from form ${formId}`);

      const form = await this.getForm(formId);

      // Use existing response if provided, otherwise fetch it
      const response = existingResponse || await this.getResponse(formId, responseId);

      // Extract campaign information from form response
      const campaignBrief = this.extractCampaignFromResponse(form, response);

      // Add Typeform metadata
      campaignBrief.source = 'typeform';
      campaignBrief.formId = formId;
      campaignBrief.responseId = responseId;
      campaignBrief.responseToken = response.token || responseId;
      campaignBrief.formTitle = form.title || 'Untitled Form';
      campaignBrief.submittedAt = response.submitted_at || new Date().toISOString();

      logger.success(`Campaign brief extracted from Typeform response`);
      return campaignBrief;
    } catch (error) {
      logger.error('Failed to process form response for campaign:', error);
      throw error;
    }
  }

  /**
   * Extract campaign information from form response
   */
  extractCampaignFromResponse(form, response) {
    const campaignBrief = {
      extractedAt: new Date().toISOString(),
      source: 'typeform',
      data: {}
    };

    // Map form fields to campaign data
    const fieldMappings = {
      // Artist information - using actual field IDs from Asset Form NEW
      'oXjFqOTsHy14': 'artistName', // Artist name
      'dXVxfhn4m0pu': 'artistName', // What is your Artist name? (Playlisting form)
      'artist_name': 'artistName',
      'band_name': 'artistName',
      'artist_name_band_name': 'artistName',
      
      // Track information
      '7uFCUgDtdZtY': 'trackTitle', // Track title
      'track_title': 'trackTitle',
      'song_title': 'trackTitle',
      'single_title': 'trackTitle',
      'track_name': 'trackTitle',
      
      // Genre and style
      'kdgC74nEsE7l': 'genre', // Genre of the track
      'q3HrMtNvxJVJ': 'mood', // Mood or feel of the track
      'genre': 'genre',
      'music_genre': 'genre',
      'style': 'genre',
      'music_style': 'genre',
      
      // Release information
      'DEjVLgXOifOi': 'releaseDate', // Release date
      'lmprVoUTdRWl': 'distributor', // Distributor
      'S7J1X5sEKIl2': 'upcCode', // UPC Code
      'FLi7ksnyPY8a': 'isrcCode', // ISRC code
      'fNmbovfH1C27': 'appleTrackId', // Apple Track ID
      'release_date': 'releaseDate',
      'launch_date': 'releaseDate',
      'drop_date': 'releaseDate',
      'release_date_launch_date': 'releaseDate',
      
      // Budget and pricing
      'budget': 'budget',
      'budget_range': 'budget',
      'budget_amount': 'budget',
      'spending_budget': 'budget',
      
      // Campaign details
      'campaign_type': 'campaignType',
      'promotion_type': 'campaignType',
      'radio_promo': 'campaignType',
      
      // Targets and goals
      'target_audience': 'targets',
      'target_stations': 'targets',
      'radio_targets': 'targets',
      'goals': 'targets',
      
      // Priority and urgency
      'priority_level': 'priority',
      'urgency': 'priority',
      'timeline': 'priority',
      
      // Contact information
      'xjz84JBBpnDz': 'contactEmail', // Thank you [artist], what's your email address?
      'z67ARe1z7tln': 'contactEmail', // Point of contact
      'BNqD3bblhT3y': 'contactPhone', // Please can you provide a tel number?
      'contact_email': 'contactEmail',
      'email': 'contactEmail',
      'contact_phone': 'contactPhone',
      'phone': 'contactPhone',
      
      // Artist assets for press releases
      'm8jRqtd4wEei': 'pressPhoto', // Hi-res press photo link
      'kozUZdsYN4ip': 'coverArt', // Hi-res cover art photo link
      'CiYs7M7ioLZV': 'soundcloudLink', // Private SoundCloud link
      'cIzRYmV5Um7H': 'mp3Link', // MP3 & WAV file link
      'lcHLWfKEER2n': 'videoLink', // Private video link
      'press_photo': 'pressPhoto',
      'press_photos': 'pressPhoto',
      'artist_photo': 'pressPhoto',
      'band_photo': 'pressPhoto',
      'press_image': 'pressPhoto',
      'press_images': 'pressPhoto',
      'cover_art': 'coverArt',
      'album_art': 'coverArt',
      
      '176y9SEtCLOf': 'pressBio', // Please provide a press oriented bio
      'cg1x25Z1dPve': 'trackDescription', // Tell us about how you created the track
      '4oYY7A7YluTj': 'trackQuote', // Quote relating to the single
      'press_bio': 'pressBio',
      'artist_bio': 'pressBio',
      'band_bio': 'pressBio',
      'biography': 'pressBio',
      'bio': 'pressBio',
      
      // Social media links
      'LIszLVG7yzvJ': 'instagram', // Instagram
      '8nOPXBCwmJwB': 'twitter', // Twitter
      'u3tCkt0GKOBf': 'facebook', // Facebook
      'ZOJ7eimaZL1s': 'otherLinks', // Other links (SoundCloud, YouTube, Website etc.)
      'social_media': 'socialMedia',
      'socials': 'socialMedia',
      'instagram': 'instagram',
      'twitter': 'twitter',
      'facebook': 'facebook',
      'tiktok': 'tiktok',
      'youtube': 'youtube',
      'spotify': 'spotify',
      'soundcloud': 'soundcloud',
      
      'press_kit': 'pressKit',
      'press_kit_link': 'pressKit',
      'press_kit_url': 'pressKit',
      'media_kit': 'pressKit',
      
      'website': 'website',
      'artist_website': 'website',
      'band_website': 'website',
      'official_website': 'website',
      
      'DyME0Wf5ygIe': 'label', // Label name (if applicable)
      'Lc97InL76L9J': 'producer', // Producer and their notable credits
      'label': 'label',
      'record_label': 'label',
      'label_name': 'label',
      
      'management': 'management',
      'manager': 'management',
      'management_contact': 'management',
      
      // Additional details
      'hcswHHtoAkqo': 'similarArtists', // 3-5 similar artists
      'Gq3tNpD8AZ0l': 'promotionPlans', // How do you plan to promote the track
      'WR9rZxncLyP5': 'instruments', // What instruments were used
      '6nXbEospmChM': 'location', // Location and Time Zone
      'GJ1N6lodOlod': 'previousHighlights', // Key highlights from previous releases
      'aKnhxLvb0DQ8': 'liveDates', // Live Dates
      '1wZFeYnkHWTA': 'interests', // Interests outside of Music
      'description': 'description',
      'track_description': 'description',
      'additional_info': 'additionalInfo',
      'notes': 'additionalInfo'
    };

    // Process form fields
    if (form.fields && response.answers) {
      // Handle both array and object formats for answers
      let answersToProcess = [];
      
      if (Array.isArray(response.answers)) {
        // New format: answers is an array
        answersToProcess = response.answers;
      } else {
        // Old format: answers is an object
        for (const field of form.fields) {
          const fieldId = field.id;
          const answer = response.answers[fieldId];
          
          if (answer) {
            answersToProcess.push({
              field: { id: fieldId },
              ...answer
            });
          }
        }
      }
      
      // Process each answer
      for (const answer of answersToProcess) {
        const fieldId = answer.field?.id;
        
        if (fieldId) {
          const mappedField = fieldMappings[fieldId];
          
          if (mappedField) {
            campaignBrief.data[mappedField] = this.extractAnswerValue(answer);
          }
        }
      }
    }

    // Add form metadata
    campaignBrief.fullResponse = response;
    campaignBrief.confidence = this.calculateExtractionConfidence(campaignBrief.data);
    
    return campaignBrief;
  }

  /**
   * Extract value from Typeform answer
   */
  extractAnswerValue(answer) {
    if (!answer) return '';
    
    if (answer.text) return answer.text;
    if (answer.choice) return answer.choice.label || answer.choice.other || '';
    if (answer.choices && Array.isArray(answer.choices)) {
      return answer.choices.map(choice => choice.label || choice.other || '').join(', ');
    }
    if (answer.date) return answer.date;
    if (answer.number) return answer.number.toString();
    if (answer.boolean !== undefined) return answer.boolean.toString();
    if (answer.url) return answer.url;
    if (answer.email) return answer.email;
    if (answer.phone_number) return answer.phone_number;
    
    return answer.toString();
  }

  /**
   * Calculate confidence score for extraction
   */
  calculateExtractionConfidence(data) {
    const requiredFields = ['artistName', 'trackTitle', 'genre'];
    const extractedRequired = requiredFields.filter(field => data[field]);
    return (extractedRequired.length / requiredFields.length) * 100;
  }

  /**
   * Get recent form responses (last 30 days)
   */
  async getRecentResponses(formId, days = 30) {
    try {
      const allResponses = await this.getFormResponses(formId, 100);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return allResponses.filter(response => {
        const responseDate = new Date(response.submitted_at);
        return responseDate >= cutoffDate;
      });
    } catch (error) {
      console.error('Failed to get recent responses:', error);
      throw error;
    }
  }

  /**
   * Batch process multiple form responses
   */
  async batchProcessResponses(formId, responseIds) {
    const results = [];
    
    for (const responseId of responseIds) {
      try {
        const campaignBrief = await this.processFormResponseForCampaign(formId, responseId);
        results.push({
          responseId,
          success: true,
          campaignBrief
        });
      } catch (error) {
        results.push({
          responseId,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Find forms related to music promotion
   */
  async findMusicPromotionForms() {
    try {
      const allForms = await this.getForms();
      
      const musicKeywords = [
        'music',
        'radio',
        'promo',
        'campaign',
        'artist',
        'track',
        'single',
        'release'
      ];
      
      return allForms.filter(form => {
        const title = (form.title || '').toLowerCase();
        const description = (form.description || '').toLowerCase();
        
        return musicKeywords.some(keyword => 
          title.includes(keyword) || description.includes(keyword)
        );
      });
    } catch (error) {
      console.error('Failed to find music promotion forms:', error);
      throw error;
    }
  }

  /**
   * Find campaigns by email address (READ-ONLY)
   * Cross-references your email with form responses to find your campaigns
   */
  async findCampaignsByEmail(email = null) {
    try {
      const searchEmail = email || this.libertyEmail;
      logger.info(`Searching for campaigns with email: ${searchEmail}`);
      
      // Get all forms first
      const forms = await this.getForms();
      logger.info(`Found ${forms.length} forms to search`);
      
      const foundCampaigns = [];
      
      // Search through each form
      for (const form of forms) {
        try {
          logger.info(`Searching form: ${form.title} (${form.id})`);
          
          // Get all responses for this form
          const responses = await this.getFormResponses(form.id, 100);
          
          // Filter responses that contain the email
          const matchingResponses = responses.filter(response => {
            return this.responseContainsEmail(response, searchEmail);
          });
          
          if (matchingResponses.length > 0) {
            logger.info(`Found ${matchingResponses.length} matching responses in form: ${form.title}`);
            
            // Process each matching response (pass existing response to avoid API calls)
            for (const response of matchingResponses) {
              try {
                const responseId = response.token || response.response_id || response.id;
                const campaignBrief = await this.processFormResponseForCampaign(form.id, responseId, response);
                campaignBrief.emailMatch = searchEmail;
                campaignBrief.formTitle = form.title;
                foundCampaigns.push(campaignBrief);
              } catch (error) {
                logger.warn(`Failed to process response ${response.token || 'unknown'}: ${error.message}`);
              }
            }
          }
        } catch (error) {
          logger.warn(`Failed to search form ${form.id}: ${error.message}`);
        }
      }
      
      logger.success(`Found ${foundCampaigns.length} campaigns for email: ${searchEmail}`);
      return foundCampaigns;
    } catch (error) {
      logger.error('Failed to find campaigns by email:', error);
      throw error;
    }
  }

  /**
   * Check if a form response contains the specified email
   */
  responseContainsEmail(response, email) {
    if (!response.answers) return false;
    
    // Search through all answers for email addresses
    for (const answer of Object.values(response.answers)) {
      const answerText = this.extractAnswerValue(answer);
      if (answerText && answerText.toLowerCase().includes(email.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get recent campaigns for Liberty Music PR (last 30 days)
   */
  async getRecentLibertyCampaigns(days = 30) {
    try {
      logger.info(`Getting recent Liberty campaigns from last ${days} days`);
      
      const allCampaigns = await this.findCampaignsByEmail();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentCampaigns = allCampaigns.filter(campaign => {
        const campaignDate = new Date(campaign.submittedAt);
        return campaignDate >= cutoffDate;
      });
      
      logger.success(`Found ${recentCampaigns.length} recent campaigns`);
      return recentCampaigns;
    } catch (error) {
      logger.error('Failed to get recent Liberty campaigns:', error);
      throw error;
    }
  }

  /**
   * Search for campaigns by artist name across ALL form responses
   * This searches through all forms and responses, not just Liberty email matches
   */
  async findCampaignsByArtist(artistName) {
    try {
      logger.info(`Searching for campaigns by artist: ${artistName}`);
      
      // Get all forms first
      const forms = await this.getRecentForms(50); // Search last 50 forms for better coverage
      logger.info(`Searching through ${forms.length} forms for artist: ${artistName}`);
      
      const foundCampaigns = [];
      
      // Search through each form
      for (const form of forms) {
        try {
          logger.info(`Searching form: ${form.title} (${form.id})`);
          
          // Get all responses for this form
          const responses = await this.getFormResponses(form.id, 100);
          
          // Search for artist name in responses
          for (const response of responses) {
            try {
              // Process the response to extract campaign data
              const campaignBrief = await this.processFormResponseForCampaign(form.id, response.token || response.response_id || response.id, response);
              
              // Check if this response contains the artist name
              const artist = campaignBrief.data.artistName || '';
              if (artist.toLowerCase().includes(artistName.toLowerCase())) {
                campaignBrief.artistMatch = artistName;
                campaignBrief.formTitle = form.title;
                foundCampaigns.push(campaignBrief);
                logger.info(`Found artist match: ${artist} in form ${form.title}`);
              }
            } catch (error) {
              logger.warn(`Failed to process response ${response.token || 'unknown'}: ${error.message}`);
            }
          }
        } catch (error) {
          logger.warn(`Failed to search form ${form.id}: ${error.message}`);
        }
      }
      
      logger.success(`Found ${foundCampaigns.length} campaigns for artist: ${artistName}`);
      return foundCampaigns;
    } catch (error) {
      logger.error('Failed to find campaigns by artist:', error);
      throw error;
    }
  }

  /**
   * Fast search for campaigns by artist name (searches response text without full processing)
   * More efficient for quick searches
   */
  async findCampaignsByArtistFast(artistName) {
    try {
      logger.info(`Fast search for campaigns by artist: ${artistName}`);
      
      const forms = await this.getRecentForms(30); // Search last 30 forms for speed
      const foundCampaigns = [];
      
      for (const form of forms) {
        try {
          const responses = await this.getFormResponses(form.id, 50); // Limit responses per form
          
          for (const response of responses) {
            // Quick text search in response answers
            if (this.responseContainsArtistName(response, artistName)) {
              try {
                // Only process if we found a match
                const campaignBrief = await this.processFormResponseForCampaign(form.id, response.token || response.response_id || response.id, response);
                campaignBrief.artistMatch = artistName;
                campaignBrief.formTitle = form.title;
                foundCampaigns.push(campaignBrief);
                logger.info(`Found artist match: ${campaignBrief.data.artistName} in form ${form.title}`);
              } catch (error) {
                logger.warn(`Failed to process matching response: ${error.message}`);
              }
            }
          }
        } catch (error) {
          logger.warn(`Failed to search form ${form.id}: ${error.message}`);
        }
      }
      
      logger.success(`Found ${foundCampaigns.length} campaigns for artist: ${artistName}`);
      return foundCampaigns;
    } catch (error) {
      logger.error('Failed to find campaigns by artist (fast):', error);
      throw error;
    }
  }

  /**
   * Check if a form response contains the specified artist name
   */
  responseContainsArtistName(response, artistName) {
    if (!response.answers) return false;
    
    const searchName = artistName.toLowerCase();
    
    // Search through all answers for artist name
    for (const answer of Object.values(response.answers)) {
      const answerText = this.extractAnswerValue(answer).toLowerCase();
      if (answerText.includes(searchName)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get campaign summary for Liberty Music PR
   */
  async getLibertyCampaignSummary() {
    try {
      logger.info('Generating Liberty Music PR campaign summary...');
      
      const allCampaigns = await this.findCampaignsByEmail();
      
      const summary = {
        timestamp: new Date().toISOString(),
        totalCampaigns: allCampaigns.length,
        recentCampaigns: allCampaigns.filter(c => {
          const campaignDate = new Date(c.submittedAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return campaignDate >= thirtyDaysAgo;
        }).length,
        artists: [...new Set(allCampaigns.map(c => c.data.artistName).filter(Boolean))],
        genres: [...new Set(allCampaigns.map(c => c.data.genre).filter(Boolean))],
        campaigns: allCampaigns.map(campaign => ({
          artist: campaign.data.artistName,
          track: campaign.data.trackTitle,
          genre: campaign.data.genre,
          submittedAt: campaign.submittedAt,
          formTitle: campaign.formTitle,
          confidence: campaign.confidence
        }))
      };
      
      // Save summary
      const fs = require('fs');
      const summaryPath = `./training-data/liberty_campaigns_summary_${Date.now()}.json`;
      if (!fs.existsSync('./training-data')) fs.mkdirSync('./training-data', { recursive: true });
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      
      logger.success(`Liberty campaign summary saved: ${summaryPath}`);
      return summary;
    } catch (error) {
      logger.error('Failed to generate campaign summary:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      await this.getForms();
      return {
        status: 'healthy',
        service: 'typeform',
        readOnlyMode: this.readOnlyMode,
        libertyEmail: this.libertyEmail,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'typeform',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = TypeformApiIntegration;

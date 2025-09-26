const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[GMAIL] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[GMAIL] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[GMAIL] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [GMAIL] ${msg}`, ...args)
};

// Import demo mode
const GmailDemoMode = require('../gmail-demo-mode.js');

/**
 * Gmail API Integration for Liberty Music PR
 *
 * Uses Google OAuth2 with your console credentials
 * Searches Gmail for campaign email threads and extracts artist information
 */
class GmailApiIntegration {
  constructor() {
    // Your Liberty Music PR OAuth credentials
    this.oauth2Client = new google.auth.OAuth2(
      '309298460159-relob8rbr4qpr6bduso8i6pr2egjfm0k.apps.googleusercontent.com',
      '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',
      'http://localhost:3001/callback'
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    this.rateLimitDelay = 1000; // 1 second between calls
    this.lastApiCall = 0;

    // Check for OAuth tokens
    const tokenPath = path.join(__dirname, '../gmail-token.json');
    this.hasValidTokens = fs.existsSync(tokenPath);

    // Initialize authentication
    if (this.hasValidTokens) {
      try {
        const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
        this.oauth2Client.setCredentials(tokens);
        logger.success('OAuth tokens loaded successfully');
        this.usingDemo = false;
      } catch (error) {
        logger.warn('Failed to load OAuth tokens, falling back to demo mode');
        this.demoMode = new GmailDemoMode();
        this.usingDemo = true;
      }
    } else {
      logger.info('No OAuth tokens found - activating Gmail Demo Mode');
      logger.info('Run: node radio-promo-agent.js setup-gmail-auth');
      this.demoMode = new GmailDemoMode();
      this.usingDemo = true;
    }

    // Liberty Music PR email
    this.libertyEmail = 'chrisschofield@libertymusicpr.com';

    // Campaign search terms
    this.campaignKeywords = [
      'radio promo',
      'campaign',
      'release',
      'track',
      'single',
      'promotion',
      'liberty music',
      'onboarding',
      'brief'
    ];
  }

  /**
   * Rate-limited API call to Gmail using Google APIs library
   */
  async callGmailAPI(method, params = {}) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;

    if (timeSinceLastCall < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      this.lastApiCall = Date.now();

      // Use the correct Gmail API structure
      let response;
      if (method === 'messages.list') {
        response = await this.gmail.users.messages.list(params);
      } else if (method === 'messages.get') {
        response = await this.gmail.users.messages.get(params);
      } else {
        throw new Error(`Unsupported Gmail API method: ${method}`);
      }

      return response.data;
    } catch (error) {
      logger.error('Gmail API call failed:', error);
      throw error;
    }
  }

  /**
   * Search for active campaigns using the new label system
   */
  async searchActiveCampaigns(maxResults = 20) {
    try {
      if (this.usingDemo && this.demoMode) {
        logger.info('Using demo mode for searchActiveCampaigns');
        return await this.demoMode.searchEmails('label:active-campaigns', maxResults);
      }

      return await this.searchEmails('label:"Active Campaigns"', maxResults);
    } catch (error) {
      logger.error('Failed to search active campaigns:', error);
      return [];
    }
  }

  /**
   * Search for campaigns needing action
   */
  async searchCampaignsNeedingAction(maxResults = 10) {
    try {
      if (this.usingDemo && this.demoMode) {
        logger.info('Using demo mode for searchCampaignsNeedingAction');
        return await this.demoMode.searchEmails('label:needs-action', maxResults);
      }

      return await this.searchEmails('label:"Needs Action"', maxResults);
    } catch (error) {
      logger.error('Failed to search campaigns needing action:', error);
      return [];
    }
  }

  /**
   * Search for station feedback
   */
  async searchStationFeedback(maxResults = 10) {
    try {
      if (this.usingDemo && this.demoMode) {
        logger.info('Using demo mode for searchStationFeedback');
        return await this.demoMode.searchEmails('label:station-feedback', maxResults);
      }

      return await this.searchEmails('label:"Station Feedback"', maxResults);
    } catch (error) {
      logger.error('Failed to search station feedback:', error);
      return [];
    }
  }

  /**
   * Mark email as processed by agent
   */
  async markAsProcessed(messageId) {
    try {
      if (this.usingDemo && this.demoMode) {
        logger.info('Demo mode: Would mark message as processed:', messageId);
        return true;
      }

      // Get Agent label ID
      const labelsResponse = await this.gmail.users.labels.list({ userId: 'me' });
      const agentLabel = labelsResponse.data.labels.find(label => label.name === 'Agent');

      if (!agentLabel) {
        logger.warn('Agent label not found - run gmail-liberty-setup.js first');
        return false;
      }

      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: [agentLabel.id]
        }
      });

      logger.success(`Marked message ${messageId} as processed by agent`);
      return true;

    } catch (error) {
      logger.error('Failed to mark message as processed:', error);
      return false;
    }
  }

  /**
   * General Gmail search method (for agent compatibility)
   */
  async searchEmails(query, maxResults = 10) {
    try {
      if (this.usingDemo && this.demoMode) {
        logger.info('Using demo mode for searchEmails');
        return await this.demoMode.searchEmails(query, maxResults);
      }

      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }

      logger.info(`Searching Gmail for: "${query}" (max ${maxResults} results)`);

      // Search for messages
      const response = await this.callGmailAPI('messages.list', {
        userId: 'me',
        q: query,
        maxResults: maxResults
      });

      const messageIds = response.messages || [];
      if (messageIds.length === 0) {
        logger.info('No messages found for query');
        return [];
      }

      logger.info(`Found ${messageIds.length} messages, fetching details...`);

      // Get detailed information for each email
      const emails = [];
      for (const message of messageIds) {
        try {
          const emailDetails = await this.getMessageDetails(message.id);
          if (emailDetails) {
            // Format for general use (not just campaign-specific)
            const formattedEmail = {
              id: emailDetails.id,
              threadId: emailDetails.threadId,
              subject: emailDetails.subject,
              from: emailDetails.from,
              to: emailDetails.to,
              date: emailDetails.date,
              snippet: emailDetails.snippet,
              body: emailDetails.body
            };
            emails.push(formattedEmail);
          }
        } catch (error) {
          logger.warn(`Failed to get details for message ${message.id}: ${error.message}`);
        }
      }

      logger.success(`Retrieved ${emails.length} email details`);
      return emails;

    } catch (error) {
      logger.error('Failed to search emails:', error);

      // Fallback to demo mode on error
      if (this.demoMode) {
        logger.info('Falling back to demo mode due to API error');
        return await this.demoMode.searchEmails(query, maxResults);
      }

      throw new Error(`Gmail search failed: ${error.message}`);
    }
  }

  /**
   * Search Gmail for campaign-related emails
   */
  async searchCampaignEmails(query = '', maxResults = 50) {
    try {
      logger.info(`Searching Gmail for campaign emails...`);

      // Build search query
      const searchQuery = this.buildSearchQuery(query);
      logger.info(`Search query: ${searchQuery}`);

      // Search for emails using Gmail API
      const response = await this.callGmailAPI('messages.list', {
        userId: 'me',
        q: searchQuery,
        maxResults: maxResults
      });

      const messageIds = response.messages || [];
      logger.info(`Found ${messageIds.length} campaign emails`);

      // Get detailed information for each email
      const campaignEmails = [];
      for (const message of messageIds) {
        try {
          const emailDetails = await this.getMessageDetails(message.id);
          if (emailDetails) {
            campaignEmails.push(emailDetails);
          }
        } catch (error) {
          logger.warn(`Failed to get details for message ${message.id}: ${error.message}`);
        }
      }

      logger.success(`Retrieved ${campaignEmails.length} campaign email details`);
      return campaignEmails;
    } catch (error) {
      logger.error('Failed to search campaign emails:', error);
      throw error;
    }
  }

  /**
   * Build Gmail search query for campaign emails
   */
  buildSearchQuery(additionalQuery = '') {
    const baseQuery = `to:${this.libertyEmail} OR cc:${this.libertyEmail}`;
    const keywordQuery = this.campaignKeywords.map(keyword => `"${keyword}"`).join(' OR ');
    const timeQuery = 'newer_than:30d'; // Last 30 days
    
    return `${baseQuery} AND (${keywordQuery}) AND ${timeQuery} ${additionalQuery}`.trim();
  }

  /**
   * Get detailed message information
   */
  async getMessageDetails(messageId) {
    try {
      const response = await this.callGmailAPI('messages.get', {
        userId: 'me',
        id: messageId
      });
      
      // Extract headers
      const headers = {};
      if (response.payload && response.payload.headers) {
        response.payload.headers.forEach(header => {
          headers[header.name.toLowerCase()] = header.value;
        });
      }
      
      // Extract body content
      const body = this.extractEmailBody(response.payload);
      
      // Extract artist information
      const artistInfo = this.extractArtistInfo(headers, body);
      
      return {
        id: messageId,
        threadId: response.threadId,
        subject: headers.subject || 'No Subject',
        from: headers.from || 'Unknown',
        to: headers.to || '',
        cc: headers.cc || '',
        date: headers.date || '',
        body: body,
        artistInfo: artistInfo,
        snippet: response.snippet || ''
      };
    } catch (error) {
      logger.warn(`Failed to get message details for ${messageId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Extract email body content
   */
  extractEmailBody(payload) {
    let body = '';
    
    if (payload.body && payload.body.data) {
      // Simple text body
      body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
    } else if (payload.parts) {
      // Multipart message
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          body += Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.parts) {
          // Nested parts
          body += this.extractEmailBody(part);
        }
      }
    }
    
    return body;
  }

  /**
   * Extract artist information from email
   */
  extractArtistInfo(headers, body) {
    const artistInfo = {
      email: '',
      name: '',
      track: '',
      genre: '',
      releaseDate: '',
      budget: '',
      confidence: 0
    };
    
    // Extract from email address
    const fromEmail = headers.from || '';
    const emailMatch = fromEmail.match(/([^<]+@[^>]+)/);
    if (emailMatch) {
      artistInfo.email = emailMatch[1].trim();
    }
    
    // Extract from subject line
    const subject = headers.subject || '';
    artistInfo.track = this.extractTrackFromSubject(subject);
    
    // Extract from email body
    const bodyText = body.toLowerCase();
    
    // Look for artist name patterns
    const artistPatterns = [
      /artist[:\s]+([^\n\r]+)/i,
      /band[:\s]+([^\n\r]+)/i,
      /musician[:\s]+([^\n\r]+)/i,
      /name[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of artistPatterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        artistInfo.name = match[1].trim();
        break;
      }
    }
    
    // Look for track title patterns
    const trackPatterns = [
      /track[:\s]+([^\n\r]+)/i,
      /song[:\s]+([^\n\r]+)/i,
      /single[:\s]+([^\n\r]+)/i,
      /title[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of trackPatterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        artistInfo.track = match[1].trim();
        break;
      }
    }
    
    // Look for genre patterns
    const genrePatterns = [
      /genre[:\s]+([^\n\r]+)/i,
      /style[:\s]+([^\n\r]+)/i,
      /type[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of genrePatterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        artistInfo.genre = match[1].trim();
        break;
      }
    }
    
    // Look for release date patterns
    const datePatterns = [
      /release[:\s]+([^\n\r]+)/i,
      /launch[:\s]+([^\n\r]+)/i,
      /drop[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of datePatterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        artistInfo.releaseDate = match[1].trim();
        break;
      }
    }
    
    // Look for budget patterns
    const budgetPatterns = [
      /budget[:\s]+([^\n\r]+)/i,
      /spend[:\s]+([^\n\r]+)/i,
      /cost[:\s]+([^\n\r]+)/i
    ];
    
    for (const pattern of budgetPatterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        artistInfo.budget = match[1].trim();
        break;
      }
    }
    
    // Calculate confidence based on extracted fields
    const extractedFields = Object.values(artistInfo).filter(value => value && value !== '').length;
    artistInfo.confidence = (extractedFields / 7) * 100; // 7 total fields
    
    return artistInfo;
  }

  /**
   * Extract track title from subject line
   */
  extractTrackFromSubject(subject) {
    // Common patterns in subject lines
    const patterns = [
      /"([^"]+)"/, // Quoted track titles
      /'([^']+)'/, // Single quoted track titles
      /- ([^-]+)$/, // Dash before track title
      /: ([^:]+)$/, // Colon before track title
    ];
    
    for (const pattern of patterns) {
      const match = subject.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return '';
  }

  /**
   * Find campaign emails with artist information
   */
  async findCampaignEmailsWithArtists() {
    try {
      // Use demo mode if available
      if (this.usingDemo && this.demoMode) {
        return await this.demoMode.findCampaignEmailsWithArtists();
      }

      logger.info('Finding campaign emails with artist information...');

      const campaignEmails = await this.searchCampaignEmails();
      const emailsWithArtists = campaignEmails.filter(email =>
        email.artistInfo &&
        (email.artistInfo.email || email.artistInfo.name || email.artistInfo.track)
      );

      logger.success(`Found ${emailsWithArtists.length} campaign emails with artist information`);
      return emailsWithArtists;
    } catch (error) {
      logger.error('Failed to find campaign emails with artists:', error);

      // Fallback to demo mode on error
      if (this.demoMode) {
        logger.info('Falling back to demo mode due to API error');
        return await this.demoMode.findCampaignEmailsWithArtists();
      }

      throw error;
    }
  }

  /**
   * Get artist emails from campaign threads
   */
  async getArtistEmailsFromCampaigns() {
    try {
      // Use demo mode if available
      if (this.usingDemo && this.demoMode) {
        return await this.demoMode.getArtistEmailsFromCampaigns();
      }

      const campaignEmails = await this.findCampaignEmailsWithArtists();
      const artistEmails = new Set();

      campaignEmails.forEach(email => {
        if (email.artistInfo && email.artistInfo.email) {
          artistEmails.add(email.artistInfo.email);
        }
      });

      const uniqueEmails = Array.from(artistEmails);
      logger.success(`Found ${uniqueEmails.length} unique artist emails from campaigns`);

      return {
        artistEmails: uniqueEmails,
        campaignEmails: campaignEmails,
        totalCampaigns: campaignEmails.length
      };
    } catch (error) {
      logger.error('Failed to get artist emails from campaigns:', error);

      // Fallback to demo mode on error
      if (this.demoMode) {
        logger.info('Falling back to demo mode due to API error');
        return await this.demoMode.getArtistEmailsFromCampaigns();
      }

      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      // Test with a simple search
      await this.callGmailAPI('/users/me/profile');
      return {
        status: 'healthy',
        service: 'gmail',
        libertyEmail: this.libertyEmail,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'gmail',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = GmailApiIntegration;


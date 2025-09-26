const GmailApiIntegration = require('./gmail-api');
const TypeformApiIntegration = require('./typeform-api');

// Simple logger fallback
const logger = {
  info: (msg, ...args) => console.log(`[GMAIL-TYPEFORM] ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[GMAIL-TYPEFORM] ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[GMAIL-TYPEFORM] ${msg}`, ...args),
  success: (msg, ...args) => console.log(`✅ [GMAIL-TYPEFORM] ${msg}`, ...args)
};

/**
 * Gmail + Typeform Campaign Matcher for Liberty Music PR
 * 
 * 1. Searches Gmail for campaign email threads
 * 2. Extracts artist emails from Gmail threads
 * 3. Cross-references artist emails with Typeform responses
 * 4. Matches campaigns between Gmail and Typeform
 */
class GmailTypeformMatcher {
  constructor() {
    this.gmail = new GmailApiIntegration();
    this.typeform = new TypeformApiIntegration();
    this.gmailAvailable = false; // Will be set to true when Gmail OAuth is working
  }

  /**
   * Find Liberty campaigns by cross-referencing Gmail and Typeform
   */
  async findLibertyCampaigns() {
    try {
      logger.info('Starting Liberty campaign discovery process...');
      
      // Step 1: Get artist emails from Gmail campaigns
      logger.info('Step 1: Searching Gmail for campaign emails...');
      const gmailData = await this.gmail.getArtistEmailsFromCampaigns();
      
      if (gmailData.artistEmails.length === 0) {
        logger.warn('No artist emails found in Gmail campaigns');
        return {
          gmailCampaigns: gmailData.campaignEmails,
          typeformMatches: [],
          matchedCampaigns: [],
          totalMatches: 0
        };
      }
      
      logger.success(`Found ${gmailData.artistEmails.length} artist emails from Gmail`);
      
      // Step 2: Search Typeform for responses with these emails
      logger.info('Step 2: Searching Typeform for matching responses...');
      const typeformMatches = await this.searchTypeformByEmails(gmailData.artistEmails);
      
      logger.success(`Found ${typeformMatches.length} Typeform matches`);
      
      // Step 3: Match campaigns between Gmail and Typeform
      logger.info('Step 3: Matching campaigns between Gmail and Typeform...');
      const matchedCampaigns = this.matchCampaigns(gmailData.campaignEmails, typeformMatches);
      
      logger.success(`Matched ${matchedCampaigns.length} campaigns`);
      
      // Step 4: Save results
      const results = {
        timestamp: new Date().toISOString(),
        gmailCampaigns: gmailData.campaignEmails,
        typeformMatches: typeformMatches,
        matchedCampaigns: matchedCampaigns,
        totalMatches: matchedCampaigns.length,
        artistEmails: gmailData.artistEmails
      };
      
      // Save to training data
      const fs = require('fs');
      const resultsPath = `./training-data/liberty_campaigns_matched_${Date.now()}.json`;
      if (!fs.existsSync('./training-data')) fs.mkdirSync('./training-data', { recursive: true });
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      
      logger.success(`Liberty campaign matches saved: ${resultsPath}`);
      return results;
    } catch (error) {
      logger.error('Failed to find Liberty campaigns:', error);
      throw error;
    }
  }

  /**
   * Search Typeform responses by artist emails (recent forms only)
   */
  async searchTypeformByEmails(artistEmails) {
    try {
      logger.info(`Searching recent Typeform forms for ${artistEmails.length} artist emails...`);
      
      // Get recent forms (last 20) - much more efficient
      const forms = await this.typeform.getRecentForms(20);
      const matches = [];
      
      logger.info(`Searching through ${forms.length} recent forms`);
      
      // Search through each recent form
      for (const form of forms) {
        try {
          logger.info(`Searching form: ${form.title} (${form.id})`);
          
          // Get recent responses for this form (last 50)
          const responses = await this.typeform.getFormResponses(form.id, 50);
          
          // Filter responses that contain any of the artist emails
          const matchingResponses = responses.filter(response => {
            return artistEmails.some(email => 
              this.typeform.responseContainsEmail(response, email)
            );
          });
          
          if (matchingResponses.length > 0) {
            logger.info(`Found ${matchingResponses.length} matching responses in form: ${form.title}`);
            
            // Process each matching response
            for (const response of matchingResponses) {
              try {
                const campaignBrief = await this.typeform.processFormResponseForCampaign(form.id, response.token);
                campaignBrief.formTitle = form.title;
                campaignBrief.matchedEmail = this.findMatchingEmail(response, artistEmails);
                campaignBrief.formCreatedAt = form.created_at;
                matches.push(campaignBrief);
              } catch (error) {
                logger.warn(`Failed to process response ${response.token}: ${error.message}`);
              }
            }
          }
        } catch (error) {
          logger.warn(`Failed to search form ${form.id}: ${error.message}`);
        }
      }
      
      logger.success(`Found ${matches.length} Typeform matches for artist emails in recent forms`);
      return matches;
    } catch (error) {
      logger.error('Failed to search Typeform by emails:', error);
      throw error;
    }
  }

  /**
   * Find which email matched in a Typeform response
   */
  findMatchingEmail(response, artistEmails) {
    if (!response.answers) return null;
    
    for (const answer of Object.values(response.answers)) {
      const answerText = this.typeform.extractAnswerValue(answer);
      if (answerText) {
        for (const email of artistEmails) {
          if (answerText.toLowerCase().includes(email.toLowerCase())) {
            return email;
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Match campaigns between Gmail and Typeform
   */
  matchCampaigns(gmailCampaigns, typeformMatches) {
    const matchedCampaigns = [];
    
    for (const gmailCampaign of gmailCampaigns) {
      const gmailEmail = gmailCampaign.artistInfo?.email;
      if (!gmailEmail) continue;
      
      // Find matching Typeform response
      const typeformMatch = typeformMatches.find(tf => 
        tf.matchedEmail === gmailEmail
      );
      
      if (typeformMatch) {
        const matchedCampaign = {
          gmailCampaign: gmailCampaign,
          typeformResponse: typeformMatch,
          matchConfidence: this.calculateMatchConfidence(gmailCampaign, typeformMatch),
          matchedEmail: gmailEmail,
          campaignId: `liberty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        matchedCampaigns.push(matchedCampaign);
      }
    }
    
    return matchedCampaigns;
  }

  /**
   * Calculate confidence score for Gmail-Typeform match
   */
  calculateMatchConfidence(gmailCampaign, typeformResponse) {
    let confidence = 0;
    
    // Email match (required)
    if (gmailCampaign.artistInfo?.email === typeformResponse.matchedEmail) {
      confidence += 40;
    }
    
    // Artist name match
    const gmailName = gmailCampaign.artistInfo?.name?.toLowerCase() || '';
    const typeformName = typeformResponse.data?.artistName?.toLowerCase() || '';
    if (gmailName && typeformName && gmailName.includes(typeformName)) {
      confidence += 30;
    }
    
    // Track title match
    const gmailTrack = gmailCampaign.artistInfo?.track?.toLowerCase() || '';
    const typeformTrack = typeformResponse.data?.trackTitle?.toLowerCase() || '';
    if (gmailTrack && typeformTrack && gmailTrack.includes(typeformTrack)) {
      confidence += 20;
    }
    
    // Genre match
    const gmailGenre = gmailCampaign.artistInfo?.genre?.toLowerCase() || '';
    const typeformGenre = typeformResponse.data?.genre?.toLowerCase() || '';
    if (gmailGenre && typeformGenre && gmailGenre.includes(typeformGenre)) {
      confidence += 10;
    }
    
    return Math.min(confidence, 100);
  }

  /**
   * Get recent Liberty campaigns (last 30 days)
   */
  async getRecentLibertyCampaigns(days = 30) {
    try {
      const allCampaigns = await this.findLibertyCampaigns();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentCampaigns = allCampaigns.matchedCampaigns.filter(campaign => {
        const campaignDate = new Date(campaign.gmailCampaign.date);
        return campaignDate >= cutoffDate;
      });
      
      logger.success(`Found ${recentCampaigns.length} recent Liberty campaigns`);
      return recentCampaigns;
    } catch (error) {
      logger.error('Failed to get recent Liberty campaigns:', error);
      throw error;
    }
  }

  /**
   * Search for campaigns by artist name
   */
  async findCampaignsByArtist(artistName) {
    try {
      logger.info(`Searching for campaigns by artist: ${artistName}`);
      
      // Use the new artist search method that searches ALL form responses
      const typeformCampaigns = await this.typeform.findCampaignsByArtistFast(artistName);
      
      // Also try to get Gmail matches if available
      let gmailMatches = [];
      try {
        const allCampaigns = await this.findLibertyCampaigns();
        gmailMatches = allCampaigns.matchedCampaigns.filter(campaign => {
          const gmailName = campaign.gmailCampaign.artistInfo?.name?.toLowerCase() || '';
          const typeformName = campaign.typeformResponse.data?.artistName?.toLowerCase() || '';
          const searchName = artistName.toLowerCase();
          
          return gmailName.includes(searchName) || typeformName.includes(searchName);
        });
      } catch (error) {
        logger.warn('Gmail matching not available, using Typeform only');
      }
      
      // Combine and deduplicate results
      const allMatches = [...typeformCampaigns, ...gmailMatches];
      const uniqueMatches = this.deduplicateCampaigns(allMatches);
      
      logger.success(`Found ${uniqueMatches.length} campaigns for artist: ${artistName}`);
      return uniqueMatches;
    } catch (error) {
      logger.error('Failed to find campaigns by artist:', error);
      throw error;
    }
  }

  /**
   * Deduplicate campaigns based on artist name and track title
   */
  deduplicateCampaigns(campaigns) {
    const seen = new Set();
    return campaigns.filter(campaign => {
      const key = `${campaign.data?.artistName || ''}-${campaign.data?.trackTitle || ''}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Generate comprehensive campaign summary
   */
  async generateCampaignSummary() {
    try {
      logger.info('Generating comprehensive Liberty campaign summary...');
      
      const allCampaigns = await this.findLibertyCampaigns();
      
      const summary = {
        timestamp: new Date().toISOString(),
        totalGmailCampaigns: allCampaigns.gmailCampaigns.length,
        totalTypeformMatches: allCampaigns.typeformMatches.length,
        totalMatchedCampaigns: allCampaigns.matchedCampaigns.length,
        artistEmails: allCampaigns.artistEmails,
        artists: [...new Set(allCampaigns.matchedCampaigns.map(c => 
          c.typeformResponse.data?.artistName || c.gmailCampaign.artistInfo?.name
        ).filter(Boolean))],
        genres: [...new Set(allCampaigns.matchedCampaigns.map(c => 
          c.typeformResponse.data?.genre || c.gmailCampaign.artistInfo?.genre
        ).filter(Boolean))],
        campaigns: allCampaigns.matchedCampaigns.map(campaign => ({
          campaignId: campaign.campaignId,
          artist: campaign.typeformResponse.data?.artistName || campaign.gmailCampaign.artistInfo?.name,
          track: campaign.typeformResponse.data?.trackTitle || campaign.gmailCampaign.artistInfo?.track,
          genre: campaign.typeformResponse.data?.genre || campaign.gmailCampaign.artistInfo?.genre,
          email: campaign.matchedEmail,
          gmailSubject: campaign.gmailCampaign.subject,
          typeformForm: campaign.typeformResponse.formTitle,
          matchConfidence: campaign.matchConfidence,
          gmailDate: campaign.gmailCampaign.date,
          typeformDate: campaign.typeformResponse.submittedAt
        }))
      };
      
      // Save summary
      const fs = require('fs');
      const summaryPath = `./training-data/liberty_campaigns_comprehensive_${Date.now()}.json`;
      if (!fs.existsSync('./training-data')) fs.mkdirSync('./training-data', { recursive: true });
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      
      logger.success(`Comprehensive campaign summary saved: ${summaryPath}`);
      return summary;
    } catch (error) {
      logger.error('Failed to generate campaign summary:', error);
      throw error;
    }
  }

  /**
   * Health check for both integrations
   */
  async healthCheck() {
    const gmailHealth = await this.gmail.healthCheck();
    const typeformHealth = await this.typeform.healthCheck();
    
    return {
      gmail: gmailHealth,
      typeform: typeformHealth,
      overall: gmailHealth.status === 'healthy' && typeformHealth.status === 'healthy' ? 'healthy' : 'unhealthy'
    };
  }

  /**
   * Fallback method when Gmail is not available
   */
  async findTypeformOnlyCampaigns() {
    try {
      logger.info('Gmail not available - searching Typeform only...');
      
      const recentForms = await this.typeform.getRecentForms(20);
      const campaigns = [];
      
      for (const form of recentForms) {
        const responses = await this.typeform.getFormResponses(form.id, 50);
        
        for (const response of responses) {
          const campaignData = this.typeform.extractCampaignData(response);
          if (campaignData) {
            campaigns.push({
              source: 'typeform-only',
              formId: form.id,
              responseId: response.token,
              campaignData: campaignData,
              foundAt: new Date().toISOString()
            });
          }
        }
      }
      
      logger.success(`Found ${campaigns.length} campaigns from Typeform`);
      return campaigns;
      
    } catch (error) {
      logger.error('Failed to find Typeform campaigns:', error.message);
      throw error;
    }
  }
}

module.exports = GmailTypeformMatcher;

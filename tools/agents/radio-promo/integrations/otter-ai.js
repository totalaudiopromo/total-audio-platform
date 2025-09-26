#!/usr/bin/env node

/**
 * Otter.ai API Integration for Liberty Music PR
 * 
 * Processes existing Otter.ai transcripts for campaign brief extraction
 * Handles both individual transcripts and batch processing
 */

const fetch = require('node-fetch');

class OtterAiIntegration {
  constructor() {
    this.apiKey = process.env.OTTER_AI_API_KEY;
    this.baseUrl = 'https://otter.ai/api/v1';
    this.rateLimitDelay = 2000; // 2 seconds between calls
    this.lastApiCall = 0;
    
    if (!this.apiKey) {
      throw new Error('OTTER_AI_API_KEY environment variable is required');
    }
  }

  /**
   * Rate-limited API call to Otter.ai
   */
  async callOtterAPI(endpoint, options = {}) {
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
        throw new Error(`Otter.ai API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Otter.ai API call failed:', error);
      throw error;
    }
  }

  /**
   * Get list of available transcripts
   */
  async getTranscripts(limit = 50, offset = 0) {
    try {
      const response = await this.callOtterAPI(`/transcripts?limit=${limit}&offset=${offset}`);
      return response.transcripts || [];
    } catch (error) {
      console.error('Failed to get transcripts:', error);
      throw error;
    }
  }

  /**
   * Get specific transcript by ID
   */
  async getTranscript(transcriptId) {
    try {
      const response = await this.callOtterAPI(`/transcripts/${transcriptId}`);
      return response;
    } catch (error) {
      console.error(`Failed to get transcript ${transcriptId}:`, error);
      throw error;
    }
  }

  /**
   * Get transcript text content
   */
  async getTranscriptText(transcriptId) {
    try {
      const response = await this.callOtterAPI(`/transcripts/${transcriptId}/text`);
      return response.text || '';
    } catch (error) {
      console.error(`Failed to get transcript text for ${transcriptId}:`, error);
      throw error;
    }
  }

  /**
   * Search transcripts by keywords
   */
  async searchTranscripts(query, limit = 20) {
    try {
      const response = await this.callOtterAPI(`/transcripts/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.transcripts || [];
    } catch (error) {
      console.error('Failed to search transcripts:', error);
      throw error;
    }
  }

  /**
   * Process transcript for campaign brief extraction
   */
  async processTranscriptForCampaign(transcriptId) {
    try {
      console.log(`Processing Otter.ai transcript: ${transcriptId}`);
      
      // Get transcript details
      const transcript = await this.getTranscript(transcriptId);
      const transcriptText = await this.getTranscriptText(transcriptId);
      
      // Extract campaign information using patterns
      const campaignBrief = this.extractCampaignInfo(transcriptText, transcript);
      
      // Add Otter.ai metadata
      campaignBrief.source = 'otter_ai';
      campaignBrief.transcriptId = transcriptId;
      campaignBrief.transcriptTitle = transcript.title || 'Untitled';
      campaignBrief.transcriptDate = transcript.created_at || new Date().toISOString();
      campaignBrief.duration = transcript.duration || 0;
      
      console.log(`✅ Campaign brief extracted from Otter.ai transcript`);
      return campaignBrief;
    } catch (error) {
      console.error('Failed to process transcript for campaign:', error);
      throw error;
    }
  }

  /**
   * Extract campaign information from transcript text
   */
  extractCampaignInfo(transcriptText, transcript) {
    const campaignBrief = {
      extractedAt: new Date().toISOString(),
      source: 'otter_ai',
      data: {}
    };

    // Enhanced patterns for Otter.ai transcripts
    const patterns = {
      artistName: /(?:artist|band|client)[:\s]+([A-Za-z\s&]+)/i,
      trackTitle: /(?:track|song|single)[:\s]+"([^"]+)"/i,
      genre: /(?:genre|style|type)[:\s]+([A-Za-z\s]+)/i,
      releaseDate: /(?:release|launch|drop)[:\s]+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i,
      budget: /(?:budget|budget|spend)[:\s]*(?:is\s+)?(?:around\s+)?[\$£]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      targets: /(?:target|want\s+to\s+target|focus\s+on)[:\s]*([^\.]+)/i,
      priority: /(?:priority|urgent|important)[:\s]*(?:level\s*[:\s]*)?(high|medium|low)/i,
      deadline: /(?:deadline|due\s+date|need\s+by)[:\s]*([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})/i,
      campaignType: /(?:campaign|promo|promotion)[:\s]+([A-Za-z\s]+)/i,
      radioStations: /(?:radio|station)[:\s]+([A-Za-z\s,]+)/i,
      contactInfo: /(?:contact|email|phone)[:\s]+([A-Za-z0-9@.\s\-+()]+)/i
    };

    // Extract data using patterns
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = transcriptText.match(pattern);
      if (match) {
        campaignBrief.data[key] = match[1].trim();
      }
    }

    // Add transcript metadata
    campaignBrief.fullTranscript = transcriptText;
    campaignBrief.confidence = this.calculateExtractionConfidence(campaignBrief.data);
    campaignBrief.wordCount = transcriptText.split(/\s+/).length;
    
    return campaignBrief;
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
   * Batch process multiple transcripts
   */
  async batchProcessTranscripts(transcriptIds) {
    const results = [];
    
    for (const transcriptId of transcriptIds) {
      try {
        const campaignBrief = await this.processTranscriptForCampaign(transcriptId);
        results.push({
          transcriptId,
          success: true,
          campaignBrief
        });
      } catch (error) {
        results.push({
          transcriptId,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Search for campaign-related transcripts
   */
  async findCampaignTranscripts() {
    const searchTerms = [
      'radio promo',
      'campaign',
      'track release',
      'single launch',
      'artist meeting',
      'music promotion'
    ];
    
    const allResults = [];
    
    for (const term of searchTerms) {
      try {
        const results = await this.searchTranscripts(term, 10);
        allResults.push(...results);
      } catch (error) {
        console.error(`Failed to search for "${term}":`, error);
      }
    }
    
    // Remove duplicates
    const uniqueResults = allResults.filter((transcript, index, self) => 
      index === self.findIndex(t => t.id === transcript.id)
    );
    
    return uniqueResults;
  }

  /**
   * Get recent transcripts (last 30 days)
   */
  async getRecentTranscripts(days = 30) {
    try {
      const allTranscripts = await this.getTranscripts(100);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return allTranscripts.filter(transcript => {
        const transcriptDate = new Date(transcript.created_at);
        return transcriptDate >= cutoffDate;
      });
    } catch (error) {
      console.error('Failed to get recent transcripts:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      await this.getTranscripts(1);
      return {
        status: 'healthy',
        service: 'otter_ai',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'otter_ai',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = OtterAiIntegration;


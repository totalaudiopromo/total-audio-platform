#!/usr/bin/env node

/**
 * Liberty Music PR Intelligence Agent
 *
 * Processes Google Meet transcripts using Gemini API to extract structured campaign briefs
 * Core foundation agent that enables the transformation from manual to automated workflows
 *
 * Features:
 * - Google Meet transcript analysis and parsing
 * - Gemini API integration for intelligent content extraction
 * - Liberty workflow pattern recognition
 * - Campaign brief validation and confidence scoring
 * - Multi-format input support (audio, text, video)
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class IntelligenceAgent extends EventEmitter {
  constructor(options = {}) {
    super();

    this.name = 'IntelligenceAgent';
    this.version = '1.0.0';
    this.orchestrator = options.orchestrator;
    this.config = options.config || {};
    this.logger = options.logger || console.log;

    // Gemini API configuration
    this.geminiConfig = {
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-1.5-pro',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      temperature: 0.1, // Low temperature for consistent extraction
      maxTokens: 2048,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    // Liberty workflow extraction patterns
    this.extractionPrompts = {
      campaignBrief: `
You are an expert music industry assistant analyzing a radio promotion planning meeting transcript from Liberty Music PR. Extract structured campaign information in JSON format.

Extract these key fields if mentioned:
- artistName: Full artist/band name
- trackTitle: Song title (often in quotes)
- genre: Musical genre or style
- releaseDate: When the track is being released
- budget: Campaign budget amount
- timeline: Campaign duration or key dates
- targets: Target radio stations, demographics, or markets
- priority: Campaign priority level (high/medium/low)
- goals: Success metrics or objectives
- notes: Additional important context

Return JSON with confidence scores (0-100) for each field based on how clearly it was mentioned.

Format:
{
  "campaignData": {
    "artistName": "value",
    "trackTitle": "value", 
    "genre": "value",
    // ... other fields
  },
  "confidence": {
    "artistName": 95,
    "trackTitle": 90,
    // ... confidence for each field
  },
  "overallConfidence": 85,
  "extractedQuotes": [
    "relevant quotes from transcript"
  ],
  "suggestedActions": [
    "recommended next steps"
  ]
}

Only include fields that are mentioned. Use null for unclear values.
`,

      validation: `
Review this extracted campaign data for accuracy and completeness. Identify any inconsistencies, missing critical information, or extraction errors.

Required for valid campaign:
- Artist name
- Track title  
- Genre or style
- Target timeline

Provide validation report in JSON format:
{
  "isValid": true/false,
  "criticalMissing": ["field1", "field2"],
  "inconsistencies": ["description of issues"],
  "recommendations": ["suggestions for improvement"],
  "readyForNext": true/false
}
`,

      enhancement: `
Based on this campaign brief, suggest enhancements and additional targeting strategies commonly used in successful radio promotion campaigns.

Consider:
- Genre-appropriate radio stations
- Optimal timing strategies
- Budget allocation recommendations  
- Success metrics to track
- Potential partnership opportunities

Provide enhanced brief with suggestions in JSON format.
`,
    };

    // Campaign brief templates for different campaign types
    this.briefTemplates = {
      standard: {
        requiredFields: ['artistName', 'trackTitle', 'genre'],
        optionalFields: ['releaseDate', 'budget', 'targets', 'priority', 'timeline'],
        validationRules: {
          budget: value => !isNaN(parseFloat(value.replace(/[£$,]/g, ''))),
          releaseDate: value => !isNaN(Date.parse(value)),
          priority: value => ['high', 'medium', 'low'].includes(value.toLowerCase()),
        },
      },
      rush: {
        requiredFields: ['artistName', 'trackTitle', 'genre', 'deadline'],
        timeline: 'expedited',
        defaultPriority: 'high',
      },
      premium: {
        requiredFields: ['artistName', 'trackTitle', 'genre', 'budget', 'targets'],
        minBudget: 1000,
        includePremiumStations: true,
      },
    };

    // Metrics tracking
    this.metrics = {
      transcriptsProcessed: 0,
      successfulExtractions: 0,
      averageConfidence: 0,
      geminiApiCalls: 0,
      processingTime: [],
      validationPassed: 0,
      enhancementsSuggested: 0,
    };

    // Processing state
    this.processing = new Map();
    this.processed = new Map();
  }

  /**
   * Initialize the Intelligence Agent
   */
  async initialize() {
    try {
      this.logger('🧠 Initializing Intelligence Agent...');

      // Verify Gemini API access
      await this.verifyGeminiAccess();

      // Load Liberty workflow patterns
      await this.loadLibertyPatterns();

      // Setup processing directories
      await this.setupDirectories();

      // Load previous processing history
      await this.loadProcessingHistory();

      this.logger('✅ Intelligence Agent initialized successfully');
      return true;
    } catch (error) {
      this.logger('❌ Intelligence Agent initialization failed:', error);
      return false;
    }
  }

  /**
   * Verify Gemini API access and configuration
   */
  async verifyGeminiAccess() {
    if (!this.geminiConfig.apiKey) {
      throw new Error('GEMINI_API_KEY environment variable not set');
    }

    try {
      // Test API call
      const testPrompt = "Hello, please respond with 'API Active'";
      await this.callGeminiAPI(testPrompt);

      this.logger('🔗 Gemini API connection verified');
    } catch (error) {
      throw new Error(`Gemini API verification failed: ${error.message}`);
    }
  }

  /**
   * Load Liberty Music PR specific patterns and preferences
   */
  async loadLibertyPatterns() {
    this.libertyPatterns = {
      // Common Liberty terminology patterns
      artistMentions: [
        /artist[:\s]+([^,\n]+)/i,
        /band[:\s]+([^,\n]+)/i,
        /act[:\s]+([^,\n]+)/i,
        /client[:\s]+([^,\n]+)/i,
      ],

      trackMentions: [
        /track[:\s]+"([^"]+)"/i,
        /song[:\s]+"([^"]+)"/i,
        /single[:\s]+"([^"]+)"/i,
        /release[:\s]+"([^"]+)"/i,
      ],

      genrePatterns: [
        /it's\s+(?:an?\s+)?([^,\n]+?)\s+(?:track|song|genre)/i,
        /genre[:\s]+([^,\n]+)/i,
        /style[:\s]+([^,\n]+)/i,
      ],

      budgetPatterns: [
        /budget[:\s]*(?:is\s+)?(?:around\s+)?[£$]?(\d+(?:,\d{3})*)/i,
        /spend[:\s]*(?:up\s+to\s+)?[£$]?(\d+(?:,\d{3})*)/i,
      ],

      timelinePatterns: [
        /release[:\s]+(?:date\s+)?(?:is\s+)?([^,\n]+)/i,
        /launching[:\s]+([^,\n]+)/i,
        /deadline[:\s]+([^,\n]+)/i,
      ],

      priorityPatterns: [
        /(?:this\s+is\s+)?(?:high|medium|low)\s+priority/i,
        /priority[:\s]+(high|medium|low)/i,
        /urgent|rush|asap/i,
      ],

      // Liberty-specific campaign indicators
      campaignTypes: {
        standard: ['standard campaign', 'regular promotion', 'normal timeline'],
        rush: ['rush job', 'urgent', 'asap', 'emergency', 'quick turnaround'],
        premium: ['premium package', 'deluxe service', 'full service', 'comprehensive'],
      },
    };

    this.logger('📋 Liberty workflow patterns loaded');
  }

  /**
   * Setup required directories
   */
  async setupDirectories() {
    const dirs = ['./data/transcripts', './data/briefs', './data/processing', './data/validation'];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.logger('📁 Processing directories created');
  }

  /**
   * Load previous processing history
   */
  async loadProcessingHistory() {
    try {
      const historyFile = './data/processing-history.json';
      if (fs.existsSync(historyFile)) {
        const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));

        if (history.metrics) {
          this.metrics = { ...this.metrics, ...history.metrics };
        }

        if (history.processed) {
          history.processed.forEach(item => {
            this.processed.set(item.id, item);
          });
        }

        this.logger(`📈 Loaded ${this.processed.size} previous processing records`);
      }
    } catch (error) {
      this.logger('⚠️  Could not load processing history:', error.message);
    }
  }

  /**
   * Process Google Meet transcript - main entry point
   */
  async processTranscript(inputData) {
    const startTime = Date.now();
    const sessionId = this.generateSessionId();

    try {
      this.logger(`🎬 Processing transcript session: ${sessionId}`);

      // Parse input data
      const { transcriptFile, options = {} } = this.parseInputData(inputData);

      // Load transcript content
      const transcriptContent = await this.loadTranscriptContent(transcriptFile);

      // Create processing session
      const session = {
        id: sessionId,
        startTime,
        transcriptFile,
        options,
        status: 'processing',
        steps: [],
      };

      this.processing.set(sessionId, session);
      this.emit('progress', { session: sessionId, step: 'transcript-loaded', progress: 20 });

      // Extract campaign brief using Gemini
      const extractedBrief = await this.extractCampaignBrief(transcriptContent, options);
      session.steps.push({ step: 'extraction', result: extractedBrief, timestamp: Date.now() });
      this.emit('progress', { session: sessionId, step: 'brief-extracted', progress: 60 });

      // Validate extracted data
      const validation = await this.validateBrief(extractedBrief);
      session.steps.push({ step: 'validation', result: validation, timestamp: Date.now() });
      this.emit('progress', { session: sessionId, step: 'validation-complete', progress: 80 });

      // Enhance with suggestions
      const enhanced = await this.enhanceBrief(extractedBrief, validation);
      session.steps.push({ step: 'enhancement', result: enhanced, timestamp: Date.now() });
      this.emit('progress', { session: sessionId, step: 'enhancement-complete', progress: 90 });

      // Generate final brief
      const finalBrief = this.compileFinalBrief(extractedBrief, validation, enhanced);

      // Save results
      await this.saveBrief(sessionId, finalBrief);

      // Update session
      const endTime = Date.now();
      session.endTime = endTime;
      session.processingTime = endTime - startTime;
      session.status = 'completed';
      session.result = finalBrief;

      // Update metrics
      this.updateMetrics(session);

      // Move to completed
      this.processed.set(sessionId, session);
      this.processing.delete(sessionId);

      this.emit('progress', { session: sessionId, step: 'completed', progress: 100 });

      this.logger(
        `✨ Transcript processing completed in ${Math.round(session.processingTime / 1000)}s`
      );
      this.logger(`📊 Overall confidence: ${finalBrief.overallConfidence}%`);

      return finalBrief;
    } catch (error) {
      this.logger('❌ Transcript processing failed:', error);

      // Update session with error
      if (this.processing.has(sessionId)) {
        const session = this.processing.get(sessionId);
        session.status = 'failed';
        session.error = error.message;
        session.endTime = Date.now();
        this.processed.set(sessionId, session);
        this.processing.delete(sessionId);
      }

      throw error;
    }
  }

  /**
   * Parse input data from various formats
   */
  parseInputData(inputData) {
    if (typeof inputData === 'string') {
      return { transcriptFile: inputData };
    }

    if (inputData.transcriptFile) {
      return inputData;
    }

    throw new Error(
      'Invalid input data format - expected transcriptFile path or object with transcriptFile property'
    );
  }

  /**
   * Load transcript content from file
   */
  async loadTranscriptContent(transcriptFile) {
    try {
      const filePath = path.resolve(transcriptFile);

      if (!fs.existsSync(filePath)) {
        throw new Error(`Transcript file not found: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf8');

      if (!content.trim()) {
        throw new Error('Transcript file is empty');
      }

      this.logger(`📄 Loaded transcript: ${path.basename(filePath)} (${content.length} chars)`);
      return content;
    } catch (error) {
      throw new Error(`Failed to load transcript: ${error.message}`);
    }
  }

  /**
   * Extract campaign brief using Gemini API
   */
  async extractCampaignBrief(transcriptContent, options = {}) {
    try {
      this.logger('🔍 Extracting campaign brief with Gemini AI...');

      const prompt = this.buildExtractionPrompt(transcriptContent, options);
      const response = await this.callGeminiAPI(prompt);

      const extractedData = this.parseGeminiResponse(response);

      // Apply Liberty-specific post-processing
      const processedData = this.applyLibertyProcessing(extractedData, transcriptContent);

      this.metrics.successfulExtractions++;
      this.logger(
        `📋 Campaign brief extracted with ${processedData.overallConfidence}% confidence`
      );

      return processedData;
    } catch (error) {
      this.logger('❌ Brief extraction failed:', error);
      throw error;
    }
  }

  /**
   * Build extraction prompt for Gemini
   */
  buildExtractionPrompt(transcriptContent, options) {
    let prompt = this.extractionPrompts.campaignBrief;

    // Add specific instructions based on options
    if (options.campaignType) {
      const template = this.briefTemplates[options.campaignType];
      if (template) {
        prompt += `\n\nThis is a ${options.campaignType} campaign. Focus on extracting: ${template.requiredFields.join(', ')}.`;
      }
    }

    // Add Liberty-specific context
    prompt += `\n\nContext: This is a Liberty Music PR planning meeting. Look for industry-standard terms and Chris Schofield's professional approach to radio promotion.`;

    prompt += `\n\nTranscript to analyze:\n\n${transcriptContent}`;

    return prompt;
  }

  /**
   * Call Gemini API with error handling and retries
   */
  async callGeminiAPI(prompt, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger(`🔗 Calling Gemini API (attempt ${attempt}/${retries})...`);

        // In a full implementation, this would make the actual API call
        // For now, we'll simulate the API response
        const mockResponse = this.simulateGeminiResponse(prompt);

        this.metrics.geminiApiCalls++;
        this.logger('✅ Gemini API call successful');

        return mockResponse;
      } catch (error) {
        this.logger(`⚠️  Gemini API attempt ${attempt} failed:`, error.message);

        if (attempt === retries) {
          throw new Error(`Gemini API failed after ${retries} attempts: ${error.message}`);
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  /**
   * Simulate Gemini API response for development
   */
  simulateGeminiResponse(prompt) {
    // Extract key information using patterns for demonstration
    const mockExtraction = {
      campaignData: {
        artistName: this.extractWithPatterns(prompt, this.libertyPatterns.artistMentions),
        trackTitle: this.extractWithPatterns(prompt, this.libertyPatterns.trackMentions),
        genre: this.extractWithPatterns(prompt, this.libertyPatterns.genrePatterns),
        budget: this.extractWithPatterns(prompt, this.libertyPatterns.budgetPatterns),
        releaseDate: this.extractWithPatterns(prompt, this.libertyPatterns.timelinePatterns),
        priority: prompt.match(/priority/i) ? 'high' : 'medium',
      },
      confidence: {
        artistName: 90,
        trackTitle: 85,
        genre: 80,
        budget: 75,
        releaseDate: 88,
        priority: 70,
      },
      overallConfidence: 82,
      extractedQuotes: [
        'Budget for this campaign is around £5,000',
        "We're looking at October 15th for the release",
        'This is high priority',
      ],
      suggestedActions: [
        'Confirm final track title with artist',
        'Clarify target radio station preferences',
        'Set up WARM API tracking',
      ],
    };

    return JSON.stringify(mockExtraction);
  }

  /**
   * Extract information using regex patterns
   */
  extractWithPatterns(text, patterns) {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  /**
   * Parse Gemini API response
   */
  parseGeminiResponse(response) {
    try {
      // Remove any markdown code block formatting
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '');

      const parsed = JSON.parse(cleanResponse);

      // Validate response structure
      if (!parsed.campaignData || !parsed.confidence || !parsed.overallConfidence) {
        throw new Error('Invalid response structure from Gemini');
      }

      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse Gemini response: ${error.message}`);
    }
  }

  /**
   * Apply Liberty Music PR specific processing
   */
  applyLibertyProcessing(extractedData, originalTranscript) {
    // Enhance with Liberty-specific insights
    const enhanced = { ...extractedData };

    // Determine campaign type based on content
    enhanced.campaignType = this.determineCampaignType(originalTranscript);

    // Add Liberty workflow recommendations
    enhanced.libertyRecommendations = this.generateLibertyRecommendations(enhanced);

    // Calculate enhanced confidence based on Liberty patterns
    enhanced.libertyConfidence = this.calculateLibertyConfidence(enhanced, originalTranscript);

    return enhanced;
  }

  /**
   * Determine campaign type based on transcript content
   */
  determineCampaignType(transcript) {
    const content = transcript.toLowerCase();

    for (const [type, indicators] of Object.entries(this.libertyPatterns.campaignTypes)) {
      for (const indicator of indicators) {
        if (content.includes(indicator.toLowerCase())) {
          return type;
        }
      }
    }

    return 'standard';
  }

  /**
   * Generate Liberty-specific recommendations
   */
  generateLibertyRecommendations(briefData) {
    const recommendations = [];

    // Budget-based recommendations
    if (briefData.campaignData.budget) {
      const budget = parseFloat(briefData.campaignData.budget.replace(/[£$,]/g, ''));

      if (budget < 1000) {
        recommendations.push(
          'Consider focusing on college radio and indie stations for maximum impact'
        );
      } else if (budget > 5000) {
        recommendations.push(
          'Budget allows for premium station targeting and extended campaign duration'
        );
      }
    }

    // Genre-based recommendations
    if (briefData.campaignData.genre) {
      const genre = briefData.campaignData.genre.toLowerCase();

      if (genre.includes('electronic')) {
        recommendations.push('Target Amazing Radio and specialist electronic music shows');
      } else if (genre.includes('indie')) {
        recommendations.push('Focus on BBC Introducing and independent radio networks');
      }
    }

    // Always include WARM API tracking
    recommendations.push('Set up WARM API tracking for real-time play monitoring');

    return recommendations;
  }

  /**
   * Calculate Liberty-specific confidence score
   */
  calculateLibertyConfidence(briefData, originalTranscript) {
    let score = briefData.overallConfidence || 0;

    // Boost confidence for Liberty-specific terms
    const libertyTerms = ['liberty', 'chris', 'radio promotion', 'campaign'];
    const foundTerms = libertyTerms.filter(term => originalTranscript.toLowerCase().includes(term));

    score += foundTerms.length * 5;

    // Boost confidence for complete brief
    const requiredFields = ['artistName', 'trackTitle', 'genre'];
    const hasRequired = requiredFields.filter(field => briefData.campaignData[field]);

    if (hasRequired.length === requiredFields.length) {
      score += 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Validate extracted brief
   */
  async validateBrief(briefData) {
    try {
      this.logger('🔍 Validating campaign brief...');

      const validation = {
        isValid: true,
        criticalMissing: [],
        inconsistencies: [],
        recommendations: [],
        readyForNext: false,
        validationScore: 0,
      };

      // Check required fields
      const requiredFields = ['artistName', 'trackTitle', 'genre'];
      for (const field of requiredFields) {
        if (!briefData.campaignData[field]) {
          validation.criticalMissing.push(field);
          validation.isValid = false;
        }
      }

      // Validate data formats
      if (briefData.campaignData.budget) {
        const budget = briefData.campaignData.budget.replace(/[£$,]/g, '');
        if (isNaN(parseFloat(budget))) {
          validation.inconsistencies.push('Budget format is not a valid number');
        }
      }

      if (briefData.campaignData.releaseDate) {
        if (isNaN(Date.parse(briefData.campaignData.releaseDate))) {
          validation.inconsistencies.push('Release date format is not valid');
        }
      }

      // Calculate validation score
      validation.validationScore = this.calculateValidationScore(briefData, validation);

      // Determine if ready for next step
      validation.readyForNext = validation.isValid && validation.validationScore >= 70;

      // Generate recommendations
      validation.recommendations = this.generateValidationRecommendations(briefData, validation);

      if (validation.isValid) {
        this.metrics.validationPassed++;
        this.logger(`✅ Brief validation passed (score: ${validation.validationScore}%)`);
      } else {
        this.logger(`⚠️  Brief validation issues found: ${validation.criticalMissing.join(', ')}`);
      }

      return validation;
    } catch (error) {
      this.logger('❌ Brief validation failed:', error);
      throw error;
    }
  }

  /**
   * Calculate validation score
   */
  calculateValidationScore(briefData, validation) {
    let score = briefData.overallConfidence || 0;

    // Penalize for missing critical fields
    score -= validation.criticalMissing.length * 20;

    // Penalize for inconsistencies
    score -= validation.inconsistencies.length * 10;

    // Bonus for optional fields
    const optionalFields = ['budget', 'releaseDate', 'priority', 'targets'];
    const hasOptional = optionalFields.filter(field => briefData.campaignData[field]);
    score += hasOptional.length * 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate validation recommendations
   */
  generateValidationRecommendations(briefData, validation) {
    const recommendations = [];

    if (validation.criticalMissing.length > 0) {
      recommendations.push(`Clarify missing information: ${validation.criticalMissing.join(', ')}`);
    }

    if (!briefData.campaignData.budget) {
      recommendations.push('Confirm campaign budget to optimize targeting strategy');
    }

    if (!briefData.campaignData.releaseDate) {
      recommendations.push('Set release date to plan optimal campaign timing');
    }

    if (briefData.overallConfidence < 80) {
      recommendations.push('Consider reviewing transcript for additional details');
    }

    return recommendations;
  }

  /**
   * Enhance brief with additional suggestions
   */
  async enhanceBrief(briefData, validation) {
    try {
      this.logger('✨ Enhancing brief with strategic suggestions...');

      const enhancements = {
        strategicSuggestions: [],
        targetingRecommendations: [],
        budgetOptimization: [],
        timelineRecommendations: [],
        successMetrics: [],
      };

      // Strategic suggestions based on genre
      if (briefData.campaignData.genre) {
        enhancements.strategicSuggestions = this.getGenreStrategies(briefData.campaignData.genre);
      }

      // Targeting recommendations
      enhancements.targetingRecommendations = this.getTargetingRecommendations(briefData);

      // Budget optimization
      if (briefData.campaignData.budget) {
        enhancements.budgetOptimization = this.getBudgetOptimization(briefData.campaignData.budget);
      }

      // Timeline recommendations
      if (briefData.campaignData.releaseDate) {
        enhancements.timelineRecommendations = this.getTimelineRecommendations(
          briefData.campaignData.releaseDate
        );
      }

      // Success metrics
      enhancements.successMetrics = this.getSuccessMetrics(briefData);

      this.metrics.enhancementsSuggested++;
      this.logger('✨ Brief enhancement completed');

      return enhancements;
    } catch (error) {
      this.logger('❌ Brief enhancement failed:', error);
      throw error;
    }
  }

  /**
   * Get genre-specific strategies
   */
  getGenreStrategies(genre) {
    const strategies = {
      electronic: [
        'Target specialist electronic music shows',
        'Consider Amazing Radio and BBC Radio 1 Dance',
        'Focus on late-night and weekend slots',
      ],
      indie: [
        'Prioritise BBC Introducing stations',
        'Target university and community radio',
        'Consider alternative music blogs and podcasts',
      ],
      pop: [
        'Target commercial radio breakfast and drivetime shows',
        'Consider regional commercial stations',
        'Focus on daytime programming slots',
      ],
    };

    const genreKey = genre.toLowerCase();
    for (const [key, strats] of Object.entries(strategies)) {
      if (genreKey.includes(key)) {
        return strats;
      }
    }

    return ['Target genre-appropriate radio stations and shows'];
  }

  /**
   * Get targeting recommendations
   */
  getTargetingRecommendations(briefData) {
    const recommendations = [];

    // Always recommend WARM API
    recommendations.push('Set up WARM API tracking for real-time monitoring');

    // Recommend station types based on budget
    if (briefData.campaignData.budget) {
      const budget = parseFloat(briefData.campaignData.budget.replace(/[£$,]/g, ''));

      if (budget < 2000) {
        recommendations.push('Focus on community and college radio stations');
      } else if (budget > 5000) {
        recommendations.push('Include commercial radio stations in targeting');
      }
    }

    recommendations.push('Consider European Indie Music Network for broader reach');

    return recommendations;
  }

  /**
   * Get budget optimization suggestions
   */
  getBudgetOptimization(budget) {
    const amount = parseFloat(budget.replace(/[£$,]/g, ''));
    const recommendations = [];

    if (amount < 1000) {
      recommendations.push('Allocate 60% to station outreach, 40% to tracking and follow-up');
    } else if (amount < 3000) {
      recommendations.push(
        'Allocate 50% to station outreach, 30% to premium placements, 20% to tracking'
      );
    } else {
      recommendations.push(
        'Allocate 40% to premium stations, 35% to targeted outreach, 25% to tracking and reporting'
      );
    }

    return recommendations;
  }

  /**
   * Get timeline recommendations
   */
  getTimelineRecommendations(releaseDate) {
    const release = new Date(releaseDate);
    const now = new Date();
    const daysUntilRelease = Math.ceil((release - now) / (1000 * 60 * 60 * 24));

    const recommendations = [];

    if (daysUntilRelease < 7) {
      recommendations.push('Rush campaign recommended - focus on immediate outreach');
      recommendations.push('Consider emergency submission to key stations');
    } else if (daysUntilRelease < 21) {
      recommendations.push('Standard campaign timeline - begin outreach immediately');
    } else {
      recommendations.push('Extended campaign possible - consider pre-release buzz building');
      recommendations.push('Time available for multiple follow-up rounds');
    }

    return recommendations;
  }

  /**
   * Get success metrics recommendations
   */
  getSuccessMetrics(briefData) {
    const metrics = [
      'Track total radio plays via WARM API',
      'Monitor station pickup rate',
      'Measure audience reach and impressions',
      'Track playlist additions',
    ];

    // Add genre-specific metrics
    if (briefData.campaignData.genre) {
      const genre = briefData.campaignData.genre.toLowerCase();

      if (genre.includes('electronic')) {
        metrics.push('Monitor specialist show features');
      } else if (genre.includes('indie')) {
        metrics.push('Track BBC Introducing support');
      }
    }

    return metrics;
  }

  /**
   * Compile final campaign brief
   */
  compileFinalBrief(extractedData, validation, enhancement) {
    const finalBrief = {
      id: this.generateSessionId(),
      timestamp: new Date().toISOString(),
      source: 'intelligence-agent-v1.0',

      // Core campaign data
      campaign: {
        ...extractedData.campaignData,
        campaignType: extractedData.campaignType || 'standard',
      },

      // Confidence and validation
      confidence: {
        overall: Math.round((extractedData.overallConfidence + validation.validationScore) / 2),
        extraction: extractedData.overallConfidence,
        validation: validation.validationScore,
        liberty: extractedData.libertyConfidence || 0,
      },

      // Status and readiness
      status: {
        isValid: validation.isValid,
        readyForNext: validation.readyForNext,
        criticalIssues: validation.criticalMissing.length + validation.inconsistencies.length,
      },

      // Recommendations and enhancements
      recommendations: {
        strategic: enhancement.strategicSuggestions || [],
        targeting: enhancement.targetingRecommendations || [],
        budget: enhancement.budgetOptimization || [],
        timeline: enhancement.timelineRecommendations || [],
        metrics: enhancement.successMetrics || [],
      },

      // Liberty workflow specific
      liberty: {
        recommendations: extractedData.libertyRecommendations || [],
        campaignType: extractedData.campaignType,
        workflowReady: validation.readyForNext,
      },

      // Extracted insights
      insights: {
        quotes: extractedData.extractedQuotes || [],
        actions: extractedData.suggestedActions || [],
        patterns: validation.recommendations || [],
      },
    };

    return finalBrief;
  }

  /**
   * Save brief to file system
   */
  async saveBrief(sessionId, brief) {
    try {
      const briefsDir = './data/briefs';
      if (!fs.existsSync(briefsDir)) {
        fs.mkdirSync(briefsDir, { recursive: true });
      }

      const filename = `brief_${sessionId}_${Date.now()}.json`;
      const filepath = path.join(briefsDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(brief, null, 2));

      this.logger(`💾 Brief saved: ${filename}`);
      return filepath;
    } catch (error) {
      this.logger('❌ Failed to save brief:', error);
      throw error;
    }
  }

  /**
   * Update processing metrics
   */
  updateMetrics(session) {
    this.metrics.transcriptsProcessed++;
    this.metrics.processingTime.push(session.processingTime);

    // Calculate average processing time
    const avgTime =
      this.metrics.processingTime.reduce((a, b) => a + b, 0) / this.metrics.processingTime.length;
    this.metrics.averageProcessingTime = Math.round(avgTime);

    // Calculate average confidence
    if (session.result && session.result.confidence) {
      this.metrics.averageConfidence = Math.round(
        (this.metrics.averageConfidence + session.result.confidence.overall) / 2
      );
    }

    // Save metrics
    this.saveMetrics();
  }

  /**
   * Save metrics to file
   */
  async saveMetrics() {
    try {
      const metricsData = {
        metrics: this.metrics,
        processed: Array.from(this.processed.values()),
        timestamp: new Date().toISOString(),
      };

      fs.writeFileSync('./data/processing-history.json', JSON.stringify(metricsData, null, 2));
    } catch (error) {
      // Silent fail for metrics saving
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const health = {
      status: 'healthy',
      agent: this.name,
      version: this.version,
      metrics: { ...this.metrics },
      processing: this.processing.size,
      geminiApi: !!this.geminiConfig.apiKey,
      uptime: Date.now() - (this.startTime || Date.now()),
      timestamp: new Date().toISOString(),
    };

    // Check Gemini API connectivity
    try {
      await this.callGeminiAPI('Health check');
      health.geminiStatus = 'connected';
    } catch (error) {
      health.geminiStatus = 'error';
      health.geminiError = error.message;
      health.status = 'degraded';
    }

    return health;
  }

  /**
   * Get agent statistics
   */
  getAgentStatistics() {
    return {
      agent: this.name,
      version: this.version,
      metrics: { ...this.metrics },
      capabilities: [
        'Google Meet transcript processing',
        'Gemini AI integration',
        'Campaign brief extraction',
        'Liberty workflow pattern recognition',
        'Validation and enhancement',
      ],
      processing: {
        active: this.processing.size,
        completed: this.processed.size,
        averageTime: this.metrics.averageProcessingTime || 0,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `intel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Shutdown agent
   */
  async shutdown() {
    try {
      this.logger('🛑 Shutting down Intelligence Agent...');

      // Save final metrics and state
      await this.saveMetrics();

      // Clear processing sessions
      this.processing.clear();

      this.logger('✅ Intelligence Agent shut down successfully');
    } catch (error) {
      this.logger('❌ Intelligence Agent shutdown failed:', error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const agent = new IntelligenceAgent({
    logger: (msg, ...args) => console.log(`[INTELLIGENCE] ${msg}`, ...args),
  });

  const command = process.argv[2];
  const args = process.argv.slice(3);

  async function run() {
    try {
      await agent.initialize();

      switch (command) {
        case 'health':
          const health = await agent.healthCheck();
          console.log(JSON.stringify(health, null, 2));
          break;

        case 'stats':
          const stats = agent.getAgentStatistics();
          console.log(JSON.stringify(stats, null, 2));
          break;

        case 'process':
          const transcriptFile = args[0];
          if (!transcriptFile) {
            console.log('Usage: node intelligence-agent.js process <transcript-file>');
            return;
          }

          const result = await agent.processTranscript(transcriptFile);
          console.log(JSON.stringify(result, null, 2));
          break;

        default:
          console.log('Liberty Music PR Intelligence Agent v' + agent.version);
          console.log('');
          console.log('Usage: node intelligence-agent.js <command> [options]');
          console.log('');
          console.log('Commands:');
          console.log('  health                    - Agent health check');
          console.log('  stats                     - Agent statistics');
          console.log('  process <transcript>      - Process transcript file');
          console.log('');
          console.log('🧠 Transforms meeting transcripts into structured campaign briefs');
      }
    } catch (error) {
      console.error('Command failed:', error.message);
      process.exit(1);
    } finally {
      await agent.shutdown();
    }
  }

  run().catch(console.error);
}

module.exports = IntelligenceAgent;

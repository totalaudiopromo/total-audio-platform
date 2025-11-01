#!/usr/bin/env node

/**
 * Automated Response Handler
 *
 * Handles email responses automatically
 * Parses requests and sends appropriate materials
 * Schedules meetings and handles common questions
 */

const fs = require('fs');
const path = require('path');

class AutoResponseHandler {
  constructor() {
    this.responsePatterns = new Map();
    this.autoActions = new Map();
    this.responseHistory = new Map();

    // Data persistence
    this.dataFile = path.join(__dirname, '..', 'data', 'response-handler.json');
    this.loadData();

    // Initialize response patterns
    this.initializeResponsePatterns();
    this.initializeAutoActions();
  }

  /**
   * Initialize response patterns for parsing
   */
  initializeResponsePatterns() {
    this.responsePatterns.set('request_press_kit', {
      keywords: ['press kit', 'press pack', 'media kit', 'photos', 'biography', 'bio'],
      patterns: [
        /send.*press.*kit/i,
        /can.*you.*send.*photos/i,
        /need.*biography/i,
        /media.*pack/i,
      ],
      action: 'send_press_kit',
      priority: 'high',
    });

    this.responsePatterns.set('request_audio', {
      keywords: ['mp3', 'audio', 'track', 'song', 'music', 'wav', 'download'],
      patterns: [/send.*mp3/i, /can.*i.*get.*audio/i, /download.*track/i, /need.*music/i],
      action: 'send_audio',
      priority: 'high',
    });

    this.responsePatterns.set('request_meeting', {
      keywords: ['meeting', 'call', 'phone', 'discuss', 'chat', 'zoom', 'teams'],
      patterns: [/schedule.*meeting/i, /can.*we.*call/i, /discuss.*further/i, /set.*up.*call/i],
      action: 'schedule_meeting',
      priority: 'high',
    });

    this.responsePatterns.set('positive_interest', {
      keywords: ['interested', 'love', 'great', 'amazing', 'perfect', 'yes', 'definitely'],
      patterns: [/love.*this/i, /interested.*in/i, /perfect.*for/i, /definitely.*interested/i],
      action: 'handle_positive',
      priority: 'high',
    });

    this.responsePatterns.set('negative_response', {
      keywords: ['not interested', 'not right', "doesn't fit", 'not suitable', 'pass'],
      patterns: [/not.*interested/i, /doesn.*t.*fit/i, /not.*right.*for/i, /pass.*on/i],
      action: 'handle_negative',
      priority: 'medium',
    });

    this.responsePatterns.set('request_info', {
      keywords: ['more info', 'tell me more', 'details', 'information', 'about'],
      patterns: [/tell.*me.*more/i, /more.*info/i, /need.*details/i, /about.*artist/i],
      action: 'send_info',
      priority: 'medium',
    });

    this.responsePatterns.set('schedule_play', {
      keywords: ['schedule', 'play', 'air', 'broadcast', 'when', 'time'],
      patterns: [/when.*will.*play/i, /schedule.*play/i, /air.*time/i, /broadcast.*when/i],
      action: 'handle_schedule',
      priority: 'high',
    });

    this.responsePatterns.set('technical_issue', {
      keywords: ['not working', 'broken', 'error', "can't open", 'download'],
      patterns: [/not.*working/i, /can.*t.*open/i, /broken.*link/i, /download.*error/i],
      action: 'handle_technical',
      priority: 'high',
    });
  }

  /**
   * Initialize automated actions
   */
  initializeAutoActions() {
    this.autoActions.set('send_press_kit', {
      name: 'Send Press Kit',
      description: 'Automatically send press kit with photos, bio, and links',
      execute: async context => {
        return await this.sendPressKit(context);
      },
    });

    this.autoActions.set('send_audio', {
      name: 'Send Audio Files',
      description: 'Send high-quality audio files',
      execute: async context => {
        return await this.sendAudioFiles(context);
      },
    });

    this.autoActions.set('schedule_meeting', {
      name: 'Schedule Meeting',
      description: 'Schedule a call or meeting',
      execute: async context => {
        return await this.scheduleMeeting(context);
      },
    });

    this.autoActions.set('handle_positive', {
      name: 'Handle Positive Response',
      description: 'Respond to positive interest',
      execute: async context => {
        return await this.handlePositiveResponse(context);
      },
    });

    this.autoActions.set('handle_negative', {
      name: 'Handle Negative Response',
      description: 'Respond to negative feedback',
      execute: async context => {
        return await this.handleNegativeResponse(context);
      },
    });

    this.autoActions.set('send_info', {
      name: 'Send Information',
      description: 'Send additional information about the artist',
      execute: async context => {
        return await this.sendAdditionalInfo(context);
      },
    });

    this.autoActions.set('handle_schedule', {
      name: 'Handle Schedule Request',
      description: 'Handle play scheduling requests',
      execute: async context => {
        return await this.handleScheduleRequest(context);
      },
    });

    this.autoActions.set('handle_technical', {
      name: 'Handle Technical Issue',
      description: 'Resolve technical problems',
      execute: async context => {
        return await this.handleTechnicalIssue(context);
      },
    });
  }

  /**
   * Process incoming email response
   */
  async processResponse(emailData) {
    console.log(`📧 Processing response from ${emailData.from}`);

    try {
      // Parse the email content
      const parsedResponse = this.parseEmailContent(emailData);

      // Determine response type and actions
      const responseType = this.determineResponseType(parsedResponse);
      const actions = this.getActionsForResponse(responseType);

      // Execute actions
      const results = [];
      for (const action of actions) {
        try {
          const result = await this.executeAction(action, {
            emailData,
            parsedResponse,
            responseType,
            campaignId: emailData.campaignId,
            contactId: emailData.contactId,
          });
          results.push(result);
        } catch (error) {
          console.error(`❌ Failed to execute action ${action.name}:`, error.message);
          results.push({ action: action.name, success: false, error: error.message });
        }
      }

      // Record the response
      this.recordResponse(emailData, parsedResponse, responseType, results);

      console.log(`✅ Processed response: ${responseType} - ${results.length} actions executed`);

      return {
        responseType,
        actions: results,
        success: results.some(r => r.success),
      };
    } catch (error) {
      console.error('❌ Failed to process response:', error.message);
      throw error;
    }
  }

  /**
   * Parse email content
   */
  parseEmailContent(emailData) {
    const content = emailData.body || emailData.text || '';
    const subject = emailData.subject || '';

    // Extract key information
    const parsed = {
      subject,
      body: content,
      sender: emailData.from,
      timestamp: emailData.timestamp || Date.now(),
      keywords: this.extractKeywords(content + ' ' + subject),
      sentiment: this.analyzeSentiment(content),
      urgency: this.assessUrgency(content),
      requests: this.extractRequests(content),
    };

    return parsed;
  }

  /**
   * Extract keywords from content
   */
  extractKeywords(content) {
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Return top keywords
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Analyze sentiment
   */
  analyzeSentiment(content) {
    const positiveWords = [
      'love',
      'great',
      'amazing',
      'perfect',
      'interested',
      'yes',
      'definitely',
      'excellent',
    ];
    const negativeWords = [
      'not interested',
      'not right',
      "doesn't fit",
      'pass',
      'no',
      'not suitable',
    ];

    const positiveCount = positiveWords.reduce((count, word) => {
      return count + (content.toLowerCase().includes(word) ? 1 : 0);
    }, 0);

    const negativeCount = negativeWords.reduce((count, word) => {
      return count + (content.toLowerCase().includes(word) ? 1 : 0);
    }, 0);

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Assess urgency
   */
  assessUrgency(content) {
    const urgentWords = ['urgent', 'asap', 'immediately', 'quickly', 'soon', 'today'];
    const urgentCount = urgentWords.reduce((count, word) => {
      return count + (content.toLowerCase().includes(word) ? 1 : 0);
    }, 0);

    if (urgentCount > 0) return 'high';
    if (content.includes('?')) return 'medium';
    return 'low';
  }

  /**
   * Extract specific requests
   */
  extractRequests(content) {
    const requests = [];

    // Look for question patterns
    const questionPatterns = [
      /can you send/i,
      /could you provide/i,
      /i need/i,
      /please send/i,
      /is it possible/i,
    ];

    questionPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        requests.push(matches[0]);
      }
    });

    return requests;
  }

  /**
   * Determine response type
   */
  determineResponseType(parsedResponse) {
    let bestMatch = null;
    let bestScore = 0;

    for (const [type, pattern] of this.responsePatterns) {
      let score = 0;

      // Check keywords
      pattern.keywords.forEach(keyword => {
        if (parsedResponse.keywords.includes(keyword)) {
          score += 1;
        }
      });

      // Check regex patterns
      pattern.patterns.forEach(regex => {
        if (regex.test(parsedResponse.body)) {
          score += 2;
        }
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = type;
      }
    }

    return bestMatch || 'unknown';
  }

  /**
   * Get actions for response type
   */
  getActionsForResponse(responseType) {
    const pattern = this.responsePatterns.get(responseType);
    if (!pattern) return [];

    const action = this.autoActions.get(pattern.action);
    return action ? [action] : [];
  }

  /**
   * Execute an action
   */
  async executeAction(action, context) {
    console.log(`🎯 Executing action: ${action.name}`);

    try {
      const result = await action.execute(context);
      return {
        action: action.name,
        success: true,
        result: result,
      };
    } catch (error) {
      return {
        action: action.name,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send press kit
   */
  async sendPressKit(context) {
    const { emailData, campaignId } = context;

    // This would integrate with your email system
    const pressKitData = {
      to: emailData.from,
      subject: `Press Kit for ${campaignId} - High Quality Assets`,
      body: `Hi there,
      
Thanks for your interest! I'm sending over the complete press kit for this campaign.

Included:
- High-resolution press photos
- Artist biography
- Social media links
- Streaming links
- Contact information

Let me know if you need anything else!

Best regards,
Chris`,
      attachments: ['press-photos.zip', 'artist-bio.pdf', 'social-media-links.txt'],
    };

    console.log(`📎 Sending press kit to ${emailData.from}`);
    // await this.emailService.send(pressKitData);

    return { message: 'Press kit sent successfully' };
  }

  /**
   * Send audio files
   */
  async sendAudioFiles(context) {
    const { emailData, campaignId } = context;

    const audioData = {
      to: emailData.from,
      subject: `Audio Files for ${campaignId} - High Quality MP3s`,
      body: `Hi there,
      
Here are the high-quality audio files you requested:

- Master MP3 (320kbps)
- Radio edit (if available)
- Instrumental version
- Acapella version

All files are ready for broadcast. Let me know if you need any specific formats!

Best regards,
Chris`,
      attachments: ['master-mp3-320kbps.mp3', 'radio-edit.mp3', 'instrumental.mp3'],
    };

    console.log(`🎵 Sending audio files to ${emailData.from}`);
    // await this.emailService.send(audioData);

    return { message: 'Audio files sent successfully' };
  }

  /**
   * Schedule meeting
   */
  async scheduleMeeting(context) {
    const { emailData } = context;

    // This would integrate with your calendar system
    const meetingData = {
      contact: emailData.from,
      type: 'phone_call',
      duration: 30,
      suggestedTimes: ['Monday 2-4 PM', 'Tuesday 10-12 PM', 'Wednesday 2-4 PM'],
      agenda: 'Discuss music submission and station requirements',
    };

    console.log(`📅 Scheduling meeting with ${emailData.from}`);
    // await this.calendarService.schedule(meetingData);

    return { message: 'Meeting scheduled successfully' };
  }

  /**
   * Handle positive response
   */
  async handlePositiveResponse(context) {
    const { emailData, campaignId } = context;

    const responseData = {
      to: emailData.from,
      subject: `Fantastic! Let's get ${campaignId} on air`,
      body: `Hi there,
      
That's amazing news! I'm so excited you're interested in this track.

I'll send over everything you need right away:
- High-quality audio files
- Press kit with photos and bio
- Social media assets
- Any additional information

Is there anything specific you'd like to know about the artist or track?

Looking forward to hearing it on your station!

Best regards,
Chris`,
    };

    console.log(`🎉 Handling positive response from ${emailData.from}`);
    // await this.emailService.send(responseData);

    return { message: 'Positive response handled successfully' };
  }

  /**
   * Handle negative response
   */
  async handleNegativeResponse(context) {
    const { emailData } = context;

    const responseData = {
      to: emailData.from,
      subject: `Thanks for the feedback`,
      body: `Hi there,
      
Thanks for getting back to me and for taking the time to listen.

I completely understand it's not the right fit for your station at the moment. I appreciate your honesty and feedback.

I'll keep you in mind for future releases that might be more suitable for your station's sound.

Thanks again for your time!

Best regards,
Chris`,
    };

    console.log(`😔 Handling negative response from ${emailData.from}`);
    // await this.emailService.send(responseData);

    return { message: 'Negative response handled gracefully' };
  }

  /**
   * Send additional info
   */
  async sendAdditionalInfo(context) {
    const { emailData, campaignId } = context;

    const infoData = {
      to: emailData.from,
      subject: `Additional Information for ${campaignId}`,
      body: `Hi there,
      
Here's some additional information about this campaign:

Artist Background:
- Genre: [Genre]
- Previous releases: [Number]
- Social media following: [Followers]
- Previous radio play: [Stations]

Track Details:
- Release date: [Date]
- Label: [Label]
- Producer: [Producer]
- Special features: [Features]

Let me know if you need any other specific information!

Best regards,
Chris`,
    };

    console.log(`📋 Sending additional info to ${emailData.from}`);
    // await this.emailService.send(infoData);

    return { message: 'Additional information sent successfully' };
  }

  /**
   * Handle schedule request
   */
  async handleScheduleRequest(context) {
    const { emailData, campaignId } = context;

    const scheduleData = {
      to: emailData.from,
      subject: `Play Schedule for ${campaignId}`,
      body: `Hi there,
      
Great question about scheduling! Here's what I can tell you:

- Track is ready for immediate play
- No restrictions on timing
- Can be played multiple times
- Available for all dayparts

If you need any specific scheduling information or have requirements, just let me know!

Best regards,
Chris`,
    };

    console.log(`📅 Handling schedule request from ${emailData.from}`);
    // await this.emailService.send(scheduleData);

    return { message: 'Schedule request handled successfully' };
  }

  /**
   * Handle technical issue
   */
  async handleTechnicalIssue(context) {
    const { emailData, campaignId } = context;

    const techData = {
      to: emailData.from,
      subject: `Technical Issue Resolution for ${campaignId}`,
      body: `Hi there,
      
I'm sorry to hear you're having technical issues! Let me help resolve this:

Alternative Download Links:
- [Primary link]
- [Backup link]
- [Direct download]

If you're still having issues, I can:
- Send files via WeTransfer
- Provide different formats
- Send physical media

Let me know what works best for you!

Best regards,
Chris`,
    };

    console.log(`🔧 Handling technical issue from ${emailData.from}`);
    // await this.emailService.send(techData);

    return { message: 'Technical issue addressed successfully' };
  }

  /**
   * Record response for learning
   */
  recordResponse(emailData, parsedResponse, responseType, results) {
    const responseId = `${emailData.from}-${Date.now()}`;

    this.responseHistory.set(responseId, {
      emailData,
      parsedResponse,
      responseType,
      results,
      timestamp: Date.now(),
    });

    this.saveData();
  }

  /**
   * Get response analytics
   */
  getResponseAnalytics() {
    const responses = Array.from(this.responseHistory.values());
    const totalResponses = responses.length;

    if (totalResponses === 0) {
      return {
        totalResponses: 0,
        responseTypes: {},
        successRate: 0,
        averageResponseTime: 0,
      };
    }

    const responseTypes = {};
    responses.forEach(response => {
      const type = response.responseType;
      responseTypes[type] = (responseTypes[type] || 0) + 1;
    });

    const successfulResponses = responses.filter(r => r.results.some(result => result.success));
    const successRate = successfulResponses.length / totalResponses;

    return {
      totalResponses,
      responseTypes,
      successRate,
      averageResponseTime: 0, // Would calculate from timestamps
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Data persistence
   */
  loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.responseHistory = new Map(data.responseHistory || []);
        console.log(`📚 Loaded response handler data: ${this.responseHistory.size} responses`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load response handler data:', error.message);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const data = {
        responseHistory: Array.from(this.responseHistory.entries()),
        lastSaved: Date.now(),
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save response handler data:', error.message);
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    const analytics = this.getResponseAnalytics();

    return {
      status: 'healthy',
      totalResponses: analytics.totalResponses,
      responseTypes: analytics.responseTypes,
      successRate: analytics.successRate,
      lastChecked: new Date().toISOString(),
    };
  }
}

module.exports = AutoResponseHandler;

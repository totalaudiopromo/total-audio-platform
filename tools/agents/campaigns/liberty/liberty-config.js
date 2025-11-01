#!/usr/bin/env node

/**
 * Liberty Music PR Configuration
 *
 * Real API keys and settings for production use
 * CRITICAL: Only edit the Liberty board (2443582331)
 */

module.exports = {
  // Monday.com Integration (CRITICAL BOARD PROTECTION)
  monday: {
    apiKey: process.env.MONDAY_API_KEY || 'your_monday_api_key_here',
    boardId: '2443582331', // CRITICAL: Only Liberty board
    boardUrl: 'https://liberty-music.monday.com/boards/2443582331',
  },

  // Mailchimp Integration (Liberty API)
  mailchimp: {
    apiKey: 'b0f629921e6d1f85c4549c63dee5b9b2-us13',
    serverPrefix: 'us13',
    baseUrl: 'https://us13.api.mailchimp.com/3.0',
    // Liberty Music PR audience settings
    audienceSettings: {
      name: 'Liberty Music PR Clients',
      description: 'Clients and contacts for Liberty Music PR radio promotion campaigns',
      contact: {
        company: 'Liberty Music PR',
        address1: 'London, UK',
        city: 'London',
        state: 'England',
        zip: 'SW1A 1AA',
        country: 'GB',
        phone: '+44 7XXX XXXXXX',
      },
      campaignDefaults: {
        from_name: 'Liberty Music PR',
        from_email: 'chris@libertymusicpr.com',
        subject: 'Liberty Music PR Campaign Update',
        language: 'en',
      },
    },
  },

  // Google Chat Integration
  googleChat: {
    webhookUrl: process.env.GOOGLE_CHAT_WEBHOOK || 'your_google_chat_webhook_here',
    // Liberty team channels
    channels: {
      campaigns: 'campaigns',
      wins: 'success-shout-outs',
      radio: 'radio-superstars',
    },
  },

  // Otter.ai Integration
  otterAi: {
    apiKey: process.env.OTTER_AI_API_KEY || 'your_otter_ai_api_key_here',
    baseUrl: 'https://otter.ai/api/v1',
  },

  // Typeform Integration
  typeform: {
    apiKey: process.env.TYPEFORM_API_KEY || 'your_typeform_api_key_here',
    baseUrl: 'https://api.typeform.com/v1',
  },

  // WARM API Integration (when available)
  warm: {
    apiKey: process.env.WARM_API_KEY || 'your_warm_api_key_here',
    baseUrl: 'https://api.warm-music.com',
  },

  // Liberty-specific settings
  liberty: {
    companyName: 'Liberty Music PR',
    contactEmail: 'chris@libertymusicpr.com',
    website: 'https://libertymusicpr.com',
    phone: '+44 7XXX XXXXXX',

    // Campaign settings
    campaignDefaults: {
      duration: 30, // days
      followUpDays: [3, 7, 14, 21],
      milestones: [100, 500, 1000, 5000, 10000], // plays
      priorityLevels: ['Critical', 'High', 'Medium', 'Low'],
    },

    // Email templates
    emailTemplates: {
      campaignAnnouncement: 'liberty_campaign_announcement',
      followUp: 'liberty_follow_up',
      milestone: 'liberty_milestone_achievement',
      win: 'liberty_campaign_win',
    },

    // Radio station targets
    radioTargets: {
      bbc: ['BBC Radio 1', 'BBC Radio 2', 'BBC Radio 6 Music', 'BBC Introducing'],
      commercial: ['Capital FM', 'Heart', 'Kiss', 'Absolute Radio'],
      specialist: ['Amazing Radio', 'Wigwam Radio', 'Soho Radio', 'Resonance FM'],
      community: ['Local community stations', 'University radio', 'Hospital radio'],
    },
  },

  // Safety settings
  safety: {
    // CRITICAL: Only allow operations on Liberty board
    allowedBoardIds: ['2443582331'],
    verificationRequired: true,
    rateLimiting: {
      monday: 1000, // 1 second
      mailchimp: 1000, // 1 second
      otter: 2000, // 2 seconds
      typeform: 1000, // 1 second
      googleChat: 1000, // 1 second
    },
  },
};

// Liberty Music PR - Real API Configuration
module.exports = {
  monday: {
    apiKey: process.env.MONDAY_API_KEY,
    accountId: process.env.MONDAY_ACCOUNT_ID,
    baseUrl: 'https://api.monday.com/v2'
  },
  
  warmusic: {
    apiKey: process.env.WARMUSIC_API_KEY,
    baseUrl: 'https://api.warmusic.com',
    trackingEndpoints: {
      plays: '/tracks/plays',
      search: '/tracks/search',
      stats: '/tracks/stats'
    }
  },
  
  googleChat: {
    webhookUrl: process.env.GOOGLE_CHAT_WEBHOOK,
    spaces: {
      success: process.env.GOOGLE_CHAT_SUCCESS_SPACE,
      campaigns: process.env.GOOGLE_CHAT_CAMPAIGNS_SPACE
    }
  },
  
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
    audienceId: process.env.MAILCHIMP_AUDIENCE_ID
  },
  
  liberty: {
    templates: {
      pressReleaseStyle: 'professional',
      emailSignature: 'Chris Schofield - Total Audio Promo via Liberty Music PR',
      campaignPrefix: 'LIBERTY-'
    }
  }
};

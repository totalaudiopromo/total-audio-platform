/**
 * Total Audio Agent Registry
 * Central configuration for all agents Dan orchestrates
 */

module.exports = {
  // Content Generation Agents
  content: {
    newsletter: {
      path: '../core-agents/content/newsletter-automation-agent',
      name: 'Newsletter Automation',
      description: 'The Unsigned Advantage newsletter generation and distribution',
      category: 'content',
      priority: 'high',
    },
    social: {
      path: '../core-agents/content/social-media-agent',
      name: 'Social Media',
      description: 'Multi-platform social content distribution',
      category: 'content',
      priority: 'high',
    },
    newsjack: {
      path: '../core-agents/content/newsjacking-agent',
      name: 'Newsjacking',
      description: 'Trend-based content opportunity detection',
      category: 'content',
      priority: 'medium',
    },
    audioIntel: {
      path: '../core-agents/content/audio-intel-content-agent',
      name: 'Audio Intel Content',
      description: 'Product marketing content for Audio Intel',
      category: 'content',
      priority: 'high',
    },
    contentGen: {
      path: '../core-agents/content/content-generation-agent',
      name: 'Content Generation',
      description: 'General content creation workflows',
      category: 'content',
      priority: 'medium',
    },
    musicTech: {
      path: '../core-agents/content/music-tech-agent',
      name: 'Music Tech News',
      description: 'Music industry news and insights',
      category: 'content',
      priority: 'low',
    },
  },

  // Business Operations Agents
  business: {
    analytics: {
      path: '../core-agents/business/analytics-agent',
      name: 'Business Analytics',
      description: 'Performance metrics and business intelligence',
      category: 'business',
      priority: 'high',
    },
    agency: {
      path: '../core-agents/business/agency-agent',
      name: 'Agency Operations',
      description: 'Client relationship and project management',
      category: 'business',
      priority: 'medium',
    },
    marketing: {
      path: '../core-agents/business/chris-saas-marketing-agent',
      name: 'SaaS Marketing',
      description: 'Total Audio Promo marketing automation',
      category: 'business',
      priority: 'high',
    },
  },

  // Technical Infrastructure Agents
  technical: {
    contact: {
      path: '../core-agents/technical/contact-agent',
      name: 'Contact Enrichment',
      description: 'Contact data enrichment workflows',
      category: 'technical',
      priority: 'high',
    },
    database: {
      path: '../core-agents/technical/database-agent',
      name: 'Database Operations',
      description: 'Database management and optimization',
      category: 'technical',
      priority: 'medium',
    },
    agentManager: {
      path: '../core-agents/technical/agent-manager',
      name: 'Agent Manager',
      description: 'Agent lifecycle and health monitoring',
      category: 'technical',
      priority: 'low',
    },
    dashboard: {
      path: '../core-agents/technical/agent-dashboard',
      name: 'Dashboard Data',
      description: 'Dashboard data aggregation',
      category: 'technical',
      priority: 'low',
    },
  },

  // Campaign Management Agents
  campaigns: {
    campaign: {
      path: '../core-agents/radio-promo/campaign-agent',
      name: 'Campaign Automation',
      description: 'Radio campaign workflow automation',
      category: 'campaigns',
      priority: 'medium',
    },
  },

  // Liberty Client Sub-Agents (existing)
  liberty: {
    intelligence: {
      path: '../agents/intelligence-agent',
      name: 'Liberty Intelligence',
      description: 'Google Meet transcript processing',
      category: 'liberty',
      priority: 'high',
    },
    project: {
      path: '../agents/project-agent',
      name: 'Liberty Project',
      description: 'Monday.com campaign automation',
      category: 'liberty',
      priority: 'high',
    },
    email: {
      path: '../agents/email-agent',
      name: 'Liberty Email',
      description: 'Liberty template generation',
      category: 'liberty',
      priority: 'high',
    },
    radio: {
      path: '../agents/radio-agent',
      name: 'Liberty Radio',
      description: 'Station submission automation',
      category: 'liberty',
      priority: 'high',
    },
    analytics: {
      path: '../agents/analytics-agent',
      name: 'Liberty Analytics',
      description: 'WARM API tracking',
      category: 'liberty',
      priority: 'high',
    },
    coverage: {
      path: '../agents/coverage-agent',
      name: 'Liberty Coverage',
      description: 'Professional reporting',
      category: 'liberty',
      priority: 'high',
    },
    followup: {
      path: '../agents/followup-agent',
      name: 'Liberty Followup',
      description: 'Automated followup campaigns',
      category: 'liberty',
      priority: 'medium',
    },
  },
};

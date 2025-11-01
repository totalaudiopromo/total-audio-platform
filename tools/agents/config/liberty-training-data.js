// Liberty Music PR Agent Training Data
// Comprehensive dataset for training the radio promotion agent

const libertyTrainingData = {
  // Core Business Context from Liberty Music PR Brief
  businessContext: {
    partnershipLead: 'Joe at Liberty Music PR',
    chrisRole: 'Radio promotion specialist with 5+ years experience',
    serviceIntegration: 'Traditional PR + Radio promotion combined offering',
    targetMarket: 'Independent artists seeking comprehensive promotion packages',
    competitiveAdvantage: 'UK-focused alternative to expensive US tools',
    partnershipModel: "Revenue sharing between Liberty PR and Chris's radio expertise",
  },

  // Campaign Structure from Liberty Radio Campaign Structure
  campaignTypes: {
    fourWeek: {
      duration: '4 weeks',
      timeline: {
        week1: 'Campaign launch + initial radio outreach',
        week2: 'First follow-up wave + relationship building',
        week3: 'Second follow-up wave + targeted pitching',
        week4: 'Final push + release day coordination',
      },
      typical_budget: '£1,500-2,000',
    },
    sixWeek: {
      duration: '6 weeks',
      timeline: {
        week1: 'Campaign launch + strategy setup',
        week2: 'Initial radio outreach wave',
        week3: 'First follow-up + relationship nurturing',
        week4: 'Second follow-up + targeted stations',
        week5: 'Final outreach push',
        week6: 'Release coordination + wrap-up',
      },
      typical_budget: '£2,000-3,000',
    },
  },

  // Press Release Standards from Template
  pressReleaseStructure: {
    header: 'Liberty Music PR professional branding',
    format: 'Industry-standard press release structure',
    tone: 'Professional but engaging, artist-focused',
    distribution: "Liberty's established media network",
    contactInfo: "Liberty Music PR contact details + Chris's radio expertise",
  },

  // Workflow Integration from Meeting Notes
  workflowIntegration: {
    mondaycom: {
      purpose: "Add campaigns to Chris's existing Monday.com workspace",
      data: 'Artist, track, genre, release date, budget, timeline',
      updates: 'Progress tracking when radio plays detected',
    },
    googleCalendar: {
      purpose: 'Campaign timeline with milestone scheduling',
      calculation: '4 or 6 weeks before release date',
      milestones: ['Launch', 'Outreach waves', 'Follow-ups', 'Release', 'Wrap-up'],
    },
    googleChat: {
      purpose: 'READ-ONLY intelligence from Liberty team channels',
      channels: ['Success Shout Outs', 'Radio Superstars'],
      extract: 'Campaign wins, industry contacts, success patterns',
    },
    warmusic: {
      purpose: 'Real-time radio play monitoring',
      tracking: 'Artist/track specific monitoring',
      updates: 'Automatic Monday.com progress updates',
    },
  },

  // Chris's Authentic Voice & Approach
  communicationStyle: {
    tone: 'Professional radio industry insider with authentic relationship focus',
    expertise: '5+ years radio plugger experience, BBC + commercial stations',
    approach: 'Relationship-based rather than mass-market, time-efficient but thorough',
    voice: "Chris's personal style - industry credible, approachable, results-focused",
  },

  // Liberty Partnership Standards
  partnershipStandards: {
    quality: "Maintain Liberty Music PR's professional reputation",
    reporting: 'Joint campaign reports showing combined PR + radio results',
    clientHandling: "Consistent with Liberty's client service standards",
    branding: "Integrated Liberty Music PR + Chris's radio expertise positioning",
  },

  // Technical Requirements
  technicalSpecs: {
    platforms: [
      'Monday.com API',
      'Google Calendar API',
      'Google Chat API (read-only)',
      'Warmusic API',
    ],
    workflow: 'Extract from transcripts → Monday.com → Calendar → Track plays → Update progress',
    control: 'Manual approval for external communications, automated for internal tracking',
    integration: 'Seamless with existing Total Audio ecosystem and Audio Intel database',
  },

  // Success Metrics & Expectations
  successMetrics: {
    efficiency: 'Reduce manual campaign setup time by 80%',
    accuracy: 'Consistent Liberty standards across all communications',
    tracking: 'Real-time play detection and progress updates',
    partnership: 'Enhanced reporting and collaboration with Joe at Liberty',
  },
};

module.exports = libertyTrainingData;

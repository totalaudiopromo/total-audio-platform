import { 
  exportContactsToPdf, 
  exportAnalyticsToPdf, 
  exportAIAgentReportToPdf,
  EnrichedContact,
  AnalyticsData,
  AIAgentResponse 
} from './exportToPdf';

/**
 * Generate sample data for PDF demonstrations
 */
export const DEMO_CONTACTS: EnrichedContact[] = [
  {
    name: 'Sarah Thompson',
    email: 'sarah.thompson@bbc.co.uk', 
    contactIntelligence: 'Senior Music Producer at BBC Radio 1, specializing in emerging indie and alternative artists. Known for supporting new talent and has strong connections with major record labels. Best contact time is Tuesday-Thursday between 10am-2pm. Prefers email submissions with streaming links and brief artist bios. Recently featured artists: Arctic Monkeys, Wolf Alice, Pale Waves.',
    researchConfidence: 'High (95%)',
    lastResearched: '2024-01-15',
    platform: 'BBC Radio 1',
    role: 'Senior Music Producer',
    company: 'BBC'
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.chen@spotify.com',
    contactIntelligence: 'Editorial Manager for Spotify UK playlists including "New Music Friday UK" and "Indie Discoveries". Curates for 2.3M+ followers and has excellent track record for breaking new artists. Responds well to professional, concise pitches with high-quality audio. Submit through Spotify for Artists portal for best results.',
    researchConfidence: 'High (92%)',
    lastResearched: '2024-01-14',
    platform: 'Spotify',
    role: 'Editorial Manager', 
    company: 'Spotify'
  },
  {
    name: 'Emma Rodriguez',
    email: 'emma@complexmag.com',
    contactIntelligence: 'Music Editor at Complex Magazine covering emerging UK rap and grime scene. Strong social media presence (45K Twitter followers) and frequently shares new discoveries. Excellent contact for urban music genres. Prefers direct email approach with context about artist story and background.',
    researchConfidence: 'Medium (88%)',
    lastResearched: '2024-01-13',
    platform: 'Complex Magazine',
    role: 'Music Editor',
    company: 'Complex Media'
  },
  {
    name: 'David Kim',
    email: 'david.kim@kexp.org',
    contactIntelligence: 'Radio Host and Music Director at KEXP, internationally recognized for discovering new talent. Program: "New and Emerging Artists" broadcasts globally. Very supportive of independent musicians and provides detailed feedback. Submit high-quality demos with artist story.',
    researchConfidence: 'High (90%)',
    lastResearched: '2024-01-12', 
    platform: 'KEXP',
    role: 'Music Director',
    company: 'KEXP'
  },
  {
    name: 'Lisa Williams',
    email: 'lisa.williams@amazenmagazine.co.uk',
    contactIntelligence: 'Freelance Music Journalist covering indie, alternative, and electronic music for various UK publications including NME, The Guardian, and Mixmag. Strong network in London music scene. Responds well to exclusive premieres and interview opportunities.',
    researchConfidence: 'Medium (85%)',
    lastResearched: '2024-01-11',
    platform: 'Freelance Journalist',
    role: 'Music Journalist',
    company: 'Various Publications'
  }
];

export const DEMO_ANALYTICS: AnalyticsData = {
  totalContacts: 2847,
  totalEnrichments: 2695,
  successRate: 94.7,
  averageConfidence: 89.3,
  platformBreakdown: {
    'Spotify': 892,
    'BBC Radio': 654,
    'Independent Radio': 456,
    'Music Blogs': 385,
    'Record Labels': 287,
    'Other': 173
  },
  dailyEnrichments: [
    { date: '2024-01-09', count: 67 },
    { date: '2024-01-10', count: 82 },
    { date: '2024-01-11', count: 94 },
    { date: '2024-01-12', count: 78 },
    { date: '2024-01-13', count: 91 },
    { date: '2024-01-14', count: 105 },
    { date: '2024-01-15', count: 88 }
  ],
  topPlatforms: [
    { platform: 'Spotify Playlists', count: 892, percentage: 31.3 },
    { platform: 'BBC Radio', count: 654, percentage: 23.0 },
    { platform: 'Independent Radio', count: 456, percentage: 16.0 },
    { platform: 'Music Blogs', count: 385, percentage: 13.5 },
    { platform: 'Record Labels', count: 287, percentage: 10.1 },
    { platform: 'Other Platforms', count: 173, percentage: 6.1 }
  ],
  performanceMetrics: {
    averageProcessingTime: 1.8,
    cacheHitRate: 84.2,
    errorRate: 0.8
  }
};

export const DEMO_AI_AGENT_REPORT: AIAgentResponse = {
  agentType: 'music-industry-strategist',
  query: 'What\'s the best strategy for promoting indie rock music to UK radio stations?',
  response: 'Based on current UK music industry trends and radio programming data, here\'s a comprehensive strategy for indie rock promotion to UK radio. The UK indie rock scene remains highly competitive, with approximately 15,000+ new releases submitted to radio stations monthly. Success requires a multi-tiered approach targeting both national and regional stations. BBC Radio 1, Radio X, and 6 Music remain the primary national targets, while regional stations like BBC Introducing offer excellent breaking opportunities. Key success factors include professional presentation, timing submissions around programming schedules, building relationships with specific producers, and providing exclusive content like live sessions or interviews.',
  recommendations: [
    'Target BBC Radio 1\'s "New Music" slots on Tuesday evenings for maximum exposure',
    'Build relationships with BBC Introducing producers in your local region first',
    'Submit to Radio X\'s "Evening Show" which specifically focuses on new indie rock',
    'Provide exclusive live session recordings or acoustic versions for radio play',
    'Time submissions 6-8 weeks before major festivals for playlist consideration',
    'Create compelling one-page artist briefs with streaming stats and press coverage'
  ],
  nextSteps: [
    'Research specific radio producers and their submission preferences',
    'Prepare professional press kit with high-quality photos and biography',
    'Record radio-ready versions (clean, properly mastered for broadcast)',
    'Plan submission timeline around key industry events and festivals',
    'Set up tracking system for submission responses and follow-ups',
    'Develop relationships through social media and industry networking events'
  ],
  dateGenerated: '2024-01-15T14:30:00Z'
};

/**
 * Generate all sample PDFs for the gallery
 */
export async function generateAllSamplePdfs(): Promise<{
  contacts: string;
  analytics: string; 
  aiAgent: string;
}> {
  const timestamp = new Date().toISOString().split('T')[0];
  
  const filenames = {
    contacts: `sample-contacts-report-${timestamp}.pdf`,
    analytics: `sample-analytics-report-${timestamp}.pdf`,
    aiAgent: `sample-ai-strategy-report-${timestamp}.pdf`
  };
  
  // Generate sample PDFs (these would typically be pre-generated and stored)
  try {
    exportContactsToPdf(DEMO_CONTACTS, filenames.contacts, {
      companyName: 'Audio Intel',
      primaryColor: '#2563eb'
    });
    
    exportAnalyticsToPdf(DEMO_ANALYTICS, filenames.analytics, {
      companyName: 'Audio Intel', 
      primaryColor: '#2563eb'
    });
    
    exportAIAgentReportToPdf(DEMO_AI_AGENT_REPORT, filenames.aiAgent, {
      companyName: 'Audio Intel',
      primaryColor: '#2563eb'
    });
    
    console.log('Sample PDFs generated successfully');
    return filenames;
    
  } catch (error) {
    console.error('Error generating sample PDFs:', error);
    throw error;
  }
}

/**
 * PDF sample metadata for gallery display
 */
export const PDF_SAMPLES_INFO = {
  contacts: {
    title: 'Contact Intelligence Report',
    description: 'Comprehensive contact enrichment with industry insights, confidence scoring, and actionable intelligence.',
    features: [
      'Detailed contact profiles with industry context',
      'Research confidence indicators', 
      'Platform and role identification',
      'Professional formatting and branding',
      'Contact intelligence summaries'
    ],
    previewUrl: '/samples/contact-intelligence-preview.jpg',
    pages: 4,
    contacts: 5
  },
  
  analytics: {
    title: 'Performance Analytics Dashboard',
    description: 'Complete analytics overview with performance metrics, platform breakdowns, and trend analysis.',
    features: [
      'Key performance metrics and KPIs',
      'Platform distribution analysis',
      'Daily activity trends and patterns',
      'Success rate calculations',
      'Visual data presentation'
    ],
    previewUrl: '/samples/analytics-dashboard-preview.jpg',
    pages: 3,
    metrics: 12
  },
  
  aiAgent: {
    title: 'AI Strategic Analysis Report', 
    description: 'Intelligent industry analysis with strategic recommendations and actionable next steps.',
    features: [
      'AI-powered industry insights',
      'Strategic recommendations',
      'Actionable next steps',
      'Market analysis and trends',
      'Professional strategic formatting'
    ],
    previewUrl: '/samples/ai-strategy-preview.jpg',
    pages: 2,
    recommendations: 6
  }
};

/**
 * Generate preview images from PDFs (simplified version)
 * In production, this would use a PDF-to-image service
 */
export function generatePreviewImages(): Record<string, string> {
  // This would typically use pdf2pic, puppeteer, or similar
  // For now, return placeholder URLs
  return {
    contacts: '/api/pdf-preview/contacts',
    analytics: '/api/pdf-preview/analytics',
    aiAgent: '/api/pdf-preview/ai-agent'
  };
}
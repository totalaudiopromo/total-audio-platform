import { NextRequest, NextResponse } from 'next/server';

interface PostTemplate {
  id: string;
  name: string;
  category: 'announcement' | 'beta-update' | 'feature' | 'launch';
  content: string;
  hashtags: string[];
  platforms: string[];
  variables?: string[];
}

// Authentic Audio Intel post templates - Based on real founder story and achievements
const audioIntelTemplates: PostTemplate[] = [
  {
    id: 'founder_story',
    name: 'Real Founder Story',
    category: 'announcement',
    content: 'Just launched Audio Intel after years of drowning in messy contact spreadsheets.\n\nAs a working musician (sadact) and former Network Programs Manager at Decadance UK, I was spending 10+ hours per campaign just organizing contact data.\n\nAudio Intel transforms 10+ chaotic Excel files into organised contact databases in minutes. What used to take days now takes minutes.\n\nBuilt by someone who actually promotes music - for people who actually promote music.\n\nTry 10 enrichments free: intel.totalaudiopromo.com',
    hashtags: ['MusicPromotion', 'IndependentArtist', 'ContactManagement', 'AudioIntel'],
    platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
    variables: []
  },
  {
    id: 'drop_chaos_launch',
    name: 'Drop Your Chaos Here',
    category: 'announcement',
    content: 'Drop your chaos here.\n\nThat\'s literally what Audio Intel does. Upload your messy spreadsheets, and get organised contact databases back.\n\n4 AI agents working together:\n• DataQualityAgent - cleans your data\n• ColumnMappingAgent - understands your formats\n• DataNormalizationAgent - standardises everything\n• DeduplicationAgent - removes duplicates\n\nFreemium model: 10 free enrichments to start\nPro: £19/month for 100 enrichments\nEnterprise: £79/month for 500 enrichments\n\nintel.totalaudiopromo.com',
    hashtags: ['AudioIntel', 'MusicPromotion', 'ContactEnrichment', 'Freemium'],
    platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
    variables: []
  },
  {
    id: 'decadance_credibility',
    name: 'Industry Credibility',
    category: 'beta-update',
    content: 'Why I built Audio Intel:\n\nAfter managing contacts for Decadance UK\'s Network Programs and promoting my own music as sadact, I realised everyone in music promotion has the same problem:\n\nMessy. Spreadsheets. Everywhere.\n\n10+ Excel files per campaign. Hours spent organising instead of promoting. Duplicate contacts. Outdated emails.\n\nAudio Intel solves this with multi-agent AI processing. Upload your chaos, get organised intelligence back.\n\nCurrently live with simplified 3-tab interface (down from 5 tabs - Steve Jobs would approve).\n\nTry it: intel.totalaudiopromo.com',
    hashtags: ['MusicBusiness', 'ContactManagement', 'AudioIntel', 'RealExperience'],
    platforms: ['twitter', 'linkedin', 'bluesky'],
    variables: []
  },
  {
    id: 'actual_problem',
    name: 'The Real Problem',
    category: 'feature',
    content: 'The music promotion problem nobody talks about:\n\nYou spend more time organizing contact spreadsheets than actually promoting music.\n\nI know because I lived it:\n• 10+ Excel files per campaign\n• Hours researching each contact\n• Manual deduplication\n• Outdated email addresses\n• Inconsistent data formats\n\nAudio Intel\'s 4-agent pipeline:\n1. Validates & cleans your data\n2. Maps columns intelligently\n3. Standardises all information\n4. Removes duplicates using fuzzy matching\n\nWhat used to take days now takes minutes.\n\nFree tier: 10 enrichments\nNo credit card required\n\nintel.totalaudiopromo.com',
    hashtags: ['MusicPromotion', 'Productivity', 'AudioIntel', 'RealSolution'],
    platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
    variables: []
  },
  {
    id: 'simplified_ui_update',
    name: 'UI Simplification Achievement',
    category: 'beta-update',
    content: 'Just simplified Audio Intel\'s UI from 5 tabs down to 3:\n\n• Data Processing (now default)\n• Contact Enrichment\n• Analytics\n\nSteve Jobs-inspired simplicity. Less clicks, more results.\n\nThe tool now focuses on what matters: transforming your messy contact spreadsheets into organised databases that actually work.\n\nCurrent users are saving 5-10 hours per campaign.\n\nTry the simplified interface: intel.totalaudiopromo.com',
    hashtags: ['UIDesign', 'AudioIntel', 'Simplicity', 'UserExperience'],
    platforms: ['twitter', 'linkedin', 'threads'],
    variables: []
  },
  {
    id: 'real_time_savings',
    name: 'Actual Time Savings',
    category: 'feature',
    content: 'Real feedback from Audio Intel users:\n\n"What used to take me a full weekend now takes 15 minutes"\n\n"I can finally focus on making music instead of managing spreadsheets"\n\n"The deduplication alone saved me 6 hours on my last campaign"\n\nBuilt by a working musician who felt your pain.\nTested by independent artists who need their time back.\n\nFreemium model: Start with 10 free contact enrichments\n\nintel.totalaudiopromo.com',
    hashtags: ['MusicPromotion', 'TimeSavings', 'AudioIntel', 'RealResults'],
    platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
    variables: []
  },
  {
    id: 'multi_agent_tech',
    name: 'Multi-Agent Technology',
    category: 'feature',
    content: 'Audio Intel uses 4 specialized AI agents working together:\n\nDataQualityAgent:\n• Validates email addresses\n• Checks data completeness\n• Flags potential issues\n\nColumnMappingAgent:\n• Understands different spreadsheet formats\n• Maps columns intelligently\n• Handles inconsistent headers\n\nDataNormalizationAgent:\n• Standardises contact information\n• Formats phone numbers\n• Cleans social media handles\n\nDeduplicationAgent:\n• Uses Levenshtein distance for fuzzy matching\n• Identifies similar contacts\n• Merges duplicate entries\n\nUpload chaos, get intelligence.\n\nintel.totalaudiopromo.com',
    hashtags: ['AI', 'MusicTech', 'AudioIntel', 'MultiAgent'],
    platforms: ['twitter', 'linkedin', 'threads'],
    variables: []
  },
  {
    id: 'freemium_value',
    name: 'Freemium Value Proposition',
    category: 'launch',
    content: 'Audio Intel pricing designed for real musicians:\n\nSTARTER (Free):\n• 10 contact enrichments per month\n• Basic enrichment data\n• No credit card required\n• Full feature access\n\nPRO (£19/month):\n• 100 enrichments per month\n• Advanced data processing\n• Export functionality\n• Priority processing\n\nENTERPRISE (£79/month):\n• 500 enrichments per month\n• Multi-client processing\n• White-label reports\n• Phone support\n\nBuilt for UK music industry by UK music industry.\n\nStart free: intel.totalaudiopromo.com',
    hashtags: ['Freemium', 'MusicPromotion', 'AudioIntel', 'UKMusic'],
    platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
    variables: []
  },
  {
    id: 'uk_music_focus',
    name: 'UK Music Industry Focus',
    category: 'announcement',
    content: 'Built for the UK music industry, by the UK music industry.\n\nAs former Network Programs Manager at Decadance UK, I understand the specific challenges of UK music promotion:\n\n• BBC Radio contact management\n• Commercial radio relationships\n• Programme director outreach\n• Press and playlist coordination\n\nAudio Intel handles the data chaos so you can focus on the relationships.\n\nBuilt in the UK. Priced in £GBP. Designed for our market.\n\nStart organising: intel.totalaudiopromo.com',
    hashtags: ['UKMusic', 'MusicPromotion', 'AudioIntel', 'BBCRadio'],
    platforms: ['twitter', 'linkedin', 'bluesky'],
    variables: []
  },
  {
    id: 'working_musician_authenticity',
    name: 'Working Musician Authenticity',
    category: 'feature',
    content: 'Audio Intel wasn\'t built by Silicon Valley consultants.\n\nI\'m sadact - a working independent musician who got tired of spending more time on spreadsheets than music.\n\nFormer Network Programs Manager at Decadance UK means I\'ve handled thousands of music industry contacts.\n\nI built Audio Intel because I needed it. You probably need it too.\n\nReal solution for real musicians facing real problems.\n\nNo buzzwords. No fake promises. Just organised contacts.\n\nTry it: intel.totalaudiopromo.com',
    hashtags: ['IndependentMusic', 'RealSolution', 'AudioIntel', 'WorkingMusician'],
    platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
    variables: []
  }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const platform = url.searchParams.get('platform');

    let filteredTemplates = audioIntelTemplates;

    // Filter by category
    if (category) {
      filteredTemplates = filteredTemplates.filter(
        template => template.category === category
      );
    }

    // Filter by platform
    if (platform) {
      filteredTemplates = filteredTemplates.filter(
        template => template.platforms.includes(platform)
      );
    }

    return NextResponse.json({
      success: true,
      templates: filteredTemplates,
      count: filteredTemplates.length,
      categories: ['announcement', 'beta-update', 'feature', 'launch'],
      availablePlatforms: ['twitter', 'linkedin', 'bluesky', 'threads', 'facebook']
    });

  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const template: Omit<PostTemplate, 'id'> = await request.json();
    
    // Validate template
    if (!template.name || !template.content || !template.category) {
      return NextResponse.json(
        { error: 'Template must have name, content, and category' },
        { status: 400 }
      );
    }

    // Generate ID and add to templates (in production, save to database)
    const newTemplate: PostTemplate = {
      ...template,
      id: `custom_${Date.now()}`
    };

    console.log('New template created:', newTemplate);

    return NextResponse.json({
      success: true,
      template: newTemplate,
      message: 'Template created successfully'
    });

  } catch (error) {
    console.error('Failed to create template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
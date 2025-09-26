// Underground Music Content Sources
// Curated list of high-quality sources for independent artists

export interface MusicSource {
  name: string;
  url: string;
  rssUrl?: string;
  type: 'newsletter' | 'blog' | 'magazine' | 'tutorial';
  focus: string[];
  quality: 'high' | 'medium' | 'underground';
  description: string;
}

export const UNDERGROUND_MUSIC_SOURCES: MusicSource[] = [
  // Electronic Music & Production (Attack Magazine style)
  {
    name: 'Attack Magazine',
    url: 'https://www.attackmagazine.com',
    rssUrl: 'https://www.attackmagazine.com/feed/',
    type: 'magazine',
    focus: ['electronic', 'production', 'underground', 'tutorials'],
    quality: 'high',
    description: 'Underground electronic music culture, production tutorials, and artist features'
  },
  {
    name: 'First Floor',
    url: 'https://firstfloor.substack.com',
    rssUrl: 'https://firstfloor.substack.com/feed',
    type: 'newsletter',
    focus: ['electronic', 'culture', 'industry', 'underground'],
    quality: 'high',
    description: 'Electronic music culture and industry insights by Shawn Reynaldo'
  },
  {
    name: 'Sonic Academy',
    url: 'https://www.sonicacademy.com',
    rssUrl: 'https://www.sonicacademy.com/blog/feed/',
    type: 'tutorial',
    focus: ['production', 'tutorials', 'electronic', 'techniques'],
    quality: 'high',
    description: 'Production tutorials and techniques for electronic music'
  },
  {
    name: 'Future Music',
    url: 'https://www.musicradar.com/futuremusic',
    rssUrl: 'https://www.musicradar.com/futuremusic/rss',
    type: 'magazine',
    focus: ['production', 'gear', 'electronic', 'techniques'],
    quality: 'high',
    description: 'Production tips, gear reviews, and electronic music techniques'
  },
  {
    name: 'Computer Music',
    url: 'https://www.musicradar.com/computermusic',
    rssUrl: 'https://www.musicradar.com/computermusic/rss',
    type: 'magazine',
    focus: ['software', 'production', 'electronic', 'tutorials'],
    quality: 'high',
    description: 'Software and production techniques for computer-based music'
  },
  {
    name: 'Sound on Sound',
    url: 'https://www.soundonsound.com',
    rssUrl: 'https://www.soundonsound.com/rss',
    type: 'magazine',
    focus: ['production', 'professional', 'techniques', 'gear'],
    quality: 'high',
    description: 'Professional production insights and techniques'
  },

  // Independent Artist Business
  {
    name: 'Hypebot',
    url: 'https://www.hypebot.com',
    rssUrl: 'https://www.hypebot.com/feed/',
    type: 'blog',
    focus: ['independent', 'business', 'marketing', 'technology'],
    quality: 'high',
    description: 'Music industry news and insights for independent artists'
  },
  {
    name: 'Music Ally',
    url: 'https://musically.com',
    rssUrl: 'https://musically.com/feed/',
    type: 'blog',
    focus: ['digital', 'business', 'streaming', 'technology'],
    quality: 'high',
    description: 'Digital music business insights and analysis'
  },
  {
    name: 'Water & Music',
    url: 'https://www.waterandmusic.com',
    rssUrl: 'https://www.waterandmusic.com/feed/',
    type: 'newsletter',
    focus: ['technology', 'culture', 'business', 'innovation'],
    quality: 'high',
    description: 'Music tech and culture intersection by Cherie Hu'
  },
  {
    name: 'Platform & Stream',
    url: 'https://platformandstream.com',
    rssUrl: 'https://platformandstream.com/feed/',
    type: 'newsletter',
    focus: ['streaming', 'business', 'platforms', 'monetization'],
    quality: 'high',
    description: 'Music streaming business and platform updates'
  },

  // Underground & Independent Focus
  {
    name: 'Resident Advisor',
    url: 'https://www.residentadvisor.net',
    rssUrl: 'https://www.residentadvisor.net/rss.xml',
    type: 'blog',
    focus: ['electronic', 'underground', 'events', 'culture'],
    quality: 'high',
    description: 'Underground electronic music culture and events'
  },
  {
    name: 'Mixmag',
    url: 'https://mixmag.net',
    rssUrl: 'https://mixmag.net/feed',
    type: 'magazine',
    focus: ['electronic', 'culture', 'events', 'artists'],
    quality: 'medium',
    description: 'Electronic music culture and artist features'
  },
  {
    name: 'DJ Mag',
    url: 'https://djmag.com',
    rssUrl: 'https://djmag.com/rss.xml',
    type: 'magazine',
    focus: ['electronic', 'djs', 'events', 'culture'],
    quality: 'medium',
    description: 'Electronic music and DJ culture'
  },

  // UK Music Scene (for your audience)
  {
    name: 'The Quietus',
    url: 'https://thequietus.com',
    rssUrl: 'https://thequietus.com/rss',
    type: 'blog',
    focus: ['alternative', 'underground', 'culture', 'uk'],
    quality: 'high',
    description: 'Alternative and underground music culture'
  },
  {
    name: 'Drowned in Sound',
    url: 'https://drownedinsound.com',
    rssUrl: 'https://drownedinsound.com/rss',
    type: 'blog',
    focus: ['alternative', 'indie', 'culture', 'uk'],
    quality: 'medium',
    description: 'Alternative and indie music culture'
  },

  // Reputable Mainstream Sources
  {
    name: 'BBC Music',
    url: 'https://www.bbc.com/music',
    rssUrl: 'https://www.bbc.com/music/rss.xml',
    type: 'newsletter',
    focus: ['uk', 'mainstream', 'culture', 'business'],
    quality: 'high',
    description: 'BBC Music news and culture coverage'
  },
  {
    name: 'BBC News - Entertainment',
    url: 'https://www.bbc.com/news/entertainment',
    rssUrl: 'https://feeds.bbci.co.uk/news/entertainment/rss.xml',
    type: 'newsletter',
    focus: ['uk', 'mainstream', 'entertainment', 'business'],
    quality: 'high',
    description: 'BBC Entertainment news including music industry'
  },
  {
    name: 'The Guardian Music',
    url: 'https://www.theguardian.com/music',
    rssUrl: 'https://www.theguardian.com/music/rss',
    type: 'blog',
    focus: ['uk', 'mainstream', 'culture', 'business'],
    quality: 'high',
    description: 'The Guardian music section with industry coverage'
  },
  {
    name: 'NME',
    url: 'https://www.nme.com',
    rssUrl: 'https://www.nme.com/rss',
    type: 'magazine',
    focus: ['uk', 'mainstream', 'culture', 'indie'],
    quality: 'high',
    description: 'New Musical Express - UK music magazine'
  },

  // Independent Music Business
  {
    name: 'Independent Music Insider',
    url: 'https://independentmusicinsider.com',
    rssUrl: 'https://independentmusicinsider.com/feed/',
    type: 'blog',
    focus: ['independent', 'business', 'uk', 'industry'],
    quality: 'high',
    description: 'Independent music business news and insights'
  },
  {
    name: 'Music Business Worldwide',
    url: 'https://www.musicbusinessworldwide.com',
    rssUrl: 'https://www.musicbusinessworldwide.com/feed/',
    type: 'blog',
    focus: ['business', 'industry', 'streaming', 'technology'],
    quality: 'high',
    description: 'Music industry business news and analysis'
  },
  {
    name: 'Complete Music Update',
    url: 'https://completemusicupdate.com',
    rssUrl: 'https://completemusicupdate.com/feed/',
    type: 'blog',
    focus: ['uk', 'business', 'industry', 'independent'],
    quality: 'high',
    description: 'UK music industry news and updates'
  },

  // AI & Technology (focused on empowerment)
  {
    name: 'Music Ally AI',
    url: 'https://musically.com',
    rssUrl: 'https://musically.com/feed/',
    type: 'blog',
    focus: ['ai', 'technology', 'digital', 'innovation'],
    quality: 'high',
    description: 'Music technology and AI insights for the industry'
  },
  {
    name: 'Synthtopia',
    url: 'https://www.synthtopia.com',
    rssUrl: 'https://www.synthtopia.com/feed/',
    type: 'blog',
    focus: ['technology', 'production', 'ai', 'innovation'],
    quality: 'high',
    description: 'Music technology and synthesis news'
  }
];

// Content categories for filtering
export const CONTENT_CATEGORIES = {
  PRODUCTION: ['production', 'tutorials', 'techniques', 'software', 'gear'],
  BUSINESS: ['business', 'marketing', 'streaming', 'monetization', 'independent'],
  CULTURE: ['culture', 'underground', 'alternative', 'electronic', 'indie'],
  TECHNOLOGY: ['technology', 'innovation', 'digital', 'ai', 'platforms'],
  AI_EMPOWERMENT: ['ai', 'automation', 'marketing', 'tools', 'empowerment', 'independent'],
  EVENTS: ['events', 'festivals', 'shows', 'releases', 'artists']
};

// Quality scoring for content
export const QUALITY_SCORES = {
  'high': 100,
  'medium': 75,
  'underground': 90
};

// Get sources by focus area
export function getSourcesByFocus(focus: string[]): MusicSource[] {
  return UNDERGROUND_MUSIC_SOURCES.filter(source => 
    focus.some(f => source.focus.includes(f))
  );
}

// Get high-quality sources only
export function getHighQualitySources(): MusicSource[] {
  return UNDERGROUND_MUSIC_SOURCES.filter(source => 
    source.quality === 'high'
  );
}

// Get sources for independent artists
export function getIndependentArtistSources(): MusicSource[] {
  return UNDERGROUND_MUSIC_SOURCES.filter(source => 
    source.focus.includes('independent') || 
    source.focus.includes('business') ||
    source.focus.includes('marketing')
  );
}

// Get electronic music sources
export function getElectronicMusicSources(): MusicSource[] {
  return UNDERGROUND_MUSIC_SOURCES.filter(source => 
    source.focus.includes('electronic') || 
    source.focus.includes('production') ||
    source.focus.includes('underground')
  );
}

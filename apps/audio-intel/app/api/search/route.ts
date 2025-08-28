import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar';

interface SearchRequest {
  query: string;
  platforms?: string[];
}

interface SearchResult {
  platform: string;
  title: string;
  description: string;
  url: string;
  contact?: string;
  relevance: string;
  lastUpdated: string;
}

// Enhanced error handling and retry logic
async function makePerplexityRequest(prompt: string, retries = 2): Promise<{ content: string; error?: string }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        PERPLEXITY_API_URL,
        {
          model: PERPLEXITY_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      const content = (response.data as any)?.choices?.[0]?.message?.content || '';
      if (content) {
        return { content };
      }
    } catch (error: any) {
      console.error(`Perplexity API attempt ${attempt + 1} failed:`, error.message);
      if (attempt === retries) {
        return { content: '', error: error.message || 'API request failed' };
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  return { content: '', error: 'All retry attempts failed' };
}

// Enhanced Reddit search with better error handling
async function searchReddit(query: string): Promise<SearchResult[]> {
  const prompt = `Search Reddit for music industry contacts related to: "${query}".
  Focus on these subreddit categories:
  
  MUSIC PROMOTION & SHARING:
  - r/WeAreTheMusicMakers, r/ThisIsOurMusic, r/IndieMusicFeedback
  - r/MusicPromotion, r/NewMusic, r/ListenToThis
  - r/SpotifyPlaylists, r/AppleMusic, r/Playlists
  
  RADIO & BROADCASTING:
  - r/Radio, r/Broadcasting, r/CollegeRadio
  - r/PublicRadio, r/CommunityRadio, r/InternetRadio
  
  MUSIC INDUSTRY & BUSINESS:
  - r/MusicIndustry, r/MusicBusiness, r/RecordLabels
  - r/MusicMarketing, r/MusicPR, r/MusicManagement
  
  GENRE-SPECIFIC:
  - r/Indie, r/Alternative, r/Rock, r/Electronic, r/HipHop
  - r/Folk, r/Jazz, r/Classical, r/Country, r/Pop
  
  Return results in this format:
  - Platform: Reddit
  - Title: [Subreddit name and moderator/active user]
  - Description: [What they do, community size, submission process]
  - URL: [Reddit profile or subreddit URL]
  - Contact: [How to contact - Reddit PM, Discord, email]
  - Relevance: [High/Medium/Low based on query match]
  - LastUpdated: [Recent activity indicator]`;

  try {
    const { content, error } = await makePerplexityRequest(prompt);
    
    if (error || !content) {
      console.error('Reddit search error:', error);
      return [];
    }
    
    // Parse the response and extract structured data
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    let currentResult: Partial<SearchResult> = {};
    
    for (const line of lines) {
      if (line.includes('Platform:')) {
        if (Object.keys(currentResult).length > 0) {
          results.push(currentResult as SearchResult);
        }
        currentResult = { platform: 'Reddit' };
      } else if (line.includes('Title:')) {
        currentResult.title = line.split('Title:')[1]?.trim() || '';
      } else if (line.includes('Description:')) {
        currentResult.description = line.split('Description:')[1]?.trim() || '';
      } else if (line.includes('URL:')) {
        currentResult.url = line.split('URL:')[1]?.trim() || '';
      } else if (line.includes('Contact:')) {
        currentResult.contact = line.split('Contact:')[1]?.trim() || '';
      } else if (line.includes('Relevance:')) {
        currentResult.relevance = line.split('Relevance:')[1]?.trim() || 'Medium';
      } else if (line.includes('LastUpdated:')) {
        currentResult.lastUpdated = line.split('LastUpdated:')[1]?.trim() || 'Recently';
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      results.push(currentResult as SearchResult);
    }

    return results.slice(0, 8);
  } catch (error) {
    console.error('Reddit search error:', error);
    return [];
  }
}

// Enhanced Instagram search with better error handling
async function searchInstagram(query: string): Promise<SearchResult[]> {
  const prompt = `Search Instagram for music industry contacts related to: "${query}".
  Find Instagram accounts in these categories:
  
  PLAYLIST CURATORS:
  - @spotify, @applemusic, @tidal, @amazonmusic
  - Independent playlist curators with large followings
  - Genre-specific playlist accounts
  
  RADIO & MEDIA:
  - @bbcmusic, @bbcradio1, @bbcradio2, @bbc6music
  - @nprmusic, @kexp, @kcrw, @wfuv
  - Local and college radio stations
  
  MUSIC BLOGGERS & JOURNALISTS:
  - @pitchfork, @rollingstone, @nme, @billboard
  - @stereogum, @consequence, @brooklynvegan
  - Independent music bloggers and critics
  
  RECORD LABELS & INDUSTRY:
  - Major and independent record labels
  - Music PR firms and marketing agencies
  - Music industry professionals and executives
  
  INFLUENCERS & CURATORS:
  - Music influencers with engaged audiences
  - Genre-specific music curators
  - Music discovery accounts
  
  Return results in this format:
  - Platform: Instagram
  - Title: [Account handle and name]
  - Description: [What they do, follower count, submission process]
  - URL: [Instagram profile URL]
  - Contact: [How to contact - @handle, email, submission form]
  - Relevance: [High/Medium/Low based on query match]
  - LastUpdated: [Recent activity indicator]`;

  try {
    const { content, error } = await makePerplexityRequest(prompt);
    
    if (error || !content) {
      console.error('Instagram search error:', error);
      return [];
    }
    
    // Parse the response and extract structured data
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    let currentResult: Partial<SearchResult> = {};
    
    for (const line of lines) {
      if (line.includes('Platform:')) {
        if (Object.keys(currentResult).length > 0) {
          results.push(currentResult as SearchResult);
        }
        currentResult = { platform: 'Instagram' };
      } else if (line.includes('Title:')) {
        currentResult.title = line.split('Title:')[1]?.trim() || '';
      } else if (line.includes('Description:')) {
        currentResult.description = line.split('Description:')[1]?.trim() || '';
      } else if (line.includes('URL:')) {
        currentResult.url = line.split('URL:')[1]?.trim() || '';
      } else if (line.includes('Contact:')) {
        currentResult.contact = line.split('Contact:')[1]?.trim() || '';
      } else if (line.includes('Relevance:')) {
        currentResult.relevance = line.split('Relevance:')[1]?.trim() || 'Medium';
      } else if (line.includes('LastUpdated:')) {
        currentResult.lastUpdated = line.split('LastUpdated:')[1]?.trim() || 'Recently';
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      results.push(currentResult as SearchResult);
    }

    return results.slice(0, 8);
  } catch (error) {
    console.error('Instagram search error:', error);
    return [];
  }
}

// Enhanced Spotify search focusing on playlist curators and editors
async function searchSpotify(query: string): Promise<SearchResult[]> {
  const prompt = `Search Spotify for music industry contacts related to: "${query}".
  Focus on these Spotify categories:
  
  OFFICIAL SPOTIFY PLAYLISTS:
  - Spotify Editorial playlists (Today's Top Hits, RapCaviar, etc.)
  - Genre-specific official playlists
  - Mood and activity-based playlists
  
  INDEPENDENT CURATORS:
  - Popular independent playlist curators
  - Genre-specific playlist creators
  - Music discovery playlist owners
  
  SPOTIFY FOR ARTISTS:
  - Spotify for Artists program participants
  - Verified artist accounts with large followings
  - Music industry professionals on Spotify
  
  PODCASTS & AUDIO CONTENT:
  - Music-related podcasts on Spotify
  - Audio content creators and hosts
  - Music industry discussion shows
  
  Return results in this format:
  - Platform: Spotify
  - Title: [Playlist/Profile name and curator]
  - Description: [What they do, follower count, submission process]
  - URL: [Spotify playlist/profile URL]
  - Contact: [How to contact - Spotify message, email, submission form]
  - Relevance: [High/Medium/Low based on query match]
  - LastUpdated: [Recent activity indicator]`;

  try {
    const { content, error } = await makePerplexityRequest(prompt);
    
    if (error || !content) {
      console.error('Spotify search error:', error);
      return [];
    }
    
    // Parse the response and extract structured data
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    let currentResult: Partial<SearchResult> = {};
    
    for (const line of lines) {
      if (line.includes('Platform:')) {
        if (Object.keys(currentResult).length > 0) {
          results.push(currentResult as SearchResult);
        }
        currentResult = { platform: 'Spotify' };
      } else if (line.includes('Title:')) {
        currentResult.title = line.split('Title:')[1]?.trim() || '';
      } else if (line.includes('Description:')) {
        currentResult.description = line.split('Description:')[1]?.trim() || '';
      } else if (line.includes('URL:')) {
        currentResult.url = line.split('URL:')[1]?.trim() || '';
      } else if (line.includes('Contact:')) {
        currentResult.contact = line.split('Contact:')[1]?.trim() || '';
      } else if (line.includes('Relevance:')) {
        currentResult.relevance = line.split('Relevance:')[1]?.trim() || 'Medium';
      } else if (line.includes('LastUpdated:')) {
        currentResult.lastUpdated = line.split('LastUpdated:')[1]?.trim() || 'Recently';
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      results.push(currentResult as SearchResult);
    }

    return results.slice(0, 8);
  } catch (error) {
    console.error('Spotify search error:', error);
    return [];
  }
}

// Enhanced Discord search focusing on music industry servers
async function searchDiscord(query: string): Promise<SearchResult[]> {
  const prompt = `Search Discord for music industry contacts related to: "${query}".
  Focus on these Discord server categories:
  
  MUSIC PRODUCTION & CREATION:
  - Music production servers (EDM, Hip-Hop, Rock, etc.)
  - Songwriting and composition communities
  - Music collaboration servers
  
  MUSIC INDUSTRY & BUSINESS:
  - Music industry networking servers
  - Record label and management communities
  - Music marketing and promotion servers
  
  GENRE-SPECIFIC COMMUNITIES:
  - Genre-specific music servers
  - Underground and independent music communities
  - Music discovery and sharing servers
  
  RADIO & BROADCASTING:
  - Radio station Discord servers
  - Podcast and audio content communities
  - Broadcasting and media servers
  
  Return results in this format:
  - Platform: Discord
  - Title: [Server name and key members]
  - Description: [What they do, member count, submission process]
  - URL: [Discord invite link or server URL]
  - Contact: [How to contact - Discord DM, server channels, email]
  - Relevance: [High/Medium/Low based on query match]
  - LastUpdated: [Recent activity indicator]`;

  try {
    const { content, error } = await makePerplexityRequest(prompt);
    
    if (error || !content) {
      console.error('Discord search error:', error);
      return [];
    }
    
    // Parse the response and extract structured data
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    let currentResult: Partial<SearchResult> = {};
    
    for (const line of lines) {
      if (line.includes('Platform:')) {
        if (Object.keys(currentResult).length > 0) {
          results.push(currentResult as SearchResult);
        }
        currentResult = { platform: 'Discord' };
      } else if (line.includes('Title:')) {
        currentResult.title = line.split('Title:')[1]?.trim() || '';
      } else if (line.includes('Description:')) {
        currentResult.description = line.split('Description:')[1]?.trim() || '';
      } else if (line.includes('URL:')) {
        currentResult.url = line.split('URL:')[1]?.trim() || '';
      } else if (line.includes('Contact:')) {
        currentResult.contact = line.split('Contact:')[1]?.trim() || '';
      } else if (line.includes('Relevance:')) {
        currentResult.relevance = line.split('Relevance:')[1]?.trim() || 'Medium';
      } else if (line.includes('LastUpdated:')) {
        currentResult.lastUpdated = line.split('LastUpdated:')[1]?.trim() || 'Recently';
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      results.push(currentResult as SearchResult);
    }

    return results.slice(0, 8);
  } catch (error) {
    console.error('Discord search error:', error);
    return [];
  }
}

// Enhanced Forums search focusing on music industry forums
async function searchForums(query: string): Promise<SearchResult[]> {
  const prompt = `Search music industry forums for contacts related to: "${query}".
  Focus on these forum categories:
  
  MUSIC PRODUCTION FORUMS:
  - Gearslutz, KVR Audio, Future Producers
  - Music production and technical forums
  - Equipment and software discussion boards
  
  MUSIC INDUSTRY FORUMS:
  - Music industry business forums
  - Label and management discussion boards
  - Music marketing and promotion forums
  
  GENRE-SPECIFIC FORUMS:
  - Genre-specific music forums
  - Underground and independent music boards
  - Music discovery and sharing forums
  
  RADIO & BROADCASTING FORUMS:
  - Radio station forums and discussion boards
  - Broadcasting and media forums
  - Podcast and audio content forums
  
  Return results in this format:
  - Platform: Forums
  - Title: [Forum name and key members]
  - Description: [What they do, member count, submission process]
  - URL: [Forum URL or specific thread]
  - Contact: [How to contact - forum PM, email, contact form]
  - Relevance: [High/Medium/Low based on query match]
  - LastUpdated: [Recent activity indicator]`;

  try {
    const { content, error } = await makePerplexityRequest(prompt);
    
    if (error || !content) {
      console.error('Forums search error:', error);
      return [];
    }
    
    // Parse the response and extract structured data
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    let currentResult: Partial<SearchResult> = {};
    
    for (const line of lines) {
      if (line.includes('Platform:')) {
        if (Object.keys(currentResult).length > 0) {
          results.push(currentResult as SearchResult);
        }
        currentResult = { platform: 'Forums' };
      } else if (line.includes('Title:')) {
        currentResult.title = line.split('Title:')[1]?.trim() || '';
      } else if (line.includes('Description:')) {
        currentResult.description = line.split('Description:')[1]?.trim() || '';
      } else if (line.includes('URL:')) {
        currentResult.url = line.split('URL:')[1]?.trim() || '';
      } else if (line.includes('Contact:')) {
        currentResult.contact = line.split('Contact:')[1]?.trim() || '';
      } else if (line.includes('Relevance:')) {
        currentResult.relevance = line.split('Relevance:')[1]?.trim() || 'Medium';
      } else if (line.includes('LastUpdated:')) {
        currentResult.lastUpdated = line.split('LastUpdated:')[1]?.trim() || 'Recently';
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      results.push(currentResult as SearchResult);
    }

    return results.slice(0, 8);
  } catch (error) {
    console.error('Forums search error:', error);
    return [];
  }
}

// Enhanced Music Sites search focusing on industry websites
async function searchMusicSites(query: string): Promise<SearchResult[]> {
  const prompt = `Search music industry websites for contacts related to: "${query}".
  Focus on these website categories:
  
  MUSIC BLOGS & PUBLICATIONS:
  - Pitchfork, Rolling Stone, NME, Billboard
  - Stereogum, Consequence, BrooklynVegan
  - Independent music blogs and zines
  
  MUSIC INDUSTRY SITES:
  - Music industry news and business sites
  - Label and management company websites
  - Music marketing and PR firm sites
  
  RADIO & BROADCASTING SITES:
  - Radio station websites and blogs
  - Broadcasting and media company sites
  - Podcast and audio content platforms
  
  MUSIC PLATFORMS & SERVICES:
  - Music streaming platform blogs
  - Music distribution and promotion services
  - Music industry tool and service providers
  
  Return results in this format:
  - Platform: Music Sites
  - Title: [Website name and key contacts]
  - Description: [What they do, audience size, submission process]
  - URL: [Website URL or contact page]
  - Contact: [How to contact - email, contact form, submission guidelines]
  - Relevance: [High/Medium/Low based on query match]
  - LastUpdated: [Recent activity indicator]`;

  try {
    const { content, error } = await makePerplexityRequest(prompt);
    
    if (error || !content) {
      console.error('Music Sites search error:', error);
      return [];
    }
    
    // Parse the response and extract structured data
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    let currentResult: Partial<SearchResult> = {};
    
    for (const line of lines) {
      if (line.includes('Platform:')) {
        if (Object.keys(currentResult).length > 0) {
          results.push(currentResult as SearchResult);
        }
        currentResult = { platform: 'Music Sites' };
      } else if (line.includes('Title:')) {
        currentResult.title = line.split('Title:')[1]?.trim() || '';
      } else if (line.includes('Description:')) {
        currentResult.description = line.split('Description:')[1]?.trim() || '';
      } else if (line.includes('URL:')) {
        currentResult.url = line.split('URL:')[1]?.trim() || '';
      } else if (line.includes('Contact:')) {
        currentResult.contact = line.split('Contact:')[1]?.trim() || '';
      } else if (line.includes('Relevance:')) {
        currentResult.relevance = line.split('Relevance:')[1]?.trim() || 'Medium';
      } else if (line.includes('LastUpdated:')) {
        currentResult.lastUpdated = line.split('LastUpdated:')[1]?.trim() || 'Recently';
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      results.push(currentResult as SearchResult);
    }

    return results.slice(0, 8);
  } catch (error) {
    console.error('Music Sites search error:', error);
    return [];
  }
}

// Enhanced LinkedIn search focusing on music industry professionals
async function searchLinkedIn(query: string): Promise<SearchResult[]> {
  const prompt = `Search LinkedIn for music industry contacts related to: "${query}".
  Focus on these LinkedIn categories:
  
  MUSIC INDUSTRY PROFESSIONALS:
  - Record label executives and A&R representatives
  - Music managers and agents
  - Music marketing and PR professionals
  
  RADIO & BROADCASTING:
  - Radio station managers and DJs
  - Broadcasting company executives
  - Podcast hosts and audio content creators
  
  MUSIC MEDIA & JOURNALISM:
  - Music journalists and critics
  - Music publication editors and writers
  - Music industry bloggers and content creators
  
  MUSIC PLATFORMS & SERVICES:
  - Streaming platform executives
  - Music distribution and promotion services
  - Music industry tool and service providers
  
  Return results in this format:
  - Platform: LinkedIn
  - Title: [Professional name and title]
  - Description: [What they do, company, submission process]
  - URL: [LinkedIn profile URL]
  - Contact: [How to contact - LinkedIn message, email, company contact]
  - Relevance: [High/Medium/Low based on query match]
  - LastUpdated: [Recent activity indicator]`;

  try {
    const { content, error } = await makePerplexityRequest(prompt);
    
    if (error || !content) {
      console.error('LinkedIn search error:', error);
      return [];
    }
    
    // Parse the response and extract structured data
    const results: SearchResult[] = [];
    const lines = content.split('\n');
    let currentResult: Partial<SearchResult> = {};
    
    for (const line of lines) {
      if (line.includes('Platform:')) {
        if (Object.keys(currentResult).length > 0) {
          results.push(currentResult as SearchResult);
        }
        currentResult = { platform: 'LinkedIn' };
      } else if (line.includes('Title:')) {
        currentResult.title = line.split('Title:')[1]?.trim() || '';
      } else if (line.includes('Description:')) {
        currentResult.description = line.split('Description:')[1]?.trim() || '';
      } else if (line.includes('URL:')) {
        currentResult.url = line.split('URL:')[1]?.trim() || '';
      } else if (line.includes('Contact:')) {
        currentResult.contact = line.split('Contact:')[1]?.trim() || '';
      } else if (line.includes('Relevance:')) {
        currentResult.relevance = line.split('Relevance:')[1]?.trim() || 'Medium';
      } else if (line.includes('LastUpdated:')) {
        currentResult.lastUpdated = line.split('LastUpdated:')[1]?.trim() || 'Recently';
      }
    }
    
    if (Object.keys(currentResult).length > 0) {
      results.push(currentResult as SearchResult);
    }

    return results.slice(0, 8);
  } catch (error) {
    console.error('LinkedIn search error:', error);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: SearchRequest = await req.json();
    const { query, platforms = ['all'] } = body;

    if (!query || !query.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query is required' 
      }, { status: 400 });
    }

    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Search API not configured' 
      }, { status: 500 });
    }

    const allResults: SearchResult[] = [];
    const searchPromises: Promise<SearchResult[]>[] = [];

    // Determine which platforms to search
    const platformsToSearch = platforms.includes('all') 
      ? ['reddit', 'instagram', 'spotify', 'discord', 'forums', 'music-sites', 'linkedin']
      : platforms;

    // Add search promises for each platform
    if (platformsToSearch.includes('reddit')) {
      searchPromises.push(searchReddit(query));
    }
    if (platformsToSearch.includes('instagram')) {
      searchPromises.push(searchInstagram(query));
    }
    if (platformsToSearch.includes('spotify')) {
      searchPromises.push(searchSpotify(query));
    }
    if (platformsToSearch.includes('discord')) {
      searchPromises.push(searchDiscord(query));
    }
    if (platformsToSearch.includes('forums')) {
      searchPromises.push(searchForums(query));
    }
    if (platformsToSearch.includes('music-sites')) {
      searchPromises.push(searchMusicSites(query));
    }
    if (platformsToSearch.includes('linkedin')) {
      searchPromises.push(searchLinkedIn(query));
    }

    // Execute all searches in parallel with timeout
    const timeoutPromise = new Promise<SearchResult[]>((resolve) => {
      setTimeout(() => resolve([]), 25000); // 25 second timeout
    });

    const results = await Promise.race([
      Promise.allSettled(searchPromises),
      timeoutPromise.then(() => Promise.allSettled(searchPromises))
    ]);
    
    // Combine results from all platforms
    if (Array.isArray(results)) {
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value);
        }
      });
    }

    // Sort by relevance (High > Medium > Low) and limit total results
    const sortedResults = allResults.sort((a, b) => {
      const relevanceOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return (relevanceOrder[b.relevance as keyof typeof relevanceOrder] || 0) - 
             (relevanceOrder[a.relevance as keyof typeof relevanceOrder] || 0);
    });

    return NextResponse.json({
      success: true,
      query,
      platforms: platformsToSearch,
      results: sortedResults.slice(0, 24), // Limit to 24 total results
      totalFound: allResults.length
    });

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Search processing failed' 
    }, { status: 500 });
  }
}

export async function GET() {
  return new Response('This endpoint only supports POST requests.', { status: 405 });
} 
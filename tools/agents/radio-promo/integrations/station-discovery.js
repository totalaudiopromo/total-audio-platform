#!/usr/bin/env node

/**
 * Station Discovery System
 * 
 * Uses Claude and Firecrawl to research and discover new radio stations
 * and contacts that aren't in the existing database
 */

const fs = require('fs');
const path = require('path');

class StationDiscovery {
  constructor() {
    this.claudeApiKey = process.env.CLAUDE_API_KEY;
    this.firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    this.claudeBaseUrl = 'https://api.anthropic.com/v1/messages';
    this.firecrawlBaseUrl = 'https://api.firecrawl.dev/v1';
    
    // Discovery cache to avoid duplicate research
    this.discoveryCache = new Map();
    this.cacheFile = path.join(__dirname, '..', 'data', 'discovery-cache.json');
    this.loadCache();
    
    // Research patterns and strategies
    this.researchStrategies = this.loadResearchStrategies();
  }

  /**
   * Discover new stations for a specific genre and region
   */
  async discoverStations(genre, region = 'UK', maxStations = 20) {
    console.log(`🔍 Discovering ${genre} stations in ${region}...`);
    
    try {
      // Check cache first
      const cacheKey = `${genre}-${region}`;
      if (this.discoveryCache.has(cacheKey)) {
        const cached = this.discoveryCache.get(cacheKey);
        if (this.isCacheValid(cached)) {
          console.log(`✅ Using cached discovery data for ${genre} in ${region}`);
          return cached.stations;
        }
      }
      
      // Research strategy based on genre
      const strategy = this.getResearchStrategy(genre, region);
      
      // Discover stations using multiple methods
      const discoveryResults = await Promise.allSettled([
        this.researchRadioStations(genre, region, strategy),
        this.researchOnlineStations(genre, region, strategy),
        this.researchSpecialistShows(genre, region, strategy),
        this.researchCommunityStations(genre, region, strategy)
      ]);
      
      // Combine and deduplicate results
      const allStations = [];
      discoveryResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          allStations.push(...result.value);
        }
      });
      
      const uniqueStations = this.deduplicateStations(allStations);
      const rankedStations = this.rankStations(uniqueStations, genre, region);
      const topStations = rankedStations.slice(0, maxStations);
      
      // Cache results
      this.discoveryCache.set(cacheKey, {
        stations: topStations,
        timestamp: Date.now(),
        genre,
        region
      });
      this.saveCache();
      
      console.log(`✅ Discovered ${topStations.length} new ${genre} stations in ${region}`);
      return topStations;
      
    } catch (error) {
      console.error(`❌ Station discovery failed for ${genre} in ${region}:`, error.message);
      return [];
    }
  }

  /**
   * Research radio stations using Claude and web search
   */
  async researchRadioStations(genre, region, strategy) {
    console.log(`📻 Researching radio stations for ${genre}...`);
    
    try {
      const prompt = this.buildRadioResearchPrompt(genre, region, strategy);
      const claudeResponse = await this.callClaude(prompt);
      
      // Extract station information from Claude response
      const stations = this.extractStationsFromClaude(claudeResponse, 'radio');
      
      // Research each station for contact details
      const enrichedStations = await this.enrichStationContacts(stations);
      
      return enrichedStations;
      
    } catch (error) {
      console.error('❌ Radio station research failed:', error.message);
      return [];
    }
  }

  /**
   * Research online stations and streaming platforms
   */
  async researchOnlineStations(genre, region, strategy) {
    console.log(`🌐 Researching online stations for ${genre}...`);
    
    try {
      const prompt = this.buildOnlineResearchPrompt(genre, region, strategy);
      const claudeResponse = await this.callClaude(prompt);
      
      const stations = this.extractStationsFromClaude(claudeResponse, 'online');
      const enrichedStations = await this.enrichStationContacts(stations);
      
      return enrichedStations;
      
    } catch (error) {
      console.error('❌ Online station research failed:', error.message);
      return [];
    }
  }

  /**
   * Research specialist shows and DJs
   */
  async researchSpecialistShows(genre, region, strategy) {
    console.log(`🎧 Researching specialist shows for ${genre}...`);
    
    try {
      const prompt = this.buildSpecialistResearchPrompt(genre, region, strategy);
      const claudeResponse = await this.callClaude(prompt);
      
      const stations = this.extractStationsFromClaude(claudeResponse, 'specialist');
      const enrichedStations = await this.enrichStationContacts(stations);
      
      return enrichedStations;
      
    } catch (error) {
      console.error('❌ Specialist show research failed:', error.message);
      return [];
    }
  }

  /**
   * Research community and local stations
   */
  async researchCommunityStations(genre, region, strategy) {
    console.log(`🏘️ Researching community stations for ${genre}...`);
    
    try {
      const prompt = this.buildCommunityResearchPrompt(genre, region, strategy);
      const claudeResponse = await this.callClaude(prompt);
      
      const stations = this.extractStationsFromClaude(claudeResponse, 'community');
      const enrichedStations = await this.enrichStationContacts(stations);
      
      return enrichedStations;
      
    } catch (error) {
      console.error('❌ Community station research failed:', error.message);
      return [];
    }
  }

  /**
   * Enrich station contacts using Firecrawl
   */
  async enrichStationContacts(stations) {
    console.log(`🔍 Enriching contact details for ${stations.length} stations...`);
    
    const enrichedStations = [];
    
    for (const station of stations) {
      try {
        if (station.website) {
          const contactInfo = await this.researchStationWebsite(station.website);
          enrichedStations.push({
            ...station,
            ...contactInfo,
            lastResearched: new Date().toISOString(),
            researchMethod: 'firecrawl'
          });
        } else {
          enrichedStations.push({
            ...station,
            lastResearched: new Date().toISOString(),
            researchMethod: 'claude'
          });
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to enrich ${station.name}:`, error.message);
        enrichedStations.push({
          ...station,
          lastResearched: new Date().toISOString(),
          researchMethod: 'claude',
          errors: [error.message]
        });
      }
    }
    
    return enrichedStations;
  }

  /**
   * Research station website using Firecrawl
   */
  async researchStationWebsite(website) {
    try {
      const response = await fetch(`${this.firecrawlBaseUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.firecrawlApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: website,
          formats: ['markdown'],
          onlyMainContent: true,
          maxDepth: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`Firecrawl API error: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.data?.markdown || '';
      
      // Extract contact information using Claude
      const contactInfo = await this.extractContactInfo(content, website);
      
      return contactInfo;
      
    } catch (error) {
      console.error(`❌ Website research failed for ${website}:`, error.message);
      return {};
    }
  }

  /**
   * Extract contact information from website content
   */
  async extractContactInfo(content, website) {
    try {
      const prompt = `Extract contact information from this radio station website content:

Website: ${website}
Content: ${content.substring(0, 2000)}...

Please extract and return ONLY a JSON object with these fields:
{
  "contactName": "Name of music director or contact person",
  "email": "Contact email address",
  "phone": "Phone number if available",
  "submissionEmail": "Specific submission email if different",
  "submissionGuidelines": "Brief submission guidelines",
  "showTimes": "Relevant show times or schedule info",
  "genreFocus": ["array", "of", "genres", "they", "focus", "on"],
  "stationType": "radio|online|specialist|community",
  "reach": "local|regional|national|international",
  "audience": "Brief description of target audience",
  "submissionPreferences": "How they prefer to receive submissions"
}

If any field is not available, use null. Be concise and accurate.`;

      const claudeResponse = await this.callClaude(prompt);
      const contactInfo = JSON.parse(claudeResponse);
      
      return contactInfo;
      
    } catch (error) {
      console.error('❌ Contact extraction failed:', error.message);
      return {};
    }
  }

  /**
   * Call Claude API
   */
  async callClaude(prompt) {
    try {
      const response = await fetch(this.claudeBaseUrl, {
        method: 'POST',
        headers: {
          'x-api-key': this.claudeApiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.content[0].text;
      
    } catch (error) {
      console.error('❌ Claude API call failed:', error.message);
      throw error;
    }
  }

  /**
   * Build research prompts
   */
  buildRadioResearchPrompt(genre, region, strategy) {
    return `Research UK radio stations that play ${genre} music. Focus on:

1. **Commercial Radio Stations** - Capital, Heart, Kiss FM, Magic, Smooth Radio, Absolute Radio
2. **BBC Stations** - Radio 1, Radio 2, 6 Music, 1Xtra, local BBC stations
3. **Regional Commercial** - Key 103, Radio City, Clyde 1, Wave 105, etc.
4. **Digital Radio** - DAB stations that play ${genre}

For each station, provide:
- Station name
- Station type (BBC/Commercial/Regional/Online)
- Website URL
- Genre focus (what genres they play)
- Target audience
- Contact information if available
- Submission guidelines if known

Focus on stations that actively play ${genre} music and accept submissions from independent artists.

Return as a structured list with clear station information.`;
  }

  buildOnlineResearchPrompt(genre, region, strategy) {
    return `Research online radio stations and streaming platforms that play ${genre} music in the UK:

1. **Online Radio Stations** - Amazing Radio, Boom Radio, Union JACK, Planet Radio
2. **Streaming Platforms** - Spotify playlists, Apple Music, YouTube channels
3. **Podcast Networks** - Music podcasts that feature ${genre}
4. **Community Platforms** - Discord servers, Reddit communities, forums

For each platform, provide:
- Platform name
- Type (online radio/streaming/podcast/community)
- Website or platform URL
- Genre focus
- Submission process
- Contact information
- Audience size/engagement

Focus on platforms that actively support independent ${genre} artists and accept submissions.

Return as a structured list with clear platform information.`;
  }

  buildSpecialistResearchPrompt(genre, region, strategy) {
    return `Research specialist music shows and DJs that play ${genre} music in the UK:

1. **BBC Specialist Shows** - 6 Music shows, Radio 1 specialist shows, local BBC specialist programming
2. **Commercial Specialist** - Specialist shows on commercial stations
3. **Online Specialist** - Specialist online shows, podcasts, streaming shows
4. **Club/Event DJs** - DJs who play ${genre} at clubs and events

For each show/DJ, provide:
- Show/DJ name
- Station/platform
- Show times/schedule
- Genre focus
- Contact information
- Submission preferences
- Audience description

Focus on shows that actively support independent ${genre} artists and accept submissions.

Return as a structured list with clear show/DJ information.`;
  }

  buildCommunityResearchPrompt(genre, region, strategy) {
    return `Research community radio stations and local platforms that play ${genre} music in the UK:

1. **Community Radio** - Local community stations, hospital radio, student radio
2. **Local Music Scenes** - Local venues, promoters, music collectives
3. **Regional Platforms** - Regional music blogs, local music websites
4. **Grassroots Networks** - Independent music networks, artist collectives

For each platform, provide:
- Platform name
- Location/region
- Type (community radio/local venue/website/collective)
- Contact information
- Submission process
- Genre focus
- Local reach

Focus on platforms that support local ${genre} artists and accept submissions.

Return as a structured list with clear platform information.`;
  }

  /**
   * Extract stations from Claude response
   */
  extractStationsFromClaude(response, stationType) {
    const stations = [];
    const lines = response.split('\n');
    
    let currentStation = {};
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^\d+\.|^[-*]\s/)) {
        // New station entry
        if (currentStation.name) {
          stations.push({
            ...currentStation,
            stationType,
            discoveredAt: new Date().toISOString()
          });
        }
        currentStation = { name: trimmedLine.replace(/^\d+\.|^[-*]\s/, '').trim() };
      } else if (trimmedLine.includes('Website:') || trimmedLine.includes('URL:')) {
        currentStation.website = trimmedLine.split(':')[1]?.trim();
      } else if (trimmedLine.includes('Contact:') || trimmedLine.includes('Email:')) {
        currentStation.email = trimmedLine.split(':')[1]?.trim();
      } else if (trimmedLine.includes('Genre:')) {
        currentStation.genreFocus = trimmedLine.split(':')[1]?.trim().split(',').map(g => g.trim());
      } else if (trimmedLine.includes('Audience:')) {
        currentStation.audience = trimmedLine.split(':')[1]?.trim();
      } else if (trimmedLine.includes('Submission:')) {
        currentStation.submissionGuidelines = trimmedLine.split(':')[1]?.trim();
      }
    }
    
    // Add the last station
    if (currentStation.name) {
      stations.push({
        ...currentStation,
        stationType,
        discoveredAt: new Date().toISOString()
      });
    }
    
    return stations;
  }

  /**
   * Deduplicate stations
   */
  deduplicateStations(stations) {
    const seen = new Set();
    return stations.filter(station => {
      const key = station.name?.toLowerCase() || station.website?.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Rank stations by relevance
   */
  rankStations(stations, genre, region) {
    return stations.map(station => {
      let score = 0;
      
      // Base score
      score += 50;
      
      // Genre match bonus
      if (station.genreFocus && station.genreFocus.some(g => 
        g.toLowerCase().includes(genre.toLowerCase()) || 
        genre.toLowerCase().includes(g.toLowerCase())
      )) {
        score += 30;
      }
      
      // Contact information bonus
      if (station.email) score += 20;
      if (station.website) score += 10;
      if (station.submissionGuidelines) score += 15;
      
      // Station type bonus
      const typeScores = {
        'radio': 25,
        'online': 20,
        'specialist': 30,
        'community': 15
      };
      score += typeScores[station.stationType] || 10;
      
      // Reach bonus
      const reachScores = {
        'national': 25,
        'regional': 20,
        'local': 10,
        'international': 15
      };
      score += reachScores[station.reach] || 10;
      
      return { ...station, score };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Get research strategy for genre
   */
  getResearchStrategy(genre, region) {
    const strategies = {
      'Pop': {
        focus: 'Commercial radio, BBC Radio 1/2, mainstream platforms',
        priority: 'Commercial, BBC, Regional'
      },
      'Dance': {
        focus: 'Dance stations, club radio, specialist shows',
        priority: 'Specialist, Online, Commercial'
      },
      'Electronic': {
        focus: 'Specialist shows, online platforms, experimental radio',
        priority: 'Specialist, Online, Community'
      },
      'Indie': {
        focus: 'BBC 6 Music, specialist shows, online platforms',
        priority: 'Specialist, Online, Community'
      },
      'Rock': {
        focus: 'Rock stations, specialist shows, commercial radio',
        priority: 'Commercial, Specialist, Regional'
      },
      'Hip-Hop': {
        focus: 'Urban stations, specialist shows, online platforms',
        priority: 'Specialist, Online, Commercial'
      }
    };
    
    return strategies[genre] || {
      focus: 'General music platforms and stations',
      priority: 'Commercial, BBC, Regional'
    };
  }

  /**
   * Cache management
   */
  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        this.discoveryCache = new Map(data);
        console.log(`📚 Loaded ${this.discoveryCache.size} cached discoveries`);
      }
    } catch (error) {
      console.error('⚠️  Failed to load discovery cache:', error.message);
    }
  }

  saveCache() {
    try {
      const dataDir = path.dirname(this.cacheFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const data = Array.from(this.discoveryCache.entries());
      fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('❌ Failed to save discovery cache:', error.message);
    }
  }

  isCacheValid(cached) {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const age = Date.now() - cached.timestamp;
    return age < maxAge;
  }

  loadResearchStrategies() {
    return {
      'Pop': {
        keywords: ['pop', 'mainstream', 'commercial', 'chart', 'hit'],
        platforms: ['BBC Radio 1', 'Capital FM', 'Heart', 'Kiss FM'],
        focus: 'Commercial appeal and mainstream success'
      },
      'Dance': {
        keywords: ['dance', 'electronic', 'club', 'beat', 'rhythm'],
        platforms: ['BBC Radio 1Xtra', 'Kiss FM', 'Ministry of Sound', 'Amazing Radio'],
        focus: 'Dancefloor appeal and club potential'
      },
      'Electronic': {
        keywords: ['electronic', 'ambient', 'experimental', 'synthetic', 'techno'],
        platforms: ['BBC 6 Music', 'Amazing Radio', 'Online platforms'],
        focus: 'Artistic integrity and experimental sound'
      },
      'Indie': {
        keywords: ['indie', 'alternative', 'underground', 'independent', 'authentic'],
        platforms: ['BBC 6 Music', 'Amazing Radio', 'Online platforms'],
        focus: 'Authentic sound and artistic vision'
      }
    };
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      status: 'healthy',
      claudeApi: !!this.claudeApiKey,
      firecrawlApi: !!this.firecrawlApiKey,
      cacheSize: this.discoveryCache.size,
      lastChecked: new Date().toISOString()
    };
  }
}

module.exports = StationDiscovery;

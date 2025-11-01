import { PerplexityService } from '../integrations/perplexity';
import { FirecrawlService } from '../integrations/firecrawl';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

interface Curator {
  name: string;
  platform: 'spotify' | 'instagram' | 'reddit' | 'blog' | 'radio';
  genre: string;
  followers?: number;
  email?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  source: string;
  lastUpdated: Date;
}

export class CuratorDiscoveryService {
  private perplexity: PerplexityService;
  private firecrawl: FirecrawlService;

  constructor(perplexityApiKey: string, firecrawlApiKey: string) {
    this.perplexity = new PerplexityService(perplexityApiKey);
    this.firecrawl = new FirecrawlService(firecrawlApiKey);
  }

  async discoverSpotifyCurators(genre: string): Promise<Curator[]> {
    try {
      const prompt = `Find Spotify playlist curators who specialize in ${genre} music. 
      Include both official Spotify editorial playlists and independent curators.
      Focus on playlists with significant followings and active curation.`;

      const response = await this.perplexity.findJournalists(`Spotify ${genre} playlist curation`);

      // Parse and enrich the data
      const curators = this.parseCuratorData(response.journalists, 'spotify', genre);

      // Enrich with contact information
      for (const curator of curators) {
        if (curator.socialMedia?.website) {
          const contactInfo = await this.firecrawl.scrapeJournalistContacts(
            curator.socialMedia.website
          );
          if (contactInfo.success && contactInfo.contacts.length > 0) {
            curator.contactInfo = contactInfo.contacts[0];
          }
        }
      }

      return curators;
    } catch (error) {
      logger.error('Spotify curator discovery error:', error);
      return [];
    }
  }

  async discoverInstagramCurators(genre: string): Promise<Curator[]> {
    try {
      const prompt = `Find Instagram accounts that curate and share ${genre} music.
      Focus on accounts with significant followings that regularly post about new music discoveries.
      Include music blogs, influencers, and discovery accounts.`;

      const response = await this.perplexity.findJournalists(`Instagram ${genre} music curation`);

      const curators = this.parseCuratorData(response.journalists, 'instagram', genre);

      // Try to find contact information from bio links
      for (const curator of curators) {
        if (curator.socialMedia?.website) {
          const contactInfo = await this.firecrawl.extractContactInfo(
            await this.firecrawl.scrapeWebsite(curator.socialMedia.website)
          );
          if (contactInfo.emails.length > 0) {
            curator.contactInfo = {
              email: contactInfo.emails[0],
              location: curator.contactInfo?.location,
            };
          }
        }
      }

      return curators;
    } catch (error) {
      logger.error('Instagram curator discovery error:', error);
      return [];
    }
  }

  async discoverRedditCurators(genre: string): Promise<Curator[]> {
    try {
      const subreddits = this.getGenreSubreddits(genre);
      const curators: Curator[] = [];

      for (const subreddit of subreddits) {
        // Scrape Reddit for active moderators and contributors
        const redditUrl = `https://www.reddit.com/r/${subreddit}/`;
        const scrapingResult = await this.firecrawl.scrapeWebsite(redditUrl, {
          extractEmails: true,
          extractSocialMedia: true,
        });

        if (scrapingResult.success && scrapingResult.data) {
          // Parse Reddit data for curators
          const redditCurators = this.parseRedditData(scrapingResult.data, subreddit, genre);
          curators.push(...redditCurators);
        }
      }

      return curators;
    } catch (error) {
      logger.error('Reddit curator discovery error:', error);
      return [];
    }
  }

  async discoverBlogCurators(genre: string): Promise<Curator[]> {
    try {
      const musicBlogs = this.getMusicBlogs(genre);
      const curators: Curator[] = [];

      for (const blog of musicBlogs) {
        const scrapingResult = await this.firecrawl.scrapeJournalistContacts(blog.url);

        if (scrapingResult.success) {
          const blogCurators = scrapingResult.contacts.map(contact => ({
            name: contact.name,
            platform: 'blog' as const,
            genre,
            email: contact.email,
            socialMedia: {
              website: blog.url,
              twitter: blog.twitter,
            },
            contactInfo: {
              email: contact.email,
              phone: contact.phone,
              title: contact.title,
            },
            source: `Music Blog: ${blog.name}`,
            lastUpdated: new Date(),
          }));

          curators.push(...blogCurators);
        }
      }

      return curators;
    } catch (error) {
      logger.error('Blog curator discovery error:', error);
      return [];
    }
  }

  private parseCuratorData(journalists: any[], platform: string, genre: string): Curator[] {
    return journalists.map(journalist => ({
      name: journalist.name,
      platform: platform as any,
      genre,
      followers: this.extractFollowers(journalist),
      email: journalist.email,
      socialMedia: {
        instagram: journalist.instagram,
        twitter: journalist.twitter,
        website: journalist.website,
      },
      contactInfo: {
        email: journalist.email,
        location: journalist.location,
      },
      source: `AI Discovery: ${platform}`,
      lastUpdated: new Date(),
    }));
  }

  private parseRedditData(data: any, subreddit: string, genre: string): Curator[] {
    // Parse Reddit scraping results for curator information
    const curators: Curator[] = [];

    // Extract moderator information and active contributors
    if (data.contactInfo) {
      data.contactInfo.forEach((contact: any) => {
        curators.push({
          name: contact.name || `Reddit User: ${subreddit}`,
          platform: 'reddit',
          genre,
          email: contact.email,
          socialMedia: {
            website: `https://reddit.com/r/${subreddit}`,
          },
          contactInfo: {
            email: contact.email,
            title: contact.title,
          },
          source: `Reddit: r/${subreddit}`,
          lastUpdated: new Date(),
        });
      });
    }

    return curators;
  }

  private getGenreSubreddits(genre: string): string[] {
    const genreMap: Record<string, string[]> = {
      rock: ['indieheads', 'rock', 'listentothis'],
      'hip-hop': ['hiphopheads', 'trap', 'listentothis'],
      electronic: ['electronicmusic', 'edm', 'listentothis'],
      pop: ['popheads', 'listentothis'],
      indie: ['indieheads', 'listentothis'],
      jazz: ['jazz', 'listentothis'],
      classical: ['classicalmusic', 'listentothis'],
    };

    return genreMap[genre.toLowerCase()] || ['listentothis'];
  }

  private getMusicBlogs(genre: string): Array<{ name: string; url: string; twitter?: string }> {
    const blogs = [
      { name: 'Pitchfork', url: 'https://pitchfork.com', twitter: '@pitchfork' },
      { name: 'Stereogum', url: 'https://stereogum.com', twitter: '@stereogum' },
      { name: 'Consequence of Sound', url: 'https://consequence.net', twitter: '@consequence' },
      { name: 'BrooklynVegan', url: 'https://brooklynvegan.com', twitter: '@brooklynvegan' },
    ];

    return blogs;
  }

  private extractFollowers(journalist: any): number | undefined {
    // Extract follower count from various sources
    if (journalist.followers) return journalist.followers;
    if (journalist.instagram) {
      // Could implement Instagram API to get follower count
      return undefined;
    }
    return undefined;
  }

  async saveCuratorsToDatabase(curators: Curator[], userId: string): Promise<void> {
    try {
      for (const curator of curators) {
        await prisma.contact.upsert({
          where: {
            email: curator.email || curator.name,
          },
          update: {
            name: curator.name,
            email: curator.email || `${curator.name}@${curator.platform}.com`,
            company: curator.source,
            role: `${curator.platform} curator`,
            genre: curator.genre,
            tags: [curator.platform, curator.genre, 'curator'],
            lastContactedAt: new Date(),
          },
          create: {
            name: curator.name,
            email: curator.email || `${curator.name}@${curator.platform}.com`,
            company: curator.source,
            role: `${curator.platform} curator`,
            genre: curator.genre,
            tags: [curator.platform, curator.genre, 'curator'],
            status: 'ACTIVE',
          },
        });
      }

      logger.info(`Saved ${curators.length} curators to database for user ${userId}`);
    } catch (error) {
      logger.error('Error saving curators to database:', error);
      throw error;
    }
  }
}

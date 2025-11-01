import { PuppeteerPlatform } from './puppeteer-platform';
import { LinkedInAPI } from './linkedin-api';
import { BlueSkyAPI } from './bluesky-api';
import { FacebookAPI } from './facebook-api';

export interface PostContent {
  text: string;
  hashtags: string[];
  media?: string[];
  scheduledTime?: string;
}

export interface PostResult {
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
  verification?: {
    contentHash: string;
    duplicateCheck: boolean;
    platformSpecific: any;
  };
}

export interface SocialPlatform {
  name: string;
  authenticate(): Promise<boolean>;
  checkDuplicates(content: string): Promise<boolean>;
  verifyContent(content: PostContent): Promise<{ valid: boolean; warnings: string[] }>;
  post(content: PostContent): Promise<PostResult>;
  getRecentPosts(limit?: number): Promise<any[]>;
}

// Platform factory
export class SocialMediaManager {
  private platforms: Map<string, SocialPlatform> = new Map();

  constructor() {
    // Initialize platforms
    this.platforms.set('twitter', new PuppeteerPlatform('twitter'));
    this.platforms.set('linkedin', new LinkedInAPI());
    this.platforms.set('bluesky', new BlueSkyAPI());
    this.platforms.set('facebook', new FacebookAPI());
  }

  async verifyAllContent(
    content: PostContent,
    platformNames: string[]
  ): Promise<
    {
      platform: string;
      valid: boolean;
      warnings: string[];
      duplicateDetected: boolean;
    }[]
  > {
    const results = [];

    for (const platformName of platformNames) {
      const platform = this.platforms.get(platformName);
      if (!platform) {
        results.push({
          platform: platformName,
          valid: false,
          warnings: ['Platform not found'],
          duplicateDetected: false,
        });
        continue;
      }

      try {
        const verification = await platform.verifyContent(content);
        const duplicateCheck = await platform.checkDuplicates(content.text);

        results.push({
          platform: platformName,
          valid: verification.valid,
          warnings: verification.warnings,
          duplicateDetected: duplicateCheck,
        });
      } catch (error) {
        results.push({
          platform: platformName,
          valid: false,
          warnings: [
            `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ],
          duplicateDetected: false,
        });
      }
    }

    return results;
  }

  async postToMultiplePlatforms(
    content: PostContent,
    platformNames: string[],
    verifyFirst: boolean = true
  ): Promise<
    {
      platform: string;
      result: PostResult;
    }[]
  > {
    const results = [];

    // Verify content first if requested
    if (verifyFirst) {
      const verification = await this.verifyAllContent(content, platformNames);
      const hasErrors = verification.some(v => !v.valid || v.duplicateDetected);

      if (hasErrors) {
        console.log('🚨 Content verification failed:', verification);
        throw new Error('Content verification failed. Check logs for details.');
      }
    }

    // Post to each platform
    for (const platformName of platformNames) {
      const platform = this.platforms.get(platformName);
      if (!platform) {
        results.push({
          platform: platformName,
          result: { success: false, error: 'Platform not found' },
        });
        continue;
      }

      try {
        const result = await platform.post(content);
        results.push({
          platform: platformName,
          result,
        });
      } catch (error) {
        results.push({
          platform: platformName,
          result: {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    return results;
  }

  getPlatform(name: string): SocialPlatform | undefined {
    return this.platforms.get(name);
  }

  async authenticateAll(): Promise<{ [platform: string]: boolean }> {
    const results: { [platform: string]: boolean } = {};

    for (const [name, platform] of this.platforms) {
      try {
        results[name] = await platform.authenticate();
      } catch (error) {
        console.error(`Authentication failed for ${name}:`, error);
        results[name] = false;
      }
    }

    return results;
  }
}

const socialMediaManager = new SocialMediaManager();
export default socialMediaManager;

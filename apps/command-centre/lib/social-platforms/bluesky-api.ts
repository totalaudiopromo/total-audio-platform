import { SocialPlatform, PostContent, PostResult } from './index';
import crypto from 'crypto';

/**
 * BlueSky API Integration
 * BlueSky has a free, open API - perfect for automation!
 */
export class BlueSkyAPI implements SocialPlatform {
  name = 'bluesky';
  private apiUrl = 'https://bsky.social/xrpc';
  private accessToken: string | null = null;
  private did: string | null = null;
  private recentPosts: string[] = [];

  async authenticate(): Promise<boolean> {
    try {
      // BlueSky authentication
      const identifier = process.env.BLUESKY_IDENTIFIER; // your-handle.bsky.social
      const password = process.env.BLUESKY_APP_PASSWORD; // App password, not main password

      if (!identifier || !password) {
        console.log('🔐 BlueSky credentials not found in environment variables');
        console.log('Set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD');
        return false;
      }

      const response = await fetch(`${this.apiUrl}/com.atproto.server.createSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('BlueSky authentication failed:', error);
        return false;
      }

      const session = await response.json();
      this.accessToken = session.accessJwt;
      this.did = session.did;

      console.log('✅ BlueSky authenticated successfully');
      return true;
    } catch (error) {
      console.error('BlueSky authentication error:', error);
      return false;
    }
  }

  async checkDuplicates(content: string): Promise<boolean> {
    const contentHash = crypto.createHash('md5').update(content).digest('hex');
    return this.recentPosts.includes(contentHash);
  }

  async verifyContent(content: PostContent): Promise<{ valid: boolean; warnings: string[] }> {
    const warnings: string[] = [];
    let valid = true;

    // BlueSky character limit is 300
    const totalLength = content.text.length + content.hashtags.join(' ').length;
    if (totalLength > 300) {
      warnings.push(`Content exceeds 300 character limit (${totalLength})`);
      valid = false;
    }

    // Check for Audio Intel branding
    if (
      !content.text.toLowerCase().includes('audio intel') &&
      !content.hashtags.some(tag => tag.toLowerCase().includes('audiointel'))
    ) {
      warnings.push('Consider mentioning Audio Intel or including #AudioIntel hashtag');
    }

    return { valid, warnings };
  }

  async post(content: PostContent): Promise<PostResult> {
    if (!this.accessToken || !this.did) {
      return {
        success: false,
        error: 'Not authenticated with BlueSky',
      };
    }

    try {
      const contentHash = crypto.createHash('md5').update(content.text).digest('hex');

      // Check for duplicates
      if (this.recentPosts.includes(contentHash)) {
        return {
          success: false,
          error: 'Duplicate content detected',
        };
      }

      const fullText = `${content.text}\n\n${content.hashtags.join(' ')}`;

      const postData = {
        repo: this.did,
        collection: 'app.bsky.feed.post',
        record: {
          text: fullText,
          createdAt: new Date().toISOString(),
          $type: 'app.bsky.feed.post',
        },
      };

      const response = await fetch(`${this.apiUrl}/com.atproto.repo.createRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `BlueSky API error: ${error}`,
        };
      }

      const result = await response.json();

      // Track successful post
      this.recentPosts.push(contentHash);
      if (this.recentPosts.length > 50) {
        this.recentPosts = this.recentPosts.slice(-50);
      }

      console.log('✅ Posted to BlueSky successfully');

      return {
        success: true,
        postId: result.uri,
        url: `https://bsky.app/profile/${this.did.replace('did:plc:', '')}/post/${result.uri.split('/').pop()}`,
        verification: {
          contentHash,
          duplicateCheck: false,
          platformSpecific: {
            did: this.did,
            uri: result.uri,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getRecentPosts(limit: number = 10): Promise<any[]> {
    if (!this.accessToken || !this.did) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/app.bsky.feed.getAuthorFeed?actor=${this.did}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.feed || [];
    } catch (error) {
      console.error('Error fetching BlueSky recent posts:', error);
      return [];
    }
  }
}

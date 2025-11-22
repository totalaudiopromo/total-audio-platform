import { SocialPlatform, PostContent, PostResult } from './index';
import crypto from 'crypto';

/**
 * LinkedIn API Integration
 * LinkedIn offers free API access for personal posting
 */
export class LinkedInAPI implements SocialPlatform {
  name = 'linkedin';
  private apiUrl = 'https://api.linkedin.com/v2';
  private accessToken: string | null = null;
  private personId: string | null = null;
  private recentPosts: string[] = [];

  async authenticate(): Promise<boolean> {
    try {
      // LinkedIn OAuth 2.0 authentication
      const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

      if (!accessToken) {
        console.log('🔐 LinkedIn access token not found');
        console.log('Set LINKEDIN_ACCESS_TOKEN environment variable');
        console.log('Get token from: https://www.linkedin.com/developers/apps');
        return false;
      }

      this.accessToken = accessToken;

      // Get user profile to verify token
      const response = await fetch(`${this.apiUrl}/people/~`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('LinkedIn token validation failed');
        return false;
      }

      const profile = await response.json();
      this.personId = profile.id;

      console.log('✅ LinkedIn authenticated successfully');
      return true;
    } catch (error) {
      console.error('LinkedIn authentication error:', error);
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

    // LinkedIn character limit is 3000
    const totalLength = content.text.length + content.hashtags.join(' ').length;
    if (totalLength > 3000) {
      warnings.push(`Content exceeds 3000 character limit (${totalLength})`);
      valid = false;
    }

    // LinkedIn prefers professional content
    const professionalKeywords = [
      'music industry',
      'business',
      'professional',
      'career',
      'network',
    ];
    const hasProfessionalTone = professionalKeywords.some(keyword =>
      content.text.toLowerCase().includes(keyword)
    );

    if (!hasProfessionalTone) {
      warnings.push('Consider adding professional context for LinkedIn audience');
    }

    return { valid, warnings };
  }

  async post(content: PostContent): Promise<PostResult> {
    if (!this.accessToken || !this.personId) {
      return {
        success: false,
        error: 'Not authenticated with LinkedIn',
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
        author: `urn:li:person:${this.personId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: fullText,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await fetch(`${this.apiUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `LinkedIn API error: ${error}`,
        };
      }

      const result = await response.json();

      // Track successful post
      this.recentPosts.push(contentHash);
      if (this.recentPosts.length > 50) {
        this.recentPosts = this.recentPosts.slice(-50);
      }

      console.log('✅ Posted to LinkedIn successfully');

      return {
        success: true,
        postId: result.id,
        url: `https://www.linkedin.com/feed/update/${result.id}`,
        verification: {
          contentHash,
          duplicateCheck: false,
          platformSpecific: {
            personId: this.personId,
            ugcPostId: result.id,
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
    if (!this.accessToken || !this.personId) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/ugcPosts?q=authors&authors=List(urn:li:person:${this.personId})&count=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.elements || [];
    } catch (error) {
      console.error('Error fetching LinkedIn recent posts:', error);
      return [];
    }
  }
}

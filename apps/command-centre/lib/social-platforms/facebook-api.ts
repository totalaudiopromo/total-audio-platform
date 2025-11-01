import { SocialPlatform, PostContent, PostResult } from './index';
import crypto from 'crypto';

/**
 * Facebook Graph API Integration
 * Facebook offers free API access for personal/page posting
 */
export class FacebookAPI implements SocialPlatform {
  name = 'facebook';
  private apiUrl = 'https://graph.facebook.com/v18.0';
  private accessToken: string | null = null;
  private pageId: string | null = null;
  private recentPosts: string[] = [];

  async authenticate(): Promise<boolean> {
    try {
      // Facebook Page Access Token
      const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
      const pageId = process.env.FACEBOOK_PAGE_ID;

      if (!accessToken || !pageId) {
        console.log('🔐 Facebook credentials not found');
        console.log('Set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID');
        console.log('Get token from: https://developers.facebook.com/tools/explorer/');
        return false;
      }

      this.accessToken = accessToken;
      this.pageId = pageId;

      // Verify token and page access
      const response = await fetch(
        `${this.apiUrl}/${pageId}?fields=name,access_token&access_token=${accessToken}`
      );

      if (!response.ok) {
        console.error('Facebook token validation failed');
        return false;
      }

      const pageData = await response.json();
      console.log(`✅ Facebook authenticated for page: ${pageData.name}`);
      return true;
    } catch (error) {
      console.error('Facebook authentication error:', error);
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

    // Facebook character limit is 63,206 (very generous)
    const totalLength = content.text.length + content.hashtags.join(' ').length;
    if (totalLength > 63000) {
      warnings.push(`Content exceeds recommended length (${totalLength})`);
    }

    // Facebook algorithm prefers engaging content
    const engagementWords = ['question', 'what', 'how', 'why', 'share', 'thoughts', 'experience'];
    const hasEngagement = engagementWords.some(word => content.text.toLowerCase().includes(word));

    if (!hasEngagement) {
      warnings.push('Consider adding engaging elements (questions, calls to action)');
    }

    return { valid, warnings };
  }

  async post(content: PostContent): Promise<PostResult> {
    if (!this.accessToken || !this.pageId) {
      return {
        success: false,
        error: 'Not authenticated with Facebook',
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

      const postData = new URLSearchParams({
        message: fullText,
        access_token: this.accessToken,
      });

      // Add scheduling if provided
      if (content.scheduledTime) {
        const scheduledTimestamp = Math.floor(new Date(content.scheduledTime).getTime() / 1000);
        postData.append('scheduled_publish_time', scheduledTimestamp.toString());
        postData.append('published', 'false');
      }

      const response = await fetch(`${this.apiUrl}/${this.pageId}/feed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: postData,
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Facebook API error: ${error}`,
        };
      }

      const result = await response.json();

      // Track successful post
      this.recentPosts.push(contentHash);
      if (this.recentPosts.length > 50) {
        this.recentPosts = this.recentPosts.slice(-50);
      }

      const status = content.scheduledTime ? 'scheduled' : 'posted';
      console.log(`✅ ${status} to Facebook successfully`);

      return {
        success: true,
        postId: result.id,
        url: `https://www.facebook.com/${result.id}`,
        verification: {
          contentHash,
          duplicateCheck: false,
          platformSpecific: {
            pageId: this.pageId,
            postId: result.id,
            scheduled: !!content.scheduledTime,
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
    if (!this.accessToken || !this.pageId) {
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.pageId}/posts?fields=message,created_time,id&limit=${limit}&access_token=${this.accessToken}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Facebook recent posts:', error);
      return [];
    }
  }
}

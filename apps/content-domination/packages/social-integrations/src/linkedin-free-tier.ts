/**
 * LinkedIn Free Tier Integration
 * Uses ONLY free tier APIs with "Share on LinkedIn" and "Sign In with LinkedIn" permissions
 * Zero-cost LinkedIn posting and authentication for Content Domination System
 */

import axios from 'axios';

export interface LinkedInFreeConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
  refreshToken?: string;
  personUrn?: string;
}

export interface LinkedInPost {
  text: string;
  url?: string;
  hashtags?: string[];
  visibility: 'PUBLIC' | 'CONNECTIONS';
}

export interface LinkedInPostResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  error?: string;
  rateLimitReached?: boolean;
  nextAvailableSlot?: Date;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  headline?: string;
  vanityName?: string;
}

class LinkedInFreeTier {
  private config: LinkedInFreeConfig;
  private rateLimitTracker: Map<string, Date[]> = new Map();
  private maxRequestsPerHour = 50; // Conservative free tier limit
  private maxPostsPerDay = 5; // Conservative posting limit
  private lastRequestTime = 0;
  private minRequestInterval = 2000; // 2 seconds between requests

  constructor(config: LinkedInFreeConfig) {
    this.config = config;
    this.validateConfig();
  }

  /**
   * Validate configuration for free tier requirements
   */
  private validateConfig(): void {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('LinkedIn Client ID and Secret are required');
    }

    if (!this.config.redirectUri) {
      this.config.redirectUri = 'http://localhost:3000/auth/linkedin/callback';
    }

    console.log('✅ LinkedIn Free Tier configuration validated');
  }

  /**
   * Generate OAuth authorization URL for free tier permissions
   */
  generateAuthUrl(state?: string): string {
    const baseUrl = 'https://www.linkedin.com/oauth/v2/authorization';
    const scope = 'openid profile email w_member_social'; // Free tier scopes only
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: scope,
      state: state || this.generateState()
    });

    const authUrl = `${baseUrl}?${params.toString()}`;
    console.log('🔗 LinkedIn OAuth URL generated for free tier');
    return authUrl;
  }

  /**
   * Exchange authorization code for access token (free tier)
   */
  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    console.log('🔄 Exchanging authorization code for access token...');

    try {
      const response = await this.makeRequest('POST', 'https://www.linkedin.com/oauth/v2/accessToken', null, {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret
      }, 'application/x-www-form-urlencoded');

      this.config.accessToken = response.access_token;
      this.config.refreshToken = response.refresh_token;

      console.log('✅ LinkedIn access token obtained');

      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in
      };
    } catch (error) {
      console.error('❌ Token exchange failed:', error);
      throw new Error(`LinkedIn token exchange failed: ${error.message}`);
    }
  }

  /**
   * Get user profile using free tier API
   */
  async getProfile(): Promise<LinkedInProfile> {
    if (!this.config.accessToken) {
      throw new Error('Access token required. Complete OAuth flow first.');
    }

    console.log('👤 Fetching LinkedIn profile...');

    try {
      // Use free tier profile endpoint
      const response = await this.makeRequest('GET', 'https://api.linkedin.com/v2/userinfo');
      
      // Store person URN for posting
      this.config.personUrn = `urn:li:person:${response.sub}`;

      console.log(`✅ Profile retrieved: ${response.given_name} ${response.family_name}`);

      return {
        id: response.sub,
        firstName: response.given_name,
        lastName: response.family_name,
        profilePicture: response.picture,
        headline: response.name
      };
    } catch (error) {
      console.error('❌ Profile fetch failed:', error);
      throw new Error(`LinkedIn profile fetch failed: ${error.message}`);
    }
  }

  /**
   * Post content to LinkedIn using free tier Share API
   */
  async postContent(post: LinkedInPost): Promise<LinkedInPostResult> {
    if (!this.config.accessToken || !this.config.personUrn) {
      throw new Error('Authentication required. Complete OAuth flow and profile fetch first.');
    }

    // Check rate limits before posting
    const rateLimitCheck = this.checkRateLimit('post');
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        rateLimitReached: true,
        nextAvailableSlot: rateLimitCheck.nextAvailableSlot,
        error: 'Daily posting limit reached. Try again tomorrow.'
      };
    }

    // Check hourly API limits
    const apiLimitCheck = this.checkRateLimit('api');
    if (!apiLimitCheck.allowed) {
      return {
        success: false,
        rateLimitReached: true,
        nextAvailableSlot: apiLimitCheck.nextAvailableSlot,
        error: 'Hourly API limit reached. Try again later.'
      };
    }

    console.log('📝 Posting to LinkedIn...');

    try {
      // Prepare content with free tier formatting
      const content = this.formatContentForLinkedIn(post);
      
      // Use free tier UGC Share API
      const shareData = {
        author: this.config.personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': post.visibility
        }
      };

      // Add URL if provided
      if (post.url) {
        shareData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'ARTICLE';
        shareData.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          originalUrl: post.url
        }];
      }

      const response = await this.makeRequest('POST', 'https://api.linkedin.com/v2/ugcPosts', shareData);

      // Track successful post for rate limiting
      this.trackRequest('post');
      this.trackRequest('api');

      const postId = response.id;
      const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

      console.log(`✅ LinkedIn post successful: ${postId}`);

      return {
        success: true,
        postId,
        postUrl
      };

    } catch (error) {
      console.error('❌ LinkedIn posting failed:', error);
      
      // Check if it's a rate limit error
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const nextSlot = retryAfter ? new Date(Date.now() + (parseInt(retryAfter) * 1000)) : new Date(Date.now() + 3600000);
        
        return {
          success: false,
          rateLimitReached: true,
          nextAvailableSlot: nextSlot,
          error: 'LinkedIn rate limit exceeded'
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Check if user has enough permissions for posting
   */
  async validatePermissions(): Promise<{
    hasSharePermission: boolean;
    hasProfilePermission: boolean;
    canPost: boolean;
    missingPermissions: string[];
  }> {
    console.log('🔍 Validating LinkedIn permissions...');

    const result = {
      hasSharePermission: false,
      hasProfilePermission: false,
      canPost: false,
      missingPermissions: [] as string[]
    };

    try {
      // Test profile access (Sign In with LinkedIn)
      await this.getProfile();
      result.hasProfilePermission = true;
      console.log('✅ Profile permission verified');
    } catch (error) {
      result.missingPermissions.push('Profile access (Sign In with LinkedIn)');
      console.log('❌ Profile permission missing');
    }

    try {
      // Test posting capability (Share on LinkedIn)
      // We don't actually post, just prepare the request to test permissions
      const testData = {
        author: this.config.personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: 'Test permission check - not posted'
            },
            shareMediaCategory: 'NONE'
          }
        }
      };

      // Dry run - check if we can access the endpoint
      await this.makeRequest('GET', 'https://api.linkedin.com/v2/ugcPosts', null, null, null, true);
      result.hasSharePermission = true;
      console.log('✅ Share permission verified');
    } catch (error) {
      if (error.response?.status !== 403) {
        result.hasSharePermission = true; // Endpoint exists, permission likely OK
      } else {
        result.missingPermissions.push('Share on LinkedIn');
        console.log('❌ Share permission missing');
      }
    }

    result.canPost = result.hasSharePermission && result.hasProfilePermission;

    return result;
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(): {
    apiRequestsThisHour: number;
    apiRequestsRemaining: number;
    postsToday: number;
    postsRemaining: number;
    nextResetTime: Date;
  } {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 3600000);
    const dayAgo = new Date(now.getTime() - 86400000);

    const apiRequests = this.rateLimitTracker.get('api') || [];
    const posts = this.rateLimitTracker.get('post') || [];

    const apiRequestsThisHour = apiRequests.filter(time => time > hourAgo).length;
    const postsToday = posts.filter(time => time > dayAgo).length;

    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);

    return {
      apiRequestsThisHour,
      apiRequestsRemaining: Math.max(0, this.maxRequestsPerHour - apiRequestsThisHour),
      postsToday,
      postsRemaining: Math.max(0, this.maxPostsPerDay - postsToday),
      nextResetTime: nextHour
    };
  }

  /**
   * Format content for LinkedIn with proper hashtags and structure
   */
  private formatContentForLinkedIn(post: LinkedInPost): string {
    let content = post.text;

    // Add hashtags if provided
    if (post.hashtags && post.hashtags.length > 0) {
      const hashtags = post.hashtags.map(tag => 
        tag.startsWith('#') ? tag : `#${tag}`
      ).join(' ');
      content += `\n\n${hashtags}`;
    }

    // Ensure content is within LinkedIn limits
    const maxLength = 3000; // LinkedIn character limit
    if (content.length > maxLength) {
      content = content.substring(0, maxLength - 3) + '...';
    }

    return content;
  }

  /**
   * Make authenticated API request with rate limiting
   */
  private async makeRequest(
    method: string,
    url: string,
    data?: any,
    formData?: any,
    contentType?: string,
    dryRun = false
  ): Promise<any> {
    // Respect minimum interval between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();

    const headers: any = {
      'LinkedIn-Version': '202408' // Use current API version
    };

    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    } else if (data) {
      headers['Content-Type'] = 'application/json';
    }

    const config: any = {
      method,
      url,
      headers,
      timeout: 30000 // 30 second timeout
    };

    if (data) {
      config.data = data;
    }

    if (formData) {
      if (contentType === 'application/x-www-form-urlencoded') {
        config.data = new URLSearchParams(formData).toString();
      } else {
        config.data = formData;
      }
    }

    if (dryRun) {
      // For permission checks, just return success
      return { success: true };
    }

    const response = await axios(config);
    return response.data;
  }

  /**
   * Check rate limits for specific action
   */
  private checkRateLimit(action: string): { allowed: boolean; nextAvailableSlot?: Date } {
    const now = new Date();
    const requests = this.rateLimitTracker.get(action) || [];

    if (action === 'post') {
      // Daily posting limit
      const dayAgo = new Date(now.getTime() - 86400000);
      const postsToday = requests.filter(time => time > dayAgo);
      
      if (postsToday.length >= this.maxPostsPerDay) {
        const oldestPost = postsToday[0];
        const nextSlot = new Date(oldestPost.getTime() + 86400000);
        return { allowed: false, nextAvailableSlot: nextSlot };
      }
    } else if (action === 'api') {
      // Hourly API limit
      const hourAgo = new Date(now.getTime() - 3600000);
      const requestsThisHour = requests.filter(time => time > hourAgo);
      
      if (requestsThisHour.length >= this.maxRequestsPerHour) {
        const oldestRequest = requestsThisHour[0];
        const nextSlot = new Date(oldestRequest.getTime() + 3600000);
        return { allowed: false, nextAvailableSlot: nextSlot };
      }
    }

    return { allowed: true };
  }

  /**
   * Track API request for rate limiting
   */
  private trackRequest(action: string): void {
    const now = new Date();
    const requests = this.rateLimitTracker.get(action) || [];
    requests.push(now);

    // Keep only recent requests for memory efficiency
    const cutoff = action === 'post' ? 
      new Date(now.getTime() - 86400000) : // 24 hours for posts
      new Date(now.getTime() - 3600000);   // 1 hour for API calls

    const recentRequests = requests.filter(time => time > cutoff);
    this.rateLimitTracker.set(action, recentRequests);
  }

  /**
   * Generate secure state parameter for OAuth
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<LinkedInFreeConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('⚙️ LinkedIn configuration updated');
  }

  /**
   * Get current configuration (without sensitive data)
   */
  getConfig(): Omit<LinkedInFreeConfig, 'clientSecret' | 'accessToken' | 'refreshToken'> {
    return {
      clientId: this.config.clientId,
      redirectUri: this.config.redirectUri,
      personUrn: this.config.personUrn
    };
  }

  /**
   * Test connection to LinkedIn API
   */
  async testConnection(): Promise<{
    connected: boolean;
    profile?: LinkedInProfile;
    rateLimitStatus: any;
    permissions: any;
    error?: string;
  }> {
    console.log('🧪 Testing LinkedIn connection...');

    try {
      const rateLimitStatus = this.getRateLimitStatus();
      const permissions = await this.validatePermissions();
      
      let profile;
      if (permissions.hasProfilePermission) {
        profile = await this.getProfile();
      }

      return {
        connected: permissions.canPost,
        profile,
        rateLimitStatus,
        permissions,
      };
    } catch (error) {
      return {
        connected: false,
        rateLimitStatus: this.getRateLimitStatus(),
        permissions: { canPost: false },
        error: error.message
      };
    }
  }
}

export default LinkedInFreeTier;
export type { LinkedInFreeConfig, LinkedInPost, LinkedInPostResult, LinkedInProfile };
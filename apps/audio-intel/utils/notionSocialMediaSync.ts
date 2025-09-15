// Notion Social Media Sync Service
// Integrates with your existing Notion workspace for social media content management

interface NotionPost {
  pageId: string;
  title: string;
  content: string;
  platform: 'x' | 'linkedin' | 'bluesky';
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  hashtags: string[];
  engagement?: {
    likes: number;
    retweets: number;
    comments: number;
  };
  lastModified: string;
}

interface NotionSyncResult {
  success: boolean;
  postsImported: number;
  postsUpdated: number;
  errors: string[];
  nextSync: string;
}

export class NotionSocialMediaSync {
  private notionApiKey: string;
  private contentPageId: string; // Your CONTENT & BRAND page ID

  constructor(notionApiKey: string, contentPageId: string) {
    this.notionApiKey = notionApiKey;
    this.contentPageId = contentPageId;
  }

  // Sync social media posts from Notion
  async syncFromNotion(): Promise<NotionSyncResult> {
    try {
      console.log('🔄 Syncing social media posts from Notion...');
      
      const result: NotionSyncResult = {
        success: true,
        postsImported: 0,
        postsUpdated: 0,
        errors: [],
        nextSync: new Date(Date.now() + 15 * 60 * 1000).toISOString() // Next sync in 15 minutes
      };

      // Get the CONTENT & BRAND page
      const contentPage = await this.getNotionPage(this.contentPageId);
      if (!contentPage) {
        result.errors.push('Could not access CONTENT & BRAND page');
        return result;
      }

      // Look for social media content blocks
      const socialMediaBlocks = await this.findSocialMediaBlocks(contentPage.id);
      
      for (const block of socialMediaBlocks) {
        try {
          const post = await this.parseSocialMediaBlock(block);
          if (post) {
            // Import or update post
            const existingPost = await this.findExistingPost(post.pageId);
            if (existingPost) {
              await this.updatePost(existingPost.id, post);
              result.postsUpdated++;
            } else {
              await this.createPost(post);
              result.postsImported++;
            }
          }
        } catch (error) {
          result.errors.push(`Failed to process block ${block.id}: ${error}`);
        }
      }

      console.log('✅ Notion sync completed:', result);
      return result;

    } catch (error) {
      console.error('❌ Notion sync failed:', error);
      return {
        success: false,
        postsImported: 0,
        postsUpdated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Retry in 5 minutes
      };
    }
  }

  // Update Notion with posting results
  async updateNotionWithResults(postId: string, status: 'posted' | 'failed', engagement?: any): Promise<boolean> {
    try {
      // Find the corresponding Notion page
      const notionPageId = await this.findNotionPageId(postId);
      if (!notionPageId) {
        console.warn(`No Notion page found for post ${postId}`);
        return false;
      }

      // Update the page with posting results
      const properties = {
        'Status': { select: { name: status === 'posted' ? 'Posted' : 'Failed' } },
        'Last Posted': { date: { start: new Date().toISOString() } }
      };

      if (engagement) {
        (properties as any)['Engagement'] = { 
          rich_text: [{ 
            text: { content: `Likes: ${engagement.likes}, Retweets: ${engagement.retweets}, Comments: ${engagement.comments}` } 
          }] 
        };
      }

      await this.updateNotionPage(notionPageId, properties);
      return true;

    } catch (error) {
      console.error(`Failed to update Notion for post ${postId}:`, error);
      return false;
    }
  }

  // Private helper methods
  private async getNotionPage(pageId: string): Promise<any> {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${this.notionApiKey}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get Notion page: ${response.status}`);
    }

    return await response.json();
  }

  private async findSocialMediaBlocks(pageId: string): Promise<any[]> {
    const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      headers: {
        'Authorization': `Bearer ${this.notionApiKey}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get blocks: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  private async parseSocialMediaBlock(block: any): Promise<NotionPost | null> {
    // Look for blocks that contain social media content
    if (block.type === 'paragraph' && block.paragraph?.rich_text) {
      const text = block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
      
      // Check if this looks like a social media post
      if (this.isSocialMediaPost(text)) {
        return {
          pageId: block.id,
          title: text.substring(0, 50) + '...',
          content: text,
          platform: this.detectPlatform(text),
          scheduledTime: this.extractScheduledTime(text),
          status: 'draft',
          hashtags: this.extractHashtags(text),
          lastModified: block.last_edited_time
        };
      }
    }

    return null;
  }

  private isSocialMediaPost(text: string): boolean {
    // Check for social media indicators
    const indicators = [
      '🎵', '📱', 'X (Twitter)', 'LinkedIn', 'Blue Sky',
      '#MusicTech', '#IndieMusic', '#MusicIndustry',
      'Comment "BETA"', 'Get free beta access'
    ];

    return indicators.some(indicator => text.includes(indicator));
  }

  private detectPlatform(text: string): 'x' | 'linkedin' | 'bluesky' {
    if (text.includes('X (Twitter)') || text.includes('Twitter')) return 'x';
    if (text.includes('LinkedIn')) return 'linkedin';
    if (text.includes('Blue Sky')) return 'bluesky';
    
    // Default to X for now
    return 'x';
  }

  private extractScheduledTime(text: string): string {
    // Look for time patterns like "9:00 AM", "2pm", etc.
    const timeMatch = text.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)/i);
    if (timeMatch) {
      const now = new Date();
      const hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const isPM = /pm/i.test(timeMatch[3]);
      
      const scheduledTime = new Date(now);
      scheduledTime.setHours(isPM && hour !== 12 ? hour + 12 : hour, minute, 0, 0);
      
      return scheduledTime.toISOString();
    }

    // Default to next hour
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    return nextHour.toISOString();
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
  }

  private async findExistingPost(pageId: string): Promise<any> {
    // This would check your local database for existing posts
    // For now, return null (always create new)
    return null;
  }

  private async createPost(post: NotionPost): Promise<void> {
    // This would save to your local database
    console.log('Creating post:', post.title);
  }

  private async updatePost(postId: string, post: NotionPost): Promise<void> {
    // This would update your local database
    console.log('Updating post:', postId);
  }

  private async findNotionPageId(postId: string): Promise<string | null> {
    // This would look up the Notion page ID for a given post
    // For now, return null
    return null;
  }

  private async updateNotionPage(pageId: string, properties: any): Promise<void> {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });

    if (!response.ok) {
      throw new Error(`Failed to update Notion page: ${response.status}`);
    }
  }
}

// Export singleton instance
export const notionSync = new NotionSocialMediaSync(
  process.env.NOTION_API_KEY || '',
  '2660a35b21ed8162baeaf8afbf100b2e' // Your CONTENT & BRAND page ID
);

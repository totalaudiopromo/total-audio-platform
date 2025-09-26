import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

const NOTION_API_KEY = getEnv('NOTION_API_KEY');
const CONTENT_PAGE_ID = getEnv('NOTION_CONTENT_PAGE_ID') || '2660a35b21ed8162baeaf8afbf100b2e';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Notion sync requested...');
    
    // Notion integration temporarily disabled
    return NextResponse.json({ 
      success: false,
      error: 'Notion integration is temporarily unavailable. Content management features are disabled.' 
    }, { status: 503 });

    // Get blocks from Notion page
    const notionResponse = await fetch(`https://api.notion.com/v1/blocks/${CONTENT_PAGE_ID}/children`, {
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!notionResponse.ok) {
      throw new Error(`Notion API error: ${notionResponse.status}`);
    }

    const notionData = await notionResponse.json();
    console.log('📄 Retrieved', notionData.results?.length || 0, 'blocks from Notion');

    // Look for social media content
    const socialMediaBlocks = notionData.results?.filter((block: any) => {
      if (block.type === 'paragraph' && block.paragraph?.rich_text) {
        const text = block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
        return text.includes('🎵') || 
               text.includes('Music Industry') || 
               text.includes('Audio Intel') ||
               text.includes('Stop wasting') ||
               text.includes('radio contacts');
      }
      return false;
    }) || [];

    console.log('🎯 Found', socialMediaBlocks.length, 'social media content blocks');

    // Convert blocks to social media posts
    const posts = socialMediaBlocks.map((block: any, index: number) => {
      const content = block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
      
      // Extract hashtags from content
      const hashtagMatches = content.match(/#\w+/g) || [];
      
      // Determine platform based on content
      let platform = 'x';
      if (content.includes('LinkedIn') || content.includes('professional')) {
        platform = 'linkedin';
      } else if (content.includes('Blue Sky') || content.includes('bluesky')) {
        platform = 'bluesky';
      }

      // Schedule for tomorrow if no specific time mentioned
      const scheduledTime = new Date();
      scheduledTime.setDate(scheduledTime.getDate() + 1);
      scheduledTime.setHours(9, 0, 0, 0); // 9 AM tomorrow

      return {
        id: `notion_${block.id}_${index}`,
        content: content,
        platform: platform,
        scheduledTime: scheduledTime.toISOString(),
        status: 'draft',
        hashtags: hashtagMatches,
        notionPageId: block.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    console.log('✅ Processed', posts.length, 'posts from Notion');

    return NextResponse.json({
      success: true,
      message: 'Notion sync completed successfully',
      posts: posts,
      syncedAt: new Date().toISOString(),
      totalBlocks: notionData.results?.length || 0,
      socialMediaBlocks: socialMediaBlocks.length
    });

  } catch (error) {
    console.error('❌ Notion sync failed:', error);
    return NextResponse.json({
      error: 'Notion sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';
import fs from 'fs';
import path from 'path';

const NOTION_API_KEY = getEnv('NOTION_API_KEY');
const CONTENT_PAGE_ID = '2660a35b21ed8162baeaf8afbf100b2e';

// Parse your local content files
function parseLocalContent() {
  try {
    const week1Path = path.join(process.cwd(), 'AUDIO_INTEL_WEEK_1_CONTENT.md');

    // Check if file exists
    if (!fs.existsSync(week1Path)) {
      console.log('Local content file not found:', week1Path);
      return [];
    }

    const week1Content = fs.readFileSync(week1Path, 'utf-8');

    const posts: any[] = [];

    // Extract posts from your local content
    const postSections = week1Content.split(
      /## 📅|### \*\*X \(Twitter\)|### \*\*LinkedIn|### \*\*Blue Sky/
    );

    for (let i = 1; i < postSections.length; i++) {
      const section = postSections[i];

      // Extract content between ``` markers
      const codeBlocks = section.match(/```[\s\S]*?```/g);

      if (codeBlocks) {
        codeBlocks.forEach((block, index) => {
          const content = block.replace(/```/g, '').trim();

          if (content && content.length > 50) {
            // Determine platform based on section
            let platform = 'x';
            if (section.includes('LinkedIn')) platform = 'linkedin';
            if (section.includes('Blue Sky')) platform = 'bluesky';

            // Extract hashtags
            const hashtagMatches = content.match(/#\w+/g) || [];

            // Schedule posts across the week
            const scheduledTime = new Date();
            scheduledTime.setDate(scheduledTime.getDate() + (i - 1));
            scheduledTime.setHours(9, 0, 0, 0);

            posts.push({
              id: `local_${i}_${index}`,
              content: content,
              platform: platform,
              scheduledTime: scheduledTime.toISOString(),
              status: 'draft',
              hashtags: hashtagMatches,
              source: 'local_file',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        });
      }
    }

    console.log(`📄 Parsed ${posts.length} posts from local file`);
    return posts;
  } catch (error) {
    console.error('Failed to parse local content:', error);
    return [];
  }
}

// Get content from Notion
async function getNotionContent() {
  if (!NOTION_API_KEY) {
    return [];
  }

  try {
    const notionResponse = await fetch(
      `https://api.notion.com/v1/blocks/${CONTENT_PAGE_ID}/children`,
      {
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
      }
    );

    if (!notionResponse.ok) {
      throw new Error(`Notion API error: ${notionResponse.status}`);
    }

    const notionData = await notionResponse.json();

    // Look for social media content
    const socialMediaBlocks =
      notionData.results?.filter((block: any) => {
        if (block.type === 'paragraph' && block.paragraph?.rich_text) {
          const text = block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
          return (
            text.includes('🎵') ||
            text.includes('Music Industry') ||
            text.includes('Audio Intel') ||
            text.includes('Stop wasting') ||
            text.includes('radio contacts')
          );
        }
        return false;
      }) || [];

    return socialMediaBlocks.map((block: any, index: number) => {
      const content = block.paragraph.rich_text.map((t: any) => t.plain_text).join('');
      const hashtagMatches = content.match(/#\w+/g) || [];

      let platform = 'x';
      if (content.includes('LinkedIn') || content.includes('professional')) {
        platform = 'linkedin';
      } else if (content.includes('Blue Sky') || content.includes('bluesky')) {
        platform = 'bluesky';
      }

      const scheduledTime = new Date();
      scheduledTime.setDate(scheduledTime.getDate() + 1);
      scheduledTime.setHours(9, 0, 0, 0);

      return {
        id: `notion_${block.id}_${index}`,
        content: content,
        platform: platform,
        scheduledTime: scheduledTime.toISOString(),
        status: 'draft',
        hashtags: hashtagMatches,
        source: 'notion',
        notionPageId: block.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Failed to get Notion content:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Loading hybrid content (Notion + Local files)...');

    // Get content from both sources
    const [notionPosts, localPosts] = await Promise.all([
      getNotionContent(),
      Promise.resolve(parseLocalContent()),
    ]);

    // Combine and deduplicate posts
    const allPosts = [...notionPosts, ...localPosts];

    // Remove duplicates based on content similarity
    const uniquePosts = allPosts.filter(
      (post, index, self) =>
        index ===
        self.findIndex(p => p.content.substring(0, 100) === post.content.substring(0, 100))
    );

    console.log(`📄 Found ${notionPosts.length} Notion posts, ${localPosts.length} local posts`);
    console.log(`✅ Total unique posts: ${uniquePosts.length}`);

    return NextResponse.json({
      success: true,
      message: 'Hybrid content loaded successfully',
      posts: uniquePosts,
      sources: {
        notion: notionPosts.length,
        local: localPosts.length,
        total: uniquePosts.length,
      },
      loadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Failed to load hybrid content:', error);
    return NextResponse.json(
      {
        error: 'Failed to load hybrid content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

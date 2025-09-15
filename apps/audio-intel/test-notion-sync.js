const https = require('https');

const NOTION_API_KEY = 'ntn_K274065866997u4wc8ulVUnvlWbas8EM4ZgiklsoNKV4k5';
const CONTENT_PAGE_ID = '2660a35b21ed8162baeaf8afbf100b2e';

// Get blocks from Notion page
function getNotionBlocks(pageId) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.notion.com',
      path: `/v1/blocks/${pageId}/children`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Blocks fetch failed: ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Add post to social media scheduler
function addPostToScheduler(post) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/agents/social-media-scheduler',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Scheduler add failed: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({
      action: 'add',
      post: post
    }));
    req.end();
  });
}

// Test the full Notion sync workflow
async function testNotionSync() {
  try {
    console.log('🔍 Syncing content from Notion to Social Media Scheduler...');
    
    // Get blocks from Notion
    console.log('📄 Getting content from Notion...');
    const blocks = await getNotionBlocks(CONTENT_PAGE_ID);
    console.log('✅ Found', blocks.results?.length || 0, 'blocks in Notion');
    
    // Look for social media content
    const socialMediaBlocks = blocks.results?.filter(block => {
      if (block.type === 'paragraph' && block.paragraph?.rich_text) {
        const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
        return text.includes('🎵') || text.includes('Music Industry') || text.includes('Audio Intel');
      }
      return false;
    }) || [];
    
    console.log('🎯 Found', socialMediaBlocks.length, 'social media content blocks');
    
    if (socialMediaBlocks.length > 0) {
      // Convert first block to social media post
      const firstBlock = socialMediaBlocks[0];
      const content = firstBlock.paragraph.rich_text.map(t => t.plain_text).join('');
      
      const socialMediaPost = {
        content: content,
        platform: 'x',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Schedule for tomorrow
        hashtags: ['#MusicTech', '#IndieMusic', '#MusicIndustry']
      };
      
      console.log('📱 Adding post to social media scheduler...');
      const result = await addPostToScheduler(socialMediaPost);
      
      if (result.success) {
        console.log('✅ Post added to scheduler successfully!');
        console.log('📊 Post ID:', result.post.id);
        console.log('⏰ Scheduled for:', new Date(result.post.scheduledTime).toLocaleString());
      } else {
        console.log('❌ Failed to add post to scheduler');
      }
    } else {
      console.log('ℹ️  No social media content found in Notion');
    }
    
    console.log('✅ Notion sync test completed!');
    
  } catch (error) {
    console.error('❌ Notion sync test failed:', error.message);
  }
}

testNotionSync();

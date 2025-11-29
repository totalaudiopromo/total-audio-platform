# Fix: Cursor + Notion Integration Setup

# Cursor + Notion Integration Setup

## **Current Problem**

Cursor can't access your Notion workspace because you're using the hosted MCP server that only works with Claude. Cursor needs direct API access.

## **Solution: Notion API Integration for Cursor**

### **Step 1: Get Your Notion Integration Token**

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create new integration called "Total Audio Social Automation"
3. Copy the "Internal Integration Token" (starts with `secret_`)
4. **Capabilities needed**: Read content, Update content, Insert content

### **Step 2: Share Database with Integration**

1. Go to your Social Media Content database: [Social Media Content - User Acquisition](Social%20Media%20Content%20-%20User%20Acquisition%2075c7e9291f49412ca546b4e880291455.md)
2. Click "Share" → "Add people, emails, groups, or integrations"
3. Add your "Total Audio Social Automation" integration
4. Give it "Full access"

### **Step 3: Update Your MCP Configuration**

Replace your current MCP config with this:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "secret_YOUR_INTEGRATION_TOKEN_HERE"
      }
    }
  }
}
```

### **Step 4: Environment Variables for Cursor Script**

Create `.env` file in your project:

```
# Notion Integration
NOTION_API_KEY=secret_YOUR_INTEGRATION_TOKEN_HERE
NOTION_DATABASE_ID=7002006e-000f-42ff-a414-6130df40d8d7

# Social Media APIs (to be added)
TWITTER_BEARER_TOKEN=your_twitter_token
LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
BLUESKY_USERNAME=your_bluesky_username
BLUESKY_PASSWORD=your_bluesky_password
```

### **Step 5: Notion API Package for TypeScript**

Cursor will need to install:

```bash
npm install @notionhq/client
npm install @types/node
```

### **Step 6: Basic Connection Test**

Create this test file for Cursor to verify connection:

```tsx
// test-notion-connection.ts
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function testConnection() {
  try {
    // Test database access
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID || '',
      filter: {
        property: 'Status',
        select: {
          equals: 'Ready to Post'
        }
      }
    });

    console.log('✅ Notion connection successful!');
    console.log(`Found ${response.results.length} posts ready to post`);

    // Show sample post
    if (response.results.length > 0) {
      const post = response.results[0] as any;
      console.log('Sample post:', {
        title: [post.properties](http://post.properties).Title?.title[0]?.text?.content || 'No title',
        platforms: [post.properties](http://post.properties).Platform?.multi_select?.map((p: any) => [p.name](http://p.name)) || [],
        content: [post.properties](http://post.properties).Content?.rich_text[0]?.text?.content?.substring(0, 100) + '...' || 'No content'
      });
    }

  } catch (error) {
    console.error('❌ Notion connection failed:', error);
  }
}

testConnection();
```

## **Database Schema for Cursor**

Your Social Media Content database has these properties:

- **Title**(title)
- **Content**(rich_text)
- **Platform**(multi_select): LinkedIn, Twitter/X, Blue Sky, Threads, Reddit
- **Content Type**(select): Thread, Single Tweet, LinkedIn Article, LinkedIn Post, Reddit Post, Story Update
- **Status**(select): Draft, Ready to Post, Scheduled, Posted, Performing Well
- **Scheduled Date**(date)
- **Post Time**(rich_text): "9:00am GMT", "12:00pm GMT"
- **API Status**(select): Pending, Posted Successfully, Failed - Retry, Failed - Manual Review
- **Content Optimised**(checkbox)
- **UTM Tracking**(rich_text)
- **Engagement Target**(number)
- **Actual Engagement**(number)
- **Beta Signups**(number)
- **Tags**(multi_select): 94% Automation, Personal Story, Industry Insight, Product Demo, Customer Acquisition, Competitive Advantage
- **Notes**(rich_text)

## **Ready-to-Post Content Available**

Your database already contains:

1. **94% Automation Thread**- Ready for LinkedIn + Twitter + Threads
2. **Building Audio Intel Story**- Ready for LinkedIn
3. **Radio Submission Tips**- Ready for Twitter + Blue Sky
4. **vs Groover/SubmitHub**- Draft stage for LinkedIn + Twitter

## **Next Steps for Cursor**

1. **Set up Notion integration**(steps above)
2. **Test connection**with the test file
3. **Build automation script**using the specification document
4. **Implement UK timing logic**with GMT-based scheduling
5. **Add platform APIs**for posting automation
6. **Create content processing**(UK spelling, no emojis)
7. **Set up cron scheduling**for automated posting

Once you have the Notion integration token and share the database, Cursor will be able to read and update your social media content for full automation.

**Database ID**: `7002006e-000f-42ff-a414-6130df40d8d7`

**Database URL**: [Social Media Content - User Acquisition](Social%20Media%20Content%20-%20User%20Acquisition%2075c7e9291f49412ca546b4e880291455.md)

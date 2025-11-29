# CSV Alternative: Skip Notion API Integration

## **The Problem with Notion Integrations**

Notion's integration system is notoriously frustrating. The secret keys often don't appear correctly, workspace permissions get confused, and it takes forever to set up properly.

## **Simple CSV Alternative**

Instead of fighting with Notion API, let's create a system where:

1. You manage content in Notion (which you can do easily)
2. Export to CSV when ready to post
3. Cursor automation reads from CSV files
4. Much simpler, more reliable, easier to debug

## **How It Works**

### **Step 1: Export Your Ready Content**

From your Social Media Content database:

1. Create a view filtered by "Status = Ready to Post"
2. Export as CSV
3. Save to a folder like `/social-automation/content/ready-posts.csv`

### **Step 2: CSV Structure**

```
title,content,platform,contentType,scheduledTime,utmTracking
"94% Automation Thread","Right, so this whole music marketing...","Twitter/X|LinkedIn|Threads","Thread","2025-09-16 09:00","?utm_source=social&utm_campaign=beta"
"Personal Story","Right, so I've been coding at 2am...","LinkedIn","LinkedIn Post","2025-09-18 09:00","?utm_source=social&utm_campaign=beta"
```

### **Step 3: Cursor Automation Script**

```tsx
// social-automation.ts
import * as fs from 'fs';
import * as path from 'path';

interface SocialPost {
  title: string;
  content: string;
  platform: string[]; // Split by |
  contentType: string;
  scheduledTime: string;
  utmTracking: string;
}

function loadPostsFromCSV(): SocialPost[] {
  const csvPath = './content/ready-posts.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf8');

  // Parse CSV and return structured posts
  // Implementation details...
}

function processContentForUK(content: string): string {
  // UK spelling conversion
  content = content.replace(/realize/g, 'realise');
  content = content.replace(/organize/g, 'organise');
  // Remove emojis
  content = content.replace(
    /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}]/gu,
    ''
  );
  return content;
}

function shouldPostNow(scheduledTime: string): boolean {
  const now = new Date();
  const scheduled = new Date(scheduledTime);

  // Check if within 15 minutes of scheduled time
  const diff = Math.abs(now.getTime() - scheduled.getTime());
  return diff < 15 * 60 * 1000; // 15 minutes
}

function updatePostStatus(title: string, status: 'posted' | 'failed') {
  // Update a separate status CSV or log file
  const statusLog = `${new Date().toISOString()},${title},${status}\n`;
  fs.appendFileSync('./logs/post-status.csv', statusLog);
}
```

### **Step 4: Platform Posting Functions**

```tsx
// platforms/twitter.ts
export async function postToTwitter(content: string): Promise<boolean> {
  // Twitter API v2 implementation
  // Return true if successful
}

// platforms/linkedin.ts
export async function postToLinkedIn(content: string): Promise<boolean> {
  // LinkedIn API implementation
  // Return true if successful
}

// platforms/bluesky.ts
export async function postToBluesky(content: string): Promise<boolean> {
  // Blue Sky AT Protocol implementation
  // Return true if successful
}
```

### **Step 5: Main Automation Loop**

```tsx
// main.ts
import { loadPostsFromCSV, processContentForUK, shouldPostNow } from './content-manager';
import { postToTwitter } from './platforms/twitter';
import { postToLinkedIn } from './platforms/linkedin';
import { postToBluesky } from './platforms/bluesky';

async function runAutomation() {
  const posts = loadPostsFromCSV();

  for (const post of posts) {
    if (shouldPostNow(post.scheduledTime)) {
      const processedContent = processContentForUK(post.content);

      // Add UTM tracking to links
      const finalContent = processedContent.replace(
        /intel\.totalaudiopromo\.com/g,
        `[intel.totalaudiopromo.com](http://intel.totalaudiopromo.com)${post.utmTracking}`
      );

      // Post to each platform
      for (const platform of post.platform) {
        try {
          let success = false;

          switch (platform) {
            case 'Twitter/X':
              success = await postToTwitter(finalContent);
              break;
            case 'LinkedIn':
              success = await postToLinkedIn(finalContent);
              break;
            case 'Blue Sky':
              success = await postToBluesky(finalContent);
              break;
          }

          if (success) {
            updatePostStatus(`${post.title} - ${platform}`, 'posted');
          } else {
            updatePostStatus(`${post.title} - ${platform}`, 'failed');
          }
        } catch (error) {
          console.error(`Failed to post to ${platform}:`, error);
          updatePostStatus(`${post.title} - ${platform}`, 'failed');
        }
      }
    }
  }
}

// Run every 15 minutes
setInterval(runAutomation, 15 * 60 * 1000);
```

## **Advantages of This Approach**

1. **No Notion API Headaches**: You manage content in Notion, export when ready
2. **Simple Debugging**: CSV files are easy to read and modify
3. **Version Control**: CSV files can be committed to git
4. **Reliable**: No API token issues or integration failures
5. **Fast Development**: Cursor can build this quickly
6. **Easy Updates**: Just re-export CSV when content changes

## **Your Current Content Ready to Export**

Your database has these posts ready:

- **94% Automation Thread**(Twitter/LinkedIn/Threads)
- **Building Audio Intel Story**(LinkedIn)
- **Radio Submission Tips**(Twitter/Blue Sky)
- **vs Groover/SubmitHub**(LinkedIn/Twitter)

## **Weekly Workflow**

1. **Sunday**: Plan week's content in Notion
2. **Monday**: Export "Ready to Post" view as CSV
3. **Automation**: Runs every 15 minutes, posts at scheduled times
4. **Friday**: Check status logs, plan next week

## **File Structure**

```
social-automation/
├── content/
│   ├── ready-posts.csv
│   └── templates/
├── logs/
│   ├── post-status.csv
│   └── errors.log
├── platforms/
│   ├── twitter.ts
│   ├── linkedin.ts
│   └── bluesky.ts
└── main.ts
```

This sidesteps all the Notion integration problems and gets you automated posting much faster. Want to try this approach instead?

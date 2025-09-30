# Cursor Automation Script Specification

# Cursor Automation Script Requirements

## **System Architecture**

### **Primary Function**

- **Name**: Social Media Content Automation System
- **Purpose**: Automated cross-platform posting from Notion database
- **Platforms**: LinkedIn, Twitter/X, Blue Sky, Threads
- **Database**: Notion Social Media Content database
- **Language**: TypeScript/Node.js preferred

### **Core Requirements**

### **1. Notion Database Integration**

```tsx
// Database Schema Reference
interface SocialPost {
  title: string;
  content: string;
  platform: string[]; // ["LinkedIn", "Twitter/X", "Blue Sky", "Threads"]
  contentType: string; // "Thread", "Single Tweet", "LinkedIn Post", etc.
  status: string; // "Scheduled", "Posted", "Failed", etc.
  scheduledDate: Date;
  postTime: string; // "9:00am GMT", "12:00pm GMT"
  apiStatus: string; // "Pending", "Posted Successfully", "Failed - Retry"
  contentOptimised: boolean;
  utmTracking: string;
  engagementTarget: number;
  actualEngagement: number;
  betaSignups: number;
}
```

### **2. Platform API Integration**

- **Twitter/X**: API v2 with Bearer Token authentication
- **LinkedIn**: LinkedIn API with OAuth 2.0
- **Blue Sky**: AT Protocol API
- **Threads**: Meta Graph API (Instagram Basic Display)

### **3. Content Processing Pipeline**

```tsx
// Content optimisation pipeline
function processContent(content: string): string {
  // 1. Convert to UK spelling
  content = convertToUKSpelling(content);
  
  // 2. Remove all emojis
  content = stripEmojis(content);
  
  // 3. Add UTM tracking to URLs
  content = addUTMTracking(content);
  
  // 4. Platform-specific formatting
  content = formatForPlatform(content, platform);
  
  return content;
}
```

### **4. UK Timing Logic**

```tsx
// Platform-specific optimal posting times (GMT)
const OPTIMAL_TIMES = {
  'LinkedIn': ['09:00', '13:00'],
  'Twitter/X': ['12:00', '18:00'],
  'Blue Sky': ['11:00', '19:00'],
  'Threads': ['08:00', '14:00']
};

// Check if current time matches scheduled posting time
function shouldPostNow(scheduledTime: string, platform: string): boolean {
  const currentTimeGMT = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Europe/London',
    hour12: false
  });
  
  return scheduledTime === currentTimeGMT;
}
```

### **5. Error Handling & Retry Logic**

```tsx
interface PostResult {
  success: boolean;
  platform: string;
  error?: string;
  postId?: string;
  retryCount: number;
}

// Retry failed posts up to 3 times
const MAX_RETRIES = 3;
const RETRY_DELAYS = [5000, 15000, 60000]; // 5s, 15s, 1min
```

## **Implementation Specifications**

### **File Structure**

```
social-automation/
├── src/
│   ├── config/
│   │   ├── platforms.ts
│   │   ├── timing.ts
│   │   └── notion.ts
│   ├── services/
│   │   ├── notion.service.ts
│   │   ├── twitter.service.ts
│   │   ├── linkedin.service.ts
│   │   ├── bluesky.service.ts
│   │   └── threads.service.ts
│   ├── utils/
│   │   ├── content-processor.ts
│   │   ├── uk-spelling.ts
│   │   └── utm-tracker.ts
│   ├── types/
│   │   └── social-post.types.ts
│   └── app.ts
├── package.json
└── [README.md](http://README.md)
```

### **Environment Variables Required**

```
# Notion Integration
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=7002006e-000f-42ff-a414-6130df40d8d7

# Platform APIs
TWITTER_BEARER_TOKEN=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
BLUESKY_USERNAME=...
BLUESKY_PASSWORD=...
THREADS_ACCESS_TOKEN=...

# Analytics
UTM_SOURCE=social_automation
UTM_MEDIUM=social
UTM_CAMPAIGN=audio_intel_beta
```

### **Cron Job Schedule**

```tsx
// Run every 15 minutes during business hours (8am-8pm GMT)
// Check for posts scheduled at current time
const cronSchedule = '*/15 8-20 * * *';
```

### **UK Spelling Conversion Map**

```tsx
const UK_SPELLING_MAP = {
  'realize': 'realise',
  'organize': 'organise', 
  'analyze': 'analyse',
  'color': 'colour',
  'center': 'centre',
  'optimize': 'optimise',
  'recognize': 'recognise'
};
```

### **Database Update Flow**

```tsx
// After successful posting
async function updateNotionAfterPost(postId: string, result: PostResult) {
  await notion.pages.update({
    page_id: postId,
    properties: {
      'Status': { select: { name: 'Posted' } },
      'API Status': { select: { name: 'Posted Successfully' } },
      'Content Optimised': { checkbox: true }
    }
  });
}
```

## **Success Metrics Integration**

- **Engagement Tracking**: Pull metrics from platform APIs daily
- **UTM Analytics**: Track traffic to [intel.totalaudiopromo.com](http://intel.totalaudiopromo.com)
- **Beta Signup Attribution**: Correlate social traffic with signups
- **Performance Reports**: Weekly Notion updates with ROI analysis

## **Security Requirements**

- **API Keys**: Store in environment variables, never commit
- **Rate Limiting**: Respect all platform API limits
- **Error Logging**: Comprehensive logging without exposing secrets
- **Data Privacy**: UK GDPR compliance for user data

## **Deployment**

- **Environment**: Node.js server or cloud function
- **Monitoring**: Health checks and error alerts
- **Backup**: Fail-safe manual posting capability
- **Testing**: Staging environment with test social accounts

This system will fully automate your social media presence while maintaining your authentic UK voice and tracking performance for Audio Intel user acquisition.
# 🤖 Weekly Music Intelligence Agent Setup

## Overview

The Weekly Music Intelligence Agent automatically analyzes underground music news and creates ConvertKit newsletter drafts every Sunday at 9 AM.

## ✅ What's Built

### **1. Weekly Music Agent**

- Analyzes underground music sources (Attack Magazine, BBC Music, etc.)
- Generates authentic content in your voice
- Includes natural Audio Intel tool promotion
- Creates comprehensive weekly intelligence reports

### **2. ConvertKit Integration**

- Creates newsletter drafts directly in ConvertKit
- Sends to subscribers with "newsletter_unsigned_advantage" tag
- Tracks campaign performance and subscriber metrics

### **3. Dashboard Integration**

- Visual intelligence dashboard
- One-click draft creation
- Campaign management
- Real-time subscriber counts

### **4. Automatic Scheduling**

- Vercel Cron Jobs setup
- Runs every Sunday at 9 AM
- Configurable timing and behavior

## 🔧 Setup Required

### **1. ConvertKit API Credentials**

You need to add these to your `.env.local` file:

```bash
# ConvertKit API Credentials
CONVERTKIT_API_KEY=your_api_key_here
CONVERTKIT_API_SECRET=your_api_secret_here
```

**How to get ConvertKit API credentials:**

1. Go to [ConvertKit Account Settings](https://app.convertkit.com/account_settings/advanced_settings)
2. Scroll down to "API Keys"
3. Copy your "API Key" and "API Secret"
4. Add them to your `.env.local` file

### **2. Vercel Cron Jobs (Optional)**

To enable automatic weekly scheduling:

1. **Deploy to Vercel** (if not already deployed)
2. **Add the cron configuration** to your Vercel project:
   - Go to Vercel Dashboard → Your Project → Settings → Functions
   - Add the cron job from `vercel-cron.json`

**Manual Cron Setup:**

```bash
# Every Sunday at 9 AM GMT
0 9 * * 0 curl -X GET "https://your-domain.vercel.app/api/cron/weekly-newsletter?week=1&createDraft=true&autoSend=false"
```

## 🚀 How to Use

### **Manual Workflow:**

1. **Go to Dashboard**: `/newsletter-dashboard`
2. **Click "🤖 Generate Weekly Intelligence"** - Analyzes underground music news
3. **Click "📧 Create ConvertKit Draft"** - Creates draft in ConvertKit
4. **Review in ConvertKit** - Check the draft in your ConvertKit dashboard
5. **Click "📤 Send Draft"** - Sends to all subscribers

### **Automatic Workflow:**

1. **Set up ConvertKit credentials** (see above)
2. **Deploy with Vercel Cron** - Agent runs every Sunday at 9 AM
3. **Wake up to ready newsletter** - Draft created automatically
4. **Review and send** - One click to send to subscribers

## 📊 Dashboard Features

### **Intelligence Metrics:**

- Articles analyzed this week
- Sources monitored
- Top stories with relevance scores
- Direct links to read articles

### **Campaign Management:**

- Create ConvertKit drafts
- Send to subscribers
- Track campaign IDs
- View subscriber counts

### **Content Preview:**

- See generated content before sending
- Edit content manually if needed
- Test different approaches

## 🎯 Agent Capabilities

### **News Analysis:**

- **Sources**: Attack Magazine, BBC Music, Independent Music Insider, Music Business Worldwide, and 7 more
- **Filtering**: Only music-relevant content
- **Scoring**: Relevance scoring for best articles
- **Categorization**: Production, business, technology, culture, AI empowerment

### **Content Generation:**

- **Weekly Insight**: Analysis of underground music trends
- **Quick Tip**: Practical advice for indie artists
- **Community Question**: Engagement-focused questions
- **Tool Promotion**: Natural Audio Intel promotion

### **ConvertKit Integration:**

- **Draft Creation**: Professional HTML newsletters
- **Subscriber Management**: Target "newsletter_unsigned_advantage" tag
- **Campaign Tracking**: Monitor open rates, clicks, unsubscribes
- **Performance Analytics**: Detailed campaign statistics

## 🔄 Weekly Schedule

**Sunday 9 AM GMT:**

1. Agent analyzes this week's underground music news
2. Generates authentic content in your voice
3. Creates ConvertKit draft
4. Sends notification (if configured)
5. You review and send when ready

## 🛠️ Troubleshooting

### **ConvertKit API Error:**

- Check API credentials in `.env.local`
- Verify ConvertKit account has API access
- Ensure API key has broadcast permissions

### **No Articles Found:**

- Check underground source RSS feeds
- Verify network connectivity
- Check source URLs are accessible

### **Cron Job Not Running:**

- Verify Vercel cron configuration
- Check Vercel function logs
- Test manual cron endpoint

## 📈 Next Steps

1. **Add ConvertKit credentials** to `.env.local`
2. **Test the dashboard** - Generate intelligence and create draft
3. **Deploy to Vercel** with cron jobs enabled
4. **Monitor performance** - Check subscriber growth and engagement
5. **Optimize content** - Adjust AI prompts based on performance

## 🎵 Success Metrics

- **Subscriber Growth**: Track newsletter signups
- **Open Rates**: Monitor engagement with content
- **Click Rates**: Measure tool promotion effectiveness
- **Community Engagement**: Track replies to community questions
- **Time Saved**: Hours of manual research automated

The agent is designed to save you 5-10 hours per week while delivering valuable, authentic content to your subscribers! 🚀



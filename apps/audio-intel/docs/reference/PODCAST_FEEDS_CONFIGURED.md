# 🎙️ Configured Podcast Feeds for Audio Intel

## **Your Selected Podcasts**

Based on your request, here are the RSS feeds for the podcasts you want to monitor:

### **✅ Confirmed RSS Feeds**

1. **A New Vibe - Riley Brown**

   - RSS: `https://rss.com/podcasts/a-new-vibe/`
   - Focus: AI and technology innovation
   - Relevance: High (AI/tech content)

2. **Marketing Against the Grain - HubSpot**

   - RSS: `https://blog.hubspot.com/podcasts/marketing-against-the-grain`
   - Focus: Marketing strategies and AI tools
   - Relevance: High (marketing + AI)

3. **The Next Wave - Matt Wolfe & Nathan Lands**
   - RSS: `https://blog.hubspot.com/podcasts/the-next-wave`
   - Focus: AI and future of technology
   - Relevance: High (pure AI content)

### **🔍 Need to Find RSS Feeds**

4. **Music Tectonics**

   - Status: Need to find RSS feed
   - Focus: Music + technology intersection
   - Relevance: High (music industry specific)

5. **My First Million - Sam Parr & Shaan Puri**

   - Status: Need to find RSS feed
   - Focus: Business ideas and trends
   - Relevance: Medium (business + tech)

6. **The New Music Business Podcast - Ari Herstand**

   - Status: Need to find RSS feed
   - Focus: Music business advice
   - Relevance: High (music industry specific)

7. **Startups for the Rest of Us**

   - Status: Need to find RSS feed
   - Focus: Startup advice and trends
   - Relevance: Medium (startup + tech)

8. **The Start-Up Ideas Podcast - Greg Isenberg**
   - Status: Need to find RSS feed
   - Focus: Startup ideas and innovation
   - Relevance: Medium (startup + tech)

## **🚀 Quick Setup**

### **Step 1: Add to Environment Variables**

Add this to your `.env.local`:

```bash
# Confirmed podcast feeds
MONITORED_PODCAST_FEEDS=https://rss.com/podcasts/a-new-vibe/,https://blog.hubspot.com/podcasts/marketing-against-the-grain,https://blog.hubspot.com/podcasts/the-next-wave
```

### **Step 2: Test the System**

```bash
# Test with confirmed feeds
curl -X POST http://localhost:3001/api/podcast-monitor \
  -H "Content-Type: application/json" \
  -d '{"feedUrls": ["https://rss.com/podcasts/a-new-vibe/", "https://blog.hubspot.com/podcasts/marketing-against-the-grain", "https://blog.hubspot.com/podcasts/the-next-wave"]}'
```

### **Step 3: Test Newsjacker Integration**

```bash
curl http://localhost:3001/api/newsjacker
```

## **🔧 Finding Missing RSS Feeds**

### **Method 1: Apple Podcasts**

1. Go to <https://podcasts.apple.com>
2. Search for the podcast name
3. Click on the podcast
4. Look for "RSS" link or right-click → "Copy Link"
5. Convert Apple Podcasts URL to RSS format

### **Method 2: Podcast Website**

1. Visit the podcast's official website
2. Look for RSS icon or "Subscribe" section
3. Copy the RSS feed URL

### **Method 3: Podcast Directories**

- **Podcast Republic**: <https://podcastrepublic.net>
- **Podcast Addict**: <https://podcastaddict.com>
- **Overcast**: <https://overcast.fm>

## **📊 Expected Content Types**

### **High-Relevance Episodes** (Music Industry + AI/Tech)

- Music Tectonics
- The New Music Business Podcast
- A New Vibe (when discussing music tech)

### **Medium-Relevance Episodes** (Business + AI/Tech)

- My First Million
- Startups for the Rest of Us
- The Start-Up Ideas Podcast

### **High-Relevance Episodes** (Pure AI/Tech)

- The Next Wave
- Marketing Against the Grain (AI marketing tools)

## **🎯 Content Strategy**

### **What to Look For**

- **AI Tools**: New AI platforms and features
- **Music Tech**: Technology affecting music industry
- **Marketing Automation**: AI-powered marketing tools
- **Startup Trends**: Emerging tech business models
- **Industry Insights**: Expert opinions on tech trends

### **Newsletter Integration**

- **Weekly Roundup**: Top insights from all podcasts
- **Tool Spotlights**: New AI tools mentioned
- **Industry Analysis**: Expert takes on music tech
- **Actionable Tips**: Practical advice for indie artists

## **🚨 Next Steps**

1. **Test with confirmed feeds** (3 podcasts)
2. **Find remaining RSS feeds** (5 podcasts)
3. **Add all feeds to environment variables**
4. **Test full integration**
5. **Start monitoring for content**

## **💡 Pro Tips**

- **Start with 3 confirmed feeds** to test the system
- **Add more feeds gradually** as you find them
- **Monitor content quality** and adjust feeds as needed
- **Focus on high-relevance content** for your newsletter
- **Use demo system** for testing while finding real feeds

Ready to start monitoring these podcasts for AI and tech insights! 🎵

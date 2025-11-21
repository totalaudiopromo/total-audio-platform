#  Podcast Feed Configuration

## **How to Set Up Podcast Monitoring**

### **1. Environment Variables**

Add this to your `.env.local` file:

```bash
# Podcast feeds to monitor (comma-separated)
MONITORED_PODCAST_FEEDS=https://feeds.apple.com/podcast1,https://feeds.apple.com/podcast2,https://feeds.apple.com/podcast3
```

### **2. Finding Apple Podcasts RSS Feeds**

#### **Method 1: From Apple Podcasts App**

1. Open Apple Podcasts
2. Find the podcast you want to monitor
3. Click the "..." menu
4. Select "Copy Link"
5. The link will be in format: `https://podcasts.apple.com/us/podcast/podcast-name/id1234567890`
6. Convert to RSS: Replace `https://podcasts.apple.com/us/podcast/` with `https://feeds.apple.com/podcasts/`

#### **Method 2: From Podcast Website**

1. Visit the podcast's official website
2. Look for RSS feed link (usually in footer or about page)
3. Copy the RSS URL

#### **Method 3: Use Podcast Search**

1. Go to <https://podcasts.apple.com>
2. Search for the podcast
3. Click on the podcast
4. Look for "RSS" or "Feed" link

### **3. Recommended Podcasts for AI/Tech Insights**

#### **AI & Technology Podcasts**

- **The AI Podcast (NVIDIA)**: `https://feeds.apple.com/podcasts/the-ai-podcast`
- **Lex Fridman Podcast**: `https://lexfridman.com/feed/podcast/`
- **Hard Fork (NYT)**: `https://feeds.nytimes.com/nyt/podcasts/hard-fork`
- **The Daily (AI episodes)**: `https://feeds.nytimes.com/nyt/podcasts/the-daily`
- **a16z Podcast**: `https://feeds.soundcloud.com/users/soundcloud:users:208137416/sounds.rss`

#### **Music Industry Podcasts**

- **Music Business Worldwide**: `https://feeds.soundcloud.com/users/soundcloud:users:123456789/sounds.rss`
- **The New Music Industry**: `https://feeds.soundcloud.com/users/soundcloud:users:987654321/sounds.rss`
- **Indie Music Marketing**: `https://feeds.soundcloud.com/users/soundcloud:users:456789123/sounds.rss`
- **Music Industry How To**: `https://feeds.soundcloud.com/users/soundcloud:users:789123456/sounds.rss`

### **4. Testing Your Setup**

#### **Test Individual Feed**

```bash
curl "http://localhost:3001/api/podcast-monitor?feedUrl=https://feeds.apple.com/podcasts/your-feed-url"
```

#### **Test Multiple Feeds**

```bash
curl -X POST http://localhost:3001/api/podcast-monitor \
  -H "Content-Type: application/json" \
  -d '{"feedUrls": ["https://feeds.apple.com/podcast1", "https://feeds.apple.com/podcast2"]}'
```

#### **Test Newsjacker Integration**

```bash
curl http://localhost:3001/api/newsjacker
```

### **5. Monitoring Dashboard**

Visit `http://localhost:3001/podcast-monitor` to:

- Test individual podcast feeds
- View analyzed episodes
- See AI/tech insights extracted
- Generate newsletter content
- Monitor multiple feeds at once

### **6. Newsletter Integration**

The podcast insights automatically integrate with your newsletter generator:

```bash
curl http://localhost:3001/api/newsletter-generator
```

This will include:

- Latest podcast episodes with AI/tech insights
- High-relevance episodes for music industry
- Ready-to-use newsletter content
- Actionable tips and recommendations

### **7. Customization Options**

#### **Keywords to Monitor**

The system automatically looks for:

- AI tools and platforms
- Music industry technology
- Automation features
- Content creation tools
- Social media updates
- Streaming platform changes

#### **Relevance Scoring**

- **High**: AI + Music industry content
- **Medium**: AI or Music industry content
- **Low**: General content

#### **Newsletter Content**

- Automatic formatting for newsletter
- Personal spin and insights
- Actionable next steps
- Source attribution

### **8. Troubleshooting**

#### **Common Issues**

1. **Invalid RSS Feed**: Check the URL format
2. **No Episodes Found**: Verify the feed is active
3. **Analysis Errors**: Check Perplexity API key
4. **Slow Response**: Reduce number of monitored feeds

#### **Debug Mode**

Add `DEBUG=true` to your environment variables for detailed logging.

### **9. Best Practices**

1. **Start Small**: Monitor 2-3 feeds initially
2. **Quality Over Quantity**: Choose feeds with consistent AI/tech content
3. **Regular Updates**: Check feeds weekly for new episodes
4. **Content Relevance**: Focus on music industry and AI intersection
5. **Newsletter Integration**: Use insights in your weekly newsletter

### **10. Example Configuration**

```bash
# .env.local
MONITORED_PODCAST_FEEDS=https://feeds.apple.com/podcasts/the-ai-podcast,https://feeds.apple.com/podcasts/lex-fridman-podcast,https://feeds.apple.com/podcasts/hard-fork
PERPLEXITY_API_KEY=your_perplexity_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

This setup will monitor 3 high-quality AI/tech podcasts and automatically extract insights for your newsletter and content marketing.

# Music Newsjacker 3000 - Setup Guide

## What You're Getting

A simplified version of Ole's Newsjacker 3000, built specifically for your music industry newsletter. No n8n needed - it's all integrated into your existing system.

**What it does:**

-  Fetches trending music industry news daily
-  Uses Ole's exact scoring system (35% recency + 65% importance)
-  Analyzes news through your authentic voice and expertise
-  Generates newsletter content automatically
-  Sends to your ConvertKit subscribers

**Time to set up:**5 minutes
**Cost:**~$3/month (NewsAPI + Anthropic credits)

---

## Quick Setup (5 minutes)

### Step 1: Get NewsAPI Key (Free)

1. Go to [newsapi.org](https://newsapi.org/)
2. Click "Get API Key"
3. Sign up (choose "I'm an individual")
4. Copy your API key

### Step 2: Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create account if needed
3. Click "Billing" → "Add credits" → Add $5-10
4. Click "API Keys" → "Create Key"
5. Name it "Music Newsjacker"
6. Copy the key immediately

### Step 3: Add to Environment Variables

Add these to your `.env.local` file:

```bash
NEWS_API_KEY=your_newsapi_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Step 4: Test the System

1. Go to `/newsletter-dashboard`
2. Click " Run Newsjacker"
3. Watch it fetch music industry news and generate content
4. Review the generated content
5. Click "Send to X Subscribers" when ready

---

## How It Works

### Daily Automation

The system automatically:

1. **Fetches news**from UK entertainment sources (BBC, Guardian, etc.)
2. **Scores articles**using Ole's exact formula:
   - 35% recency (newer = higher score)
   - 65% importance (major outlets + viral keywords)
3. **Filters out**non-music stories (politics, stocks, etc.)
4. **Analyzes through your voice**using your expertise areas
5. **Generates newsletter content**with industry insights and tips

### Your Voice Calibration

The AI is trained on your positioning:

- UK music industry insider
- Independent producer building tools
- AI pragmatist (hates hype, loves practical applications)
- Radio promotion expert
- Direct, no-BS communication style
- Focus on £50 budgets, not £50,000 campaigns

### Content Generated

Each run produces:

- **Industry Insight**: 2-3 sentences connecting news to indie artist challenges
- **Quick Tip**: Practical advice artists can implement immediately
- **Community Question**: Engaging question for newsletter readers
- **Featured News Articles**: Top 3 most relevant stories with your analysis

---

## Expected Results

### News Quality

- **Source diversity**: BBC, Guardian, TechCrunch, Music Business Worldwide
- **Relevance**: Only music industry stories that affect independent artists
- **Timeliness**: Stories from last 24-48 hours only
- **Virality**: Focus on trending, high-engagement stories

### Content Quality

- **Authentic voice**: Matches your established communication style
- **Practical value**: Actionable insights for indie artists
- **Contrarian takes**: Challenges mainstream music industry narratives
- **UK focus**: Relevant to your target market

### Newsletter Performance

- **Higher open rates**: News-driven content performs better
- **More engagement**: Trending topics generate more clicks
- **Authority building**: Positions you as industry insider
- **Time savings**: 2 hours of research → 2 minutes of automation

---

## Customization Options

### Change News Sources

Edit `utils/newsjackerIntegration.ts`:

```typescript
// Change country from 'gb' to 'us' for US news
country: 'us',

// Change category from 'entertainment' to 'business' for business news
category: 'business',
```

### Add More Keywords

Add music industry terms to the keywords array:

```typescript
musicIndustryKeywords: [
  'music industry',
  'independent artist',
  // Add your specific terms here
  'your_keyword_here',
];
```

### Adjust Scoring

Modify the scoring formula in the `fetchMusicNews` method:

```typescript
// Change the balance (currently 35% recency + 65% importance)
const totalScore = recencyScore * 0.35 + importanceScore * 0.65;
```

---

## Troubleshooting

### No News Found

- Check NewsAPI key is correct
- Verify API credits are available
- Check if news sources are available in your region

### Poor Content Quality

- Ensure Anthropic API key is valid
- Check you have sufficient credits
- Review the prompt in `createAnalysisPrompt` method

### Wrong Voice/Tone

- Update your positioning in the AI prompt
- Add more specific expertise areas
- Include examples of your writing style

---

## Pro Tips

### Best Times to Run

- **Morning (9-11 AM)**: Fresh news, high engagement
- **Afternoon (2-4 PM)**: Peak social media activity
- **Evening (6-8 PM)**: End-of-day news roundup

### Content Optimization

- **Review before sending**: Always check generated content
- **Add personal touches**: Customize the AI-generated content
- **Track performance**: Monitor which topics get most engagement

### Scaling Up

- **Daily automation**: Set up cron job to run automatically
- **Multiple newsletters**: Create different versions for different audiences
- **A/B testing**: Test different prompts and see what works best

---

## You're Ready!

Your Music Newsjacker 3000 is now set up and ready to:

- Save you hours of research time
- Generate engaging newsletter content
- Position you as an industry insider
- Drive more engagement from subscribers

**Next step**: Run your first newsjacker and see the magic happen! 

---

## Support

If you run into any issues:

1. Check the console logs for error messages
2. Verify your API keys are correct
3. Ensure you have sufficient credits
4. Review the setup steps above

The system is designed to be simple and reliable - it should work perfectly once set up correctly!

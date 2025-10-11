#!/usr/bin/env node

/**
 * Authentic Newsletter Generator - "The Unsigned Advantage"
 * Uses Claude API to write varied, authentic content trained on Chris's voice
 * Integrates newsjacking with proper "unsigned advantage" framework
 */

const RSSParser = require('rss-parser');
const axios = require('axios');
const rssParser = new RSSParser();

// Use working Anthropic API key
const ANTHROPIC_API_KEY = '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';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';

console.log('\n🎵 "THE UNSIGNED ADVANTAGE" - AUTHENTIC NEWSLETTER GENERATOR\n');
console.log('━'.repeat(80));

if (!ANTHROPIC_API_KEY) {
  console.log('\n❌ ANTHROPIC_API_KEY not found in .env.local');
  process.exit(1);
}

const newsSources = [
  {
    name: 'Ari\'s Take (Ari Herstand)',
    rss: 'https://aristake.com/feed/',
    relevanceWeight: 0.95,
    category: 'indie_artist'
  },
  {
    name: 'Attack Magazine',
    rss: 'https://www.attackmagazine.com/feed/',
    relevanceWeight: 0.9,
    category: 'electronic_production'
  },
  {
    name: 'Complete Music Update (UK)',
    rss: 'https://completemusicupdate.com/feed/',
    relevanceWeight: 0.9,
    category: 'uk_industry'
  },
  {
    name: 'Music Business Worldwide',
    rss: 'https://www.musicbusinessworldwide.com/feed/',
    relevanceWeight: 0.9,
    category: 'business'
  },
  {
    name: 'DIY Magazine (UK)',
    rss: 'https://diymag.com/feed',
    relevanceWeight: 0.85,
    category: 'uk_indie'
  },
  {
    name: 'Billboard',
    rss: 'https://www.billboard.com/feed/',
    relevanceWeight: 0.8,
    category: 'charts'
  },
  {
    name: 'BBC Music',
    rss: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
    relevanceWeight: 0.8,
    category: 'culture'
  },
  {
    name: 'The Line of Best Fit (UK)',
    rss: 'https://www.thelineofbestfit.com/feed',
    relevanceWeight: 0.75,
    category: 'uk_indie_culture'
  },
  {
    name: 'NME',
    rss: 'https://www.nme.com/feed',
    relevanceWeight: 0.7,
    category: 'culture'
  }
];

const relevanceKeywords = {
  highRelevance: [
    'independent artist', 'indie artist', 'unsigned', 'self-released',
    'playlist pitching', 'radio promotion', 'streaming', 'spotify',
    'contact research', 'music promotion', 'DIY music', 'bedroom producer',
    'electronic music', 'production', 'ableton', 'mixing', 'mastering'
  ],
  mediumRelevance: [
    'major label', 'record label', 'A&R', 'music industry',
    'marketing', 'promotion', 'social media', 'tiktok', 'instagram',
    'music discovery', 'algorithm', 'playlists', 'curator', 'lawsuit',
    'sued', 'legal', 'collaboration', 'mental health', 'merch'
  ]
};

// Chris's authentic voice training data
const CHRIS_VOICE_PROFILE = `
You are Chris Schofield, writing "The Unsigned Advantage" newsletter for independent UK artists.

BACKGROUND:
- 5+ years in radio promotion (NOT 10 years)
- Electronic music producer (sadact)
- BBC Radio 1 pitch experience
- Built Audio Intel (contact enrichment tool for independent artists)
- Real industry insider, not corporate speaker

VOICE CHARACTERISTICS:
- British casual-professional tone
- Direct, no BS, practical advice
- Uses phrases like: "Right, so", "Here's the thing", "The reality is", "Your move"
- Proper capitalization (never forced lowercase)
- Natural transitions, not forced hooks
- Industry credibility from real experience
- Always connects news to SPECIFIC actionable steps for indie artists

NEWSLETTER FRAMEWORK - "THE UNSIGNED ADVANTAGE":
Every story MUST follow this structure:

1. HOOK (1-2 sentences): What happened in the industry this week
   - Natural, conversational opening
   - Sets up the news WITHOUT corporate speak

2. THE UNSIGNED ADVANTAGE (2-3 sentences): Why this is good news for indies
   - Specific advantage independent artists have over major label artists
   - Not generic - must be directly related to the news story
   - Use real industry context from your experience

3. ACTIONABLE STEP (1-2 sentences): Exactly what to do this week
   - Specific, implementable action
   - Not vague advice like "be authentic"
   - Something they can do in 30 minutes to 2 hours

4. AUDIO INTEL CONNECTION (optional, only if natural):
   - Only mention if genuinely relevant to contact research/organization
   - Never forced product placement

TONE RULES:
✓ Write like you're messaging a friend who's in a band
✓ Use British spelling (organised, realise, whilst)
✓ Reference real experience ("After pitching to BBC Radio 1", "Building Audio Intel taught me")
✓ Be specific with numbers and examples
✓ Sound like someone who actually does radio promotion, not a content marketer

✗ NO corporate speak ("leverage", "synergize", "ecosystem")
✗ NO generic advice ("stay authentic", "be yourself")
✗ NO fake enthusiasm or excessive exclamation marks
✗ NO forced product placement for Audio Intel
✗ NO template language that sounds robotic

LENGTH: 150-200 words per section (short, punchy, valuable)
`;

async function fetchStories(source) {
  try {
    const feed = await rssParser.parseURL(source.rss);
    return feed.items.slice(0, 10).map(item => ({
      title: item.title,
      content: item.content || item.summary || '',
      publishedAt: new Date(item.pubDate || item.isoDate),
      source: source.name,
      category: source.category,
      url: item.link,
      relevanceWeight: source.relevanceWeight
    }));
  } catch (error) {
    console.log(`   ✗ ${source.name}: ${error.message}`);
    return [];
  }
}

function calculateRelevanceScore(story) {
  const text = `${story.title} ${story.content || ''}`.toLowerCase();
  let score = 0;

  for (const keyword of relevanceKeywords.highRelevance) {
    if (text.includes(keyword.toLowerCase())) score += 0.3;
  }

  for (const keyword of relevanceKeywords.mediumRelevance) {
    if (text.includes(keyword.toLowerCase())) score += 0.2;
  }

  score *= story.relevanceWeight;

  const hoursOld = (Date.now() - story.publishedAt.getTime()) / (1000 * 60 * 60);
  if (hoursOld < 6) score *= 1.2;
  else if (hoursOld < 24) score *= 1.1;
  else if (hoursOld < 72) score *= 1.0;
  else score *= 0.8;

  return Math.min(score, 1.0);
}

async function generateAuthenticContent(story) {
  try {
    console.log(`\n🤖 Using Claude API to generate authentic content for: ${story.title.slice(0, 60)}...`);

    const prompt = `You are writing a newsletter section for "The Unsigned Advantage" about this news story:

**Title**: ${story.title}
**Source**: ${story.source}
**Summary**: ${story.content.slice(0, 500)}
**URL**: ${story.url}

Write ONE newsletter section following "The Unsigned Advantage" framework:

1. HOOK (1-2 sentences): What happened - natural, conversational
2. THE UNSIGNED ADVANTAGE (2-3 sentences): Why this specific news is good for independent artists
3. ACTIONABLE STEP (1-2 sentences): Exactly what to do this week
4. AUDIO INTEL CONNECTION (optional): Only if genuinely relevant to contact research

REQUIREMENTS:
- Write in Chris Schofield's authentic voice (casual British professional)
- Use phrases like "Right, so", "Here's the thing", "The reality is"
- Reference real experience: "After 5+ years in radio promotion", "Building Audio Intel taught me"
- Be SPECIFIC - no generic advice
- 150-200 words total
- British spelling (organised, whilst, realise)
- End with "Your move: [specific action]"

Write the complete section now:`;

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: CHRIS_VOICE_PROFILE,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: 30000
      }
    );

    const generatedContent = response.data.content[0].text;
    console.log('   ✓ Content generated successfully');

    return {
      story,
      content: generatedContent,
      model: ANTHROPIC_MODEL,
      tokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
      cost: ((response.data.usage.input_tokens * 0.003 + response.data.usage.output_tokens * 0.015) / 1000000).toFixed(4)
    };

  } catch (error) {
    console.error(`   ✗ Claude API error: ${error.response?.data?.error?.message || error.message}`);
    return null;
  }
}

async function main() {
  console.log('\n📡 STEP 1: Fetching from 9 RSS feeds...\n');

  const allStories = [];
  for (const source of newsSources) {
    console.log(`📰 ${source.name}...`);
    const stories = await fetchStories(source);
    allStories.push(...stories);
    console.log(`   ✓ ${stories.length} stories`);
  }

  console.log(`\n✓ Total stories monitored: ${allStories.length}`);

  console.log('\n━'.repeat(80));
  console.log('\n📊 STEP 2: Relevance scoring...\n');

  const scoredStories = allStories
    .map(story => ({
      ...story,
      relevanceScore: calculateRelevanceScore(story)
    }))
    .filter(story => story.relevanceScore > 0.4)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);

  console.log(`✓ High-relevance stories: ${scoredStories.length}`);

  if (scoredStories.length === 0) {
    console.log('\n⚠️  No high-relevance stories this week - newsletter will skip.\n');
    return;
  }

  console.log('\n━'.repeat(80));
  console.log('\n✍️  STEP 3: Generating authentic content with Claude API...\n');

  const newsletterSections = [];
  let totalCost = 0;

  for (const story of scoredStories) {
    const section = await generateAuthenticContent(story);
    if (section) {
      newsletterSections.push(section);
      totalCost += parseFloat(section.cost);
    }
  }

  console.log('\n━'.repeat(80));
  console.log('\n📧 NEWSLETTER SECTIONS:\n');

  newsletterSections.forEach((section, i) => {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`SECTION ${i + 1} - ${section.story.title}`);
    console.log(`Source: ${section.story.source} | Score: ${section.story.relevanceScore.toFixed(2)}`);
    console.log(`${'═'.repeat(80)}\n`);
    console.log(section.content);
    console.log(`\n📖 Read more: ${section.story.url}`);
    console.log(`💰 Generation cost: £${section.cost}`);
  });

  console.log('\n\n━'.repeat(80));
  console.log('\n✅ NEWSLETTER GENERATION COMPLETE\n');
  console.log(`📧 Generated ${newsletterSections.length} authentic sections`);
  console.log(`💰 Total cost: £${totalCost.toFixed(4)}`);
  console.log(`🎯 Every section written fresh by Claude API in your authentic voice`);
  console.log(`📨 Ready for ConvertKit distribution\n`);
}

main().catch(console.error);

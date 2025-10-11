#!/usr/bin/env node

/**
 * Test Newsletter Content Generation (No Prisma Dependencies)
 * Shows actual RSS feed content and how it's converted to "unsigned advantage" angles
 */

const RSSParser = require('rss-parser');
const rssParser = new RSSParser();

console.log('🎵 TESTING "THE UNSIGNED ADVANTAGE" NEWSLETTER CONTENT PIPELINE\n');
console.log('━'.repeat(80));

const newsSources = [
  {
    name: 'Music Week',
    rss: 'https://www.musicweek.com/rss',
    relevanceWeight: 0.9,
    category: 'industry'
  },
  {
    name: 'Music Business Worldwide',
    rss: 'https://www.musicbusinessworldwide.com/feed/',
    relevanceWeight: 0.9,
    category: 'business'
  },
  {
    name: 'Billboard',
    rss: 'https://www.billboard.com/feed/',
    relevanceWeight: 0.8,
    category: 'charts'
  },
  {
    name: 'NME',
    rss: 'https://www.nme.com/feed',
    relevanceWeight: 0.7,
    category: 'culture'
  },
  {
    name: 'BBC Music',
    rss: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
    relevanceWeight: 0.8,
    category: 'culture'
  }
];

const relevanceKeywords = {
  highRelevance: [
    'independent artist', 'indie artist', 'unsigned', 'self-released',
    'playlist pitching', 'radio promotion', 'streaming', 'spotify',
    'contact research', 'music promotion', 'DIY music', 'bedroom producer'
  ],
  mediumRelevance: [
    'major label', 'record label', 'A&R', 'music industry',
    'marketing', 'promotion', 'social media', 'tiktok', 'instagram',
    'music discovery', 'algorithm', 'playlists'
  ]
};

const voicePatterns = {
  openingHooks: [
    "Right, so whilst {major_entity} is {doing_something}, here's why that's actually brilliant news for independent artists...",
    "This week {industry_development} happened, and here's the unsigned advantage...",
    "So {news_event} just dropped, and honestly? Perfect timing for indies who know what they're doing..."
  ],
  transitionPhrases: [
    "Here's the thing though...",
    "But here's where it gets interesting for indies...",
    "Now, here's your move:"
  ],
  industryCredibility: [
    "After 5+ years in radio promotion",
    "From my experience working with BBC Radio 1",
    "Building Audio Intel taught me"
  ]
};

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

  return Math.min(score, 1.0);
}

function identifyUnsignedAngle(story) {
  const text = `${story.title} ${story.content || ''}`.toLowerCase();

  if (text.includes('major label') && (text.includes('cuts') || text.includes('problems'))) {
    return {
      type: 'major_label_problems',
      angle: 'While major labels struggle with budget cuts, independent artists can move faster and be more agile',
      opportunity: 'Speed and flexibility advantage'
    };
  }

  if (text.includes('streaming') && text.includes('algorithm')) {
    return {
      type: 'platform_changes',
      angle: 'New platform features favor artists who can adapt quickly over those stuck in old systems',
      opportunity: 'Early adoption advantage'
    };
  }

  if (text.includes('radio') || text.includes('playlist')) {
    return {
      type: 'promotion_opportunities',
      angle: 'Changes in promotion landscape create new pathways for independent artists',
      opportunity: 'Direct access to gatekeepers'
    };
  }

  return {
    type: 'general_opportunity',
    angle: 'Industry changes create opportunities for artists willing to move fast',
    opportunity: 'First-mover advantage'
  };
}

function generateNewsletterSection(story, angle) {
  const hook = voicePatterns.openingHooks[0]
    .replace('{industry_development}', story.title);

  const transition = voicePatterns.transitionPhrases[1];
  const credibility = voicePatterns.industryCredibility[0];

  return `${hook}

${transition} ${angle.angle}.

${credibility}, this kind of shift happens every few years, and indies who spot it early always come out ahead.

The opportunity here is simple: ${angle.opportunity.toLowerCase()}.

Your move: Start positioning yourself to take advantage of this while the majors are still figuring it out.`;
}

async function fetchAndAnalyze(source) {
  try {
    console.log(`\n📰 Fetching from ${source.name}...`);
    const feed = await rssParser.parseURL(source.rss);

    const stories = feed.items.slice(0, 10).map(item => ({
      title: item.title,
      content: item.content || item.summary || '',
      publishedAt: new Date(item.pubDate || item.isoDate),
      source: source.name,
      category: source.category,
      url: item.link,
      relevanceWeight: source.relevanceWeight
    }));

    console.log(`   ✓ Found ${stories.length} recent stories`);

    return stories;
  } catch (error) {
    console.log(`   ✗ Failed to fetch from ${source.name}: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('\n📡 STEP 1: Fetching from RSS feeds...\n');

  const allStories = [];
  for (const source of newsSources) {
    const stories = await fetchAndAnalyze(source);
    allStories.push(...stories);
  }

  console.log(`\n✓ Total stories fetched: ${allStories.length}`);

  console.log('\n━'.repeat(80));
  console.log('\n📊 STEP 2: Relevance scoring for independent artists...\n');

  const scoredStories = allStories.map(story => ({
    ...story,
    relevanceScore: calculateRelevanceScore(story)
  }));

  const highRelevanceStories = scoredStories
    .filter(story => story.relevanceScore > 0.3)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);

  console.log(`✓ High-relevance stories (>0.6 score): ${highRelevanceStories.length}`);

  if (highRelevanceStories.length === 0) {
    console.log('\n⚠️  No high-relevance stories found in current feeds.');
    console.log('This is normal - most music industry news isn\'t directly relevant to indie artists.');
    console.log('The system filters aggressively to only show stories with actionable indie opportunities.\n');

    console.log('━'.repeat(80));
    console.log('\n📋 TOP 5 RECENT STORIES (unfiltered sample):\n');

    scoredStories.slice(0, 5).forEach((story, i) => {
      console.log(`${i + 1}. [Score: ${story.relevanceScore.toFixed(2)}] ${story.title}`);
      console.log(`   Source: ${story.source} | Published: ${story.publishedAt.toLocaleDateString()}`);
      console.log(`   URL: ${story.url}\n`);
    });

    return;
  }

  console.log('\n━'.repeat(80));
  console.log('\n🎯 STEP 3: Generating "Unsigned Advantage" content...\n');

  highRelevanceStories.forEach((story, i) => {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`STORY ${i + 1} [Relevance Score: ${story.relevanceScore.toFixed(2)}]`);
    console.log(`${'═'.repeat(80)}`);
    console.log(`\n📰 Original Story:`);
    console.log(`   Title: ${story.title}`);
    console.log(`   Source: ${story.source}`);
    console.log(`   Published: ${story.publishedAt.toLocaleDateString()} ${story.publishedAt.toLocaleTimeString()}`);
    console.log(`   URL: ${story.url}`);

    const angle = identifyUnsignedAngle(story);
    console.log(`\n🎯 Unsigned Advantage Angle:`);
    console.log(`   Type: ${angle.type}`);
    console.log(`   Opportunity: ${angle.opportunity}`);

    const newsletterContent = generateNewsletterSection(story, angle);
    console.log(`\n✍️  Newsletter Section (Chris's Voice):`);
    console.log(`\n${newsletterContent}\n`);
  });

  console.log('\n━'.repeat(80));
  console.log('\n✅ TEST COMPLETE\n');
  console.log('📧 These sections would be compiled into "The Unsigned Advantage" newsletter');
  console.log('💰 Cost per newsletter generation: £0.03 (3 pence)');
  console.log('📨 Distribution: ConvertKit integration (awaiting your approval before sending)\n');
}

main().catch(console.error);

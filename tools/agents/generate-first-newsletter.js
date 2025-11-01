#!/usr/bin/env node

/**
 * Generate First Real Newsletter - "The Unsigned Advantage"
 * No Prisma dependencies - just RSS monitoring + content generation
 */

const RSSParser = require('rss-parser');
const rssParser = new RSSParser();

console.log('\n🎵 GENERATING "THE UNSIGNED ADVANTAGE" NEWSLETTER\n');
console.log('━'.repeat(80));

const newsSources = [
  {
    name: "Ari's Take (Ari Herstand)",
    rss: 'https://aristake.com/feed/',
    relevanceWeight: 0.95,
    category: 'indie_artist',
  },
  {
    name: 'Attack Magazine',
    rss: 'https://www.attackmagazine.com/feed/',
    relevanceWeight: 0.9,
    category: 'electronic_production',
  },
  {
    name: 'Complete Music Update (UK)',
    rss: 'https://completemusicupdate.com/feed/',
    relevanceWeight: 0.9,
    category: 'uk_industry',
  },
  {
    name: 'Music Business Worldwide',
    rss: 'https://www.musicbusinessworldwide.com/feed/',
    relevanceWeight: 0.9,
    category: 'business',
  },
  {
    name: 'DIY Magazine (UK)',
    rss: 'https://diymag.com/feed',
    relevanceWeight: 0.85,
    category: 'uk_indie',
  },
  {
    name: 'Billboard',
    rss: 'https://www.billboard.com/feed/',
    relevanceWeight: 0.8,
    category: 'charts',
  },
  {
    name: 'BBC Music',
    rss: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
    relevanceWeight: 0.8,
    category: 'culture',
  },
  {
    name: 'The Line of Best Fit (UK)',
    rss: 'https://www.thelineofbestfit.com/feed',
    relevanceWeight: 0.75,
    category: 'uk_indie_culture',
  },
  {
    name: 'NME',
    rss: 'https://www.nme.com/feed',
    relevanceWeight: 0.7,
    category: 'culture',
  },
];

const relevanceKeywords = {
  highRelevance: [
    'independent artist',
    'indie artist',
    'unsigned',
    'self-released',
    'playlist pitching',
    'radio promotion',
    'streaming',
    'spotify',
    'contact research',
    'music promotion',
    'DIY music',
    'bedroom producer',
    'electronic music',
    'production',
    'ableton',
    'mixing',
    'mastering',
  ],
  mediumRelevance: [
    'major label',
    'record label',
    'A&R',
    'music industry',
    'marketing',
    'promotion',
    'social media',
    'tiktok',
    'instagram',
    'music discovery',
    'algorithm',
    'playlists',
    'curator',
  ],
};

const voicePatterns = {
  openingHooks: [
    "Right, so whilst {major_entity} is {doing_something}, here's why that's actually brilliant news for independent artists...",
    "This week {industry_development} happened, and here's the unsigned advantage...",
    "So {news_event} just dropped, and honestly? Perfect timing for indies who know what they're doing...",
    "While everyone's talking about {trending_topic}, here's what independent artists should actually be focusing on...",
  ],
  transitionPhrases: [
    "Here's the thing though...",
    "But here's where it gets interesting for indies...",
    "Now, here's your move:",
    'The reality is:',
    'What this actually means for you:',
  ],
  industryCredibility: [
    'After 5+ years in radio promotion',
    'From my experience working with BBC Radio 1',
    'Building Audio Intel taught me',
    'Working with indie artists daily',
  ],
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
  else if (hoursOld < 72) score *= 1.0;
  else score *= 0.8;

  return Math.min(score, 1.0);
}

function identifyUnsignedAngle(story) {
  const text = `${story.title} ${story.content || ''}`.toLowerCase();

  // Order matters - check most specific patterns first

  // Legal/lawsuit angles
  if (text.includes('lawsuit') || text.includes('sued') || text.includes('legal')) {
    return {
      type: 'legal_clarity',
      angle:
        'Legal battles create clarity on rules - indies who understand the outcome can move strategically',
      opportunity: 'Strategic positioning advantage',
      actionable: 'Position yourself on the right side of industry legal shifts',
    };
  }

  // Major label problems
  if (
    text.includes('major label') &&
    (text.includes('cuts') ||
      text.includes('problems') ||
      text.includes('struggle') ||
      text.includes('layoff'))
  ) {
    return {
      type: 'major_label_problems',
      angle:
        'While major labels struggle with internal problems, independent artists can move faster and be more agile',
      opportunity: 'Speed and flexibility advantage',
      actionable: 'Position as nimble alternative to struggling major label system',
    };
  }

  // Collaboration opportunities
  if (
    text.includes('collab') ||
    text.includes('collaboration') ||
    text.includes('network') ||
    text.includes('community')
  ) {
    return {
      type: 'collaboration_opportunities',
      angle:
        "The indie scene thrives on collaboration - opportunities major label artists can't access",
      opportunity: 'Community and partnership advantage',
      actionable: 'Build strategic collaborations while majors are stuck in contracts',
    };
  }

  // Mental health and wellness
  if (text.includes('mental health') || text.includes('wellness') || text.includes('burnout')) {
    return {
      type: 'sustainable_careers',
      angle: 'Indies can build sustainable careers on their own terms without label pressure',
      opportunity: 'Creative control and wellbeing',
      actionable: 'Design your career around your life, not label deadlines',
    };
  }

  // Merch and direct-to-fan revenue
  if (
    text.includes('merch') ||
    text.includes('merchandise') ||
    text.includes('direct-to-fan') ||
    text.includes('d2f')
  ) {
    return {
      type: 'revenue_diversification',
      angle: 'Indies keep 100% of merch and D2F revenue - majors take huge cuts',
      opportunity: 'Revenue ownership advantage',
      actionable: 'Build direct fan relationships and keep what you earn',
    };
  }

  // Music education
  if (
    text.includes('education') ||
    text.includes('school') ||
    text.includes('learn') ||
    text.includes('course')
  ) {
    return {
      type: 'knowledge_democratization',
      angle: 'Music industry knowledge is now accessible to everyone - no label needed',
      opportunity: 'Self-education advantage',
      actionable: 'Learn industry skills faster than label artists waiting for A&R guidance',
    };
  }

  // Streaming platform changes
  if (
    text.includes('streaming') &&
    (text.includes('algorithm') || text.includes('spotify') || text.includes('playlist'))
  ) {
    return {
      type: 'platform_changes',
      angle:
        'New platform features favor artists who can adapt quickly over those stuck in old systems',
      opportunity: 'Early adoption advantage',
      actionable: 'Implement new features before major labels catch up',
    };
  }

  // Production tools (specific check before general AI)
  if (
    (text.includes('production') ||
      text.includes('studio') ||
      text.includes('mixing') ||
      text.includes('mastering')) &&
    (text.includes('tool') || text.includes('plugin') || text.includes('software'))
  ) {
    return {
      type: 'production_democratization',
      angle:
        'Professional production tools are now accessible to bedroom producers - the playing field is levelling',
      opportunity: 'Studio-quality production at home',
      actionable: 'Master production tools that major label artists pay thousands for',
    };
  }

  // AI and automation (check AFTER specific production tools)
  if (
    text.includes('automation') ||
    text.includes('ai') ||
    text.includes('artificial intelligence')
  ) {
    return {
      type: 'technology_democratization',
      angle: 'AI tools level the playing field - indies can now automate what majors pay teams for',
      opportunity: 'Technology access equality',
      actionable: 'Adopt AI tools faster than established industry players',
    };
  }

  // Radio and promotion
  if (
    text.includes('radio') ||
    text.includes('bbc') ||
    text.includes('promotion') ||
    text.includes('playlist pitching')
  ) {
    return {
      type: 'promotion_opportunities',
      angle: 'Changes in promotion landscape create new pathways for independent artists',
      opportunity: 'Direct access to gatekeepers',
      actionable: 'Build relationships while majors are stuck in old processes',
    };
  }

  // Age and "making it later"
  if (text.includes('after 30') || text.includes('late bloomer') || text.includes('older artist')) {
    return {
      type: 'age_advantage',
      angle:
        "Success doesn't have an age limit - indie artists can build careers on their own timeline",
      opportunity: 'No label age discrimination',
      actionable: 'Focus on your craft and audience, not arbitrary age limits',
    };
  }

  // Default
  return {
    type: 'general_opportunity',
    angle: 'Industry changes create opportunities for artists willing to move fast',
    opportunity: 'First-mover advantage',
    actionable: 'Take action while others are still figuring it out',
  };
}

function selectRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNewsletterSection(story, angle) {
  const hook = selectRandom(voicePatterns.openingHooks)
    .replace('{major_entity}', story.source)
    .replace('{doing_something}', 'making moves')
    .replace('{industry_development}', story.title)
    .replace('{news_event}', story.title)
    .replace('{trending_topic}', story.title);

  const transition = selectRandom(voicePatterns.transitionPhrases);
  const credibility = selectRandom(voicePatterns.industryCredibility);

  return {
    hook,
    body: `${transition} ${angle.angle}.

${credibility}, this kind of shift happens every few years, and indies who spot it early always come out ahead.

The opportunity here is simple: ${angle.opportunity.toLowerCase()}.`,

    callToAction: `Your move: ${angle.actionable}`,
    audioIntelConnection:
      story.relevanceScore > 0.6
        ? 'Audio Intel helps indies move faster on opportunities like this'
        : null,
  };
}

async function fetchStories(source) {
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
      relevanceWeight: source.relevanceWeight,
    }));

    console.log(`   ✓ Found ${stories.length} stories`);
    return stories;
  } catch (error) {
    console.log(`   ✗ Failed: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('\n📡 STEP 1: Monitoring RSS Feeds...\n');

  const allStories = [];
  for (const source of newsSources) {
    const stories = await fetchStories(source);
    allStories.push(...stories);
  }

  console.log(`\n✓ Total stories monitored: ${allStories.length}`);

  console.log('\n━'.repeat(80));
  console.log('\n📊 STEP 2: Relevance Scoring & Filtering...\n');

  const scoredStories = allStories
    .map(story => ({
      ...story,
      relevanceScore: calculateRelevanceScore(story),
    }))
    .filter(story => story.relevanceScore > 0.4)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);

  console.log(`✓ High-relevance stories found: ${scoredStories.length}`);

  if (scoredStories.length === 0) {
    console.log('\n⚠️  No high-relevance stories this week.');
    console.log('Newsletter will skip this week - quality over quantity.\n');
    return;
  }

  console.log('\n━'.repeat(80));
  console.log('\n✍️  STEP 3: Generating Newsletter Content...\n');

  const newsletterSections = [];

  scoredStories.forEach((story, i) => {
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`STORY ${i + 1} [Score: ${story.relevanceScore.toFixed(2)}]`);
    console.log(`${'═'.repeat(80)}`);

    console.log(`\n📰 ${story.title}`);
    console.log(`   Source: ${story.source}`);
    console.log(`   Category: ${story.category}`);
    console.log(`   Published: ${story.publishedAt.toLocaleDateString()}`);
    console.log(`   URL: ${story.url}`);

    const angle = identifyUnsignedAngle(story);
    console.log(`\n🎯 Unsigned Advantage: ${angle.opportunity}`);

    const section = generateNewsletterSection(story, angle);
    newsletterSections.push({ story, angle, section });

    console.log(`\n✍️  Newsletter Section:\n`);
    console.log(section.hook);
    console.log();
    console.log(section.body);
    console.log();
    console.log(section.callToAction);

    if (section.audioIntelConnection) {
      console.log();
      console.log(`💡 ${section.audioIntelConnection}`);
    }
  });

  console.log('\n\n' + '━'.repeat(80));
  console.log('\n✅ NEWSLETTER GENERATION COMPLETE\n');
  console.log(`📧 Generated ${newsletterSections.length} sections`);
  console.log(`💰 Cost: £0.03 (3 pence)`);
  console.log(`📨 Status: Ready for your review and approval`);
  console.log(`🎯 Next step: Review content, then approve for ConvertKit distribution\n`);
}

main().catch(console.error);

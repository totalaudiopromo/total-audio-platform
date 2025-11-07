#!/usr/bin/env node

/**
 * AUTOMATED NEWSLETTER GENERATION & CONVERTKIT DISTRIBUTION
 *
 * This script:
 * 1. Fetches latest music industry news from RSS feeds
 * 2. Generates 3 newsletter sections using Claude API
 * 3. Adds Tool Philosophy footer
 * 4. Creates draft broadcast in ConvertKit for your approval
 *
 * Run weekly (automated via cron) or manually: node generate-and-send-newsletter.js
 */

require('dotenv').config({ path: '../../apps/audio-intel/.env.local' });
const RSSParser = require('rss-parser');
const axios = require('axios');
const rssParser = new RSSParser();

// API Configuration
const ANTHROPIC_API_KEY =
  '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';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;

console.log('\n🎵 "THE UNSIGNED ADVANTAGE" - AUTOMATED NEWSLETTER GENERATION\n');
console.log('━'.repeat(80));

// RSS Feed Configuration (from NEWSLETTER_SYSTEM_COMPLETE.md)
const RSS_FEEDS = [
  { name: "Ari's Take", url: 'https://aristake.com/feed/', priority: 0.95 },
  { name: 'Attack Magazine', url: 'https://www.attackmagazine.com/feed/', priority: 0.9 },
  { name: 'Complete Music Update', url: 'https://completemusicupdate.com/feed/', priority: 0.9 },
  {
    name: 'Music Business Worldwide',
    url: 'https://www.musicbusinessworldwide.com/feed/',
    priority: 0.9,
  },
  { name: 'DIY Magazine', url: 'https://diymag.com/feed', priority: 0.85 },
  { name: 'BBC Music', url: 'https://www.bbc.co.uk/music/rss', priority: 0.8 },
  { name: 'Billboard', url: 'https://www.billboard.com/feed/', priority: 0.8 },
  { name: 'The Line of Best Fit', url: 'https://www.thelineofbestfit.com/feed', priority: 0.75 },
  { name: 'NME', url: 'https://www.nme.com/feed', priority: 0.7 },
];

const CHRIS_VOICE_PROFILE = `You are writing "The Unsigned Advantage" newsletter as Chris Schofield.

VERIFIED FACTS ONLY:
- 5+ years radio promotion experience
- Electronic music producer as sadact (Brighton-based, originally from North-West England)
- sadact genre: House, Breaks, Future Garage (influenced by 90s UK scene)
- Released "Stabiliser" EP (April 2024), "Total Audio Transfer" (October 2023)
- Built Audio Intel (contact enrichment tool) because he was tired of manual contact research at midnight
- UK-based, works with independent artists daily

DO NOT MENTION:
- BBC Radio 1 (removed claim)
- Royal Blood, Architects, Fred Again (no name dropping)
- Specific tools/plugins not in the story
- Invented personal examples

ALLOWED:
- "After 5+ years in radio promotion"
- "Building Audio Intel taught me"
- "As sadact, I've released..." or "When releasing Stabiliser EP..."
- "Working with House/Breaks/Future Garage producers"
- "The Brighton electronic scene"

VOICE: British casual-professional. British spelling.

CONVERSATIONAL PHRASES (use sparingly):
- "Right, so" - ONLY at the very start of the section (first sentence only)
- "Here's the thing" - Use for transitions between points
- "Your move" - ONLY for the action step
- DO NOT repeat "Right, so" in every paragraph

ENHANCED FRAMEWORK (150-200 words):
1. HOOK (1-2 sentences): What happened in the industry - Start with "Right, so" if it fits naturally
2. EXPERTISE CONNECTION (2-3 sentences): How this connects to radio promotion reality OR Audio Intel data OR underground scene perspective - NOT generic "indies move faster" takes - Use "Here's the thing" or "After X years" to introduce
3. THE UNSIGNED ADVANTAGE (2-3 sentences): Specific advantage based on Chris's experience with real campaign examples (anonymised if needed)
4. ACTION STEP (2-3 sentences): Specific 30min-2hr task based on actual campaign tactics, include budget/timing if relevant - Start with "Your move"
5. AUDIO INTEL MENTION (optional): Only if genuinely relevant to contact research/data

DEPTH REQUIREMENT: The newsletter must answer "What does Chris know that others don't?" based on his actual expertise in radio promotion, contact data, or underground electronic scene.

QUALITY CHECK:
- Could only Chris write this? ✅
- Could any music blogger write this? ❌
- Includes tactical insight from real experience? ✅
- Not generic without specific backing? ✅

REFERENCE EXAMPLES:

Example A - Radio Promotion Angle:
"After 5+ years pitching to radio programmers, I've learned they check streaming numbers before playlisting - not because they care about Spotify, but because it's social proof of engaged audience. This affects how you respond to [NEWS EVENT]..."

Example B - Audio Intel Data Angle:
"Audio Intel data shows 31% of UK indie radio contacts changed in the last 6 months. This matters for [NEWS EVENT] because..."

Example C - Scene Perspective Angle:
"As an underground electronic producer, I've seen how club promoters respond differently to DM outreach versus email pitches. For [NEWS EVENT], this means..."

TOOL PHILOSOPHY (Core Belief):
Chris builds tools that automate tedious marketing admin (spreadsheets, contact research, data entry) - NOT tools that replace creativity. Audio Intel exists because Chris spent hours doing manual contact research at midnight instead of making music. AI music generation replaces the creative process (bad). Audio Intel replaces spreadsheet hell (good). Know the difference.`;

// Fetch RSS feeds
async function fetchRSSFeeds() {
  console.log('\n📰 Fetching RSS feeds...\n');
  const allStories = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`  Fetching ${feed.name}...`);
      const feedData = await rssParser.parseURL(feed.url);

      feedData.items.slice(0, 5).forEach(item => {
        allStories.push({
          title: item.title,
          content: item.contentSnippet || item.summary || '',
          url: item.link,
          source: feed.name,
          priority: feed.priority,
          pubDate: item.pubDate,
        });
      });
    } catch (error) {
      console.log(`  ⚠️  Failed to fetch ${feed.name}: ${error.message}`);
    }
  }

  console.log(`\n✓ Fetched ${allStories.length} stories from ${RSS_FEEDS.length} feeds\n`);
  return allStories;
}

// Score story relevance to indie artists
function scoreStoryRelevance(story) {
  let score = story.priority || 0.5;

  const title = (story.title || '').toLowerCase();
  const content = (story.content || '').toLowerCase();
  const text = title + ' ' + content;

  // Boost for indie-relevant terms
  if (/(independent|indie|unsigned|diy|underground)/i.test(text)) score += 0.15;
  if (/(radio|promotion|playlist|spotify|streaming)/i.test(text)) score += 0.1;
  if (/(ai music|artificial intelligence.*music)/i.test(text)) score += 0.1;
  if (/(electronic|producer|production)/i.test(text)) score += 0.05;

  // Penalize major label focus
  if (/(major label|sony|universal|warner)/i.test(text)) score -= 0.1;

  return Math.min(1.0, Math.max(0, score));
}

// Generate newsletter content for one story
async function generateContent(story) {
  try {
    console.log(`  Generating: ${story.title.slice(0, 60)}...`);

    const prompt = `Write ONE newsletter section:

**Title**: ${story.title}
**Summary**: ${story.content.slice(0, 400)}

Connect this news story to Chris's actual expertise:
- If it relates to pitching/promotion: share specific radio campaign insight
- If it relates to data/contacts: mention relevant Audio Intel patterns
- If it relates to production/scene: use underground electronic perspective

The newsletter should answer: "What does Chris know that others don't?"

Framework: Hook → Expertise Connection → Unsigned Advantage → Action Step

NO BBC, NO name dropping, NO invented examples.
Avoid generic takes like "indies are nimble" unless backed by specific examples.
Include real tactics with budgets, timings, or processes where relevant.

150-200 words, British spelling:`;

    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 800,
        system: CHRIS_VOICE_PROFILE,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const content = response.data.content[0].text;
    const cost =
      (response.data.usage.input_tokens * 0.003 + response.data.usage.output_tokens * 0.015) /
      1000000;

    return { story, content, cost };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return null;
  }
}

// Add tool philosophy footer
function addToolPhilosophyFooter() {
  return `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TOOL PHILOSOPHY

AI music generation replaces your creativity (the fun part).

Audio Intel replaces tedious spreadsheet admin (the boring part).

I built Audio Intel because I was spending hours researching contact emails at midnight instead of making music as sadact. My tools automate the marketing grind so you can focus on what actually matters - creating.

Know the difference.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Got questions? Reply to this email - I answer every one.

Chris
https://intel.totalaudiopromo.com`;
}

// Convert to HTML for ConvertKit
function convertToHTML(sections) {
  let html =
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">';

  sections.forEach((section, index) => {
    // Add section content
    const paragraphs = section.content.split('\n\n').filter(p => p.trim());
    paragraphs.forEach(para => {
      html += `<p style="line-height: 1.6; margin: 16px 0;">${para.trim()}</p>`;
    });

    // Add separator between sections
    if (index < sections.length - 1) {
      html += '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0;">';
    }
  });

  // Add footer
  const footer = addToolPhilosophyFooter();
  const footerParas = footer.split('\n\n').filter(p => p.trim() && !p.includes('━'));
  footerParas.forEach(para => {
    if (para.includes('💡 TOOL PHILOSOPHY')) {
      html += `<div style="background: #f5f5f5; padding: 24px; margin: 32px 0; border-left: 4px solid #000;">`;
      html += `<h3 style="margin: 0 0 16px 0; font-size: 16px;">${para}</h3>`;
    } else if (para.includes('Chris')) {
      html += `<p style="line-height: 1.6; margin: 16px 0;">${para}</p></div>`;
    } else {
      html += `<p style="line-height: 1.6; margin: 16px 0;">${para}</p>`;
    }
  });

  html += '</div>';
  return html;
}

// Send to ConvertKit
async function sendToConvertKit(subject, htmlContent) {
  try {
    console.log('\n📨 Creating ConvertKit draft broadcast...\n');

    const response = await axios.post('https://api.convertkit.com/v3/broadcasts', {
      api_key: CONVERTKIT_API_KEY,
      subject: subject,
      content: htmlContent,
      public: false, // Draft for review
      published_at: null,
    });

    if (response.status === 201) {
      console.log('✅ Newsletter draft created in ConvertKit!\n');
      console.log(`  Broadcast ID: ${response.data.broadcast.id}`);
      console.log(`  Subject: ${response.data.broadcast.subject}`);
      console.log(`  Status: Draft (awaiting your approval)\n`);
      console.log('🎯 Next steps:');
      console.log('  1. Log into https://app.convertkit.com/broadcasts');
      console.log('  2. Review the draft broadcast');
      console.log('  3. Schedule or send immediately\n');
      return {
        success: true,
        broadcastId: response.data.broadcast.id,
        subject: response.data.broadcast.subject,
      };
    }
  } catch (error) {
    console.error(
      '\n❌ Failed to create ConvertKit broadcast:',
      error.response?.data || error.message
    );
    return { success: false, error: error.message };
  }
}

// Send email notification using macOS notification center + optional email
async function sendEmailNotification(broadcastId, subject) {
  try {
    console.log('\n📧 Sending notification...\n');

    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    // Send macOS desktop notification
    const notificationTitle = 'Newsletter Draft Ready! 📧';
    const notificationMessage = `"${subject}" is ready for review in ConvertKit`;
    const notificationCommand = `osascript -e 'display notification "${notificationMessage}" with title "${notificationTitle}" sound name "Glass"'`;

    try {
      await execPromise(notificationCommand);
      console.log('✅ Desktop notification sent\n');
    } catch (error) {
      console.log('⚠️  Desktop notification failed:', error.message);
    }

    // Also send email via macOS mail (may require Mail.app to be configured)
    const emailSubject = `Newsletter Draft Ready: ${subject}`;
    const emailBody = `Hi Chris,

Your newsletter draft is ready for review! 📧

Newsletter: "${subject}"
Draft ID: ${broadcastId}

✅ What's included:
- 3 news stories with your expertise connection
- sadact authenticity details
- Tool Philosophy footer
- Specific tactical actions

🎯 Review and approve:
https://app.convertkit.com/broadcasts

This should take about 15 minutes. Once reviewed, schedule for Tuesday 9 AM.

Cheers,
The Unsigned Advantage Bot 🤖`;

    try {
      const mailCommand = `echo "${emailBody
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')}" | mail -s "${emailSubject}" promo@totalaudiopromo.com`;
      await execPromise(mailCommand);
      console.log('✅ Email sent to promo@totalaudiopromo.com\n');
    } catch (error) {
      console.log('⚠️  Email send failed (non-critical):', error.message);
      console.log('   Desktop notification was sent instead\n');
    }

    return { success: true };
  } catch (error) {
    console.log('⚠️  Notification failed (non-critical):', error.message);
    console.log('   Draft still created in ConvertKit - check dashboard manually\n');
    return { success: false };
  }
}

// Main execution
async function main() {
  console.log('Step 1: Fetch RSS feeds');
  console.log('Step 2: Select top 3 relevant stories');
  console.log('Step 3: Generate newsletter content');
  console.log('Step 4: Create ConvertKit draft\n');
  console.log('━'.repeat(80));

  // Check ConvertKit credentials
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_API_SECRET) {
    console.log('\n❌ ConvertKit API credentials not configured');
    console.log('Add to apps/audio-intel/.env.local:');
    console.log('  CONVERTKIT_API_KEY=your_key');
    console.log('  CONVERTKIT_API_SECRET=your_secret\n');
    return;
  }

  // Fetch RSS feeds
  const allStories = await fetchRSSFeeds();

  if (allStories.length === 0) {
    console.log('❌ No stories fetched. Check RSS feed URLs.\n');
    return;
  }

  // Score and sort stories
  console.log('📊 Scoring story relevance...\n');
  const scoredStories = allStories
    .map(story => ({
      ...story,
      relevanceScore: scoreStoryRelevance(story),
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Select top 3 stories
  const topStories = scoredStories.slice(0, 3).filter(s => s.relevanceScore > 0.4);

  if (topStories.length === 0) {
    console.log('❌ No relevant stories found (all scored below 0.4 threshold).\n');
    return;
  }

  console.log(`✓ Selected ${topStories.length} stories:\n`);
  topStories.forEach((story, i) => {
    console.log(`  ${i + 1}. ${story.title.slice(0, 60)}... (${story.relevanceScore.toFixed(2)})`);
    console.log(`     Source: ${story.source}\n`);
  });

  // Generate content for each story
  console.log('━'.repeat(80));
  console.log('\n🤖 Generating newsletter content with Claude API...\n');

  const sections = [];
  let totalCost = 0;

  for (const story of topStories) {
    const result = await generateContent(story);
    if (result) {
      sections.push(result);
      totalCost += result.cost;
      console.log(`  ✓ Generated (cost: £${result.cost.toFixed(4)})\n`);
    }
  }

  if (sections.length === 0) {
    console.log('❌ Failed to generate any content.\n');
    return;
  }

  console.log('━'.repeat(80));
  console.log(`\n✅ Generated ${sections.length} newsletter sections`);
  console.log(`💰 Total cost: £${totalCost.toFixed(4)}\n`);

  // Preview content
  console.log('━'.repeat(80));
  console.log('\n📧 NEWSLETTER PREVIEW:\n');
  sections.forEach((section, i) => {
    console.log(`SECTION ${i + 1}: ${section.story.title}\n`);
    console.log(section.content);
    console.log('\n' + '─'.repeat(80) + '\n');
  });
  console.log(addToolPhilosophyFooter());
  console.log('\n' + '━'.repeat(80));

  // Convert to HTML and send to ConvertKit
  const htmlContent = convertToHTML(sections);
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const subject = `The Unsigned Advantage - ${date}`;

  const result = await sendToConvertKit(subject, htmlContent);

  if (result.success) {
    // Send email notification
    await sendEmailNotification(result.broadcastId, result.subject);

    console.log('\n━'.repeat(80));
    console.log('\n🎉 SUCCESS! Newsletter draft ready for your review.');
    console.log('📧 Email notification sent to promo@totalaudiopromo.com\n');
  } else {
    console.log('\n━'.repeat(80));
    console.log('\n❌ Failed to create ConvertKit draft. Check error above.\n');
  }
}

main().catch(console.error);

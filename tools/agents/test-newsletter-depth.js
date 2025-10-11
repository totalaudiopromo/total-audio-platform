#!/usr/bin/env node

/**
 * Newsletter Depth Quality Test
 * Tests if generated content meets depth requirements
 */

const RSSParser = require('rss-parser');
const axios = require('axios');
const rssParser = new RSSParser();

const ANTHROPIC_API_KEY = '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';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';

console.log('\n🧪 Newsletter Depth Quality Test\n');
console.log('━'.repeat(80));

const CHRIS_VOICE_PROFILE = `You are writing "The Unsigned Advantage" newsletter as Chris Schofield.

VERIFIED FACTS ONLY:
- 5+ years radio promotion experience
- Electronic music producer (sadact - underground electronic, NOT commercial)
- Built Audio Intel (contact enrichment tool)
- UK-based, works with independent artists

DO NOT MENTION:
- BBC Radio 1 (removed claim)
- Royal Blood, Architects, Fred Again (no name dropping)
- Specific tools/plugins not in the story
- Invented personal examples

ALLOWED:
- "After 5+ years in radio promotion"
- "Building Audio Intel taught me"
- "As an underground electronic producer"

VOICE: British casual-professional. Phrases: "Right, so", "Here's the thing", "Your move". British spelling.

ENHANCED FRAMEWORK (150-200 words):
1. HOOK (1-2 sentences): What happened in the industry
2. EXPERTISE CONNECTION (2-3 sentences): How this connects to radio promotion reality OR Audio Intel data OR underground scene perspective - NOT generic "indies move faster" takes
3. THE UNSIGNED ADVANTAGE (2-3 sentences): Specific advantage based on Chris's experience with real campaign examples (anonymised if needed)
4. ACTION STEP (2-3 sentences): Specific 30min-2hr task based on actual campaign tactics, include budget/timing if relevant
5. AUDIO INTEL MENTION (optional): Only if genuinely relevant to contact research/data

DEPTH REQUIREMENT: The newsletter must answer "What does Chris know about this that others don't?" based on his actual expertise in radio promotion, contact data, or underground electronic scene.

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
"As an underground electronic producer, I've seen how club promoters respond differently to DM outreach versus email pitches. For [NEWS EVENT], this means..."`;

async function generateContent(story) {
  try {
    const prompt = `Write ONE newsletter section:

**Title**: ${story.title}
**Summary**: ${story.content.slice(0, 400)}

Connect this news story to Chris's actual expertise:
- If it relates to pitching/promotion: share specific radio campaign insight
- If it relates to data/contacts: mention relevant Audio Intel patterns
- If it relates to production/scene: use underground electronic perspective

The newsletter should answer: "What does Chris know about this that others don't?"

Framework: Hook → Expertise Connection → Unsigned Advantage → Action Step

NO BBC, NO name dropping, NO invented examples.
Avoid generic takes like "indies are nimble" unless backed by specific examples.
Include real tactics with budgets, timings, or processes where relevant.

150-200 words, British spelling:`;

    const response = await axios.post(ANTHROPIC_API_URL, {
      model: ANTHROPIC_MODEL,
      max_tokens: 800,
      system: CHRIS_VOICE_PROFILE,
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      timeout: 30000
    });

    const content = response.data.content[0].text;
    const cost = ((response.data.usage.input_tokens * 0.003 + response.data.usage.output_tokens * 0.015) / 1000000).toFixed(4);

    return { story, content, cost };
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    return null;
  }
}

function analyzeDepth(content) {
  console.log('\n📊 DEPTH ANALYSIS:\n');
  console.log('━'.repeat(80));

  const checks = {
    experiencePhrase: /(?:After|Building|As an)/i.test(content),
    specificNumbers: /\d+\s*(?:years|hours|minutes|£|%|months|weeks)/i.test(content),
    tacticalDetail: /(?:budget|timing|process|campaign|pitch|contact)/i.test(content),
    avoidedGeneric: !/indies are (?:nimble|fast|quick)/i.test(content),
    britishSpelling: /(?:organised|realised|whilst)/i.test(content),
    hasAction: /(?:Your move|Take|Start|Create|Audit|Register)/i.test(content),
  };

  const results = [
    { check: 'Experience phrase used', pass: checks.experiencePhrase, emoji: checks.experiencePhrase ? '✅' : '❌' },
    { check: 'Specific numbers included', pass: checks.specificNumbers, emoji: checks.specificNumbers ? '✅' : '❌' },
    { check: 'Tactical detail present', pass: checks.tacticalDetail, emoji: checks.tacticalDetail ? '✅' : '❌' },
    { check: 'Avoided generic takes', pass: checks.avoidedGeneric, emoji: checks.avoidedGeneric ? '✅' : '❌' },
    { check: 'British spelling used', pass: checks.britishSpelling, emoji: checks.britishSpelling ? '✅' : '⚠️' },
    { check: 'Action step included', pass: checks.hasAction, emoji: checks.hasAction ? '✅' : '❌' },
  ];

  results.forEach(r => {
    console.log(`${r.emoji} ${r.check}`);
  });

  const passedChecks = results.filter(r => r.pass).length;
  const totalChecks = results.length;
  const score = ((passedChecks / totalChecks) * 100).toFixed(0);

  console.log('━'.repeat(80));
  console.log(`\n🎯 DEPTH SCORE: ${score}% (${passedChecks}/${totalChecks} checks passed)`);

  if (score >= 80) {
    console.log('✅ SUFFICIENT DEPTH - Could only Chris write this\n');
  } else if (score >= 60) {
    console.log('⚠️  MARGINAL DEPTH - Needs more specific detail\n');
  } else {
    console.log('❌ INSUFFICIENT DEPTH - Too generic, any blogger could write this\n');
  }

  return { score: parseInt(score), passedChecks, totalChecks };
}

async function main() {
  const testStories = [
    {
      title: 'Spotify Reduces Artist Royalties Again',
      content: 'Spotify announces another round of royalty cuts for independent artists. New payment structure affects tracks under 1000 streams per year.',
      category: 'streaming'
    },
    {
      title: 'New AI Mastering Tool Promises Studio Quality',
      content: 'Tech startup releases AI-powered mastering service claiming professional studio results. Targets independent producers with budget constraints.',
      category: 'production'
    },
    {
      title: 'Major Festival Increases Indie Stage Slots',
      content: 'UK festival announces expanded independent artist lineup for 2026. More opportunities for unsigned acts to showcase.',
      category: 'promotion'
    }
  ];

  const results = [];

  for (const story of testStories) {
    console.log(`\n📰 Testing: ${story.title} [${story.category}]\n`);
    console.log('━'.repeat(80));

    const section = await generateContent(story);

    if (section) {
      console.log('\n📧 GENERATED:\n');
      console.log(section.content);
      console.log('\n' + '━'.repeat(80));

      const analysis = analyzeDepth(section.content);
      results.push({ ...story, ...analysis, cost: section.cost });
    }

    console.log('\n' + '═'.repeat(80) + '\n');
  }

  // Summary
  console.log('\n📈 OVERALL SUMMARY:\n');
  console.log('━'.repeat(80));

  const avgScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(0);
  const totalCost = results.reduce((sum, r) => sum + parseFloat(r.cost), 0).toFixed(4);

  results.forEach(r => {
    const emoji = r.score >= 80 ? '✅' : r.score >= 60 ? '⚠️' : '❌';
    console.log(`${emoji} ${r.title.slice(0, 50).padEnd(50)} | ${r.score}%`);
  });

  console.log('━'.repeat(80));
  console.log(`\n🎯 Average Depth Score: ${avgScore}%`);
  console.log(`💰 Total Cost: £${totalCost}`);
  console.log('\n');
}

main().catch(console.error);

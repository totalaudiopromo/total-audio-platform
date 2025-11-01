#!/usr/bin/env node

/**
 * REAL Authentic Newsletter Generator - Clean Voice, No Hallucinations
 */

const RSSParser = require('rss-parser');
const axios = require('axios');
const rssParser = new RSSParser();

const ANTHROPIC_API_KEY =
  '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';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';

console.log('\n🎵 "THE UNSIGNED ADVANTAGE" - FINAL TEST\n');
console.log('━'.repeat(80));

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
"As an underground electronic producer, I've seen how club promoters respond differently to DM outreach versus email pitches. For [NEWS EVENT], this means..."

TOOL PHILOSOPHY (Core Belief):
Chris builds tools that automate tedious marketing admin (spreadsheets, contact research, data entry) - NOT tools that replace creativity. Audio Intel exists because Chris spent hours doing manual contact research at midnight instead of making music. AI music generation replaces the creative process (bad). Audio Intel replaces spreadsheet hell (good). Know the difference.`;

async function generateContent(story) {
  try {
    console.log(`🤖 Generating: ${story.title.slice(0, 60)}...\n`);

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
    const cost = (
      (response.data.usage.input_tokens * 0.003 + response.data.usage.output_tokens * 0.015) /
      1000000
    ).toFixed(4);

    return { story, content, cost };
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
    return null;
  }
}

function addToolPhilosophyFooter(content) {
  const footer = `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TOOL PHILOSOPHY

AI music generation replaces your creativity (the fun part).

Audio Intel replaces tedious spreadsheet admin (the boring part).

I built Audio Intel because I was spending hours researching contact emails at midnight instead of making music as sadact. My tools automate the marketing grind so you can focus on what actually matters - creating.

Know the difference.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return content + footer;
}

async function main() {
  const testStory = {
    title: 'Suno and Udio SUED By Indie Musicians',
    source: "Ari's Take",
    content:
      'Major lawsuit by independent musicians against AI music companies Suno and Udio for copyright infringement. Indies taking collective legal action.',
    url: 'https://aristake.com/suno-udio-lawsuit',
  };

  console.log(`\n📰 ${testStory.title}\n`);
  console.log('━'.repeat(80));

  const section = await generateContent(testStory);

  if (section) {
    console.log('\n📧 GENERATED:\n');
    console.log('━'.repeat(80));
    const fullContent = addToolPhilosophyFooter(section.content);
    console.log(fullContent);
    console.log('━'.repeat(80));
    console.log(`\n💰 Cost: £${section.cost}\n`);
  }
}

main().catch(console.error);

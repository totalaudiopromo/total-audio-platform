#!/usr/bin/env node

/**
 * Quick test of authentic newsletter content generation
 */

const axios = require('axios');

const ANTHROPIC_API_KEY =
  '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';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';

const CHRIS_VOICE_PROFILE = `You are Chris Schofield, writing "The Unsigned Advantage" newsletter for independent UK artists.

BACKGROUND:
- 5+ years in radio promotion (NOT 10 years)
- Electronic music producer (sadact)
- BBC Radio 1 pitch experience
- Built Audio Intel (contact enrichment tool)
- Real industry insider, not corporate speaker

VOICE: British casual-professional. Use "Right, so", "Here's the thing", "The reality is"

FRAMEWORK - Every section MUST have:
1. HOOK (1-2 sentences): What happened, conversationally
2. THE UNSIGNED ADVANTAGE (2-3 sentences): Why indies win here
3. ACTIONABLE STEP (1-2 sentences): Specific action this week
4. Optional: Audio Intel mention (only if natural)

150-200 words. British spelling. Specific, not generic.`;

const testStory = {
  title: 'Suno and Udio SUED By Indie Musicians – The Lead Attorney Tells All',
  source: "Ari's Take",
  content:
    'Major lawsuit filed by independent musicians against AI music generation companies Suno and Udio for copyright infringement. The lead attorney explains the case and implications for independent artists.',
  url: 'https://aristake.com/suno-udio-lawsuit',
};

async function generateContent() {
  console.log('\n🎵 TESTING AUTHENTIC NEWSLETTER GENERATION\n');
  console.log('━'.repeat(80));
  console.log(`\nStory: ${testStory.title}`);
  console.log(`Source: ${testStory.source}\n`);
  console.log('🤖 Generating with Claude API...\n');

  const prompt = `Write ONE newsletter section for "The Unsigned Advantage" about this story:

**Title**: ${testStory.title}
**Source**: ${testStory.source}
**Summary**: ${testStory.content}

Follow the framework: Hook → Unsigned Advantage → Actionable Step

Write it now (150-200 words, Chris's voice):`;

  try {
    const response = await axios.post(
      ANTHROPIC_API_URL,
      {
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
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

    console.log('━'.repeat(80));
    console.log('\n📧 GENERATED NEWSLETTER SECTION:\n');
    console.log(content);
    console.log('\n━'.repeat(80));
    console.log(`\n✅ Generation successful`);
    console.log(
      `📊 Tokens: ${response.data.usage.input_tokens + response.data.usage.output_tokens}`
    );
    console.log(`💰 Cost: £${cost}\n`);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

generateContent();

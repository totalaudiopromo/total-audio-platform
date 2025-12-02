#!/usr/bin/env node

/**
 * Test Audio Intel content posting to BlueSky
 */

require('dotenv').config();

// Audio Intel content templates (from your existing templates)
const AUDIO_INTEL_TEMPLATES = [
  {
    id: 'bbc_radio1_case',
    name: 'BBC Radio 1 Case Study',
    content: `Just enriched BBC Radio 1 contacts in 15 minutes. What used to take me a full weekend of research.

The time savings are incredible for radio promotion campaigns. From chaotic spreadsheets to organised contact intelligence.

This is why I built Audio Intel.`,
    hashtags: ['#MusicIndustry', '#RadioPromotion', '#ContactEnrichment', '#BBC', '#IndieMusic'],
  },
  {
    id: 'spotify_success',
    name: 'Spotify Playlist Success',
    content: `Real case study: Spotify playlist curator contacts enriched with 100% success rate.

Built Audio Intel because I was tired of spending 15+ hours per campaign researching radio contacts. Now it's automated.

From manual Excel chaos to professional contact intelligence in minutes.`,
    hashtags: [
      '#MusicTech',
      '#PlaylistPitching',
      '#Spotify',
      '#ContactResearch',
      '#MusicPromotion',
    ],
  },
  {
    id: 'time_savings',
    name: 'Time Savings Value Prop',
    content: `The hidden cost of manual contact research in music promotion: 15+ hours per campaign.

That's £300+ in time value for indie artists. Audio Intel turns this into a 15-minute process.

Time saved = more music created.`,
    hashtags: [
      '#IndieMusic',
      '#MusicBusiness',
      '#ContactEnrichment',
      '#RadioPromotion',
      '#MusicIndustry',
    ],
  },
];

async function authenticateBlueSky() {
  const identifier = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_APP_PASSWORD;

  const response = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) throw new Error('Authentication failed');
  return await response.json();
}

async function postToBlueSky(session, template) {
  const fullText = `${template.content}\n\n${template.hashtags.join(' ')}`;

  console.log(`📝 Posting: "${template.name}"`);
  console.log('---');
  console.log(fullText);
  console.log('---');

  const postData = {
    repo: session.did,
    collection: 'app.bsky.feed.post',
    record: {
      text: fullText,
      createdAt: new Date().toISOString(),
      $type: 'app.bsky.feed.post',
    },
  };

  const response = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Post failed: ${error}`);
  }

  const result = await response.json();
  const postId = result.uri.split('/').pop();
  const postUrl = `https://bsky.app/profile/${session.handle}/post/${postId}`;

  console.log('✅ Posted successfully!');
  console.log(`🔗 ${postUrl}`);

  return { result, postUrl };
}

async function main() {
  const command = process.argv[2];

  try {
    console.log('🔵 Authenticating with BlueSky...');
    const session = await authenticateBlueSky();
    console.log('✅ Authenticated successfully!');

    if (command === 'list') {
      console.log('\n📋 Available Audio Intel Templates:');
      AUDIO_INTEL_TEMPLATES.forEach((template, index) => {
        console.log(`${index + 1}. ${template.name}`);
        console.log(`   Content preview: ${template.content.substring(0, 100)}...`);
        console.log(`   Hashtags: ${template.hashtags.join(' ')}`);
        console.log('');
      });
      return;
    }

    if (command === 'post') {
      const templateIndex = parseInt(process.argv[3]) - 1;
      const template = AUDIO_INTEL_TEMPLATES[templateIndex];

      if (!template) {
        console.log('❌ Invalid template number. Use "list" to see available templates.');
        return;
      }

      await postToBlueSky(session, template);
      return;
    }

    console.log(`
Audio Intel BlueSky Poster

Commands:
  list         Show available templates
  post [1-3]   Post specific template by number

Examples:
  node scripts/test-audio-intel-post.js list
  node scripts/test-audio-intel-post.js post 1    # BBC Radio 1 case study
  node scripts/test-audio-intel-post.js post 2    # Spotify success story
  node scripts/test-audio-intel-post.js post 3    # Time savings value prop
    `);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();

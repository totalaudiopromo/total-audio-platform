#!/usr/bin/env node

/**
 * LinkedIn Manual Setup for Audio Intel
 * Simpler approach - generate content for manual posting
 */

require('dotenv').config();

// Audio Intel content optimized for LinkedIn
const LINKEDIN_POSTS = [
  {
    id: 'bbc_radio1_linkedin',
    name: 'BBC Radio 1 Professional Case Study',
    content: `Professional case study: BBC Radio 1 contact enrichment

Recently completed contact research for BBC Radio 1 in 15 minutes. What previously required a full weekend of manual research.

The transformation from chaotic spreadsheets to organised contact intelligence has been incredible for radio promotion campaigns.

This experience is why I built Audio Intel.

intel.totalaudiopromo.com`,
  },
  {
    id: 'spotify_linkedin_professional',
    name: 'Spotify Success - Professional Context',
    content: `Industry results: Spotify playlist curator contact enrichment with 100% success rate

After years of spending 15+ hours per campaign researching radio contacts manually, I developed Audio Intel to automate this process.

The shift from manual Excel chaos to professional contact intelligence has transformed campaign efficiency.

Built by music industry professionals, for music industry professionals.

intel.totalaudiopromo.com`,
  },
  {
    id: 'time_value_professional',
    name: 'Professional Time Value Analysis',
    content: `Industry analysis: The hidden cost of manual contact research in music promotion

Research shows 15+ hours per campaign spent on contact research. For independent artists, this represents £300+ in time value.

Audio Intel reduces this to a 15-minute process, allowing professionals to focus on relationship building rather than data management.

Time optimisation equals more strategic music promotion.

intel.totalaudiopromo.com`,
  }
];

function showLinkedInContent() {
  console.log('💼 Audio Intel LinkedIn Content Ready\n');
  console.log('='.repeat(50));

  LINKEDIN_POSTS.forEach((post, index) => {
    console.log(`\n📝 POST ${index + 1}: ${post.name}`);
    console.log('-'.repeat(40));
    console.log(post.content);
    console.log('-'.repeat(40));
    console.log('✂️  Copy the content above and paste into LinkedIn\n');
  });

  console.log('🔄 POSTING SCHEDULE SUGGESTION:');
  console.log('- Post 1: Tomorrow at 9am UK time');
  console.log('- Post 2: Day after at 1pm UK time');
  console.log('- Post 3: Following day at 9am UK time');

  console.log('\n💡 PRO TIP:');
  console.log('These posts will show your intel.totalaudiopromo.com link');
  console.log('with the clean Open Graph preview we just created!');
}

function generateNextPost() {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const postIndex = today % LINKEDIN_POSTS.length;
  const post = LINKEDIN_POSTS[postIndex];

  console.log(`📅 Today's LinkedIn Post: ${post.name}\n`);
  console.log('='.repeat(50));
  console.log(post.content);
  console.log('='.repeat(50));
  console.log('\n✂️  Copy this content and post manually to LinkedIn');
  console.log('🔗 Your link preview will show the clean Audio Intel design');
}

function main() {
  const command = process.argv[2];

  switch (command) {
    case 'all':
      showLinkedInContent();
      break;

    case 'today':
      generateNextPost();
      break;

    case 'copy':
      const postIndex = parseInt(process.argv[3]) - 1;
      if (postIndex >= 0 && postIndex < LINKEDIN_POSTS.length) {
        const post = LINKEDIN_POSTS[postIndex];
        console.log(post.content);
      } else {
        console.log('❌ Invalid post number. Use 1, 2, or 3');
      }
      break;

    default:
      console.log(`
Audio Intel LinkedIn Content Manager

Commands:
  all     Show all 3 LinkedIn posts ready to copy
  today   Show today's recommended post
  copy N  Copy specific post (1, 2, or 3) to terminal

Examples:
  node scripts/linkedin-manual-setup.js all
  node scripts/linkedin-manual-setup.js today
  node scripts/linkedin-manual-setup.js copy 1

Manual Posting Workflow:
1. Run 'node scripts/linkedin-manual-setup.js today'
2. Copy the content shown
3. Go to LinkedIn and create a new post
4. Paste the content
5. The link preview will automatically show your clean Audio Intel design
6. Post it!

Automated Alternative:
- Fix the LinkedIn app redirect URI first
- Then run: node scripts/setup-linkedin-auth.js
      `);
  }
}

main();
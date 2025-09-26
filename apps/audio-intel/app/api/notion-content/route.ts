import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/env';

const NOTION_API_KEY = getEnv('NOTION_API_KEY');

// Your authentic social media content
const AUTHENTIC_CONTENT = [
  {
    id: 'content_1',
    content: `🎵 MUSIC INDUSTRY INSIGHT MONDAY 🎵

Stop wasting your weekends researching radio contacts.

Here's what I learned after 5 years in music PR:

1/ 94% of your research time is spent on outdated info
Only 6% of contacts actually work
That's 14+ hours of wasted effort every week

2/ Generic outreach gets you nowhere
Personalized pitches work 300% better
But you need accurate contact intel first

3/ The average indie artist spends 780 hours annually on research
That's 32+ days of work
Time you could spend creating music

4/ Most artists don't know where to find current contacts
They're using outdated databases and Google searches
Missing the platforms where music professionals actually hang out

5/ The solution? Audio Intel automates this in 2 minutes
Get 94% accurate contact intelligence
Stop wasting your time
Focus on what matters: your music

Comment "BETA" for free access 👇

#MusicTech #IndieMusic #MusicIndustry`,
    platform: 'x',
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#MusicTech', '#IndieMusic', '#MusicIndustry'],
    status: 'draft'
  },
  {
    id: 'content_2',
    content: `🎯 STOP WASTING TIME ON BROKEN TOOLS

I see indie artists spending £200+ monthly on:
❌ Cision (outdated contacts)
❌ Muck Rack (US-focused)
❌ Generic databases (90% wrong)

Meanwhile, UK music scene gets ignored.

Audio Intel fixes this:
✅ 94% accurate UK contacts
✅ Real-time updates
✅ £15/month (not £200)

Stop paying for tools that don't work for UK music.

#UKMusic #IndieMusic #MusicTech`,
    platform: 'x',
    scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#UKMusic', '#IndieMusic', '#MusicTech'],
    status: 'draft'
  },
  {
    id: 'content_3',
    content: `💡 MUSIC INDUSTRY REALITY CHECK

The truth about music promotion:

Most artists think they need:
- Fancy press releases
- Expensive PR agencies
- Complex marketing strategies

What they actually need:
- Accurate contact lists
- Personalized outreach
- Consistent follow-up

Audio Intel gives you the first one.
The rest is up to you.

Stop overthinking. Start executing.

#MusicMarketing #IndieMusic #MusicPR`,
    platform: 'linkedin',
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#MusicMarketing', '#IndieMusic', '#MusicPR'],
    status: 'draft'
  },
  {
    id: 'content_4',
    content: `🔥 HOT TAKE: MUSIC INDUSTRY TOOLS ARE BROKEN

Here's what's wrong with current music marketing tools:

1/ They're built for US market
UK music scene is completely different

2/ They're expensive as hell
£200+ monthly for outdated data

3/ They're generic
No personalization, no targeting

4/ They're slow
Manual research takes forever

Audio Intel is different:
✅ UK-focused
✅ Affordable (£15/month)
✅ Personalized
✅ Fast (2 minutes)

Stop using tools that don't work for you.

#MusicTech #UKMusic #IndieMusic`,
    platform: 'x',
    scheduledTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#MusicTech', '#UKMusic', '#IndieMusic'],
    status: 'draft'
  },
  {
    id: 'content_5',
    content: `🎵 MUSIC INDUSTRY INSIGHT: THE 80/20 RULE

80% of your music marketing time should be spent on:
- Creating great music
- Building relationships
- Engaging with fans

20% should be spent on:
- Researching contacts
- Writing pitches
- Managing outreach

Most artists have this backwards.

Audio Intel handles the 20% so you can focus on the 80%.

Stop wasting time on admin.
Start making music.

#MusicMarketing #IndieMusic #MusicTech`,
    platform: 'linkedin',
    scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#MusicMarketing', '#IndieMusic', '#MusicTech'],
    status: 'draft'
  },
  {
    id: 'content_6',
    content: `🚀 MUSIC INDUSTRY HACK: AUTOMATE THE BORING STUFF

Here's what I automated in my music PR business:

✅ Contact research (Audio Intel)
✅ Email outreach (templates)
✅ Follow-up sequences (automated)
✅ Performance tracking (dashboards)

Result: 300% more clients, same hours.

The secret? Stop doing manual work.
Start using tools that actually work.

Audio Intel handles the research.
You handle the relationships.

#MusicPR #MusicTech #IndieMusic`,
    platform: 'x',
    scheduledTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#MusicPR', '#MusicTech', '#IndieMusic'],
    status: 'draft'
  },
  {
    id: 'content_7',
    content: `💡 MUSIC INDUSTRY TRUTH: MOST ARTISTS ARE DOING IT WRONG

I see indie artists making these mistakes:

❌ Spending hours on contact research
❌ Using generic pitch templates
❌ Following up inconsistently
❌ Not tracking what works

Here's what works:

✅ Use accurate contact data (Audio Intel)
✅ Write personalized pitches
✅ Follow up every 3 days
✅ Track everything in a spreadsheet

The difference? 10x better results.

Stop guessing. Start measuring.

#MusicMarketing #IndieMusic #MusicPR`,
    platform: 'linkedin',
    scheduledTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#MusicMarketing', '#IndieMusic', '#MusicPR'],
    status: 'draft'
  },
  {
    id: 'content_8',
    content: `🎯 MUSIC INDUSTRY REALITY: YOU'RE COMPETING WITH EVERYONE

Every indie artist is trying to get:
- Radio play
- Blog features
- Playlist placements
- Press coverage

But most are doing it wrong.

They're using:
- Outdated contact lists
- Generic pitches
- No follow-up system

You need:
- Fresh contact data
- Personalized outreach
- Consistent follow-up

Audio Intel gives you the first one.
The rest is up to you.

Stop competing. Start executing.

#MusicMarketing #IndieMusic #MusicTech`,
    platform: 'x',
    scheduledTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#MusicMarketing', '#IndieMusic', '#MusicTech'],
    status: 'draft'
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('📱 Content API requested...');
    
    // Notion integration temporarily disabled
    return NextResponse.json({
      success: false,
      error: 'Content management is temporarily unavailable. Please use other features.'
    }, { status: 503 });

  } catch (error) {
    console.error('❌ Failed to load content:', error);
    return NextResponse.json({
      error: 'Failed to load content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, postId, updates } = await request.json();
    
    if (action === 'update') {
      // Update a specific post
      const postIndex = AUTHENTIC_CONTENT.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        AUTHENTIC_CONTENT[postIndex] = { ...AUTHENTIC_CONTENT[postIndex], ...updates };
        return NextResponse.json({
          success: true,
          message: 'Post updated successfully',
          post: AUTHENTIC_CONTENT[postIndex]
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Action completed',
      posts: AUTHENTIC_CONTENT
    });

  } catch (error) {
    console.error('❌ Failed to process content action:', error);
    return NextResponse.json({
      error: 'Failed to process content action',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

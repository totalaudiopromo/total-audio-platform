import { NextRequest, NextResponse } from 'next/server';
import {
  generateNewsletterContent,
  generateTwitterContent,
  generateLinkedInContent,
  generateInstagramSlides,
  generateInstagramCaption,
} from '../content-generators';
import { addToApprovalQueue } from '@/lib/approval-queue';

interface GeneratedContent {
  id: string;
  originalStory: {
    title: string;
    content: string;
    source: string;
    url: string;
    publishedAt: Date;
    relevanceScore: number;
  };
  unsignedAngle: {
    angle: string;
    keyInsight: string;
    actionableAdvice: string;
    urgency: 'low' | 'medium' | 'high' | 'immediate';
  };
  newsletterSections: Array<{
    title: string;
    content: string;
    type: string;
    priority: number;
  }>;
  multiPlatformContent: {
    twitter: {
      content: string[];
      scheduledFor: Date;
      estimatedEngagement: string;
    };
    linkedin: {
      content: {
        title: string;
        article: string;
      };
      scheduledFor: Date;
      estimatedEngagement: string;
    };
    instagram: {
      content: {
        slides: string[];
        caption: string;
      };
      scheduledFor: Date;
      estimatedEngagement: string;
    };
  };
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'published';
  createdAt: Date;
  voiceScore: number;
  confidence: number;
}

// In-memory storage for demo purposes
// In production, this would be stored in a database
let contentStore: GeneratedContent[] = [];

export async function GET() {
  try {
    console.log('Loading newsjacking content...');

    // Try to get real opportunities from the monitor
    let opportunities: any[] = [];
    try {
      const monitorResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/api/newsjacking/monitor`
      );
      if (monitorResponse.ok) {
        const monitorData = await monitorResponse.json();
        opportunities = monitorData.opportunities || [];
        console.log(`Loaded ${opportunities.length} real opportunities`);
      }
    } catch (error) {
      console.log('Monitor not available, using existing content');
    }

    // Convert opportunities to content format
    if (opportunities.length > 0) {
      contentStore = opportunities.slice(0, 5).map((opportunity: any) => {
        const content: GeneratedContent = {
          id: opportunity.id,
          originalStory: {
            title: opportunity.title,
            content: opportunity.description,
            source: opportunity.source.name,
            url: opportunity.link,
            publishedAt: new Date(opportunity.publishedAt),
            relevanceScore: opportunity.relevanceScore,
          },
          unsignedAngle: {
            angle:
              opportunity.audioIntelAngle ||
              'Industry shift creates new opportunities for smart indies',
            keyInsight: opportunity.keyPoints[0] || 'First-mover advantage available',
            actionableAdvice: 'Act now while the opportunity is fresh',
            urgency: opportunity.urgencyLevel,
          },
          newsletterSections: [
            {
              title: "This Week's Industry Intel",
              content: generateNewsletterContent(opportunity),
              type: 'industry_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: generateTwitterContent(opportunity),
              scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
              estimatedEngagement: opportunity.urgencyLevel === 'immediate' ? 'High' : 'Medium',
            },
            linkedin: {
              content: {
                title: `The Unsigned Advantage: ${opportunity.title.substring(0, 60)}...`,
                article: generateLinkedInContent(opportunity),
              },
              scheduledFor: new Date(Date.now() + 90 * 60 * 1000), // 90 min from now
              estimatedEngagement: 'Medium-High',
            },
            instagram: {
              content: {
                slides: generateInstagramSlides(opportunity),
                caption: generateInstagramCaption(opportunity),
              },
              scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
              estimatedEngagement: opportunity.urgencyLevel === 'immediate' ? 'High' : 'Medium',
            },
          },
          status: 'pending',
          createdAt: new Date(),
          voiceScore: Math.min(opportunity.relevanceScore + 0.2, 1.0),
          confidence: opportunity.relevanceScore,
        };

        // Add to approval queue for workflow
        addToApprovalQueue(content);

        return content;
      });
    }

    // If no real content, fall back to mock content for testing
    // This pool rotates through different topics for variety
    if (contentStore.length === 0) {
      const mockContentPool: GeneratedContent[] = [
        // 1. Sync Licensing Opportunity
        {
          id: `content_${Date.now()}_sync001`,
          originalStory: {
            title: 'Netflix Expands Music Licensing Team, Seeks Independent Artists',
            content:
              'Netflix has announced a major expansion of their music licensing division, specifically targeting independent artists for their growing slate of original content. The streaming giant is looking for authentic, diverse sounds that major labels often overlook.',
            source: 'Variety',
            url: 'https://example.com/netflix-sync-expansion',
            publishedAt: new Date(Date.now() - 45 * 60 * 1000),
            relevanceScore: 0.92,
          },
          unsignedAngle: {
            angle: 'Sync licensing doors are opening for indies - Netflix wants YOUR sound',
            keyInsight:
              'Major streamers are bypassing labels to work directly with independent artists',
            actionableAdvice:
              'Get your sync-ready masters organised and reach out to their new licensing contacts',
            urgency: 'high',
          },
          newsletterSections: [
            {
              title: 'Sync Licensing Alert',
              content:
                "Right, so Netflix just made a massive move that most artists will completely miss...\n\nHere's the thing: They're actively seeking indie artists because major label catalogues are too expensive and sound too similar.",
              type: 'sync_alert',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '🎬 SYNC OPPORTUNITY: Netflix just expanded their indie music licensing team',
                'Why? Major label catalogues are expensive and sound the same.',
                'They want YOUR unique sound for original content.',
                'This is why having the right contacts matters. First movers win sync deals.',
              ],
              scheduledFor: new Date(Date.now() + 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
            linkedin: {
              content: {
                title: 'Netflix Opens Doors to Independent Artists: The Sync Licensing Shift',
                article:
                  'The streaming wars have created an unexpected opportunity for independent artists...',
              },
              scheduledFor: new Date(Date.now() + 90 * 60 * 1000),
              estimatedEngagement: 'High',
            },
            instagram: {
              content: {
                slides: [
                  'SYNC LICENSING NEWS 🎬',
                  'Netflix expanding indie licensing',
                  'Why major labels are out...',
                  'Your unique sound is IN',
                  'Contact intelligence = sync deals',
                ],
                caption:
                  "Netflix wants indie artists. Not because they're cheap - because major labels all sound the same. Your uniqueness is your asset 🔥",
              },
              scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 15 * 60 * 1000),
          voiceScore: 0.88,
          confidence: 0.91,
        },
        // 2. Music Journalism Shift
        {
          id: `content_${Date.now()}_press002`,
          originalStory: {
            title: 'The Line of Best Fit and Stereogum Announce New Submission Policies',
            content:
              'Major music publications The Line of Best Fit and Stereogum have announced updated submission guidelines that prioritise direct artist submissions over PR agency pitches.',
            source: 'The Quietus',
            url: 'https://example.com/press-submission-changes',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            relevanceScore: 0.85,
          },
          unsignedAngle: {
            angle: 'Music press now favours direct artist contact over expensive PR agencies',
            keyInsight:
              'Editorial teams are overwhelmed by generic PR pitches - authentic direct contact wins',
            actionableAdvice:
              'Build direct relationships with journalists instead of paying PR middlemen',
            urgency: 'medium',
          },
          newsletterSections: [
            {
              title: 'Press Strategy Shift',
              content:
                "Here's something the PR agencies won't tell you: Major music publications are actively deprioritising agency submissions.\n\nWhy? They're drowning in identical pitches. Direct, personal contact stands out.",
              type: 'press_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '📰 PR INTEL: The Line of Best Fit and Stereogum just changed their submission policies',
                "What they're deprioritising: Generic PR agency pitches",
                'What they want: Direct artist submissions with authentic stories',
                'This is why knowing the right journalist matters more than paying a PR retainer.',
              ],
              scheduledFor: new Date(Date.now() + 3 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High',
            },
            linkedin: {
              content: {
                title: 'Why Music Journalists Are Deprioritising PR Agencies',
                article: 'The relationship between artists and press is changing fundamentally...',
              },
              scheduledFor: new Date(Date.now() + 4 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium',
            },
            instagram: {
              content: {
                slides: [
                  'PRESS STRATEGY UPDATE 📰',
                  'What publications want:',
                  'NOT: Generic PR pitches',
                  'YES: Direct artist contact',
                  'Build relationships, not invoices',
                ],
                caption:
                  'Spent £2k on a PR agency that sent template emails? Music press is actively deprioritising those now. Direct contact wins.',
              },
              scheduledFor: new Date(Date.now() + 5 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          voiceScore: 0.82,
          confidence: 0.84,
        },
        // 3. BBC Radio Introducing Changes
        {
          id: `content_${Date.now()}_radio003`,
          originalStory: {
            title: 'BBC Radio 6 Music Introducing Expands Regional Show Slots',
            content:
              'BBC Radio 6 Music has announced an expansion of their Introducing programming with new regional show slots and updated presenter contacts across the network.',
            source: 'BBC Media Centre',
            url: 'https://example.com/bbc-introducing-expansion',
            publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            relevanceScore: 0.94,
          },
          unsignedAngle: {
            angle: 'New BBC radio slots = new presenter relationships to build NOW',
            keyInsight:
              'First artists to build relationships with new presenters get priority plays',
            actionableAdvice:
              'Research the new presenter contacts and submit before the masses catch on',
            urgency: 'immediate',
          },
          newsletterSections: [
            {
              title: 'BBC Radio Intel',
              content:
                "BBC 6 Music just created more airtime slots than they've had in years.\n\nHere's what smart indies know: New presenters have empty playlists to fill. Get in early, build the relationship, become their go-to artist.",
              type: 'radio_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '📻 BBC RADIO 6 MUSIC UPDATE: New Introducing slots just opened up',
                'New slots = new presenters = empty playlists to fill',
                'The artists who reach out first become go-to submissions',
                'This is exactly why we track radio contact changes in real-time.',
              ],
              scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
            linkedin: {
              content: {
                title: 'BBC Radio 6 Music Expansion: What It Means for Independent Artists',
                article:
                  'The BBC just created significant new opportunities for unsigned artists...',
              },
              scheduledFor: new Date(Date.now() + 3 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High',
            },
            instagram: {
              content: {
                slides: [
                  'BBC 6 MUSIC NEWS 📻',
                  'New Introducing slots',
                  'New presenters',
                  'Empty playlists to fill',
                  'First contact = first plays',
                ],
                caption:
                  'BBC 6 Music just expanded. New presenters have empty playlists and no established relationships yet. Move now 🎯',
              },
              scheduledFor: new Date(Date.now() + 4 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 20 * 60 * 1000),
          voiceScore: 0.91,
          confidence: 0.93,
        },
        // 4. TikTok Algorithm Changes
        {
          id: `content_${Date.now()}_social004`,
          originalStory: {
            title: 'TikTok Music Discovery Algorithm Shifts Towards Artist Relationships',
            content:
              'TikTok has updated their music discovery algorithm to favour songs with established artist-curator relationships, moving away from purely viral metrics.',
            source: 'Social Media Today',
            url: 'https://example.com/tiktok-algorithm-update',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            relevanceScore: 0.87,
          },
          unsignedAngle: {
            angle:
              'TikTok now rewards relationships over viral luck - contact intelligence matters here too',
            keyInsight:
              'The algorithm now favours consistent creator relationships over random virality',
            actionableAdvice:
              'Build ongoing relationships with creators rather than one-off viral attempts',
            urgency: 'medium',
          },
          newsletterSections: [
            {
              title: 'Social Platform Intel',
              content:
                "TikTok just changed the game again.\n\nThe old model: Hope for viral luck\nThe new model: Build creator relationships that get consistent placement\n\nContact intelligence isn't just for radio anymore.",
              type: 'social_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '📱 TIKTOK UPDATE: The algorithm now favours artist-creator relationships',
                'Translation: Random viral attempts are getting deprioritised',
                'What works now: Consistent relationships with creators who use your music regularly',
                "Algorithms change. Relationships don't.",
              ],
              scheduledFor: new Date(Date.now() + 5 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
            linkedin: {
              content: {
                title: "TikTok's Algorithm Shift: From Viral Luck to Relationship Value",
                article:
                  'The most significant change to TikTok music discovery since the platform launched...',
              },
              scheduledFor: new Date(Date.now() + 6 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium',
            },
            instagram: {
              content: {
                slides: [
                  'TIKTOK ALGORITHM UPDATE 📱',
                  'Old: Viral luck matters',
                  'New: Relationships matter',
                  'Build creator contacts',
                  'Consistency beats one-offs',
                ],
                caption:
                  'TikTok just shifted their algorithm. Viral luck is out, creator relationships are in. Another win for contact intelligence 🎯',
              },
              scheduledFor: new Date(Date.now() + 7 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 45 * 60 * 1000),
          voiceScore: 0.79,
          confidence: 0.86,
        },
        // 5. Major Label A&R Restructuring
        {
          id: `content_${Date.now()}_industry005`,
          originalStory: {
            title: 'Universal Music Restructures A&R Division, Cuts Discovery Staff',
            content:
              'Universal Music Group has announced a major restructuring of their A&R division, reducing the number of scouts actively discovering new talent and shifting focus to already-established artists.',
            source: 'Music Business Worldwide',
            url: 'https://example.com/universal-ar-restructure',
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            relevanceScore: 0.89,
          },
          unsignedAngle: {
            angle: 'Major labels are abandoning artist discovery - the indie path is now THE path',
            keyInsight:
              "Labels only sign artists who've already done the work - build your career independently first",
            actionableAdvice:
              'Stop waiting for discovery and build direct industry relationships yourself',
            urgency: 'high',
          },
          newsletterSections: [
            {
              title: 'Major Label Drama = Indie Opportunity',
              content:
                "Universal just cut their A&R discovery team.\n\nHere's the reality: Major labels now only sign artists who've already proven themselves. The path to success runs through independent infrastructure first.\n\nYour career isn't waiting on a label anymore. It's waiting on you.",
              type: 'industry_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '⚡ INDUSTRY SHIFT: Universal Music just gutted their A&R discovery team',
                "What this means: Major labels aren't discovering artists anymore",
                "They're only signing artists who've already done the work independently",
                "The indie path isn't the alternative anymore. It's the ONLY path.",
              ],
              scheduledFor: new Date(Date.now() + 6 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
            linkedin: {
              content: {
                title:
                  "Universal's A&R Restructure: Why Independent Infrastructure Matters More Than Ever",
                article:
                  'The traditional path to music industry success just changed fundamentally...',
              },
              scheduledFor: new Date(Date.now() + 7 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
            instagram: {
              content: {
                slides: [
                  'MAJOR LABEL NEWS ⚡',
                  'Universal cuts A&R discovery',
                  "They're not finding artists anymore",
                  "They're only signing proven artists",
                  'Build your career first. Label later.',
                ],
                caption:
                  "Universal just cut their discovery team. They're not looking for new artists - they're waiting for artists who've already built something. Build yours 🚀",
              },
              scheduledFor: new Date(Date.now() + 8 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 60 * 60 * 1000),
          voiceScore: 0.86,
          confidence: 0.88,
        },
        // 6. UK Festival Booking Windows
        {
          id: `content_${Date.now()}_live006`,
          originalStory: {
            title: 'UK Festivals Open Early Booking Windows for 2026 Season',
            content:
              'Major UK festivals including Glastonbury, Reading, and Latitude have opened their 2026 artist booking windows earlier than ever, with new streamlined application processes.',
            source: 'IQ Magazine',
            url: 'https://example.com/uk-festival-booking-2026',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            relevanceScore: 0.83,
          },
          unsignedAngle: {
            angle:
              'Festival booking windows open early - build booker relationships NOW for 2026 slots',
            keyInsight:
              'Early applications with existing booker relationships get priority placement',
            actionableAdvice:
              "Start reaching out to festival bookers immediately - don't wait for public deadlines",
            urgency: 'medium',
          },
          newsletterSections: [
            {
              title: 'Live Music Intel',
              content:
                "2026 festival booking just opened early.\n\nHere's what most artists miss: By the time public applications open, the good slots are already allocated through existing relationships.\n\nThe time to reach festival bookers is now, not when everyone else applies.",
              type: 'live_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '🎪 FESTIVAL ALERT: UK 2026 booking windows just opened EARLY',
                'Glastonbury, Reading, Latitude - all accepting applications now',
                "Here's what matters: The best slots go to artists with existing booker relationships",
                'Public deadlines are already too late. Build contacts now.',
              ],
              scheduledFor: new Date(Date.now() + 8 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High',
            },
            linkedin: {
              content: {
                title: 'UK Festival Booking Opens Early: Why Relationships Trump Applications',
                article:
                  "The 2026 festival season is already being booked - here's how independent artists can get in...",
              },
              scheduledFor: new Date(Date.now() + 9 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium',
            },
            instagram: {
              content: {
                slides: [
                  'UK FESTIVAL INTEL 🎪',
                  '2026 booking open EARLY',
                  'Public deadlines = too late',
                  'Booker relationships = priority',
                  'Start contact building NOW',
                ],
                caption:
                  '2026 festival booking just opened. By public deadline, good slots are gone. Build booker relationships now, not later 🎯',
              },
              scheduledFor: new Date(Date.now() + 10 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 90 * 60 * 1000),
          voiceScore: 0.78,
          confidence: 0.82,
        },
        // 7. Playlist Curator Database Leak
        {
          id: `content_${Date.now()}_playlist007`,
          originalStory: {
            title:
              'Spotify Playlist Curator Contacts Becoming Public Through New Editorial Features',
            content:
              "Spotify's new editorial transparency features are inadvertently exposing playlist curator contact information, creating unprecedented access for independent artists.",
            source: 'Digital Music News',
            url: 'https://example.com/spotify-curator-contacts',
            publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
            relevanceScore: 0.96,
          },
          unsignedAngle: {
            angle:
              "Playlist curator contacts are becoming visible - this window won't stay open long",
            keyInsight:
              "Spotify's transparency features are exposing curator contacts before they patch it",
            actionableAdvice:
              'Identify and reach out to relevant curators NOW before access closes',
            urgency: 'immediate',
          },
          newsletterSections: [
            {
              title: 'Playlist Intelligence Alert',
              content:
                "Spotify accidentally opened a door.\n\nTheir new editorial features are exposing playlist curator contacts. This is information that playlist pitching services charge £500+ for.\n\nThis window won't stay open. Move fast.",
              type: 'playlist_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                "🚨 PLAYLIST INTEL: Spotify's new features are exposing curator contacts",
                'This is information that services charge £500+ for',
                "The transparency window won't stay open long",
                'Get the contacts you need NOW before this gets patched.',
              ],
              scheduledFor: new Date(Date.now() + 1 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
            linkedin: {
              content: {
                title: "Spotify's Transparency Features: An Unexpected Opportunity for Indies",
                article:
                  "A quirk in Spotify's new editorial features has created a significant opportunity...",
              },
              scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High',
            },
            instagram: {
              content: {
                slides: [
                  'PLAYLIST ALERT 🚨',
                  'Spotify showing curator contacts',
                  'Usually costs £500+ to access',
                  'Currently visible through new features',
                  'Window closing soon',
                ],
                caption:
                  "Spotify accidentally exposed curator contacts through their new features. This is £500+ worth of intel, currently free. Window won't stay open 🎯",
              },
              scheduledFor: new Date(Date.now() + 3 * 60 * 60 * 1000),
              estimatedEngagement: 'High',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 10 * 60 * 1000),
          voiceScore: 0.94,
          confidence: 0.95,
        },
        // 8. AI Music Royalties Discussion
        {
          id: `content_${Date.now()}_ai008`,
          originalStory: {
            title: 'UK Government Opens Consultation on AI-Generated Music Royalties',
            content:
              'The UK government has launched a formal consultation on how royalties should be handled for AI-generated and AI-assisted music, with implications for independent artists.',
            source: 'GOV.UK',
            url: 'https://example.com/uk-ai-music-royalties',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            relevanceScore: 0.81,
          },
          unsignedAngle: {
            angle: 'AI music policy being written NOW - indie voices needed in the consultation',
            keyInsight: 'Regulations being written today will shape royalties for decades',
            actionableAdvice:
              'Submit to the consultation and ensure indie interests are represented',
            urgency: 'medium',
          },
          newsletterSections: [
            {
              title: 'AI & Music Intel',
              content:
                'The rules for AI music royalties are being written right now.\n\nIf only major labels have their say, guess whose interests get protected? Not yours.\n\nThe consultation is open. Your voice matters. Speak up.',
              type: 'ai_intel',
              priority: 1,
            },
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '🤖 AI + MUSIC: UK government consultation on AI royalties NOW OPEN',
                'The rules being written today will affect your income for decades',
                'If only major labels respond, only major labels get protected',
                'Your voice matters. Submit to the consultation.',
              ],
              scheduledFor: new Date(Date.now() + 9 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium',
            },
            linkedin: {
              content: {
                title:
                  'AI Music Royalties: Why Independent Artists Must Participate in UK Consultation',
                article: 'The framework for AI music royalties is being established now...',
              },
              scheduledFor: new Date(Date.now() + 10 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High',
            },
            instagram: {
              content: {
                slides: [
                  'AI ROYALTIES UPDATE 🤖',
                  'UK writing the rules NOW',
                  "Who's at the table?",
                  'Major labels (definitely)',
                  'Indies? Only if you speak up',
                ],
                caption:
                  "AI music royalty rules are being written NOW. If indies don't participate in the consultation, don't expect indie-friendly outcomes 📢",
              },
              scheduledFor: new Date(Date.now() + 11 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium',
            },
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          voiceScore: 0.75,
          confidence: 0.8,
        },
      ];

      // Randomly select 3-5 items from the pool for variety
      const shuffled = mockContentPool.sort(() => Math.random() - 0.5);
      const selectedCount = Math.floor(Math.random() * 3) + 3; // 3-5 items
      contentStore.push(...shuffled.slice(0, selectedCount));
    }

    return NextResponse.json({
      success: true,
      data: contentStore.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    });
  } catch (error) {
    console.error('Error fetching newsjacking content:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, contentId, scheduledTime } = await request.json();

    const content = contentStore.find(c => c.id === contentId);
    if (!content) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 });
    }

    switch (action) {
      case 'approve':
        content.status = 'approved';
        break;
      case 'reject':
        content.status = 'rejected';
        break;
      case 'schedule':
        content.status = 'scheduled';
        // Update scheduled times for all platforms
        if (scheduledTime) {
          const scheduleDate = new Date(scheduledTime);
          content.multiPlatformContent.twitter.scheduledFor = new Date(
            scheduleDate.getTime() + 60 * 60 * 1000
          ); // +1 hour
          content.multiPlatformContent.linkedin.scheduledFor = new Date(
            scheduleDate.getTime() - 60 * 60 * 1000
          ); // -1 hour
          content.multiPlatformContent.instagram.scheduledFor = new Date(
            scheduleDate.getTime() + 11 * 60 * 60 * 1000
          ); // +11 hours
        }
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error updating newsjacking content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('id');

    if (!contentId) {
      return NextResponse.json({ success: false, error: 'Content ID required' }, { status: 400 });
    }

    const index = contentStore.findIndex(c => c.id === contentId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 });
    }

    contentStore.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting newsjacking content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}

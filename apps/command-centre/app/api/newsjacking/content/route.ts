import { NextRequest, NextResponse } from 'next/server';
import { 
  generateNewsletterContent, 
  generateTwitterContent, 
  generateLinkedInContent, 
  generateInstagramSlides, 
  generateInstagramCaption 
} from '../content-generators';

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
    console.log('📊 Loading newsjacking content...');
    
    // Try to get real opportunities from the monitor
    let opportunities: any[] = [];
    try {
      const monitorResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/api/newsjacking/monitor`);
      if (monitorResponse.ok) {
        const monitorData = await monitorResponse.json();
        opportunities = monitorData.opportunities || [];
        console.log(`✅ Loaded ${opportunities.length} real opportunities`);
      }
    } catch (error) {
      console.log('📡 Monitor not available, using existing content');
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
            relevanceScore: opportunity.relevanceScore
          },
          unsignedAngle: {
            angle: opportunity.audioIntelAngle || 'Industry shift creates new opportunities for smart indies',
            keyInsight: opportunity.keyPoints[0] || 'First-mover advantage available',
            actionableAdvice: 'Act now while the opportunity is fresh',
            urgency: opportunity.urgencyLevel
          },
          newsletterSections: [
            {
              title: 'This Week\'s Industry Intel',
              content: generateNewsletterContent(opportunity),
              type: 'industry_intel',
              priority: 1
            }
          ],
          multiPlatformContent: {
            twitter: {
              content: generateTwitterContent(opportunity),
              scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
              estimatedEngagement: opportunity.urgencyLevel === 'immediate' ? 'High' : 'Medium'
            },
            linkedin: {
              content: {
                title: `The Unsigned Advantage: ${opportunity.title.substring(0, 60)}...`,
                article: generateLinkedInContent(opportunity)
              },
              scheduledFor: new Date(Date.now() + 90 * 60 * 1000), // 90 min from now
              estimatedEngagement: 'Medium-High'
            },
            instagram: {
              content: {
                slides: generateInstagramSlides(opportunity),
                caption: generateInstagramCaption(opportunity)
              },
              scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
              estimatedEngagement: opportunity.urgencyLevel === 'immediate' ? 'High' : 'Medium'
            }
          },
          status: 'pending',
          createdAt: new Date(),
          voiceScore: Math.min(opportunity.relevanceScore + 0.2, 1.0),
          confidence: opportunity.relevanceScore
        };
        return content;
      });
    }
    
    // If no real content, fall back to mock content for testing
    if (contentStore.length === 0) {
      const mockContent: GeneratedContent[] = [
        {
          id: `content_${Date.now()}_abc123`,
          originalStory: {
            title: 'Spotify Announces AI-Powered Playlist Creation Tool for Independent Artists',
            content: 'Spotify has just announced a groundbreaking new AI-powered playlist creation tool specifically designed for independent artists. The new feature, called "Playlist AI Pro," allows artists to automatically generate targeted playlists based on their music style, audience demographics, and streaming data.',
            source: 'Music Business Worldwide',
            url: 'https://example.com/spotify-ai-playlist',
            publishedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            relevanceScore: 0.95
          },
          unsignedAngle: {
            angle: 'Major platforms finally giving indies the tools they need',
            keyInsight: 'This democratizes playlist creation - no more paying thousands for playlist pitching services',
            actionableAdvice: 'Sign up for the beta immediately and start building your playlists now',
            urgency: 'immediate'
          },
          newsletterSections: [
            {
              title: 'This Week\'s Industry Intel',
              content: 'Right, so whilst Spotify is making announcements, here\'s why that\'s actually brilliant news for independent artists...\n\nNow, here\'s your move: New platform features favor artists who can adapt quickly over those stuck in old systems.',
              type: 'industry_intel',
              priority: 1
            },
            {
              title: 'Trend Alert: What Indies Should Know',
              content: 'The reality is this: major labels have been using AI playlist tools for months. Now you can too...\n\nWhat this actually means for you: Level playing field.',
              type: 'trend_alert', 
              priority: 2
            }
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '🧵 This week\'s industry intel: Spotify just leveled the playing field for indie artists',
                'While major labels pay thousands for playlist services, you can now build targeted playlists with AI',
                'The tool analyzes your audience data and creates playlists that actually convert listeners to fans'
              ],
              scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
              estimatedEngagement: 'High'
            },
            linkedin: {
              content: {
                title: 'The Unsigned Advantage: Spotify Levels the Playlist Playing Field',
                article: 'Spotify\'s new AI playlist tool represents a fundamental shift in how independent artists can compete with major labels...'
              },
              scheduledFor: new Date(Date.now() + 23 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High'
            },
            instagram: {
              content: {
                slides: [
                  'Spotify just announced AI playlist tools for indies',
                  'What major labels pay £1000s for...',
                  'You can now access for free',
                  'The unsigned advantage strikes again'
                ],
                caption: 'While major labels struggle with bureaucracy, indies move fast and win. Link in bio for the full breakdown 🔥'
              },
              scheduledFor: new Date(Date.now() + 35 * 60 * 60 * 1000),
              estimatedEngagement: 'High'
            }
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 10 * 60 * 1000),
          voiceScore: 0.25,
          confidence: 0.9
        },
        {
          id: `content_${Date.now()}_def456`,
          originalStory: {
            title: 'Major UK Radio Stations Eliminate Manual Submission Processes',
            content: 'The BBC, Capital FM, and other major UK radio stations have jointly announced new streamlined submission guidelines that eliminate manual processes for independent artists.',
            source: 'Music Week',
            url: 'https://example.com/uk-radio-automation',
            publishedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
            relevanceScore: 0.88
          },
          unsignedAngle: {
            angle: 'Manual barriers removed - indies can now compete on equal footing',
            keyInsight: 'Radio promotion just became accessible to independent artists',
            actionableAdvice: 'Update your radio submission strategy immediately',
            urgency: 'high'
          },
          newsletterSections: [
            {
              title: 'Major Label Drama = Indie Opportunity',
              content: 'While everyone\'s talking about UK radio automation, here\'s what independent artists should actually be focusing on...\n\nHere\'s your move: The manual research that used to take 4 hours per station is now automated.',
              type: 'industry_intel',
              priority: 1
            }
          ],
          multiPlatformContent: {
            twitter: {
              content: [
                '🚨 BREAKING: UK radio just eliminated the biggest barrier for indie artists',
                'BBC, Capital FM, and major stations now accept automated submissions',
                'No more 4-hour manual research per station. Game changer.'
              ],
              scheduledFor: new Date(Date.now() + 25 * 60 * 60 * 1000),
              estimatedEngagement: 'High'
            },
            linkedin: {
              content: {
                title: 'The End of Manual Radio Promotion: What This Means for Independent Artists',
                article: 'The UK radio industry just made the biggest change in 20 years...'
              },
              scheduledFor: new Date(Date.now() + 22 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium'
            },
            instagram: {
              content: {
                slides: [
                  'UK radio just changed everything',
                  'Manual submissions = GONE',
                  'Automated systems = HERE',
                  'Indies finally have equal access'
                ],
                caption: 'The biggest radio industry change in 20 years just happened. Indies, this is your moment 📻'
              },
              scheduledFor: new Date(Date.now() + 36 * 60 * 60 * 1000),
              estimatedEngagement: 'Medium-High'
            }
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 60 * 1000),
          voiceScore: 0.18,
          confidence: 0.8
        }
      ];

      contentStore.push(...mockContent);
    }

    return NextResponse.json({
      success: true,
      data: contentStore.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    });
  } catch (error) {
    console.error('Error fetching newsjacking content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, contentId, scheduledTime } = await request.json();
    
    const content = contentStore.find(c => c.id === contentId);
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
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
          content.multiPlatformContent.twitter.scheduledFor = new Date(scheduleDate.getTime() + 60 * 60 * 1000); // +1 hour
          content.multiPlatformContent.linkedin.scheduledFor = new Date(scheduleDate.getTime() - 60 * 60 * 1000); // -1 hour  
          content.multiPlatformContent.instagram.scheduledFor = new Date(scheduleDate.getTime() + 11 * 60 * 60 * 1000); // +11 hours
        }
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: content
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
      return NextResponse.json(
        { success: false, error: 'Content ID required' },
        { status: 400 }
      );
    }

    const index = contentStore.findIndex(c => c.id === contentId);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    contentStore.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting newsjacking content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
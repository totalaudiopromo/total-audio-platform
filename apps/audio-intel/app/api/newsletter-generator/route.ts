import { NextRequest, NextResponse } from 'next/server';

interface NewsletterSection {
  title: string;
  content: string;
  type: 'news' | 'case_study' | 'tip' | 'tool_spotlight';
}

interface NewsletterContent {
  subject: string;
  preview: string;
  sections: NewsletterSection[];
  cta: string;
  personalNote: string;
}

async function generateNewsletterContent(): Promise<NewsletterContent> {
  // Get news from newsjacker
  const newsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/newsjacker`);
  const newsData = await newsResponse.json();
  
  const newsItems = newsData.newsItems || [];
  const highRelevanceNews = newsItems.filter((item: any) => item.relevance === 'High');
  
  // Generate newsletter sections
  const sections: NewsletterSection[] = [];
  
  // 1. Opening personal note
  sections.push({
    title: "What's Up, Indie Hustlers?",
    content: `Another week, another round of music industry chaos. But here's the thing - while everyone else is panicking about algorithm changes and platform updates, we're turning them into opportunities.

This week I've got some game-changing updates that could seriously impact how you approach music promotion. Plus, I'm sharing a real case study from my own radio contact enrichment that'll show you exactly why Audio Intel is becoming the secret weapon for smart indie artists.

Let's dive in.`,
    type: 'tip'
  });
  
  // 2. News sections from newsjacker
  if (highRelevanceNews.length > 0) {
    sections.push({
      title: "🔥 This Week's Industry Intel",
      content: highRelevanceNews.map((item: any) => item.newsletterContent).join('\n\n---\n\n'),
      type: 'news'
    });
  }
  
  // 3. Case study section
  sections.push({
    title: "📊 Real Results: My Radio Contact Enrichment Case Study",
    content: `I've been testing Audio Intel on my own radio contacts this week, and the results are honestly mind-blowing.

**Before Audio Intel:**
- 5 basic email addresses
- Zero context about preferences
- No idea about submission guidelines
- Guessing at the best approach

**After Audio Intel (2 minutes later):**
- Detailed intelligence for every contact
- Specific submission preferences
- Coverage areas and audience insights
- Strategic tips for each contact
- 100% success rate on enrichment

**The Real Impact:**
Instead of spending 2+ hours researching each contact manually, I got comprehensive intelligence in under 2 minutes. That's 10+ hours saved on just 5 contacts.

This is exactly why I built Audio Intel - because I was tired of wasting my weekends doing research that could be automated. Now I can focus on what actually matters: building relationships and getting results.

*Want to see this in action? Try it yourself with your own contacts - it's free during beta.*`,
    type: 'case_study'
  });
  
  // 4. Tool spotlight
  sections.push({
    title: "🛠️ Tool Spotlight: Audio Intel's Newsjacker",
    content: `Speaking of automation, I've just built something that's going to change how I create newsletter content.

The Newsjacker automatically finds the latest music industry news that actually matters to indie artists, then adds my personal spin and actionable insights. No more spending hours hunting for relevant news - it's all automated.

This week it found:
- Spotify's new discovery features for indie artists
- TikTok's algorithm changes favoring quality over follower count  
- BBC Introducing's expanded local artist support

Each piece of news comes with:
- Why it matters to indie artists
- My personal take on the implications
- Actionable next steps you can take today

The future of music promotion is automation + personal insight. This is just the beginning.`,
    type: 'tool_spotlight'
  });
  
  // 5. Closing tip
  sections.push({
    title: "💡 This Week's Pro Tip",
    content: `Stop trying to be everywhere at once. Pick ONE platform where your target audience actually hangs out, and dominate it.

For radio promotion? Focus on BBC Introducing and local stations.
For playlist promotion? Master Spotify's new discovery features.
For social media? Pick TikTok OR Instagram, not both.

The artists who succeed aren't the ones with the most followers - they're the ones who understand their audience and show up consistently where it matters.

Quality over quantity. Always.`,
    type: 'tip'
  });
  
  return {
    subject: "🎵 This Week's Music Industry Intel + My Radio Contact Case Study",
    preview: "Spotify's new discovery features, TikTok algorithm changes, and why I'm automating my contact research (with real results).",
    sections,
    cta: "Try Audio Intel Free (Beta)",
    personalNote: "Thanks for being part of The Unsigned Advantage community. Every week I'm sharing the insights that are actually moving the needle for indie artists. Keep hustling. - Chris"
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log('📧 Generating newsletter content...');
    
    const newsletterContent = await generateNewsletterContent();
    
    console.log(`✅ Generated newsletter with ${newsletterContent.sections.length} sections`);
    
    return NextResponse.json({
      success: true,
      message: 'Newsletter content generated successfully',
      content: newsletterContent,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Newsletter generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate newsletter content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customTopic, includeCaseStudy = true, includeNews = true } = await request.json();
    
    console.log(`📧 Generating custom newsletter content for topic: ${customTopic}`);
    
    // Generate base content
    const newsletterContent = await generateNewsletterContent();
    
    // Customize based on request
    if (customTopic) {
      // Add custom topic section
      newsletterContent.sections.unshift({
        title: `🎯 Focus: ${customTopic}`,
        content: `This week we're diving deep into ${customTopic} and how it impacts your music promotion strategy.`,
        type: 'tip'
      });
    }
    
    if (!includeCaseStudy) {
      newsletterContent.sections = newsletterContent.sections.filter(section => section.type !== 'case_study');
    }
    
    if (!includeNews) {
      newsletterContent.sections = newsletterContent.sections.filter(section => section.type !== 'news');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Custom newsletter content generated successfully',
      content: newsletterContent,
      customizations: {
        customTopic,
        includeCaseStudy,
        includeNews
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Custom newsletter generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate custom newsletter content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}





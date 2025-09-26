import { NextRequest, NextResponse } from 'next/server';

interface PodcastEpisode {
  title: string;
  description: string;
  publishedAt: string;
  duration: string;
  url: string;
  aiInsights: string[];
  techFeatures: string[];
  musicIndustryRelevance: 'High' | 'Medium' | 'Low';
  actionableTips: string[];
  newsletterContent: string;
}

// Demo podcast episodes with AI/tech insights
const demoEpisodes: PodcastEpisode[] = [
  {
    title: "The Future of AI in Music Production with Suno CEO",
    description: "Suno CEO discusses how AI is revolutionizing music creation, from generating beats to full song production. Learn about the latest features and how indie artists can leverage AI tools for faster, more creative workflows.",
    publishedAt: "2025-09-08T10:00:00.000Z",
    duration: "45:30",
    url: "https://example.com/episode1",
    aiInsights: [
      "Suno's new AI can generate full songs in under 2 minutes",
      "AI-generated music is becoming indistinguishable from human-created content",
      "Indie artists are using AI to prototype ideas before full production"
    ],
    techFeatures: [
      "Suno's latest model supports 10+ genres",
      "Real-time collaboration with AI",
      "Export to multiple formats (MP3, WAV, MIDI)"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Use AI to generate multiple song concepts quickly",
      "Export AI demos to share with producers and collaborators",
      "Combine AI-generated elements with human creativity for unique sound"
    ],
    newsletterContent: `**🎙️ The Future of AI in Music Production with Suno CEO**

Suno CEO discusses how AI is revolutionizing music creation, from generating beats to full song production. Learn about the latest features and how indie artists can leverage AI tools for faster, more creative workflows.

*Why this matters:* AI music tools are becoming so advanced that indie artists can now prototype entire songs in minutes instead of hours. This levels the playing field against major labels with big budgets.

**Action Item:** Try Suno's free tier to generate 3-5 song concepts for your next project. Use AI as a creative starting point, not a replacement for your artistic vision.`
  },
  {
    title: "TikTok's New AI Music Discovery Algorithm",
    description: "TikTok's head of music partnerships reveals how their new AI algorithm is changing music discovery. The system now prioritizes quality over follower count, giving indie artists a better chance at viral success.",
    publishedAt: "2025-09-07T14:30:00.000Z",
    duration: "32:15",
    url: "https://example.com/episode2",
    aiInsights: [
      "TikTok's AI now analyzes audio quality, not just engagement metrics",
      "The algorithm favors unique sounds over popular trends",
      "Indie artists with high-quality audio are getting more visibility"
    ],
    techFeatures: [
      "Real-time audio analysis",
      "Genre-agnostic discovery",
      "Quality scoring system"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Focus on audio quality over follower count",
      "Create unique, distinctive sounds that stand out",
      "Upload consistently to build algorithm trust"
    ],
    newsletterContent: `**🎙️ TikTok's New AI Music Discovery Algorithm**

TikTok's head of music partnerships reveals how their new AI algorithm is changing music discovery. The system now prioritizes quality over follower count, giving indie artists a better chance at viral success.

*Why this matters:* This is huge for indie artists who've been struggling with TikTok's algorithm. Quality over quantity is now the key to success, which levels the playing field.

**Action Item:** Audit your TikTok content for audio quality. Invest in better recording equipment or use AI mastering tools to improve your sound quality.`
  },
  {
    title: "Spotify's AI Playlist Curation Revolution",
    description: "Spotify's AI team explains how machine learning is transforming playlist curation. The new system can identify emerging artists and genres before they hit mainstream, creating opportunities for early adopters.",
    publishedAt: "2025-09-06T09:15:00.000Z",
    duration: "38:45",
    url: "https://example.com/episode3",
    aiInsights: [
      "Spotify's AI can predict viral songs 2-3 weeks before they peak",
      "The system identifies micro-genres and emerging sounds",
      "Early submission to Spotify for Artists increases AI visibility"
    ],
    techFeatures: [
      "Predictive analytics for song performance",
      "Micro-genre classification",
      "Automated playlist placement"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Submit to Spotify for Artists as soon as your track is ready",
      "Use specific genre tags that match emerging micro-genres",
      "Monitor your Spotify analytics for AI-driven playlist placements"
    ],
    newsletterContent: `**🎙️ Spotify's AI Playlist Curation Revolution**

Spotify's AI team explains how machine learning is transforming playlist curation. The new system can identify emerging artists and genres before they hit mainstream, creating opportunities for early adopters.

*Why this matters:* Spotify's AI is getting so good at predicting hits that early submission and proper tagging could land you on major playlists before your competition even knows the trend exists.

**Action Item:** Update your Spotify for Artists profile with detailed genre tags and submit your latest track immediately. The AI works best with fresh, properly tagged content.`
  },
  {
    title: "AI-Powered Social Media Content Creation",
    description: "Social media experts discuss how AI tools are revolutionizing content creation for musicians. From automated captions to AI-generated visuals, learn how to scale your social media presence without burning out.",
    publishedAt: "2025-09-05T16:20:00.000Z",
    duration: "41:10",
    url: "https://example.com/episode4",
    aiInsights: [
      "AI can generate 30+ social media posts from one song",
      "Automated caption generation saves 2-3 hours per week",
      "AI visuals are becoming indistinguishable from professional designs"
    ],
    techFeatures: [
      "Automated content generation",
      "Multi-platform optimization",
      "Brand voice consistency"
    ],
    musicIndustryRelevance: "Medium",
    actionableTips: [
      "Use AI to generate multiple post variations for each song",
      "Automate your content calendar with AI tools",
      "Maintain your unique voice while leveraging AI efficiency"
    ],
    newsletterContent: `**🎙️ AI-Powered Social Media Content Creation**

Social media experts discuss how AI tools are revolutionizing content creation for musicians. From automated captions to AI-generated visuals, learn how to scale your social media presence without burning out.

*Why this matters:* Social media is essential for indie artists, but creating consistent content is time-consuming. AI tools can help you maintain a professional presence without the burnout.

**Action Item:** Try using AI to generate 5 different social media posts for your latest song. Test different tones and formats to see what resonates with your audience.`
  },
  {
    title: "The Rise of AI Music Marketing Agencies",
    description: "Music marketing professionals explore how AI is changing the PR and promotion landscape. From automated press releases to AI-powered influencer outreach, discover the tools that are reshaping music marketing.",
    publishedAt: "2025-09-04T11:45:00.000Z",
    duration: "36:25",
    url: "https://example.com/episode5",
    aiInsights: [
      "AI can write press releases 10x faster than humans",
      "Automated influencer outreach has 3x higher response rates",
      "AI-powered analytics predict campaign success with 85% accuracy"
    ],
    techFeatures: [
      "Automated PR writing",
      "Influencer matching algorithms",
      "Predictive campaign analytics"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Use AI to draft press releases and pitch emails",
      "Automate your influencer outreach with personalized messages",
      "Track AI-generated insights to optimize your campaigns"
    ],
    newsletterContent: `**🎙️ The Rise of AI Music Marketing Agencies**

Music marketing professionals explore how AI is changing the PR and promotion landscape. From automated press releases to AI-powered influencer outreach, discover the tools that are reshaping music marketing.

*Why this matters:* Music marketing is becoming more automated and data-driven. Indie artists who embrace AI tools early will have a significant advantage over those still using traditional methods.

**Action Item:** Start using AI to draft your press releases and pitch emails. The quality is now good enough to save you hours while maintaining professionalism.`
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🎙️ Generating demo podcast insights...');
    
    // Filter for high and medium relevance episodes
    const highRelevanceEpisodes = demoEpisodes.filter(ep => ep.musicIndustryRelevance === 'High');
    const mediumRelevanceEpisodes = demoEpisodes.filter(ep => ep.musicIndustryRelevance === 'Medium');
    
    // Generate newsletter content
    const newsletterContent = generatePodcastNewsletterContent(highRelevanceEpisodes, mediumRelevanceEpisodes);
    
    console.log(`✅ Generated demo with ${highRelevanceEpisodes.length} high-relevance episodes, ${mediumRelevanceEpisodes.length} medium-relevance`);
    
    return NextResponse.json({
      success: true,
      message: 'Demo podcast insights generated successfully',
      podcast: {
        title: 'AI & Tech Music Industry Podcasts (Demo)',
        description: 'Curated selection of podcast episodes with AI and technology insights relevant to the music industry',
        totalEpisodes: demoEpisodes.length,
        lastChecked: new Date().toISOString()
      },
      episodes: {
        all: demoEpisodes,
        highRelevance: highRelevanceEpisodes,
        mediumRelevance: mediumRelevanceEpisodes
      },
      newsletterContent,
      stats: {
        totalEpisodes: demoEpisodes.length,
        highRelevance: highRelevanceEpisodes.length,
        mediumRelevance: mediumRelevanceEpisodes.length,
        lowRelevance: 0
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Demo podcast error:', error);
    return NextResponse.json({
      error: 'Failed to generate demo podcast insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generatePodcastNewsletterContent(highRelevance: PodcastEpisode[], mediumRelevance: PodcastEpisode[]): string {
  if (highRelevance.length === 0 && mediumRelevance.length === 0) {
    return '';
  }

  let content = '**🎙️ Podcast Intel: Latest AI & Tech Insights**\n\n';
  
  if (highRelevance.length > 0) {
    content += '**🔥 High-Impact Episodes:**\n\n';
    highRelevance.forEach(episode => {
      content += episode.newsletterContent + '\n\n';
    });
  }

  if (mediumRelevance.length > 0) {
    content += '**📱 Medium-Impact Episodes:**\n\n';
    mediumRelevance.slice(0, 2).forEach(episode => {
      content += `**${episode.title}**\n${episode.description.substring(0, 150)}...\n\n`;
    });
  }

  content += '*Why this matters:* Podcasters are often the first to discover and test new AI features. These insights could give you a competitive edge in music promotion.*\n\n';
  content += '**Action Item:** Listen to the high-impact episodes for detailed insights and practical advice.';

  return content;
}







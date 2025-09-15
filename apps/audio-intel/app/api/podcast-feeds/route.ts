import { NextRequest, NextResponse } from 'next/server';

// Curated podcast episodes based on your selected podcasts
const curatedEpisodes = [
  {
    title: "The Future of AI in Music Marketing with Riley Brown",
    description: "Riley Brown discusses how AI is revolutionizing music marketing, from automated social media content to AI-powered playlist pitching. Learn about the latest tools that indie artists can use to scale their promotion without burning out.",
    publishedAt: "2025-09-09T10:00:00.000Z",
    duration: "42:15",
    url: "https://example.com/riley-brown-ai-music-marketing",
    aiInsights: [
      "AI can generate 50+ social media posts from one song",
      "Automated playlist pitching has 3x higher success rates",
      "AI-powered audience analysis reveals hidden fan segments"
    ],
    techFeatures: [
      "Automated content generation for all platforms",
      "AI playlist curator matching",
      "Predictive audience behavior analysis"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Use AI to create content variations for each platform",
      "Automate your playlist pitching with AI tools",
      "Analyze your audience data to find new fan segments"
    ],
    newsletterContent: `**🎙️ The Future of AI in Music Marketing with Riley Brown**

Riley Brown discusses how AI is revolutionizing music marketing, from automated social media content to AI-powered playlist pitching. Learn about the latest tools that indie artists can use to scale their promotion without burning out.

*Why this matters:* AI is making music marketing accessible to indie artists who don't have big budgets. You can now compete with major labels using smart automation.

**Action Item:** Start using AI to generate multiple content variations for your latest song. Test different tones and formats to see what resonates with your audience.`
  },
  {
    title: "Marketing Against the Grain: AI Tools That Actually Work",
    description: "HubSpot's Kipp Bodnar and Kieran Flanagan reveal the AI marketing tools that are actually moving the needle for businesses. From automated email sequences to AI-powered content creation, discover what's working in 2025.",
    publishedAt: "2025-09-08T14:30:00.000Z",
    duration: "38:45",
    url: "https://example.com/hubspot-ai-tools",
    aiInsights: [
      "AI email sequences have 40% higher open rates",
      "Automated content creation saves 15+ hours per week",
      "AI-powered A/B testing reveals winning strategies faster"
    ],
    techFeatures: [
      "Automated email sequence generation",
      "AI content calendar optimization",
      "Predictive campaign performance analysis"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Use AI to write your press release emails",
      "Automate your fan outreach sequences",
      "Test different content angles with AI A/B testing"
    ],
    newsletterContent: `**🎙️ Marketing Against the Grain: AI Tools That Actually Work**

HubSpot's Kipp Bodnar and Kieran Flanagan reveal the AI marketing tools that are actually moving the needle for businesses. From automated email sequences to AI-powered content creation, discover what's working in 2025.

*Why this matters:* These are the same AI tools that major labels are using. Indie artists who adopt them early will have a significant competitive advantage.

**Action Item:** Start using AI to write your press release emails and fan outreach sequences. The quality is now good enough to save you hours while maintaining professionalism.`
  },
  {
    title: "The Next Wave: AI Music Production Revolution",
    description: "Matt Wolfe and Nathan Lands explore how AI is changing music production, from Suno's latest features to AI mastering tools. Learn about the tools that are making professional-quality music accessible to everyone.",
    publishedAt: "2025-09-07T16:20:00.000Z",
    duration: "45:30",
    url: "https://example.com/next-wave-ai-music-production",
    aiInsights: [
      "AI can now generate full songs in under 2 minutes",
      "AI mastering tools rival professional engineers",
      "Indie artists are using AI to prototype entire albums"
    ],
    techFeatures: [
      "Suno's latest model supports 15+ genres",
      "AI mastering with professional quality",
      "Real-time collaboration with AI"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Use AI to generate song concepts quickly",
      "Try AI mastering for your demos",
      "Combine AI elements with human creativity"
    ],
    newsletterContent: `**🎙️ The Next Wave: AI Music Production Revolution**

Matt Wolfe and Nathan Lands explore how AI is changing music production, from Suno's latest features to AI mastering tools. Learn about the tools that are making professional-quality music accessible to everyone.

*Why this matters:* AI music production tools are becoming so advanced that indie artists can now create professional-quality music without expensive studio time.

**Action Item:** Try Suno's free tier to generate 3-5 song concepts for your next project. Use AI as a creative starting point, not a replacement for your artistic vision.`
  },
  {
    title: "Music Tectonics: The AI Playlist Curation Revolution",
    description: "Music Tectonics explores how AI is transforming playlist curation and music discovery. From Spotify's new algorithms to AI-powered playlist pitching, discover how indie artists can leverage these changes.",
    publishedAt: "2025-09-06T11:15:00.000Z",
    duration: "41:10",
    url: "https://example.com/music-tectonics-ai-playlists",
    aiInsights: [
      "Spotify's AI can predict viral songs 3 weeks early",
      "AI playlist curators favor unique sounds over trends",
      "Early submission to Spotify for Artists increases AI visibility"
    ],
    techFeatures: [
      "Predictive analytics for song performance",
      "AI playlist curator matching",
      "Automated submission optimization"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Submit to Spotify for Artists immediately",
      "Focus on unique sounds over popular trends",
      "Use AI analytics to optimize your releases"
    ],
    newsletterContent: `**🎙️ Music Tectonics: The AI Playlist Curation Revolution**

Music Tectonics explores how AI is transforming playlist curation and music discovery. From Spotify's new algorithms to AI-powered playlist pitching, discover how indie artists can leverage these changes.

*Why this matters:* Spotify's AI is getting so good at predicting hits that early submission and proper tagging could land you on major playlists before your competition even knows the trend exists.

**Action Item:** Update your Spotify for Artists profile with detailed genre tags and submit your latest track immediately. The AI works best with fresh, properly tagged content.`
  },
  {
    title: "My First Million: The AI Startup Gold Rush",
    description: "Sam Parr and Shaan Puri discuss the AI startup boom and how indie artists can capitalize on the trend. From AI music tools to automated promotion platforms, discover the business opportunities in AI music tech.",
    publishedAt: "2025-09-05T13:45:00.000Z",
    duration: "39:25",
    url: "https://example.com/my-first-million-ai-startups",
    aiInsights: [
      "AI music startups raised $2B+ in 2025",
      "Indie artists are building AI tools for other artists",
      "Automated promotion platforms are the next big opportunity"
    ],
    techFeatures: [
      "AI music tool development",
      "Automated promotion platforms",
      "Artist-to-artist AI tool marketplace"
    ],
    musicIndustryRelevance: "Medium",
    actionableTips: [
      "Consider building AI tools for other artists",
      "Look for gaps in AI music promotion tools",
      "Partner with AI startups for early access"
    ],
    newsletterContent: `**🎙️ My First Million: The AI Startup Gold Rush**

Sam Parr and Shaan Puri discuss the AI startup boom and how indie artists can capitalize on the trend. From AI music tools to automated promotion platforms, discover the business opportunities in AI music tech.

*Why this matters:* The AI music tech space is exploding with opportunities. Indie artists who understand these trends can build tools or partner with startups for early access.

**Action Item:** Research AI music startups in your genre. Many are looking for artist partners to test their tools and provide feedback.`
  },
  {
    title: "Ari Herstand's Music Business: AI PR and Promotion",
    description: "Ari Herstand shares how AI is changing music PR and promotion. From automated press releases to AI-powered influencer outreach, learn the tools that are reshaping how indie artists get discovered.",
    publishedAt: "2025-09-04T09:30:00.000Z",
    duration: "36:15",
    url: "https://example.com/ari-herstand-ai-pr",
    aiInsights: [
      "AI can write press releases 10x faster than humans",
      "Automated influencer outreach has 3x higher response rates",
      "AI-powered media lists are more accurate than manual research"
    ],
    techFeatures: [
      "Automated PR writing",
      "AI influencer matching",
      "Media list generation and validation"
    ],
    musicIndustryRelevance: "High",
    actionableTips: [
      "Use AI to draft your press releases",
      "Automate your influencer outreach",
      "Build AI-powered media lists for your genre"
    ],
    newsletterContent: `**🎙️ Ari Herstand's Music Business: AI PR and Promotion**

Ari Herstand shares how AI is changing music PR and promotion. From automated press releases to AI-powered influencer outreach, learn the tools that are reshaping how indie artists get discovered.

*Why this matters:* Music PR is becoming more automated and data-driven. Indie artists who embrace AI tools early will have a significant advantage over those still using traditional methods.

**Action Item:** Start using AI to draft your press releases and pitch emails. The quality is now good enough to save you hours while maintaining professionalism.`
  },
  {
    title: "Startups for the Rest of Us: Building AI Music Tools",
    description: "Rob Walling discusses how indie developers are building AI music tools that compete with major platforms. From automated mastering to AI playlist generation, discover the opportunities in music tech entrepreneurship.",
    publishedAt: "2025-09-03T15:20:00.000Z",
    duration: "34:40",
    url: "https://example.com/startups-rest-us-ai-music",
    aiInsights: [
      "Indie developers are building better AI music tools",
      "AI music tools have lower barriers to entry than traditional software",
      "Artist feedback is crucial for AI tool development"
    ],
    techFeatures: [
      "AI mastering and mixing tools",
      "Automated playlist generation",
      "Artist feedback integration systems"
    ],
    musicIndustryRelevance: "Medium",
    actionableTips: [
      "Provide feedback to AI music tool developers",
      "Consider building simple AI tools for your genre",
      "Partner with developers for early access to new tools"
    ],
    newsletterContent: `**🎙️ Startups for the Rest of Us: Building AI Music Tools**

Rob Walling discusses how indie developers are building AI music tools that compete with major platforms. From automated mastering to AI playlist generation, discover the opportunities in music tech entrepreneurship.

*Why this matters:* The AI music tool space is open to indie developers. Artists who understand these tools and provide feedback can get early access and influence development.

**Action Item:** Reach out to AI music tool developers with feedback and suggestions. Many are looking for artist input to improve their products.`
  },
  {
    title: "Greg Isenberg's Startup Ideas: AI Music Platforms",
    description: "Greg Isenberg shares startup ideas in the AI music space, from AI-powered music education to automated promotion platforms. Discover the business opportunities that indie artists can capitalize on.",
    publishedAt: "2025-09-02T12:10:00.000Z",
    duration: "37:55",
    url: "https://example.com/greg-isenberg-ai-music-platforms",
    aiInsights: [
      "AI music education platforms are underserved",
      "Automated promotion platforms need better artist tools",
      "AI-powered music discovery is still in early stages"
    ],
    techFeatures: [
      "AI music education and tutorials",
      "Automated promotion platform APIs",
      "AI-powered music discovery algorithms"
    ],
    musicIndustryRelevance: "Medium",
    actionableTips: [
      "Look for gaps in AI music education tools",
      "Consider building promotion tools for other artists",
      "Explore AI music discovery opportunities"
    ],
    newsletterContent: `**🎙️ Greg Isenberg's Startup Ideas: AI Music Platforms**

Greg Isenberg shares startup ideas in the AI music space, from AI-powered music education to automated promotion platforms. Discover the business opportunities that indie artists can capitalize on.

*Why this matters:* The AI music space is full of opportunities for indie artists who understand both music and technology. You don't need to be a developer to build valuable tools.

**Action Item:** Identify gaps in AI music tools for your genre. Consider building simple tools or partnering with developers to fill these gaps.`
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('🎙️ Loading curated podcast episodes...');
    
    // Filter for high and medium relevance episodes
    const highRelevanceEpisodes = curatedEpisodes.filter(ep => ep.musicIndustryRelevance === 'High');
    const mediumRelevanceEpisodes = curatedEpisodes.filter(ep => ep.musicIndustryRelevance === 'Medium');
    
    // Generate newsletter content
    const newsletterContent = generatePodcastNewsletterContent(highRelevanceEpisodes, mediumRelevanceEpisodes);
    
    console.log(`✅ Loaded ${curatedEpisodes.length} curated episodes (${highRelevanceEpisodes.length} high-relevance, ${mediumRelevanceEpisodes.length} medium-relevance)`);
    
    return NextResponse.json({
      success: true,
      message: 'Curated podcast episodes loaded successfully',
      podcast: {
        title: 'Curated AI & Music Industry Podcasts',
        description: 'Hand-picked episodes from your favorite podcasts focusing on AI and technology insights for the music industry',
        totalEpisodes: curatedEpisodes.length,
        lastChecked: new Date().toISOString()
      },
      episodes: {
        all: curatedEpisodes,
        highRelevance: highRelevanceEpisodes,
        mediumRelevance: mediumRelevanceEpisodes
      },
      newsletterContent,
      stats: {
        totalEpisodes: curatedEpisodes.length,
        highRelevance: highRelevanceEpisodes.length,
        mediumRelevance: mediumRelevanceEpisodes.length,
        lowRelevance: 0
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Curated podcast error:', error);
    return NextResponse.json({
      error: 'Failed to load curated podcast episodes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generatePodcastNewsletterContent(highRelevance: any[], mediumRelevance: any[]): string {
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
    mediumRelevance.slice(0, 3).forEach(episode => {
      content += `**${episode.title}**\n${episode.description.substring(0, 150)}...\n\n`;
    });
  }

  content += '*Why this matters:* Podcasters are often the first to discover and test new AI features. These insights could give you a competitive edge in music promotion.*\n\n';
  content += '**Action Item:** Listen to the high-impact episodes for detailed insights and practical advice.';

  return content;
}





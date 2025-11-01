import { NextRequest, NextResponse } from 'next/server';

interface AudioSEOAnalysis {
  domain: string;
  keywords: string[];
  questions: string[];
  longTail: string[];
  suggestions: string[];
  summary: {
    totalKeywords: number;
    totalQuestions: number;
    totalLongTail: number;
    totalSuggestions: number;
  };
  audioSpecific: {
    musicKeywords: string[];
    podcastKeywords: string[];
    audioKeywords: string[];
  };
}

// Audio-specific keyword categories
const AUDIO_KEYWORDS = {
  music: [
    'music promotion',
    'music marketing',
    'music distribution',
    'music licensing',
    'music streaming',
    'music publishing',
    'music production',
    'music recording',
    'music mastering',
    'music mixing',
    'music composition',
    'music arrangement',
    'music performance',
    'music collaboration',
    'music networking',
    'music industry',
  ],
  podcast: [
    'podcast SEO',
    'podcast marketing',
    'podcast hosting',
    'podcast distribution',
    'podcast promotion',
    'podcast analytics',
    'podcast monetization',
    'podcast equipment',
    'podcast editing',
    'podcast recording',
    'podcast interviews',
    'podcast branding',
    'podcast audience',
    'podcast growth',
    'podcast sponsors',
    'podcast networking',
  ],
  audio: [
    'audio content',
    'audio production',
    'audio editing',
    'audio mastering',
    'audio equipment',
    'audio software',
    'audio engineering',
    'audio design',
    'audio branding',
    'audio marketing',
    'audio streaming',
    'audio quality',
    'audio optimization',
    'audio compression',
    'audio formats',
    'audio services',
  ],
};

async function getGoogleSuggestions(query: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data[1] || [];
  } catch (error) {
    console.error('Google suggestions failed:', error);
    return [];
  }
}

async function getQuestionKeywords(keyword: string): Promise<string[]> {
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'which', 'who'];
  const questions: string[] = [];

  for (const questionWord of questionWords) {
    try {
      const response = await fetch(
        `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(`${questionWord} ${keyword}`)}`
      );
      const data = await response.json();
      const suggestions = data[1] || [];
      questions.push(...suggestions.slice(0, 2));
    } catch (error) {
      console.error(`Failed to get suggestions for "${questionWord} ${keyword}"`);
    }
  }

  return questions;
}

function generateLongTailVariations(keyword: string): string[] {
  const modifiers = [
    'best',
    'top',
    'guide',
    'review',
    '2024',
    'free',
    'online',
    'services',
    'companies',
    'software',
    'tools',
    'platforms',
    'solutions',
    'experts',
    'professional',
    'premium',
    'affordable',
    'reliable',
    'trusted',
  ];

  const variations: string[] = [];

  for (const modifier of modifiers) {
    variations.push(`${keyword} ${modifier}`);
    variations.push(`${modifier} ${keyword}`);
  }

  return variations;
}

function getAudioSpecificKeywords(domain: string): {
  musicKeywords: string[];
  podcastKeywords: string[];
  audioKeywords: string[];
} {
  // Analyze domain to determine focus
  const domainLower = domain.toLowerCase();

  let musicKeywords: string[] = [];
  let podcastKeywords: string[] = [];
  let audioKeywords: string[] = [];

  if (
    domainLower.includes('music') ||
    domainLower.includes('song') ||
    domainLower.includes('artist')
  ) {
    musicKeywords = AUDIO_KEYWORDS.music.slice(0, 8);
  }

  if (
    domainLower.includes('podcast') ||
    domainLower.includes('episode') ||
    domainLower.includes('show')
  ) {
    podcastKeywords = AUDIO_KEYWORDS.podcast.slice(0, 8);
  }

  if (
    domainLower.includes('audio') ||
    domainLower.includes('sound') ||
    domainLower.includes('recording')
  ) {
    audioKeywords = AUDIO_KEYWORDS.audio.slice(0, 8);
  }

  // If no specific category detected, provide a mix
  if (musicKeywords.length === 0 && podcastKeywords.length === 0 && audioKeywords.length === 0) {
    musicKeywords = AUDIO_KEYWORDS.music.slice(0, 6);
    podcastKeywords = AUDIO_KEYWORDS.podcast.slice(0, 6);
    audioKeywords = AUDIO_KEYWORDS.audio.slice(0, 6);
  }

  return { musicKeywords, podcastKeywords, audioKeywords };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        {
          success: false,
          error: 'Domain parameter is required',
        },
        { status: 400 }
      );
    }

    // Clean domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Get basic suggestions
    const suggestions = await getGoogleSuggestions(cleanDomain);

    // Get question-based keywords
    const questions = await getQuestionKeywords(cleanDomain);

    // Generate long-tail variations
    const longTail = generateLongTailVariations(cleanDomain);

    // Get audio-specific keywords
    const audioSpecific = getAudioSpecificKeywords(cleanDomain);

    // Combine all keywords
    const allKeywords = [
      cleanDomain,
      ...suggestions,
      ...questions,
      ...longTail,
      ...audioSpecific.musicKeywords,
      ...audioSpecific.podcastKeywords,
      ...audioSpecific.audioKeywords,
    ];

    // Remove duplicates and limit
    const uniqueKeywords = [...new Set(allKeywords)].slice(0, 50);

    const analysis: AudioSEOAnalysis = {
      domain: cleanDomain,
      keywords: uniqueKeywords,
      questions: questions.slice(0, 10),
      longTail: longTail.slice(0, 15),
      suggestions: suggestions.slice(0, 10),
      summary: {
        totalKeywords: uniqueKeywords.length,
        totalQuestions: questions.length,
        totalLongTail: longTail.length,
        totalSuggestions: suggestions.length,
      },
      audioSpecific,
    };

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('SEO analysis failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze domain',
      },
      { status: 500 }
    );
  }
}

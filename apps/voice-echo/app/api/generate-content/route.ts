import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { musicContext, platforms, contentType, voiceProfile } = body

    // Validate required fields
    if (!musicContext || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: musicContext and platforms' },
        { status: 400 }
      )
    }

    // Mock Claude API integration
    // In production, this would call the actual Claude API with the voice profile
    const mockContent = {
      twitter: generateTwitterContent(musicContext, contentType),
      instagram: generateInstagramContent(musicContext, contentType),
      threads: generateThreadsContent(musicContext, contentType),
      tiktok: generateTikTokContent(musicContext, contentType)
    }

    const mockScores = {
      twitter: { authenticity: 95, engagement: 88 },
      instagram: { authenticity: 92, engagement: 91 },
      threads: { authenticity: 97, engagement: 85 },
      tiktok: { authenticity: 89, engagement: 94 }
    }

    // Filter content for requested platforms
    const filteredContent: {[key: string]: string} = {}
    const filteredScores: {[key: string]: {authenticity: number, engagement: number}} = {}

    platforms.forEach((platform: string) => {
      if (mockContent[platform as keyof typeof mockContent]) {
        filteredContent[platform] = mockContent[platform as keyof typeof mockContent]
        filteredScores[platform] = mockScores[platform as keyof typeof mockScores]
      }
    })

    return NextResponse.json({
      content: filteredContent,
      scores: filteredScores,
      success: true
    })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

// Mock content generation functions
function generateTwitterContent(context: string, type: string): string {
  const baseContent = context.toLowerCase()
  
  if (baseContent.includes('release') || baseContent.includes('drop') || baseContent.includes('new')) {
    return "🔥 Just dropped my new track! Been working on this for months and finally ready to share it with you all. Link in bio 👆 #NewMusic #UKArtist"
  } else if (baseContent.includes('show') || baseContent.includes('gig') || baseContent.includes('tour')) {
    return "🎤 Playing a show tonight! Can't wait to see you all there. Tickets still available, link in bio 👆 #LiveMusic #Gig"
  } else if (baseContent.includes('studio') || baseContent.includes('recording')) {
    return "🎵 Back in the studio working on new music! This one's going to be special. Can't wait to share what we're cooking up 🔥"
  } else {
    return "🎵 Big news coming soon! Been working hard on something special and can't wait to share it with you all. Stay tuned 👆"
  }
}

function generateInstagramContent(context: string, type: string): string {
  const baseContent = context.toLowerCase()
  
  if (baseContent.includes('release') || baseContent.includes('drop') || baseContent.includes('new')) {
    return "Behind the scenes of my new track 🎵 This one's been brewing for months and I'm so excited to finally share it with you all! Link in bio for the full story 👆"
  } else if (baseContent.includes('show') || baseContent.includes('gig') || baseContent.includes('tour')) {
    return "Getting ready for tonight's show! 🎤 The energy is going to be incredible. Can't wait to see you all there. Tickets still available, link in bio 👆"
  } else if (baseContent.includes('studio') || baseContent.includes('recording')) {
    return "Studio session today was 🔥 Can't wait to share what we're cooking up. New music coming soon! 🎵"
  } else {
    return "Big things coming! 🎵 Been working on something special and can't wait to share it with you all. Stay tuned for the announcement 👆"
  }
}

function generateThreadsContent(context: string, type: string): string {
  const baseContent = context.toLowerCase()
  
  if (baseContent.includes('release') || baseContent.includes('drop') || baseContent.includes('new')) {
    return "Just dropped my new track! Been working on this for months and finally ready to share it with you all. Link in bio 👆"
  } else if (baseContent.includes('show') || baseContent.includes('gig') || baseContent.includes('tour')) {
    return "Playing a show tonight! Can't wait to see you all there. Tickets still available, link in bio 👆"
  } else if (baseContent.includes('studio') || baseContent.includes('recording')) {
    return "Back in the studio working on new music! This one's going to be special. Can't wait to share what we're cooking up 🔥"
  } else {
    return "Big news coming soon! Been working hard on something special and can't wait to share it with you all. Stay tuned 👆"
  }
}

function generateTikTokContent(context: string, type: string): string {
  const baseContent = context.toLowerCase()
  
  if (baseContent.includes('release') || baseContent.includes('drop') || baseContent.includes('new')) {
    return "New track just dropped! 🔥 Been working on this for months 🎵 Link in bio 👆"
  } else if (baseContent.includes('show') || baseContent.includes('gig') || baseContent.includes('tour')) {
    return "Playing a show tonight! 🎤 Can't wait to see you all there 🔥 Tickets in bio 👆"
  } else if (baseContent.includes('studio') || baseContent.includes('recording')) {
    return "Studio session today was 🔥 New music coming soon! 🎵"
  } else {
    return "Big news coming soon! 🔥 Been working on something special 🎵 Stay tuned 👆"
  }
} 
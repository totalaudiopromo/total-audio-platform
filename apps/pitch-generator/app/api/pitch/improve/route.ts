import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { pitchBody, suggestions, weaknesses, toneAnalysis } = await request.json();

    if (!pitchBody) {
      return NextResponse.json(
        { error: 'Pitch body is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key') {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Add ANTHROPIC_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const improvementPrompt = `You are an expert music PR consultant who has pitched to thousands of radio stations, blogs, and playlists.

I need you to improve this music PR pitch based on the analysis feedback provided.

ORIGINAL PITCH:
${pitchBody}

WEAKNESSES IDENTIFIED:
${weaknesses.map((w: string) => `- ${w}`).join('\n')}

SUGGESTIONS FOR IMPROVEMENT:
${suggestions.map((s: string) => `- ${s}`).join('\n')}

TONE ANALYSIS:
- Formality: ${toneAnalysis.formality}
- Enthusiasm: ${toneAnalysis.enthusiasm}
- Personalisation: ${toneAnalysis.personalisation}

Please rewrite this pitch to address ALL the weaknesses and implement ALL the suggestions while:
1. Maintaining the same core information (artist, track, key details)
2. Keeping it genuine and authentic (no corporate speak)
3. Making it the optimal length (not too long, not too short)
4. Ensuring the tone is professional but warm
5. Adding more personalisation where appropriate
6. Making the call to action clear and specific

Return ONLY the improved pitch text, with no additional commentary or explanation. The output should be ready to copy-paste into an email.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: improvementPrompt,
        },
      ],
    });

    // Extract the improved pitch from Claude's response
    const improvedPitch = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ improvedPitch });

  } catch (error: any) {
    console.error('Pitch improvement error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to improve pitch' },
      { status: 500 }
    );
  }
}

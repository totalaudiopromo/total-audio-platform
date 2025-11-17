import { NextResponse } from 'next/server';
import { getSupabaseSession } from '@total-audio/core-db/server'; // MIGRATED;
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getSupabaseSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { sampleText, analysisType } = await req.json();

    if (!sampleText || sampleText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide at least 50 characters of text to analyze' },
        { status: 400 }
      );
    }

    // Use Claude to analyze the writing sample
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.3,
      system: `You are VoiceGuard™, an expert AI system for analyzing writing styles of music industry professionals.
You analyze pitch emails, promotional copy, and professional communication to extract the writer's authentic voice.
VoiceGuard™ focuses on: tone, formality level, sentence structure, opening patterns, credibility markers, and personality preservation.`,
      messages: [
        {
          role: 'user',
          content: `Analyze this music industry pitch/email using VoiceGuard™ voice preservation technology.

SAMPLE TEXT:
${sampleText}

VoiceGuard™ will extract and provide ONLY a JSON object with these exact fields (no markdown, no code blocks):
{
  "voice_background": "Brief summary of their apparent background/experience (1-2 sentences)",
  "voice_style": "Description of their writing style (e.g., 'Direct but friendly', 'Professional with personality')",
  "voice_achievements": "Any achievements or credibility markers mentioned",
  "voice_approach": "Their approach to pitching/communication",
  "voice_differentiator": "What makes their voice unique or distinctive",
  "voice_typical_opener": "Example of how they typically open communications",
  "tone_preference": "casual, professional, or enthusiastic",
  "formality_score": 1-10 (1=very casual, 10=very formal),
  "personality_traits": ["trait1", "trait2", "trait3"],
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Be specific and extract actual patterns from the text provided.`,
        },
      ],
    });

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse the JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      return NextResponse.json(
        { error: 'Failed to parse voice analysis. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: {
        voice_background: analysis.voice_background || '',
        voice_style: analysis.voice_style || '',
        voice_achievements: analysis.voice_achievements || '',
        voice_approach: analysis.voice_approach || '',
        voice_differentiator: analysis.voice_differentiator || '',
        voice_typical_opener: analysis.voice_typical_opener || '',
        metadata: {
          tone_preference: analysis.tone_preference || 'professional',
          formality_score: analysis.formality_score || 5,
          personality_traits: analysis.personality_traits || [],
          strengths: analysis.strengths || [],
          suggestions: analysis.suggestions || [],
        },
      },
    });
  } catch (error: any) {
    console.error('Voice analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze voice' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getUserFromRequest,
  getCorsHeaders,
  corsOptionsResponse,
  successResponse,
  unauthorized,
  validationError,
  internalError,
} from '@total-audio/core-db';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AnalysisResult {
  score: number; // 0-100
  grade: 'excellent' | 'good' | 'needs_work' | 'poor';
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  toneAnalysis: {
    formality: 'too_formal' | 'professional' | 'casual' | 'too_casual';
    enthusiasm: 'high' | 'moderate' | 'low';
    personalisation: 'high' | 'moderate' | 'low';
  };
  lengthAnalysis: {
    wordCount: number;
    isOptimal: boolean;
    recommendation: string;
  };
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return corsOptionsResponse(req.headers.get('origin'));
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request.headers.get('origin'));

  try {
    // Use unified auth (supports API keys and sessions)
    const auth = await getUserFromRequest(request);
    if (!auth.success) {
      return unauthorized(auth.error.message, corsHeaders);
    }

    const { pitchBody, subjectLine, contactType } = await request.json();

    if (!pitchBody) {
      return validationError('Pitch body is required', undefined, corsHeaders);
    }

    // Check if API key is configured
    if (
      !process.env.ANTHROPIC_API_KEY ||
      process.env.ANTHROPIC_API_KEY === 'your-anthropic-api-key'
    ) {
      return internalError(
        'Anthropic API key not configured. Add ANTHROPIC_API_KEY to .env.local',
        corsHeaders
      );
    }

    const analysisPrompt = `You are an expert music PR consultant who has pitched to thousands of radio stations, blogs, and playlists.

Analyse this music PR pitch and provide detailed feedback:

SUBJECT LINE: ${subjectLine || 'No subject line'}
CONTACT TYPE: ${contactType || 'General'}

PITCH:
${pitchBody}

Provide your analysis in the following JSON format:
{
  "score": <number 0-100>,
  "grade": "<excellent|good|needs_work|poor>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "suggestions": ["<specific actionable suggestion 1>", "<specific actionable suggestion 2>", ...],
  "toneAnalysis": {
    "formality": "<too_formal|professional|casual|too_casual>",
    "enthusiasm": "<high|moderate|low>",
    "personalisation": "<high|moderate|low>"
  },
  "lengthAnalysis": {
    "wordCount": <number>,
    "isOptimal": <boolean>,
    "recommendation": "<specific length recommendation>"
  }
}

Scoring guide:
- 90-100: Excellent - Ready to send, high probability of response
- 75-89: Good - Minor improvements could help
- 60-74: Needs work - Several improvements needed
- Below 60: Poor - Major revision required

Focus on:
1. Personalisation (does it feel tailored to this specific contact?)
2. Clarity (is the ask clear and concise?)
3. Tone (appropriate for music industry?)
4. Length (too long = ignored, too short = lazy)
5. Subject line effectiveness
6. Call to action (clear next steps?)

Be honest but constructive. Provide specific, actionable suggestions.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
    });

    // Extract the JSON from Claude's response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    let analysis: AnalysisResult;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch =
        responseText.match(/```json\n(.*?)\n```/s) || responseText.match(/```\n(.*?)\n```/s);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      throw new Error('Failed to parse analysis response');
    }

    return successResponse({ analysis }, undefined, 200, corsHeaders);
  } catch (error: unknown) {
    console.error('Pitch analysis error:', error);
    const message = error instanceof Error ? error.message : 'Failed to analyse pitch';
    return internalError(message, corsHeaders);
  }
}

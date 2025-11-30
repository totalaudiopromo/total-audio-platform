import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { SkillResult, SkillContext } from '../../src/types';

// Input validation schema
const PitchVariationInput = z.object({
  artistName: z.string().min(1, 'Artist name is required'),
  trackTitle: z.string().min(1, 'Track title is required'),
  genre: z.string().optional(),
  targetContactType: z.enum(['radio', 'playlist', 'press', 'blog']).default('radio'),
  variationType: z.enum(['formal', 'casual', 'concise', 'detailed', 'follow-up']).default('formal'),
  contextInfo: z.string().optional(),
  streamingLinks: z.object({
    spotify: z.string().url().optional(),
    apple: z.string().url().optional(),
    bandcamp: z.string().url().optional(),
    soundcloud: z.string().url().optional(),
  }).optional(),
  previousCoverage: z.array(z.string()).optional(),
});

type PitchVariationInputType = z.infer<typeof PitchVariationInput>;

interface PitchVariationOutput {
  subjectLine: string;
  body: string;
  variationType: string;
  generatedBy: string;
}

/**
 * Generate pitch variation using Claude AI
 */
export async function run(
  input: PitchVariationInputType,
  context: SkillContext
): Promise<SkillResult<PitchVariationOutput>> {
  const startTime = Date.now();

  try {
    // Validate input
    const validatedInput = PitchVariationInput.parse(input);

    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: 'ANTHROPIC_API_KEY not configured',
        metadata: {
          duration: Date.now() - startTime,
        },
      };
    }

    const anthropic = new Anthropic({ apiKey });

    // Build context-aware prompt
    const prompt = buildPitchPrompt(validatedInput);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the response to extract subject and body
    const { subjectLine, body } = parsePitchResponse(content.text);

    const result: PitchVariationOutput = {
      subjectLine,
      body,
      variationType: validatedInput.variationType,
      generatedBy: 'claude-3-5-sonnet-20241022',
    };

    return {
      success: true,
      data: result,
      metadata: {
        duration: Date.now() - startTime,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
        model: 'claude-3-5-sonnet-20241022',
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Pitch generation failed',
      metadata: {
        duration: Date.now() - startTime,
      },
    };
  }
}

/**
 * Build context-aware prompt for pitch generation
 */
function buildPitchPrompt(input: PitchVariationInputType): string {
  const {
    artistName,
    trackTitle,
    genre,
    targetContactType,
    variationType,
    contextInfo,
    streamingLinks,
    previousCoverage,
  } = input;

  let prompt = `You are an expert music PR professional crafting a pitch email for ${artistName}'s track "${trackTitle}".

**Target**: ${targetContactType} (${variationType} tone)
${genre ? `**Genre**: ${genre}` : ''}

`;

  if (contextInfo) {
    prompt += `**Context**: ${contextInfo}\n\n`;
  }

  if (streamingLinks && Object.keys(streamingLinks).length > 0) {
    prompt += `**Streaming Links**:\n`;
    Object.entries(streamingLinks).forEach(([platform, url]) => {
      if (url) prompt += `- ${platform}: ${url}\n`;
    });
    prompt += '\n';
  }

  if (previousCoverage && previousCoverage.length > 0) {
    prompt += `**Previous Coverage**: ${previousCoverage.join(', ')}\n\n`;
  }

  // Variation-specific instructions
  const variationInstructions = {
    formal: 'Write a professional, respectful pitch. Use formal language, proper structure, and industry terminology. Focus on credentials and achievements.',
    casual: 'Write a friendly, conversational pitch. Sound like a real person, not a press release. Be genuine and relatable while staying professional.',
    concise: 'Write a brief, punchy pitch. Get straight to the point. Maximum 3 short paragraphs. No fluff.',
    detailed: 'Write a comprehensive pitch with full context. Include background, genre influences, production details, and career highlights. Paint the full picture.',
    'follow-up': 'Write a polite follow-up email. Reference the original pitch, add new information or urgency, and make it easy for them to respond.',
  };

  prompt += `**Style Guide**: ${variationInstructions[variationType]}\n\n`;

  prompt += `**Important**:
- UK English spelling (organised, realise, etc.)
- Authentic music industry voice - no corporate speak
- No excessive emojis or exclamation marks
- Include specific details, not generic praise
- Make it sound like it comes from someone who actually knows the music industry

**Output Format**:
SUBJECT: [subject line]

BODY:
[email body]

Generate the pitch now:`;

  return prompt;
}

/**
 * Parse Claude's response to extract subject and body
 */
function parsePitchResponse(text: string): { subjectLine: string; body: string } {
  const lines = text.split('\n');

  let subjectLine = '';
  let body = '';
  let inBody = false;

  for (const line of lines) {
    if (line.startsWith('SUBJECT:')) {
      subjectLine = line.replace('SUBJECT:', '').trim();
    } else if (line.startsWith('BODY:')) {
      inBody = true;
    } else if (inBody) {
      body += line + '\n';
    }
  }

  // Fallback: if parsing failed, treat entire response as body
  if (!subjectLine || !body) {
    const firstLine = lines.find(l => l.trim().length > 0) || '';
    return {
      subjectLine: firstLine.slice(0, 100),
      body: text,
    };
  }

  return {
    subjectLine: subjectLine.trim(),
    body: body.trim(),
  };
}

/**
 * Validate input before running
 */
export function validate(input: any): boolean {
  try {
    PitchVariationInput.parse(input);
    return true;
  } catch {
    return false;
  }
}

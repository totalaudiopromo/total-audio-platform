/**
 * CoachOS AI Engine
 * AI-powered coaching recommendations using Anthropic Claude
 *
 * IMPORTANT: This engine provides GUIDANCE ONLY
 * It MUST NOT:
 * - Send emails
 * - Modify segments
 * - Alter campaigns
 * - Run PR automations
 * - Perform any automated actions
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  CoachContext,
  CoachInsight,
  AIGenerationOptions,
  WeeklyRecommendationsInput,
  CareerInsightsInput,
} from './types';
import { logger } from './utils/logger';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 0.7;

/**
 * Generate weekly recommendations based on context
 */
export async function generateWeeklyRecommendations(
  input: WeeklyRecommendationsInput
): Promise<{
  tasks: any[];
  insights: CoachInsight[];
  focusTheme: string;
  estimatedHours: number;
}> {
  try {
    logger.info('Generating weekly recommendations', {
      userId: input.context.userId,
    });

    const prompt = buildWeeklyRecommendationsPrompt(input);

    const message = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = extractTextContent(message);
    const parsed = parseWeeklyRecommendations(response);

    logger.info('Generated weekly recommendations', {
      userId: input.context.userId,
      taskCount: parsed.tasks.length,
    });

    return parsed;
  } catch (error) {
    logger.error('Failed to generate weekly recommendations', error);
    throw error;
  }
}

/**
 * Generate career insights based on context and progress
 */
export async function generateCareerInsights(
  input: CareerInsightsInput
): Promise<CoachInsight[]> {
  try {
    logger.info('Generating career insights', {
      userId: input.context.userId,
    });

    const prompt = buildCareerInsightsPrompt(input);

    const message = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = extractTextContent(message);
    const insights = parseInsights(response, 'career');

    logger.info('Generated career insights', {
      userId: input.context.userId,
      insightCount: insights.length,
    });

    return insights;
  } catch (error) {
    logger.error('Failed to generate career insights', error);
    throw error;
  }
}

/**
 * Generate branding insights
 */
export async function generateBrandingInsights(
  context: CoachContext
): Promise<CoachInsight[]> {
  try {
    logger.info('Generating branding insights', {
      userId: context.userId,
    });

    const prompt = buildBrandingInsightsPrompt(context);

    const message = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = extractTextContent(message);
    const insights = parseInsights(response, 'branding');

    return insights;
  } catch (error) {
    logger.error('Failed to generate branding insights', error);
    throw error;
  }
}

/**
 * Generate creative insights from CMG data
 */
export async function generateCreativeInsights(
  context: CoachContext
): Promise<CoachInsight[]> {
  try {
    logger.info('Generating creative insights', {
      userId: context.userId,
    });

    if (!context.cmgContext) {
      logger.warn('No CMG context available for creative insights');
      return [];
    }

    const prompt = buildCreativeInsightsPrompt(context);

    const message = await anthropic.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: DEFAULT_MAX_TOKENS,
      temperature: 0.8, // Higher creativity for creative insights
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = extractTextContent(message);
    const insights = parseInsights(response, 'creative');

    return insights;
  } catch (error) {
    logger.error('Failed to generate creative insights', error);
    throw error;
  }
}

/**
 * Generate focus area distribution based on context
 */
export async function generateFocusAreaDistribution(
  context: CoachContext
): Promise<{
  creative_growth: number;
  promotional_understanding: number;
  relationship_building: number;
  career_skill: number;
  wellbeing: number;
}> {
  try {
    const { coachProfile } = context;

    // Base distribution based on experience level
    let distribution = {
      creative_growth: 30,
      promotional_understanding: 25,
      relationship_building: 20,
      career_skill: 15,
      wellbeing: 10,
    };

    // Adjust based on experience level
    if (coachProfile.experience_level === 'beginner') {
      distribution = {
        creative_growth: 40,
        promotional_understanding: 20,
        relationship_building: 15,
        career_skill: 15,
        wellbeing: 10,
      };
    } else if (coachProfile.experience_level === 'advanced') {
      distribution = {
        creative_growth: 25,
        promotional_understanding: 25,
        relationship_building: 25,
        career_skill: 15,
        wellbeing: 10,
      };
    }

    // Adjust based on role
    if (coachProfile.role === 'pr_agency') {
      distribution = {
        creative_growth: 15,
        promotional_understanding: 35,
        relationship_building: 30,
        career_skill: 15,
        wellbeing: 5,
      };
    } else if (coachProfile.role === 'manager') {
      distribution = {
        creative_growth: 10,
        promotional_understanding: 25,
        relationship_building: 35,
        career_skill: 25,
        wellbeing: 5,
      };
    }

    return distribution;
  } catch (error) {
    logger.error('Failed to generate focus area distribution', error);
    throw error;
  }
}

// ============================================================================
// PROMPT BUILDERS
// ============================================================================

function buildWeeklyRecommendationsPrompt(input: WeeklyRecommendationsInput): string {
  const { context, existingGoals, lastWeekProgress } = input;

  return `You are CoachOS, an intelligent coaching assistant for ${context.coachProfile.role}s in the music industry.

Role: ${context.coachProfile.role}
Experience Level: ${context.coachProfile.experience_level}
Genre: ${context.coachProfile.genre || 'Not specified'}

${existingGoals.length > 0 ? `Active Goals:\n${existingGoals.map(g => `- ${g.title} (${g.category}, ${g.progress}% complete)`).join('\n')}` : 'No active goals set yet.'}

${lastWeekProgress ? `Last Week's Progress:\n${JSON.stringify(lastWeekProgress.reflections, null, 2)}` : ''}

${context.fusionContext ? `Campaign Context:\n${JSON.stringify(context.fusionContext.campaignMetrics, null, 2)}` : ''}

${context.migContext?.sceneContext ? `Scene Context:\n${JSON.stringify(context.migContext.sceneContext, null, 2)}` : ''}

Generate a structured weekly plan with:
1. A clear focus theme for the week
2. 3 creative growth tasks
3. 2 promotional understanding tasks
4. 2 relationship-building tasks
5. 1 career skill task
6. 1 wellbeing/reflection task
7. 2-3 insights (career, branding, or growth-related)
8. Estimated total hours for the week

Format your response as JSON:
{
  "focusTheme": "string",
  "tasks": [
    {
      "title": "string",
      "description": "string",
      "category": "creative_growth" | "promotional_understanding" | "relationship_building" | "career_skill" | "wellbeing",
      "effort": "low" | "medium" | "high",
      "priority": number,
      "resources": [
        {
          "title": "string",
          "url": "string",
          "type": "article" | "video" | "tool" | "template",
          "description": "string"
        }
      ]
    }
  ],
  "insights": [
    {
      "type": "career" | "branding" | "growth",
      "summary": "string",
      "detail": "string",
      "actionable_steps": ["string"],
      "priority": "low" | "medium" | "high"
    }
  ],
  "estimatedHours": number
}

IMPORTANT: Provide GUIDANCE ONLY. Do not suggest any automated actions, email sending, or campaign modifications.`;
}

function buildCareerInsightsPrompt(input: CareerInsightsInput): string {
  const { context, goals, progressHistory } = input;

  return `You are CoachOS, analyzing career progress for a ${context.coachProfile.role} in the music industry.

Experience Level: ${context.coachProfile.experience_level}
Genre: ${context.coachProfile.genre || 'Not specified'}

Goals: ${JSON.stringify(goals, null, 2)}
Progress History: ${JSON.stringify(progressHistory.slice(0, 10), null, 2)}

Generate 2-3 career insights based on their progress and goals.

Format as JSON array:
[
  {
    "type": "career",
    "summary": "string",
    "detail": "string",
    "actionable_steps": ["string"],
    "priority": "low" | "medium" | "high"
  }
]`;
}

function buildBrandingInsightsPrompt(context: CoachContext): string {
  return `You are CoachOS, providing branding guidance for a ${context.coachProfile.role} in the music industry.

Genre: ${context.coachProfile.genre || 'Not specified'}
${context.fusionContext?.artistProfile ? `Artist Profile: ${JSON.stringify(context.fusionContext.artistProfile, null, 2)}` : ''}

Generate 1-2 branding insights focused on identity, visual consistency, and market positioning.

Format as JSON array:
[
  {
    "type": "branding",
    "summary": "string",
    "detail": "string",
    "actionable_steps": ["string"],
    "priority": "low" | "medium" | "high"
  }
]`;
}

function buildCreativeInsightsPrompt(context: CoachContext): string {
  return `You are CoachOS, analyzing creative patterns for an artist.

CMG Data: ${JSON.stringify(context.cmgContext, null, 2)}

Generate 1-2 creative insights based on their emotional arcs and structural patterns.

Format as JSON array:
[
  {
    "type": "creative",
    "summary": "string",
    "detail": "string",
    "actionable_steps": ["string"],
    "priority": "low" | "medium" | "high"
  }
]`;
}

// ============================================================================
// RESPONSE PARSERS
// ============================================================================

function extractTextContent(message: Anthropic.Message): string {
  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in AI response');
  }
  return textBlock.text;
}

function parseWeeklyRecommendations(response: string): {
  tasks: any[];
  insights: CoachInsight[];
  focusTheme: string;
  estimatedHours: number;
} {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;

    const parsed = JSON.parse(jsonString);

    return {
      tasks: parsed.tasks || [],
      insights: parsed.insights || [],
      focusTheme: parsed.focusTheme || 'Weekly Focus',
      estimatedHours: parsed.estimatedHours || 8,
    };
  } catch (error) {
    logger.error('Failed to parse weekly recommendations', error);
    throw new Error('Invalid AI response format');
  }
}

function parseInsights(response: string, defaultType: string): CoachInsight[] {
  try {
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;

    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    logger.error('Failed to parse insights', error);
    return [];
  }
}

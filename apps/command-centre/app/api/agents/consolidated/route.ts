import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL;

interface AgentResponse {
  success: boolean;
  response: string;
  recommendations?: string[];
  nextSteps?: string[];
  error?: string;
}

// 1. Music Intelligence Agent
async function runMusicIntelligenceAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Music Intelligence Agent with 15+ years of experience in the music industry, combining strategic analysis, marketing expertise, and data-driven insights.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide comprehensive analysis on:
1. Industry positioning and strategic advice
2. Marketing strategy and digital presence
3. Performance analytics and insights
4. Market trends and opportunities
5. Competitive analysis

Format your response as:
- Strategic Analysis: [Your main analysis]
- Marketing Recommendations: [3-5 actionable marketing strategies]
- Industry Insights: [Current trends and opportunities]
- Performance Metrics: [Key metrics to track]
- Next Steps: [Immediate action items]`;

  try {
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL!,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content),
    };
  } catch (error) {
    console.error('Music Intelligence Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed',
    };
  }
}

// 2. Growth & Content Agent
async function runGrowthContentAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Growth & Content Agent specializing in viral content creation, audience growth, and scalable marketing automation for musicians.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide growth and content strategies on:
1. Viral content creation and distribution
2. Audience growth and engagement tactics
3. Content automation workflows
4. Growth hacking strategies
5. Multi-platform content optimization

Format your response as:
- Growth Analysis: [Your main analysis]
- Content Strategies: [3-5 actionable content tactics]
- Viral Tactics: [Content and distribution strategies]
- Automation Workflows: [Scalable content systems]
- Growth Experiments: [A/B tests and growth hacks]`;

  try {
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL!,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content),
    };
  } catch (error) {
    console.error('Growth & Content Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed',
    };
  }
}

// 3. Promotion & Outreach Agent
async function runPromotionOutreachAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Promotion & Outreach Agent specializing in radio promotion, social media strategy, and multi-channel outreach for music promotion.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide promotion and outreach strategies on:
1. Radio promotion and playlist pitching
2. Social media platform optimization
3. Email marketing and outreach campaigns
4. Reddit and community engagement
5. Multi-channel promotion coordination

Format your response as:
- Promotion Analysis: [Your main analysis]
- Outreach Strategies: [3-5 actionable promotion tactics]
- Channel Optimization: [Best practices per platform]
- Campaign Ideas: [Specific promotion campaigns]
- Success Metrics: [Key performance indicators]`;

  try {
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL!,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content),
    };
  } catch (error) {
    console.error('Promotion & Outreach Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed',
    };
  }
}

// 4. Radio Promo Agent (Specialized for Liberty Music PR)
async function runRadioPromoAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a specialized Radio Promo Agent for Liberty Music PR, with deep expertise in UK radio promotion, playlist pitching, and radio industry relationships.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide specialized radio promotion strategies on:
1. UK radio station targeting and pitching
2. Playlist placement strategies
3. Radio industry relationship building
4. Promo campaign optimization
5. Radio-specific content creation

Format your response as:
- Radio Analysis: [Your main analysis]
- Station Strategies: [3-5 actionable radio tactics]
- Playlist Opportunities: [Specific playlist targets]
- Relationship Building: [Radio industry networking]
- Campaign Optimization: [Promo campaign improvements]`;

  try {
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL!,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content),
    };
  } catch (error) {
    console.error('Radio Promo Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed',
    };
  }
}

// 5. TDD Agent (Test-Driven Development)
async function runTDDAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a TDD (Test-Driven Development) Agent specializing in writing comprehensive tests, debugging, and ensuring code quality for music industry applications.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide TDD assistance on:
1. Test case generation and writing
2. Debugging and error resolution
3. Code quality improvement
4. Test coverage analysis
5. Development workflow optimization

Format your response as:
- Test Analysis: [Your main analysis]
- Test Cases: [3-5 specific test cases to write]
- Debugging Steps: [Systematic debugging approach]
- Code Improvements: [Quality enhancement suggestions]
- TDD Workflow: [Best practices for test-driven development]`;

  try {
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL!,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content),
    };
  } catch (error) {
    console.error('TDD Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed',
    };
  }
}

// Helper functions
function extractRecommendations(content: string): string[] {
  const recommendations: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.includes('•') || line.includes('-') || line.includes('*')) {
      const clean = line.replace(/^[\s•\-*]+/, '').trim();
      if (clean.length > 0) {
        recommendations.push(clean);
      }
    }
  }

  return recommendations.slice(0, 5); // Limit to 5 recommendations
}

function extractNextSteps(content: string): string[] {
  const nextSteps: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.toLowerCase().includes('next step') || line.toLowerCase().includes('action item')) {
      const clean = line.replace(/^[\s•\-*]+/, '').trim();
      if (clean.length > 0) {
        nextSteps.push(clean);
      }
    }
  }

  return nextSteps.slice(0, 3); // Limit to 3 next steps
}

export async function POST(request: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI Agent API not configured',
        },
        { status: 500 }
      );
    }

    const { agentType, query, context } = await request.json();

    if (!agentType || !query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: agentType and query',
        },
        { status: 400 }
      );
    }

    let result: AgentResponse;

    switch (agentType) {
      case 'music-intelligence':
        result = await runMusicIntelligenceAgent(query, context);
        break;
      case 'growth-content':
        result = await runGrowthContentAgent(query, context);
        break;
      case 'promotion-outreach':
        result = await runPromotionOutreachAgent(query, context);
        break;
      case 'radio-promo':
        result = await runRadioPromoAgent(query, context);
        break;
      case 'tdd':
        result = await runTDDAgent(query, context);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid agent type. Available: music-intelligence, growth-content, promotion-outreach, radio-promo, tdd',
          },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Consolidated Agent API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

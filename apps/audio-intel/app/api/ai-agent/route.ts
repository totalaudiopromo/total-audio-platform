import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar';

interface AgentRequest {
  agentType: 'music-industry-strategist' | 'music-marketing-mastermind' | 'growth-hacking-optimizer' | 'viral-content-automation' | 'radio-promo-agent' | 'social-media-agent' | 'content-generation-agent' | 'analytics-agent';
  query: string;
  context?: any;
}

interface AgentResponse {
  success: boolean;
  response: string;
  recommendations?: string[];
  nextSteps?: string[];
  data?: any;
  error?: string;
}

// Music Industry Strategist Agent
async function runMusicIndustryStrategist(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Music Industry Strategist with 15+ years of experience in artist development, label operations, and industry networking.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide strategic advice on:
1. Industry positioning and branding
2. Label and distribution strategy
3. Networking and relationship building
4. Industry trends and opportunities
5. Career development roadmap

Format your response as:
- Strategic Analysis: [Your main analysis]
- Key Recommendations: [3-5 actionable recommendations]
- Industry Insights: [Current trends and opportunities]
- Next Steps: [Immediate action items]
- Risk Assessment: [Potential challenges and mitigation]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Music Industry Strategist error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Music Marketing Mastermind Agent
async function runMusicMarketingMastermind(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Music Marketing Mastermind specializing in digital marketing, social media strategy, and audience growth for musicians.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide marketing strategy on:
1. Social media marketing and content strategy
2. Audience targeting and growth
3. Brand building and positioning
4. Digital advertising and promotion
5. Marketing campaign optimization

Format your response as:
- Marketing Analysis: [Your main analysis]
- Strategy Recommendations: [3-5 actionable marketing strategies]
- Channel Optimization: [Best platforms and approaches]
- Content Strategy: [Content types and scheduling]
- Growth Tactics: [Audience growth strategies]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Music Marketing Mastermind error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Growth Hacking Optimizer Agent
async function runGrowthHackingOptimizer(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Growth Hacking Optimizer specializing in rapid audience growth, viral marketing, and scalable growth strategies for musicians.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide growth hacking strategies on:
1. Viral content creation and distribution
2. Rapid audience growth tactics
3. Growth experimentation and optimization
4. Scalable marketing systems
5. Data-driven growth optimization

Format your response as:
- Growth Analysis: [Your main analysis]
- Growth Hacks: [3-5 rapid growth strategies]
- Viral Tactics: [Content and distribution strategies]
- Optimization Framework: [Testing and scaling approach]
- Growth Metrics: [Key metrics to track]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Growth Hacking Optimizer error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Viral Content Automation Agent
async function runViralContentAutomation(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Viral Content Automation specialist focusing on creating and distributing viral content for musicians.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide viral content strategies on:
1. Viral content ideation and creation
2. Platform-specific optimization
3. Content distribution and promotion
4. Viral mechanics and psychology
5. Automation and scaling

Format your response as:
- Content Analysis: [Your main analysis]
- Viral Content Ideas: [3-5 viral content concepts]
- Platform Strategy: [Best platforms and formats]
- Distribution Plan: [How to maximize reach]
- Automation Tips: [Tools and processes]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Viral Content Automation error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Radio Promotion Agent
async function runRadioPromoAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Radio Promotion Agent with extensive experience in radio promotion, playlist pitching, and broadcast media strategy.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide radio promotion strategies on:
1. Radio station targeting and pitching
2. Playlist curator outreach
3. Radio promotion campaigns
4. Broadcast media strategy
5. Radio industry networking

Format your response as:
- Radio Analysis: [Your main analysis]
- Station Strategy: [Target stations and approach]
- Pitching Framework: [How to pitch effectively]
- Campaign Plan: [Promotion campaign structure]
- Success Metrics: [How to measure success]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Radio Promotion Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Social Media Agent
async function runSocialMediaAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Social Media Agent specializing in social media strategy, content creation, and community building for musicians.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide social media strategies on:
1. Platform-specific content strategy
2. Community engagement and growth
3. Social media advertising
4. Influencer collaboration
5. Social media analytics and optimization

Format your response as:
- Social Media Analysis: [Your main analysis]
- Platform Strategy: [Best platforms and content types]
- Content Calendar: [Content planning and scheduling]
- Engagement Tactics: [Community building strategies]
- Performance Optimization: [Analytics and improvement]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Social Media Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Content Generation Agent
async function runContentGenerationAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are a Content Generation Agent specializing in creating engaging content for musicians across all platforms.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide content creation strategies on:
1. Content ideation and planning
2. Multi-platform content adaptation
3. Storytelling and narrative development
4. Visual and audio content creation
5. Content optimization and performance

Format your response as:
- Content Analysis: [Your main analysis]
- Content Ideas: [3-5 content concepts]
- Platform Adaptation: [How to adapt for different platforms]
- Creation Process: [Content creation workflow]
- Performance Tips: [How to optimize content]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Content Generation Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Analytics Agent
async function runAnalyticsAgent(query: string, context?: any): Promise<AgentResponse> {
  const prompt = `You are an Analytics Agent specializing in music industry analytics, data interpretation, and performance optimization.

Context: ${context ? JSON.stringify(context) : 'No specific context provided'}

Query: ${query}

Provide analytics insights on:
1. Performance data analysis and interpretation
2. Key performance indicators (KPIs)
3. Data-driven decision making
4. Analytics tools and platforms
5. Performance optimization strategies

Format your response as:
- Analytics Analysis: [Your main analysis]
- Key Metrics: [Important KPIs to track]
- Data Insights: [What the data tells us]
- Optimization Opportunities: [Areas for improvement]
- Actionable Recommendations: [Data-driven next steps]`;

  try {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: PERPLEXITY_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = (response.data as any)?.choices?.[0]?.message?.content || '';
    
    return {
      success: true,
      response: content,
      recommendations: extractRecommendations(content),
      nextSteps: extractNextSteps(content)
    };
  } catch (error) {
    console.error('Analytics Agent error:', error);
    return {
      success: false,
      response: 'Unable to process request at this time.',
      error: 'Agent processing failed'
    };
  }
}

// Helper functions to extract structured data from agent responses
function extractRecommendations(content: string): string[] {
  const recommendations: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.includes('Recommendation:') || line.includes('Strategy:') || line.includes('Tactic:') || line.includes('•')) {
      const recommendation = line.replace(/^[•\-\*]\s*/, '').replace(/^.*?:\s*/, '').trim();
      if (recommendation && recommendation.length > 10) {
        recommendations.push(recommendation);
      }
    }
  }
  
  return recommendations.slice(0, 5); // Limit to 5 recommendations
}

function extractNextSteps(content: string): string[] {
  const nextSteps: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.includes('Next Step:') || line.includes('Action:') || line.includes('Do:') || line.includes('1.') || line.includes('2.') || line.includes('3.')) {
      const step = line.replace(/^\d+\.\s*/, '').replace(/^.*?:\s*/, '').trim();
      if (step && step.length > 10) {
        nextSteps.push(step);
      }
    }
  }
  
  return nextSteps.slice(0, 5); // Limit to 5 next steps
}

export async function POST(req: NextRequest) {
  try {
    const body: AgentRequest = await req.json();
    const { agentType, query, context } = body;

    if (!query || !query.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query is required' 
      }, { status: 400 });
    }

    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'AI Agent API not configured' 
      }, { status: 500 });
    }

    let response: AgentResponse;

    // Route to appropriate agent based on type
    switch (agentType) {
      case 'music-industry-strategist':
        response = await runMusicIndustryStrategist(query, context);
        break;
      case 'music-marketing-mastermind':
        response = await runMusicMarketingMastermind(query, context);
        break;
      case 'growth-hacking-optimizer':
        response = await runGrowthHackingOptimizer(query, context);
        break;
      case 'viral-content-automation':
        response = await runViralContentAutomation(query, context);
        break;
      case 'radio-promo-agent':
        response = await runRadioPromoAgent(query, context);
        break;
      case 'social-media-agent':
        response = await runSocialMediaAgent(query, context);
        break;
      case 'content-generation-agent':
        response = await runContentGenerationAgent(query, context);
        break;
      case 'analytics-agent':
        response = await runAnalyticsAgent(query, context);
        break;
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid agent type' 
        }, { status: 400 });
    }

    return NextResponse.json({
      agentType,
      query,
      ...response
    });

  } catch (error: any) {
    console.error('AI Agent API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Agent processing failed' 
    }, { status: 500 });
  }
}

export async function GET() {
  return new Response('This endpoint only supports POST requests.', { status: 405 });
} 
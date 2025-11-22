import axios from 'axios';

interface AuraConfig {
  apiKey: string;
  baseUrl: string;
}

interface PitchRequest {
  client: string;
  industry: string;
  news: string;
  targetOutlets: string[];
  journalistInfo?: {
    name: string;
    outlet: string;
    beat: string;
    recentArticles?: string[];
  };
}

interface PitchResponse {
  success: boolean;
  pitch?: {
    subject: string;
    body: string;
    personalized: boolean;
    wordCount: number;
  };
  error?: string;
}

interface CampaignSuggestion {
  type: 'pitch' | 'press_release' | 'media_alert' | 'follow_up';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
}

interface AuraResponse {
  content: string;
}

export class AuraService {
  private config: AuraConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.aura.io',
    };
  }

  async generatePitch(request: PitchRequest): Promise<PitchResponse> {
    try {
      const prompt = this.buildPitchPrompt(request);

      const response = await axios.post(
        `${this.config.baseUrl}/generate`,
        {
          prompt,
          model: 'gpt-4',
          max_tokens: 1000,
          temperature: 0.7,
          system_prompt: `You are an expert PR professional. Write compelling, personalized pitches that:
          - Are concise and engaging
          - Include relevant context and news hooks
          - Are tailored to the journalist's beat and recent work
          - Have clear subject lines that drive opens
          - Include a clear call to action`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const pitch = this.parsePitchResponse((response.data as AuraResponse).content);

      return {
        success: true,
        pitch,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generatePressRelease(
    client: string,
    news: string,
    industry: string
  ): Promise<{
    success: boolean;
    pressRelease?: {
      headline: string;
      subheadline: string;
      body: string;
      boilerplate: string;
      wordCount: number;
    };
    error?: string;
  }> {
    try {
      const prompt = `Write a professional press release for ${client} about: ${news}
      
      Industry: ${industry}
      
      Include:
      - Compelling headline
      - Subheadline
      - Body with quotes
      - Boilerplate
      - Keep it under 400 words`;

      const response = await axios.post(
        `${this.config.baseUrl}/generate`,
        {
          prompt,
          model: 'gpt-4',
          max_tokens: 800,
          temperature: 0.6,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const pressRelease = this.parsePressReleaseResponse((response.data as AuraResponse).content);

      return {
        success: true,
        pressRelease,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async suggestCampaigns(
    client: string,
    industry: string,
    recentNews: string[]
  ): Promise<{
    success: boolean;
    suggestions: CampaignSuggestion[];
    error?: string;
  }> {
    try {
      const prompt = `Based on the following information, suggest 3-5 PR campaign ideas for ${client}:
      
      Industry: ${industry}
      Recent News: ${recentNews.join(', ')}
      
      For each suggestion, include:
      - Campaign type (pitch, press release, media alert, follow-up)
      - Title
      - Description
      - Priority (high, medium, low)
      - Estimated impact`;

      const response = await axios.post(
        `${this.config.baseUrl}/generate`,
        {
          prompt,
          model: 'gpt-4',
          max_tokens: 600,
          temperature: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const suggestions = this.parseCampaignSuggestions((response.data as AuraResponse).content);

      return {
        success: true,
        suggestions,
      };
    } catch (error) {
      return {
        success: false,
        suggestions: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async optimizeSubjectLine(
    pitch: string,
    journalistInfo?: any
  ): Promise<{
    success: boolean;
    subjectLines?: string[];
    error?: string;
  }> {
    try {
      const prompt = `Generate 5 compelling email subject lines for this pitch:
      
      ${pitch}
      
      ${journalistInfo ? `Journalist: ${journalistInfo.name} at ${journalistInfo.outlet}` : ''}
      
      Make them:
      - Under 50 characters
      - Include news hooks
      - Drive opens
      - Personalized when possible`;

      const response = await axios.post(
        `${this.config.baseUrl}/generate`,
        {
          prompt,
          model: 'gpt-4',
          max_tokens: 300,
          temperature: 0.9,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const subjectLines = this.parseSubjectLines((response.data as AuraResponse).content);

      return {
        success: true,
        subjectLines,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private buildPitchPrompt(request: PitchRequest): string {
    let prompt = `Write a personalized pitch for ${request.client} about: ${request.news}
    
    Industry: ${request.industry}
    Target Outlets: ${request.targetOutlets.join(', ')}`;

    if (request.journalistInfo) {
      prompt += `
      
      Journalist: ${request.journalistInfo.name}
      Outlet: ${request.journalistInfo.outlet}
      Beat: ${request.journalistInfo.beat}`;

      if (request.journalistInfo.recentArticles?.length) {
        prompt += `
        Recent Articles: ${request.journalistInfo.recentArticles.join(', ')}`;
      }
    }

    prompt += `
    
    Requirements:
    - Personalized to the journalist's work
    - Include relevant news hook
    - Clear value proposition
    - Specific call to action
    - Professional but conversational tone
    - Under 200 words`;

    return prompt;
  }

  private parsePitchResponse(content: string): {
    subject: string;
    body: string;
    personalized: boolean;
    wordCount: number;
  } {
    const lines = content.split('\n');
    let subject = '';
    let body = '';
    let inBody = false;

    lines.forEach(line => {
      if (line.toLowerCase().includes('subject:')) {
        subject = line.replace(/subject:\s*/i, '').trim();
      } else if (line.toLowerCase().includes('body:') || line.toLowerCase().includes('pitch:')) {
        inBody = true;
      } else if (inBody && line.trim()) {
        body += line + '\n';
      }
    });

    return {
      subject: subject || 'Pitch from ' + new Date().toLocaleDateString(),
      body: body.trim(),
      personalized: body.toLowerCase().includes('recent') || body.toLowerCase().includes('article'),
      wordCount: body.split(' ').length,
    };
  }

  private parsePressReleaseResponse(content: string): {
    headline: string;
    subheadline: string;
    body: string;
    boilerplate: string;
    wordCount: number;
  } {
    const lines = content.split('\n');
    let headline = '';
    let subheadline = '';
    let body = '';
    let boilerplate = '';
    let currentSection = '';

    lines.forEach(line => {
      if (line.toLowerCase().includes('headline:')) {
        headline = line.replace(/headline:\s*/i, '').trim();
      } else if (line.toLowerCase().includes('subheadline:')) {
        subheadline = line.replace(/subheadline:\s*/i, '').trim();
      } else if (line.toLowerCase().includes('body:')) {
        currentSection = 'body';
      } else if (line.toLowerCase().includes('boilerplate:')) {
        currentSection = 'boilerplate';
      } else if (line.trim() && currentSection === 'body') {
        body += line + '\n';
      } else if (line.trim() && currentSection === 'boilerplate') {
        boilerplate += line + '\n';
      }
    });

    return {
      headline: headline || 'Press Release',
      subheadline: subheadline || '',
      body: body.trim(),
      boilerplate: boilerplate.trim(),
      wordCount: body.split(' ').length,
    };
  }

  private parseCampaignSuggestions(content: string): CampaignSuggestion[] {
    const suggestions: CampaignSuggestion[] = [];
    const lines = content.split('\n');
    let currentSuggestion: Partial<CampaignSuggestion> = {};

    lines.forEach(line => {
      if (line.match(/^\d+\./)) {
        if (currentSuggestion.title) {
          suggestions.push(currentSuggestion as CampaignSuggestion);
        }
        currentSuggestion = {};
      } else if (line.toLowerCase().includes('type:')) {
        const type = line.match(/type:\s*(pitch|press_release|media_alert|follow_up)/i)?.[1] as any;
        if (type) currentSuggestion.type = type;
      } else if (line.toLowerCase().includes('title:')) {
        currentSuggestion.title = line.replace(/title:\s*/i, '').trim();
      } else if (line.toLowerCase().includes('description:')) {
        currentSuggestion.description = line.replace(/description:\s*/i, '').trim();
      } else if (line.toLowerCase().includes('priority:')) {
        const priority = line.match(/priority:\s*(high|medium|low)/i)?.[1] as any;
        if (priority) currentSuggestion.priority = priority;
      } else if (line.toLowerCase().includes('impact:')) {
        currentSuggestion.estimatedImpact = line.replace(/impact:\s*/i, '').trim();
      }
    });

    if (currentSuggestion.title) {
      suggestions.push(currentSuggestion as CampaignSuggestion);
    }

    return suggestions;
  }

  private parseSubjectLines(content: string): string[] {
    const lines = content.split('\n');
    const subjectLines: string[] = [];

    lines.forEach(line => {
      if (line.match(/^\d+\./)) {
        const subject = line.replace(/^\d+\.\s*/, '').trim();
        if (subject && subject.length < 50) {
          subjectLines.push(subject);
        }
      }
    });

    return subjectLines;
  }
}

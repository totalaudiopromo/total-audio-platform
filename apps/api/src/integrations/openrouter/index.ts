import axios from 'axios';

interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
}

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  success: boolean;
  data?: {
    id: string;
    model: string;
    choices: Array<{
      index: number;
      message: {
        role: string;
        content: string;
      };
      finishReason: string;
    }>;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
  error?: string;
}

export class OpenRouterService {
  private config: OpenRouterConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://openrouter.ai/api/v1'
    };
  }

  async getAvailableModels(): Promise<{
    success: boolean;
    models?: ModelInfo[];
    error?: string;
  }> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const models = response.data.data.map((model: any) => ({
        id: model.id,
        name: model.name,
        description: model.description || '',
        contextLength: model.context_length || 0,
        pricing: {
          prompt: model.pricing?.prompt || '0',
          completion: model.pricing?.completion || '0'
        }
      }));

      return {
        success: true,
        models
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/chat/completions`, {
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
        top_p: request.topP || 1,
        frequency_penalty: request.frequencyPenalty || 0,
        presence_penalty: request.presencePenalty || 0,
        stream: request.stream || false
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generatePressRelease(client: string, news: string, industry: string): Promise<{
    success: boolean;
    pressRelease?: string;
    error?: string;
  }> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a professional PR writer. Write compelling press releases that are newsworthy and follow AP style guidelines.'
        },
        {
          role: 'user',
          content: `Write a press release for ${client} about: ${news}
          
          Industry: ${industry}
          
          Include:
          - Compelling headline
          - Strong opening paragraph
          - Key quotes
          - Contact information
          - Boilerplate about the company
          
          Make it newsworthy and engaging for journalists.`
        }
      ];

      const result = await this.chatCompletion({
        model: 'anthropic/claude-3.5-sonnet',
        messages,
        temperature: 0.7,
        maxTokens: 2000
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Unknown error'
        };
      }

      return {
        success: true,
        pressRelease: result.data?.choices[0]?.message?.content || '',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generatePitchEmail(journalist: string, outlet: string, story: string, client: string): Promise<{
    success: boolean;
    pitch?: string;
    subjectLine?: string;
    error?: string;
  }> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a PR professional writing personalized pitch emails to journalists. Be concise, relevant, and respectful of their time.'
        },
        {
          role: 'user',
          content: `Write a personalized pitch email to ${journalist} at ${outlet} about: ${story}
          
          Client: ${client}
          
          Include:
          - Personalized subject line
          - Brief, compelling pitch
          - Why this is relevant to their beat
          - Clear call to action
          - Professional signature
          
          Keep it under 150 words and make it personal to the journalist.`
        }
      ];

      const result = await this.chatCompletion({
        model: 'anthropic/claude-3.5-sonnet',
        messages,
        temperature: 0.6,
        maxTokens: 1000
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Unknown error'
        };
      }

      const content = result.data?.choices[0]?.message?.content || '';
      
      // Extract subject line and pitch body
      const lines = content.split('\n');
      const subjectLine = lines.find(line => line.toLowerCase().includes('subject:'))?.split(':')[1]?.trim() || '';
      const pitch = lines.filter(line => !line.toLowerCase().includes('subject:')).join('\n').trim();

      return {
        success: true,
        pitch,
        subjectLine
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async analyzeMediaCoverage(articles: string[]): Promise<{
    success: boolean;
    analysis?: {
      sentiment: 'positive' | 'negative' | 'neutral';
      keyThemes: string[];
      tone: string;
      recommendations: string[];
    };
    error?: string;
  }> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a media analysis expert. Analyze articles for sentiment, themes, and provide actionable recommendations.'
        },
        {
          role: 'user',
          content: `Analyze these media articles for sentiment, key themes, and tone:
          
          ${articles.join('\n\n')}
          
          Provide:
          - Overall sentiment (positive/negative/neutral)
          - Key themes and topics
          - Tone analysis
          - Recommendations for PR strategy
          
          Be specific and actionable.`
        }
      ];

      const result = await this.chatCompletion({
        model: 'anthropic/claude-3.5-sonnet',
        messages,
        temperature: 0.3,
        maxTokens: 1500
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Unknown error'
        };
      }

      const content = result.data?.choices[0]?.message?.content || '';
      
      // Parse the analysis
      const analysis = this.parseMediaAnalysis(content);

      return {
        success: true,
        analysis
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateSocialMediaContent(pressRelease: string, platforms: string[]): Promise<{
    success: boolean;
    content?: Record<string, string>;
    error?: string;
  }> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a social media expert. Create engaging content for different platforms based on press releases.'
        },
        {
          role: 'user',
          content: `Create social media content for this press release:
          
          ${pressRelease}
          
          Platforms: ${platforms.join(', ')}
          
          For each platform, create:
          - Engaging post copy
          - Relevant hashtags
          - Call to action
          
          Adapt the tone and length for each platform.`
        }
      ];

      const result = await this.chatCompletion({
        model: 'anthropic/claude-3.5-sonnet',
        messages,
        temperature: 0.7,
        maxTokens: 2000
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Unknown error'
        };
      }

      const content = result.data?.choices[0]?.message?.content || '';
      const socialContent = this.parseSocialMediaContent(content, platforms);

      return {
        success: true,
        content: socialContent
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private parseMediaAnalysis(content: string): {
    sentiment: 'positive' | 'negative' | 'neutral';
    keyThemes: string[];
    tone: string;
    recommendations: string[];
  } {
    const lines = content.split('\n');
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    const keyThemes: string[] = [];
    let tone = '';
    const recommendations: string[] = [];

    for (const line of lines) {
      if (line.toLowerCase().includes('sentiment:')) {
        const sentimentText = line.split(':')[1]?.trim().toLowerCase() || '';
        if (sentimentText.includes('positive')) sentiment = 'positive';
        else if (sentimentText.includes('negative')) sentiment = 'negative';
        else sentiment = 'neutral';
      } else if (line.toLowerCase().includes('theme')) {
        const theme = line.split(':')[1]?.trim();
        if (theme) keyThemes.push(theme);
      } else if (line.toLowerCase().includes('tone:')) {
        tone = line.split(':')[1]?.trim() || '';
      } else if (line.toLowerCase().includes('recommendation')) {
        const rec = line.split(':')[1]?.trim();
        if (rec) recommendations.push(rec);
      }
    }

    return {
      sentiment,
      keyThemes,
      tone,
      recommendations
    };
  }

  private parseSocialMediaContent(content: string, platforms: string[]): Record<string, string> {
    const socialContent: Record<string, string> = {};
    
    const sections = content.split('\n\n');
    
    for (const platform of platforms) {
      const section = sections.find(s => s.toLowerCase().includes(platform.toLowerCase()));
      if (section) {
        socialContent[platform] = section.split('\n').filter(line => 
          !line.toLowerCase().includes(platform.toLowerCase()) && line.trim()
        ).join('\n');
      }
    }

    return socialContent;
  }
} 
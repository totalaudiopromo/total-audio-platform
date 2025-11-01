import axios from 'axios';

interface PerplexityConfig {
  apiKey: string;
  baseUrl: string;
}

interface Journalist {
  name: string;
  outlet: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  beat: string;
  location?: string;
  recentArticles?: string[];
}

interface IndustryResearch {
  trends: string[];
  keyPlayers: string[];
  recentNews: string[];
  opportunities: string[];
}

interface ContactList {
  name: string;
  description: string;
  contacts: Journalist[];
  source: string;
}

export class PerplexityService {
  private config: PerplexityConfig;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.perplexity.ai',
    };
  }

  async findJournalists(
    industry: string,
    location?: string
  ): Promise<{
    success: boolean;
    journalists: Journalist[];
    error?: string;
  }> {
    try {
      const prompt = `Find journalists who cover ${industry}${location ? ` in ${location}` : ''}. 
      Include their name, outlet, beat, location, and if possible their contact information. 
      Focus on journalists who write about this industry regularly.`;

      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: 'sonar',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Parse the response to extract journalist information
      const data = response.data as { choices: Array<{ message: { content: string } }> };
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }
      const content = data.choices[0].message.content;
      const journalists = this.parseJournalistsFromResponse(content);

      return {
        success: true,
        journalists,
      };
    } catch (error) {
      return {
        success: false,
        journalists: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async researchIndustry(industry: string): Promise<{
    success: boolean;
    data?: IndustryResearch;
    error?: string;
  }> {
    try {
      const prompt = `Research the ${industry} industry. Provide:
      1. Current trends and developments
      2. Key players and companies
      3. Recent news and announcements
      4. Opportunities for PR and media coverage
      
      Format the response as structured data.`;

      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: 'sonar',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 3000,
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as { choices: Array<{ message: { content: string } }> };
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }
      const content = data.choices[0].message.content;
      const research = this.parseIndustryResearchFromResponse(content);

      return {
        success: true,
        data: research,
      };
    } catch (error: any) {
      if (error.response) {
        console.error('Perplexity API error:', error.response.status, error.response.data);
        return {
          success: false,
          error: `Status ${error.response.status}: ${JSON.stringify(error.response.data)}`,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async findContactLists(query: string): Promise<{
    success: boolean;
    lists: ContactList[];
    error?: string;
  }> {
    try {
      const prompt = `Find contact lists and databases for ${query}. 
      Include information about:
      - List name and description
      - Number of contacts
      - Source/creator
      - How to access or purchase
      
      Focus on high-quality, verified contact lists.`;

      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: 'sonar',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as { choices: Array<{ message: { content: string } }> };
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }
      const content = data.choices[0].message.content;
      const lists = this.parseContactListsFromResponse(content);

      return {
        success: true,
        lists,
      };
    } catch (error) {
      return {
        success: false,
        lists: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async analyzeCompetitorPR(
    competitor: string,
    industry: string
  ): Promise<{
    success: boolean;
    analysis?: {
      outlets: string[];
      journalists: string[];
      strategies: string[];
      opportunities: string[];
    };
    error?: string;
  }> {
    try {
      const prompt = `Analyze the PR and media strategy of ${competitor} in the ${industry} industry.
      Research:
      1. Which media outlets cover them
      2. Key journalists who write about them
      3. Their PR strategies and tactics
      4. Opportunities for competitive positioning
      
      Provide actionable insights for PR strategy.`;

      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: 'sonar',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 2500,
          temperature: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as { choices: Array<{ message: { content: string } }> };
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }
      const content = data.choices[0].message.content;
      const analysis = this.parseCompetitorAnalysisFromResponse(content);

      return {
        success: true,
        analysis,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generatePitchIdeas(
    client: string,
    industry: string
  ): Promise<{
    success: boolean;
    ideas?: Array<{
      angle: string;
      targetOutlets: string[];
      keyMessages: string[];
      timing: string;
    }>;
    error?: string;
  }> {
    try {
      const prompt = `Generate PR pitch ideas for ${client} in the ${industry} industry.
      For each idea include:
      - The angle or story hook
      - Target media outlets
      - Key messages
      - Optimal timing
      
      Focus on newsworthy, timely angles that would interest journalists.`;

      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: 'sonar',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 3000,
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data as { choices: Array<{ message: { content: string } }> };
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }
      const content = data.choices[0].message.content;
      const ideas = this.parsePitchIdeasFromResponse(content);

      return {
        success: true,
        ideas,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private parseJournalistsFromResponse(content: string): Journalist[] {
    // This is a simplified parser - in a real implementation, you'd want more sophisticated parsing
    const journalists: Journalist[] = [];

    // Extract journalist information using regex patterns
    const lines = content.split('\n');
    let currentJournalist: Partial<Journalist> = {};

    for (const line of lines) {
      if (line.includes('Name:') || line.includes('Journalist:')) {
        if (currentJournalist.name) {
          journalists.push(currentJournalist as Journalist);
        }
        currentJournalist = {
          name: line.split(':')[1]?.trim() || 'Unknown',
        };
      } else if (line.includes('Outlet:') || line.includes('Publication:')) {
        currentJournalist.outlet = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Beat:') || line.includes('Coverage:')) {
        currentJournalist.beat = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Email:') || line.includes('Contact:')) {
        currentJournalist.email = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Twitter:') || line.includes('@')) {
        currentJournalist.twitter = line.split(':')[1]?.trim() || '';
      }
    }

    if (currentJournalist.name) {
      journalists.push(currentJournalist as Journalist);
    }

    return journalists;
  }

  private parseIndustryResearchFromResponse(content: string): IndustryResearch {
    // Simplified parser for industry research
    const research: IndustryResearch = {
      trends: [],
      keyPlayers: [],
      recentNews: [],
      opportunities: [],
    };

    const sections = content.split('\n\n');

    for (const section of sections) {
      if (section.toLowerCase().includes('trend')) {
        research.trends = section
          .split('\n')
          .filter(line => line.trim() && !line.toLowerCase().includes('trend'));
      } else if (
        section.toLowerCase().includes('player') ||
        section.toLowerCase().includes('company')
      ) {
        research.keyPlayers = section
          .split('\n')
          .filter(
            line =>
              line.trim() &&
              !line.toLowerCase().includes('player') &&
              !line.toLowerCase().includes('company')
          );
      } else if (section.toLowerCase().includes('news')) {
        research.recentNews = section
          .split('\n')
          .filter(line => line.trim() && !line.toLowerCase().includes('news'));
      } else if (section.toLowerCase().includes('opportunity')) {
        research.opportunities = section
          .split('\n')
          .filter(line => line.trim() && !line.toLowerCase().includes('opportunity'));
      }
    }

    return research;
  }

  private parseContactListsFromResponse(content: string): ContactList[] {
    const lists: ContactList[] = [];

    const lines = content.split('\n');
    let currentList: Partial<ContactList> = {};

    for (const line of lines) {
      if (line.includes('List:') || line.includes('Database:')) {
        if (currentList.name) {
          lists.push(currentList as ContactList);
        }
        currentList = {
          name: line.split(':')[1]?.trim() || 'Unknown',
          contacts: [],
        };
      } else if (line.includes('Description:') || line.includes('About:')) {
        currentList.description = line.split(':')[1]?.trim() || '';
      } else if (line.includes('Source:') || line.includes('Provider:')) {
        currentList.source = line.split(':')[1]?.trim() || '';
      }
    }

    if (currentList.name) {
      lists.push(currentList as ContactList);
    }

    return lists;
  }

  private parseCompetitorAnalysisFromResponse(content: string): {
    outlets: string[];
    journalists: string[];
    strategies: string[];
    opportunities: string[];
  } {
    return {
      outlets:
        content
          .match(/outlet[:\s]+([^\n]+)/gi)
          ?.map(match => match.split(/:\s*/)[1]?.trim())
          .filter((item): item is string => Boolean(item)) || [],
      journalists:
        content
          .match(/journalist[:\s]+([^\n]+)/gi)
          ?.map(match => match.split(/:\s*/)[1]?.trim())
          .filter((item): item is string => Boolean(item)) || [],
      strategies:
        content
          .match(/strategy[:\s]+([^\n]+)/gi)
          ?.map(match => match.split(/:\s*/)[1]?.trim())
          .filter((item): item is string => Boolean(item)) || [],
      opportunities:
        content
          .match(/opportunity[:\s]+([^\n]+)/gi)
          ?.map(match => match.split(/:\s*/)[1]?.trim())
          .filter((item): item is string => Boolean(item)) || [],
    };
  }

  private parsePitchIdeasFromResponse(content: string): Array<{
    angle: string;
    targetOutlets: string[];
    keyMessages: string[];
    timing: string;
  }> {
    const ideas: Array<{
      angle: string;
      targetOutlets: string[];
      keyMessages: string[];
      timing: string;
    }> = [];

    const sections = content.split('\n\n');

    for (const section of sections) {
      if (section.toLowerCase().includes('angle') || section.toLowerCase().includes('idea')) {
        const lines = section.split('\n');
        const idea = {
          angle: '',
          targetOutlets: [] as string[],
          keyMessages: [] as string[],
          timing: '',
        };

        for (const line of lines) {
          if (line.toLowerCase().includes('angle:')) {
            idea.angle = line.split(':')[1]?.trim() || '';
          } else if (line.toLowerCase().includes('outlet')) {
            const outlet = line.split(':')[1]?.trim();
            if (outlet) idea.targetOutlets.push(outlet);
          } else if (line.toLowerCase().includes('message')) {
            const message = line.split(':')[1]?.trim();
            if (message) idea.keyMessages.push(message);
          } else if (line.toLowerCase().includes('timing')) {
            idea.timing = line.split(':')[1]?.trim() || '';
          }
        }

        if (idea.angle) {
          ideas.push(idea);
        }
      }
    }

    return ideas;
  }
}

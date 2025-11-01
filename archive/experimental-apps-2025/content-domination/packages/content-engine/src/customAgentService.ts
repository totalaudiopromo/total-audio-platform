/**
 * Custom Agent Service - Backend service for managing personalized AI agents
 * Handles agent creation, storage, and personalized interactions
 */

import {
  CustomAgent,
  CustomAgentRequest,
  CustomAgentResponse,
  PersonalizedAgentQuery,
  PersonalizedAgentResult,
  AgentInteraction,
  AgentTeamConfig,
} from '../types/customizableAgents';
import {
  generatePersonalizedPrompt,
  getPersonalityGreeting,
  getTemperatureAdjustment,
} from './agentPersonalities';
import axios from 'axios';

// In-memory storage (replace with database in production)
class CustomAgentStore {
  private agents: Map<string, CustomAgent> = new Map();
  private interactions: Map<string, AgentInteraction[]> = new Map();
  private teams: Map<string, AgentTeamConfig> = new Map();

  // Agent CRUD operations
  async createAgent(userId: string, request: CustomAgentRequest): Promise<CustomAgent> {
    const agent: CustomAgent = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...request,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.agents.set(agent.id, agent);
    this.interactions.set(agent.id, []);
    return agent;
  }

  async getAgent(agentId: string): Promise<CustomAgent | null> {
    return this.agents.get(agentId) || null;
  }

  async getUserAgents(userId: string): Promise<CustomAgentResponse[]> {
    const userAgents = Array.from(this.agents.values()).filter(agent => agent.userId === userId);

    return userAgents.map(agent => {
      const interactions = this.interactions.get(agent.id) || [];
      const ratings = interactions
        .filter(i => i.satisfactionRating)
        .map(i => i.satisfactionRating!);

      return {
        ...agent,
        interactionCount: interactions.length,
        averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
        lastUsed: interactions.length > 0 ? interactions[interactions.length - 1].timestamp : null,
      };
    });
  }

  async updateAgent(agentId: string, updates: Partial<CustomAgent>): Promise<CustomAgent | null> {
    const agent = this.agents.get(agentId);
    if (!agent) return null;

    const updatedAgent = {
      ...agent,
      ...updates,
      updatedAt: new Date(),
    };

    this.agents.set(agentId, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(agentId: string): Promise<boolean> {
    const deleted = this.agents.delete(agentId);
    if (deleted) {
      this.interactions.delete(agentId);
    }
    return deleted;
  }

  // Interaction management
  async addInteraction(interaction: Omit<AgentInteraction, 'id'>): Promise<AgentInteraction> {
    const fullInteraction: AgentInteraction = {
      ...interaction,
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const interactions = this.interactions.get(interaction.agentId) || [];
    interactions.push(fullInteraction);
    this.interactions.set(interaction.agentId, interactions);

    return fullInteraction;
  }

  async getAgentInteractions(agentId: string): Promise<AgentInteraction[]> {
    return this.interactions.get(agentId) || [];
  }

  // Team management
  async createTeam(
    userId: string,
    team: Omit<AgentTeamConfig, 'id' | 'userId' | 'createdAt'>
  ): Promise<AgentTeamConfig> {
    const fullTeam: AgentTeamConfig = {
      ...team,
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      createdAt: new Date(),
    };

    this.teams.set(fullTeam.id, fullTeam);
    return fullTeam;
  }

  async getUserTeams(userId: string): Promise<AgentTeamConfig[]> {
    return Array.from(this.teams.values()).filter(team => team.userId === userId);
  }
}

export class CustomAgentService {
  private store: CustomAgentStore;
  private apiBase: string;

  constructor(apiBase: string = '/api') {
    this.store = new CustomAgentStore();
    this.apiBase = apiBase;
  }

  // Public API methods
  async createAgent(userId: string, request: CustomAgentRequest): Promise<CustomAgent> {
    // Validate request
    if (!request.name?.trim()) {
      throw new Error('Agent name is required');
    }

    if (!request.role || !request.avatar || !request.personality || !request.specialization) {
      throw new Error('All agent configuration fields are required');
    }

    return await this.store.createAgent(userId, request);
  }

  async getUserAgents(userId: string): Promise<CustomAgentResponse[]> {
    return await this.store.getUserAgents(userId);
  }

  async updateAgent(
    agentId: string,
    userId: string,
    updates: Partial<CustomAgent>
  ): Promise<CustomAgent> {
    const agent = await this.store.getAgent(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    if (agent.userId !== userId) {
      throw new Error('Unauthorized: Agent belongs to different user');
    }

    const updatedAgent = await this.store.updateAgent(agentId, updates);
    if (!updatedAgent) {
      throw new Error('Failed to update agent');
    }

    return updatedAgent;
  }

  async deleteAgent(agentId: string, userId: string): Promise<void> {
    const agent = await this.store.getAgent(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    if (agent.userId !== userId) {
      throw new Error('Unauthorized: Agent belongs to different user');
    }

    const deleted = await this.store.deleteAgent(agentId);
    if (!deleted) {
      throw new Error('Failed to delete agent');
    }
  }

  async chatWithAgent(
    agentId: string,
    userId: string,
    query: string,
    context?: any
  ): Promise<PersonalizedAgentResult> {
    const agent = await this.store.getAgent(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    if (agent.userId !== userId) {
      throw new Error('Unauthorized: Agent belongs to different user');
    }

    if (!agent.isActive) {
      throw new Error('Agent is not active');
    }

    try {
      // Generate personalized prompt
      const basePrompt = this.getBasePromptForRole(agent.role);
      const personalizedPrompt = generatePersonalizedPrompt(
        basePrompt,
        agent.personality,
        agent.specialization,
        agent.name
      );

      // Add custom instructions if provided
      const fullPrompt = agent.customInstructions
        ? `${personalizedPrompt}\n\nCustom Instructions: ${agent.customInstructions}`
        : personalizedPrompt;

      // Make API call to AI service
      const response = await this.callAIService(agent.role, query, fullPrompt, agent, context);

      // Log interaction
      await this.store.addInteraction({
        agentId: agent.id,
        userId: userId,
        query: query,
        response: response.response,
        timestamp: new Date(),
      });

      return {
        success: true,
        response: response.response,
        agentName: agent.name,
        personality: agent.personality,
        avatar: agent.avatar,
        recommendations: response.recommendations,
        nextSteps: response.nextSteps,
        data: response.data,
      };
    } catch (error) {
      console.error('Agent chat error:', error);
      return {
        success: false,
        response: `Sorry, I encountered an error. Please try again.`,
        agentName: agent.name,
        personality: agent.personality,
        avatar: agent.avatar,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async rateInteraction(interactionId: string, rating: number): Promise<void> {
    // Find and update interaction rating
    const allAgents = await this.store.getUserAgents('system'); // Get all agents to search through
    for (const agent of allAgents) {
      const interactions = await this.store.getAgentInteractions(agent.id);
      const interaction = interactions.find(i => i.id === interactionId);
      if (interaction) {
        interaction.satisfactionRating = Math.max(1, Math.min(5, rating));
        break;
      }
    }
  }

  async getAgentAnalytics(
    agentId: string,
    userId: string
  ): Promise<{
    totalInteractions: number;
    averageRating: number;
    commonQueries: string[];
    lastUsed: Date | null;
    performanceMetrics: any;
  }> {
    const agent = await this.store.getAgent(agentId);
    if (!agent || agent.userId !== userId) {
      throw new Error('Agent not found or unauthorized');
    }

    const interactions = await this.store.getAgentInteractions(agentId);
    const ratings = interactions.filter(i => i.satisfactionRating).map(i => i.satisfactionRating!);

    // Analyze common query patterns
    const queryWords = interactions.map(i => i.query.toLowerCase().split(' ')).flat();
    const wordFreq = queryWords.reduce(
      (freq, word) => {
        freq[word] = (freq[word] || 0) + 1;
        return freq;
      },
      {} as Record<string, number>
    );

    const commonQueries = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    return {
      totalInteractions: interactions.length,
      averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      commonQueries,
      lastUsed: interactions.length > 0 ? interactions[interactions.length - 1].timestamp : null,
      performanceMetrics: {
        responseTimes: [], // Would track actual response times
        successRate: 0.95, // Mock success rate
        userSatisfaction:
          ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length / 5 : 0,
      },
    };
  }

  // Team management
  async createTeam(
    userId: string,
    team: Omit<AgentTeamConfig, 'id' | 'userId' | 'createdAt'>
  ): Promise<AgentTeamConfig> {
    // Validate that all agents belong to the user
    const userAgents = await this.store.getUserAgents(userId);
    const userAgentIds = userAgents.map(a => a.id);

    const invalidAgents = team.agents.filter(agentId => !userAgentIds.includes(agentId));
    if (invalidAgents.length > 0) {
      throw new Error(`Invalid agent IDs: ${invalidAgents.join(', ')}`);
    }

    return await this.store.createTeam(userId, team);
  }

  async getUserTeams(userId: string): Promise<AgentTeamConfig[]> {
    return await this.store.getUserTeams(userId);
  }

  // Private helper methods
  private getBasePromptForRole(role: string): string {
    const prompts: Record<string, string> = {
      'content-generation-agent':
        'Create professional music industry content including press releases, social media posts, and marketing materials.',
      'analytics-agent':
        'Analyze music industry data and provide actionable insights for performance optimization.',
      'intel-research-agent':
        'Research industry contacts, competitive intelligence, and market opportunities.',
      'music-industry-strategist':
        'Provide strategic guidance for music career development and industry positioning.',
      'campaign-planner-agent': 'Plan and coordinate comprehensive music promotion campaigns.',
      'social-media-agent': 'Manage social media strategy and engagement for music artists.',
      'music-marketing-mastermind':
        'Develop comprehensive marketing strategies for music promotion.',
      'growth-hacking-optimizer': 'Implement growth hacking tactics for rapid audience growth.',
      'viral-content-automation': 'Create content designed to achieve viral distribution.',
      'radio-promo-agent': 'Handle radio promotion and playlist placement strategies.',
    };

    return prompts[role] || 'Provide expert music industry advice and assistance.';
  }

  private async callAIService(
    role: string,
    query: string,
    personalizedPrompt: string,
    agent: CustomAgent,
    context?: any
  ): Promise<any> {
    const temperatureAdjustment = getTemperatureAdjustment(agent.personality);
    const baseTemperature = 0.3;
    const adjustedTemperature = Math.max(
      0.1,
      Math.min(1.0, baseTemperature + temperatureAdjustment)
    );

    // Add personality greeting to response
    const greeting = getPersonalityGreeting(agent.personality);
    const enhancedPrompt = `${personalizedPrompt}\n\nStart your response with this greeting style: "${greeting}"\n\nUser Query: ${query}`;

    try {
      const response = await axios.post(`${this.apiBase}/ai-agent`, {
        agentType: role,
        query: enhancedPrompt,
        context,
        personalizedSettings: {
          agentName: agent.name,
          personality: agent.personality,
          specialization: agent.specialization,
          temperature: adjustedTemperature,
        },
      });

      return response.data;
    } catch (error) {
      console.error('AI service call failed:', error);
      throw new Error('Failed to get response from AI service');
    }
  }
}

// Singleton instance
let customAgentService: CustomAgentService | null = null;

export function getCustomAgentService(apiBase?: string): CustomAgentService {
  if (!customAgentService) {
    customAgentService = new CustomAgentService(apiBase);
  }
  return customAgentService;
}

export default CustomAgentService;

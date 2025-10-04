import Anthropic from '@anthropic-ai/sdk';
import { EventEmitter } from 'events';

/**
 * Base Streaming Agent Class
 *
 * Provides foundation for all Total Audio agents with:
 * - Streaming support for real-time progress
 * - Prompt caching for cost efficiency
 * - Agentic loops for autonomous execution
 * - Event emission for Command Centre integration
 * - Tool orchestration support
 *
 * @example
 * class ContactEnrichmentAgent extends StreamingAgent {
 *   constructor() {
 *     super('ContactEnrichment', CACHED_CONTEXT, TOOLS);
 *   }
 *
 *   async enrichContact(contactId: string) {
 *     return await this.executeAgenticLoop(
 *       `Enrich contact ${contactId}`,
 *       { maxIterations: 10 }
 *     );
 *   }
 * }
 */
export abstract class StreamingAgent extends EventEmitter {
  protected client: Anthropic;
  protected model: string;
  protected cachedSystemPrompt: Anthropic.Messages.CacheControlEphemeral[];

  constructor(
    protected agentName: string,
    protected systemPrompt: string | Anthropic.Messages.SystemMessageParam[],
    protected tools: Anthropic.Tool[] = [],
    protected modelName: string = 'claude-sonnet-4-20250514'
  ) {
    super();

    // Initialize Anthropic client
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    this.model = modelName;

    // Build cached system prompt
    this.cachedSystemPrompt = this.buildCachedSystemPrompt();
  }

  /**
   * Build cached system prompt with cache control
   */
  protected buildCachedSystemPrompt(): Anthropic.Messages.CacheControlEphemeral[] {
    if (typeof this.systemPrompt === 'string') {
      const contextText = this.buildSystemContext();
      return [{
        type: 'text' as const,
        text: contextText,
        cache_control: { type: 'ephemeral' as const }
      }];
    }

    // If already an array of system messages, add cache control to last item
    const messages = [...this.systemPrompt];
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if ('cache_control' in lastMessage) {
        // Already has cache control
        return messages as Anthropic.Messages.CacheControlEphemeral[];
      } else {
        // Add cache control to last message
        messages[messages.length - 1] = {
          ...lastMessage,
          cache_control: { type: 'ephemeral' as const }
        };
      }
    }

    return messages as Anthropic.Messages.CacheControlEphemeral[];
  }

  /**
   * Build system context - override in subclasses
   */
  protected buildSystemContext(): string {
    if (typeof this.systemPrompt === 'string') {
      return this.systemPrompt;
    }

    // Combine all text messages
    return this.systemPrompt
      .filter(msg => msg.type === 'text')
      .map(msg => 'text' in msg ? msg.text : '')
      .join('\n\n');
  }

  /**
   * Execute with streaming for real-time progress
   */
  protected async executeWithStreaming(
    userMessage: string,
    conversationHistory: Anthropic.MessageParam[] = [],
    options: {
      maxTokens?: number;
      temperature?: number;
      thinking?: { type: 'enabled'; budget_tokens: number };
    } = {}
  ): Promise<Anthropic.Message> {
    this.emit('start', {
      agent: this.agentName,
      timestamp: new Date()
    });

    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature,
      system: this.cachedSystemPrompt,
      tools: this.tools.length > 0 ? this.tools : undefined,
      messages: [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ],
      ...(options.thinking && { thinking: options.thinking })
    });

    // Emit progress events for dashboard integration
    stream.on('text', (textDelta) => {
      this.emit('progress', {
        agent: this.agentName,
        type: 'text',
        delta: textDelta,
        timestamp: new Date()
      });
    });

    stream.on('content_block_start', (event) => {
      this.emit('content_block_start', {
        agent: this.agentName,
        event,
        timestamp: new Date()
      });
    });

    stream.on('content_block_delta', (event) => {
      this.emit('content_block_delta', {
        agent: this.agentName,
        delta: event.delta,
        timestamp: new Date()
      });
    });

    stream.on('message_stop', () => {
      this.emit('complete', {
        agent: this.agentName,
        timestamp: new Date()
      });
    });

    stream.on('error', (error) => {
      this.emit('error', {
        agent: this.agentName,
        error: error.message,
        timestamp: new Date()
      });
    });

    const finalMessage = await stream.finalMessage();

    return finalMessage;
  }

  /**
   * Execute agentic loop with tool use
   *
   * Allows agent to autonomously use tools to complete complex tasks
   */
  protected async executeAgenticLoop(
    task: string,
    options: {
      maxIterations?: number;
      temperature?: number;
      thinking?: { type: 'enabled'; budget_tokens: number };
      onToolUse?: (toolName: string, toolInput: any) => void;
    } = {}
  ): Promise<any> {
    const maxIterations = options.maxIterations || 10;
    const conversationHistory: Anthropic.MessageParam[] = [];
    let iteration = 0;
    let taskComplete = false;

    this.emit('agentic_loop_start', {
      agent: this.agentName,
      task,
      maxIterations,
      timestamp: new Date()
    });

    while (!taskComplete && iteration < maxIterations) {
      this.emit('agentic_iteration', {
        agent: this.agentName,
        iteration: iteration + 1,
        maxIterations,
        timestamp: new Date()
      });

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        temperature: options.temperature,
        system: this.cachedSystemPrompt,
        tools: this.tools,
        messages: [
          ...conversationHistory,
          { role: 'user', content: task }
        ],
        ...(options.thinking && { thinking: options.thinking })
      });

      conversationHistory.push({
        role: 'assistant',
        content: response.content
      });

      // Handle tool use
      if (response.stop_reason === 'tool_use') {
        const toolResults = await this.executeTools(response.content, options.onToolUse);
        conversationHistory.push({
          role: 'user',
          content: toolResults
        });
        iteration++;
        continue;
      }

      // Task complete
      taskComplete = true;

      this.emit('agentic_loop_complete', {
        agent: this.agentName,
        iterations: iteration + 1,
        timestamp: new Date()
      });

      return this.extractResult(response);
    }

    const error = new Error(`Agent ${this.agentName} exceeded max iterations (${maxIterations})`);
    this.emit('agentic_loop_error', {
      agent: this.agentName,
      error: error.message,
      iterations: iteration,
      timestamp: new Date()
    });

    throw error;
  }

  /**
   * Execute tools - must be implemented by subclasses that use tools
   */
  protected async executeTools(
    content: Anthropic.ContentBlock[],
    onToolUse?: (toolName: string, toolInput: any) => void
  ): Promise<Anthropic.ToolResultBlockParam[]> {
    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of content) {
      if (block.type === 'tool_use') {
        this.emit('tool_use', {
          agent: this.agentName,
          toolName: block.name,
          toolInput: block.input,
          timestamp: new Date()
        });

        if (onToolUse) {
          onToolUse(block.name, block.input);
        }

        try {
          const result = await this.handleToolCall(block.name, block.input);

          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result)
          });

          this.emit('tool_result', {
            agent: this.agentName,
            toolName: block.name,
            success: true,
            timestamp: new Date()
          });
        } catch (error: any) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify({ error: error.message }),
            is_error: true
          });

          this.emit('tool_error', {
            agent: this.agentName,
            toolName: block.name,
            error: error.message,
            timestamp: new Date()
          });
        }
      }
    }

    return toolResults;
  }

  /**
   * Handle individual tool call - override in subclasses
   */
  protected async handleToolCall(toolName: string, toolInput: any): Promise<any> {
    throw new Error(`Tool handler not implemented for ${toolName} in ${this.agentName}`);
  }

  /**
   * Extract result from response - override in subclasses
   */
  protected extractResult(response: Anthropic.Message): any {
    // Default: return text content
    const textBlocks = response.content.filter(block => block.type === 'text');
    if (textBlocks.length > 0) {
      return textBlocks.map(block => 'text' in block ? block.text : '').join('\n');
    }
    return null;
  }

  /**
   * Get usage statistics for cost tracking
   */
  protected getUsageFromResponse(response: Anthropic.Message): {
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
  } {
    const usage = response.usage;
    return {
      inputTokens: usage.input_tokens || 0,
      outputTokens: usage.output_tokens || 0,
      cacheCreationTokens: (usage as any).cache_creation_input_tokens || 0,
      cacheReadTokens: (usage as any).cache_read_input_tokens || 0
    };
  }

  /**
   * Simple non-streaming execution (for backwards compatibility)
   */
  protected async execute(
    userMessage: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      thinking?: { type: 'enabled'; budget_tokens: number };
    } = {}
  ): Promise<Anthropic.Message> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature,
      system: this.cachedSystemPrompt,
      tools: this.tools.length > 0 ? this.tools : undefined,
      messages: [{ role: 'user', content: userMessage }],
      ...(options.thinking && { thinking: options.thinking })
    });

    return response;
  }
}

/**
 * Agent Event Types for TypeScript type safety
 */
export interface AgentEvent {
  agent: string;
  timestamp: Date;
}

export interface AgentStartEvent extends AgentEvent {
  type: 'start';
}

export interface AgentProgressEvent extends AgentEvent {
  type: 'progress';
  delta: any;
}

export interface AgentCompleteEvent extends AgentEvent {
  type: 'complete';
}

export interface AgentErrorEvent extends AgentEvent {
  type: 'error';
  error: string;
}

export interface AgentToolUseEvent extends AgentEvent {
  type: 'tool_use';
  toolName: string;
  toolInput: any;
}

export interface AgentToolResultEvent extends AgentEvent {
  type: 'tool_result';
  toolName: string;
  success: boolean;
}

export interface AgenticLoopStartEvent extends AgentEvent {
  type: 'agentic_loop_start';
  task: string;
  maxIterations: number;
}

export interface AgenticLoopCompleteEvent extends AgentEvent {
  type: 'agentic_loop_complete';
  iterations: number;
}

/**
 * MeshOS Message Router
 * Routes messages between systems and engines
 */

import type { MeshMessage, MessageSource, MessageTarget, MessageType } from '../types';
import { logger } from '../utils/logger';
import { now } from '../utils/time';

export class MessageRouter {
  private workspaceId: string;
  private messageStore: any; // Will be injected

  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
    logger.setContext('MessageRouter');
  }

  /**
   * Set message store for persistence
   */
  setMessageStore(store: any): void {
    this.messageStore = store;
  }

  /**
   * Route a message to the appropriate engine/system
   */
  async routeMessage(message: Omit<MeshMessage, 'id' | 'workspace_id' | 'created_at' | 'status'>): Promise<string> {
    const fullMessage: Partial<MeshMessage> = {
      ...message,
      workspace_id: this.workspaceId,
      status: 'pending',
      created_at: now(),
    };

    // Persist message
    const messageId = await this.messageStore?.createMessage(fullMessage);

    logger.info(`Routing message from ${message.source} to ${message.target}`, {
      type: message.type,
      messageId,
    });

    // Route based on target
    switch (message.target) {
      case 'planning':
        await this.routeToPlanningEngine(fullMessage);
        break;
      case 'negotiation':
        await this.routeToNegotiationEngine(fullMessage);
        break;
      case 'drift':
        await this.routeToDriftEngine(fullMessage);
        break;
      case 'insight':
        await this.routeToInsightRouter(fullMessage);
        break;
      case 'policy':
        await this.routeToPolicyEngine(fullMessage);
        break;
      case 'context':
        await this.routeToContextEngine(fullMessage);
        break;
      default:
        logger.warn(`Unknown target: ${message.target}`);
    }

    return messageId;
  }

  /**
   * Send a message from one system to another
   */
  async sendMessage(params: {
    source: MessageSource;
    target: MessageTarget;
    type: MessageType;
    payload: Record<string, any>;
  }): Promise<string> {
    return this.routeMessage(params);
  }

  /**
   * Get messages for a system
   */
  async getMessagesForSystem(system: MessageSource | MessageTarget, limit = 50): Promise<MeshMessage[]> {
    if (!this.messageStore) return [];

    const messages = await this.messageStore.getMessages({
      workspace_id: this.workspaceId,
      source: system,
      limit,
    });

    return messages;
  }

  /**
   * Mark message as processed
   */
  async markProcessed(messageId: string, result: Record<string, any>): Promise<void> {
    if (!this.messageStore) return;

    await this.messageStore.updateMessage(messageId, {
      status: 'completed',
      result,
      processed_at: now(),
    });
  }

  /**
   * Mark message as failed
   */
  async markFailed(messageId: string, error: string): Promise<void> {
    if (!this.messageStore) return;

    await this.messageStore.updateMessage(messageId, {
      status: 'failed',
      result: { error },
      processed_at: now(),
    });
  }

  // Private routing methods
  private async routeToPlanningEngine(message: Partial<MeshMessage>): Promise<void> {
    // Delegate to planning engine
    logger.debug('Routing to planning engine', message);
  }

  private async routeToNegotiationEngine(message: Partial<MeshMessage>): Promise<void> {
    // Delegate to negotiation engine
    logger.debug('Routing to negotiation engine', message);
  }

  private async routeToDriftEngine(message: Partial<MeshMessage>): Promise<void> {
    // Delegate to drift engine
    logger.debug('Routing to drift engine', message);
  }

  private async routeToInsightRouter(message: Partial<MeshMessage>): Promise<void> {
    // Delegate to insight router
    logger.debug('Routing to insight router', message);
  }

  private async routeToPolicyEngine(message: Partial<MeshMessage>): Promise<void> {
    // Delegate to policy engine
    logger.debug('Routing to policy engine', message);
  }

  private async routeToContextEngine(message: Partial<MeshMessage>): Promise<void> {
    // Delegate to global context engine
    logger.debug('Routing to context engine', message);
  }
}

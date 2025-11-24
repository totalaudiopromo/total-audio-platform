/**
 * MessageRouter Tests
 * Tests for cross-system messaging
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MessageRouter } from '../src/engines/messageRouter';
import { MeshMessageStore } from '../src/stores/meshMessageStore';

describe('MessageRouter', () => {
  let messageRouter: MessageRouter;
  let mockStore: any;
  const workspaceId = 'test-workspace-123';

  beforeEach(() => {
    messageRouter = new MessageRouter(workspaceId);

    // Mock message store
    mockStore = {
      createMessage: vi.fn().mockResolvedValue('message-123'),
      updateMessage: vi.fn().mockResolvedValue(undefined),
    };

    messageRouter.setMessageStore(mockStore);
  });

  it('should send a message', async () => {
    const messageId = await messageRouter.sendMessage({
      source: 'autopilot',
      target: 'planning',
      type: 'request',
      payload: { action: 'generate_plan', timeframe: '7d' },
    });

    expect(messageId).toBe('message-123');
    expect(mockStore.createMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        workspace_id: workspaceId,
        source: 'autopilot',
        target: 'planning',
        type: 'request',
        status: 'pending',
      })
    );
  });

  it('should route a message', async () => {
    const message = {
      id: 'msg-1',
      workspace_id: workspaceId,
      source: 'mal' as const,
      target: 'drift' as const,
      type: 'notification' as const,
      payload: { event: 'drift_detected' },
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    const messageId = await messageRouter.routeMessage(message);

    expect(messageId).toBe('msg-1');
  });

  it('should mark message as processed', async () => {
    await messageRouter.markProcessed('msg-1', { success: true });

    expect(mockStore.updateMessage).toHaveBeenCalledWith('msg-1', {
      status: 'processed',
      result: { success: true },
      processed_at: expect.any(String),
    });
  });

  it('should mark message as failed', async () => {
    const error = new Error('Processing failed');

    await messageRouter.markFailed('msg-1', error);

    expect(mockStore.updateMessage).toHaveBeenCalledWith('msg-1', {
      status: 'failed',
      result: { error: 'Processing failed' },
      processed_at: expect.any(String),
    });
  });
});

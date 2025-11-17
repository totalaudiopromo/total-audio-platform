/**
 * Adapter Tests
 * Tests for READ-ONLY adapter pattern
 */

import { describe, it, expect } from 'vitest';
import { BaseAdapter } from '../src/adapters/baseAdapter';
import { AutopilotAdapter } from '../src/adapters/autopilotAdapter';
import { MalAdapter } from '../src/adapters/malAdapter';

describe('BaseAdapter', () => {
  it('should enforce READ-ONLY configuration', () => {
    expect(() => {
      class TestAdapter extends BaseAdapter {
        async getState() {
          return this.wrapResult({});
        }
      }

      // This should throw because read_only is not true
      new TestAdapter('test', {
        workspace_id: 'workspace-123',
        read_only: false,
      });
    }).toThrow('TestAdapter MUST be read-only');
  });

  it('should allow READ-ONLY configuration', () => {
    class TestAdapter extends BaseAdapter {
      async getState() {
        return this.wrapResult({});
      }
    }

    const adapter = new TestAdapter('test', {
      workspace_id: 'workspace-123',
      read_only: true,
    });

    expect(adapter).toBeDefined();
  });

  it('should wrap results with success status', async () => {
    class TestAdapter extends BaseAdapter {
      async getState() {
        return this.wrapResult({ data: 'test' });
      }
    }

    const adapter = new TestAdapter('test', {
      workspace_id: 'workspace-123',
      read_only: true,
    });

    const result = await adapter.getState();

    expect(result).toMatchObject({
      success: true,
      data: { data: 'test' },
      timestamp: expect.any(String),
    });
  });

  it('should handle errors gracefully', async () => {
    class TestAdapter extends BaseAdapter {
      async getState() {
        return this.safeRead(async () => {
          throw new Error('Test error');
        });
      }
    }

    const adapter = new TestAdapter('test', {
      workspace_id: 'workspace-123',
      read_only: true,
    });

    const result = await adapter.getState();

    expect(result).toMatchObject({
      success: false,
      error: 'Test error',
    });
  });
});

describe('AutopilotAdapter', () => {
  it('should be READ-ONLY by default', () => {
    const adapter = new AutopilotAdapter({
      workspace_id: 'workspace-123',
      read_only: true,
    });

    expect(adapter).toBeDefined();
  });

  it('should get autopilot state', async () => {
    const adapter = new AutopilotAdapter({
      workspace_id: 'workspace-123',
      read_only: true,
    });

    const result = await adapter.getState();

    expect(result).toMatchObject({
      success: expect.any(Boolean),
      timestamp: expect.any(String),
    });
  });
});

describe('MalAdapter', () => {
  it('should be READ-ONLY by default', () => {
    const adapter = new MalAdapter({
      workspace_id: 'workspace-123',
      read_only: true,
    });

    expect(adapter).toBeDefined();
  });

  it('should get MAL state', async () => {
    const adapter = new MalAdapter({
      workspace_id: 'workspace-123',
      read_only: true,
    });

    const result = await adapter.getState();

    expect(result).toMatchObject({
      success: expect.any(Boolean),
      timestamp: expect.any(String),
    });
  });
});

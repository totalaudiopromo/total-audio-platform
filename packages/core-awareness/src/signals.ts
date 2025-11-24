/**
 * Signals
 * Push signals to downstream systems
 */

import type { AwarenessSignal, TargetSystem } from './types';
import { createSignal } from './awarenessStore';
import { logger } from './utils/logger';

export async function pushSignal(
  targetSystem: TargetSystem,
  signalType: string,
  payload: Record<string, any>,
  options?: {
    workspaceId?: string | null;
    userId?: string | null;
    confidence?: number;
  }
): Promise<AwarenessSignal> {
  const signal = await createSignal({
    workspaceId: options?.workspaceId || null,
    userId: options?.userId || null,
    targetSystem,
    signalType,
    payload,
    confidence: options?.confidence || 0.75,
    status: 'pending',
  });

  logger.info('Signal pushed', {
    id: signal.id,
    target: targetSystem,
    type: signalType,
  });

  return signal;
}

export async function pushToIdentityKernel(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('identity_kernel', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

export async function pushToCMG(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('cmg', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

export async function pushToScenesEngine(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('scenes_engine', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

export async function pushToAutopilot(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('autopilot', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

export async function pushToMAL(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('mal', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

export async function pushToDashboard(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('dashboard', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

export async function pushToCIS(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('cis', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

export async function pushToMIG(
  signal: Omit<AwarenessSignal, 'id' | 'targetSystem' | 'createdAt' | 'actionedAt'>
): Promise<AwarenessSignal> {
  return pushSignal('mig', signal.signalType, signal.payload, {
    workspaceId: signal.workspaceId,
    userId: signal.userId,
    confidence: signal.confidence,
  });
}

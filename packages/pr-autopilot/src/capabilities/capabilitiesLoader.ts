/**
 * Capabilities Loader
 *
 * Loads and exposes agent capability manifests
 */

import type { AgentRole } from '../types';

import strategistCap from './strategist.json';
import pitchCap from './pitch.json';
import contactCap from './contact.json';
import schedulerCap from './scheduler.json';
import followupCap from './followup.json';
import analystCap from './analyst.json';
import archivistCap from './archivist.json';
import simulatorCap from './simulator.json';
import coordinatorCap from './coordinator.json';

export interface AgentCapability {
  name: string;
  version: string;
  description: string;
  input: string[];
  output: string[];
  tools: string[];
  risks: string[];
  permissions: {
    write: string[];
    read: string[];
  };
  requiresApproval: string[];
  estimatedDuration: string;
  dependencies: string[];
  maxRetries: number;
}

const capabilities: Record<AgentRole, AgentCapability> = {
  strategist: strategistCap as AgentCapability,
  pitch: pitchCap as AgentCapability,
  contact: contactCap as AgentCapability,
  scheduler: schedulerCap as AgentCapability,
  followup: followupCap as AgentCapability,
  analyst: analystCap as AgentCapability,
  archivist: archivistCap as AgentCapability,
  simulator: simulatorCap as AgentCapability,
  coordinator: coordinatorCap as AgentCapability,
};

/**
 * Get capability manifest for an agent
 */
export function getCapability(agentRole: AgentRole): AgentCapability {
  return capabilities[agentRole];
}

/**
 * Get all capabilities
 */
export function getAllCapabilities(): Record<AgentRole, AgentCapability> {
  return capabilities;
}

/**
 * Check if agent has permission
 */
export function hasPermission(
  agentRole: AgentRole,
  action: 'read' | 'write',
  resource: string
): boolean {
  const capability = getCapability(agentRole);
  return capability.permissions[action].includes(resource);
}

/**
 * Check if action requires approval
 */
export function requiresApproval(
  agentRole: AgentRole,
  actionType: string
): boolean {
  const capability = getCapability(agentRole);
  return capability.requiresApproval.includes(actionType);
}

/**
 * Get agent risk factors
 */
export function getRisks(agentRole: AgentRole): string[] {
  const capability = getCapability(agentRole);
  return capability.risks;
}

/**
 * Validate agent dependencies are met
 */
export function validateDependencies(
  agentRole: AgentRole,
  completedAgents: string[]
): { valid: boolean; missing: string[] } {
  const capability = getCapability(agentRole);
  const missing = capability.dependencies.filter(
    (dep) => !completedAgents.includes(dep)
  );

  return {
    valid: missing.length === 0,
    missing,
  };
}

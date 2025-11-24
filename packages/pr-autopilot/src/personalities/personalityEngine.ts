/**
 * Personality Engine
 *
 * Attaches personalities to agents and enforces behavioral consistency
 */

import type { AgentRole } from '../types';

import strategistProfile from './strategist.profile.json';
import pitchProfile from './pitch.profile.json';
import contactProfile from './contact.profile.json';
import schedulerProfile from './scheduler.profile.json';
import followupProfile from './followup.profile.json';
import analystProfile from './analyst.profile.json';
import archivistProfile from './archivist.profile.json';
import simulatorProfile from './simulator.profile.json';
import coordinatorProfile from './coordinator.profile.json';

export interface EscalationRule {
  condition: string;
  action: string;
  threshold: number;
}

export interface PersonalityProfile {
  agent: string;
  tone: string;
  voiceCharacteristics: {
    formality: number;
    directness: number;
    optimism: number;
    creativity: number;
  };
  riskTolerance: number;
  decisionStyle: string;
  escalationRules: EscalationRule[];
  refusalRules: string[];
  consistencyTraits: string[];
  communicationStyle: {
    verbosity: number;
    technicalDepth: number;
    empathy: number;
  };
  adaptiveBehavior: {
    learnsFromFailures: boolean;
    adjustsRiskTolerance: boolean;
    maintainsConsistency: boolean;
  };
}

const profiles: Record<AgentRole, PersonalityProfile> = {
  strategist: strategistProfile as PersonalityProfile,
  pitch: pitchProfile as PersonalityProfile,
  contact: contactProfile as PersonalityProfile,
  scheduler: schedulerProfile as PersonalityProfile,
  followup: followupProfile as PersonalityProfile,
  analyst: analystProfile as PersonalityProfile,
  archivist: archivistProfile as PersonalityProfile,
  simulator: simulatorProfile as PersonalityProfile,
  coordinator: coordinatorProfile as PersonalityProfile,
};

/**
 * Get personality profile for an agent
 */
export function getPersonality(agentRole: AgentRole): PersonalityProfile {
  return profiles[agentRole];
}

/**
 * Check if action should be escalated
 */
export function shouldEscalate(
  agentRole: AgentRole,
  condition: string,
  value: number
): { escalate: boolean; action?: string } {
  const profile = getPersonality(agentRole);
  const rule = profile.escalationRules.find((r) => r.condition === condition);

  if (!rule) {
    return { escalate: false };
  }

  return {
    escalate: value >= rule.threshold,
    action: rule.action,
  };
}

/**
 * Check if action should be refused
 */
export function shouldRefuse(
  agentRole: AgentRole,
  condition: string
): boolean {
  const profile = getPersonality(agentRole);
  return profile.refusalRules.includes(condition);
}

/**
 * Get risk-adjusted confidence score
 */
export function adjustConfidenceForRisk(
  agentRole: AgentRole,
  baseConfidence: number,
  riskLevel: number
): number {
  const profile = getPersonality(agentRole);
  const riskTolerance = profile.riskTolerance;

  // If risk exceeds tolerance, reduce confidence
  if (riskLevel > riskTolerance) {
    const penalty = (riskLevel - riskTolerance) * 0.5;
    return Math.max(0, baseConfidence - penalty);
  }

  return baseConfidence;
}

/**
 * Format output message according to personality
 */
export function formatMessage(
  agentRole: AgentRole,
  message: string,
  context?: string
): string {
  const profile = getPersonality(agentRole);
  const { verbosity, technicalDepth, empathy } = profile.communicationStyle;

  // Simple formatting based on verbosity
  // In production, this would use an LLM to rewrite
  let formatted = message;

  if (verbosity < 0.5) {
    // Concise
    formatted = message.split('.')[0] + '.';
  }

  if (empathy > 0.7) {
    // Add empathetic framing
    formatted = `I understand this is important. ${formatted}`;
  }

  return formatted;
}

/**
 * Apply adaptive behavior adjustments
 */
export function applyAdaptiveBehavior(
  agentRole: AgentRole,
  failures: number,
  currentRiskTolerance: number
): number {
  const profile = getPersonality(agentRole);

  if (!profile.adaptiveBehavior.adjustsRiskTolerance) {
    return currentRiskTolerance;
  }

  if (profile.adaptiveBehavior.learnsFromFailures && failures > 0) {
    // Reduce risk tolerance after failures
    return Math.max(0.1, currentRiskTolerance - failures * 0.05);
  }

  return currentRiskTolerance;
}

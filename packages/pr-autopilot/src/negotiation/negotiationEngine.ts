/**
 * Agent Negotiation Engine
 *
 * Enables agents to negotiate and resolve conflicts when they disagree
 */

import type { AgentRole } from '../types';
import { getPersonality } from '../personalities/personalityEngine';

export type ConflictType =
  | 'timing_conflict' // Agents disagree on when to act
  | 'priority_conflict' // Agents disagree on task priority
  | 'approach_conflict' // Agents disagree on strategy/approach
  | 'resource_conflict' // Agents compete for limited resources
  | 'policy_conflict'; // Action violates conflicting policies

export interface Conflict {
  id: string;
  type: ConflictType;
  agents: AgentRole[];
  positions: Record<AgentRole, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  context: Record<string, unknown>;
}

export interface NegotiationRound {
  round: number;
  proposals: Record<AgentRole, unknown>;
  votes: Record<AgentRole, 'accept' | 'reject' | 'counter'>;
  timestamp: string;
}

export interface NegotiationResult {
  resolved: boolean;
  resolution?: unknown;
  strategy: 'consensus' | 'majority_vote' | 'coordinator_override' | 'escalate_human';
  rounds: NegotiationRound[];
  finalDecision: unknown;
  reasoning: string[];
}

/**
 * Initiate negotiation between conflicting agents
 */
export async function negotiateConflict(
  conflict: Conflict,
  maxRounds: number = 3
): Promise<NegotiationResult> {
  const rounds: NegotiationRound[] = [];
  const reasoning: string[] = [];

  reasoning.push(
    `Conflict detected: ${conflict.type} involving ${conflict.agents.join(', ')}`
  );

  // Round 1: Each agent states initial position
  const round1 = initiateNegotiation(conflict);
  rounds.push(round1);

  // Check for immediate consensus
  if (hasConsensus(round1)) {
    reasoning.push('Consensus reached in first round');
    return {
      resolved: true,
      resolution: extractConsensus(round1),
      strategy: 'consensus',
      rounds,
      finalDecision: extractConsensus(round1),
      reasoning,
    };
  }

  // Rounds 2-N: Agents negotiate
  for (let roundNum = 2; roundNum <= maxRounds; roundNum++) {
    const previousRound = rounds[rounds.length - 1];
    const nextRound = conductNegotiationRound(conflict, previousRound, roundNum);
    rounds.push(nextRound);

    if (hasConsensus(nextRound)) {
      reasoning.push(`Consensus reached in round ${roundNum}`);
      return {
        resolved: true,
        resolution: extractConsensus(nextRound),
        strategy: 'consensus',
        rounds,
        finalDecision: extractConsensus(nextRound),
        reasoning,
      };
    }

    if (hasMajority(nextRound)) {
      reasoning.push(`Majority agreement reached in round ${roundNum}`);
      return {
        resolved: true,
        resolution: extractMajority(nextRound),
        strategy: 'majority_vote',
        rounds,
        finalDecision: extractMajority(nextRound),
        reasoning,
      };
    }
  }

  // No consensus after max rounds - escalate based on severity
  if (conflict.severity === 'critical') {
    reasoning.push('Critical conflict - escalating to human');
    return {
      resolved: false,
      strategy: 'escalate_human',
      rounds,
      finalDecision: null,
      reasoning,
    };
  }

  // Coordinator override for non-critical conflicts
  reasoning.push('No consensus - coordinator making final decision');
  const coordinatorDecision = coordinatorOverride(conflict, rounds);

  return {
    resolved: true,
    resolution: coordinatorDecision,
    strategy: 'coordinator_override',
    rounds,
    finalDecision: coordinatorDecision,
    reasoning,
  };
}

/**
 * Start negotiation - agents state initial positions
 */
function initiateNegotiation(conflict: Conflict): NegotiationRound {
  const proposals: Record<AgentRole, unknown> = {} as Record<AgentRole, unknown>;
  const votes: Record<AgentRole, 'accept' | 'reject' | 'counter'> = {} as Record<
    AgentRole,
    'accept' | 'reject' | 'counter'
  >;

  conflict.agents.forEach((agent) => {
    proposals[agent] = conflict.positions[agent];
    votes[agent] = 'counter'; // Initially all agents propose their position
  });

  return {
    round: 1,
    proposals,
    votes,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Conduct a negotiation round
 */
function conductNegotiationRound(
  conflict: Conflict,
  previousRound: NegotiationRound,
  roundNumber: number
): NegotiationRound {
  const proposals: Record<AgentRole, unknown> = {} as Record<AgentRole, unknown>;
  const votes: Record<AgentRole, 'accept' | 'reject' | 'counter'> = {} as Record<
    AgentRole,
    'accept' | 'reject' | 'counter'
  >;

  conflict.agents.forEach((agent) => {
    const personality = getPersonality(agent);

    // More agreeable agents are more likely to compromise
    const agreeableness = 1 - personality.riskTolerance;

    if (agreeableness > 0.7) {
      // High agreeableness - find middle ground
      votes[agent] = 'accept';
      proposals[agent] = findMiddleGround(previousRound.proposals);
    } else if (agreeableness > 0.4) {
      // Medium agreeableness - counter with modified proposal
      votes[agent] = 'counter';
      proposals[agent] = modifyProposal(
        conflict.positions[agent],
        previousRound.proposals,
        0.5
      );
    } else {
      // Low agreeableness - stick to position
      votes[agent] = 'reject';
      proposals[agent] = conflict.positions[agent];
    }
  });

  return {
    round: roundNumber,
    proposals,
    votes,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check if all agents have reached consensus
 */
function hasConsensus(round: NegotiationRound): boolean {
  const votes = Object.values(round.votes);
  return votes.every((v) => v === 'accept');
}

/**
 * Check if majority agrees (>50%)
 */
function hasMajority(round: NegotiationRound): boolean {
  const votes = Object.values(round.votes);
  const acceptVotes = votes.filter((v) => v === 'accept').length;
  return acceptVotes > votes.length / 2;
}

/**
 * Extract consensus decision
 */
function extractConsensus(round: NegotiationRound): unknown {
  // Return first proposal (all should be similar if consensus)
  return Object.values(round.proposals)[0];
}

/**
 * Extract majority decision
 */
function extractMajority(round: NegotiationRound): unknown {
  const proposals = Object.entries(round.proposals);
  const votes = Object.entries(round.votes);

  // Find proposals with 'accept' votes
  const acceptedProposals = proposals.filter(([agent]) => {
    const vote = votes.find(([a]) => a === agent)?.[1];
    return vote === 'accept';
  });

  // Return most common accepted proposal
  return acceptedProposals[0]?.[1] || Object.values(round.proposals)[0];
}

/**
 * Coordinator makes final decision when no consensus
 */
function coordinatorOverride(
  conflict: Conflict,
  rounds: NegotiationRound[]
): unknown {
  const latestRound = rounds[rounds.length - 1];

  // Coordinator prioritizes based on conflict type
  switch (conflict.type) {
    case 'timing_conflict':
      // Prefer earlier timing (more conservative)
      return findEarliestTiming(latestRound.proposals);

    case 'priority_conflict':
      // Prefer higher priority
      return findHighestPriority(latestRound.proposals);

    case 'approach_conflict':
      // Prefer most conservative approach
      return findMostConservativeApproach(latestRound.proposals);

    case 'resource_conflict':
      // Distribute resources fairly
      return distributeResources(latestRound.proposals);

    case 'policy_conflict':
      // Prefer stricter policy
      return findStricterPolicy(latestRound.proposals);

    default:
      // Default: use first proposal
      return Object.values(latestRound.proposals)[0];
  }
}

/**
 * Find middle ground between proposals
 */
function findMiddleGround(proposals: Record<AgentRole, unknown>): unknown {
  // Simple average for numeric values
  const values = Object.values(proposals);

  if (typeof values[0] === 'number') {
    const sum = (values as number[]).reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  // For non-numeric, return first value
  return values[0];
}

/**
 * Modify proposal towards compromise
 */
function modifyProposal(
  original: unknown,
  others: Record<AgentRole, unknown>,
  compromiseRatio: number
): unknown {
  if (typeof original === 'number') {
    const othersAvg = findMiddleGround(others) as number;
    return original * (1 - compromiseRatio) + othersAvg * compromiseRatio;
  }

  return original;
}

/**
 * Helper: Find earliest timing from proposals
 */
function findEarliestTiming(proposals: Record<AgentRole, unknown>): unknown {
  const timings = Object.values(proposals).filter((p) => typeof p === 'object' && p !== null);
  // Simplified - would parse dates in real implementation
  return timings[0];
}

/**
 * Helper: Find highest priority
 */
function findHighestPriority(proposals: Record<AgentRole, unknown>): unknown {
  const priorities = Object.values(proposals) as number[];
  return Math.max(...priorities);
}

/**
 * Helper: Find most conservative approach
 */
function findMostConservativeApproach(proposals: Record<AgentRole, unknown>): unknown {
  // Return first proposal (simplified)
  return Object.values(proposals)[0];
}

/**
 * Helper: Distribute resources fairly
 */
function distributeResources(proposals: Record<AgentRole, unknown>): unknown {
  // Equal distribution (simplified)
  return findMiddleGround(proposals);
}

/**
 * Helper: Find stricter policy
 */
function findStricterPolicy(proposals: Record<AgentRole, unknown>): unknown {
  // Return first proposal (simplified - would compare policy strictness)
  return Object.values(proposals)[0];
}

/**
 * Create a conflict from agent disagreement
 */
export function createConflict(
  type: ConflictType,
  agents: AgentRole[],
  positions: Record<AgentRole, unknown>,
  context: Record<string, unknown>
): Conflict {
  // Determine severity based on number of agents and type
  let severity: Conflict['severity'] = 'medium';

  if (type === 'policy_conflict') severity = 'high';
  if (agents.length > 3) severity = 'high';
  if (type === 'resource_conflict' && agents.length > 2) severity = 'critical';

  return {
    id: `conflict_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    type,
    agents,
    positions,
    severity,
    description: `${type} between ${agents.join(', ')}`,
    context,
  };
}

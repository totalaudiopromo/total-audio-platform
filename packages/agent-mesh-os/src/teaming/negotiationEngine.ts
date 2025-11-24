/**
 * Negotiation Engine
 * Facilitate agent-to-agent negotiations and consensus building
 */

import { createClient } from '@total-audio/core-db/server';
import Anthropic from '@anthropic-ai/sdk';
import type { Negotiation } from '../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Start a negotiation
 */
export async function startNegotiation(
  teamId: string,
  topic: string,
  initialPositions: Record<string, any>,
  workspaceId: string
): Promise<Negotiation> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_negotiations')
    .insert({
      team_id: teamId,
      topic,
      initial_positions: initialPositions,
      conversation: [],
      status: 'in_progress',
      workspace_id: workspaceId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Add conversation turn to negotiation
 */
export async function addNegotiationTurn(
  negotiationId: string,
  agent: string,
  message: string,
  position: any
): Promise<void> {
  const supabase = createClient();

  const { data: negotiation } = await supabase
    .from('mesh_negotiations')
    .select('conversation')
    .eq('id', negotiationId)
    .single();

  if (!negotiation) return;

  const conversation = [
    ...(negotiation.conversation || []),
    {
      agent,
      message,
      position,
      timestamp: new Date().toISOString(),
    },
  ];

  await supabase
    .from('mesh_negotiations')
    .update({ conversation })
    .eq('id', negotiationId);
}

/**
 * Attempt to converge to consensus using AI
 */
export async function convergeToConsensus(negotiationId: string): Promise<{
  converged: boolean;
  outcome?: any;
  reasoning: string;
}> {
  const supabase = createClient();

  const { data: negotiation } = await supabase
    .from('mesh_negotiations')
    .select('*')
    .eq('id', negotiationId)
    .single();

  if (!negotiation) {
    return { converged: false, reasoning: 'Negotiation not found' };
  }

  // Use AI to analyze positions and attempt consensus
  const prompt = `Analyze this multi-agent negotiation and determine if consensus can be reached:

Topic: ${negotiation.topic}

Initial Positions:
${JSON.stringify(negotiation.initial_positions, null, 2)}

Conversation:
${JSON.stringify(negotiation.conversation, null, 2)}

Determine:
1. Can consensus be reached?
2. If yes, what is the consensus position?
3. If no, what are the key blockers?

Respond in JSON format:
{
  "converged": boolean,
  "outcome": object or null,
  "reasoning": "string",
  "blockers": ["string"] or null
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = message.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    return { converged: false, reasoning: 'AI analysis failed' };
  }

  const analysis = JSON.parse(textContent.text);

  if (analysis.converged) {
    await supabase
      .from('mesh_negotiations')
      .update({
        outcome: analysis.outcome,
        status: 'converged',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', negotiationId);
  }

  return analysis;
}

/**
 * Escalate negotiation (no consensus possible)
 */
export async function escalateNegotiation(
  negotiationId: string,
  reason: string
): Promise<void> {
  const supabase = createClient();

  await supabase
    .from('mesh_negotiations')
    .update({
      status: 'escalated',
      outcome: { escalated: true, reason },
      resolved_at: new Date().toISOString(),
    })
    .eq('id', negotiationId);
}

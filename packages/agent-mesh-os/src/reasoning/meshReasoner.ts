/**
 * Mesh Reasoner
 * Cross-system reasoning and opportunity detection
 */

import { createClient } from '@total-audio/core-db/server';
import Anthropic from '@anthropic-ai/sdk';
import type { MeshContext, Opportunity, Conflict } from '../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Run a mesh reasoning cycle
 */
export async function runReasoningCycle(
  context: MeshContext,
  cycleType: 'opportunity' | 'conflict' | 'routine' = 'routine'
): Promise<{
  opportunities: Opportunity[];
  conflicts: Conflict[];
  recommendations: any[];
  reasoning: string;
}> {
  const prompt = buildReasoningPrompt(context, cycleType);

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const textContent = message.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('AI reasoning failed');
  }

  const result = JSON.parse(textContent.text);

  // Log reasoning cycle
  await logReasoningCycle(context.workspaceId, cycleType, context, result);

  return result;
}

/**
 * Build reasoning prompt
 */
function buildReasoningPrompt(context: MeshContext, cycleType: string): string {
  return `You are the Agent Mesh OS - a meta-coordination layer that reasons across multiple AI subsystems.

Context from all systems:
${JSON.stringify(context, null, 2)}

Your task:
1. Identify cross-system opportunities (PR + Creative + Coaching synergies)
2. Detect conflicts or misalignments between systems
3. Generate recommendations for each subsystem

Focus: ${cycleType}

Respond in JSON format:
{
  "opportunities": [
    {
      "type": "pr" | "creative" | "coaching" | "branding" | "timing",
      "source": "which system(s)",
      "confidence": 0.0-1.0,
      "description": "string",
      "recommendations": ["actionable steps"],
      "context": {}
    }
  ],
  "conflicts": [
    {
      "type": "identity_mismatch" | "timing_conflict" | "priority_clash",
      "agents": ["agent names"],
      "positions": {},
      "severity": "low" | "medium" | "high"
    }
  ],
  "recommendations": [
    {
      "target_system": "autopilot" | "coachos" | "cis" | "identity" | "dashboard",
      "action_type": "suggest" | "alert" | "inform",
      "payload": {}
    }
  ],
  "reasoning": "your cross-system analysis"
}`;
}

/**
 * Log reasoning cycle to database
 */
async function logReasoningCycle(
  workspaceId: string,
  cycleType: string,
  inputs: any,
  outputs: any
): Promise<void> {
  const supabase = createClient();

  await supabase.from('mesh_reasoning_log').insert({
    cycle_type: cycleType,
    inputs,
    reasoning: outputs.reasoning || '',
    outputs,
    workspace_id: workspaceId,
  });
}

/**
 * Get reasoning history
 */
export async function getReasoningHistory(
  workspaceId: string,
  limit: number = 20
): Promise<any[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('mesh_reasoning_log')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

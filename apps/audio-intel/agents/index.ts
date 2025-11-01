/**
 * Total Audio Agent Layer
 * Main export file for all agents and utilities
 */

// Core framework
export { BaseAgent } from './core/BaseAgent';
export { AgentRegistry, Agents } from './core/AgentRegistry';
export type {
  AgentManifest,
  AgentPayload,
  AgentResult,
  AgentMetrics,
  SubAgentResult,
  AgentLog,
} from './core/AgentTypes';

// Individual agents
export { IntelAgent } from './intel/IntelAgent';
export type { IntelAgentPayload } from './intel/IntelAgent';

export { PitchAgent } from './pitch/PitchAgent';
export type { PitchAgentPayload } from './pitch/PitchAgent';

export { TrackerAgent } from './tracker/TrackerAgent';
export type { TrackerAgentPayload } from './tracker/TrackerAgent';

export { InsightAgent } from './insight/InsightAgent';
export type { InsightAgentPayload } from './insight/InsightAgent';

export { VoiceGuardAgent } from './voiceguard/VoiceGuardAgent';
export type { VoiceGuardPayload, VoiceGuardResult } from './voiceguard/VoiceGuardAgent';

// Sub-agents (optional exports for advanced usage)
export { ContactFinder } from './intel/subagents/ContactFinder';
export { LabelMatcher } from './intel/subagents/LabelMatcher';
export { EnrichmentValidator } from './intel/subagents/EnrichmentValidator';

export { PitchFormatter } from './pitch/subagents/PitchFormatter';
export { ToneChecker } from './pitch/subagents/ToneChecker';
export { FollowUpWriter } from './pitch/subagents/FollowUpWriter';

export { SubmissionLogger } from './tracker/subagents/SubmissionLogger';
export { AnalyticsSummariser } from './tracker/subagents/AnalyticsSummariser';
export { ReminderAgent } from './tracker/subagents/ReminderAgent';

/**
 * Quick Start Examples:
 *
 * // Import registry
 * import { Agents } from '@/agents'
 *
 * // Execute IntelAgent
 * const result = await Agents.intel.execute({
 *   artist: 'Artist Name',
 *   genre: 'electronic'
 * })
 *
 * // Execute PitchAgent
 * const pitch = await Agents.pitch.execute({
 *   mode: 'draft',
 *   artist: 'Artist Name',
 *   release: 'Release Title'
 * })
 *
 * // Execute VoiceGuardAgent
 * const voiceCheck = await Agents.voiceguard.execute({
 *   text: 'Content to validate',
 *   autoFix: true
 * })
 *
 * // Get agent stats
 * import { AgentRegistry } from '@/agents'
 * const stats = AgentRegistry.getStats('intel')
 */

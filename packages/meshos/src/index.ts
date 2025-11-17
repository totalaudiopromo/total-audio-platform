/**
 * MeshOS - Universal Multi-Agent Coordination Layer
 * Entry point for @total-audio/meshos package
 */

// Types
export * from './types';

// Utilities
export * from './utils/logger';
export * from './utils/time';
export * from './utils/math';

// Engines
export { PolicyEngine } from './engines/policyEngine';
export { MessageRouter } from './engines/messageRouter';
export { PlanningEngine } from './engines/planningEngine';
export { NegotiationEngine } from './engines/negotiationEngine';
export { DriftEngine } from './engines/driftEngine';
export { GlobalContextEngine } from './engines/globalContextEngine';
export { InsightRouter } from './engines/insightRouter';

// Adapters
export { BaseAdapter } from './adapters/baseAdapter';
export { AutopilotAdapter } from './adapters/autopilotAdapter';
export { MalAdapter } from './adapters/malAdapter';
export { CoachAdapter } from './adapters/coachAdapter';
export { TalentAdapter } from './adapters/talentAdapter';
export { ScenesAdapter } from './adapters/scenesAdapter';
export { MigAdapter } from './adapters/migAdapter';
export { CmgAdapter } from './adapters/cmgAdapter';
export { FusionAdapter } from './adapters/fusionAdapter';
export { IdentityKernelAdapter } from './adapters/identityKernelAdapter';
export { RcfAdapter } from './adapters/rcfAdapter';

// Stores
export { MeshMessageStore } from './stores/meshMessageStore';
export { MeshStateStore } from './stores/meshStateStore';
export { MeshPlanStore } from './stores/meshPlanStore';
export { MeshNegotiationStore } from './stores/meshNegotiationStore';
export { MeshInsightRouteStore } from './stores/meshInsightRouteStore';

// Orchestrator
export { MeshOrchestrator } from './orchestrator/meshOrchestrator';

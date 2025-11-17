/**
 * Agent Mesh OS Configuration
 * Central configuration for the multi-agent coordination layer
 */

export const MESH_CONFIG = {
  // Agent profiles directory
  agentProfilesDir: './agentProfiles',

  // Memory settings
  memory: {
    episodicRetentionDays: 7,
    workingMemoryLimit: 1000,
    sharedMemoryLimit: 5000,
  },

  // Messaging settings
  messaging: {
    maxMessageSize: 100000, // bytes
    messageRetentionDays: 30,
    broadcastRateLimit: 10, // per minute
  },

  // Team settings
  teaming: {
    maxTeamSize: 5,
    defaultTeamLifetime: 3600, // seconds (1 hour)
    negotiationTimeout: 300, // seconds (5 minutes)
  },

  // Reasoning settings
  reasoning: {
    cycleInterval: 60, // seconds
    opportunityThreshold: 0.7,
    conflictThreshold: 0.5,
  },

  // Execution settings
  execution: {
    actionTimeout: 30, // seconds
    maxConcurrentActions: 10,
    guardrailsEnabled: true,
  },
} as const;

export type MeshConfig = typeof MESH_CONFIG;

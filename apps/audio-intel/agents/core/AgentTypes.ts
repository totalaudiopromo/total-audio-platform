/**
 * Agent Types & Interfaces
 * Common type definitions for the Total Audio Agent Layer
 */

export interface AgentManifest {
  name: string
  version: string
  description: string
  capabilities: string[]
  subAgents?: string[]
  dependencies?: string[]
}

export interface AgentPayload {
  [key: string]: any
}

export interface AgentResult {
  success: boolean
  data?: any
  error?: string
  metrics?: {
    latency_ms: number
    timestamp: string
  }
}

export interface AgentMetrics {
  runs: number
  success: number
  failures: number
  latency: number[]
  lastRun?: string
}

export interface SubAgentResult {
  success: boolean
  data?: any
  error?: string
}

/**
 * Agent Log Structure for Supabase
 */
export interface AgentLog {
  id?: string
  agent_name: string
  success: boolean
  latency_ms: number
  metadata: Record<string, any>
  created_at?: string
}

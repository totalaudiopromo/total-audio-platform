/**
 * BaseAgent - Core Agent Framework
 * All Total Audio agents extend this class for consistent logging, metrics, and error handling
 */

import type { AgentPayload, AgentResult, AgentMetrics } from './AgentTypes'

export abstract class BaseAgent {
  name: string
  version: string
  metrics: AgentMetrics

  constructor(name: string, version = '1.0.0') {
    this.name = name
    this.version = version
    this.metrics = {
      runs: 0,
      success: 0,
      failures: 0,
      latency: [],
    }
  }

  /**
   * Main execution method - must be implemented by each agent
   */
  abstract run(payload: AgentPayload): Promise<AgentResult>

  /**
   * Execute agent with automatic metrics tracking
   */
  async execute(payload: AgentPayload): Promise<AgentResult> {
    const start = performance.now()
    this.metrics.runs++

    try {
      this.log('Starting execution', { payload })
      const result = await this.run(payload)

      const latency = Math.round(performance.now() - start)
      this.recordMetric('latency', latency)

      if (result.success) {
        this.metrics.success++
        this.log('Execution succeeded', { latency })
      } else {
        this.metrics.failures++
        this.log('Execution failed', { error: result.error })
      }

      // Record to Supabase (async, don't block)
      this.recordToSupabase(result, latency).catch(err =>
        console.error(`[${this.name}] Failed to log to Supabase:`, err)
      )

      return {
        ...result,
        metrics: {
          latency_ms: latency,
          timestamp: new Date().toISOString(),
        },
      }
    } catch (error) {
      this.metrics.failures++
      const latency = Math.round(performance.now() - start)
      this.log('Execution threw error', { error })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metrics: {
          latency_ms: latency,
          timestamp: new Date().toISOString(),
        },
      }
    }
  }

  /**
   * Logging helper with agent name prefix
   */
  protected log(event: string, data?: any) {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${this.name}] ${event}`, data || '')
  }

  /**
   * Record metric value
   */
  protected recordMetric(metric: keyof AgentMetrics, value: number) {
    if (metric === 'latency') {
      this.metrics.latency.push(value)
      // Keep only last 100 latency measurements
      if (this.metrics.latency.length > 100) {
        this.metrics.latency.shift()
      }
    }
    this.metrics.lastRun = new Date().toISOString()
  }

  /**
   * Get agent statistics
   */
  getStats() {
    const avgLatency = this.metrics.latency.length > 0
      ? Math.round(
          this.metrics.latency.reduce((a, b) => a + b, 0) / this.metrics.latency.length
        )
      : 0

    return {
      name: this.name,
      version: this.version,
      runs: this.metrics.runs,
      success: this.metrics.success,
      failures: this.metrics.failures,
      successRate: this.metrics.runs > 0
        ? Math.round((this.metrics.success / this.metrics.runs) * 100)
        : 0,
      avgLatency,
      lastRun: this.metrics.lastRun,
    }
  }

  /**
   * Record execution to Supabase for analytics
   */
  private async recordToSupabase(result: AgentResult, latency: number) {
    // Import dynamically to avoid circular dependencies
    const { createClient } = await import('@supabase/supabase-js')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      this.log('Supabase credentials missing, skipping log')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    await supabase.from('agent_logs').insert({
      agent_name: this.name,
      success: result.success,
      latency_ms: latency,
      metadata: {
        version: this.version,
        error: result.error,
        dataKeys: result.data ? Object.keys(result.data) : [],
      },
    })
  }
}

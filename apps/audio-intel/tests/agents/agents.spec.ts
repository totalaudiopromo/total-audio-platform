/**
 * Agent Layer Test Suite
 * Comprehensive tests for all Total Audio agents
 */

import { describe, it, expect, beforeAll } from '@jest/globals'
import { AgentRegistry } from '../../agents/core/AgentRegistry'
import { IntelAgent } from '../../agents/intel/IntelAgent'
import { PitchAgent } from '../../agents/pitch/PitchAgent'
import { TrackerAgent } from '../../agents/tracker/TrackerAgent'
import { InsightAgent } from '../../agents/insight/InsightAgent'
import { VoiceGuardAgent } from '../../agents/voiceguard/VoiceGuardAgent'

describe('Agent Layer', () => {
  beforeAll(() => {
    AgentRegistry.init()
  })

  describe('AgentRegistry', () => {
    it('should initialise with all agents', () => {
      const agents = AgentRegistry.list()
      expect(agents).toContain('intel')
      expect(agents).toContain('pitch')
      expect(agents).toContain('tracker')
      expect(agents).toContain('insight')
      expect(agents).toContain('voiceguard')
      expect(agents.length).toBe(5)
    })

    it('should retrieve agents by name', () => {
      const intel = AgentRegistry.get('intel')
      expect(intel).toBeInstanceOf(IntelAgent)

      const pitch = AgentRegistry.get('pitch')
      expect(pitch).toBeInstanceOf(PitchAgent)
    })

    it('should return undefined for non-existent agents', () => {
      const nonExistent = AgentRegistry.get('nonexistent')
      expect(nonExistent).toBeUndefined()
    })

    it('should provide agent manifests', () => {
      const manifest = AgentRegistry.getManifest('intel')
      expect(manifest).toBeDefined()
      expect(manifest?.name).toBe('IntelAgent')
      expect(manifest?.capabilities).toContain('contact_discovery')
    })

    it('should pass health check', async () => {
      const health = await AgentRegistry.healthCheck()
      expect(health.healthy).toBe(true)
      expect(health.agents.intel.status).toBe('ok')
      expect(health.agents.pitch.status).toBe('ok')
      expect(health.agents.tracker.status).toBe('ok')
      expect(health.agents.insight.status).toBe('ok')
      expect(health.agents.voiceguard.status).toBe('ok')
    })
  })

  describe('IntelAgent', () => {
    it('should execute enrichment successfully', async () => {
      const agent = new IntelAgent()
      const result = await agent.execute({
        artist: 'Test Artist',
        genre: 'electronic',
      })

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('contacts')
      expect(result.data).toHaveProperty('validation')
      expect(result.metrics).toBeDefined()
      expect(result.metrics?.latency_ms).toBeGreaterThan(0)
    })

    it('should find contacts for artist', async () => {
      const agent = new IntelAgent()
      const result = await agent.execute({
        artist: 'sadact',
        genre: 'house',
        region: 'UK',
      })

      expect(result.success).toBe(true)
      expect(result.data.summary).toBeDefined()
      expect(result.data.summary.contactsFound).toBeGreaterThanOrEqual(0)
    })

    it('should match labels when release provided', async () => {
      const agent = new IntelAgent()
      const result = await agent.execute({
        artist: 'Test Artist',
        release: 'Test Release',
        includeLabels: true,
      })

      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('labels')
    })

    it('should validate enrichment quality', async () => {
      const agent = new IntelAgent()
      const result = await agent.execute({
        artist: 'Test Artist',
      })

      expect(result.success).toBe(true)
      expect(result.data.validation).toBeDefined()
      expect(result.data.validation.score).toBeGreaterThanOrEqual(0)
      expect(result.data.validation.score).toBeLessThanOrEqual(1)
    })
  })

  describe('PitchAgent', () => {
    it('should draft a pitch successfully', async () => {
      const agent = new PitchAgent()
      const result = await agent.execute({
        mode: 'draft',
        artist: 'Test Artist',
        release: 'Test Release',
        genre: 'electronic',
      })

      expect(result.success).toBe(true)
      expect(result.data.pitch).toBeDefined()
      expect(result.data.pitch.fullText).toBeTruthy()
      expect(result.data.toneCheck).toBeDefined()
    })

    it('should check tone and flag issues', async () => {
      const agent = new PitchAgent()
      const result = await agent.execute({
        mode: 'draft',
        artist: 'Revolutionary AI-Powered Artist',
        release: 'Game-Changing Release',
        strictToneCheck: true,
      })

      expect(result.success).toBe(true)
      expect(result.data.toneCheck.issues.length).toBeGreaterThan(0)
      expect(result.data.readyToSend).toBe(false)
    })

    it('should generate follow-up emails', async () => {
      const agent = new PitchAgent()
      const result = await agent.execute({
        mode: 'followup',
        artist: 'Test Artist',
        release: 'Test Release',
        originalPitchDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        followUpNumber: 1,
      })

      expect(result.success).toBe(true)
      expect(result.data.followUp).toBeDefined()
      expect(result.data.daysSinceOriginal).toBeGreaterThanOrEqual(9)
    })

    it('should reject follow-ups that are too soon', async () => {
      const agent = new PitchAgent()
      const result = await agent.execute({
        mode: 'followup',
        artist: 'Test Artist',
        release: 'Test Release',
        originalPitchDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        followUpNumber: 1,
      })

      expect(result.success).toBe(true)
      expect(result.data.shouldSend).toBe(false)
    })
  })

  describe('TrackerAgent', () => {
    it('should log submissions', async () => {
      const agent = new TrackerAgent()
      const result = await agent.execute({
        mode: 'log',
        campaignId: 'test-campaign',
        submission: {
          contactId: 'contact-1',
          contactName: 'Test Contact',
          submissionDate: new Date().toISOString(),
          pitchType: 'initial',
        },
      })

      expect(result.success).toBe(true)
      expect(result.data.submission).toBeDefined()
    })

    it('should generate campaign analytics', async () => {
      const agent = new TrackerAgent()
      const result = await agent.execute({
        mode: 'analytics',
        campaignId: 'test-campaign',
      })

      expect(result.success).toBe(true)
      expect(result.data.metrics).toBeDefined()
      expect(result.data.rates).toBeDefined()
      expect(result.data.insights).toBeDefined()
    })

    it('should check for reminders', async () => {
      const agent = new TrackerAgent()
      const result = await agent.execute({
        mode: 'reminders',
        campaignId: 'test-campaign',
      })

      expect(result.success).toBe(true)
      expect(result.data.reminders).toBeDefined()
      expect(Array.isArray(result.data.reminders)).toBe(true)
    })

    it('should update submission status', async () => {
      const agent = new TrackerAgent()
      const result = await agent.execute({
        mode: 'update_status',
        campaignId: 'test-campaign',
        submissionId: 'sub-123',
        status: 'opened',
      })

      expect(result.success).toBe(true)
      expect(result.data.updated).toBeDefined()
    })
  })

  describe('InsightAgent', () => {
    it('should generate campaign insights', async () => {
      const agent = new InsightAgent()
      const result = await agent.execute({
        campaignId: 'test-campaign',
      })

      expect(result.success).toBe(true)
      expect(result.data.insights).toBeDefined()
      expect(Array.isArray(result.data.insights)).toBe(true)
      expect(result.data.summary).toBeDefined()
    })

    it('should include recommendations by default', async () => {
      const agent = new InsightAgent()
      const result = await agent.execute({
        campaignId: 'test-campaign',
      })

      expect(result.success).toBe(true)
      expect(result.data.recommendations).toBeDefined()
      expect(Array.isArray(result.data.recommendations)).toBe(true)
    })

    it('should generate comparison when requested', async () => {
      const agent = new InsightAgent()
      const result = await agent.execute({
        campaignId: 'test-campaign',
        includeComparison: true,
      })

      expect(result.success).toBe(true)
      expect(result.data.comparison).toBeDefined()
    })
  })

  describe('VoiceGuardAgent', () => {
    it('should pass clean text', async () => {
      const agent = new VoiceGuardAgent()
      const result = await agent.execute({
        text: "Hi there, I'm sharing my new release with you. Let me know what you think.",
      })

      expect(result.success).toBe(true)
      expect(result.data.passed).toBe(true)
      expect(result.data.score).toBeGreaterThan(0.7)
    })

    it('should flag corporate speak', async () => {
      const agent = new VoiceGuardAgent()
      const result = await agent.execute({
        text: "We're excited to announce our cutting-edge, revolutionary solution that will leverage AI-powered synergy.",
      })

      expect(result.success).toBe(true)
      expect(result.data.passed).toBe(false)
      expect(result.data.issues.length).toBeGreaterThan(0)
      expect(result.data.issues.some(i => i.type === 'corporate_speak')).toBe(true)
    })

    it('should flag AI buzzwords', async () => {
      const agent = new VoiceGuardAgent()
      const result = await agent.execute({
        text: 'Our AI-powered, next-generation platform uses machine learning.',
        strictMode: true,
      })

      expect(result.success).toBe(true)
      expect(result.data.passed).toBe(false)
      expect(result.data.issues.some(i => i.type === 'ai_buzzword')).toBe(true)
    })

    it('should flag inauthentic marketing speak', async () => {
      const agent = new VoiceGuardAgent()
      const result = await agent.execute({
        text: "We're thrilled to share and excited to announce our proud introduction.",
      })

      expect(result.success).toBe(true)
      expect(result.data.passed).toBe(false)
      expect(result.data.issues.some(i => i.type === 'inauthentic')).toBe(true)
    })

    it('should auto-fix issues when requested', async () => {
      const agent = new VoiceGuardAgent()
      const result = await agent.execute({
        text: "We're excited to announce our cutting-edge solution.",
        autoFix: true,
      })

      expect(result.success).toBe(true)
      expect(result.data.fixedText).toBeDefined()
      expect(result.data.fixedText).not.toContain('cutting-edge')
      expect(result.data.fixedText).not.toContain('excited to announce')
    })
  })

  describe('Agent Metrics', () => {
    it('should track execution metrics', async () => {
      const agent = new VoiceGuardAgent()

      // Execute multiple times
      await agent.execute({ text: 'Test 1' })
      await agent.execute({ text: 'Test 2' })

      const stats = agent.getStats()
      expect(stats.runs).toBeGreaterThanOrEqual(2)
      expect(stats.avgLatency).toBeGreaterThan(0)
      expect(stats.successRate).toBeGreaterThan(0)
    })
  })
})

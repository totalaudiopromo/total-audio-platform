/**
 * PitchAgent - Pitch Drafting & Optimisation
 * Orchestrates pitch creation, tone checking, and follow-up management
 */

import { BaseAgent } from '../core/BaseAgent'
import type { AgentPayload, AgentResult } from '../core/AgentTypes'
import { PitchFormatter } from './subagents/PitchFormatter'
import { ToneChecker } from './subagents/ToneChecker'
import { FollowUpWriter } from './subagents/FollowUpWriter'

export interface PitchAgentPayload extends AgentPayload {
  mode: 'draft' | 'followup'
  artist: string
  release: string
  contactName?: string
  contactOrganisation?: string
  genre?: string
  releaseDate?: string
  streamingLinks?: Record<string, string>
  pressQuotes?: string[]
  // For follow-ups
  originalPitchDate?: string
  followUpNumber?: number
  strictToneCheck?: boolean
}

export class PitchAgent extends BaseAgent {
  constructor() {
    super('PitchAgent', '1.0.0')
  }

  async run(payload: PitchAgentPayload): Promise<AgentResult> {
    this.log('Starting pitch generation', {
      mode: payload.mode,
      artist: payload.artist,
    })

    try {
      if (payload.mode === 'draft') {
        return await this.handleDraftMode(payload)
      } else if (payload.mode === 'followup') {
        return await this.handleFollowUpMode(payload)
      } else {
        return {
          success: false,
          error: `Unknown mode: ${payload.mode}. Use 'draft' or 'followup'`,
        }
      }
    } catch (error) {
      this.log('Pitch generation error', { error })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Pitch generation failed',
      }
    }
  }

  /**
   * Handle draft pitch creation
   */
  private async handleDraftMode(payload: PitchAgentPayload): Promise<AgentResult> {
    // Step 1: Format pitch
    const formatResult = await PitchFormatter.format({
      artist: payload.artist,
      release: payload.release,
      contactName: payload.contactName,
      contactOrganisation: payload.contactOrganisation,
      genre: payload.genre,
      releaseDate: payload.releaseDate,
      streamingLinks: payload.streamingLinks,
      pressQuotes: payload.pressQuotes,
    })

    if (!formatResult.success) {
      return {
        success: false,
        error: `Pitch formatting failed: ${formatResult.error}`,
      }
    }

    const formattedPitch = formatResult.data
    this.log('Pitch formatted', { length: formattedPitch.fullText.length })

    // Step 2: Check tone
    const toneResult = await ToneChecker.check({
      text: formattedPitch.fullText,
      strictMode: payload.strictToneCheck,
    })

    if (!toneResult.success) {
      return {
        success: false,
        error: `Tone check failed: ${toneResult.error}`,
      }
    }

    const toneCheck = toneResult.data
    this.log('Tone checked', {
      score: toneCheck.score,
      issues: toneCheck.issues.length,
    })

    // Return draft with tone analysis
    return {
      success: true,
      data: {
        pitch: formattedPitch,
        toneCheck,
        readyToSend: toneCheck.isValid,
        warnings: toneCheck.issues.length > 0 ? toneCheck.issues : undefined,
      },
    }
  }

  /**
   * Handle follow-up generation
   */
  private async handleFollowUpMode(payload: PitchAgentPayload): Promise<AgentResult> {
    if (!payload.originalPitchDate) {
      return {
        success: false,
        error: 'originalPitchDate required for follow-up mode',
      }
    }

    // Calculate days since original pitch
    const originalDate = new Date(payload.originalPitchDate)
    const now = new Date()
    const daysSince = Math.floor(
      (now.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Generate follow-up
    const followUpResult = await FollowUpWriter.write({
      artist: payload.artist,
      release: payload.release,
      contactName: payload.contactName,
      originalPitchDate: payload.originalPitchDate,
      daysSinceOriginal: daysSince,
      followUpNumber: payload.followUpNumber || 1,
    })

    if (!followUpResult.success) {
      return {
        success: false,
        error: `Follow-up generation failed: ${followUpResult.error}`,
      }
    }

    const followUp = followUpResult.data

    // If follow-up shouldn't be sent, return early
    if (!followUp.shouldSend) {
      return {
        success: true,
        data: {
          shouldSend: false,
          reasoning: followUp.reasoning,
        },
      }
    }

    // Check tone of follow-up
    const toneResult = await ToneChecker.check({
      text: followUp.body,
      strictMode: payload.strictToneCheck,
    })

    const toneCheck = toneResult.data

    return {
      success: true,
      data: {
        followUp,
        toneCheck,
        readyToSend: toneCheck?.isValid ?? true,
        daysSinceOriginal: daysSince,
      },
    }
  }
}
